import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useTheme } from '@/themes/theme';
import API_BASE_URL from "@/config/config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditProfile from '../components/profile/editProfile';
import OfflineBanner from '@/components/offline/safeOfflineBanner';
import ChangePasswordForm from '@/components/profile/changePassword';

interface UserData{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    image_path: string | null;
}

interface MenuItemProps {
    label: string;
    icon: React.ReactNode;
    onPress: () => void;
}

const MenuItem = ({ label, icon, onPress }: MenuItemProps) => {
    const theme = useTheme();
    return (
      <TouchableOpacity style={styles.item} onPress={onPress}>
        <View style={styles.row}>
          {icon}
          <Text style={styles.label}>{label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="gray" />
      </TouchableOpacity>
    );
};
 


export default function ProfileScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);

    const [editMode, setEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const fetchUserData = async () => {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUserId = await AsyncStorage.getItem("userId");

        if (storedToken) {
            setToken(storedToken);
        }
        try {
            const response = await fetch(`${API_BASE_URL}/users/${storedUserId}/info`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedToken}`
                },
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "User Data could not be loaded.");
            }
    
            setUserData(data);
        } catch (error) {
            console.error('❌ Error loading user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserData();
        setRefreshing(false);
    };
      

    const handleSignOut = () => {
        // logout logic tu
    };

    const theme = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);
    const isBW = theme.id === 'blackWhiteTheme';

    return (
        <SafeAreaView style={styles.safeArea}>
            <OfflineBanner />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.header}>
                    <Image
                        source={
                            userData && userData.image_path
                            ? {
                                uri: `${API_BASE_URL}/uploads/${userData.image_path}`,
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                                }
                            : require("@/assets/images/default-profile.jpg")
                        }
                        style={styles.avatar}
                        onError={(error) => {
                            console.log("Image failed to load:", error.nativeEvent.error);
                        }}
                    />
                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>
                            {userData ? `${userData.first_name} ${userData.last_name}`: "Loading..."}
                        </Text>
                        <Text style={styles.email}>
                            {userData ? `${userData.email}`: "Loading..."}
                        </Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <MenuItem
                        label="Edit profile"
                        icon={<Feather name="edit" size={20} color={theme.text} />}
                        onPress={() => {
                                if(!editMode) setEditMode(true)
                                else if(editMode) setEditMode(false)
                            }
                        }
                    />
                    {editMode && userData && token && (
                        <EditProfile
                            user={userData}
                            token={token}
                            onDone={() => {
                                setEditMode(false);
                                fetchUserData(); 
                            }}
                        />
                    )}

                    <MenuItem
                        label="Change Password"
                        icon={<MaterialCommunityIcons name="key" size={20} color={theme.text} />}
                        onPress={() => {
                                if(!showPassword) setShowPassword(true)
                                else if(showPassword) setShowPassword(false)
                            }
                        }
                    />
                    {showPassword && token && userData?.id && (
                        <ChangePasswordForm
                            token={token}
                            onDone={() => setShowPassword(false)}
                        />
                    )}



                    <MenuItem
                        label="Theme Mode"
                        icon={<MaterialIcons name="brightness-6" size={20} color={theme.text} />}
                        onPress={() => console.log("Open theme selector")}
                    />
                    <MenuItem
                        label="Sign Out"
                        icon={<Ionicons name="exit-outline" size={20} color={theme.text} />}
                        onPress={() => console.log("Log user out")}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (theme: ReturnType<typeof useTheme>) => {
    const isBW = theme.id === 'blackWhiteTheme';

    return StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: theme.background,
            paddingTop: Platform.OS === 'ios' ? 0 : 40,
        },
        header: {
            paddingTop: 60,
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatar: {
            width: 150,
            height: 150,
            borderRadius: '50%',
            marginBottom: 10,
        },
        nameContainer: {
            alignItems: 'center',
        },
        name: {
            fontSize: 20,
            fontWeight: "bold",
            color: theme.text,
        },
        email: {
            marginTop: 5,
            fontSize: 16,
            color: theme.text,
        },
        container: {
            backgroundColor: 'white',
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingBottom: 10,
            marginTop: 30,
          },
    });
};
const styles = StyleSheet.create({

    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderColor: '#eee',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
    },
});
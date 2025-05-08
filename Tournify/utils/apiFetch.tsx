// utils/apiFetch.ts
import { router } from 'expo-router';

export async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    try {
        const response = await fetch(input, init);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Fetch failed');
        }
        return await response.json();
    } catch (error: any) {
        console.error("Global fetch error:", error);
        router.replace({
            pathname: "/errorScreen",
            params: { message: error.message },
        });
        throw error; // optional, depending on use case
    }
}

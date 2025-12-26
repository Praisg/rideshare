import AsyncStorage from '@react-native-async-storage/async-storage';

const tokenCache: Record<string, string> = {};
const storageCache: Record<string, string> = {};

AsyncStorage.multiGet(['token-storage:access_token', 'token-storage:refresh_token']).then(
    (values) => {
        values.forEach(([key, value]) => {
            if (value) {
                const shortKey = key.replace('token-storage:', '');
                tokenCache[shortKey] = value;
            }
        });
    }
);

export const tokenStorage = {
    set: (key: string, value: string) => {
        tokenCache[key] = value;
        AsyncStorage.setItem(`token-storage:${key}`, value).catch(console.error);
    },
    getString: (key: string) => {
        return tokenCache[key] || null;
    },
    delete: (key: string) => {
        delete tokenCache[key];
        AsyncStorage.removeItem(`token-storage:${key}`).catch(console.error);
    },
    clearAll: () => {
        Object.keys(tokenCache).forEach(key => {
            delete tokenCache[key];
            AsyncStorage.removeItem(`token-storage:${key}`).catch(console.error);
        });
    },
};

export const storage = {
    set: (key: string, value: string) => {
        storageCache[key] = value;
        AsyncStorage.setItem(`my-app-storage:${key}`, value).catch(console.error);
    },
    getString: (key: string) => {
        return storageCache[key] || null;
    },
    delete: (key: string) => {
        delete storageCache[key];
        AsyncStorage.removeItem(`my-app-storage:${key}`).catch(console.error);
    },
};

export const mmkvStorage = {
    setItem: (key: string, value: string) => {
        storageCache[key] = value;
        AsyncStorage.setItem(key, value).catch(console.error);
    },
    getItem: (key: string) => {
        return storageCache[key] || null;
    },
    removeItem: (key: string) => {
        delete storageCache[key];
        AsyncStorage.removeItem(key).catch(console.error);
    },
};

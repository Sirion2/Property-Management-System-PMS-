import { Reset } from "carbon-icons-svelte";
import { writable } from "svelte/store";

function createUserStore() {

    const { subscribe, set, update } = writable(null);

    if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            set(JSON.parse(storedUser));
        }
    }

     return {
        subscribe, set: (user: any) => {
            localStorage.setItem('user', JSON.stringify(user));
            set(user);
        },
        reset: () => {
            localStorage.removeItem('user');
            set(null);
        }
     };
}

export const userStore = createUserStore();
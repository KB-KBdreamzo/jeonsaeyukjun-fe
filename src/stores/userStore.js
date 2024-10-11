import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        userId: 1, 
    }),
    actions: {
        setUserId(id) {
            this.userId = id; 
        },
        clearUser() {
            this.userId = null;
        },
    },
});

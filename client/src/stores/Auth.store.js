import axios from "../axios";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
    state() {
        return {
            accessToken: null,
            user: null,
        };
    },
    getters: {
        isUserLoggedIn(state) {
            return !!state.user && !!state.user.accessToken;
        },
    },
    actions: {
        setAccessToken(token) {
            this.accessToken = token;
        },
        logout() {
            this.accessToken = null;
            this.user = null;
            localStorage.removeItem("access-token");
            location.href = "http://localhost:8001/login";
        },
        async login(user) {
            try {
                const response = await axios.post("auth/login", user);
                console.log(response);
                if (response.data.success) {
                    this.user = response.data.user;
                    this.setAccessToken(response.data.accessToken);
                    localStorage.setItem("access-token", this.accessToken);
                    return this.user;
                }
            } catch (error) {
                console.log(error);
            }
        },

        async register(user) {
            try {
                const response = await axios.post("auth/register", user);
                console.log(response);

                if (response.data.success) {
                    const userData = response.data.user;
                    this.user = userData;
                    this.setAccessToken(response.data.accessToken);
                    localStorage.setItem("access-token", this.accessToken);
                    return { success: true, user: userData }; // Return user data on success
                } else {
                    console.log(response);
                    return { success: false, error: response.data.error };
                }
            } catch (error) {
                console.error(error);
                return { success: false, error: "An error occurred during registration." };
            }
        },
    },
});

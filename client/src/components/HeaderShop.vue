<template>
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light config-sticky">
        <div class="container">
            <!-- Your Logo -->
            <router-link to="/" class="navbar-brand">NENDO WORLD</router-link>

            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <!-- Shop -->
                    <li class="nav-item">
                        <router-link to="/" class="nav-link">Shop</router-link>
                    </li>

                    <!-- View Cart -->
                    <li class="nav-item">
                        <router-link to="/cart" class="nav-link">View Cart</router-link>
                    </li>

                    <!-- View Order -->
                    <li class="nav-item">
                        <router-link to="/order" class="nav-link">View Orders</router-link>
                    </li>

                    <!-- Profile -->
                    <li class="nav-item">
                        <router-link to="/profile" class="nav-link">Profile</router-link>
                    </li>
                </ul>
            </div>
        </div>

        <div>
            <!-- Login Button (conditionally rendered) -->
            <router-link
                v-if="!accessToken"
                to="/login"
                class="btn btn-outline-primary my-2 my-sm-0 mx-2"
            >
                Login
            </router-link>

            <!-- Register Button (conditionally rendered) -->
            <router-link
                v-if="!accessToken"
                to="/register"
                class="btn btn-outline-primary my-2 my-sm-0 ms-2 me-4"
            >
                Register
            </router-link>

            <!-- Logout Button -->
            <button
                v-if="accessToken"
                @click="logout"
                class="btn btn-outline-danger my-2 my-sm-0 ms-2 me-4"
                type="button"
            >
                Logout
            </button>
        </div>
    </nav>
</template>

<script>
import { useAuthStore } from "../stores/Auth.store";

export default {
    data() {
        return {
            isSticky: false,
        };
    },
    computed: {
        accessToken() {
            return localStorage.getItem("access-token");
        },
    },
    methods: {
        logout() {
            useAuthStore().logout();
        },
        handleScroll() {
            // Check if the user has scrolled down, set isSticky accordingly
            this.isSticky = window.scrollY > 0;
        },
    },
    mounted() {
        // Attach scroll event listener
        window.addEventListener("scroll", this.handleScroll);
    },
    destroyed() {
        // Remove scroll event listener to avoid memory leaks
        window.removeEventListener("scroll", this.handleScroll);
    },
};
</script>

<style scoped>
/* Add your custom styles here if needed */

.config-sticky {
    position: sticky;
    top: 0;
    z-index: 10;
}
</style>

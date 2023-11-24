<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4">Register</h2>
        <form @submit.prevent="submitForm">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" v-model="username" required />
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" v-model="email" required />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" v-model="password" required />
            </div>
            <!-- Add more form fields as needed for registration -->
            <button type="submit" class="btn btn-primary">Register</button>
        </form>

        <!-- Button to go to home view without login -->
        <router-link to="/" class="btn btn-lg mt-3 d-block mx-auto text-white light-green"
            >Go to Home</router-link
        >
    </div>
</template>

<script>
import { mapActions } from "pinia";
import { useAuthStore } from "@/stores/Auth.store";

export default {
    data() {
        return {
            username: "",
            email: "",
            password: "",
            // Add more data properties for registration fields
        };
    },
    methods: {
        ...mapActions(useAuthStore, ["login", "register"]),
        async submitForm() {
            const user = { username: this.username, email: this.email, password: this.password };
            try {
                // Add logic for registering the user
                await this.register(user);

                // After successful registration, you may want to automatically log in the user.
                // Adjust this part based on your authentication flow.
                const userData = await this.login(user);

                console.log("User registered and logged in:", userData);

                // Redirect to the home view for non-admin users
                this.$router.push("/");
            } catch (error) {
                console.error(error);
            }
        },
    },
};
</script>

<style>
/* You can add custom styles here if needed */
.light-green {
    background-color: #71c9ce;
    transition: all 0.25s ease;
}
.light-green:hover {
    background-color: #a6e3e9;
}
</style>

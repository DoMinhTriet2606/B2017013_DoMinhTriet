<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4">Login</h2>
        <form @submit.prevent="submitForm">
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" v-model="email" required />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" v-model="password" required />
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
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
import Swal from "sweetalert2";

export default {
    data() {
        return {
            email: "",
            password: "",
        };
    },
    methods: {
        ...mapActions(useAuthStore, ["login"]),
        async submitForm() {
            const user = { email: this.email, password: this.password };
            try {
                const userData = await this.login(user);
                console.log(userData);
                if (userData.role === "Admin") {
                    // Redirect to the admin view for admin users
                    this.$router.push("/admin");
                } else {
                    // Redirect to the home view for non-admin users
                    this.$router.push("/");
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: "Login Error",
                    text: "Invalid email or password",
                    icon: "error",
                    confirmButtonText: "OK",
                });
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

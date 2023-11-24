<template>
    <HeaderShop />
    <div class="container mt-4">
        <h2>User Profile</h2>

        <div v-if="user">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title mb-4">{{ user.username }}</h5>
                    <p class="card-text">Email: {{ user.email }}</p>
                    <p class="card-text">Role: {{ user.role }}</p>
                    <p class="card-text">Created At: {{ formatDateTime(user.createdAt) }}</p>
                    <p class="card-text">Updated At: {{ formatDateTime(user.updatedAt) }}</p>
                    <!-- Add more user details as needed -->
                </div>
            </div>
        </div>

        <div v-else>
            <p class="mt-3">Loading user profile...</p>
        </div>
    </div>
</template>

<script>
import axios from "../axios";
import HeaderShop from "../components/HeaderShop.vue";

export default {
    name: "UserProfile",
    components: {
        HeaderShop,
    },
    data() {
        return {
            user: null,
        };
    },
    mounted() {
        this.fetchUserProfile();
    },
    methods: {
        async fetchUserProfile() {
            try {
                // Assuming you have an API endpoint for fetching the user profile
                const response = await axios.get("/users/profile");
                this.user = response.data.user;
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        },
        formatDateTime(dateTimeString) {
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            };
            return new Date(dateTimeString).toLocaleDateString(undefined, options);
        },
    },
};
</script>

<style scoped>
/* Add your custom styles here */
.container {
    max-width: 600px;
}

.card {
    margin-top: 20px;
}

.mt-3 {
    margin-top: 3rem !important;
}
</style>

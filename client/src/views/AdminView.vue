<!-- Admin.vue -->

<template>
    <div>
        <!-- Navigation Bar -->
        <nav class="navbar navbar-expand-lg navbar-light bg-light config-sticky">
            <div class="container">
                <router-link to="/admin/view-products" class="navbar-brand"
                    >Admin Panel</router-link
                >
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
                        <!-- Menu Items -->
                        <li class="nav-item">
                            <router-link to="/admin/view-products" class="nav-link"
                                >View Products</router-link
                            >
                        </li>
                        <li class="nav-item">
                            <router-link to="/admin/add-products" class="nav-link"
                                >Add Products</router-link
                            >
                        </li>
                        <li class="nav-item">
                            <router-link to="/admin/view-cart" class="nav-link"
                                >View Carts</router-link
                            >
                        </li>
                        <li class="nav-item">
                            <router-link to="/admin/orders" class="nav-link"
                                >View Orders</router-link
                            >
                        </li>
                        <li class="nav-item">
                            <router-link to="/admin/customers" class="nav-link"
                                >Customers</router-link
                            >
                        </li>
                        <li class="nav-item">
                            <router-link to="/admin/profile" class="nav-link">Profile</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <button
                    @click="logout"
                    class="btn btn-outline-danger my-2 my-sm-0 mx-4"
                    type="button"
                >
                    Logout
                </button>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="container mt-4">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
// Import your Pinia store
import { useAuthStore } from "../stores/Auth.store";
export default {
    name: "Admin",
    created() {
        this.$router.push("/admin/view-products");
    },
    methods: {
        // Call the logout method from the Pinia store
        logout() {
            useAuthStore().logout();
        },
    },
};
</script>

<style scoped>
/* Add any custom styles here */
.config-sticky {
    position: sticky;
    top: 0;
    z-index: 10;
}
</style>

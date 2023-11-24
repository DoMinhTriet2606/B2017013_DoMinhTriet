<!-- OrderDetails.vue -->

<template>
    <HeaderShop />
    <div class="container mt-4">
        <h2 class="mb-4">Order Details</h2>
        <div v-if="orders.length > 0">
            <div v-for="order in orders" :key="order._id" class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">Order ID: {{ order._id }}</h5>
                    <p class="card-text">Username: {{ order.username }}</p>
                    <p class="card-text">Address: {{ order.address }}</p>
                    <p class="card-text">Total Price: {{ order.total }} VND</p>
                    <p class="card-text">Status: {{ order.status }}</p>

                    <h6 class="mt-4">Products:</h6>
                    <ul class="list-group">
                        <li
                            v-for="product in order.products"
                            :key="product.productId"
                            class="list-group-item"
                        >
                            <div class="d-flex justify-content-between">
                                <span>{{ product.productId }}</span>
                                <span>Quantity: {{ product.quantity }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-else>
            <p>No orders found for this user.</p>
        </div>
    </div>
</template>

<script>
import axios from "../axios";
import HeaderShop from "../components/HeaderShop.vue";

export default {
    name: "OrderDetails",
    components: {
        HeaderShop,
    },
    data() {
        return {
            orders: [],
            userId: null,
        };
    },
    async mounted() {
        await this.getUser();
        this.fetchOrdersByUserId(this.userId);
    },
    methods: {
        async getUser() {
            try {
                const response = await axios.get("/users/profile");
                this.userId = response.data.user._id;
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        },
        async fetchOrdersByUserId(userId) {
            try {
                const response = await axios.get(`/orders/find/${userId}`);
                console.log(response);
                this.orders = response.data;
            } catch (error) {
                console.error("Error fetching orders for the user:", error);
            }
        },
    },
};
</script>

<style scoped>
/* Add your custom styles here if needed */
</style>

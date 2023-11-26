<!-- OrderDetails.vue -->

<template>
    <HeaderShop />
    <div class="container mt-4">
        <h2 class="mb-4">Order Details</h2>
        <div v-if="orders.length > 0">
            <div
                v-for="order in orders"
                :key="order._id"
                class="config-border"
                :class="getCardClasses(order)"
            >
                <div class="card-body">
                    <h5 class="card-title">Order ID: {{ order._id }}</h5>
                    <p class="card-text">Username: {{ order.user.username }}</p>
                    <p class="card-text">Email: {{ order.user.email }}</p>
                    <p class="card-text">Phone: {{ order.phone }}</p>
                    <p class="card-text">Address: {{ order.address }}</p>
                    <p class="card-text">Total Price: {{ order.total }} VND</p>
                    <p class="card-text" :class="getStatusTextColor(order.status)">
                        Status: {{ order.status }}
                    </p>

                    <h6 class="mt-4">Products:</h6>
                    <ul class="list-group">
                        <li
                            v-for="uniqueProduct in getUniqueProducts(order.products)"
                            :key="uniqueProduct._id"
                            class="list-group-item"
                        >
                            <div class="d-flex justify-content-between">
                                <span>{{ uniqueProduct.title }}</span>
                                <span :class="getStatusTextColor(order.status)"
                                    >Quantity:
                                    {{
                                        getUniqueProductQuantity(order.products, uniqueProduct._id)
                                    }}</span
                                >
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
                console.log(response.data);
                this.orders = response.data;
            } catch (error) {
                console.error("Error fetching orders for the user:", error);
            }
        },
        getUniqueProducts(products) {
            const uniqueProductSet = new Set(products.map((product) => JSON.stringify(product)));
            return Array.from(uniqueProductSet).map((uniqueProduct) => JSON.parse(uniqueProduct));
        },
        getUniqueProductQuantity(products, productId) {
            return products.filter((product) => product._id === productId).length;
        },
        getCardClasses(order) {
            return {
                card: true,
                "mb-3": true,
                "border-warning": order.status === "Pending",
                "border-success": order.status === "Confirmed",
                "border-secondary": order.status === "Delivered",
            };
        },
        getStatusTextColor(status) {
            return {
                "text-warning": status === "Pending",
                "text-success": status === "Confirmed",
                "text-secondary": status === "Delivered",
            };
        },
    },
};
</script>

<style scoped>
/* Add your custom styles here if needed */
.config-border {
    border-width: 3px;
}
</style>

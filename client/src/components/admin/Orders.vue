<!-- AdminOrders.vue -->

<template>
    <div>
        <div class="container mt-4">
            <h2 class="mb-4">All Customer Orders</h2>
            <div v-if="allOrders.length > 0">
                <div
                    v-for="order in allOrders"
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

                        <!-- Button to trigger SweetAlert2 modal -->
                        <button
                            @click="showStatusModal(order)"
                            class="btn btn-outline-primary mt-3"
                        >
                            Update Order
                        </button>

                        <h6 class="mt-4">Unique Products:</h6>
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
                                            getUniqueProductQuantity(
                                                order.products,
                                                uniqueProduct._id
                                            )
                                        }}</span
                                    >
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>No orders found.</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../../axios";
import Swal from "sweetalert2";

export default {
    name: "AdminOrders",
    data() {
        return {
            allOrders: [],
            newStatus: "", // Added for storing the new status
        };
    },
    async mounted() {
        await this.fetchAllOrders();
    },
    methods: {
        async fetchAllOrders() {
            try {
                const response = await axios.get("/orders");
                this.allOrders = response.data;
            } catch (error) {
                console.error("Error fetching all orders:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch orders. Please try again later.",
                });
            }
        },
        getProductQuantity(products, productId) {
            return products.filter((product) => product._id === productId).length;
        },
        async updateOrderStatus(orderId) {
            try {
                await axios.put(`/orders/${orderId}`, { status: this.newStatus });
                // Display a success message
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Order status updated successfully.",
                });
                // Refresh the orders list
                await this.fetchAllOrders();
            } catch (error) {
                console.error("Error updating order status:", error);
                // Display an error message
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to update order status. Please try again later.",
                });
            }
        },
        async showStatusModal(order) {
            if (order.status === "Delivered") {
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: "Orders with 'Delivered' status cannot be modified.",
                });
            } else {
                const { value: status } = await Swal.fire({
                    title: "Modify Order Status",
                    input: "select",
                    inputOptions: {
                        Pending: "Pending",
                        Confirmed: "Confirmed",
                        Delivered: "Delivered",
                    },
                    inputPlaceholder: "Select a new status",
                    showCancelButton: true,
                    inputValidator: (value) => {
                        return new Promise((resolve) => {
                            if (value !== "") {
                                resolve();
                            } else {
                                resolve("You must select a new status");
                            }
                        });
                    },
                });

                if (status) {
                    this.newStatus = status;
                    this.updateOrderStatus(order._id);
                }
            }
        },
        getUniqueProducts(products) {
            // Create a Set to store unique products based on _id
            const uniqueProductSet = new Set(products.map((product) => JSON.stringify(product)));

            // Convert the Set back to an array of objects
            return Array.from(uniqueProductSet).map((uniqueProduct) => JSON.parse(uniqueProduct));
        },
        getUniqueProductQuantity(products, productId) {
            // Count the occurrences of the productId in the products array
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
    border-width: 4px;
}
</style>

<template>
    <div class="container mt-4">
        <h2 class="mb-4">View Cart</h2>

        <div v-if="groupedCarts.length === 0">
            <p>No carts available.</p>
        </div>

        <div v-else>
            <div
                v-for="(group, userId) in groupedCarts"
                :key="userId"
                class="card user-cart-group mb-4"
            >
                <div class="card-header">
                    <h3 class="card-title">User ID: {{ userId }}</h3>
                </div>
                <div class="card-body">
                    <div
                        v-for="(cart, index) in group"
                        :key="index"
                        class="row align-items-center cart-item"
                    >
                        <div class="col-3">
                            <img :src="cart.img[0]" alt="Product Image" class="img-fluid" />
                        </div>
                        <div class="col-9">
                            <h5 class="card-title">{{ cart.title }}</h5>
                            <p class="card-text">Quantity: {{ cart.quantity }}</p>
                            <p class="card-text">Price: {{ cart.price }} VND</p>
                            <!-- Add more product details as needed -->
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <p class="card-text">Username: {{ userNames[userId] || "Loading..." }}</p>
                    <p class="card-text">Total Price: {{ calculateTotalPrice(group) }} VND</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../../axios";
import { ref, onMounted } from "vue";

export default {
    name: "ViewCart",

    computed: {
        groupedCarts() {
            return this.carts.reduce((grouped, cart) => {
                const userId = cart.userId;
                if (!grouped[userId]) {
                    grouped[userId] = [];
                }
                grouped[userId].push(cart);
                return grouped;
            }, {});
        },
    },

    setup() {
        const carts = ref([]);
        const userNames = ref({});

        const fetchCarts = async () => {
            try {
                const response = await axios.get("/carts/");
                carts.value = response.data;

                // Fetch usernames for each userId
                const userIds = [...new Set(carts.value.map((cart) => cart.userId))];
                await Promise.all(
                    userIds.map(async (userId) => {
                        const userResponse = await axios.get(`/admin/user/${userId}`);

                        userNames.value[userId] = userResponse.data.user.username;
                    })
                );
            } catch (error) {
                console.error("Error fetching carts:", error);
            }
        };

        const calculateTotalPrice = (cartGroup) => {
            return cartGroup.reduce((total, cart) => total + cart.price * cart.quantity, 0);
        };

        onMounted(() => {
            fetchCarts();
        });

        return {
            carts,
            userNames,
            calculateTotalPrice,
        };
    },
};
</script>

<style scoped>
/* Add any additional custom styles here */
.card {
    border: 1px solid #ccc;
}

.user-cart-group {
    margin: 10px;
}

.cart-item {
    border-bottom: 1px solid #ccc;
    padding: 10px;
}

.cart-item img {
    max-width: 100%;
    max-height: 100%;
    margin-right: 10px;
}
</style>

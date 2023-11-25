<template>
    <HeaderShop />
    <div class="container mt-5 h-auto">
        <div v-if="product !== null">
            <div class="row gx-5">
                <div class="col-md-4">
                    <img :src="product.img[0]" alt="Product Image" class="img-fluid rounded" />
                </div>
                <div class="col-md-8">
                    <h2>{{ product.title }}</h2>

                    <p>
                        <strong>ID:</strong>
                        {{ product._id.split("").reverse().join("").slice(0, 3) }}
                    </p>
                    <p><strong>Product Line:</strong> {{ product.desc }}</p>
                    <p><strong>Material:</strong> PVC</p>
                    <p><strong>Size:</strong> {{ product.size }}</p>
                    <p><strong>Price:</strong> {{ product.price }} VND</p>
                    <p><strong>Categories:</strong> {{ product.categories }}</p>
                    <p><strong>Created At:</strong> {{ product.createdAt }}</p>
                    <p><strong>Updated At:</strong> {{ product.updatedAt }}</p>
                    <!-- Additional product details can be added here -->

                    <!-- Add to Cart button -->
                    <button @click="addToCart" class="btn text-white light-green">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
        <div v-else>
            <p>Fetching...</p>
        </div>
    </div>
</template>

<script>
import axios from "../axios";
import Swal from "sweetalert2";
import HeaderShop from "../components/HeaderShop.vue";

export default {
    name: "ProductDetail",

    components: {
        HeaderShop,
    },
    data() {
        return {
            user: null,
            product: null,
        };
    },

    mounted() {
        this.getUser();
        this.fetchProduct();
        console.log(this.user);
    },

    methods: {
        async getUser() {
            try {
                const response = await axios.get("/users/profile");
                this.user = response.data.user;
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        },
        async fetchProduct() {
            try {
                const productId = this.$route.params.id;
                // Make a GET request to your backend API to fetch the selected product
                const response = await axios.get(`/products/find/${productId}`);
                console.log(response.data.product);
                // Set the fetched product to the data property
                this.product = response.data.product;
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        },
        async addToCart() {
            if (this.user !== null) {
                try {
                    // Make a POST request to add the product to the cart
                    const response = await axios.post("/carts", {
                        ...this.product,
                        img: this.product.img,
                        productId: this.product._id,
                        userId: this.user._id,
                    });
                    // Handle the response if needed
                    console.log("Product added to cart:", response.data);
                    // Show SweetAlert2 success message
                    await Swal.fire("Success!", "Product added to cart.", "success");
                } catch (error) {
                    console.error("Error adding product to cart:", error);
                    // Show SweetAlert2 error message
                    await Swal.fire("Error", "Failed to add product to cart.", "error");
                }
            } else {
                await Swal.fire(
                    "Error",
                    "Customer needs to log in to add the product to the cart",
                    "error"
                );
                return;
            }
        },
    },
};
</script>

<style scoped>
/* Add your custom styles here if needed */
.config-size {
    max-height: 80%;
}

.light-green {
    background-color: #71c9ce;
    transition: all 0.25s ease;
}
.light-green:hover {
    background-color: #a6e3e9;
}
</style>

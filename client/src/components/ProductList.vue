<template>
    <div class="mx-4 my-4">
        <label for="categoryFilter" class="form-label">Filter by Category:</label>
        <select
            v-model="categoryFilter"
            @change="applyCategoryFilter"
            class="form-control w-50"
            id="categoryFilter"
        >
            <option value="" selected>All Categories</option>
            <!-- Use sortedCategories for dynamic options -->
            <option v-for="category in sortedCategories" :key="category" :value="category">
                {{ category }}
            </option>
        </select>
    </div>

    <div class="product-list">
        <div class="row p-4">
            <div class="col-md-3" v-for="product in products" :key="product._id">
                <div class="card mb-4 box-shadow">
                    <!-- You can customize the card content based on your product data structure -->
                    <img class="card-img-top img-size" :src="product.img" alt="Product Image" />
                    <div class="card-body">
                        <h5 class="card-title">{{ product.title }}</h5>
                        <p class="card-text">{{ product.desc }}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-muted">{{ product.price }} VND</span>
                            <router-link
                                :to="'/product/' + product._id"
                                class="btn btn-sm btn-outline-primary"
                                >View Details</router-link
                            >
                        </div>
                    </div>
                    <!-- Add to Cart button -->
                    <button @click="addToCart(product)" class="btn mt-2 text-white light-green">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../axios";
import swal from "sweetalert";

export default {
    name: "ProductList",

    data() {
        return {
            products: [],
            user: null,
            cart: [],
            categoryFilter: null, // Added category filter
        };
    },

    mounted() {
        this.getUser();
        this.fetchProducts();
    },
    computed: {
        sortedCategories() {
            // Extract unique categories from the fetched products
            const categories = new Set();
            this.products.forEach((product) => {
                categories.add(product.categories);
            });

            // Convert Set to an array and sort alphabetically
            return Array.from(categories).sort();
        },
    },
    methods: {
        async getUser() {
            try {
                const response = await axios.get("/users/profile");
                this.user = response.data.user;
            } catch (error) {
                console.log(error);
            }
        },
        async fetchProducts() {
            try {
                // Make a GET request to your backend API to fetch products
                const response = await axios.get("/products");
                console.log(response);

                // Filter products based on the selected category
                this.products = this.categoryFilter
                    ? response.data.filter((product) =>
                          product.categories.includes(this.categoryFilter)
                      )
                    : response.data;
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        },

        applyCategoryFilter() {
            // Fetch products based on the selected category
            this.fetchProducts();
        },
        async addToCart(product) {
            if (this.user !== null) {
                try {
                    // Make a POST request to add the product to the cart
                    const response = await axios.post("/carts", {
                        ...product,
                        img: product.img,
                        productId: product._id,
                        userId: this.user._id,
                    });
                    // Handle the response if needed
                    console.log("Product added to cart:", response.data);
                    // Show SweetAlert success message
                    swal("Success!", "Product added to cart.", "success");
                } catch (error) {
                    console.error("Error adding product to cart:", error);
                    // Show SweetAlert error message
                    swal("Error", "Failed to add product to cart.", "error");
                }
            } else {
                swal("Error", "Customer need login for adding product to cart", "error");
                return;
            }
        },
    },
};
</script>

<style scoped>
/* Add your custom styles here if needed */
.img-size {
    background-size: cover;
    height: 320px;
}
.light-green {
    background-color: #71c9ce;
    transition: all 0.25s ease;
}
.light-green:hover {
    background-color: #a6e3e9;
}
</style>

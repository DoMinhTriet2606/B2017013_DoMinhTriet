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
                    <img class="card-img-top img-size" :src="product.img" alt="Product Image" />
                    <div class="card-body">
                        <h5 class="card-title">{{ product.title }}</h5>
                        <p class="card-text">{{ product.desc }}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-muted">{{ product.price }} VND</span>

                            <!-- Modify Button - Opens Modify Form -->
                            <button
                                @click="openModifyForm(product)"
                                class="btn btn-sm btn-outline-secondary"
                            >
                                Modify
                            </button>

                            <!-- Delete Button - Opens Confirmation Dialog -->
                            <button
                                @click="openDeleteConfirmation(product._id)"
                                class="btn btn-sm btn-outline-danger"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modify Product Form Modal -->
        <div v-if="isModifyFormVisible" class="modal show" tabindex="-1" role="dialog">
            <div
                class="container d-flex flex-column align-items-center justify-content-center w-50"
            >
                <form @submit.prevent="modifyProduct" class="w-100">
                    <!-- Modify form fields -->
                    <div class="mb-3">
                        <label for="modifiedProductName" class="form-label text-white"
                            >Modified Product Name:</label
                        >
                        <input
                            v-model="modifiedProductName"
                            type="text"
                            class="form-control"
                            id="modifiedProductName"
                            required
                        />
                    </div>

                    <div class="mb-3">
                        <label for="modifiedProductDesc" class="form-label text-white"
                            >Modified Product Description:</label
                        >
                        <input
                            type="text"
                            v-model="modifiedProductDesc"
                            class="form-control"
                            id="modifiedProductDesc"
                            required
                        />
                    </div>

                    <div class="mb-3">
                        <label for="modifiedProductPrice" class="form-label text-white"
                            >Modified Product Price:</label
                        >
                        <input
                            v-model="modifiedProductPrice"
                            type="number"
                            class="form-control"
                            id="modifiedProductPrice"
                            required
                        />
                    </div>

                    <div class="mb-3">
                        <label for="modifiedImageUrl" class="form-label text-white"
                            >Modified Image URL:</label
                        >
                        <input
                            v-model="modifiedImageUrl"
                            type="text"
                            class="form-control"
                            id="modifiedImageUrl"
                            required
                        />
                    </div>

                    <div class="mb-3">
                        <label for="modifyCategory" class="form-label text-white"
                            >Modified Category:</label
                        >
                        <input
                            type="text"
                            v-model="modifyCategory"
                            class="form-control"
                            id="modifyCategory"
                            required
                        />
                    </div>

                    <div class="mb-3">
                        <label for="modifyProductSize" class="form-label text-white"
                            >Modified Product Size:</label
                        >
                        <input
                            type="text"
                            v-model="modifyProductSize"
                            class="form-control"
                            id="modifyProductSize"
                            required
                        />
                    </div>

                    <!-- Add more fields as needed -->

                    <!-- Add more fields as needed -->

                    <button type="submit" class="btn btn-primary">Confirm</button>
                </form>
                <button @click="closeModifyForm" class="btn btn-secondary">Close</button>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="isDeleteConfirmationVisible" class="modal show" tabindex="-1" role="dialog">
            <div
                class="container d-flex flex-column align-items-center justify-content-center w-50"
            >
                <h3 class="mb-4">Are you sure you want to delete this product?</h3>
                <div>
                    <button @click="deleteProduct(selectedProductId)" class="btn btn-danger mx-4">
                        Yes, Delete
                    </button>
                    <button @click="closeDeleteConfirmation" class="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../../axios";
import Swal from "sweetalert2";

export default {
    name: "ProductList",
    data() {
        return {
            products: [],
            isModifyFormVisible: false,
            isDeleteConfirmationVisible: false,
            selectedProductId: null,
            modifiedProductName: "",
            modifiedProductDesc: "",
            modifiedProductPrice: 0,
            modifiedImageUrl: "",
            modifyCategory: "",
            modifyProductSize: "",
            categoryFilter: null, // Added category filter
        };
    },

    mounted() {
        // Fetch products when the component is mounted
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

        openModifyForm(product) {
            // Set the selected product for modification
            // You can populate the form with the details of the selected product
            this.selectedProductId = product._id;
            this.modifiedProductName = product.title;
            this.modifiedProductDesc = product.desc;
            this.modifiedProductPrice = product.price;
            this.modifiedImageUrl = product.img;
            this.modifyCategory = product.categories;
            this.modifyProductSize = product.size;

            this.isModifyFormVisible = true;
        },

        closeModifyForm() {
            // Close the modify form
            this.isModifyFormVisible = false;
            // Optionally, reset any form-related data
            this.selectedProductId = null;
        },

        openDeleteConfirmation(productId) {
            Swal.fire({
                title: "Delete Product",
                text: "Are you sure you want to delete this product?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
            }).then((result) => {
                if (result.isConfirmed) {
                    // If the user clicks "Delete," proceed with the deletion
                    this.deleteProduct(productId);
                }
            });
        },

        closeDeleteConfirmation() {
            // Close the delete confirmation dialog
            this.isDeleteConfirmationVisible = false;
            // Optionally, reset any confirmation-related data
            this.selectedProductId = null;
        },

        async modifyProduct() {
            const modifiedProductData = {
                title: this.modifiedProductName,
                desc: this.modifiedProductDesc,
                price: this.modifiedProductPrice,
                img: this.modifiedImageUrl,
                categories: this.modifyCategory,
                size: this.modifiedProductSize,
                // Add more fields as needed
            };

            Swal.fire({
                title: "Update Product",
                text: "Are you sure you want to update this product?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "OK",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        // Make a PUT or PATCH request to update the selected product
                        await axios.put(`/products/${this.selectedProductId}`, modifiedProductData);
                        // Close the modify form
                        this.closeModifyForm();
                        // Show a success message
                        Swal.fire("Success", "Product updated successfully!", "success").then(() =>
                            this.fetchProducts()
                        );
                    } catch (error) {
                        Swal.fire({
                            title: "Error",
                            text: error,
                            icon: "error",
                        });
                        console.error("Error modifying product:", error);
                    }
                }
            });
        },

        async deleteProduct(productId) {
            try {
                // Make a DELETE request to your backend API to delete the selected product
                await axios.delete(`/products/${productId}`);
                // Close the delete confirmation dialog
                this.closeDeleteConfirmation();
                Swal.fire("Success", "Product deleted successfully!", "success").then(() =>
                    this.fetchProducts()
                );
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: error,
                    icon: "error",
                });
                console.error("Error deleting product:", error);
            }
        },
    },
};
</script>

<style scoped>
/* Add your custom styles here if needed */

body {
    height: 100vh;
}
.container {
    height: 100%;
}

.img-size {
    background-size: cover;
    height: 320px;
}

/* Add styles for your modals here */
.modal {
    display: block;
    background: rgba(0, 0, 0, 0.5);
}

/* Add styles for your form and confirmation dialog here */
</style>

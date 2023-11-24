<!-- AddProducts.vue -->

<template>
    <div>
        <h2>Add Products</h2>

        <!-- Product Form -->
        <form @submit.prevent="submitForm">
            <div class="mb-3">
                <label for="productName" class="form-label">Product Name:</label>
                <input type="text" v-model="title" class="form-control" id="productName" required />
            </div>

            <div class="mb-3">
                <label for="productDesc" class="form-label">Product Description:</label>
                <input type="text" v-model="desc" class="form-control" id="productDesc" required />
            </div>

            <div class="mb-3">
                <label for="productPrice" class="form-label">Product Price:</label>
                <input
                    type="number"
                    v-model="price"
                    class="form-control"
                    id="productPrice"
                    required
                />
            </div>

            <div class="mb-3">
                <label for="imageUrl" class="form-label">Image URL:</label>
                <input type="text" v-model="img" class="form-control" id="imageUrl" required />
            </div>

            <div class="mb-3">
                <label for="category" class="form-label">Category:</label>
                <input type="text" v-model="category" class="form-control" id="category" required />
            </div>

            <div class="mb-3">
                <label for="productSize" class="form-label">Product Size:</label>
                <input type="text" v-model="size" class="form-control" id="productSize" required />
            </div>

            <!-- Add more fields as needed -->

            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";

export default {
    name: "AddProducts",
    data() {
        return {
            title: "",
            desc: "",
            img: "",
            category: "",
            size: "",
            price: 0,
            // Add more data properties for other fields
        };
    },
    methods: {
        async submitForm() {
            // Create an object with the form data
            const productData = {
                title: this.title,
                desc: this.desc,
                img: this.img.split(", "),
                categories: this.category,
                size: this.size,
                price: this.price,
                // Add more fields as needed
            };

            try {
                // Make an API request to send the data to the backend
                const response = await axios.post(
                    "http://localhost:8000/api/products",
                    productData
                );

                // Handle the response as needed
                if (response.data.success) {
                    swal({
                        title: "Success",
                        text: "Product Added Successfully",
                        icon: "success",
                    });
                }

                // Optionally, you can reset the form fields
                (this.title = ""),
                    (this.desc = ""),
                    (this.img = ""),
                    (this.category = ""),
                    (this.size = ""),
                    (this.price = 0);
                // Reset other fields as needed
            } catch (error) {
                swal({
                    title: "Error",
                    text: "Product already exists",
                    icon: "error",
                });
            }
        },
    },
};
</script>

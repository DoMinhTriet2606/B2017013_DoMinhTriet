<template>
    <HeaderShop />
    <div class="user-cart p-4">
        <h2 class="mb-4">User Cart</h2>

        <div class="row">
            <div class="col-md-8">
                <div v-if="cart.length === 0">
                    <p>Your cart is empty.</p>
                </div>

                <div v-else>
                    <div v-for="cartItem in cart" :key="cartItem._id" class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-3">
                                <img :src="cartItem.img" alt="Product Image" class="img-fluid" />
                            </div>
                            <div class="col-md-9">
                                <div class="card-body">
                                    <h5 class="card-title">{{ cartItem.title }}</h5>
                                    <p class="card-text">{{ cartItem.desc }}</p>
                                    <p class="card-text">
                                        <strong>Price:</strong> {{ cartItem.price }} VND
                                    </p>
                                    <p class="card-text">
                                        <strong>Quantity:</strong> {{ cartItem.quantity }}
                                    </p>
                                    <p class="card-text">
                                        <strong>Total:</strong>
                                        {{ calculateItemTotal(cartItem) }} VND
                                    </p>

                                    <!-- Update Cart button with Bootstrap styling -->
                                    <button
                                        @click="openQuantityModalForSelected(cartItem)"
                                        class="btn btn-primary me-2"
                                    >
                                        Update Cart
                                    </button>
                                    <button
                                        @click="openDeleteConfirmation(cartItem)"
                                        class="btn btn-danger"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-4 position-relative">
                <div class="position-modify">
                    <!-- Overall total price for all items on the right side -->
                    <div class="mb-3">
                        <p class="font-weight-bold">
                            Overall Total Price: {{ calculateOverallTotal() }} VND
                        </p>
                    </div>

                    <!-- Purchase button with SweetAlert form -->
                    <button @click="openOrderForm" class="btn btn-block text-white light-green">
                        Purchase
                    </button>
                </div>
            </div>
        </div>

        <!-- Quantity Modal -->
        <div v-if="isQuantityModalOpen" class="modal fade show" tabindex="-1" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title">Update Quantity</h5>
                        <button
                            type="button"
                            class="btn-close"
                            @click="closeQuantityModal"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <p>Enter the new quantity:</p>
                        <input v-model="newQuantity" type="number" class="form-control" autofocus />
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="closeQuantityModal">Close</button>
                        <button class="btn btn-primary" @click="updateQuantity">Update</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="isDeleteConfirmationVisible" class="modal fade show" tabindex="-1" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title">Are you sure you want to delete this item?</h5>
                        <button
                            type="button"
                            class="btn-close"
                            @click="closeDeleteConfirmation"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <!-- Add content as needed -->
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-danger" @click="deleteCartItem">Yes, Delete</button>
                        <button class="btn btn-secondary" @click="closeDeleteConfirmation">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../axios";
import Swal from "sweetalert2";
import HeaderShop from "../components/HeaderShop.vue";

export default {
    name: "UserCart",
    components: {
        HeaderShop,
    },
    data() {
        return {
            user: null,
            cart: [],
            isQuantityModalOpen: false,
            isDeleteConfirmationVisible: false,
            newQuantity: 0,
            selectedCartItem: null,
        };
    },
    mounted() {
        this.getUser();
        setTimeout(() => this.fetchUserCart(), 1000);
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
        async fetchUserCart() {
            try {
                const response = await axios.get(`/carts/find/${this.user._id}`);
                this.cart = response.data;
            } catch (error) {
                console.error("Error fetching user cart:", error);
            }
        },
        async deleteAllUserCart(userId) {
            console.log(userId);
            try {
                const response = await axios.delete(`/carts/delAll/${userId}`);
                console.log(response);
                this.fetchUserCart();
            } catch (error) {
                console.error("Error fetching user cart:", error);
            }
        },

        openQuantityModalForSelected(cartItem) {
            this.selectedCartItem = cartItem;
            this.newQuantity = cartItem.quantity;

            // Replace the standard modal with SweetAlert2
            Swal.fire({
                title: "Enter the new quantity:",
                input: "number",
                inputValue: this.newQuantity,
                showCancelButton: true,
                confirmButtonText: "Update",
                preConfirm: (value) => {
                    const newQuantity = parseInt(value, 10);
                    if (!isNaN(newQuantity) && newQuantity >= 0) {
                        // Update quantity using Axios
                        axios
                            .put(`/carts/${cartItem._id}`, { quantity: newQuantity })
                            .then(() => {
                                // Fetch updated cart and show success message
                                this.fetchUserCart();
                                Swal.fire("Success!", "Quantity updated successfully.", "success");
                            })
                            .catch((error) => {
                                console.error("Error updating quantity:", error);
                                Swal.fire("Error!", "Failed to update quantity.", "error");
                            });
                    } else {
                        // If not a valid positive integer, show an error
                        Swal.showValidationMessage("Please enter a valid positive integer.");
                    }
                },
            });
        },

        closeQuantityModal() {
            this.isQuantityModalOpen = false;
            this.selectedCartItem = null;
            this.newQuantity = 0;
        },

        openDeleteConfirmation(cartItem) {
            // Replace the standard modal with SweetAlert2
            Swal.fire({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this item!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
            }).then((result) => {
                if (result.isConfirmed) {
                    // Delete cart item using Axios
                    axios
                        .delete(`/carts/${cartItem._id}`)
                        .then(() => {
                            // Fetch updated cart and show success message
                            this.fetchUserCart();
                            Swal.fire("Deleted!", "Your item has been deleted.", "success");
                        })
                        .catch((error) => {
                            console.error("Error deleting cart item:", error);
                            Swal.fire("Error!", "Failed to delete the item.", "error");
                        });
                } else {
                    // If cancel is pressed, show a message
                    Swal.fire("Cancelled", "Your item is safe :)", "info");
                }
            });
        },
        closeDeleteConfirmation() {
            this.isDeleteConfirmationVisible = false;
            this.selectedCartItem = null;
        },

        calculateItemTotal(cartItem) {
            return cartItem.price * cartItem.quantity;
        },
        calculateOverallTotal() {
            return this.cart.reduce(
                (total, cartItem) => total + cartItem.price * cartItem.quantity,
                0
            );
        },
        openOrderForm() {
            // Check if the cart is empty
            if (this.cart.length === 0) {
                Swal.fire(
                    "Error",
                    "Your cart is empty. Add items before making a purchase.",
                    "error"
                );
            } else {
                // Replace the standard modal with SweetAlert2 form
                Swal.fire({
                    title: "Fill Order Information",
                    html: `
                    <input id="name" class="swal2-input" placeholder="Name" required>
                    <input id="address" class="swal2-input" placeholder="Address" required>
                    <!-- Add more form fields as needed -->
                `,
                    confirmButtonText: "Confirm",
                    showCancelButton: true,
                    focusConfirm: false,
                    preConfirm: () => this.submitOrderForm(),
                });
            }
        },

        async submitOrderForm() {
            // Retrieve the entered order information
            const name = document.getElementById("name").value;
            const address = document.getElementById("address").value;

            // Validate the order information
            if (!name || !address) {
                Swal.showValidationMessage("Name and address are required");
                return false;
            }

            // Extract product information from the user's cart
            const products = this.cart.map((cartItem) => ({
                productId: cartItem._id, // Assuming each cart item has a unique _id
                quantity: cartItem.quantity,
            }));

            // Calculate the total price
            const total = this.calculateOverallTotal();

            // Create the order object
            const orderData = {
                username: name,
                userId: this.user._id, // Assuming you have the user information available
                products,
                total,
                address,
            };

            try {
                // Use Axios to send the order data to the backend
                const response = await axios.post("/orders", orderData);

                // Display a success message using SweetAlert2
                Swal.fire("Success!", "Order submitted successfully.", "success");

                // Add your logic for handling the purchase here (if needed)
                console.log("Order submitted:", response.data);

                this.deleteAllUserCart(this.user._id);
                // this.fetchUserCart();
                this.cart = [];
            } catch (error) {
                // Display an error message using SweetAlert2
                Swal.fire("Error!", "Failed to submit order.", "error");
                console.error("Error submitting order:", error);
            }

            // Return true to close SweetAlert2
            return true;
        },
    },
};
</script>

<style scoped>
/* Add your custom styles here if needed */
.position-modify {
    position: sticky;
    left: 0;
    top: 40px;
}

.container {
    height: 100%;
}
.modal {
    display: block;
    background: rgba(0, 0, 0, 0.5);
}

.light-green {
    background-color: #71c9ce;
    transition: all 0.25s ease;
}
.light-green:hover {
    background-color: #a6e3e9;
}
</style>

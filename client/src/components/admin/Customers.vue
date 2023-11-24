<template>
    <div class="container mt-5">
        <h2>Customers Information</h2>

        <div v-if="customers.length > 0" class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Updated At</th>
                        <!-- Add more columns as needed for customer information -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="customer in customers" :key="customer._id">
                        <th scope="row">{{ customer._id }}</th>
                        <td>{{ customer.username }}</td>
                        <td>{{ customer.email }}</td>
                        <td>{{ customer.role }}</td>
                        <td>{{ formatDate(customer.createdAt) }}</td>
                        <td>{{ formatDate(customer.updatedAt) }}</td>
                        <!-- Add more columns as needed for customer information -->
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else>
            <p>No customers available.</p>
        </div>
    </div>
</template>

<script>
import axios from "../../axios";

export default {
    data() {
        return {
            customers: [],
        };
    },
    mounted() {
        this.fetchCustomers();
    },
    methods: {
        async fetchCustomers() {
            try {
                const response = await axios.get("/admin/customers");
                this.customers = response.data.customers;
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        },
        formatDate(dateString) {
            const options = { year: "numeric", month: "long", day: "numeric" };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
    },
};
</script>

<style scoped>
/* Add your custom styles here if needed */
.table-striped > tbody > tr:nth-child(odd) > td,
.table-striped > tbody > tr:nth-child(odd) > th {
    color: white;
    background-color: #83a2ff;
}
</style>

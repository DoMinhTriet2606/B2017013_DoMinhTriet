<!-- AddProducts.vue -->

<template>
    <div>
        <h2>View Products</h2>
        <!-- Add your content here -->
        <ProductListAdmin />
    </div>
</template>

<script>
import ProductListAdmin from "./ProductListAdmin.vue";
export default {
    name: "ViewProducts",
    components: {
        ProductListAdmin,
    },
};
</script>

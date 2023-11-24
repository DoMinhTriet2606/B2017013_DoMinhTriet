<template>
    <div>
        <HeaderShop />
        <div class="container mt-4">
            <ProductList />
        </div>
    </div>
</template>

<script>
import HeaderShop from "../components/HeaderShop.vue";
import ProductList from "../components/ProductList.vue";

export default {
    components: { HeaderShop, ProductList },
};
</script>

<style lang="scss" scoped></style>

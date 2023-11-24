<template>
    <div>
        <carousel :per-page="1" :autoplay="true">
            <!-- Loop through the images in product.img -->
            <slide>
                <img
                    src="https://i.otakul.com/8942/Nen-686-6.jpg.webp"
                    alt="Product Image"
                    class="img-fluid rounded"
                />
            </slide>
            <slide>
                <img
                    src="https://i.otakul.com/8942/Nen-686-6.jpg.webp"
                    alt="Product Image"
                    class="img-fluid rounded"
                />
            </slide>
        </carousel>
    </div>
</template>

<script>
import { Carousel, Slide } from "vue-carousel";

export default {
    // props: {
    //     images: {
    //         type: Array,
    //         required: true,
    //     },
    // },

    components: {
        Carousel,
        Slide,
    },
};
</script>

<style scoped>
/* Add your custom styles here if needed */
</style>

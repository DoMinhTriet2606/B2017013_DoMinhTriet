import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { Carousel, Slide } from "vue-carousel";

const pinia = createPinia(); // Create a Pinia instance

const app = createApp(App);

// Use the Pinia instance
app.use(pinia);

// Use Vue Carousel
app.component("Carousel", Carousel);
app.component("Slide", Slide);

// Use router
app.use(router);

// Mount the app
app.mount("#app");

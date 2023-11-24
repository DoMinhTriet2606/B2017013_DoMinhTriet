import { createRouter, createWebHistory } from "vue-router";
import axios from "../axios"; // assuming you named the file axios.js
import { useAuthStore } from "../stores/Auth.store";

import HomeView from "@/views/HomeView.vue";
import Admin from "@/views/AdminView.vue";
import ViewProducts from "../components/admin/ViewProducts.vue";
import ProductDetail from "@/views/ProductDetail.vue";
import AddProducts from "../components/admin/AddProduct.vue";
import ViewCart from "../components/admin/ViewCart.vue";
import UserProfile from "../views/UserProfile.vue";
import AdminProfile from "../components/admin/AdminProfile.vue";
import Customers from "../components/admin/Customers.vue";
import UserOrder from "@/views/UserOrder.vue";

const routes = [
    {
        path: "/",
        name: "home",
        component: HomeView,
    },
    {
        path: "/cart",
        name: "UserCart",
        component: () => import("@/views/UserCart.vue"),
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/Login.vue"),
    },
    {
        path: "/register",
        name: "register",
        component: () => import("@/views/Register.vue"),
    },
    {
        path: "/profile",
        name: "Profile",
        component: UserProfile,
    },
    {
        path: "/product/:id",
        name: "ProductDetail",
        component: ProductDetail,
    },
    {
        path: "/order",
        name: "OrderDetail",
        component: UserOrder,
    },
    {
        path: "/admin",
        component: Admin,
        children: [
            { path: "view-products", component: ViewProducts },
            { path: "add-products", component: AddProducts },
            { path: "view-cart", component: ViewCart },
            { path: "profile", component: AdminProfile },
            { path: "customers", component: Customers },
        ],
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

beforeEnter: (to, from, next) => {
    // Use Axios to fetch user data
    axios.get("/user").then((response) => {
        // Check if the user is allowed to access the route based on the fetched data
        if (response.data.isAdmin) {
            next(); // Allow access
        } else {
            next("/"); // Redirect to home if not authorized
        }
    });
};

// // Navigation guard to check for authentication before each route
// router.beforeEach(async (to, from, next) => {
//     // Check if the route requires authentication
//     const authStore = useAuthStore();
//     if (to.meta.requiresAuth) {
//         const token = authStore.accessToken;

//         if (!token) {
//             // Redirect to the login page if not authenticated
//             next("/login");
//         } else {
//             // Continue to the protected route if authenticated
//             next();
//         }
//     } else {
//         // Continue to non-protected routes
//         next();
//     }
// });

export default router;

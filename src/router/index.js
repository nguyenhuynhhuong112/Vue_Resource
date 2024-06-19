import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Order from "../views/Order.vue";

const routes = [
  { path: "/login", name: "Login", component: Login },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/orders", name: "Order", component: Order },
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("../views/Admin.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/products",
    name: "Products",
    component: () => import("../views/Product.vue"),
    meta: { requiresProduct: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const roleUser = localStorage.getItem("role") === "admin";
  const productUser = localStorage.getItem("role") === "product";
  if (to.matched.some((record) => record.meta.requiresAdmin) && !roleUser) {
    alert("You are not authorized to access this page");
    router.push("/");
  } else if (
    to.matched.some((record) => record.meta.requiresProduct) &&
    !productUser
  ) {
    alert("You are not authorized to access this page");
    router.push("/");
  } else {
    next();
  }
});

export default router;

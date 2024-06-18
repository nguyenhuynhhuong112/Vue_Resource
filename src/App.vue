<template>
  <div id="app" class="min-h-screen flex flex-row w-full">
    <NavBar v-if="path !== '/login'" />
    <div class="content-container flex-1 overflow-y-auto overflow-x-hidden">
      <router-view />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import NavBar from "../src/components/navbar/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const path = ref(router.currentRoute.value.path);
    const email = localStorage.getItem("email");

    onMounted(() => {
      if (!email && path.value !== "/login") {
        router.push("/login");
      }
    });

    watch(router.currentRoute, (newRoute) => {
      path.value = newRoute.path;
    });

    return { path };
  },
};
</script>

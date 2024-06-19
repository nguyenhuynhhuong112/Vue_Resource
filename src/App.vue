<template>
  <div id="app" class="min-h-screen flex flex-row w-full">
    <NavBar v-if="path !== '/login'" />
    <div class="content-container flex-1 overflow-y-auto overflow-x-hidden">
      <router-view />
    </div>
  </div>
</template>

<script>
import NavBar from "../src/components/navbar/NavBar.vue";
export default {
  name: "App",
  components: {
    NavBar,
  },
  data() {
    return {
      path: this.$route.path,
    };
  },
  created() {
    const email = localStorage.getItem("email");
    if (!email && this.path !== "/login") {
      this.$router.push("/login");
    }
  },
  watch: {
    "$route.path"(newPath) {
      this.path = newPath;
    },
  },

};
</script>

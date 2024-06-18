<template>
  <div class="min-h-screen overflow-auto bg-gray-100 w-1/5 ">
    <div class="bg-black py-2 pl-1">
      <h1 class="text-white">Company Name</h1>
    </div>
    <div v-for="(items, type) in navbarItemsByType" class="p-2" :key="type">
      <h2 v-if="type !== 'NONE'" class="text-gray-400 text-sm font-semibold">
        SAVED {{ type }}
      </h2>
      <ul>
        <li v-for="item in items" :key="item.id" class="mt-4">
          <router-link
            :to="item.link"
            class="flex items-center hover:text-blue-400"
            :class="{
              'text-blue-400': item.link === path,
            }"
          >
            <component :is="item.icon" v-if="item.icon" class="mr-4" />
            {{ item.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { navbarData } from "../../../mock/navbar";
import { computed,  ref, watch } from "vue";
import {
  HomeOutlined,
  FileOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined,
  BarChartOutlined,
  FileTextOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
export default {
  name: "NavBar",
  components: {
    HomeOutlined,
    FileOutlined,
    ShoppingCartOutlined,
    UsergroupAddOutlined,
    BarChartOutlined,
    FileTextOutlined,
    AppstoreAddOutlined,
  },
  setup() {
    const router = useRouter();
    const navbarItemsByType = computed(() => {
      return navbarData.reduce((acc, item) => {
        if (!acc[item.type]) {
          acc[item.type] = [];
        }
        acc[item.type].push(item);
        return acc;
      }, {});
    });
     const path = ref(router.currentRoute.value.path);

    watch(router.currentRoute, (newRoute) => {
      path.value = newRoute.path;
    });

    return {
      navbarItemsByType,
      path,
    };
  },
};
</script>
<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'

import { ref } from 'vue'
import { reactive } from 'vue'
import { useRouter } from 'vue-router';
import { lightTheme, darkTheme } from 'naive-ui';
import MyBack from './components/MyBack.vue'
import { useUsersStore } from "./store/user";
import { storeToRefs } from 'pinia';
import { NMessageProvider } from "naive-ui";

const store = useUsersStore();
const {
  isLogin
} = storeToRefs(store);
const style = ref('light');
const router = useRouter();
function changeStyle() {
  style.value = style.value === 'light' ? 'dark' : 'light';
}

</script>

<template>

  <n-config-provider :theme="style === 'light' ? lightTheme : darkTheme">
    <!-- 100%高度 -->
    <NLayout style="height: 100vh">
      <n-loading-bar-provider>
        <n-message-provider>
          <n-button @click="changeStyle" style="float: right">切换主题</n-button>
          <MyBack v-if="router.currentRoute.value.fullPath !== '/login'"
            style="float: left; justify-content: center;" />
          <router-view></router-view>
        </n-message-provider>


      </n-loading-bar-provider>
    </NLayout>
  </n-config-provider>
</template>

<style scoped>

</style>

<script setup>
import { useRouter } from 'vue-router';
import { IosArrowBack } from '@vicons/ionicons4';
const router = useRouter();
function goBack() {
  router.back();
}
</script>

<template>
  <n-button text style="font-size: 24px" @click="goBack">
    <n-icon>
      <IosArrowBack />
    </n-icon>

  </n-button>
</template>
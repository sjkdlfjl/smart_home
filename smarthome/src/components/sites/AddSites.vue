<script setup>
import { useMessage } from 'naive-ui'
import { post } from '../../function/request.js'
import { useRouter } from 'vue-router'
const router = useRouter();
const message = useMessage();
let model = ref({
  siteName: null,
});
const rules = {
  siteName: [
    {
      required: true,
      message: '请输入site名',
      trigger: ['blur', 'input'],

    }
  ],
};

async function onSubmit() {
  let res;
  console.log(model.value);
  try {
    console.log(model.value);
    res = await post(
      "/user/addSite",
      {
        siteName: model.value.siteName,
      },
    );
    console.log(res);
    if (res.data.status === 0) {
      message.success("创建成功");
      router.push('/sites');
    } else if (res.data.status === 1)
      message.error(res.data.message);
  } catch (error) {
    console.log(error);
    message.error("创建过程出错");
  }
}
</script>

<template>
  <n-gradient-text :size="24" type="success" class="n-gradient-text">
    创建site
  </n-gradient-text>
  <div class="addsites">
    <n-form :model="model" :rules="rules" :label-width="150">
      <n-form-item label="site名" path="siteName">
        <n-input v-model:value="model.siteName" placeholder="请输入site名称" />
      </n-form-item>
      <n-form-item>
        <n-button :disabled="(model.siteName === null)" round type="primary" @click="onSubmit"
          style="justify-content: center;">
          创建
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<style scoped>
.n-gradient-text {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  margin-top: 100px;
}

.addsites {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100%;
}
</style>
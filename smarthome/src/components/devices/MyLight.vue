<script setup>
import { ref } from 'vue' //一般不用所有属性用reactive
import { post } from '../../function/request.js'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue';
const router = useRouter();
const message = useMessage();
let deviceId = router.currentRoute.value.params.deviceId;
let roomId = router.currentRoute.value.params.roomId;
let res;
let device;
let model = ref({
  state: null,
  light: null
});
onMounted(async () => {
  try {
    res = await post(
      "/user/getDevice",
      { id: deviceId, type: "Light" },
    );
    if (res.data.status === 0) {
      message.success(res.data.message);
      device = res.data.device;
      model.value.state = device.state;
      model.value.light = device.light;
      console.log(model.value);
    } else if (res.data.status === 1)
      message.error(res.data.message);
  } catch (error) {
    console.log(error);
    message.error("打开device过程出错");
  }
})

async function onSubmit() {
  try {
    res = await post(
      "/user/setDevice",
      {
        id: deviceId,
        type: "Light",
        state: model.value.state,
        light: model.value.light
      },
    );
    console.log("data" + res.data);
    if (res.data.status === 0) {
      message.success(res.data.message);
    } else if (res.data.status === 1)
      message.error(res.data.message);
  } catch (error) {
    console.log(error);
    message.error("关闭device过程出错");
  }
  router.push('/room/' + roomId);
}
</script>

<template>
  <n-message-provider>
    <n-gradient-text :size="24" type="success" class="n-gradient-text">
      Light
    </n-gradient-text>
    <div class="register">
      <n-form ref="formRef" :model="model" :label-width="150">
        <n-form-item>
          <n-switch v-model:value="model.state" />
        </n-form-item>
        <n-form-item>
          <n-slider v-model:value="model.light" :step="1" />
        </n-form-item>
        <n-form-item>
          <n-input-number v-model:value="model.light" size="small" />
        </n-form-item>
        <n-form-item>
          <div style="width: 50px"></div>
          <n-button type="primary" @click="onSubmit">确定</n-button>
        </n-form-item>
      </n-form>
    </div>
  </n-message-provider>
</template>

<style  scoped>
.n-gradient-text {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  margin-top: 150px;
}

.register {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100%;
}
</style>
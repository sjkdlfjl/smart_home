<script setup>
// import { defineProps } from 'vue';
import { useMessage } from 'naive-ui'
import { post } from '../../function/request.js'
import { useRouter } from 'vue-router'
const router = useRouter();
const message = useMessage();
// defineProps({
//     id: String,
//     name: String,
//     hostName: String,
// });
const siteId = router.currentRoute.value.params.siteId;
let model = ref({
  roomName: null,
});
const rules = {
  roomName: [
    {
      required: true,
      message: '请输入room名',
      trigger: ['blur', 'input'],
    }
  ],
};

async function onSubmit() {
  let res;
  console.log(siteId);
  try {
    console.log(model.value);
    res = await post(
      "/user/addRoom",
      {
        roomName: model.value.roomName,
        siteId: siteId,
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
    创建room
  </n-gradient-text>
  <div class="addRooms">
    <n-form :model="model" :rules="rules" :label-width="150">
      <n-form-item label="room名" path="roomName">
        <n-input v-model:value="model.roomName" placeholder="请输入room名称" />
      </n-form-item>
      <n-form-item>
        <n-button :disabled="(model.roomName === null)" round type="primary" @click="onSubmit"
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

.addRooms {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100%;
}
</style>
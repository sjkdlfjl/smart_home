<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { post } from '../function/request.js'
import { useUsersStore } from "../store/user";

const store = useUsersStore();
//let { isLogin, token } = storeToRefs(store); //解构之后修改不行

let model = ref({
  username: null,
  password: null
});
const router = useRouter();
const message = useMessage();
const rules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: ['blur', 'input'],

    }

  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['blur', 'input'],
    }
  ]
};
async function onSubmit() {
  let res;
  console.log(model.value);
  try {
    console.log(model.value);
    res = await post(
      "/api/login",
      {
        username: model.value.username,
        password: model.value.password,
      },
    );
    console.log(res);
    if (res.data.status === 0) {
      message.success("登录成功");
      store.isLogin = true;
      store.token = res.data.token;
      localStorage.setItem("token", res.data.token);
      console.log(localStorage.getItem("token"));
      console.log("isLogin:" + store.isLogin);
      console.log("token:" + store.token);
      router.push('/sites');
    } else if (res.data.status === 1)
      message.error(res.message);
  } catch (error) {
    console.log(error);
    message.error("登录过程出错");
  }
}
function regist() {
  router.push('/registration');
}
</script>

<template>
  <n-gradient-text :size="24" type="success" class="n-gradient-text">
    智能家居管理系统
  </n-gradient-text>
  <div class="login">
    <!-- <n-card> -->
    <n-form :model="model" :rules="rules" :label-width="150">
      <n-form-item label="用户名" path="username">
        <n-input v-model:value="model.username" placeholder="输入用户名" />
      </n-form-item>
      <n-form-item label="密码" path="password">
        <n-input type="password" v-model:value="model.password" placeholder="输入密码" />
      </n-form-item>
      <n-form-item>
        <n-button :disabled="(model.username === null)" round type="primary" @click="onSubmit">
          登录
        </n-button>
        <span style="width: 40px"></span>
        <n-button type="primary" round @click="regist">注册</n-button>
      </n-form-item>
    </n-form>
    <!-- </n-card> -->
  </div>

</template>
<!-- // lang = 'css' 是给style确定语法规则；默认是css -->
<style scoped>
.n-gradient-text {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  margin-top: 100px;
}

.login {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100%;
}
</style>
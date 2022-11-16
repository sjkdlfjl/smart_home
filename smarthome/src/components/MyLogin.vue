<script setup>
import { ref } from 'vue'
let model = ref({
  username: null,
  password: null
});
const rules = ref({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: ['blur'],
      validator: (rule, value) => {
        if (!value) {
          return new Error("用户名不能为空");
        } else {

        }
        return true;
      }
    }

  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['blur'],
      validator: (rule, value) => {
        if (!value) {
          return new Error("密码不能为空");
        } else {

        }
        return true;
      }
    }
  ]
});
function onSubmit() {
  console.log(model.value);
}
</script>

<template>
  <div class="blank">
  </div>
  <n-gradient-text :size="24" type="success">
    智能家居管理系统
  </n-gradient-text>
  <div class="login">
    <!-- <n-card> -->
    <n-form :model="model" :rules="rules" :label-width="150">
      <n-form-item label="用户名" name="username">
        <n-input v-model:modelValue="model.username" label="请输入密码" />
      </n-form-item>
      <n-form-item label="密码" name="password">
        <n-input v-model:modelValue="model.password" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onSubmit">登录</n-button>
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
}

.login {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100%;
}

.blank {
  height: 100px;
}
</style>
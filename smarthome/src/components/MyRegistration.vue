<script setup>
import { ref } from 'vue' //一般不用所有属性用reactive
import { post, ping } from '../function/request.js'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router';
const router = useRouter();
const formRef = ref(null);
let model = ref({
  username: null,
  password: null,
  repeatPassword: null,
  phoneNumber: null
});
const message = useMessage();
const rules = {
  username: [
    {
      required: true,
      // message: '请输入用户名',
      trigger: ['blur', , 'input'],
      validator: (rule, value) => {
        if (!value) {
          return new Error("用户名不能为空");
        } else if (value.length > 20) {
          return new Error("用户名长度不能大于20位");
        } else {
          return true;
        }
      }
    }

  ],
  password: [
    {
      required: true,
      // message: '请输入密码',
      trigger: ['blur', 'input'],
      validator: (rule, value) => {
        if (!value) {
          return new Error("密码不能为空");
        } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)) {//(?![0-9]+$)表示排除掉只有数字的组合，(?![a-zA-Z]+$)表示排除掉只有字母的组合，[0-9A-Za-z]表示必须有字母或数字
          return new Error("密码必须为6-16位数字和字母组合");
        }
        return true;
      }
    }
  ],
  repeatPassword: [
    {
      required: true,
      // message: '请重复密码',
      trigger: ['blur', 'input'],
      validator: (rule, value) => {
        if (value !== model.value.password) {
          return new Error("两次密码不一样");
        }
        return true;
      }
    }
  ],
  phoneNumber: [
    {
      required: true,
      // message: '请输入手机号',
      trigger: ['blur', 'input'],
      validator: (rule, value) => {
        if (!/^[1-9][0-9]{10}$/.test(value)) {
          return new Error("手机号不符合规范");
        }
        return true;
      }
    }
  ],
};

function onSubmit() {

  let res;
  formRef.value?.validate(async (errors) => {
    //ping();//测试前端与后端是否连接
    if (!errors) {
      try {
        console.log(model.value);
        res = await post(
          "/api/registration",
          {
            username: model.value.username,
            password: model.value.password,
            phoneNumber: model.value.phoneNumber
          },

        );
        if (res.data.status === 0) {
          message.success("注册成功");
          router.push("/login");
        }

        else if (res.data.status === 1)
          message.error("账号已存在");
      } catch (error) {
        console.log(error);
        message.error("注册过程出错");
      }
    } else {
      console.log(errors);
      message.error("注册信息不符合规范");
    }
  });
}
</script>

<template>
  <n-message-provider>
    <n-gradient-text :size="24" type="success" class="n-gradient-text">
      注册
    </n-gradient-text>
    <div class="register">
      <n-form ref="formRef" :model="model" :rules="rules" :label-width="150">
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="model.username" placeholder="输入用户名" />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input v-model:value="model.password" placeholder="输入密码" />
        </n-form-item>
        <n-form-item label="重复密码" path="repeatPassword" :disabled="!model.password">
          <n-input type="password" v-model:value="model.repeatPassword" placeholder="重复密码" />
        </n-form-item>
        <n-form-item label="手机号" path="phoneNumber">
          <n-input v-model:value="model.phoneNumber" placeholder="输入手机号" />
        </n-form-item>
        <n-form-item>
          <div style="width: 50px"></div>
          <n-button type="primary" @click="onSubmit">注册</n-button>
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
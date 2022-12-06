<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue' //一般不用所有属性用reactive
import { post } from '../../function/http-common.js'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
const router = useRouter();
const message = useMessage();
let res;
let pic = "http://localhost:3000/123.jpeg";
let roomId = router.currentRoute.value.params.roomId;
onMounted(async () => {//获取background
  console.log("mounted");
  // try {
  //   res = await post(
  //     "/user/getPic",
  //     {},
  //   );
  //   if (res.data.status === 0) {
  //     message.success(res.data.message);
  //     sitesRefs.value = res.data.pic;
  //     roomRefs.value = res.data.rooms;
  //     console.log(roomRefs.value);
  //   } else if (res.data.status === 1)
  //     message.error(res.data.message);
  // } catch (error) {
  //   console.log(error);
  //   message.error("打开Sites过程出错");
  // }
});
const customRequest = ({
  file,
  data,
  headers,
  withCredentials,
  action,
  onFinish,
  onError,
  onProgress
}) => {
  const formData = new FormData();
  formData.append("roomId", roomId);
  formData.append("pic", file.file);
  console.log("upload " + file.name);
  console.log(formData);

  post(
    "/upload",
    formData,
  );
  console.log("upload finished");
  if (res.status === 200) {
    message.success(res.data.message);
  } else if (res.status === 404)
    message.error(res.message);

};

async function beforeUpload(data) {
  if (data.file.file?.type !== "image/png" && data.file.file?.type !== "image/jpeg" && data.file.file?.type !== "image/jpg") {
    message.error("只能上传png或jpg或jpeg格式的图片");
    return false;
  }
  return true;
}

function draw() {
  let canvas = document.getElementById('tutorial');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
  }
}
</script>

<template>
  <n-gradient-text :size="24" type="success" class="n-gradient-text">
    My Sites
  </n-gradient-text>
  <div onload="draw();" class="center">
    <canvas id="tutorial" class="canvas">

    </canvas>
    <img :src="pic" width="150" height="150" alt="123" />

  </div>
  <n-upload :custom-request="customRequest" @before-upload="beforeUpload" class="center">
    <n-button>上传文件</n-button>
  </n-upload>


</template>

<style>
.n-gradient-text {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  margin-top: 100px;
}

.canvas {
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 250px;
  border: 1px solid black;
  background-color: gray;
}


.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
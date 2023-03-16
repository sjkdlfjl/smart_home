<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue' //一般不用所有属性用reactive
import { filePost } from '../../function/http-common.js'
import { post } from '../../function/request.js'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import lightImg from '../../assets/light.jpeg'
import switchImg from '../../assets/switch.jpeg'
import sensorImg from '../../assets/sensor.jpeg'
const router = useRouter();
const message = useMessage();
const imagWidth = 30;
let res;
let chosenDevice = -1; //选中的设备下标
let isMouseDown = false; //鼠标是否按下
// let pic = "http://localhost:3000/123.jpeg";
let pic = ref("");
let devices = ref([]);
let imgs = ref([]);
let roomId = router.currentRoute.value.params.roomId;
let canvas;
let ctx;
let value = ref(null);
let bg;
const options = [
  {
    label: "Light",
    value: "Light",
  },
  {
    label: "Switch",
    value: "Switch"
  },
  {
    label: "Sensor",
    value: "Sensor"
  }];

onMounted(async () => {//获取background和devices
  console.log("mounted");
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');
  try {
    res = await post(
      "/getPic",
      { roomId: roomId },
    );
    console.log(res);
    if (res.data.status === 200) {
      message.success(res.data.message);
      pic = "http://localhost:3000/" + res.data.pic;
      console.log('pic');
      console.log(res.data.pic);
      devices.value = res.data.devices;
    } else if (res.data.status === 404)
      message.error(res.data.message);
  } catch (error) {
    console.log(error);
    message.error("打开图片过程出错");
  }
  bg = new Image();  //画背景
  bg.src = pic;
  bg.onload = function () {
    drawImage(bg, 0, 0, 400);
  }
  addImag(); //创建imags
  canvas.addEventListener('touchstart', function (e) {
    isMouseDown = true;
    let top = canvas.offsetTop;
    let left = canvas.offsetLeft;
    let x = e.touches[0].clientX - left;
    let y = e.touches[0].clientY - top;
    let lastChosen = chosenDevice;
    chosenDevice = whichChosen(x, y);
    if (lastChosen == chosenDevice) {
      // console.log("type" + devices.value[chosenDevice].type);
      if (devices.value[chosenDevice].type == "Light")
        router.push({ path: "/room/" + roomId + "/light/" + devices.value[chosenDevice].id });
      else if (devices.value[chosenDevice].type == "Switch")
        router.push({ path: "/room/" + roomId + "/switch/" + devices.value[chosenDevice].id });
      else if (devices.value[chosenDevice].type == "Sensor")
        router.push({ path: "/room/" + roomId + "/sensor/" + devices.value[chosenDevice].id });
    }
    // console.log("mousedown" + x, y);
  }, false);
  canvas.addEventListener('touchend', function (e) {
    // console.log("mouseup" + e.offsetX, e.offsetY);
    isMouseDown = false;
  }, false);
  // canvas.addEventListener('doubleTap', function (e) {
  //   console.log("dbl");
  // }, false);
  canvas.addEventListener('touchmove', function (e) {
    // console.dir(canvas.offsetTop);
    let top = canvas.offsetTop;
    let left = canvas.offsetLeft;
    let x = e.touches[0].clientX - left;
    let y = e.touches[0].clientY - top;
    // x < imagWidth / 2 ? x = imagWidth / 2 : x;
    // x > canvas.width - imagWidth / 2 ? x = canvas.width - imagWidth / 2 : x;
    // y < imagWidth / 2 ? y = imagWidth / 2 : y;
    // y > canvas.height - imagWidth / 2 ? y = canvas.height - imagWidth / 2 : y;
    if (isMouseDown && chosenDevice !== -1) {
      devices.value[chosenDevice].x = x;
      devices.value[chosenDevice].y = y;
      // console.log("chosenDevice:" + devices.value[chosenDevice].x, devices.value[chosenDevice].y);
      drawAll();
    }
  }, false);

});

onBeforeUnmount(async () => {
  console.dir("unmounted");
  console.log(devices.value);
  try {
    res = await post(
      "/user/storeDevices",
      { devices: devices.value },
    );
    if (res.data.status === 0) {
      message.success(res.data.message);
    } else if (res.data.status === 1)
      message.error(res.data.message);
  } catch (error) {
    console.log(error);
    message.error("保存devices过程出错");
  }
})



function whichChosen(x, y) {
  for (let i = 0; i < devices.value.length; i++) {
    if (x > devices.value[i].x && x < devices.value[i].x + imagWidth && y > devices.value[i].y && y < devices.value[i].y + imagWidth) {
      console.log("chosen:" + i);
      return i;
    }
  }
  return -1;
}

//在mounted里做img.onload
function addImag() {
  for (let i = 0; i < devices.value.length; i++) {
    let img = new Image();
    switch (devices.value[i].type) {
      case "Light":
        img.src = lightImg;
        break;
      case "Switch":
        img.src = switchImg;
        break;
      case "Sensor":
        img.src = sensorImg;
        break;
      default:
        break;
    }
    console.log(devices.value[i]);
    img.onload = function () {
      drawImage(img, devices.value[i].x, devices.value[i].y, imagWidth);
    }
    // imgs.value.push(img.src);
  }
}


function drawImage(img, x, y, Width) { //等比缩放
  var scale = 1;
  var tt = Width; //缩放后的最大宽度
  console.log(img.width, img.height);
  if (img.width > tt || img.height > tt) {
    if (img.width > img.height) {
      scale = tt / img.width;
    } else {
      scale = tt / img.height;
    }
  }
  console.log(ctx.width, ctx.height);
  console.log(canvas.width, canvas.height);
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

}

function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  for (let i = 0; i < devices.value.length; i++) {
    let img = new Image();
    switch (devices.value[i].type) {
      case "Light":
        img.src = lightImg;
        break;
      case "Switch":
        img.src = switchImg;
        break;
      case "Sensor":
        img.src = sensorImg;
        break;
      default:
        break;
    }
    ctx.drawImage(img, devices.value[i].x, devices.value[i].y, imagWidth, imagWidth);
  }
}

const customRequest = ({
  file,
}) => {
  const formData = new FormData();
  formData.append("roomId", roomId);
  formData.append("pic", file.file);
  console.log("upload " + file.name);
  console.log(formData);

  filePost(
    "/upload",
    formData,
  );
  console.log("upload finished");
  if (res.status === 200) {
    // pic = res.data.pic;
    router.go(0);
    message.success("上传成功");
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

async function addDevice() {
  console.log(value.value);
  if (value.value === null) {
    message.error("请选择设备类型");
    return;
  }
  try {
    res = await post(
      "/user/addDevice",
      {
        roomId: roomId,
        type: value.value
      },
    );
    console.log(res);
    if (res.data.status === 200) {
      message.success(res.data.message);
      devices.push(res.data.device);
      drawAll();
      console.log(res.data);
      router.go(0);
    } else if (res.data.status === 404)
      message.error(res.data.message);
  } catch (error) {
    console.log(error);
    message.error("创建device过程出错");
  }
}



</script>

<template>
  <n-gradient-text :size="24" type="success" class="n-gradient-text">
    My Room
  </n-gradient-text>
  <n-upload :custom-request="customRequest" @before-upload="beforeUpload" class="center">
    <n-button>上传背景图片</n-button>
  </n-upload>
  <div class="center">
    <canvas id="myCanvas" width="400" height="400" class="canvas">
    </canvas>
    <!-- <img :src="pic" width="150" height="150" alt="123" /> -->
  </div>
  <div class="select_center">
    <n-select v-model:value="value" :options="options" placeholder="选择设备类型" placement="bottom-start" />
  </div>
  <div class="center">
    <n-button @click="addDevice">添加设备</n-button>
  </div>

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
  border: 1px solid black;
  background-color: gray;
}


.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.select_center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  margin-left: 120px;
}
</style>
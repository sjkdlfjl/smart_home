<script setup>
import { ref } from 'vue' //一般不用所有属性用reactive
import { post } from '../../function/request.js'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue';
const router = useRouter();
const message = useMessage();
let res;
let sitesRefs = ref([]);
let roomRefs = ref([]); //二维数组

//onMounted 钩子可以用来在组件完成初始渲染并创建 DOM 节点后运行代码
onMounted(async () => {
  try {
    res = await post(
      "/user/getSites",
      {},
    );
    if (res.data.status === 0) {
      message.success(res.data.message);
      sitesRefs.value = res.data.sites;
      roomRefs.value = res.data.rooms;
      console.log(roomRefs.value);
    } else if (res.data.status === 1)
      message.error(res.data.message);
  } catch (error) {
    console.log(error);
    message.error("打开Sites过程出错");
  }
})

function addSite() {
  router.push('/addSites');
}

function addRoom(siteId) {
  router.push('/addRooms/' + siteId);
}

function enterRoom(roomId) {
  router.push('/room/' + roomId);
}
</script>


<template>
  <n-gradient-text :size="24" type="success" class="n-gradient-text">
    My Sites
  </n-gradient-text>

  <div class="right">
    <n-button @click="addSite">创建site</n-button>
  </div>
  <div>
    <n-collapse arrow-placement="right">
      <n-collapse-item v-for="(site, index) in sitesRefs">
        <template #header>
          <div class="center full">
            <n-text>{{ site.name }}</n-text>
          </div>
        </template>
        <div class="center" v-for="room in roomRefs[index]" @click="enterRoom(room.id)">
          <n-text style="font-size:18px">{{ room.name }}</n-text>
        </div>
        <div class="center">
          <n-button text style="font-size: 24px" @click="addRoom(site.id)">
            <n-icon size="30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  d="M368.5 240H272v-96.5c0-8.8-7.2-16-16-16s-16 7.2-16 16V240h-96.5c-8.8 0-16 7.2-16 16 0 4.4 1.8 8.4 4.7 11.3 2.9 2.9 6.9 4.7 11.3 4.7H240v96.5c0 4.4 1.8 8.4 4.7 11.3 2.9 2.9 6.9 4.7 11.3 4.7 8.8 0 16-7.2 16-16V272h96.5c8.8 0 16-7.2 16-16s-7.2-16-16-16z" />
              </svg>
            </n-icon>
          </n-button>
        </div>
      </n-collapse-item>
    </n-collapse>
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

.right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.full {
  flex-grow: 1;
}
</style>
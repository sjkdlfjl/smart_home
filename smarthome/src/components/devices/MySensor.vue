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
    temprature: null,
    transTemprature: null,
    humidity: null
});
const ft = (value) => `${value}%`
function ftt(value) {
    return (value / 100 * 16 + 16).toFixed(1) + '℃';
}
onMounted(async () => {
    try {
        res = await post(
            "/user/getDevice",
            { id: deviceId, type: "Sensor" },
        );
        if (res.data.status === 0) {
            message.success(res.data.message);
            device = res.data.device;
            model.value.temprature = device.temprature;
            model.value.humidity = device.humidity;
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
                type: "Sensor",
                humidity: model.value.humidity,
                temprature: model.value.temprature
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
            Sensor
        </n-gradient-text>
        <div class="register">
            <n-form ref="formRef" :model="model" :label-width="250">
                <n-form-item label="湿度">
                    <n-slider v-model:value="model.humidity" :step="1" :format-tooltip="ft" />
                </n-form-item>
                <n-form-item label="温度">
                    <n-slider v-model:value="model.temprature" :step="1" :format-tooltip="ftt" />
                </n-form-item>
                <n-form-item>
                    <n-button type="primary" @click="onSubmit" tyle="margin-left: 200;">确定</n-button>
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
    margin-inline: 100px;
}
</style>
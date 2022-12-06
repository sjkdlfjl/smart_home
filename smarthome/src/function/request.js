import axios from "axios";

const request = axios.create({
    timeout: 5000,
    headers: {
        "Access-Control-Allow-Origin": "*",
        'Authorization': null,

    },
    withCredentials: true,
});

//请求拦截器
request.interceptors.request.use(
    config => {
        //先从浏览器的回话存储中提取token值
        const tokenStr = localStorage.getItem('token');
        if (tokenStr) {
            config.headers['Authorization'] = "Bearer " + tokenStr;
            //console.log("Bearer " + tokenStr);
        }
        return config;
    })

export const ping = async() => {
    console.log("ping");
    console.log(await request.get("/ping"));
};

export const post = async(url, data) => {
    try {
        console.log("post", url, data);
        const response = await request.post(url, data);
        // const ret = response.data;
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // 请求已经成功发起，但没有收到响应
                // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
                // 而在node.js中是 http.ClientRequest 的实例
                console.log(error.request);
            } else {
                // 发送请求时出了点问题
                console.log("Error", error.message);
            }
            console.log(error.config);
        }
        throw error;
    }
}
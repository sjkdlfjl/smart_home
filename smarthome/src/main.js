import { createApp, VueElement } from 'vue'
import './style.css'
import App from './App.vue'

import router from './router'
import axios from 'axios'
import { createPinia } from "pinia";
const pinia = createPinia();
//import ElementPlus from 'element-plus'
//import 'element-plus/dist/index.css'

//app.use(ElementPlus)
//全局配置axios
//axios.defaults.baseURL = 'http://www.escook.cn'


//App.prototype.$http = axios //用vue.prototype属性来自定义变量

createApp(App).use(router).use(pinia).mount('#app');
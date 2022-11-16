import { createWebHashHistory, createRouter } from 'vue-router'
import Login from '../components/MyLogin.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login, name: 'login' },
    ],
})

export default router
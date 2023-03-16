import { createWebHashHistory, createRouter } from 'vue-router'
import Login from '../components/MyLogin.vue'
import Registration from '../components/MyRegistration.vue'
import Sites from '../components/sites/MySites.vue'
import AddSites from '../components/sites/AddSites.vue'
import AddRooms from '../components/rooms/AddRooms.vue'
import Room from '../components/rooms/MyRoom.vue'
import Light from '../components/devices/MyLight.vue'
import Sensor from '../components/devices/MySensor.vue'
import Switch from '../components/devices/MySwitch.vue'
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login, name: 'login' },
        { path: '/registration', component: Registration, name: 'registration' },
        { path: '/sites', component: Sites, name: 'sites' },
        { path: '/addSites', component: AddSites, name: 'addSites' },
        { path: '/addRooms/:siteId', component: AddRooms, name: 'addRoomes' },
        { path: '/room/:roomId', component: Room, name: 'room' },
        { path: '/room/:roomId/light/:deviceId', component: Light, name: 'light' },
        { path: '/room/:roomId/sensor/:deviceId', component: Sensor, name: 'sensor' },
        { path: '/room/:roomId/switch/:deviceId', component: Switch, name: 'switch' },
    ],
})

router.beforeEach((to, from) => {
    if (to.name !== 'login' && to.name !== 'registration' && !localStorage.getItem('token')) {
        return '/login'
    }
})
export default router
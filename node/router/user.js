const express = require('express')
    // 创建路由对象
const router = express.Router()

// 导入用户路由处理函数模块
const apiHandler = require('../router_handler/api')
const userHandler = require('../router_handler/user')
const controller = require("../controller/fileController");

// 注册新用户
router.post('/api/registration', apiHandler.regUser)
    // 登录
router.post('/api/login', apiHandler.login)

router.get("/ping", (req, res) => {
    console.log("ping");
    res.send("pong");
});

//sites
router.post("/user/getSites", userHandler.getSites);

router.post("/user/addSite", userHandler.addSite);

router.post("/user/addRoom", userHandler.addRoom);

router.post("/user/addDevice", userHandler.addDevice);
router.post("/user/storeDevices", userHandler.storeDevices);
router.post("/user/getDevice", userHandler.getDevice);
router.post("/user/setDevice", userHandler.setDevice);
router.post("/upload", controller.upload);
router.post("/getPic", controller.getPic);
// 将路由对象共享出去
module.exports = router
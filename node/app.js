const express = require('express')
const { Sequelize, DataTypes, Op } = require('sequelize');
const bodyparser = require('body-parser');
// 创建 express 的服务器实例
const app = express()
import sequelize from './db/index.js'
const fs = require("fs");
// 导入 cors 中间件
const cors = require('cors')
    // 将 cors 注册为全局中间件
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(bodyparser.json());
app.use(sequelize);
const userRouter = require('./router/user')
app.use('/api', userRouter)



// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, function() {
    console.log('api server running at http://127.0.0.1:3007')
})
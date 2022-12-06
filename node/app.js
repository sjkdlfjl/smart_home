const sequelize = require('./db/index.js')
const express = require('express')
const bodyparser = require('body-parser');
const multer = require('multer') //上传文件
const upload = multer({ dest: "uploads/" });

// 创建 express 的服务器实例
const app = express()
const { expressjwt: jwt } = require('express-jwt'); //用来解析还原token
const secretKey = 'secret123^_^'; //密钥
// const fs = require("fs");
// 导入 cors 中间件
const cors = require('cors')
app.use(cors());
global.__basedir = __dirname; //  __dirname获取当前目录
// var corsOptions = {
//     origin: "http://localhost:3000"
// };
// app.use(cors(corsOptions));
// 将 cors 注册为全局中间件
app.use("/", express.static('../smarthome/dist')); //静态文件
app.use("/", express.static('./uploads'));;

//解析表单数据中间件
// app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(bodyparser.json());
const userRouter = require('./router/user')
    //只要配置成功express-jwt这个中间件就可以把解析出来的用户信息，挂载到req.auth属性上  /^\/api\//, 
app.use(jwt({ secret: secretKey, algorithms: ["HS256"] }).unless({ path: [/^(?!(\/user\/))/] })); //unless指定哪些不需要权限


app.use(userRouter)

//这个pic名字必须和前端formdata里的对应
app.post('/upload', upload.single('pic'), function(req, res, next) {
    console.log("upload");
    console.log(req.file);

})

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3000, function() {
    console.log('api server running at 3000')
})
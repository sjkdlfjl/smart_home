/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
// 导入数据库操作模块
const sequelize = require('../db/index');
// const { Sequelize, DataTypes, Op } = require('sequelize');
const jsonwebtoken = require('jsonwebtoken'); //用来生成token
const secretKey = 'secret123^_^'; //密钥
// const { use } = require('../router/user');
const { users } = require('../db/index');
//

// 注册用户的处理函数

function RndNum(n) { //生成随机数
    let rnd = "";
    for (var i = 0; i < n; i++)
        rnd += Math.floor(Math.random() * 10);
    return rnd;

}

exports.regUser = async(req, res) => {
    console.log("regUser" + req.body.username + req.body.password);
    let newId = RndNum(7);
    while (true) {
        let user = await users.findOne({ where: { id: newId } });
        if (user == null) {
            break;
        }
        newId = RndNum(8);
    }
    let user = await users.findOne({ where: { name: req.body.username } });
    if (user != null) {
        return res.send({ status: 1, message: '用户名已存在' });
    } else {
        await users.create({
            id: newId,
            name: req.body.username,
            password: req.body.password,
            phone: req.body.phoneNumber
        })
    }
    res.send({ status: 0, message: '注册成功' });
}

// 登录的处理函数
exports.login = async(req, res) => {
    //console.log("login" + req.body.username + req.body.password);
    let user = await users.findOne({ where: { name: req.body.username } });
    if (user === null) {
        return res.send({ status: 1, message: '用户名不存在' });
    } else if (user.password != req.body.password) {
        return res.send({ status: 1, message: '密码错误' });
    } else {
        const token = jsonwebtoken.sign({ username: req.body.username }, secretKey, { expiresIn: '1h' });
        //console.log("success" + token);
        res.send({ status: 0, message: '登录成功', token: token });
    }
}
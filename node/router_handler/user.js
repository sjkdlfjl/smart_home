const sequelize = require('../db/index');
const { Sequelize, DataTypes, Op } = require('sequelize');

const sites = sequelize.define('sites', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: Sequelize.STRING(20),
    hostName: Sequelize.STRING(20),
}, {
    timestamps: false,
    freezeTableName: true
});

const rooms = sequelize.define('rooms', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: Sequelize.STRING(20),
    siteId: Sequelize.STRING(20),
    pic: Sequelize.STRING(20),
}, {
    timestamps: false,
    freezeTableName: true
});
// 注册用户的处理函数

function RndNum(n) { //生成随机数
    let rnd = "";
    for (var i = 0; i < n; i++)
        rnd += Math.floor(Math.random() * 10); //生成0-9的随机数
    return rnd;

}

exports.getSites = async(req, res) => {
    console.log("getSites");
    // console.log(req.auth);
    let username = req.auth.username;
    let sitesList = await sites.findAll({
        where: {
            hostName: username
        }
    });
    // console.log(sitesList);
    let roomLists = [];
    for (let i = 0; i < sitesList.length; i++) {
        let room = await rooms.findAll({
            where: {
                siteId: sitesList[i].id
            }
        });
        roomLists.push(room);
    }
    // console.log(roomLists);
    res.send({ status: 0, message: '获取成功', sites: sitesList, rooms: roomLists });
}

exports.addSite = async(req, res) => {
    console.log("addSite");
    let username = req.auth.username;
    let site = await sites.findOne({
        where: {
            hostName: username,
            name: req.body.siteName
        }
    });

    if (site != null) {
        res.send({ status: 1, message: '该site已存在' });
    } else {
        let id = RndNum(10);
        let newSite = await sites.findOne({
            where: {
                id: id
            }
        });
        while (newSite != null) {
            id = RndNum(10);
            newSite = await sites.findOne({
                where: {
                    id: id
                }
            });
        }
        await sites.create({
            id: id,
            name: req.body.siteName,
            hostName: username
        });
        res.send({ status: 0, message: '添加成功' });
    }
}

exports.addRoom = async(req, res) => {
        console.log("addRoom");
        let siteId = req.body.siteId;
        let roomName = req.body.roomName;
        let room = await rooms.findOne({
            where: {
                siteId: siteId,
                name: roomName
            }
        });

        if (room != null) {
            res.send({ status: 1, message: '该room已存在' });
        } else {
            let id = RndNum(10);
            let newRoom = await rooms.findOne({
                where: {
                    id: id
                }
            });
            while (newRoom != null) {
                id = RndNum(10);
                newRoom = await rooms.findOne({
                    where: {
                        id: id
                    }
                });
            }
            await rooms.create({
                id: id,
                name: roomName,
                siteId: siteId
            });
            res.send({ status: 0, message: '添加成功' });
        }
    }
    // exports.regUser = async(req, res) => {
    //     console.log("regUser" + req.body.username + req.body.password);
    //     let newId = RndNum(7);
    //     while (true) {
    //         let user = await users.findOne({ where: { id: newId } });
    //         if (user == null) {
    //             break;
    //         }
    //         newId = RndNum(8);
    //     }
    //     let user = await users.findOne({ where: { name: req.body.username } });
    //     if (user != null) {
    //         return res.send({ status: 1, message: '用户名已存在' });
    //     } else {
    //         await users.create({
    //             id: newId,
    //             name: req.body.username,
    //             password: req.body.password,
    //             phone: req.body.phoneNumber
    //         })
    //     }
    //     res.send({ status: 0, message: '注册成功' });
    // }

// // 登录的处理函数
// exports.login = async(req, res) => {
//     console.log("login" + req.body.username + req.body.password);
//     let user = await users.findOne({ where: { name: req.body.username } });
//     if (user === null) {
//         return res.send({ status: 1, message: '用户名不存在' });
//     } else if (user.password != req.body.password) {
//         return res.send({ status: 1, message: '密码错误' });
//     } else {
//         const token = jsonwebtoken.sign({ username: req.body.username }, secretKey, { expiresIn: '1h' });
//         console.log("success" + token);
//         res.send({ status: 0, message: '登录成功', token: token });
//     }
// }
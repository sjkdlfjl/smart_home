const { rooms, sites, devices, lights, sensors, switches } = require('../db/index');

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

exports.addDevice = async(req, res) => {
    console.log("addDevice");
    let roomId = req.body.roomId;
    let type = req.body.type;
    console.log(type);
    let deviceId = RndNum(12);
    let device = await devices.findOne({
        where: {
            id: deviceId
        }
    });
    while (device != null) {
        deviceId = RndNum(12);
        device = await devices.findOne({
            where: {
                id: deviceId
            }
        });
    }
    await devices.create({
        id: deviceId,
        roomId: roomId,
        type: type,
        x: 25,
        y: 25
    });
    switch (type) {
        case 'Light':
            await lights.create({
                id: deviceId,
                state: false,
                light: 0
            });
            break;
        case 'Sensor':
            await sensors.create({
                id: deviceId,
                temperature: 26,
                humidity: 50
            });
            break;
        case 'Switch':
            await switches.create({
                id: deviceId,
                state: false
            });
            break;
        default:
            console.log("device type error");
    }
    res.send({ status: 0, message: '添加成功' });
}

exports.storeDevices = async(req, res) => {
    console.log("storeDevices");
    let devicess = req.body.devices;
    console.log(req.body.devices);
    for (let i = 0; i < req.body.devices.length; i++) {
        let device = req.body.devices[i];
        let id = device.id;
        let x = device.x;
        let y = device.y;
        await devices.update({
            x: x,
            y: y
        }, {
            where: {
                id: id
            }
        });
    }
    res.send({ status: 0, message: '保存成功' });
}
exports.getDevice = async(req, res) => {
    console.log("getDevice");
    let id = req.body.id;
    if (req.body.type == 'Light') {
        let light = await lights.findOne({
            where: {
                id: id
            }
        });
        // console.log("light");
        res.send({ status: 0, message: '获取成功', device: light });
    } else if (req.body.type == 'Sensor') {
        let sensor = await sensors.findOne({
            where: {
                id: id
            }
        });
        res.send({ status: 0, message: '获取成功', device: sensor });
    } else if (req.body.type == 'Switch') {
        let sw = await switches.findOne({
            where: {
                id: id
            }
        });
        res.send({ status: 0, message: '获取成功', device: sw });
    } else {
        res.send({ status: 1, message: '获取失败' });
    }
}
exports.setDevice = async(req, res) => {
        console.log("setDevice");
        let id = req.body.id;
        let type = req.body.type;
        console.log(req.body.state + req.body.light);
        if (type == "Light") {
            console.log("light");
            await lights.update({
                state: req.body.state,
                light: req.body.light
            }, {
                where: {
                    id: id
                }
            });
        } else if (type == "Switch") {
            await switches.update({
                state: req.body.state,
            }, {
                where: {
                    id: id
                }
            });
        } else if (type == "Sensor") {
            await sensors.update({
                temperature: req.body.temperature,
                humidity: req.body.humidity
            }, {
                where: {
                    id: id
                }
            });
        }
        res.send({ status: 0, message: '设置成功' });
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
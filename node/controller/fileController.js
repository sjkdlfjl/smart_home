const fs = require("fs");
const { receiveMessageOnPort } = require("worker_threads");
const { rooms, devices } = require("../db/index");

const uploadFile = require("../uploadFunc/upload");
const upload = async(req, res) => {
    try {
        await uploadFile(req, res);
        console.log(req.body);

        if (req.file == undefined) {
            return res.status(404).send({ message: "请选择要上传的文件" });
        }
        const roomId = req.body.roomId;
        const room = await rooms.findOne({
            where: {
                id: roomId
            }
        });
        let fileName = req.file.originalname;
        fileName = roomId + fileName;
        room.pic = fileName;
        await room.save();
        res.status(200).send({
            message: "图片上传成功: " + req.file.originalname,
            pic: fileName,
        });
    } catch (err) {
        res.status(500).send({
            message: `无法图片上传: ${req.file.originalname}. ${err}`,
        });
    }
};
const getPic = async(req, res) => {
    let directoryPath = __basedir + "/uploads/";
    const roomId = req.body.roomId;
    console.log(req.body);
    console.log(roomId);
    const room = await rooms.findOne({
        where: {
            id: roomId
        }
    });
    if (room == null) {
        return res.send({
            status: 404,
            message: "房间不存在"
        });
    }
    if (room.pic == null) {
        return res.send({
            status: 404,
            message: "房间没有图片"
        });
    }
    const myDevices = await devices.findAll({
        where: {
            roomId: roomId
        }
    });
    const pic = room.pic;
    console.log("devices" + myDevices);
    console.log(myDevices.length);
    res.send({
        status: 200,
        pic: pic,
        devices: myDevices,
        message: "找到文件。"
    });

    // fs.readdir(directoryPath, function(err, files) {
    //     if (err) {
    //         res.send({
    //             status: 500,
    //             message: "没有找到文件。",
    //         });
    //     }
    //     files.forEach((file) => {
    //         if (file === pic) {
    //             res.send({
    //                 status: 200,
    //                 pic: pic,
    //                 message: "找到文件。"
    //             });
    //         }
    //     });
    //     res.send({
    //         status: 500,
    //         message: "没有找到文件。",
    //     });
    // });
};
const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/";
    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "无法获取文件。" + err,
            });
        }
    });
};
module.exports = {
    upload,
    getPic,
    download,
};
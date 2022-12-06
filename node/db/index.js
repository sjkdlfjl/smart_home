// 导入 mysql 模块
const { Sequelize } = require('sequelize');


// 创建数据库连接对象
const sequelize = new Sequelize('smart_home', 'root', '192837', {
    host: 'localhost',
    dialect: 'mysql',
});


// 向外共享 db 数据库连接对象
module.exports = sequelize
// 导入 mysql 模块
const { Sequelize, DataTypes } = require('sequelize');


// 创建数据库连接对象
const sequelize = new Sequelize('smart_home', 'root', '192837', {
    host: 'localhost',
    dialect: 'mysql',
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

const users = sequelize.define('users', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: Sequelize.STRING(20),
    password: Sequelize.STRING(16),
    phone: Sequelize.STRING(11),
}, {
    timestamps: false,
    freezeTableName: true
});

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

const devices = sequelize.define('devices', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    roomId: Sequelize.STRING(10),
    type: DataTypes.ENUM('Light', 'Switch', 'Sensor'),
    x: Sequelize.INTEGER,
    y: Sequelize.INTEGER,
}, {
    timestamps: false,
    freezeTableName: true
});

const lights = sequelize.define('lights', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    state: DataTypes.BOOLEAN,
    light: DataTypes.DOUBLE,
}, {
    timestamps: false,
    freezeTableName: true
});

const switches = sequelize.define('switches', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    state: DataTypes.BOOLEAN,
}, {
    timestamps: false,
    freezeTableName: true
});

const sensors = sequelize.define('sensors', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    temperature: DataTypes.DOUBLE,
    humidity: DataTypes.DOUBLE,
}, {
    timestamps: false,
    freezeTableName: true
});
// 向外共享 db 数据库连接对象
module.exports = {
    sequelize,
    rooms,
    users,
    sites,
    devices,
    lights,
    switches,
    sensors
}
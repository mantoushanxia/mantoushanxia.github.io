// data.js - 扫码移车系统数据库
// 格式: ID,电话1,电话2,车主,车辆信息,备注
// 每行一条记录，用逗号分隔

window.VehicleDB = {
    // ================= 数据记录 =================
    "A123B4": ["13900000001", "13900000002", "王先生", "黑色奥迪A6", "工作日停靠"],
    "A696G1": ["13953128666", "18253136565", "张先生", "白色丰田卡罗拉", "鲁A·696G1"],
    "B777X8": ["13800138000", "13900139000", "李女士", "红色特斯拉Model 3", "充电车辆"],
    "C888D9": ["13712345678", "13587654321", "陈先生", "蓝色宝马5系", "临时停靠"],
    "D555E6": ["13611112222", "13633334444", "刘女士", "银色大众速腾", "接送孩子"],
    "E777F8": ["13455556666", "13477778888", "赵先生", "灰色本田雅阁", "公司用车"],
    "F999G0": ["13399990000", "13388881111", "孙先生", "白色比亚迪汉", "新能源车"],
    "TEST01": ["15555555555", "16666666666", "测试用户", "测试车辆", "系统演示"],
    
    // ================= 默认值 =================
    "DEFAULT": ["15305316666", "18753118888", "管理员", "默认车辆", "ID未登记"],
    
    // ================= 元数据 =================
    "_meta": {
        version: "2.0",
        updated: "2024-07-12",
        total: 0 // 自动计算
    }
};

// 自动计算车辆总数
window.VehicleDB._meta.total = (function() {
    let count = 0;
    for (const key in window.VehicleDB) {
        if (!key.startsWith('_') && key !== 'DEFAULT') {
            count++;
        }
    }
    return count;
})();

// 查询函数
window.VehicleDB.getInfo = function(id) {
    id = id.toUpperCase().trim();
    return this[id] || this.DEFAULT;
};

// 获取所有ID（用于自动补全）
window.VehicleDB.getAllIds = function() {
    const ids = [];
    for (const key in this) {
        if (!key.startsWith('_') && key !== 'DEFAULT' && key !== 'getInfo' && key !== 'getAllIds') {
            ids.push(key);
        }
    }
    return ids.sort();
};
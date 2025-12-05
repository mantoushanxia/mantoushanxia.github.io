扫码移车系统
一个基于二维码的智能车辆移车管理系统，通过扫描二维码快速联系车主进行移车。

📌 项目简介
扫码移车系统是一个解决停车场、小区等场景中车辆占位问题的实用工具。车主注册后生成专属二维码放置于车内，他人需要移车时只需扫描二维码即可通过多种方式联系车主，既高效又保护隐私。

✨ 主要功能
车主端

用户注册登录

车辆信息管理

二维码生成与打印

移车记录查看

扫码端

扫描车辆二维码

多种联系方式选择

移车请求发送

实时状态跟踪

管理端

用户与车辆管理

移车数据统计

系统配置管理

操作日志查看

🛠️ 技术栈
前端
Vue.js / React（请根据实际技术选择）

Element UI / Ant Design

Axios

QRCode.js

后端
Node.js + Express / Spring Boot（请根据实际技术选择）

MySQL / PostgreSQL

Redis（缓存）

JWT（身份验证）

第三方服务
短信服务（阿里云、腾讯云）

对象存储（图片、文件存储）

微信/支付宝扫码

🚀 快速部署
方式一：Docker 部署（推荐）
bash
# 克隆项目
git clone https://github.com/kong0jian/扫码移车系统.git
cd 扫码移车系统

# 使用 Docker Compose 启动
docker-compose up -d
方式二：手动部署
bash
# 1. 克隆项目
git clone https://github.com/kong0jian/扫码移车系统.git
cd 扫码移车系统

# 2. 后端部署
cd backend
npm install
cp .env.example .env
# 编辑 .env 文件配置数据库等信息
npm run start

# 3. 前端部署
cd frontend
npm install
npm run build
# 将 dist 目录部署到 Nginx 或 Web 服务器
📖 使用说明
车主注册流程
访问系统注册账号

添加车辆信息（车牌号、车型等）

生成并打印专属二维码

将二维码放置于车内前挡风玻璃处

移车流程
发现需要移车的车辆

使用手机扫描车内二维码

选择联系方式（电话、短信等）

发送移车请求，等待车主响应

管理员操作
登录管理后台

查看系统运行状态

管理用户和车辆信息

查看数据报表

📱 界面预览
text
[车主注册页面截图]
[车辆管理页面截图]
[扫码页面截图]
[管理后台截图]
🔧 配置说明
环境变量配置（.env 文件）
env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=move_car_system
DB_USER=root
DB_PASSWORD=your_password

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379

# 短信服务配置
SMS_APP_ID=your_app_id
SMS_APP_KEY=your_app_key

# JWT 配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=24h
Nginx 配置示例
nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
📊 数据库设计
sql
-- 用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 车辆表
CREATE TABLE vehicles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    plate_number VARCHAR(20) NOT NULL,
    brand VARCHAR(50),
    color VARCHAR(20),
    qr_code VARCHAR(100) UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 移车请求表
CREATE TABLE move_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    requester_phone VARCHAR(20),
    location VARCHAR(200),
    status ENUM('pending', 'processing', 'completed', 'cancelled'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);
🤝 贡献指南
我们欢迎各种形式的贡献！

报告问题
请使用 GitHub Issues 报告 bug 或提出建议。

提交代码
Fork 本仓库

创建功能分支 (git checkout -b feature/your-feature)

提交更改 (git commit -m 'Add your feature')

推送到分支 (git push origin feature/your-feature)

创建 Pull Request

开发规范
代码遵循项目的 ESLint/Prettier 配置

提交信息使用 Conventional Commits 格式

新功能需要添加测试用例

更新相关文档

📄 许可证
本项目采用 MIT 许可证 - 查看 LICENSE 文件了解详情。

📞 联系方式
开发者：kong0jian

邮箱：kong_0jian@163.com

GitHub：https://github.com/kong0jian

项目地址：https://github.com/kong0jian/扫码移车系统

🙌 致谢
感谢所有为本项目做出贡献的开发者和测试人员！

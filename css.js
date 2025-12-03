// css.js - 扫码移车系统的样式文件
const cssContent = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #f0f8ff 0%, #e6f2ff 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif;
    padding: 20px;
}

.card {
    padding: 2.5rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
    max-width: 600px;
    width: 100%;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(to right, #007AFF, #00C6FF);
}

.title {
    color: #1a3650;
    font-size: 1.9rem;
    margin-bottom: 1rem;
    line-height: 1.4;
    font-weight: 600;
}

.subtitle {
    color: #5a6c7d;
    font-size: 1rem;
    font-weight: normal;
    margin-bottom: 2rem;
    line-height: 1.5;
}

.input-section {
    margin-bottom: 2rem;
}

.input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.plate-input {
    flex: 1;
    padding: 1rem 1.2rem;
    font-size: 1.1rem;
    border: 2px solid #e0e6ed;
    border-radius: 10px;
    outline: none;
    transition: all 0.3s ease;
    text-transform: uppercase;
}

.plate-input:focus {
    border-color: #007AFF;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.btn-query {
    padding: 1rem 1.8rem;
    background: linear-gradient(to right, #007AFF, #00A8FF);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.btn-query:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 122, 255, 0.3);
}

.btn-query:active {
    transform: translateY(0);
}

.result-section {
    display: none;
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.result-title {
    color: #1a3650;
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.8rem;
    border-bottom: 2px solid #f0f4f8;
}

.license-plate {
    background: #f8faff;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-family: monospace;
    font-size: 1.4rem;
    font-weight: bold;
    color: #007AFF;
    letter-spacing: 2px;
    margin: 0 auto 1.5rem;
    display: inline-block;
    border: 2px solid #e8f2ff;
}

.contact-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 1.5rem 0;
}

.btn-call {
    display: block;
    padding: 1.1rem 1.5rem;
    background: linear-gradient(to right, #007AFF, #00A8FF);
    color: white !important;
    text-decoration: none;
    border-radius: 10px;
    transition: all 0.3s ease;
    font-size: 1.1rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    z-index: 1;
}

.btn-call::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: linear-gradient(to right, #0056CC, #0088FF);
    transition: width 0.3s ease;
    z-index: -1;
}

.btn-call:hover::before,
.btn-call:active::before {
    width: 100%;
}

.btn-call:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 122, 255, 0.3);
}

.btn-call:active {
    transform: translateY(0);
}

.error-message {
    color: #ff3b30;
    background: #fff2f2;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    display: none;
    animation: shake 0.5s ease;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

.hint {
    color: #7b8a9b;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    text-align: left;
    line-height: 1.5;
}

.sample-plates {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f8faff;
    border-radius: 10px;
    border-left: 4px solid #007AFF;
}

.sample-title {
    color: #5a6c7d;
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
    text-align: left;
    font-weight: 500;
}

.sample-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.sample-plate {
    background: white;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-family: monospace;
    font-size: 0.9rem;
    color: #007AFF;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #e8f2ff;
}

.sample-plate:hover {
    background: #e8f2ff;
    transform: translateY(-2px);
}

.footer-links {
    margin-top: 2.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #eaeaea;
}

.footer-link {
    display: inline-block;
    margin: 0 10px;
    color: #007AFF;
    text-decoration: none;
    position: relative;
    font-size: 0.95rem;
    padding: 5px 0;
}

.footer-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1.5px;
    background: #007AFF;
    transition: width 0.3s ease;
}

.footer-link:hover::after {
    width: 100%;
}

.info-text {
    color: #7b8a9b;
    font-size: 0.9rem;
    margin-top: 1rem;
    line-height: 1.5;
}

@media (max-width: 480px) {
    .card {
        padding: 1.8rem 1.2rem;
        margin: 0.5rem;
    }
    
    .title {
        font-size: 1.6rem;
    }
    
    .input-group {
        flex-direction: column;
    }
    
    .btn-query {
        width: 100%;
    }
    
    .btn-call {
        padding: 1rem 1.2rem;
        font-size: 1rem;
    }
    
    .sample-list {
        justify-content: center;
    }
}
`;

// 动态创建并插入样式
function loadCSS() {
    const style = document.createElement('style');
    style.textContent = cssContent;
    document.head.appendChild(style);
}

// 页面加载时自动应用样式
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCSS);
} else {
    loadCSS();
}

// 导出样式内容以便其他文件使用
window.scanCarCSS = cssContent;
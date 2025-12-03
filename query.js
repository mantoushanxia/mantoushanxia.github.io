// query.js - 查询逻辑和DOM操作
(function() {
    // 等待所有依赖加载完成
    function initialize() {
        // 确保data.js已加载
        if (typeof phoneData === 'undefined') {
            console.error('data.js 未加载');
            setTimeout(initialize, 100);
            return;
        }
        
        // 公开查询函数供HTML调用
        window.queryPhoneNumbers = function(licensePlate) {
            const plateKey = licensePlate.toUpperCase();
            return phoneData[plateKey] || ['电话未登记'];
        };
        
        // 页面加载完成后初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initPage);
        } else {
            initPage();
        }
    }
    
    // 初始化页面
    function initPage() {
        // 检查URL中是否有车牌参数，如果有则自动查询
        const urlParams = new URLSearchParams(window.location.search);
        const urlPlate = urlParams.get('plate');
        
        if (urlPlate && urlPlate.trim() !== '') {
            const plateInput = document.getElementById('plateInput');
            if (plateInput) {
                plateInput.value = urlPlate.toUpperCase();
                setTimeout(() => {
                    queryPhoneNumber();
                }, 100);
            }
        }
        
        // 初始化示例车牌
        initSamplePlates();
    }
    
    // 初始化示例车牌
    function initSamplePlates() {
        if (typeof phoneData === 'undefined') return;
        
        const sampleList = document.getElementById('sampleList');
        if (!sampleList) return;
        
        const samplePlates = Object.keys(phoneData).slice(0, 4); // 取前4个车牌作为示例
        
        samplePlates.forEach(plate => {
            const span = document.createElement('span');
            span.className = 'sample-plate';
            span.textContent = plate;
            span.onclick = function() {
                const plateInput = document.getElementById('plateInput');
                if (plateInput) {
                    plateInput.value = plate;
                    queryPhoneNumber();
                }
            };
            sampleList.appendChild(span);
        });
    }
    
    // 定义全局查询函数（供HTML中的onclick调用）
    window.queryPhoneNumber = function() {
        const plateInput = document.getElementById('plateInput');
        if (!plateInput) return;
        
        const plate = plateInput.value.trim().toUpperCase();
        
        if (!plate) {
            showError('请输入车牌号');
            return;
        }
        
        if (typeof window.queryPhoneNumbers !== 'function') {
            showError('查询功能未正确加载，请刷新页面重试');
            return;
        }
        
        const phoneNumbers = window.queryPhoneNumbers(plate);
        
        // 调用显示函数
        if (typeof displayResults === 'function') {
            displayResults(plate, phoneNumbers);
        }
    };
    
    // 显示查询结果函数
    window.displayResults = function(plate, phoneNumbers) {
        const errorMessage = document.getElementById('errorMessage');
        const resultSection = document.getElementById('resultSection');
        const resultPlate = document.getElementById('resultPlate');
        const contactGroup = document.getElementById('contactGroup');
        
        if (!errorMessage || !resultSection || !resultPlate || !contactGroup) {
            console.error('页面元素未找到');
            return;
        }
        
        // 隐藏错误信息
        errorMessage.style.display = 'none';
        
        if (!phoneNumbers || phoneNumbers[0] === '电话未登记') {
            showError('未找到该车牌号，请检查输入是否正确');
            resultSection.style.display = 'none';
            return;
        }
        
        // 显示查询结果
        resultPlate.textContent = plate;
        
        // 清空并重新生成电话按钮
        contactGroup.innerHTML = '';
        phoneNumbers.forEach((phone, index) => {
            const phoneLink = document.createElement('a');
            phoneLink.href = `tel:${phone}`;
            phoneLink.className = 'btn-call';
            phoneLink.textContent = phoneNumbers.length > 1 
                ? `📞 拨打车主电话 ${index + 1} (${phone})` 
                : `📞 拨打车主电话 (${phone})`;
            
            contactGroup.appendChild(phoneLink);
        });
        
        // 显示结果区域
        resultSection.style.display = 'block';
        
        // 滚动到结果区域
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
    
    // 显示错误信息函数
    window.showError = function(message) {
        const errorMessage = document.getElementById('errorMessage');
        if (!errorMessage) return;
        
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.style.animation = 'none';
        setTimeout(() => {
            errorMessage.style.animation = 'shake 0.5s ease';
        }, 10);
    };
    
    // 开始初始化
    initialize();
})();

// 添加Enter键查询支持
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        const plateInput = document.getElementById('plateInput');
        if (plateInput) {
            plateInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    if (typeof window.queryPhoneNumber === 'function') {
                        window.queryPhoneNumber();
                    }
                }
            });
        }
    });
} else {
    const plateInput = document.getElementById('plateInput');
    if (plateInput) {
        plateInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                if (typeof window.queryPhoneNumber === 'function') {
                    window.queryPhoneNumber();
                }
            }
        });
    }
}
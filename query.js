// query.js - 查询逻辑和DOM操作
document.addEventListener('DOMContentLoaded', function() {
    // 获取URL中的车牌号参数
    function getLicensePlateFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('plate') || 'TEST01'; // 默认使用TEST01
    }
    
    // 根据车牌号查询电话号码
    function queryPhoneNumbers(licensePlate) {
        const plateKey = licensePlate.toUpperCase();
        return phoneData[plateKey] || ['电话未登记'];
    }
    
    // 更新页面显示
    function updatePhoneDisplay(phoneNumbers) {
        const contactGroup = document.querySelector('.contact-group');
        if (!contactGroup) return;
        
        // 清空现有电话按钮
        contactGroup.innerHTML = '';
        
        // 创建每个电话的链接
        phoneNumbers.forEach((phone, index) => {
            const phoneLink = document.createElement('a');
            phoneLink.href = `tel:${phone}`;
            phoneLink.className = 'btn-call';
            phoneLink.textContent = phoneNumbers.length > 1 
                ? `📞 拨打车主电话 ${index + 1} (${phone})` 
                : `📞 拨打车主电话 (${phone})`;
            
            contactGroup.appendChild(phoneLink);
        });
        
        // 更新标题中的车牌信息
        const plate = getLicensePlateFromURL();
        const titleElement = document.querySelector('.title');
        if (titleElement && plate && plate !== 'TEST01') {
            titleElement.innerHTML = `车牌号: <span style="color:#007AFF;">${plate}</span><br>
            <div class="subtitle">临时停车对您造成的不便深表歉意，请拨打电话</div>`;
        }
    }
    
    // 初始化页面
    function initPage() {
        const licensePlate = getLicensePlateFromURL();
        const phoneNumbers = queryPhoneNumbers(licensePlate);
        updatePhoneDisplay(phoneNumbers);
        
        // 添加查询示例链接（仅用于演示）
        addDemoLinks();
    }
    
    // 添加演示链接（实际应用中可移除）
    function addDemoLinks() {
        const footer = document.querySelector('.footer-links');
        if (!footer) return;
        
        const demoDiv = document.createElement('div');
        demoDiv.style.marginTop = '20px';
        demoDiv.style.padding = '10px';
        demoDiv.style.backgroundColor = '#f5f5f5';
        demoDiv.style.borderRadius = '8px';
        demoDiv.innerHTML = '<p style="margin-bottom:8px;color:#666;font-size:0.9rem;">演示：尝试以下车牌</p>';
        
        const samplePlates = ['A123B4', 'E777F8', 'B777X8', 'TEST01'];
        samplePlates.forEach(plate => {
            const link = document.createElement('a');
            link.href = `?plate=${plate}`;
            link.textContent = plate;
            link.style.display = 'inline-block';
            link.style.margin = '0 8px 8px 0';
            link.style.padding = '4px 8px';
            link.style.backgroundColor = '#e8f4ff';
            link.style.borderRadius = '4px';
            link.style.color = '#007AFF';
            link.style.textDecoration = 'none';
            demoDiv.appendChild(link);
        });
        
        footer.appendChild(demoDiv);
    }
    
    // 页面加载完成后初始化
    initPage();
});
// query.js - 车辆查询系统
// 负责处理用户查询、自动补全、数据展示

class VehicleQuerySystem {
    constructor() {
        this.db = window.VehicleDB;
        this.currentId = null;
        this.queryHistory = [];
        this.init();
    }
    
    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // 绑定DOM元素
        this.elements = {
            input: document.getElementById('car-id-input'),
            button: document.getElementById('query-btn'),
            display: document.getElementById('current-id-display'),
            phone1: document.getElementById('phone-link-1'),
            phone2: document.getElementById('phone-link-2'),
            phoneText1: document.getElementById('phone-text-1'),
            phoneText2: document.getElementById('phone-text-2'),
            suggestions: document.getElementById('suggestions'),
            suggestionList: document.getElementById('suggestion-list'),
            details: document.getElementById('vehicle-details'),
            detailOwner: document.getElementById('detail-owner'),
            detailVehicle: document.getElementById('detail-vehicle'),
            dbVersion: document.getElementById('db-version'),
            vehicleCount: document.getElementById('vehicle-count'),
            queryCount: document.getElementById('query-count')
        };
        
        // 初始化显示
        this.updateStats();
        
        // 绑定事件
        this.bindEvents();
        
        // 尝试从URL或本地存储加载
        this.loadInitialId();
        
        // 初始化自动补全
        this.initAutocomplete();
    }
    
    bindEvents() {
        // 查询按钮点击
        this.elements.button.addEventListener('click', () => this.query());
        
        // 输入框回车键
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.query();
        });
        
        // 输入框实时搜索建议
        this.elements.input.addEventListener('input', (e) => {
            this.showSuggestions(e.target.value);
        });
        
        // 点击电话按钮的记录
        [this.elements.phone1, this.elements.phone2].forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                if (!btn.href || btn.href === '#') {
                    e.preventDefault();
                    this.elements.input.focus();
                } else {
                    this.recordCall(index + 1);
                }
            });
        });
    }
    
    initAutocomplete() {
        // 预加载所有ID
        this.allIds = this.db.getAllIds();
    }
    
    showSuggestions(text) {
        if (!text || text.length < 1) {
            this.elements.suggestions.classList.add('hidden');
            return;
        }
        
        const searchText = text.toUpperCase();
        const matches = this.allIds.filter(id => 
            id.includes(searchText) || searchText.includes(id)
        ).slice(0, 5); // 最多显示5个
        
        if (matches.length > 0) {
            this.elements.suggestionList.innerHTML = matches
                .map(id => `<span class="suggestion-item" data-id="${id}">${id}</span>`)
                .join(' | ');
            
            // 为每个建议项添加点击事件
            this.elements.suggestionList.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    this.elements.input.value = e.target.dataset.id;
                    this.elements.suggestions.classList.add('hidden');
                    this.query();
                });
            });
            
            this.elements.suggestions.classList.remove('hidden');
        } else {
            this.elements.suggestions.classList.add('hidden');
        }
    }
    
    query() {
        const id = this.elements.input.value.trim();
        
        if (!id) {
            this.showError('请输入车辆ID');
            this.elements.input.focus();
            return;
        }
        
        // 记录查询历史
        this.queryHistory.push({
            id: id,
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString()
        });
        
        // 更新查询计数
        this.updateQueryCount();
        
        // 执行查询
        this.executeQuery(id);
    }
    
    executeQuery(id) {
        // 显示加载状态
        this.elements.button.innerHTML = '查询中...';
        this.elements.button.disabled = true;
        
        // 模拟网络延迟（实际使用时可以移除）
        setTimeout(() => {
            const info = this.db.getInfo(id);
            
            // 更新当前ID
            this.currentId = id.toUpperCase();
            
            // 更新显示
            this.updateDisplay(this.currentId, info);
            
            // 更新URL（用于分享）
            this.updateUrl(this.currentId);
            
            // 保存到本地存储
            this.saveToStorage(this.currentId);
            
            // 恢复按钮状态
            this.elements.button.innerHTML = '查询';
            this.elements.button.disabled = false;
            
            // 隐藏建议
            this.elements.suggestions.classList.add('hidden');
        }, 200);
    }
    
    updateDisplay(id, info) {
        const [phone1, phone2, owner, vehicle, note] = info;
        
        // 更新ID显示
        this.elements.display.innerHTML = `
            <span class="status-indicator status-online"></span>
            当前车辆: <strong>${id}</strong>
            <br><small class="text-muted">${note || '临时停车，敬请谅解'}</small>
        `;
        
        // 更新电话按钮
        const formatPhone = (phone) => phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
        
        this.elements.phone1.href = `tel:${phone1}`;
        this.elements.phoneText1.textContent = `${owner} - ${formatPhone(phone1)}`;
        
        this.elements.phone2.href = `tel:${phone2}`;
        this.elements.phoneText2.textContent = `备用 - ${formatPhone(phone2)}`;
        
        // 显示详细信息
        this.elements.detailOwner.textContent = owner;
        this.elements.detailVehicle.textContent = vehicle;
        this.elements.details.classList.remove('hidden');
        
        // 添加动画效果
        this.elements.display.classList.add('fade-in');
        setTimeout(() => this.elements.display.classList.remove('fade-in'), 500);
    }
    
    loadInitialId() {
        // 1. 从URL获取
        const path = window.location.pathname;
        const match = path.match(/\/([A-Za-z0-9]+)\/?$/);
        
        if (match && match[1]) {
            const id = match[1].toUpperCase();
            this.elements.input.value = id;
            this.executeQuery(id);
            return;
        }
        
        // 2. 从本地存储获取
        const savedId = localStorage.getItem('last_vehicle_id');
        if (savedId) {
            this.elements.input.value = savedId;
            this.executeQuery(savedId);
        }
    }
    
    updateUrl(id) {
        const baseUrl = window.location.origin + window.location.pathname;
        const cleanBase = baseUrl.replace(/\/[^\/]*\/?$/, '');
        const newUrl = `${cleanBase}/${id}/`;
        window.history.replaceState({}, '', newUrl);
    }
    
    saveToStorage(id) {
        localStorage.setItem('last_vehicle_id', id);
        
        // 保存查询历史（最多50条）
        if (this.queryHistory.length > 50) {
            this.queryHistory = this.queryHistory.slice(-50);
        }
        localStorage.setItem('query_history', JSON.stringify(this.queryHistory));
    }
    
    updateStats() {
        this.elements.dbVersion.textContent = this.db._meta.version;
        this.elements.vehicleCount.textContent = this.db._meta.total;
        
        // 从本地存储获取查询计数
        const history = JSON.parse(localStorage.getItem('query_history') || '[]');
        const today = new Date().toLocaleDateString();
        const todayCount = history.filter(item => item.date === today).length;
        this.elements.queryCount.textContent = todayCount;
    }
    
    updateQueryCount() {
        const count = parseInt(this.elements.queryCount.textContent) || 0;
        this.elements.queryCount.textContent = count + 1;
    }
    
    recordCall(phoneNumberIndex) {
        console.log(`拨打记录: ${this.currentId} - 电话${phoneNumberIndex} - ${new Date().toLocaleString()}`);
        // 这里可以发送到统计服务器（如果需要）
    }
    
    showError(message) {
        this.elements.display.innerHTML = `
            <span class="status-indicator status-offline"></span>
            <span style="color: #ef4444">${message}</span>
        `;
    }
}

// 自动初始化
window.addEventListener('load', () => {
    window.VehicleQuery = new VehicleQuerySystem();
});
// query.js - 扫码移车系统查询引擎
// 版本: 2.1 (修复自动跳转问题)
// 最后更新: 2024年7月12日

class VehicleQuerySystem {
    constructor() {
        this.db = window.VehicleDB;
        this.currentId = null;
        this.queryHistory = [];
        this.allIds = []; // 用于自动补全
        this.init();
    }
    
    // 初始化系统
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    // 设置系统组件
    setup() {
        this.bindElements();
        this.updateStats();
        this.bindEvents();
        this.loadInitialId();
        this.initAutocomplete();
    }
    
    // 绑定DOM元素
    bindElements() {
        this.elements = {
            // 查询相关
            input: document.getElementById('car-id-input'),
            button: document.getElementById('query-btn'),
            display: document.getElementById('current-id-display'),
            suggestions: document.getElementById('suggestions'),
            suggestionList: document.getElementById('suggestion-list'),
            
            // 电话相关
            phone1: document.getElementById('phone-link-1'),
            phone2: document.getElementById('phone-link-2'),
            phoneText1: document.getElementById('phone-text-1'),
            phoneText2: document.getElementById('phone-text-2'),
            
            // 车辆详情
            details: document.getElementById('vehicle-details'),
            detailOwner: document.getElementById('detail-owner'),
            detailVehicle: document.getElementById('detail-vehicle'),
            
            // 统计信息
            dbVersion: document.getElementById('db-version'),
            vehicleCount: document.getElementById('vehicle-count'),
            queryCount: document.getElementById('query-count')
        };
        
        // 如果元素不存在，创建备用元素
        this.createFallbackElements();
    }
    
    // 创建备用元素（防止元素不存在时报错）
    createFallbackElements() {
        if (!this.elements.display) {
            const display = document.createElement('div');
            display.id = 'current-id-display';
            display.className = 'id-display';
            document.querySelector('.query-container')?.appendChild(display);
            this.elements.display = display;
        }
    }
    
    // 绑定事件监听器
    bindEvents() {
        // 查询按钮点击
        if (this.elements.button) {
            this.elements.button.addEventListener('click', () => this.query());
        }
        
        // 输入框回车键
        if (this.elements.input) {
            this.elements.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.query();
            });
            
            // 输入框实时搜索建议
            this.elements.input.addEventListener('input', (e) => {
                this.showSuggestions(e.target.value);
            });
        }
        
        // 电话按钮点击记录
        if (this.elements.phone1 && this.elements.phone2) {
            [this.elements.phone1, this.elements.phone2].forEach((btn, index) => {
                btn.addEventListener('click', (e) => {
                    if (!btn.href || btn.href === '#') {
                        e.preventDefault();
                        this.elements.input?.focus();
                    } else {
                        this.recordCall(index + 1);
                    }
                });
            });
        }
    }
    
    // 初始化自动补全
    initAutocomplete() {
        if (this.db && this.db.getAllIds) {
            this.allIds = this.db.getAllIds();
        }
    }
    
    // 显示自动补全建议
    showSuggestions(text) {
        if (!this.elements.suggestions || !this.elements.suggestionList) return;
        
        if (!text || text.length < 1) {
            this.elements.suggestions.classList.add('hidden');
            return;
        }
        
        const searchText = text.toUpperCase();
        const matches = this.allIds.filter(id => 
            id.includes(searchText) || searchText.includes(id)
        ).slice(0, 5);
        
        if (matches.length > 0) {
            this.elements.suggestionList.innerHTML = matches
                .map(id => `<span class="suggestion-item" data-id="${id}">${id}</span>`)
                .join(' | ');
            
            // 为每个建议项添加点击事件
            this.elements.suggestionList.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    if (this.elements.input) {
                        this.elements.input.value = e.target.dataset.id;
                    }
                    this.elements.suggestions.classList.add('hidden');
                    this.query();
                });
            });
            
            this.elements.suggestions.classList.remove('hidden');
        } else {
            this.elements.suggestions.classList.add('hidden');
        }
    }
    
    // 加载初始ID（不自动查询）
    loadInitialId() {
        // 只显示友好提示，不执行自动查询
        if (this.elements.display) {
            this.elements.display.innerHTML = `
                <span class="status-indicator status-online"></span>
                扫码移车系统已就绪
                <br><small class="text-muted">请输入车辆ID并点击"查询"按钮</small>
            `;
        }
        
        // 填充上次查询的ID到输入框（不自动查询）
        const savedId = localStorage.getItem('last_vehicle_id');
        if (savedId && this.elements.input) {
            this.elements.input.value = savedId;
        }
        
        // 如果有URL参数，填充但不查询
        const urlParams = new URLSearchParams(window.location.search);
        const urlId = urlParams.get('id');
        if (urlId && this.elements.input) {
            this.elements.input.value = urlId.toUpperCase();
        }
    }
    
    // 执行查询（用户手动触发）
    query() {
        if (!this.elements.input) return;
        
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
    
    // 执行查询逻辑
    executeQuery(id) {
        // 显示加载状态
        if (this.elements.button) {
            this.elements.button.innerHTML = '查询中...';
            this.elements.button.disabled = true;
        }
        
        // 模拟网络延迟（实际使用时可以移除或减少时间）
        setTimeout(() => {
            try {
                const info = this.db.getInfo(id);
                this.currentId = id.toUpperCase();
                
                // 更新显示
                this.updateDisplay(this.currentId, info);
                
                // 保存到本地存储
                this.saveToStorage(this.currentId);
                
                // 更新URL参数（不改变路径）
                this.updateUrlParam(this.currentId);
                
            } catch (error) {
                console.error('查询出错:', error);
                this.showError('查询失败，请稍后重试');
            } finally {
                // 恢复按钮状态
                if (this.elements.button) {
                    this.elements.button.innerHTML = '查询';
                    this.elements.button.disabled = false;
                }
                
                // 隐藏建议
                if (this.elements.suggestions) {
                    this.elements.suggestions.classList.add('hidden');
                }
            }
        }, 300);
    }
    
    // 更新页面显示
    updateDisplay(id, info) {
        const [phone1, phone2, owner, vehicle, note] = info;
        
        // 更新ID显示
        if (this.elements.display) {
            this.elements.display.innerHTML = `
                <span class="status-indicator status-online"></span>
                当前车辆: <strong>${id}</strong>
                <br><small class="text-muted">${note || '临时停车，敬请谅解'}</small>
            `;
            
            // 添加动画效果
            this.elements.display.classList.add('fade-in');
            setTimeout(() => {
                if (this.elements.display) {
                    this.elements.display.classList.remove('fade-in');
                }
            }, 500);
        }
        
        // 更新电话按钮
        const formatPhone = (phone) => {
            if (!phone) return '未提供';
            return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
        };
        
        if (this.elements.phone1) {
            this.elements.phone1.href = `tel:${phone1}`;
            if (this.elements.phoneText1) {
                this.elements.phoneText1.textContent = `${owner || '车主'} - ${formatPhone(phone1)}`;
            }
        }
        
        if (this.elements.phone2) {
            this.elements.phone2.href = `tel:${phone2}`;
            if (this.elements.phoneText2) {
                this.elements.phoneText2.textContent = `备用 - ${formatPhone(phone2)}`;
            }
        }
        
        // 显示详细信息
        if (this.elements.details && this.elements.detailOwner && this.elements.detailVehicle) {
            this.elements.detailOwner.textContent = owner || '未知';
            this.elements.detailVehicle.textContent = vehicle || '未知车辆';
            this.elements.details.classList.remove('hidden');
        }
    }
    
    // 更新URL参数（不改变页面路径）
    updateUrlParam(id) {
        try {
            const url = new URL(window.location);
            url.searchParams.set('id', id);
            window.history.replaceState({}, '', url.toString());
        } catch (error) {
            console.warn('更新URL参数失败:', error);
        }
    }
    
    // 保存到本地存储
    saveToStorage(id) {
        localStorage.setItem('last_vehicle_id', id);
        
        // 保存查询历史（最多50条）
        if (this.queryHistory.length > 50) {
            this.queryHistory = this.queryHistory.slice(-50);
        }
        localStorage.setItem('query_history', JSON.stringify(this.queryHistory));
    }
    
    // 更新统计信息
    updateStats() {
        if (this.elements.dbVersion && this.db._meta) {
            this.elements.dbVersion.textContent = this.db._meta.version || '1.0';
        }
        
        if (this.elements.vehicleCount && this.db._meta) {
            this.elements.vehicleCount.textContent = this.db._meta.total || '0';
        }
        
        // 更新今日查询计数
        this.updateQueryCount();
    }
    
    // 更新查询计数显示
    updateQueryCount() {
        if (!this.elements.queryCount) return;
        
        try {
            const history = JSON.parse(localStorage.getItem('query_history') || '[]');
            const today = new Date().toLocaleDateString();
            const todayCount = history.filter(item => item.date === today).length;
            this.elements.queryCount.textContent = todayCount;
        } catch (error) {
            this.elements.queryCount.textContent = '0';
        }
    }
    
    // 记录电话拨打
    recordCall(phoneNumberIndex) {
        if (!this.currentId) return;
        
        console.log(`📞 拨打记录: ${this.currentId} - 电话${phoneNumberIndex} - ${new Date().toLocaleString()}`);
        
        // 可以在这里添加统计代码（如果需要）
        // 例如发送到Google Analytics或自己的统计服务
    }
    
    // 显示错误信息
    showError(message) {
        if (this.elements.display) {
            this.elements.display.innerHTML = `
                <span class="status-indicator status-offline"></span>
                <span style="color: #ef4444">${message}</span>
            `;
        }
        
        // 重置电话按钮
        if (this.elements.phone1 && this.elements.phoneText1) {
            this.elements.phone1.href = '#';
            this.elements.phoneText1.textContent = '车主电话 1';
        }
        
        if (this.elements.phone2 && this.elements.phoneText2) {
            this.elements.phone2.href = '#';
            this.elements.phoneText2.textContent = '车主电话 2';
        }
        
        // 隐藏详细信息
        if (this.elements.details) {
            this.elements.details.classList.add('hidden');
        }
    }
    
    // 工具方法：重置查询
    resetQuery() {
        if (this.elements.input) {
            this.elements.input.value = '';
            this.elements.input.focus();
        }
        
        if (this.elements.display) {
            this.elements.display.innerHTML = `
                <span class="status-indicator status-online"></span>
                请输入新的车辆ID
            `;
        }
        
        if (this.elements.phone1 && this.elements.phoneText1) {
            this.elements.phone1.href = '#';
            this.elements.phoneText1.textContent = '车主电话 1';
        }
        
        if (this.elements.phone2 && this.elements.phoneText2) {
            this.elements.phone2.href = '#';
            this.elements.phoneText2.textContent = '车主电话 2';
        }
        
        if (this.elements.details) {
            this.elements.details.classList.add('hidden');
        }
    }
}

// 自动初始化系统
window.addEventListener('load', () => {
    // 检查是否已存在实例
    if (!window.VehicleQuery) {
        window.VehicleQuery = new VehicleQuerySystem();
        console.log('🚗 扫码移车系统已初始化');
    }
    
    // 添加全局重置函数（用于调试）
    window.resetVehicleQuery = function() {
        if (window.VehicleQuery) {
            window.VehicleQuery.resetQuery();
            console.log('系统已重置');
        }
    };
});

// 导出模块（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VehicleQuerySystem;
}
// ===== APP STATE =====
const AppState = {
    currentPage: 'dashboard',
    currentSubject: null,
    currentTask: null,
    currentTimer: null,
    timerInterval: null,
    timerStartTime: null,
    timerRemaining: 0,
    timerMode: 'pomodoro',
    timerRunning: false,
    isMobile: window.innerWidth < 768,
    theme: localStorage.getItem('theme') || 'dark',
    settings: {},
    db: null,
    // Default timer settings
    pomodoroDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    pomodorosBeforeLongBreak: 4
};

// ===== DATABASE SCHEMA =====
const DB_SCHEMA = {
    version: 1,
    stores: [
        { name: 'tasks', keyPath: 'id' },
        { name: 'subjects', keyPath: 'id' },
        { name: 'marks', keyPath: 'id' },
        { name: 'timerSessions', keyPath: 'id' },
        { name: 'goals', keyPath: 'id' },
        { name: 'notifications', keyPath: 'id' },
        { name: 'settings', keyPath: 'key' },
        { name: 'reviews', keyPath: 'id' }
    ]
};

// ===== DATABASE INITIALIZATION =====
async function initDB() {
    return new Promise((resolve, reject) => {
        try {
            const request = indexedDB.open('StudyRoomDB', DB_SCHEMA.version);
            
            request.onerror = (event) => {
                console.error('Database error:', event.target.error);
                AppState.db = { fallback: true };
                resolve(AppState.db);
            };

            request.onsuccess = (event) => {
                AppState.db = event.target.result;
                resolve(AppState.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                DB_SCHEMA.stores.forEach(store => {
                    if (!db.objectStoreNames.contains(store.name)) {
                        const options = {};
                        if (store.keyPath) {
                            options.keyPath = store.keyPath;
                            if (store.autoIncrement) options.autoIncrement = true;
                        }
                        db.createObjectStore(store.name, options);
                    }
                });
                
                // Create indexes
                const tx = event.target.transaction;
                const tasksStore = tx.objectStore('tasks');
                if (!tasksStore.indexNames.contains('subjectId')) tasksStore.createIndex('subjectId', 'subjectId', { unique: false });
                if (!tasksStore.indexNames.contains('dueDate')) tasksStore.createIndex('dueDate', 'dueDate', { unique: false });
                if (!tasksStore.indexNames.contains('status')) tasksStore.createIndex('status', 'status', { unique: false });
                if (!tasksStore.indexNames.contains('priority')) tasksStore.createIndex('priority', 'priority', { unique: false });
                if (!tasksStore.indexNames.contains('createdAt')) tasksStore.createIndex('createdAt', 'createdAt', { unique: false });
                if (!tasksStore.indexNames.contains('forgettingCurve')) tasksStore.createIndex('forgettingCurve', 'forgettingCurve', { unique: false });
                
                const marksStore = tx.objectStore('marks');
                if (!marksStore.indexNames.contains('subjectId')) marksStore.createIndex('subjectId', 'subjectId', { unique: false });
                if (!marksStore.indexNames.contains('date')) marksStore.createIndex('date', 'date', { unique: false });
                
                const timerStore = tx.objectStore('timerSessions');
                if (!timerStore.indexNames.contains('taskId')) timerStore.createIndex('taskId', 'taskId', { unique: false });
                if (!timerStore.indexNames.contains('subjectId')) timerStore.createIndex('subjectId', 'subjectId', { unique: false });
                if (!timerStore.indexNames.contains('startTime')) timerStore.createIndex('startTime', 'startTime', { unique: false });
                if (!timerStore.indexNames.contains('endTime')) timerStore.createIndex('endTime', 'endTime', { unique: false });
                
                const reviewsStore = tx.objectStore('reviews');
                if (!reviewsStore.indexNames.contains('taskId')) reviewsStore.createIndex('taskId', 'taskId', { unique: false });
                if (!reviewsStore.indexNames.contains('reviewDate')) reviewsStore.createIndex('reviewDate', 'reviewDate', { unique: false });
                if (!reviewsStore.indexNames.contains('status')) reviewsStore.createIndex('status', 'status', { unique: false });
            };
        } catch (error) {
            console.error('DB init error:', error);
            AppState.db = { fallback: true };
            resolve(AppState.db);
        }
    });
}

// ===== DATABASE OPERATIONS =====
async function dbGet(storeName, key) {
    if (AppState.db.fallback) {
        const data = localStorage.getItem(`${storeName}_${key}`);
        return data ? JSON.parse(data) : null;
    }
    return new Promise((resolve, reject) => {
        const tx = AppState.db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function dbGetAll(storeName) {
    if (AppState.db.fallback) {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(`${storeName}_`));
        return Promise.all(keys.map(k => JSON.parse(localStorage.getItem(k))));
    }
    return new Promise((resolve, reject) => {
        const tx = AppState.db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function dbPut(storeName, data) {
    if (AppState.db.fallback) {
        localStorage.setItem(`${storeName}_${data.id}`, JSON.stringify(data));
        return data;
    }
    return new Promise((resolve, reject) => {
        const tx = AppState.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(data);
        req.onsuccess = () => resolve(data);
        req.onerror = () => reject(req.error);
    });
}

async function dbDelete(storeName, key) {
    if (AppState.db.fallback) {
        localStorage.removeItem(`${storeName}_${key}`);
        return true;
    }
    return new Promise((resolve, reject) => {
        const tx = AppState.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
    });
}

async function dbClear(storeName) {
    if (AppState.db.fallback) {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(`${storeName}_`));
        keys.forEach(k => localStorage.removeItem(k));
        return true;
    }
    return new Promise((resolve, reject) => {
        const tx = AppState.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.clear();
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
    });
}

// ===== NAVIGATION =====
function navigateTo(page) {
    AppState.currentPage = page;
    localStorage.setItem('lastPage', page);
    updateNavigation();
    loadPage(page);
    closeSearch();
}

function updateNavigation() {
    document.querySelectorAll('.sidebar-menu-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === AppState.currentPage);
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === AppState.currentPage);
    });
    const titles = {
        dashboard: 'Dashboard', tasks: 'Tasks', timer: 'Focus Timer', calendar: 'Calendar',
        subjects: 'Subjects', marks: 'Marks Tracker', reviews: 'Reviews', analytics: 'Analytics',
        reports: 'Reports', goals: 'Goals & Streaks', notifications: 'Notifications', settings: 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[AppState.currentPage] || 'Study Room';
}

async function loadPage(page) {
    const content = document.getElementById('mainContent');
    content.innerHTML = '';
    content.style.opacity = '0';
    
    try {
        let html = '';
        switch(page) {
            case 'dashboard': html = await renderDashboard(); break;
            case 'tasks': html = await renderTasks(); break;
            case 'timer': html = await renderTimer(); break;
            case 'calendar': html = await renderCalendar(); break;
            case 'subjects': html = await renderSubjects(); break;
            case 'marks': html = await renderMarks(); break;
            case 'reviews': html = await renderReviews(); break;
            case 'analytics': html = await renderAnalytics(); break;
            case 'reports': html = await renderReports(); break;
            case 'goals': html = await renderGoals(); break;
            case 'notifications': html = await renderNotifications(); break;
            case 'settings': html = await renderSettings(); break;
            default: html = await renderDashboard();
        }
        
        content.innerHTML = html;
        
        switch(page) {
            case 'dashboard': initDashboard(); break;
            case 'tasks': initTasks(); break;
            case 'timer': initTimer(); break;
            case 'calendar': initCalendar(); break;
            case 'subjects': initSubjects(); break;
            case 'marks': initMarks(); break;
            case 'reviews': initReviews(); break;
            case 'analytics': initAnalytics(); break;
            case 'reports': initReports(); break;
            case 'goals': initGoals(); break;
            case 'notifications': initNotifications(); break;
            case 'settings': initSettings(); break;
        }
        
        setTimeout(() => {
            content.style.opacity = '1';
            content.style.transition = 'opacity 200ms ease';
        }, 50);
    } catch (error) {
        console.error('Error loading page:', error);
        content.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-title">Error Loading Page</div></div>';
    }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} fade-in`;
    toast.innerHTML = `<span>${message}</span>`;
    toast.style.minWidth = '280px';
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 200);
    }, duration);
}

// ===== CONFIRMATION MODAL =====
let confirmCallback = null;
function showConfirm(title, message, callback) {
    confirmCallback = callback;
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').classList.add('active');
}
function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
    confirmCallback = null;
}
function confirmYes() {
    if (confirmCallback) { confirmCallback(); confirmCallback = null; }
    closeConfirmModal();
}

// ===== SEARCH =====
function openSearch() {
    document.getElementById('searchModal').classList.add('active');
    document.getElementById('searchInput').focus();
}
function closeSearch() {
    document.getElementById('searchModal').classList.remove('active');
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
}
async function performSearch(query) {
    if (!query.trim()) { document.getElementById('searchResults').innerHTML = ''; return; }
    const results = [];
    const q = query.toLowerCase();
    
    const tasks = await dbGetAll('tasks');
    tasks.forEach(t => {
        if (t.title.toLowerCase().includes(q) || (t.description||'').toLowerCase().includes(q)) {
            results.push({type:'task',id:t.id,title:t.title,subtitle:t.description||'No description',icon:'📋'});
        }
    });
    
    const subjects = await dbGetAll('subjects');
    subjects.forEach(s => {
        if (s.name.toLowerCase().includes(q) || (s.code||'').toLowerCase().includes(q)) {
            results.push({type:'subject',id:s.id,title:s.name,subtitle:s.code||'No code',icon:'📚'});
        }
    });
    
    const marks = await dbGetAll('marks');
    marks.forEach(m => {
        if (m.paper.toLowerCase().includes(q) || (m.notes||'').toLowerCase().includes(q)) {
            results.push({type:'mark',id:m.id,title:m.paper,subtitle:`${m.marks}/${m.maxMarks} (${Math.round((m.marks/m.maxMarks)*100)}%)`,icon:'📊'});
        }
    });
    
    const container = document.getElementById('searchResults');
    if (results.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-text">No results found</div></div>';
        return;
    }
    container.innerHTML = results.map(r => `
        <div class="card" style="margin-bottom:10px;cursor:pointer;" onclick="navigateFromSearch('${r.type}',${r.id})">
            <div class="d-flex align-center gap-sm">
                <span style="font-size:20px;">${r.icon}</span>
                <div class="flex-1">
                    <div style="font-weight:600;">${r.title}</div>
                    <div style="font-size:12px;color:var(--text-muted);">${r.subtitle}</div>
                </div>
            </div>
        </div>
    `).join('');
}
function navigateFromSearch(type, id) {
    closeSearch();
    const pageMap = {task:'tasks',subject:'subjects',mark:'marks'};
    navigateTo(pageMap[type] || 'dashboard');
    setTimeout(() => {
        const modalId = `${type}DetailModal`;
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            if (type === 'task') loadTaskDetails(id);
            else if (type === 'subject') loadSubjectDetails(id);
            else if (type === 'mark') loadMarkDetails(id);
        }
    }, 100);
}

// ===== THEME =====
function applyTheme() {
    document.documentElement.setAttribute('data-theme', AppState.theme);
    localStorage.setItem('theme', AppState.theme);
}
async function saveSetting(key, value) {
    await dbPut('settings', { key, value });
    AppState.settings[key] = value;
    if (key === 'theme') {
        AppState.theme = value;
        applyTheme();
    }
}

// ===== DATE UTILITIES =====
function formatDate(d) { if(!d) return ''; const date = new Date(d); return date.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}); }
function formatTime(d) { if(!d) return ''; const date = new Date(d); return date.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}); }
function formatDateTime(d) { if(!d) return ''; const date = new Date(d); return date.toLocaleString('en-US',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}); }
function formatDuration(s) { if(!s) return '0s'; const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60; return h>0?`${h}h ${m}m`:m>0?`${m}m ${sec}s`:`${sec}s`; }
function formatTimer(s) { const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60; return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`; }
function getToday() { return new Date().toISOString().split('T')[0]; }
function getCurrentWeek() { const now=new Date(),first=now.getDate()-now.getDay(),last=first+6; return {firstDay:new Date(now.setDate(first)).toISOString().split('T')[0],lastDay:new Date(now.setDate(last)).toISOString().split('T')[0]}; }
function getCurrentMonth() { const now=new Date(); return {firstDay:new Date(now.getFullYear(),now.getMonth(),1).toISOString().split('T')[0],lastDay:new Date(now.getFullYear(),now.getMonth()+1,0).toISOString().split('T')[0]}; }
function generateId() { return Date.now().toString(36)+Math.random().toString(36).substr(2); }

// ===== INITIALIZE NAVIGATION =====
function initNavigation() {
    const navConfig = [
        {page:'dashboard',icon:'🏠',label:'Dashboard'},
        {page:'tasks',icon:'📋',label:'Tasks'},
        {page:'timer',icon:'⏱️',label:'Focus Timer'},
        {page:'calendar',icon:'📅',label:'Calendar'},
        {page:'subjects',icon:'📚',label:'Subjects'},
        {page:'marks',icon:'📊',label:'Marks Tracker'},
        {page:'reviews',icon:'🔄',label:'Reviews'},
        {page:'analytics',icon:'📈',label:'Analytics'},
        {page:'reports',icon:'📄',label:'Reports'},
        {page:'goals',icon:'🎯',label:'Goals'},
        {page:'notifications',icon:'🔔',label:'Notifications'},
        {page:'settings',icon:'⚙️',label:'Settings'}
    ];
    
    const sidebar = document.getElementById('sidebarMenu');
    sidebar.innerHTML = navConfig.map(n => `
        <li class="sidebar-menu-item ${n.page===AppState.currentPage?'active':''}" data-page="${n.page}">
            <span class="sidebar-menu-icon">${n.icon}</span>
            <span class="sidebar-menu-label">${n.label}</span>
        </li>
    `).join('');
    
    const bottomNav = document.getElementById('bottomNav');
    const mobileNav = [
        {page:'dashboard',icon:'🏠',label:'Home'},
        {page:'tasks',icon:'📋',label:'Tasks'},
        {page:'timer',icon:'⏱️',label:'Timer'},
        {page:'calendar',icon:'📅',label:'Calendar'},
        {page:'settings',icon:'⚙️',label:'More'}
    ];
    bottomNav.innerHTML = mobileNav.map(n => `
        <div class="nav-item ${n.page===AppState.currentPage?'active':''}" data-page="${n.page}">
            <span class="nav-icon">${n.icon}</span>
            <span class="nav-label">${n.label}</span>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => navigateTo(item.dataset.page));
    });
    document.querySelectorAll('.sidebar-menu-item').forEach(item => {
        item.addEventListener('click', () => navigateTo(item.dataset.page));
    });
    
    document.getElementById('searchInput').addEventListener('input', e => performSearch(e.target.value));
    
    // Close modals
    ['searchModal','confirmModal'].forEach(id => {
        document.getElementById(id).addEventListener('click', e => {
            if (e.target === e.currentTarget) {
                if (id === 'searchModal') closeSearch();
                else closeConfirmModal();
            }
        });
    });
    
    window.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeSearch(); closeConfirmModal(); exitFullscreenTimer(); }
        if (e.key === 'k' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); openSearch(); }
    });
    window.addEventListener('resize', () => { AppState.isMobile = window.innerWidth < 768; });
}

// ===== LOAD SETTINGS =====
async function loadSettings() {
    try {
        const settings = await dbGetAll('settings');
        AppState.settings = {};
        settings.forEach(s => AppState.settings[s.key] = s.value);
        if (AppState.settings.theme) AppState.theme = AppState.settings.theme;
        if (AppState.settings.pomodoroDuration) AppState.pomodoroDuration = parseInt(AppState.settings.pomodoroDuration);
        if (AppState.settings.shortBreakDuration) AppState.shortBreakDuration = parseInt(AppState.settings.shortBreakDuration);
        if (AppState.settings.longBreakDuration) AppState.longBreakDuration = parseInt(AppState.settings.longBreakDuration);
        if (AppState.settings.pomodorosBeforeLongBreak) AppState.pomodorosBeforeLongBreak = parseInt(AppState.settings.pomodorosBeforeLongBreak);
    } catch (error) { console.error('Error loading settings:', error); }
}

// ===== FULLSCREEN TIMER =====
function enterFullscreenTimer() {
    const display = document.getElementById('timerDisplay');
    document.getElementById('fullscreenTimerDisplay').textContent = display.textContent;
    document.getElementById('fullscreenTimer').style.display = 'flex';
}
function exitFullscreenTimer() {
    document.getElementById('fullscreenTimer').style.display = 'none';
}

// ===== NOTIFICATIONS =====
async function checkNotifications() {
    const notifications = await dbGetAll('notifications');
    const unread = notifications.filter(n => !n.read);
    if (unread.length > 0) {}
}

// ===== INITIALIZE APP =====
async function initApp() {
    await initDB();
    await loadSettings();
    applyTheme();
    initNavigation();
    const savedPage = localStorage.getItem('lastPage') || 'dashboard';
    navigateTo(savedPage);
    checkNotifications();
}

// Start the app
document.addEventListener('DOMContentLoaded', initApp);

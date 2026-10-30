// ===== TIMER =====
async function renderTimer() {
    const timerSessions = await dbGetAll('timerSessions');
    const subjects = await dbGetAll('subjects');
    const tasks = await dbGetAll('tasks');
    
    // Today's sessions
    const todaySessions = timerSessions.filter(s => s.startTime && s.startTime.startsWith(getToday()));
    const totalTodayTime = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    
    // Weekly stats
    const thisWeek = getCurrentWeek();
    const weekSessions = timerSessions.filter(s => s.startTime >= thisWeek.firstDay && s.startTime <= thisWeek.lastDay);
    const totalWeekTime = weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    
    return `
        <div class="page-timer">
            <!-- Timer Display -->
            <section class="section text-center">
                <h2 class="section-title mb-lg">Focus Timer</h2>
                <div class="timer-display" id="timerDisplay">${formatTimer(AppState.pomodoroDuration)}</div>
                <div class="mt-md">
                    <span class="badge badge-purple" id="timerModeBadge">Pomodoro</span>
                    <span class="badge badge-info ml-sm" id="timerSessionCount">Session 1/${AppState.pomodorosBeforeLongBreak}</span>
                </div>
                <div class="timer-controls mt-lg">
                    <button class="btn btn-primary btn-lg" onclick="startTimer()" id="startTimerBtn">Start</button>
                    <button class="btn btn-warning btn-lg" onclick="pauseTimer()" id="pauseTimerBtn" disabled>Pause</button>
                    <button class="btn btn-danger btn-lg" onclick="resetTimer()" id="resetTimerBtn">Reset</button>
                </div>
                <div class="mt-md">
                    <button class="btn btn-outline btn-sm" onclick="switchTimerMode('pomodoro')">Pomodoro</button>
                    <button class="btn btn-outline btn-sm" onclick="switchTimerMode('shortBreak')">Short Break</button>
                    <button class="btn btn-outline btn-sm" onclick="switchTimerMode('longBreak')">Long Break</button>
                    <button class="btn btn-outline btn-sm" onclick="switchTimerMode('stopwatch')">Stopwatch</button>
                </div>
                <div class="mt-md">
                    <button class="btn btn-ghost btn-sm" onclick="enterFullscreenTimer()">Fullscreen Mode</button>
                </div>
            </section>
            
            <!-- Task/Subject Selection -->
            <section class="section">
                <div class="section-header">
                    <h3 class="section-title">Associate with Task/Subject</h3>
                </div>
                <div class="card">
                    <div class="d-flex gap-md flex-wrap">
                        <div class="form-group flex-1" style="min-width:200px">
                            <label class="form-label">Task (Optional)</label>
                            <select class="form-select" id="timerTaskId">
                                <option value="">No Task</option>
                                ${tasks.map(t => `<option value="${t.id}">${t.title}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group flex-1" style="min-width:200px">
                            <label class="form-label">Subject (Optional)</label>
                            <select class="form-select" id="timerSubjectId">
                                <option value="">No Subject</option>
                                ${subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Today's Stats -->
            <section class="section">
                <div class="section-header">
                    <h3 class="section-title">Today's Focus Sessions</h3>
                </div>
                <div class="stats-grid mb-md">
                    <div class="stat-item">
                        <div class="stat-value">${todaySessions.length}</div>
                        <div class="stat-label">Sessions</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${formatDuration(totalTodayTime)}</div>
                        <div class="stat-label">Total Time</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${formatDuration(totalWeekTime)}</div>
                        <div class="stat-label">This Week</div>
                    </div>
                </div>
                <div id="todaySessions">
                    ${todaySessions.length > 0 ? todaySessions.map(s => `
                        <div class="card mb-sm">
                            <div class="d-flex justify-between">
                                <div>
                                    <div style="font-weight:600">${s.taskId ? tasks.find(t => t.id === s.taskId)?.title : 'No Task'}</div>
                                    <div style="font-size:12px;color:var(--text-muted)">${formatDateTime(s.startTime)} - ${formatDateTime(s.endTime)}</div>
                                </div>
                                <div style="text-align:right">
                                    <div style="font-weight:600">${formatDuration(s.duration)}</div>
                                    ${s.subjectId ? `<div style="font-size:12px;color:var(--text-muted)">${subjects.find(su => su.id === s.subjectId)?.code || ''}</div>` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('') : '<div class="empty-state"><div class="empty-state-text">No focus sessions today</div></div>'}
                </div>
            </section>
            
            <!-- Session History -->
            <section class="section">
                <div class="section-header">
                    <h3 class="section-title">Session History</h3>
                    <button class="btn btn-sm btn-ghost" onclick="toggleSessionHistory()">Show/Hide</button>
                </div>
                <div id="sessionHistory" style="display:none">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Task</th>
                                    <th>Subject</th>
                                    <th>Duration</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody id="sessionHistoryBody">
                                ${timerSessions.slice(0, 20).map(s => `
                                    <tr>
                                        <td>${formatDate(s.startTime)}</td>
                                        <td>${s.taskId ? tasks.find(t => t.id === s.taskId)?.title : '-'}</td>
                                        <td>${s.subjectId ? subjects.find(su => su.id === s.subjectId)?.code : '-'}</td>
                                        <td>${formatDuration(s.duration)}</td>
                                        <td>${s.type || 'Pomodoro'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    `;
}

function initTimer() {
    updateTimerDisplay();
    
    // Check if there's a running timer
    if (AppState.timerRunning) {
        document.getElementById('startTimerBtn').disabled = true;
        document.getElementById('pauseTimerBtn').disabled = false;
    }
    
    // Start timer interval
    if (AppState.timerInterval) clearInterval(AppState.timerInterval);
    AppState.timerInterval = setInterval(updateTimerDisplay, 1000);
}

function updateTimerDisplay() {
    const display = document.getElementById('timerDisplay');
    const modeBadge = document.getElementById('timerModeBadge');
    const sessionCount = document.getElementById('timerSessionCount');
    
    if (display) display.textContent = formatTimer(AppState.timerRemaining);
    if (modeBadge) modeBadge.textContent = AppState.timerMode === 'pomodoro' ? 'Pomodoro' : 
                                       AppState.timerMode === 'shortBreak' ? 'Short Break' :
                                       AppState.timerMode === 'longBreak' ? 'Long Break' : 'Stopwatch';
    
    if (sessionCount) {
        sessionCount.textContent = `Session ${AppState.currentSession || 1}/${AppState.pomodorosBeforeLongBreak}`;
    }
}

function startTimer() {
    if (AppState.timerRunning) return;
    
    if (AppState.timerMode === 'stopwatch' && AppState.timerRemaining <= 0) {
        AppState.timerRemaining = 0;
    }
    
    AppState.timerRunning = true;
    AppState.timerStartTime = new Date();
    
    document.getElementById('startTimerBtn').disabled = true;
    document.getElementById('pauseTimerBtn').disabled = false;
    
    // Start countdown
    AppState.timerInterval = setInterval(() => {
        const elapsed = Math.floor((new Date() - AppState.timerStartTime) / 1000);
        
        if (AppState.timerMode === 'stopwatch') {
            AppState.timerRemaining += 1;
        } else {
            AppState.timerRemaining = Math.max(0, AppState.timerRemaining - 1);
        }
        
        updateTimerDisplay();
        
        if (AppState.timerMode !== 'stopwatch' && AppState.timerRemaining <= 0) {
            timerComplete();
        }
    }, 1000);
    
    showToast('Timer started!', 'success');
}

function pauseTimer() {
    if (!AppState.timerRunning) return;
    
    AppState.timerRunning = false;
    const elapsed = Math.floor((new Date() - AppState.timerStartTime) / 1000);
    
    if (AppState.timerMode === 'stopwatch') {
        AppState.timerRemaining += elapsed;
    } else {
        AppState.timerRemaining = Math.max(0, AppState.timerRemaining - elapsed);
    }
    
    clearInterval(AppState.timerInterval);
    document.getElementById('startTimerBtn').disabled = false;
    document.getElementById('pauseTimerBtn').disabled = true;
    
    showToast('Timer paused', 'info');
}

function resetTimer() {
    clearInterval(AppState.timerInterval);
    AppState.timerRunning = false;
    AppState.timerRemaining = AppState.timerMode === 'pomodoro' ? AppState.pomodoroDuration :
                           AppState.timerMode === 'shortBreak' ? AppState.shortBreakDuration :
                           AppState.timerMode === 'longBreak' ? AppState.longBreakDuration : 0;
    
    document.getElementById('startTimerBtn').disabled = false;
    document.getElementById('pauseTimerBtn').disabled = true;
    updateTimerDisplay();
    
    showToast('Timer reset', 'info');
}

function switchTimerMode(mode) {
    if (AppState.timerRunning) {
        showToast('Please pause or reset the timer first', 'warning');
        return;
    }
    
    AppState.timerMode = mode;
    
    switch(mode) {
        case 'pomodoro':
            AppState.timerRemaining = AppState.pomodoroDuration;
            break;
        case 'shortBreak':
            AppState.timerRemaining = AppState.shortBreakDuration;
            break;
        case 'longBreak':
            AppState.timerRemaining = AppState.longBreakDuration;
            break;
        case 'stopwatch':
            AppState.timerRemaining = 0;
            break;
    }
    
    updateTimerDisplay();
    showToast(`Switched to ${mode} mode`, 'info');
}

async function timerComplete() {
    clearInterval(AppState.timerInterval);
    AppState.timerRunning = false;
    
    // Save session
    const taskId = document.getElementById('timerTaskId').value;
    const subjectId = document.getElementById('timerSubjectId').value;
    const startTime = new Date(Date.now() - (AppState.pomodoroDuration * 1000)).toISOString();
    const endTime = new Date().toISOString();
    
    const session = {
        id: generateId(),
        taskId: taskId || null,
        subjectId: subjectId || null,
        startTime,
        endTime,
        duration: AppState.pomodoroDuration,
        type: AppState.timerMode
    };
    
    await dbPut('timerSessions', session);
    
    // Show notification
    showToast('Timer completed! Session saved.', 'success');
    
    // Play sound if enabled
    playNotificationSound();
    
    // Auto-switch to break if in pomodoro mode
    if (AppState.timerMode === 'pomodoro') {
        AppState.currentSession = (AppState.currentSession || 1) + 1;
        if ((AppState.currentSession || 1) >= AppState.pomodorosBeforeLongBreak) {
            switchTimerMode('longBreak');
            AppState.currentSession = 0;
        } else {
            switchTimerMode('shortBreak');
        }
        resetTimer();
        startTimer();
    }
    
    document.getElementById('startTimerBtn').disabled = false;
    document.getElementById('pauseTimerBtn').disabled = true;
}

function playNotificationSound() {
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQAA');
        audio.play();
    } catch (e) {
        // Silent fail
    }
}

function toggleSessionHistory() {
    const container = document.getElementById('sessionHistory');
    if (container.style.display === 'none') {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

// ===== CALENDAR =====
async function renderCalendar() {
    const tasks = await dbGetAll('tasks');
    const timerSessions = await dbGetAll('timerSessions');
    const marks = await dbGetAll('marks');
    
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    return `
        <div class="page-calendar">
            <!-- Calendar Controls -->
            <section class="section">
                <div class="section-header">
                    <h2 class="section-title" id="calendarTitle">${today.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <div class="d-flex gap-sm">
                        <button class="btn btn-sm btn-outline" onclick="changeCalendarMonth(-1)">←</button>
                        <button class="btn btn-sm btn-outline" onclick="changeCalendarMonth(1)">→</button>
                        <button class="btn btn-sm btn-outline" onclick="goToToday()">Today</button>
                    </div>
                </div>
                <div class="d-flex gap-sm mb-md">
                    <button class="btn btn-sm ${AppState.calendarView === 'month' ? 'btn-primary' : 'btn-outline'}" onclick="setCalendarView('month')">Month</button>
                    <button class="btn btn-sm ${AppState.calendarView === 'week' ? 'btn-primary' : 'btn-outline'}" onclick="setCalendarView('week')">Week</button>
                    <button class="btn btn-sm ${AppState.calendarView === 'day' ? 'btn-primary' : 'btn-outline'}" onclick="setCalendarView('day')">Day</button>
                    <button class="btn btn-sm ${AppState.calendarView === 'agenda' ? 'btn-primary' : 'btn-outline'}" onclick="setCalendarView('agenda')">Agenda</button>
                </div>
            </section>
            
            <!-- Month View -->
            <div id="monthView" style="display:${AppState.calendarView === 'month' ? 'block' : 'none'}">
                <div class="calendar-grid" id="calendarMonthGrid"></div>
            </div>
            
            <!-- Week View -->
            <div id="weekView" style="display:${AppState.calendarView === 'week' ? 'block' : 'none'}">
                <div id="calendarWeekGrid"></div>
            </div>
            
            <!-- Day View -->
            <div id="dayView" style="display:${AppState.calendarView === 'day' ? 'block' : 'none'}">
                <div id="calendarDayView"></div>
            </div>
            
            <!-- Agenda View -->
            <div id="agendaView" style="display:${AppState.calendarView === 'agenda' ? 'block' : 'none'}">
                <div id="calendarAgenda"></div>
            </div>
            
            <!-- Event Details Modal -->
            <div class="modal-overlay" id="calendarEventModal">
                <div class="modal">
                    <div class="modal-header">
                        <div class="modal-title" id="eventModalTitle">Event Details</div>
                        <button class="modal-close" onclick="closeCalendarEventModal()">&times;</button>
                    </div>
                    <div class="modal-body" id="eventModalBody"></div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="closeCalendarEventModal()">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

let calendarDate = new Date();
let AppStateCalendar = { view: 'month' };

function initCalendar() {
    renderCalendarMonth();
}

function setCalendarView(view) {
    AppStateCalendar.view = view;
    document.getElementById('monthView').style.display = view === 'month' ? 'block' : 'none';
    document.getElementById('weekView').style.display = view === 'week' ? 'block' : 'none';
    document.getElementById('dayView').style.display = view === 'day' ? 'block' : 'none';
    document.getElementById('agendaView').style.display = view === 'agenda' ? 'block' : 'none';
    
    switch(view) {
        case 'month': renderCalendarMonth(); break;
        case 'week': renderCalendarWeek(); break;
        case 'day': renderCalendarDay(); break;
        case 'agenda': renderCalendarAgenda(); break;
    }
}

function changeCalendarMonth(delta) {
    calendarDate.setMonth(calendarDate.getMonth() + delta);
    renderCalendarMonth();
    document.getElementById('calendarTitle').textContent = calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' });
}

function goToToday() {
    calendarDate = new Date();
    renderCalendarMonth();
    document.getElementById('calendarTitle').textContent = calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' });
}

async function renderCalendarMonth() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = getToday();
    
    const tasks = await dbGetAll('tasks');
    const timerSessions = await dbGetAll('timerSessions');
    const marks = await dbGetAll('marks');
    
    const tasksByDate = {};
    tasks.forEach(t => {
        if (t.dueDate) {
            if (!tasksByDate[t.dueDate]) tasksByDate[t.dueDate] = [];
            tasksByDate[t.dueDate].push({ type: 'task', ...t });
        }
    });
    
    const sessionsByDate = {};
    timerSessions.forEach(s => {
        if (s.startTime) {
            const date = s.startTime.split('T')[0];
            if (!sessionsByDate[date]) sessionsByDate[date] = [];
            sessionsByDate[date].push({ type: 'session', ...s });
        }
    });
    
    const marksByDate = {};
    marks.forEach(m => {
        if (m.date) {
            const date = m.date.split('T')[0];
            if (!marksByDate[date]) marksByDate[date] = [];
            marksByDate[date].push({ type: 'mark', ...m });
        }
    });
    
    const eventsByDate = { ...tasksByDate, ...sessionsByDate, ...marksByDate };
    
    let html = '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Header
    html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);padding:10px 0;border-bottom:1px solid var(--border-color);margin-bottom:10px">';
    days.forEach(d => html += `<div style="text-align:center;font-size:12px;color:var(--text-muted)">${d}</div>`);
    html += '</div>';
    
    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day other-month"><div class="calendar-day-number"></div></div>';
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${(month+1).toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
        const isToday = dateStr === todayStr;
        const hasEvents = eventsByDate[dateStr] && eventsByDate[dateStr].length > 0;
        const isPast = dateStr < todayStr;
        
        const events = eventsByDate[dateStr] || [];
        const completedTasks = events.filter(e => e.type === 'task' && e.status === 'completed').length;
        const totalTasks = events.filter(e => e.type === 'task').length;
        const hasSessions = events.some(e => e.type === 'session');
        const hasMarks = events.some(e => e.type === 'mark');
        
        let dayHtml = `<div class="calendar-day ${isToday?'today':''} ${hasEvents?'has-tasks':''} ${isPast?'other-month':''}" onclick="showCalendarDayEvents('${dateStr}')">
            <div class="calendar-day-number">${day}</div>`;
        
        if (hasEvents) {
            dayHtml += `<div class="calendar-day-dots">`;
            if (hasSessions) dayHtml += `<div class="calendar-day-dot" style="background:var(--info)"></div>`;
            if (hasMarks) dayHtml += `<div class="calendar-day-dot" style="background:var(--success)"></div>`;
            for (let i = 0; i < Math.min(totalTasks, 3); i++) {
                dayHtml += `<div class="calendar-day-dot" style="background:${i < completedTasks ? 'var(--success)' : 'var(--accent-purple)'}"></div>`;
            }
            dayHtml += `</div>`;
        }
        
        dayHtml += `</div>`;
        html += dayHtml;
    }
    
    document.getElementById('calendarMonthGrid').innerHTML = html;
}

async function showCalendarDayEvents(dateStr) {
    const tasks = await dbGetAll('tasks');
    const timerSessions = await dbGetAll('timerSessions');
    const marks = await dbGetAll('marks');
    
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    
    const dayTasks = tasks.filter(t => t.dueDate === dateStr);
    const daySessions = timerSessions.filter(s => s.startTime && s.startTime.startsWith(dateStr));
    const dayMarks = marks.filter(m => m.date && m.date.startsWith(dateStr));
    
    let html = `<div style="margin-bottom:15px"><strong>${formattedDate}</strong></div>`;
    
    if (dayTasks.length > 0) {
        html += `<h4 style="margin:15px 0 10px 0">Tasks</h4>`;
        dayTasks.forEach(t => {
            html += `<div class="card mb-sm" style="padding:10px">
                <div style="display:flex;justify-content:space-between">
                    <div>
                        <div style="font-weight:600">${t.title}</div>
                        <div style="font-size:12px;color:var(--text-muted)">Due: ${t.dueDate ? formatDate(t.dueDate) : 'No due date'}</div>
                    </div>
                    <div style="text-align:right">
                        <span class="badge badge-${t.status === 'completed' ? 'success' : 'warning'}">${t.status === 'completed' ? 'Done' : 'Pending'}</span>
                    </div>
                </div>
            </div>`;
        });
    }
    
    if (daySessions.length > 0) {
        html += `<h4 style="margin:15px 0 10px 0">Focus Sessions</h4>`;
        daySessions.forEach(s => {
            html += `<div class="card mb-sm" style="padding:10px">
                <div style="display:flex;justify-content:space-between">
                    <div>
                        <div style="font-weight:600">${s.type || 'Pomodoro'} Session</div>
                        <div style="font-size:12px;color:var(--text-muted)">${formatDuration(s.duration)}</div>
                    </div>
                    <div style="text-align:right">
                        <div>${formatTime(s.startTime)}</div>
                    </div>
                </div>
            </div>`;
        });
    }
    
    if (dayMarks.length > 0) {
        html += `<h4 style="margin:15px 0 10px 0">Marks</h4>`;
        dayMarks.forEach(m => {
            html += `<div class="card mb-sm" style="padding:10px">
                <div style="display:flex;justify-content:space-between">
                    <div>
                        <div style="font-weight:600">${m.paper}</div>
                        <div style="font-size:12px;color:var(--text-muted)">${m.notes || ''}</div>
                    </div>
                    <div style="text-align:right">
                        <div>${m.marks}/${m.maxMarks}</div>
                        <div style="font-size:12px">(${Math.round(m.marks/m.maxMarks*100)}%)</div>
                    </div>
                </div>
            </div>`;
        });
    }
    
    if (dayTasks.length === 0 && daySessions.length === 0 && dayMarks.length === 0) {
        html += '<div class="empty-state"><div class="empty-state-text">No events on this day</div></div>';
    }
    
    document.getElementById('eventModalTitle').textContent = formattedDate;
    document.getElementById('eventModalBody').innerHTML = html;
    document.getElementById('calendarEventModal').classList.add('active');
}

function closeCalendarEventModal() {
    document.getElementById('calendarEventModal').classList.remove('active');
}

async function renderCalendarWeek() {
    // Implementation for week view
    document.getElementById('calendarWeekGrid').innerHTML = '<div class="empty-state"><div class="empty-state-text">Week view coming soon</div></div>';
}

async function renderCalendarDay() {
    // Implementation for day view
    document.getElementById('calendarDayView').innerHTML = '<div class="empty-state"><div class="empty-state-text">Day view coming soon</div></div>';
}

async function renderCalendarAgenda() {
    const tasks = await dbGetAll('tasks');
    const timerSessions = await dbGetAll('timerSessions');
    const marks = await dbGetAll('marks');
    
    const allEvents = [];
    
    tasks.forEach(t => {
        if (t.dueDate) {
            allEvents.push({ type: 'task', date: t.dueDate, ...t });
        }
    });
    
    timerSessions.forEach(s => {
        if (s.startTime) {
            allEvents.push({ type: 'session', date: s.startTime.split('T')[0], ...s });
        }
    });
    
    marks.forEach(m => {
        if (m.date) {
            allEvents.push({ type: 'mark', date: m.date.split('T')[0], ...m });
        }
    });
    
    allEvents.sort((a, b) => a.date.localeCompare(b.date));
    
    let html = '';
    let currentDate = '';
    
    allEvents.forEach(event => {
        if (event.date !== currentDate) {
            currentDate = event.date;
            html += `<div style="margin:20px 0 10px 0;font-weight:600">${formatDate(currentDate)}</div>`;
        }
        
        switch(event.type) {
            case 'task':
                html += `<div class="card mb-sm" style="padding:10px;background:var(--bg-tertiary)">
                    <div style="display:flex;justify-content:space-between">
                        <div>
                            <span>📋</span> <strong>${event.title}</strong>
                        </div>
                        <div>
                            <span class="badge badge-${event.status === 'completed' ? 'success' : 'warning'}">${event.status === 'completed' ? 'Done' : 'Pending'}</span>
                        </div>
                    </div>
                </div>`;
                break;
            case 'session':
                html += `<div class="card mb-sm" style="padding:10px;background:var(--bg-tertiary)">
                    <div style="display:flex;justify-content:space-between">
                        <div>
                            <span>⏱️</span> <strong>${event.type || 'Pomodoro'} Session</strong>
                        </div>
                        <div>
                            ${formatDuration(event.duration)}
                        </div>
                    </div>
                </div>`;
                break;
            case 'mark':
                html += `<div class="card mb-sm" style="padding:10px;background:var(--bg-tertiary)">
                    <div style="display:flex;justify-content:space-between">
                        <div>
                            <span>📊</span> <strong>${event.paper}</strong>
                        </div>
                        <div>
                            ${event.marks}/${event.maxMarks}
                        </div>
                    </div>
                </div>`;
                break;
        }
    });
    
    if (allEvents.length === 0) {
        html = '<div class="empty-state"><div class="empty-state-text">No upcoming events</div></div>';
    }
    
    document.getElementById('calendarAgenda').innerHTML = html;
}

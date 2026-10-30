// ===== GOALS & STREAKS =====
async function renderGoals() {
    const goals = await dbGetAll('goals');
    const timerSessions = await dbGetAll('timerSessions');
    const tasks = await dbGetAll('tasks');
    const marks = await dbGetAll('marks');
    
    const today = getToday();
    
    // Calculate current streak
    const allDays = timerSessions.map(s => s.startTime?.split('T')[0]);
    const uniqueDays = [...new Set(allDays.filter(d => d))];
    const sortedDays = uniqueDays.sort();
    
    let currentStreak = 0;
    let longestStreak = 0;
    let lastDay = null;
    
    if (sortedDays.length > 0) {
        currentStreak = 1;
        longestStreak = 1;
        lastDay = sortedDays[0];
        
        for (let i = 1; i < sortedDays.length; i++) {
            const prevDay = new Date(sortedDays[i-1]);
            const currDay = new Date(sortedDays[i]);
            const diff = (currDay - prevDay) / (1000 * 60 * 60 * 24);
            
            if (diff === 1) {
                currentStreak++;
            } else if (diff > 1) {
                currentStreak = 1;
            }
            
            longestStreak = Math.max(longestStreak, currentStreak);
            
            if (sortedDays[i] === today) {
                lastDay = sortedDays[i];
            }
        }
        
        // Check if today has study time
        if (!allDays.includes(today)) {
            currentStreak = 0;
        }
    }
    
    // Active goals
    const activeGoals = goals.filter(g => !g.completed && g.deadline >= today);
    const completedGoals = goals.filter(g => g.completed);
    const expiredGoals = goals.filter(g => !g.completed && g.deadline < today);
    
    return `
        <div class="page-goals">
            <!-- Streaks -->
            <section class="section">
                <h2 class="section-title mb-md">Study Streaks</h2>
                <div class="d-flex gap-md flex-wrap">
                    <div class="card flex-1" style="min-width:200px">
                        <div style="text-align:center">
                            <div style="font-size:48px">🔥</div>
                            <div style="font-weight:600;color:var(--text-muted);font-size:14px">Current Streak</div>
                            <div style="font-size:32px;font-weight:700;color:var(--accent-orange)">${currentStreak}</div>
                            <div style="font-size:12px;color:var(--text-muted)">${currentStreak === 1 ? 'day' : 'days'}</div>
                        </div>
                    </div>
                    <div class="card flex-1" style="min-width:200px">
                        <div style="text-align:center">
                            <div style="font-size:48px">🏆</div>
                            <div style="font-weight:600;color:var(--text-muted);font-size:14px">Longest Streak</div>
                            <div style="font-size:32px;font-weight:700;color:var(--accent-purple)">${longestStreak}</div>
                            <div style="font-size:12px;color:var(--text-muted)">${longestStreak === 1 ? 'day' : 'days'}</div>
                        </div>
                    </div>
                    <div class="card flex-1" style="min-width:200px">
                        <div style="text-align:center">
                            <div style="font-size:48px">📅</div>
                            <div style="font-weight:600;color:var(--text-muted);font-size:14px">Total Study Days</div>
                            <div style="font-size:32px;font-weight:700;color:var(--accent-blue)">${uniqueDays.length}</div>
                            <div style="font-size:12px;color:var(--text-muted)">days</div>
                        </div>
                    </div>
                    <div class="card flex-1" style="min-width:200px">
                        <div style="text-align:center">
                            <div style="font-size:48px">💯</div>
                            <div style="font-weight:600;color:var(--text-muted);font-size:14px">Perfect Weeks</div>
                            <div style="font-size:32px;font-weight:700;color:var(--success)">${Math.floor(uniqueDays.length / 7)}</div>
                            <div style="font-size:12px;color:var(--text-muted)">weeks</div>
                        </div>
                    </div>
                </div>
                
                <!-- Streak Calendar -->
                <div class="mt-lg">
                    <h4 style="margin-bottom:10px">Study Days This Month</h4>
                    <div id="streakCalendar" class="calendar-grid"></div>
                </div>
            </section>
            
            <!-- Goals -->
            <section class="section">
                <div class="section-header">
                    <h2 class="section-title">Goals</h2>
                    <button class="btn btn-primary btn-sm" onclick="showGoalModal()">+ Add Goal</button>
                </div>
                
                <!-- Stats -->
                <div class="stats-grid mb-lg">
                    <div class="stat-item">
                        <div class="stat-value">${goals.length}</div>
                        <div class="stat-label">Total Goals</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${activeGoals.length}</div>
                        <div class="stat-label">Active</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${completedGoals.length}</div>
                        <div class="stat-label">Completed</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${expiredGoals.length}</div>
                        <div class="stat-label">Expired</div>
                    </div>
                </div>
                
                <!-- Active Goals -->
                ${activeGoals.length > 0 ? `
                    <div class="mb-lg">
                        <h4 style="margin-bottom:10px">Active Goals</h4>
                        <div id="activeGoals">
                            ${activeGoals.map(g => renderGoalCard(g)).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Completed Goals -->
                ${completedGoals.length > 0 ? `
                    <div class="mb-lg">
                        <h4 style="margin-bottom:10px">Completed Goals</h4>
                        <div id="completedGoals">
                            ${completedGoals.map(g => renderGoalCard(g)).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Expired Goals -->
                ${expiredGoals.length > 0 ? `
                    <div class="mb-lg">
                        <h4 style="margin-bottom:10px">Expired Goals</h4>
                        <div id="expiredGoals">
                            ${expiredGoals.map(g => renderGoalCard(g)).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${goals.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-state-icon">🎯</div>
                        <div class="empty-state-title">No goals yet</div>
                        <div class="empty-state-text">Set goals to track your progress and stay motivated</div>
                        <button class="btn btn-primary mt-md" onclick="showGoalModal()">Add Goal</button>
                    </div>
                ` : ''}
            </section>
            
            <!-- Add/Edit Goal Modal -->
            <div class="modal-overlay" id="goalFormModal">
                <div class="modal" style="max-width:600px">
                    <div class="modal-header">
                        <div class="modal-title" id="goalFormTitle">Add Goal</div>
                        <button class="modal-close" onclick="closeGoalFormModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="goalForm" onsubmit="saveGoal(event)">
                            <input type="hidden" id="goalId">
                            <div class="form-group">
                                <label class="form-label">Goal Title *</label>
                                <input type="text" class="form-input" id="goalTitle" required placeholder="e.g., Study 2 hours daily">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Description</label>
                                <textarea class="form-textarea" id="goalDescription" placeholder="Describe your goal..."></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Goal Type *</label>
                                <select class="form-select" id="goalType" required>
                                    <option value="studyTime">Study Time</option>
                                    <option value="tasks">Number of Tasks</option>
                                    <option value="marks">Average Marks</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>
                            <div class="form-group" id="goalTargetGroup">
                                <label class="form-label">Target Value *</label>
                                <div class="d-flex gap-sm">
                                    <input type="number" class="form-input flex-1" id="goalTarget" required min="1" step="0.01" placeholder="e.g., 2">
                                    <select class="form-select" id="goalUnit">
                                        <option value="hours">hours</option>
                                        <option value="tasks">tasks</option>
                                        <option value="percentage">%</option>
                                        <option value="custom">custom</option>
                                    </select>
                                </div>
                            </div>
                            <div class="d-flex gap-md flex-wrap">
                                <div class="form-group flex-1" style="min-width:150px">
                                    <label class="form-label">Deadline *</label>
                                    <input type="date" class="form-input" id="goalDeadline" required value="${addDays(getToday(), 7)}">
                                </div>
                                <div class="form-group flex-1" style="min-width:150px">
                                    <label class="form-label">Priority</label>
                                    <select class="form-select" id="goalPriority">
                                        <option value="low">Low</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeGoalFormModal()">Cancel</button>
                        <button type="button" class="btn btn-danger" onclick="deleteGoal()" id="deleteGoalBtn" style="display:none">Delete</button>
                        <button type="button" class="btn btn-primary" onclick="saveGoal()">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initGoals() {
    renderStreakCalendar();
    
    // Event listeners
    document.getElementById('goalFormModal').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeGoalFormModal();
    });
    
    // Update goal type based on selection
    document.getElementById('goalType').addEventListener('change', function() {
        const targetGroup = document.getElementById('goalTargetGroup');
        const unitSelect = document.getElementById('goalUnit');
        
        switch(this.value) {
            case 'studyTime':
                unitSelect.innerHTML = '<option value="hours">hours</option><option value="minutes">minutes</option>';
                break;
            case 'tasks':
                unitSelect.innerHTML = '<option value="tasks">tasks</option>';
                break;
            case 'marks':
                unitSelect.innerHTML = '<option value="percentage">%</option>';
                break;
            case 'custom':
                unitSelect.innerHTML = '<option value="custom">custom</option>';
                break;
        }
    });
}

function renderGoalCard(goal) {
    const today = getToday();
    const progress = calculateGoalProgress(goal);
    const daysLeft = Math.floor((new Date(goal.deadline) - new Date(today)) / (1000 * 60 * 60 * 24));
    const isOverdue = goal.deadline < today && !goal.completed;
    const isCompleted = goal.completed;
    
    return `
        <div class="card mb-sm">
            <div class="d-flex justify-between mb-sm">
                <div>
                    <div style="font-weight:600">${goal.title}</div>
                    <div style="font-size:12px;color:var(--text-muted)">${goal.description || 'No description'}</div>
                </div>
                <div>
                    <span class="badge badge-${isCompleted ? 'success' : isOverdue ? 'danger' : 'warning'}">
                        ${isCompleted ? 'Completed' : isOverdue ? 'Expired' : `${daysLeft} days left`}
                    </span>
                </div>
            </div>
            <div class="progress-bar mb-sm">
                <div class="progress-fill ${isCompleted ? 'success' : isOverdue ? 'danger' : 'info'}" 
                     style="width:${Math.min(progress, 100)}%"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted)">
                <div>Progress: ${Math.round(progress)}%</div>
                <div>Deadline: ${formatDate(goal.deadline)}</div>
            </div>
            <div style="display:flex;gap-sm;justify-content:flex-end;margin-top:10px">
                <button class="btn btn-sm btn-ghost" onclick="showGoalModal(${goal.id})">Edit</button>
                ${!isCompleted && !isOverdue ? `
                    <button class="btn btn-sm btn-success" onclick="markGoalComplete(${goal.id})">Complete</button>
                ` : ''}
            </div>
        </div>
    `;
}

function showGoalModal(goalId) {
    if (goalId) {
        loadGoalDetails(goalId);
    } else {
        document.getElementById('goalFormTitle').textContent = 'Add Goal';
        document.getElementById('goalId').value = '';
        document.getElementById('goalTitle').value = '';
        document.getElementById('goalDescription').value = '';
        document.getElementById('goalType').value = 'studyTime';
        document.getElementById('goalTarget').value = '';
        document.getElementById('goalUnit').innerHTML = '<option value="hours">hours</option><option value="minutes">minutes</option>';
        document.getElementById('goalDeadline').value = addDays(getToday(), 7);
        document.getElementById('goalPriority').value = 'medium';
        document.getElementById('deleteGoalBtn').style.display = 'none';
    }
    document.getElementById('goalFormModal').classList.add('active');
}

function closeGoalFormModal() {
    document.getElementById('goalFormModal').classList.remove('active');
}

async function loadGoalDetails(goalId) {
    const goal = await dbGet('goals', goalId);
    if (!goal) return;
    
    document.getElementById('goalFormTitle').textContent = 'Edit Goal';
    document.getElementById('goalId').value = goal.id;
    document.getElementById('goalTitle').value = goal.title;
    document.getElementById('goalDescription').value = goal.description || '';
    document.getElementById('goalType').value = goal.type || 'studyTime';
    document.getElementById('goalTarget').value = goal.target || '';
    document.getElementById('goalDeadline').value = goal.deadline;
    document.getElementById('goalPriority').value = goal.priority || 'medium';
    document.getElementById('deleteGoalBtn').style.display = 'block';
    
    // Set unit based on type
    const unitSelect = document.getElementById('goalUnit');
    switch(goal.type) {
        case 'studyTime':
            unitSelect.innerHTML = '<option value="hours">hours</option><option value="minutes">minutes</option>';
            break;
        case 'tasks':
            unitSelect.innerHTML = '<option value="tasks">tasks</option>';
            break;
        case 'marks':
            unitSelect.innerHTML = '<option value="percentage">%</option>';
            break;
        case 'custom':
            unitSelect.innerHTML = '<option value="custom">custom</option>';
            break;
    }
    
    document.getElementById('goalFormModal').classList.add('active');
}

async function saveGoal() {
    const id = document.getElementById('goalId').value;
    const title = document.getElementById('goalTitle').value.trim();
    const description = document.getElementById('goalDescription').value.trim();
    const type = document.getElementById('goalType').value;
    const target = parseFloat(document.getElementById('goalTarget').value);
    const unit = document.getElementById('goalUnit').value;
    const deadline = document.getElementById('goalDeadline').value;
    const priority = document.getElementById('goalPriority').value;
    
    if (!title) {
        showToast('Please enter a goal title', 'danger');
        return;
    }
    if (isNaN(target) || target <= 0) {
        showToast('Please enter a valid target value', 'danger');
        return;
    }
    if (!deadline) {
        showToast('Please select a deadline', 'danger');
        return;
    }
    
    const goal = {
        id: id || generateId(),
        title,
        description: description || null,
        type,
        target,
        unit,
        deadline,
        priority,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };
    
    try {
        await dbPut('goals', goal);
        showToast('Goal saved successfully', 'success');
        closeGoalFormModal();
        
        if (AppState.currentPage === 'goals') {
            loadPage('goals');
        }
        
    } catch (error) {
        showToast('Error saving goal: ' + error.message, 'danger');
    }
}

async function deleteGoal(goalId) {
    if (!goalId) {
        goalId = document.getElementById('goalId').value;
    }
    if (!goalId) return;
    
    try {
        await dbDelete('goals', goalId);
        showToast('Goal deleted successfully', 'success');
        closeGoalFormModal();
        
        if (AppState.currentPage === 'goals') {
            loadPage('goals');
        }
        
    } catch (error) {
        showToast('Error deleting goal: ' + error.message, 'danger');
    }
}

async function markGoalComplete(goalId) {
    const goal = await dbGet('goals', goalId);
    if (!goal) return;
    
    const updated = {
        ...goal,
        completed: true,
        completedAt: new Date().toISOString()
    };
    
    try {
        await dbPut('goals', updated);
        showToast('Goal marked as completed!', 'success');
        
        if (AppState.currentPage === 'goals') {
            loadPage('goals');
        }
        
    } catch (error) {
        showToast('Error updating goal: ' + error.message, 'danger');
    }
}

function calculateGoalProgress(goal) {
    if (goal.completed) return 100;
    
    switch(goal.type) {
        case 'studyTime':
            // Calculate total study time in the period
            // For simplicity, we'll calculate from the goal creation date
            return 0; // Will implement with actual data
        case 'tasks':
            // Calculate completed tasks
            return 0; // Will implement with actual data
        case 'marks':
            // Calculate average marks
            return 0; // Will implement with actual data
        default:
            return 0;
    }
}

async function renderStreakCalendar() {
    const timerSessions = await dbGetAll('timerSessions');
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = getToday();
    
    const studyDays = [...new Set(timerSessions.map(s => s.startTime?.split('T')[0]).filter(d => d))];
    
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
        const hasStudy = studyDays.includes(dateStr);
        const isFuture = dateStr > todayStr;
        
        let dayHtml = `<div class="calendar-day ${isToday?'today':''} ${hasStudy?'has-tasks':''} ${isFuture?'other-month':''}">
            <div class="calendar-day-number">${day}</div>`;
        
        if (hasStudy) {
            dayHtml += `<div class="calendar-day-dots"><div class="calendar-day-dot" style="background:var(--success)"></div></div>`;
        }
        
        dayHtml += `</div>`;
        html += dayHtml;
    }
    
    document.getElementById('streakCalendar').innerHTML = html;
}

// ===== NOTIFICATIONS =====
async function renderNotifications() {
    const notifications = await dbGetAll('notifications');
    const today = getToday();
    
    // Group notifications
    const unread = notifications.filter(n => !n.read);
    const read = notifications.filter(n => n.read);
    const todayNotifications = notifications.filter(n => n.date && n.date.startsWith(today));
    const older = notifications.filter(n => n.date && n.date < today);
    
    return `
        <div class="page-notifications">
            <div class="section-header mb-md">
                <h2 class="section-title">Notifications</h2>
                <button class="btn btn-sm btn-outline" onclick="markAllAsRead()">Mark All as Read</button>
            </div>
            
            <!-- Stats -->
            <div class="stats-grid mb-lg">
                <div class="stat-item">
                    <div class="stat-value">${notifications.length}</div>
                    <div class="stat-label">Total</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${unread.length}</div>
                    <div class="stat-label">Unread</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${todayNotifications.length}</div>
                    <div class="stat-label">Today</div>
                </div>
            </div>
            
            <!-- Today's Notifications -->
            ${todayNotifications.length > 0 ? `
                <section class="section">
                    <h3 class="section-title">Today</h3>
                    <div id="todayNotifications">
                        ${todayNotifications.map(n => renderNotificationItem(n)).join('')}
                    </div>
                </section>
            ` : ''}
            
            <!-- Older Notifications -->
            ${older.length > 0 ? `
                <section class="section">
                    <h3 class="section-title">Older</h3>
                    <div id="olderNotifications">
                        ${older.map(n => renderNotificationItem(n)).join('')}
                    </div>
                </section>
            ` : ''}
            
            ${notifications.length === 0 ? `
                <div class="empty-state">
                    <div class="empty-state-icon">🔔</div>
                    <div class="empty-state-title">No notifications yet</div>
                    <div class="empty-state-text">Notifications will appear here when you have due tasks, reviews, or timer reminders</div>
                </div>
            ` : ''}
            
            <!-- Notification Settings -->
            <section class="section">
                <h3 class="section-title mb-md">Notification Settings</h3>
                <div class="card">
                    <div class="form-group">
                        <label class="form-label">Enable Task Deadline Notifications</label>
                        <div class="form-switch">
                            <input type="checkbox" class="form-switch-input" id="notifyTaskDeadline" 
                                   ${AppState.settings.notifyTaskDeadline ? 'checked' : ''} 
                                   onchange="saveSetting('notifyTaskDeadline', this.checked)">
                            <span class="form-switch-slider"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Enable Review Reminders</label>
                        <div class="form-switch">
                            <input type="checkbox" class="form-switch-input" id="notifyReviews" 
                                   ${AppState.settings.notifyReviews ? 'checked' : ''} 
                                   onchange="saveSetting('notifyReviews', this.checked)">
                            <span class="form-switch-slider"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Enable Timer Completion Notifications</label>
                        <div class="form-switch">
                            <input type="checkbox" class="form-switch-input" id="notifyTimer" 
                                   ${AppState.settings.notifyTimer ? 'checked' : ''} 
                                   onchange="saveSetting('notifyTimer', this.checked)">
                            <span class="form-switch-slider"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Enable Goal Deadline Notifications</label>
                        <div class="form-switch">
                            <input type="checkbox" class="form-switch-input" id="notifyGoals" 
                                   ${AppState.settings.notifyGoals ? 'checked' : ''} 
                                   onchange="saveSetting('notifyGoals', this.checked)">
                            <span class="form-switch-slider"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Notification Sound</label>
                        <div class="form-switch">
                            <input type="checkbox" class="form-switch-input" id="notifySound" 
                                   ${AppState.settings.notifySound ? 'checked' : ''} 
                                   onchange="saveSetting('notifySound', this.checked)">
                            <span class="form-switch-slider"></span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;
}

function initNotifications() {
    // Event listeners
    // Check for new notifications
    checkNewNotifications();
}

function renderNotificationItem(notification) {
    const today = getToday();
    const isToday = notification.date && notification.date.startsWith(today);
    const isUnread = !notification.read;
    
    return `
        <div class="card mb-sm ${isUnread ? 'bg-hover' : ''}" onclick="markNotificationRead(${notification.id})">
            <div style="display:flex;gap-md">
                <div style="font-size:24px">${notification.icon || '🔔'}</div>
                <div class="flex-1">
                    <div style="font-weight:600">${notification.title}</div>
                    <div style="font-size:12px;color:var(--text-muted);margin-top:5px">${notification.message}</div>
                    <div style="font-size:10px;color:var(--text-muted);margin-top:5px">${formatDateTime(notification.date)}</div>
                </div>
                <div>
                    ${isUnread ? '<span class="badge badge-info">New</span>' : ''}
                </div>
            </div>
        </div>
    `;
}

async function markNotificationRead(notificationId) {
    const notification = await dbGet('notifications', notificationId);
    if (!notification) return;
    
    const updated = {
        ...notification,
        read: true
    };
    
    try {
        await dbPut('notifications', updated);
        
        if (AppState.currentPage === 'notifications') {
            loadPage('notifications');
        }
        
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

async function markAllAsRead() {
    const notifications = await dbGetAll('notifications');
    
    notifications.forEach(async n => {
        if (!n.read) {
            n.read = true;
            await dbPut('notifications', n);
        }
    });
    
    showToast('All notifications marked as read', 'success');
    loadPage('notifications');
}

async function checkNewNotifications() {
    // Check for task deadlines
    const tasks = await dbGetAll('tasks');
    const today = getToday();
    const tomorrow = addDays(today, 1);
    
    tasks.forEach(async task => {
        if (task.dueDate === today && task.status !== 'completed') {
            const exists = await dbGetAll('notifications');
            if (!exists.some(n => n.type === 'taskDeadline' && n.taskId === task.id && n.date === today)) {
                await dbPut('notifications', {
                    id: generateId(),
                    type: 'taskDeadline',
                    taskId: task.id,
                    title: 'Task Due Today',
                    message: `"${task.title}" is due today`,
                    icon: '📋',
                    date: new Date().toISOString(),
                    read: false
                });
            }
        }
        
        if (task.dueDate === tomorrow && task.status !== 'completed') {
            const exists = await dbGetAll('notifications');
            if (!exists.some(n => n.type === 'taskDeadline' && n.taskId === task.id && n.date === tomorrow)) {
                await dbPut('notifications', {
                    id: generateId(),
                    type: 'taskDeadline',
                    taskId: task.id,
                    title: 'Task Due Tomorrow',
                    message: `"${task.title}" is due tomorrow`,
                    icon: '📋',
                    date: new Date().toISOString(),
                    read: false
                });
            }
        }
    });
    
    // Check for reviews
    const reviews = await dbGetAll('reviews');
    reviews.forEach(async review => {
        if (review.status === 'pending' && review.reviewDate <= today) {
            const exists = await dbGetAll('notifications');
            if (!exists.some(n => n.type === 'review' && n.reviewId === review.id)) {
                const task = await dbGet('tasks', review.taskId);
                await dbPut('notifications', {
                    id: generateId(),
                    type: 'review',
                    reviewId: review.id,
                    taskId: review.taskId,
                    title: 'Review Due',
                    message: `Review for "${task?.title || 'unknown'}" is due`,
                    icon: '🔄',
                    date: new Date().toISOString(),
                    read: false
                });
            }
        }
    });
}

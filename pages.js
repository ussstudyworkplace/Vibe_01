// ===== DASHBOARD =====
async function renderDashboard() {
    const tasks = await dbGetAll('tasks');
    const subjects = await dbGetAll('subjects');
    const marks = await dbGetAll('marks');
    const timerSessions = await dbGetAll('timerSessions');
    const goals = await dbGetAll('goals');
    const reviews = await dbGetAll('reviews');
    
    const today = getToday();
    const thisWeek = getCurrentWeek();
    const thisMonth = getCurrentMonth();
    
    // Today's tasks
    const todayTasks = tasks.filter(t => t.dueDate === today && t.status !== 'completed');
    const completedToday = tasks.filter(t => t.completedAt && t.completedAt.startsWith(today));
    
    // This week stats
    const weekTasks = tasks.filter(t => t.dueDate >= thisWeek.firstDay && t.dueDate <= thisWeek.lastDay);
    const completedThisWeek = tasks.filter(t => t.completedAt && t.completedAt >= thisWeek.firstDay && t.completedAt <= thisWeek.lastDay);
    
    // Total study time
    const totalStudyTime = timerSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const todayStudyTime = timerSessions.filter(s => s.startTime && s.startTime.startsWith(today)).reduce((sum, s) => sum + (s.duration || 0), 0);
    
    // Average marks
    const avgMarks = marks.length > 0 ? (marks.reduce((sum, m) => sum + (m.marks || 0), 0) / marks.length) : 0;
    const maxMarks = marks.length > 0 ? Math.max(...marks.map(m => m.maxMarks || 0)) : 100;
    const avgPercentage = marks.length > 0 ? (avgMarks / maxMarks * 100) : 0;
    
    // Pending reviews
    const pendingReviews = reviews.filter(r => r.status === 'pending' && r.reviewDate <= today);
    
    // Active goals
    const activeGoals = goals.filter(g => !g.completed && g.deadline >= today);
    
    return `
        <div class="page-dashboard">
            <!-- Quick Stats -->
            <section class="section">
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-value">${totalStudyTime ? formatDuration(totalStudyTime) : '0s'}</div>
                        <div class="stat-label">Total Study Time</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${todayStudyTime ? formatDuration(todayStudyTime) : '0s'}</div>
                        <div class="stat-label">Today's Study</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${completedToday.length}</div>
                        <div class="stat-label">Tasks Completed Today</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${Math.round(avgPercentage)}%</div>
                        <div class="stat-label">Avg Marks</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${pendingReviews.length}</div>
                        <div class="stat-label">Pending Reviews</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${activeGoals.length}</div>
                        <div class="stat-label">Active Goals</div>
                    </div>
                </div>
            </section>
            
            <!-- Today's Tasks -->
            <section class="section">
                <div class="section-header">
                    <h2 class="section-title">Today's Tasks</h2>
                    <button class="btn btn-sm btn-primary" onclick="navigateTo('tasks')">View All</button>
                </div>
                ${todayTasks.length > 0 ? todayTasks.slice(0, 5).map(t => renderTaskItem(t)).join('') : '<div class="empty-state"><div class="empty-state-text">No tasks due today</div></div>'}
            </section>
            
            <!-- Study Overview -->
            <section class="section">
                <div class="section-header">
                    <h2 class="section-title">Study Overview</h2>
                </div>
                <div class="d-flex gap-md flex-wrap">
                    <div class="card flex-1" style="min-width:250px">
                        <div class="card-header">
                            <h3 class="card-title">Time Distribution</h3>
                        </div>
                        <div id="timeDistChart" class="chart-container"></div>
                    </div>
                    <div class="card flex-1" style="min-width:250px">
                        <div class="card-header">
                            <h3 class="card-title">Task Progress</h3>
                        </div>
                        <div class="d-flex align-center gap-md">
                            <div style="flex:1">
                                <div class="d-flex justify-between mb-xs">
                                    <span>Completed</span>
                                    <span>${completedThisWeek.length}</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill success" style="width:${weekTasks.length > 0 ? (completedThisWeek.length / weekTasks.length * 100) : 0}%"></div>
                                </div>
                                <div class="text-muted mt-xs" style="font-size:12px">${weekTasks.length} total tasks this week</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Calendar Preview -->
            <section class="section">
                <div class="section-header">
                    <h2 class="section-title">Calendar Preview</h2>
                    <button class="btn btn-sm btn-outline" onclick="navigateTo('calendar')">View Full Calendar</button>
                </div>
                <div id="dashboardCalendar" class="calendar-grid"></div>
            </section>
            
            <!-- Marks Analysis -->
            <section class="section">
                <div class="section-header">
                    <h2 class="section-title">Marks Analysis</h2>
                    <button class="btn btn-sm btn-outline" onclick="navigateTo('marks')">View All</button>
                </div>
                <div class="d-flex gap-md flex-wrap">
                    ${marks.length > 0 ? marks.slice(0, 3).map(m => `
                        <div class="card" style="min-width:200px">
                            <div class="card-header">
                                <h4 class="card-title" style="font-size:14px">${m.paper}</h4>
                            </div>
                            <div style="text-align:center">
                                <div style="font-size:24px;font-weight:700;color:var(--accent-purple)">${m.marks}/${m.maxMarks}</div>
                                <div style="font-size:12px;color:var(--text-muted)">${Math.round(m.marks/m.maxMarks*100)}%</div>
                            </div>
                        </div>
                    `).join('') : '<div class="empty-state"><div class="empty-state-text">No marks recorded yet</div></div>'}
                </div>
            </section>
            
            <!-- Focus Timer Preview -->
            <section class="section">
                <div class="section-header">
                    <h2 class="section-title">Focus Timer</h2>
                    <button class="btn btn-sm btn-primary" onclick="navigateTo('timer')">Open Timer</button>
                </div>
                <div class="card">
                    <div class="timer-display" id="dashboardTimer">${formatTimer(AppState.timerRemaining)}</div>
                    <div class="timer-controls mt-md">
                        <button class="btn btn-outline" onclick="startDashboardTimer()">Start</button>
                        <button class="btn btn-outline" onclick="navigateTo('timer')">Full Timer</button>
                    </div>
                </div>
            </section>
            
            <!-- Quick Actions -->
            <section class="section">
                <div class="section-header">
                    <h2 class="section-title">Quick Actions</h2>
                </div>
                <div class="d-flex gap-md flex-wrap">
                    <button class="btn btn-primary flex-1" onclick="navigateTo('tasks');setTimeout(()=>showTaskModal(),100)" style="min-width:150px">
                        <span>📝</span> Add Task
                    </button>
                    <button class="btn btn-secondary flex-1" onclick="navigateTo('subjects');setTimeout(()=>showSubjectModal(),100)" style="min-width:150px">
                        <span>📚</span> Add Subject
                    </button>
                    <button class="btn btn-info flex-1" onclick="navigateTo('marks');setTimeout(()=>showMarkModal(),100)" style="min-width:150px">
                        <span>📊</span> Add Marks
                    </button>
                    <button class="btn btn-success flex-1" onclick="navigateTo('timer')" style="min-width:150px">
                        <span>⏱️</span> Start Timer
                    </button>
                </div>
            </section>
        </div>
    `;
}

function initDashboard() {
    renderDashboardCalendar();
    renderTimeDistributionChart();
    updateDashboardTimer();
    
    // Update timer every second
    if (AppState.timerInterval) clearInterval(AppState.timerInterval);
    AppState.timerInterval = setInterval(updateDashboardTimer, 1000);
}

function renderTaskItem(task) {
    const subject = AppState.subjectsCache?.find(s => s.id === task.subjectId);
    const subjectColor = subject?.color || '#8b5cf6';
    const dueDate = task.dueDate ? formatDate(task.dueDate) : '';
    const priorityColor = { high: 'danger', medium: 'warning', low: 'info' }[task.priority] || 'secondary';
    
    return `
        <div class="task-item" onclick="navigateTo('tasks');setTimeout(()=>{loadTaskDetails(${task.id})},100)">
            <input type="checkbox" class="task-checkbox" ${task.status === 'completed' ? 'checked' : ''} 
                   onchange="toggleTaskStatus(${task.id}, this.checked);event.stopPropagation()">
            <div class="task-info">
                <div class="task-title">${task.title}</div>
                <div class="task-meta">
                    ${subject ? `<span class="badge badge-info" style="color:${subjectColor};border-color:${subjectColor}">${subject.code || subject.name}</span>` : ''}
                    ${dueDate ? `<span>Due: ${dueDate}</span>` : ''}
                    ${task.priority ? `<span class="badge badge-${priorityColor}">${task.priority}</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn" onclick="toggleTaskStatus(${task.id}, true);event.stopPropagation()">✓</button>
            </div>
        </div>
    `;
}

async function renderDashboardCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const tasks = await dbGetAll('tasks');
    const tasksByDate = {};
    tasks.forEach(t => {
        if (t.dueDate) {
            if (!tasksByDate[t.dueDate]) tasksByDate[t.dueDate] = [];
            tasksByDate[t.dueDate].push(t);
        }
    });
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    let html = '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Header
    html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);padding:10px 0;border-bottom:1px solid var(--border-color);margin-bottom:10px">';
    days.forEach(d => html += `<div style="text-align:center;font-size:12px;color:var(--text-muted)">${d}</div>`);
    html += '</div>';
    
    // Days
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day other-month"><div class="calendar-day-number"></div></div>';
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${(month+1).toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
        const isToday = dateStr === currentDate;
        const hasTasks = tasksByDate[dateStr] && tasksByDate[dateStr].length > 0;
        const isPast = dateStr < currentDate;
        
        let dayHtml = `<div class="calendar-day ${isToday?'today':''} ${hasTasks?'has-tasks':''} ${isPast?'other-month':''}" onclick="navigateTo('calendar')">
            <div class="calendar-day-number">${day}</div>`;
        
        if (hasTasks) {
            const completedTasks = tasksByDate[dateStr].filter(t => t.status === 'completed').length;
            const totalTasks = tasksByDate[dateStr].length;
            dayHtml += `<div class="calendar-day-dots">`;
            for (let i = 0; i < Math.min(totalTasks, 3); i++) {
                dayHtml += `<div class="calendar-day-dot" style="background:${i < completedTasks ? 'var(--success)' : 'var(--accent-purple)'}"></div>`;
            }
            dayHtml += `</div>`;
        }
        
        dayHtml += `</div>`;
        html += dayHtml;
    }
    
    document.getElementById('dashboardCalendar').innerHTML = html;
}

function startDashboardTimer() {
    navigateTo('timer');
}

function updateDashboardTimer() {
    const display = document.getElementById('dashboardTimer');
    if (display) display.textContent = formatTimer(AppState.timerRemaining);
}

// ===== TASKS =====
async function renderTasks() {
    const tasks = await dbGetAll('tasks');
    const subjects = await dbGetAll('subjects');
    AppState.subjectsCache = subjects;
    
    const today = getToday();
    const overdue = tasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'completed');
    const dueToday = tasks.filter(t => t.dueDate === today && t.status !== 'completed');
    const upcoming = tasks.filter(t => t.dueDate && t.dueDate > today && t.status !== 'completed');
    const completed = tasks.filter(t => t.status === 'completed');
    const noDue = tasks.filter(t => !t.dueDate && t.status !== 'completed');
    
    return `
        <div class="page-tasks">
            <div class="section-header mb-md">
                <h2 class="section-title">Tasks</h2>
                <button class="btn btn-primary btn-sm" onclick="showTaskModal()">+ Add Task</button>
            </div>
            
            <!-- Stats -->
            <div class="stats-grid mb-lg">
                <div class="stat-item">
                    <div class="stat-value">${tasks.length}</div>
                    <div class="stat-label">Total Tasks</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${completed.length}</div>
                    <div class="stat-label">Completed</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${overdue.length}</div>
                    <div class="stat-label">Overdue</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${dueToday.length}</div>
                    <div class="stat-label">Due Today</div>
                </div>
            </div>
            
            <!-- Filters -->
            <div class="card mb-md">
                <div class="d-flex gap-md flex-wrap align-center">
                    <div class="form-group mb-0">
                        <label class="form-label">Status</label>
                        <select class="form-select" id="taskStatusFilter" onchange="filterTasks()">
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                    <div class="form-group mb-0">
                        <label class="form-label">Priority</label>
                        <select class="form-select" id="taskPriorityFilter" onchange="filterTasks()">
                            <option value="all">All</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                    <div class="form-group mb-0">
                        <label class="form-label">Subject</label>
                        <select class="form-select" id="taskSubjectFilter" onchange="filterTasks()">
                            <option value="all">All</option>
                            ${subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group mb-0">
                        <label class="form-label">Sort By</label>
                        <select class="form-select" id="taskSortFilter" onchange="filterTasks()">
                            <option value="dueDate">Due Date</option>
                            <option value="createdAt">Created At</option>
                            <option value="priority">Priority</option>
                            <option value="title">Title</option>
                        </select>
                    </div>
                    <div class="form-group mb-0">
                        <label class="form-label">&nbsp;</label>
                        <div class="d-flex gap-sm">
                            <button class="btn btn-sm btn-outline" onclick="clearTaskFilters()">Clear</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Task Groups -->
            ${overdue.length > 0 ? `
                <section class="section">
                    <div class="section-header">
                        <h3 class="section-title">Overdue (${overdue.length})</h3>
                    </div>
                    <div id="overdueTasks">${overdue.map(t => renderTaskItem(t)).join('')}</div>
                </section>
            ` : ''}
            
            ${dueToday.length > 0 ? `
                <section class="section">
                    <div class="section-header">
                        <h3 class="section-title">Due Today (${dueToday.length})</h3>
                    </div>
                    <div id="dueTodayTasks">${dueToday.map(t => renderTaskItem(t)).join('')}</div>
                </section>
            ` : ''}
            
            ${upcoming.length > 0 ? `
                <section class="section">
                    <div class="section-header">
                        <h3 class="section-title">Upcoming (${upcoming.length})</h3>
                    </div>
                    <div id="upcomingTasks">${upcoming.map(t => renderTaskItem(t)).join('')}</div>
                </section>
            ` : ''}
            
            ${noDue.length > 0 ? `
                <section class="section">
                    <div class="section-header">
                        <h3 class="section-title">No Due Date (${noDue.length})</h3>
                    </div>
                    <div id="noDueTasks">${noDue.map(t => renderTaskItem(t)).join('')}</div>
                </section>
            ` : ''}
            
            ${completed.length > 0 ? `
                <section class="section">
                    <div class="section-header">
                        <h3 class="section-title">Completed (${completed.length})</h3>
                        <button class="btn btn-sm btn-ghost" onclick="toggleCompletedTasks()">Hide/Show</button>
                    </div>
                    <div id="completedTasks">${completed.map(t => renderTaskItem(t)).join('')}</div>
                </section>
            ` : ''}
            
            ${tasks.length === 0 ? `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <div class="empty-state-title">No tasks yet</div>
                    <div class="empty-state-text">Start by adding your first task</div>
                    <button class="btn btn-primary mt-md" onclick="showTaskModal()">Add Task</button>
                </div>
            ` : ''}
            
            <!-- Task Detail Modal -->
            <div class="modal-overlay" id="taskDetailModal">
                <div class="modal" style="max-width:600px">
                    <div class="modal-header">
                        <div class="modal-title" id="taskModalTitle">Task Details</div>
                        <button class="modal-close" onclick="closeTaskModal()">&times;</button>
                    </div>
                    <div class="modal-body" id="taskModalBody"></div>
                    <div class="modal-footer" id="taskModalFooter"></div>
                </div>
            </div>
            
            <!-- Add/Edit Task Modal -->
            <div class="modal-overlay" id="taskFormModal">
                <div class="modal" style="max-width:600px">
                    <div class="modal-header">
                        <div class="modal-title" id="taskFormTitle">Add Task</div>
                        <button class="modal-close" onclick="closeTaskFormModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="taskForm" onsubmit="saveTask(event)">
                            <input type="hidden" id="taskId">
                            <div class="form-group">
                                <label class="form-label">Title *</label>
                                <input type="text" class="form-input" id="taskTitle" required placeholder="Task title">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Description</label>
                                <textarea class="form-textarea" id="taskDescription" placeholder="Task description..."></textarea>
                            </div>
                            <div class="d-flex gap-md flex-wrap">
                                <div class="form-group flex-1" style="min-width:150px">
                                    <label class="form-label">Subject</label>
                                    <select class="form-select" id="taskSubjectId">
                                        <option value="">No Subject</option>
                                        ${subjects.map(s => `<option value="${s.id}">${s.name} (${s.code})</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group flex-1" style="min-width:150px">
                                    <label class="form-label">Priority</label>
                                    <select class="form-select" id="taskPriority">
                                        <option value="">None</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>
                            </div>
                            <div class="d-flex gap-md flex-wrap">
                                <div class="form-group flex-1" style="min-width:150px">
                                    <label class="form-label">Due Date</label>
                                    <input type="date" class="form-input" id="taskDueDate">
                                </div>
                                <div class="form-group flex-1" style="min-width:150px">
                                    <label class="form-label">Due Time</label>
                                    <input type="time" class="form-input" id="taskDueTime">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Estimated Duration (minutes)</label>
                                <input type="number" class="form-input" id="taskEstimatedDuration" placeholder="e.g., 30">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Tags</label>
                                <input type="text" class="form-input" id="taskTags" placeholder="Comma separated tags">
                            </div>
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" id="taskForgettingCurve">
                                <label class="form-label">Enable Forgetting Curve Reviews</label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeTaskFormModal()">Cancel</button>
                        <button type="button" class="btn btn-danger" onclick="deleteTask()" id="deleteTaskBtn" style="display:none">Delete</button>
                        <button type="button" class="btn btn-primary" onclick="saveTask()">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initTasks() {
    // Load all tasks for filtering
    filterTasks();
    
    // Event listeners for modals
    ['taskDetailModal', 'taskFormModal'].forEach(id => {
        document.getElementById(id).addEventListener('click', e => {
            if (e.target === e.currentTarget) {
                if (id === 'taskDetailModal') closeTaskModal();
                else closeTaskFormModal();
            }
        });
    });
}

function showTaskModal(taskId) {
    if (taskId) {
        loadTaskDetails(taskId);
    } else {
        document.getElementById('taskFormTitle').textContent = 'Add Task';
        document.getElementById('taskId').value = '';
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskSubjectId').value = '';
        document.getElementById('taskPriority').value = '';
        document.getElementById('taskDueDate').value = '';
        document.getElementById('taskDueTime').value = '';
        document.getElementById('taskEstimatedDuration').value = '';
        document.getElementById('taskTags').value = '';
        document.getElementById('taskForgettingCurve').checked = true;
        document.getElementById('deleteTaskBtn').style.display = 'none';
    }
    document.getElementById('taskFormModal').classList.add('active');
}

function closeTaskModal() {
    document.getElementById('taskDetailModal').classList.remove('active');
}

function closeTaskFormModal() {
    document.getElementById('taskFormModal').classList.remove('active');
}

async function loadTaskDetails(taskId) {
    const task = await dbGet('tasks', taskId);
    if (!task) return;
    
    const subject = AppState.subjectsCache?.find(s => s.id === task.subjectId);
    const dueDateTime = task.dueDate ? new Date(task.dueDate) : null;
    
    document.getElementById('taskModalTitle').textContent = task.title;
    document.getElementById('taskModalBody').innerHTML = `
        <div class="form-group">
            <label class="form-label">Description</label>
            <div style="padding:10px;background:var(--bg-tertiary);border-radius:var(--radius-md);min-height:50px">
                ${task.description || '<em>No description</em>'}
            </div>
        </div>
        <div class="d-flex gap-md flex-wrap">
            <div class="form-group flex-1">
                <label class="form-label">Subject</label>
                <div>${subject ? `${subject.name} (${subject.code})` : 'No subject'}</div>
            </div>
            <div class="form-group flex-1">
                <label class="form-label">Priority</label>
                <div>${task.priority ? `<span class="badge badge-${{high:'danger',medium:'warning',low:'info'}[task.priority]}">${task.priority}</span>` : 'None'}</div>
            </div>
        </div>
        <div class="d-flex gap-md flex-wrap">
            <div class="form-group flex-1">
                <label class="form-label">Due Date</label>
                <div>${task.dueDate ? formatDateTime(task.dueDate) : 'No due date'}</div>
            </div>
            <div class="form-group flex-1">
                <label class="form-label">Estimated Duration</label>
                <div>${task.estimatedDuration ? `${task.estimatedDuration} minutes` : 'Not set'}</div>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Tags</label>
            <div>${task.tags ? task.tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('') : 'No tags'}</div>
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <div>${task.status === 'completed' ? '<span class="badge badge-success">Completed</span>' : '<span class="badge badge-warning">Active</span>'}</div>
        </div>
        <div class="form-group">
            <label class="form-label">Created</label>
            <div>${formatDateTime(task.createdAt)}</div>
        </div>
        ${task.completedAt ? `
            <div class="form-group">
                <label class="form-label">Completed At</label>
                <div>${formatDateTime(task.completedAt)}</div>
            </div>
        ` : ''}
        <div class="form-check">
            <input type="checkbox" class="form-check-input" id="viewForgettingCurve" ${task.forgettingCurve ? 'checked' : ''} disabled>
            <label class="form-label">Forgetting Curve Reviews Enabled</label>
        </div>
    `;
    
    document.getElementById('taskModalFooter').innerHTML = `
        <button class="btn btn-secondary" onclick="closeTaskModal()">Close</button>
        <button class="btn btn-primary" onclick="showTaskModal(${task.id})">Edit</button>
        <button class="btn btn-danger" onclick="showConfirm('Delete Task','Are you sure you want to delete this task?',()=>deleteTask(${task.id}))">Delete</button>
    `;
    
    document.getElementById('taskDetailModal').classList.add('active');
}

async function saveTask() {
    const id = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const subjectId = document.getElementById('taskSubjectId').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const dueTime = document.getElementById('taskDueTime').value;
    const estimatedDuration = document.getElementById('taskEstimatedDuration').value;
    const tags = document.getElementById('taskTags').value.trim();
    const forgettingCurve = document.getElementById('taskForgettingCurve').checked;
    
    if (!title) {
        showToast('Please enter a title', 'danger');
        return;
    }
    
    let dueDateTime = null;
    if (dueDate) {
        dueDateTime = dueDate;
        if (dueTime) {
            dueDateTime += `T${dueTime}`;
        }
    }
    
    const task = {
        id: id || generateId(),
        title,
        description,
        subjectId: subjectId || null,
        priority: priority || null,
        dueDate: dueDateTime,
        estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : null,
        tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [],
        forgettingCurve,
        status: 'active',
        createdAt: new Date().toISOString(),
        completedAt: null
    };
    
    try {
        await dbPut('tasks', task);
        showToast('Task saved successfully', 'success');
        closeTaskFormModal();
        
        // If we're on the tasks page, refresh
        if (AppState.currentPage === 'tasks') {
            loadPage('tasks');
        }
        
        // If forgetting curve is enabled, create review schedule
        if (forgettingCurve) {
            createForgettingCurveReviews(task.id);
        }
        
    } catch (error) {
        showToast('Error saving task: ' + error.message, 'danger');
    }
}

async function deleteTask(taskId) {
    if (!taskId) return;
    
    try {
        await dbDelete('tasks', taskId);
        showToast('Task deleted successfully', 'success');
        closeTaskFormModal();
        closeTaskModal();
        
        // Delete related reviews
        const reviews = await dbGetAll('reviews');
        reviews.filter(r => r.taskId === taskId).forEach(async r => {
            await dbDelete('reviews', r.id);
        });
        
        if (AppState.currentPage === 'tasks') {
            loadPage('tasks');
        }
    } catch (error) {
        showToast('Error deleting task: ' + error.message, 'danger');
    }
}

async function toggleTaskStatus(taskId, completed) {
    const task = await dbGet('tasks', taskId);
    if (!task) return;
    
    const updated = {
        ...task,
        status: completed ? 'completed' : 'active',
        completedAt: completed ? new Date().toISOString() : null
    };
    
    try {
        await dbPut('tasks', updated);
        showToast(`Task marked as ${completed ? 'completed' : 'active'}`, 'success');
        
        // If forgetting curve is enabled and task is completed, create/update reviews
        if (completed && task.forgettingCurve) {
            createForgettingCurveReviews(taskId);
        }
        
        // Refresh current page
        loadPage(AppState.currentPage);
    } catch (error) {
        showToast('Error updating task: ' + error.message, 'danger');
    }
}

async function createForgettingCurveReviews(taskId) {
    const task = await dbGet('tasks', taskId);
    if (!task || !task.forgettingCurve) return;
    
    // Delete existing reviews for this task
    const reviews = await dbGetAll('reviews');
    reviews.filter(r => r.taskId === taskId).forEach(async r => {
        await dbDelete('reviews', r.id);
    });
    
    const today = getToday();
    const reviewDates = [
        { days: 1, date: addDays(today, 1) },
        { days: 3, date: addDays(today, 3) },
        { days: 7, date: addDays(today, 7) },
        { days: 21, date: addDays(today, 21) }
    ];
    
    reviewDates.forEach(({ days, date }) => {
        const review = {
            id: generateId(),
            taskId,
            reviewDate: date,
            status: 'pending',
            createdAt: new Date().toISOString(),
            reviewedAt: null
        };
        dbPut('reviews', review);
    });
}

function addDays(dateStr, days) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

function filterTasks() {
    // This will be implemented with actual filtering logic
    // For now, just reload the page
    loadPage('tasks');
}

function clearTaskFilters() {
    document.getElementById('taskStatusFilter').value = 'all';
    document.getElementById('taskPriorityFilter').value = 'all';
    document.getElementById('taskSubjectFilter').value = 'all';
    document.getElementById('taskSortFilter').value = 'dueDate';
    filterTasks();
}

function toggleCompletedTasks() {
    const container = document.getElementById('completedTasks');
    if (container.style.display === 'none') {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

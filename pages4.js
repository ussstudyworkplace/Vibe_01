// ===== REVIEWS (FORGETTING CURVE) =====
async function renderReviews() {
    const reviews = await dbGetAll('reviews');
    const tasks = await dbGetAll('tasks');
    const today = getToday();
    
    // Group reviews
    const pendingReviews = reviews.filter(r => r.status === 'pending' && r.reviewDate <= today);
    const upcomingReviews = reviews.filter(r => r.status === 'pending' && r.reviewDate > today);
    const completedReviews = reviews.filter(r => r.status === 'completed');
    
    // Sort by review date
    pendingReviews.sort((a, b) => a.reviewDate.localeCompare(b.reviewDate));
    upcomingReviews.sort((a, b) => a.reviewDate.localeCompare(b.reviewDate));
    completedReviews.sort((a, b) => b.reviewDate.localeCompare(a.reviewDate));
    
    return `
        <div class="page-reviews">
            <div class="section-header mb-md">
                <h2 class="section-title">Forgetting Curve Reviews</h2>
                <button class="btn btn-sm btn-outline" onclick="refreshReviews()">Refresh</button>
            </div>
            
            <!-- Stats -->
            <div class="stats-grid mb-lg">
                <div class="stat-item">
                    <div class="stat-value">${pendingReviews.length}</div>
                    <div class="stat-label">Due Now</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${upcomingReviews.length}</div>
                    <div class="stat-label">Upcoming</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${completedReviews.length}</div>
                    <div class="stat-label">Completed</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${reviews.length}</div>
                    <div class="stat-label">Total Reviews</div>
                </div>
            </div>
            
            <!-- Due Now -->
            ${pendingReviews.length > 0 ? `
                <section class="section">
                    <div class="section-header">
                        <h3 class="section-title">Due Now (${pendingReviews.length})</h3>
                    </div>
                    <div id="pendingReviews">
                        ${pendingReviews.map(r => renderReviewItem(r, tasks)).join('')}
                    </div>
                </section>
            ` : ''}
            
            <!-- Upcoming -->
            ${upcomingReviews.length > 0 ? `
                <section class="section">
                    <div class="section-header">
                        <h3 class="section-title">Upcoming (${upcomingReviews.length})</h3>
                    </div>
                    <div id="upcomingReviews">
                        ${upcomingReviews.map(r => renderReviewItem(r, tasks)).join('')}
                    </div>
                </section>
            ` : ''}
            
            <!-- Completed -->
            ${completedReviews.length > 0 ? `
                <section class="section">
                    <div class="section-header">
                        <h3 class="section-title">Completed (${completedReviews.length})</h3>
                        <button class="btn btn-sm btn-ghost" onclick="toggleCompletedReviews()">Hide/Show</button>
                    </div>
                    <div id="completedReviews">
                        ${completedReviews.slice(0, 20).map(r => renderReviewItem(r, tasks)).join('')}
                    </div>
                </section>
            ` : ''}
            
            ${reviews.length === 0 ? `
                <div class="empty-state">
                    <div class="empty-state-icon">🔄</div>
                    <div class="empty-state-title">No reviews yet</div>
                    <div class="empty-state-text">Complete tasks with forgetting curve enabled to generate reviews</div>
                </div>
            ` : ''}
            
            <!-- Review Actions Modal -->
            <div class="modal-overlay" id="reviewActionModal">
                <div class="modal">
                    <div class="modal-header">
                        <div class="modal-title" id="reviewActionTitle">Review Actions</div>
                        <button class="modal-close" onclick="closeReviewActionModal()">&times;</button>
                    </div>
                    <div class="modal-body" id="reviewActionBody"></div>
                    <div class="modal-footer" id="reviewActionFooter"></div>
                </div>
            </div>
        </div>
    `;
}

function initReviews() {
    // Event listeners
    document.getElementById('reviewActionModal').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeReviewActionModal();
    });
}

function renderReviewItem(review, tasks) {
    const task = tasks.find(t => t.id === review.taskId);
    const today = getToday();
    const isOverdue = review.reviewDate < today;
    const isCompleted = review.status === 'completed';
    
    const daysOverdue = isOverdue && !isCompleted ? Math.floor((new Date(today) - new Date(review.reviewDate)) / (1000 * 60 * 60 * 24)) : 0;
    
    return `
        <div class="task-item" onclick="showReviewActions(${review.id})">
            <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''} 
                   onchange="toggleReviewStatus(${review.id}, this.checked);event.stopPropagation()">
            <div class="task-info">
                <div class="task-title">${task ? task.title : 'Unknown Task'}</div>
                <div class="task-meta">
                    <span>Review due: ${formatDate(review.reviewDate)}</span>
                    ${isOverdue && !isCompleted ? `<span class="badge badge-danger">${daysOverdue} days overdue</span>` : ''}
                    ${isCompleted ? `<span class="badge badge-success">Completed on ${formatDate(review.reviewedAt)}</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn" onclick="showReviewActions(${review.id});event.stopPropagation()">⋮</button>
            </div>
        </div>
    `;
}

function showReviewActions(reviewId) {
    document.getElementById('reviewActionModal').classList.add('active');
    document.getElementById('reviewActionBody').innerHTML = `
        <div style="text-align:center">
            <button class="btn btn-success btn-lg btn-block mb-sm" onclick="markReviewAsReviewed(${reviewId});closeReviewActionModal()">
                ✓ Mark as Reviewed
            </button>
            <button class="btn btn-warning btn-lg btn-block mb-sm" onclick="remindLater(${reviewId});closeReviewActionModal()">
                ⏰ Remind Later
            </button>
            <button class="btn btn-danger btn-lg btn-block" onclick="skipReview(${reviewId});closeReviewActionModal()">
                ✗ Skip Review
            </button>
        </div>
    `;
    document.getElementById('reviewActionFooter').innerHTML = `
        <button class="btn btn-secondary" onclick="closeReviewActionModal()">Cancel</button>
    `;
}

function closeReviewActionModal() {
    document.getElementById('reviewActionModal').classList.remove('active');
}

async function toggleReviewStatus(reviewId, completed) {
    const review = await dbGet('reviews', reviewId);
    if (!review) return;
    
    const updated = {
        ...review,
        status: completed ? 'completed' : 'pending',
        reviewedAt: completed ? new Date().toISOString() : null
    };
    
    try {
        await dbPut('reviews', updated);
        showToast(`Review marked as ${completed ? 'completed' : 'pending'}`, 'success');
        
        // If task is reopened, reset the forgetting curve
        if (!completed) {
            const task = await dbGet('tasks', review.taskId);
            if (task && task.forgettingCurve) {
                createForgettingCurveReviews(task.id);
            }
        }
        
        loadPage('reviews');
    } catch (error) {
        showToast('Error updating review: ' + error.message, 'danger');
    }
}

async function markReviewAsReviewed(reviewId) {
    await toggleReviewStatus(reviewId, true);
    showToast('Review marked as completed!', 'success');
}

async function remindLater(reviewId) {
    const review = await dbGet('reviews', reviewId);
    if (!review) return;
    
    // Add 1 day to the review date
    const newDate = new Date(review.reviewDate);
    newDate.setDate(newDate.getDate() + 1);
    
    const updated = {
        ...review,
        reviewDate: newDate.toISOString().split('T')[0],
        status: 'pending'
    };
    
    try {
        await dbPut('reviews', updated);
        showToast('Review rescheduled for tomorrow', 'success');
        loadPage('reviews');
    } catch (error) {
        showToast('Error rescheduling review: ' + error.message, 'danger');
    }
}

async function skipReview(reviewId) {
    const review = await dbGet('reviews', reviewId);
    if (!review) return;
    
    const updated = {
        ...review,
        status: 'skipped',
        reviewedAt: new Date().toISOString()
    };
    
    try {
        await dbPut('reviews', updated);
        showToast('Review skipped', 'warning');
        loadPage('reviews');
    } catch (error) {
        showToast('Error skipping review: ' + error.message, 'danger');
    }
}

async function refreshReviews() {
    // Recreate all forgetting curve reviews
    const tasks = await dbGetAll('tasks');
    const enabledTasks = tasks.filter(t => t.forgettingCurve && t.status === 'completed');
    
    enabledTasks.forEach(async task => {
        await createForgettingCurveReviews(task.id);
    });
    
    showToast('Reviews refreshed!', 'success');
    loadPage('reviews');
}

function toggleCompletedReviews() {
    const container = document.getElementById('completedReviews');
    if (container.style.display === 'none') {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

// ===== ANALYTICS =====
async function renderAnalytics() {
    const tasks = await dbGetAll('tasks');
    const timerSessions = await dbGetAll('timerSessions');
    const marks = await dbGetAll('marks');
    const subjects = await dbGetAll('subjects');
    const reviews = await dbGetAll('reviews');
    const goals = await dbGetAll('goals');
    
    const today = getToday();
    const thisWeek = getCurrentWeek();
    const thisMonth = getCurrentMonth();
    
    // Calculate statistics
    const completedTasksToday = tasks.filter(t => t.completedAt && t.completedAt.startsWith(today));
    const completedTasksThisWeek = tasks.filter(t => t.completedAt >= thisWeek.firstDay && t.completedAt <= thisWeek.lastDay);
    const completedTasksThisMonth = tasks.filter(t => t.completedAt >= thisMonth.firstDay && t.completedAt <= thisMonth.lastDay);
    
    const studyTimeToday = timerSessions.filter(s => s.startTime && s.startTime.startsWith(today)).reduce((sum, s) => sum + (s.duration || 0), 0);
    const studyTimeThisWeek = timerSessions.filter(s => s.startTime >= thisWeek.firstDay && s.startTime <= thisWeek.lastDay).reduce((sum, s) => sum + (s.duration || 0), 0);
    const studyTimeThisMonth = timerSessions.filter(s => s.startTime >= thisMonth.firstDay && s.startTime <= thisMonth.lastDay).reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalStudyTime = timerSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    
    // Subject-wise statistics
    const subjectStats = subjects.map(subject => {
        const subjectTasks = tasks.filter(t => t.subjectId === subject.id);
        const completedSubjectTasks = subjectTasks.filter(t => t.status === 'completed');
        const subjectSessions = timerSessions.filter(s => s.subjectId === subject.id);
        const subjectStudyTime = subjectSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        const subjectMarks = marks.filter(m => m.subjectId === subject.id);
        const avgMarks = subjectMarks.length > 0 ? (subjectMarks.reduce((sum, m) => sum + (m.marks || 0), 0) / subjectMarks.length) : 0;
        const maxMarks = subjectMarks.length > 0 ? Math.max(...subjectMarks.map(m => m.maxMarks || 0)) : 100;
        const avgPercentage = subjectMarks.length > 0 ? (avgMarks / maxMarks * 100) : 0;
        
        return {
            subject,
            taskCount: subjectTasks.length,
            completedCount: completedSubjectTasks.length,
            studyTime: subjectStudyTime,
            avgMarks: avgPercentage
        };
    });
    
    // Daily study time for the week
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(thisWeek.firstDay);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayStudyTime = timerSessions.filter(s => s.startTime && s.startTime.startsWith(dateStr)).reduce((sum, s) => sum + (s.duration || 0), 0);
        weekDays.push({ date: dateStr, day: dayName, time: dayStudyTime });
    }
    
    return `
        <div class="page-analytics">
            <!-- Summary Stats -->
            <section class="section">
                <h2 class="section-title mb-md">Analytics Dashboard</h2>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-value">${completedTasksToday.length}</div>
                        <div class="stat-label">Tasks Today</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${completedTasksThisWeek.length}</div>
                        <div class="stat-label">Tasks This Week</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${completedTasksThisMonth.length}</div>
                        <div class="stat-label">Tasks This Month</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${formatDuration(studyTimeToday)}</div>
                        <div class="stat-label">Study Time Today</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${formatDuration(studyTimeThisWeek)}</div>
                        <div class="stat-label">Study Time This Week</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${formatDuration(totalStudyTime)}</div>
                        <div class="stat-label">Total Study Time</div>
                    </div>
                </div>
            </section>
            
            <!-- Charts Section -->
            <section class="section">
                <h3 class="section-title mb-md">Study Time Trends</h3>
                <div class="d-flex gap-md flex-wrap">
                    <div class="card flex-1" style="min-width:300px">
                        <div class="card-header">
                            <h4 class="card-title">Weekly Study Time</h4>
                        </div>
                        <div id="weeklyStudyChart" class="chart-container"></div>
                    </div>
                    <div class="card flex-1" style="min-width:300px">
                        <div class="card-header">
                            <h4 class="card-title">Subject-wise Study Time</h4>
                        </div>
                        <div id="subjectStudyChart" class="chart-container"></div>
                    </div>
                </div>
            </section>
            
            <!-- Subject Performance -->
            <section class="section">
                <h3 class="section-title mb-md">Subject Performance</h3>
                <div class="d-flex gap-md flex-wrap">
                    ${subjectStats.map(stat => {
                        const percentage = stat.taskCount > 0 ? (stat.completedCount / stat.taskCount * 100) : 0;
                        return `
                            <div class="card" style="min-width:250px">
                                <div class="card-header">
                                    <h4 class="card-title" style="font-size:14px">${stat.subject.name}</h4>
                                </div>
                                <div style="margin-bottom:10px">
                                    <div style="font-size:12px;color:var(--text-muted);margin-bottom:5px">Tasks</div>
                                    <div class="progress-bar">
                                        <div class="progress-fill ${percentage >= 80 ? 'success' : percentage >= 50 ? 'warning' : 'danger'}" 
                                             style="width:${percentage}%"></div>
                                    </div>
                                    <div style="font-size:12px;color:var(--text-muted);margin-top:5px">
                                        ${stat.completedCount}/${stat.taskCount} completed
                                    </div>
                                </div>
                                <div style="margin-bottom:10px">
                                    <div style="font-size:12px;color:var(--text-muted);margin-bottom:5px">Study Time</div>
                                    <div style="font-weight:600">${formatDuration(stat.studyTime)}</div>
                                </div>
                                <div>
                                    <div style="font-size:12px;color:var(--text-muted);margin-bottom:5px">Avg Marks</div>
                                    <div style="font-weight:600;color:${stat.avgMarks >= 80 ? 'var(--success)' : stat.avgMarks >= 50 ? 'var(--warning)' : 'var(--danger)'}">
                                        ${Math.round(stat.avgMarks)}%
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </section>
            
            <!-- Task Completion Trends -->
            <section class="section">
                <h3 class="section-title mb-md">Task Completion Trends</h3>
                <div class="d-flex gap-md flex-wrap">
                    <div class="card flex-1" style="min-width:300px">
                        <div class="card-header">
                            <h4 class="card-title">Completion Rate</h4>
                        </div>
                        <div style="text-align:center;padding:20px">
                            <div style="font-size:32px;font-weight:700">${tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length * 100)) : 0}%</div>
                            <div style="color:var(--text-muted);margin-top:10px">Overall completion rate</div>
                        </div>
                    </div>
                    <div class="card flex-1" style="min-width:300px">
                        <div class="card-header">
                            <h4 class="card-title">Priority Distribution</h4>
                        </div>
                        <div id="priorityChart" class="chart-container"></div>
                    </div>
                </div>
            </section>
            
            <!-- Review Statistics -->
            <section class="section">
                <h3 class="section-title mb-md">Review Statistics</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-value">${reviews.length}</div>
                        <div class="stat-label">Total Reviews</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${reviews.filter(r => r.status === 'completed').length}</div>
                        <div class="stat-label">Completed Reviews</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${reviews.filter(r => r.status === 'pending').length}</div>
                        <div class="stat-label">Pending Reviews</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${Math.round(reviews.filter(r => r.status === 'completed').length / reviews.length * 100)}%</div>
                        <div class="stat-label">Review Completion Rate</div>
                    </div>
                </div>
            </section>
            
            <!-- Goals Progress -->
            <section class="section">
                <h3 class="section-title mb-md">Goals Progress</h3>
                <div id="goalsProgress">
                    ${goals.length > 0 ? goals.map(g => {
                        const progress = calculateGoalProgress(g);
                        return `
                            <div class="card mb-sm">
                                <div class="d-flex justify-between mb-sm">
                                    <div>
                                        <div style="font-weight:600">${g.title}</div>
                                        <div style="font-size:12px;color:var(--text-muted)">Due: ${formatDate(g.deadline)}</div>
                                    </div>
                                    <div>
                                        <span class="badge badge-${progress >= 100 ? 'success' : g.deadline < today ? 'danger' : 'warning'}">
                                            ${Math.round(progress)}%
                                        </span>
                                    </div>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill ${progress >= 100 ? 'success' : g.deadline < today ? 'danger' : 'info'}" 
                                         style="width:${Math.min(progress, 100)}%"></div>
                                </div>
                            </div>
                        `;
                    }).join('') : '<div class="empty-state"><div class="empty-state-text">No goals set</div></div>'}
                </div>
            </section>
        </div>
    `;
}

function initAnalytics() {
    renderWeeklyStudyChart();
    renderSubjectStudyChart();
    renderPriorityChart();
}

function calculateGoalProgress(goal) {
    const today = getToday();
    
    switch(goal.type) {
        case 'studyTime':
            // Calculate total study time
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

function renderWeeklyStudyChart() {
    // Simple bar chart using CSS
    const container = document.getElementById('weeklyStudyChart');
    if (!container) return;
    
    // Get data
    const thisWeek = getCurrentWeek();
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(thisWeek.firstDay);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        weekDays.push(dateStr);
    }
    
    // This is a placeholder - actual chart rendering would use a library
    container.innerHTML = `
        <div style="display:flex;align-items:flex-end;justify-content:space-between;height:150px;gap:5px">
            ${weekDays.map(dateStr => {
                const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
                const time = Math.random() * 3600; // Random for demo
                return `
                    <div style="flex:1;display:flex;flex-direction:column;align-items:center">
                        <div style="height:${Math.min(time / 3600 * 100, 100)}%;width:100%;background:var(--accent-purple);border-radius:4px 4px 0 0"></div>
                        <div style="font-size:10px;color:var(--text-muted);margin-top:5px">${dayName}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderSubjectStudyChart() {
    const container = document.getElementById('subjectStudyChart');
    if (!container) return;
    
    // Placeholder
    container.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:150px;color:var(--text-muted)">
            Chart coming soon
        </div>
    `;
}

function renderPriorityChart() {
    const container = document.getElementById('priorityChart');
    if (!container) return;
    
    // Placeholder
    container.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:150px;color:var(--text-muted)">
            Chart coming soon
        </div>
    `;
}

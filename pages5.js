// ===== REPORTS =====
async function renderReports() {
    const timerSessions = await dbGetAll('timerSessions');
    const tasks = await dbGetAll('tasks');
    const marks = await dbGetAll('marks');
    const subjects = await dbGetAll('subjects');
    
    const today = getToday();
    const thisWeek = getCurrentWeek();
    const thisMonth = getCurrentMonth();
    
    return `
        <div class="page-reports">
            <div class="section-header mb-md">
                <h2 class="section-title">Reports</h2>
            </div>
            
            <!-- Report Types -->
            <section class="section">
                <h3 class="section-title mb-md">Generate Reports</h3>
                <div class="d-flex gap-md flex-wrap">
                    <div class="card" style="min-width:250px;cursor:pointer" onclick="generateWeeklyStudyReport()">
                        <div style="display:flex;align-items:center;gap:15px">
                            <span style="font-size:32px">📅</span>
                            <div>
                                <div style="font-weight:600">Weekly Study Report</div>
                                <div style="font-size:12px;color:var(--text-muted)">${thisWeek.firstDay} to ${thisWeek.lastDay}</div>
                            </div>
                        </div>
                    </div>
                    <div class="card" style="min-width:250px;cursor:pointer" onclick="generateMonthlyProgressReport()">
                        <div style="display:flex;align-items:center;gap:15px">
                            <span style="font-size:32px">📈</span>
                            <div>
                                <div style="font-weight:600">Monthly Progress Report</div>
                                <div style="font-size:12px;color:var(--text-muted)">${thisMonth.firstDay} to ${thisMonth.lastDay}</div>
                            </div>
                        </div>
                    </div>
                    <div class="card" style="min-width:250px;cursor:pointer" onclick="generateSubjectReport()">
                        <div style="display:flex;align-items:center;gap:15px">
                            <span style="font-size:32px">📚</span>
                            <div>
                                <div style="font-weight:600">Subject Performance Report</div>
                                <div style="font-size:12px;color:var(--text-muted)">${subjects.length} subjects</div>
                            </div>
                        </div>
                    </div>
                    <div class="card" style="min-width:250px;cursor:pointer" onclick="generateExamPerformanceReport()">
                        <div style="display:flex;align-items:center;gap:15px">
                            <span style="font-size:32px">📊</span>
                            <div>
                                <div style="font-weight:600">Exam Performance Report</div>
                                <div style="font-size:12px;color:var(--text-muted)">${marks.length} papers</div>
                            </div>
                        </div>
                    </div>
                    <div class="card" style="min-width:250px;cursor:pointer" onclick="generateStudyPlanReport()">
                        <div style="display:flex;align-items:center;gap:15px">
                            <span style="font-size:32px">📋</span>
                            <div>
                                <div style="font-weight:600">Study Plan Report</div>
                                <div style="font-size:12px;color:var(--text-muted)">${tasks.length} tasks</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Report Preview Modal -->
            <div class="modal-overlay" id="reportModal">
                <div class="modal" style="max-width:800px;max-height:90vh">
                    <div class="modal-header">
                        <div class="modal-title" id="reportModalTitle">Report</div>
                        <button class="modal-close" onclick="closeReportModal()">&times;</button>
                    </div>
                    <div class="modal-body" id="reportModalBody" style="max-height:60vh;overflow-y:auto"></div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="closeReportModal()">Close</button>
                        <button class="btn btn-primary" onclick="exportReport()">Export</button>
                    </div>
                </div>
            </div>
            
            <!-- Export Options -->
            <section class="section">
                <h3 class="section-title mb-md">Export Options</h3>
                <div class="d-flex gap-md flex-wrap">
                    <button class="btn btn-outline" onclick="exportAllData()">Export All Data (JSON)</button>
                    <button class="btn btn-outline" onclick="exportTasksCSV()">Export Tasks (CSV)</button>
                    <button class="btn btn-outline" onclick="exportMarksCSV()">Export Marks (CSV)</button>
                    <button class="btn btn-outline" onclick="exportTimerSessionsCSV()">Export Timer Sessions (CSV)</button>
                </div>
            </section>
            
            <!-- Saved Reports -->
            <section class="section">
                <h3 class="section-title mb-md">Saved Reports</h3>
                <div id="savedReports">
                    <div class="empty-state">
                        <div class="empty-state-text">No saved reports yet</div>
                    </div>
                </div>
            </section>
        </div>
    `;
}

function initReports() {
    // Event listeners
    document.getElementById('reportModal').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeReportModal();
    });
}

function closeReportModal() {
    document.getElementById('reportModal').classList.remove('active');
}

let currentReport = null;

async function generateWeeklyStudyReport() {
    const timerSessions = await dbGetAll('timerSessions');
    const tasks = await dbGetAll('tasks');
    const thisWeek = getCurrentWeek();
    
    const weekSessions = timerSessions.filter(s => s.startTime >= thisWeek.firstDay && s.startTime <= thisWeek.lastDay);
    const totalTime = weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const completedTasks = tasks.filter(t => t.completedAt >= thisWeek.firstDay && t.completedAt <= thisWeek.lastDay);
    
    const html = `
        <div style="margin-bottom:20px">
            <h3 style="margin:0">Weekly Study Report</h3>
            <div style="color:var(--text-muted);font-size:14px">${formatDate(thisWeek.firstDay)} - ${formatDate(thisWeek.lastDay)}</div>
        </div>
        
        <div class="stats-grid mb-lg">
            <div class="stat-item">
                <div class="stat-value">${formatDuration(totalTime)}</div>
                <div class="stat-label">Total Study Time</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${weekSessions.length}</div>
                <div class="stat-label">Focus Sessions</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${completedTasks.length}</div>
                <div class="stat-label">Tasks Completed</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${Math.round(totalTime / 3600)}</div>
                <div class="stat-label">Hours Studied</div>
            </div>
        </div>
        
        <h4 style="margin:20px 0 10px 0">Daily Breakdown</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Sessions</th>
                        <th>Study Time</th>
                        <th>Tasks Completed</th>
                    </tr>
                </thead>
                <tbody>
                    ${Array.from({length: 7}, (_, i) => {
                        const date = new Date(thisWeek.firstDay);
                        date.setDate(date.getDate() + i);
                        const dateStr = date.toISOString().split('T')[0];
                        const daySessions = weekSessions.filter(s => s.startTime && s.startTime.startsWith(dateStr));
                        const dayTime = daySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
                        const dayTasks = tasks.filter(t => t.completedAt && t.completedAt.startsWith(dateStr));
                        return `
                            <tr>
                                <td>${formatDate(dateStr)}</td>
                                <td>${daySessions.length}</td>
                                <td>${formatDuration(dayTime)}</td>
                                <td>${dayTasks.length}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        
        <h4 style="margin:20px 0 10px 0">Recommendations</h4>
        <div style="padding:15px;background:var(--bg-tertiary);border-radius:var(--radius-md)">
            ${totalTime < 1800 ? '<p>💡 <strong>Tip:</strong> You studied less than 30 minutes this week. Try to increase your study time gradually.</p>' : ''}
            ${completedTasks.length === 0 ? '<p>💡 <strong>Tip:</strong> No tasks were completed this week. Set small, achievable goals to stay motivated.</p>' : ''}
            ${weekSessions.length === 0 ? '<p>💡 <strong>Tip:</strong> No focus sessions recorded. Use the Pomodoro timer to track your study time.</p>' : ''}
            ${totalTime >= 1800 && completedTasks.length >= 5 ? '<p>🎉 <strong>Great job!</strong> You had a productive week. Keep it up!</p>' : ''}
        </div>
    `;
    
    currentReport = { type: 'weeklyStudy', html };
    document.getElementById('reportModalTitle').textContent = 'Weekly Study Report';
    document.getElementById('reportModalBody').innerHTML = html;
    document.getElementById('reportModal').classList.add('active');
}

async function generateMonthlyProgressReport() {
    const timerSessions = await dbGetAll('timerSessions');
    const tasks = await dbGetAll('tasks');
    const marks = await dbGetAll('marks');
    const thisMonth = getCurrentMonth();
    
    const monthSessions = timerSessions.filter(s => s.startTime >= thisMonth.firstDay && s.startTime <= thisMonth.lastDay);
    const totalTime = monthSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const completedTasks = tasks.filter(t => t.completedAt >= thisMonth.firstDay && t.completedAt <= thisMonth.lastDay);
    const monthMarks = marks.filter(m => m.date >= thisMonth.firstDay && m.date <= thisMonth.lastDay);
    
    const avgMarks = monthMarks.length > 0 ? (monthMarks.reduce((sum, m) => sum + (m.marks || 0), 0) / monthMarks.length) : 0;
    const maxMarks = monthMarks.length > 0 ? Math.max(...monthMarks.map(m => m.maxMarks || 0)) : 100;
    const avgPercentage = monthMarks.length > 0 ? (avgMarks / maxMarks * 100) : 0;
    
    const html = `
        <div style="margin-bottom:20px">
            <h3 style="margin:0">Monthly Progress Report</h3>
            <div style="color:var(--text-muted);font-size:14px">${formatDate(thisMonth.firstDay)} - ${formatDate(thisMonth.lastDay)}</div>
        </div>
        
        <div class="stats-grid mb-lg">
            <div class="stat-item">
                <div class="stat-value">${formatDuration(totalTime)}</div>
                <div class="stat-label">Total Study Time</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${monthSessions.length}</div>
                <div class="stat-label">Focus Sessions</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${completedTasks.length}</div>
                <div class="stat-label">Tasks Completed</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${Math.round(avgPercentage)}%</div>
                <div class="stat-label">Avg Marks</div>
            </div>
        </div>
        
        <h4 style="margin:20px 0 10px 0">Weekly Breakdown</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Week</th>
                        <th>Study Time</th>
                        <th>Sessions</th>
                        <th>Tasks</th>
                    </tr>
                </thead>
                <tbody>
                    ${Array.from({length: 4}, (_, i) => {
                        const weekStart = new Date(thisMonth.firstDay);
                        weekStart.setDate(weekStart.getDate() + i * 7);
                        const weekEnd = new Date(weekStart);
                        weekEnd.setDate(weekEnd.getDate() + 6);
                        
                        const weekSessions = monthSessions.filter(s => s.startTime >= weekStart.toISOString().split('T')[0] && s.startTime <= weekEnd.toISOString().split('T')[0]);
                        const weekTime = weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
                        const weekTasks = completedTasks.filter(t => t.completedAt >= weekStart.toISOString().split('T')[0] && t.completedAt <= weekEnd.toISOString().split('T')[0]);
                        
                        return `
                            <tr>
                                <td>Week ${i+1}</td>
                                <td>${formatDuration(weekTime)}</td>
                                <td>${weekSessions.length}</td>
                                <td>${weekTasks.length}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        
        <h4 style="margin:20px 0 10px 0">Marks This Month</h4>
        ${monthMarks.length > 0 ? `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Paper</th>
                            <th>Marks</th>
                            <th>Percentage</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${monthMarks.map(m => {
                            const percentage = Math.round(m.marks / m.maxMarks * 100);
                            return `
                                <tr>
                                    <td>${m.paper}</td>
                                    <td>${m.marks}/${m.maxMarks}</td>
                                    <td>${percentage}%</td>
                                    <td>${formatDate(m.date)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        ` : '<div class="empty-state"><div class="empty-state-text">No marks recorded this month</div></div>'}
        
        <h4 style="margin:20px 0 10px 0">Recommendations</h4>
        <div style="padding:15px;background:var(--bg-tertiary);border-radius:var(--radius-md)">
            ${totalTime < 7200 ? '<p>💡 <strong>Tip:</strong> You studied less than 2 hours this month. Consider setting a daily study goal.</p>' : ''}
            ${avgPercentage < 70 ? '<p>💡 <strong>Tip:</strong> Your average marks are below 70%. Focus on understanding concepts rather than memorization.</p>' : ''}
            ${completedTasks.length < 10 ? '<p>💡 <strong>Tip:</strong> You completed less than 10 tasks this month. Break down larger tasks into smaller, manageable ones.</p>' : ''}
            ${totalTime >= 7200 && avgPercentage >= 70 && completedTasks.length >= 20 ? '<p>🎉 <strong>Excellent!</strong> You had a very productive month. Keep maintaining this pace!</p>' : ''}
        </div>
    `;
    
    currentReport = { type: 'monthlyProgress', html };
    document.getElementById('reportModalTitle').textContent = 'Monthly Progress Report';
    document.getElementById('reportModalBody').innerHTML = html;
    document.getElementById('reportModal').classList.add('active');
}

async function generateSubjectReport() {
    const subjects = await dbGetAll('subjects');
    const tasks = await dbGetAll('tasks');
    const timerSessions = await dbGetAll('timerSessions');
    const marks = await dbGetAll('marks');
    
    const subjectReports = subjects.map(subject => {
        const subjectTasks = tasks.filter(t => t.subjectId === subject.id);
        const completedTasks = subjectTasks.filter(t => t.status === 'completed');
        const subjectSessions = timerSessions.filter(s => s.subjectId === subject.id);
        const studyTime = subjectSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        const subjectMarks = marks.filter(m => m.subjectId === subject.id);
        const avgMarks = subjectMarks.length > 0 ? (subjectMarks.reduce((sum, m) => sum + (m.marks || 0), 0) / subjectMarks.length) : 0;
        const maxMarks = subjectMarks.length > 0 ? Math.max(...subjectMarks.map(m => m.maxMarks || 0)) : 100;
        const avgPercentage = subjectMarks.length > 0 ? (avgMarks / maxMarks * 100) : 0;
        
        return { subject, taskCount: subjectTasks.length, completedCount: completedTasks.length, studyTime, avgPercentage, marks: subjectMarks };
    });
    
    const html = `
        <div style="margin-bottom:20px">
            <h3 style="margin:0">Subject Performance Report</h3>
            <div style="color:var(--text-muted);font-size:14px">${subjects.length} subjects</div>
        </div>
        
        <h4 style="margin:20px 0 10px 0">Overall Performance</h4>
        <div class="stats-grid mb-lg">
            <div class="stat-item">
                <div class="stat-value">${subjects.length}</div>
                <div class="stat-label">Total Subjects</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${tasks.length}</div>
                <div class="stat-label">Total Tasks</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${formatDuration(timerSessions.reduce((sum, s) => sum + (s.duration || 0), 0))}</div>
                <div class="stat-label">Total Study Time</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${marks.length}</div>
                <div class="stat-label">Total Papers</div>
            </div>
        </div>
        
        <h4 style="margin:20px 0 10px 0">Subject-wise Breakdown</h4>
        <div class="d-flex gap-md flex-wrap">
            ${subjectReports.map(report => {
                const percentage = report.taskCount > 0 ? (report.completedCount / report.taskCount * 100) : 0;
                return `
                    <div class="card" style="min-width:250px">
                        <div class="card-header">
                            <h4 class="card-title" style="font-size:14px">${report.subject.name}</h4>
                        </div>
                        <div style="margin-bottom:10px">
                            <div style="font-size:12px;color:var(--text-muted);margin-bottom:5px">Completion Rate</div>
                            <div class="progress-bar">
                                <div class="progress-fill ${percentage >= 80 ? 'success' : percentage >= 50 ? 'warning' : 'danger'}" 
                                     style="width:${percentage}%"></div>
                            </div>
                            <div style="font-size:12px;color:var(--text-muted);margin-top:5px">
                                ${report.completedCount}/${report.taskCount} tasks
                            </div>
                        </div>
                        <div style="margin-bottom:10px">
                            <div style="font-size:12px;color:var(--text-muted);margin-bottom:5px">Study Time</div>
                            <div style="font-weight:600">${formatDuration(report.studyTime)}</div>
                        </div>
                        <div>
                            <div style="font-size:12px;color:var(--text-muted);margin-bottom:5px">Avg Marks</div>
                            <div style="font-weight:600;color:${report.avgPercentage >= 80 ? 'var(--success)' : report.avgPercentage >= 50 ? 'var(--warning)' : 'var(--danger)'}">
                                ${Math.round(report.avgPercentage)}%
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        
        <h4 style="margin:20px 0 10px 0">Detailed Marks</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Paper</th>
                        <th>Marks</th>
                        <th>Percentage</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${marks.slice(0, 20).map(m => {
                        const subject = subjects.find(s => s.id === m.subjectId);
                        const percentage = Math.round(m.marks / m.maxMarks * 100);
                        return `
                            <tr>
                                <td>${subject ? subject.name : 'No Subject'}</td>
                                <td>${m.paper}</td>
                                <td>${m.marks}/${m.maxMarks}</td>
                                <td>${percentage}%</td>
                                <td>${formatDate(m.date)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        
        <h4 style="margin:20px 0 10px 0">Recommendations</h4>
        <div style="padding:15px;background:var(--bg-tertiary);border-radius:var(--radius-md)">
            ${subjectReports.some(r => r.avgPercentage < 60) ? '<p>💡 <strong>Tip:</strong> Some subjects have average marks below 60%. Focus on improving these subjects.</p>' : ''}
            ${subjectReports.some(r => r.studyTime < 3600) ? '<p>💡 <strong>Tip:</strong> Some subjects have less than 1 hour of study time. Allocate more time to weaker subjects.</p>' : ''}
            ${subjectReports.every(r => r.avgPercentage >= 80) ? '<p>🎉 <strong>Great job!</strong> All your subjects have excellent marks. Keep it up!</p>' : ''}
        </div>
    `;
    
    currentReport = { type: 'subject', html };
    document.getElementById('reportModalTitle').textContent = 'Subject Performance Report';
    document.getElementById('reportModalBody').innerHTML = html;
    document.getElementById('reportModal').classList.add('active');
}

async function generateExamPerformanceReport() {
    const marks = await dbGetAll('marks');
    const subjects = await dbGetAll('subjects');
    
    const sortedMarks = [...marks].sort((a, b) => b.marks / b.maxMarks - a.marks / a.maxMarks);
    const bestMarks = sortedMarks.slice(0, 5);
    const worstMarks = sortedMarks.slice(-5).reverse();
    
    const avgMarks = marks.length > 0 ? (marks.reduce((sum, m) => sum + (m.marks || 0), 0) / marks.length) : 0;
    const maxMarks = marks.length > 0 ? Math.max(...marks.map(m => m.maxMarks || 0)) : 100;
    const avgPercentage = marks.length > 0 ? (avgMarks / maxMarks * 100) : 0;
    
    const html = `
        <div style="margin-bottom:20px">
            <h3 style="margin:0">Exam Performance Report</h3>
            <div style="color:var(--text-muted);font-size:14px">${marks.length} papers</div>
        </div>
        
        <div class="stats-grid mb-lg">
            <div class="stat-item">
                <div class="stat-value">${Math.round(avgPercentage)}%</div>
                <div class="stat-label">Overall Average</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${bestMarks.length}</div>
                <div class="stat-label">Top 5 Papers</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${marks.filter(m => m.marks / m.maxMarks >= 0.8).length}</div>
                <div class="stat-label">A Grades (80%+)</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${marks.filter(m => m.marks / m.maxMarks >= 0.5).length}</div>
                <div class="stat-label">Passed (50%+)</div>
            </div>
        </div>
        
        <h4 style="margin:20px 0 10px 0">Best Performances</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Paper</th>
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Percentage</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${bestMarks.map((m, i) => {
                        const subject = subjects.find(s => s.id === m.subjectId);
                        const percentage = Math.round(m.marks / m.maxMarks * 100);
                        return `
                            <tr>
                                <td>${i+1}</td>
                                <td>${m.paper}</td>
                                <td>${subject ? subject.name : 'No Subject'}</td>
                                <td>${m.marks}/${m.maxMarks}</td>
                                <td><span class="badge badge-success">${percentage}%</span></td>
                                <td>${formatDate(m.date)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        
        <h4 style="margin:20px 0 10px 0">Areas for Improvement</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Paper</th>
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Percentage</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${worstMarks.map((m, i) => {
                        const subject = subjects.find(s => s.id === m.subjectId);
                        const percentage = Math.round(m.marks / m.maxMarks * 100);
                        return `
                            <tr>
                                <td>${i+1}</td>
                                <td>${m.paper}</td>
                                <td>${subject ? subject.name : 'No Subject'}</td>
                                <td>${m.marks}/${m.maxMarks}</td>
                                <td><span class="badge badge-${percentage >= 50 ? 'warning' : 'danger'}">${percentage}%</span></td>
                                <td>${formatDate(m.date)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        
        <h4 style="margin:20px 0 10px 0">Subject-wise Performance</h4>
        <div class="d-flex gap-md flex-wrap">
            ${subjects.map(subject => {
                const subjectMarks = marks.filter(m => m.subjectId === subject.id);
                if (subjectMarks.length === 0) return '';
                const avg = subjectMarks.reduce((sum, m) => sum + (m.marks || 0), 0) / subjectMarks.length;
                const max = Math.max(...subjectMarks.map(m => m.maxMarks || 0));
                const percentage = (avg / max * 100);
                return `
                    <div class="card" style="min-width:200px">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
                            <span style="font-size:20px">${subject.icon || '📚'}</span>
                            <div>
                                <div style="font-weight:600">${subject.name}</div>
                                <div style="font-size:12px;color:var(--text-muted)">${subject.code || ''}</div>
                            </div>
                        </div>
                        <div style="text-align:center">
                            <div style="font-size:24px;font-weight:700;color:${percentage >= 80 ? 'var(--success)' : percentage >= 50 ? 'var(--warning)' : 'var(--danger)'}">
                                ${Math.round(percentage)}%
                            </div>
                            <div style="font-size:12px;color:var(--text-muted)">${subjectMarks.length} papers</div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        
        <h4 style="margin:20px 0 10px 0">Recommendations</h4>
        <div style="padding:15px;background:var(--bg-tertiary);border-radius:var(--radius-md)">
            ${avgPercentage >= 80 ? '<p>🎉 <strong>Excellent!</strong> Your overall average is above 80%. Keep up the great work!</p>' : ''}
            ${avgPercentage >= 60 && avgPercentage < 80 ? '<p>💡 <strong>Tip:</strong> Your average is good but there\'s room for improvement. Focus on subjects with lower marks.</p>' : ''}
            ${avgPercentage < 60 ? '<p>💡 <strong>Tip:</strong> Your overall average is below 60%. Consider getting extra help or changing your study methods.</p>' : ''}
            ${bestMarks.length > 0 ? `<p>🎯 <strong>Top Subject:</strong> ${subjects.find(s => s.id === bestMarks[0].subjectId)?.name || 'Unknown'} - Keep excelling in this subject!</p>` : ''}
        </div>
    `;
    
    currentReport = { type: 'examPerformance', html };
    document.getElementById('reportModalTitle').textContent = 'Exam Performance Report';
    document.getElementById('reportModalBody').innerHTML = html;
    document.getElementById('reportModal').classList.add('active');
}

async function generateStudyPlanReport() {
    const tasks = await dbGetAll('tasks');
    const timerSessions = await dbGetAll('timerSessions');
    const subjects = await dbGetAll('subjects');
    
    const today = getToday();
    const overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'completed');
    const dueToday = tasks.filter(t => t.dueDate === today && t.status !== 'completed');
    const upcomingTasks = tasks.filter(t => t.dueDate && t.dueDate > today && t.status !== 'completed');
    const completedTasks = tasks.filter(t => t.status === 'completed');
    
    const totalStudyTime = timerSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const plannedStudyTime = tasks.reduce((sum, t) => sum + (t.estimatedDuration || 0), 0) * 60;
    
    const html = `
        <div style="margin-bottom:20px">
            <h3 style="margin:0">Study Plan Report</h3>
            <div style="color:var(--text-muted);font-size:14px">${tasks.length} tasks</div>
        </div>
        
        <div class="stats-grid mb-lg">
            <div class="stat-item">
                <div class="stat-value">${tasks.length}</div>
                <div class="stat-label">Total Tasks</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${completedTasks.length}</div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${overdueTasks.length}</div>
                <div class="stat-label">Overdue</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${formatDuration(totalStudyTime)}</div>
                <div class="stat-label">Actual Study Time</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${formatDuration(plannedStudyTime)}</div>
                <div class="stat-label">Planned Study Time</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${Math.round((totalStudyTime / plannedStudyTime * 100) || 0)}%</div>
                <div class="stat-label">Plan Completion</div>
            </div>
        </div>
        
        <h4 style="margin:20px 0 10px 0">Task Status</h4>
        <div class="d-flex gap-md flex-wrap">
            <div class="card" style="min-width:200px">
                <div style="text-align:center">
                    <div style="font-size:32px">📋</div>
                    <div style="font-weight:600">Total Tasks</div>
                    <div style="font-size:24px;font-weight:700">${tasks.length}</div>
                </div>
            </div>
            <div class="card" style="min-width:200px">
                <div style="text-align:center">
                    <div style="font-size:32px">✅</div>
                    <div style="font-weight:600">Completed</div>
                    <div style="font-size:24px;font-weight:700;color:var(--success)">${completedTasks.length}</div>
                </div>
            </div>
            <div class="card" style="min-width:200px">
                <div style="text-align:center">
                    <div style="font-size:32px">⏰</div>
                    <div style="font-weight:600">Overdue</div>
                    <div style="font-size:24px;font-weight:700;color:var(--danger)">${overdueTasks.length}</div>
                </div>
            </div>
            <div class="card" style="min-width:200px">
                <div style="text-align:center">
                    <div style="font-size:32px">📅</div>
                    <div style="font-weight:600">Due Today</div>
                    <div style="font-size:24px;font-weight:700;color:var(--warning)">${dueToday.length}</div>
                </div>
            </div>
            <div class="card" style="min-width:200px">
                <div style="text-align:center">
                    <div style="font-size:32px">🔮</div>
                    <div style="font-weight:600">Upcoming</div>
                    <div style="font-size:24px;font-weight:700;color:var(--info)">${upcomingTasks.length}</div>
                </div>
            </div>
        </div>
        
        <h4 style="margin:20px 0 10px 0">Subject-wise Task Distribution</h4>
        <div class="d-flex gap-md flex-wrap">
            ${subjects.map(subject => {
                const subjectTasks = tasks.filter(t => t.subjectId === subject.id);
                const completed = subjectTasks.filter(t => t.status === 'completed');
                const overdue = subjectTasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'completed');
                return `
                    <div class="card" style="min-width:250px">
                        <div class="card-header">
                            <h4 class="card-title" style="font-size:14px">${subject.name}</h4>
                        </div>
                        <div style="margin-bottom:10px">
                            <div style="font-size:12px;color:var(--text-muted);margin-bottom:5px">Total Tasks</div>
                            <div style="font-weight:600">${subjectTasks.length}</div>
                        </div>
                        <div style="margin-bottom:10px">
                            <div style="font-size:12px;color:var(--text-muted);margin-bottom:5px">Completed</div>
                            <div style="font-weight:600;color:var(--success)">${completed.length}</div>
                        </div>
                        <div>
                            <div style="font-size:12px;color:var(--text-muted);margin-bottom:5px">Overdue</div>
                            <div style="font-weight:600;color:var(--danger)">${overdue.length}</div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        
        <h4 style="margin:20px 0 10px 0">Overdue Tasks</h4>
        ${overdueTasks.length > 0 ? `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Subject</th>
                            <th>Due Date</th>
                            <th>Days Overdue</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${overdueTasks.map(t => {
                            const subject = subjects.find(s => s.id === t.subjectId);
                            const daysOverdue = Math.floor((new Date(today) - new Date(t.dueDate)) / (1000 * 60 * 60 * 24));
                            return `
                                <tr>
                                    <td>${t.title}</td>
                                    <td>${subject ? subject.name : 'No Subject'}</td>
                                    <td>${formatDate(t.dueDate)}</td>
                                    <td><span class="badge badge-danger">${daysOverdue} days</span></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        ` : '<div class="empty-state"><div class="empty-state-text">No overdue tasks</div></div>'}
        
        <h4 style="margin:20px 0 10px 0">Recommendations</h4>
        <div style="padding:15px;background:var(--bg-tertiary);border-radius:var(--radius-md)">
            ${overdueTasks.length > 0 ? `<p>💡 <strong>Tip:</strong> You have ${overdueTasks.length} overdue tasks. Prioritize completing these first.</p>` : ''}
            ${totalStudyTime / plannedStudyTime < 0.5 ? '<p>💡 <strong>Tip:</strong> You\'ve completed less than 50% of your planned study time. Try to stick to your schedule.</p>' : ''}
            ${totalStudyTime / plannedStudyTime >= 1 ? '<p>🎉 <strong>Great job!</strong> You\'ve exceeded your planned study time. Keep up the good work!</p>' : ''}
            ${dueToday.length > 0 ? `<p>💡 <strong>Tip:</strong> You have ${dueToday.length} tasks due today. Focus on completing them first.</p>` : ''}
        </div>
    `;
    
    currentReport = { type: 'studyPlan', html };
    document.getElementById('reportModalTitle').textContent = 'Study Plan Report';
    document.getElementById('reportModalBody').innerHTML = html;
    document.getElementById('reportModal').classList.add('active');
}

function exportReport() {
    if (!currentReport) {
        showToast('No report to export', 'warning');
        return;
    }
    
    // Simple export - copy to clipboard
    showToast('Report export functionality will be added soon. For now, use the print function or copy the content manually.', 'info');
}

async function exportAllData() {
    const data = {
        tasks: await dbGetAll('tasks'),
        subjects: await dbGetAll('subjects'),
        marks: await dbGetAll('marks'),
        timerSessions: await dbGetAll('timerSessions'),
        reviews: await dbGetAll('reviews'),
        goals: await dbGetAll('goals'),
        settings: await dbGetAll('settings'),
        notifications: await dbGetAll('notifications')
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-room-backup-${getToday()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('All data exported successfully', 'success');
}

async function exportTasksCSV() {
    const tasks = await dbGetAll('tasks');
    const subjects = await dbGetAll('subjects');
    
    let csv = 'ID,Title,Description,Subject,Priority,Due Date,Status,Created At,Completed At,Estimated Duration (min),Tags\n';
    
    tasks.forEach(t => {
        const subject = subjects.find(s => s.id === t.subjectId);
        const subjectName = subject ? `${subject.name} (${subject.code})` : '';
        csv += `"${t.id}","${t.title}","${t.description || ''}","${subjectName}","${t.priority || ''}","${t.dueDate || ''}","${t.status}","${t.createdAt}","${t.completedAt || ''}","${t.estimatedDuration || ''}","${t.tags ? t.tags.join(',') : ''}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${getToday()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Tasks exported to CSV', 'success');
}

async function exportMarksCSV() {
    const marks = await dbGetAll('marks');
    const subjects = await dbGetAll('subjects');
    
    let csv = 'ID,Paper,Subject,Marks,Max Marks,Percentage,Date,Notes,Grade\n';
    
    marks.forEach(m => {
        const subject = subjects.find(s => s.id === m.subjectId);
        const subjectName = subject ? `${subject.name} (${subject.code})` : '';
        const percentage = m.maxMarks > 0 ? (m.marks / m.maxMarks * 100) : 0;
        const grade = calculateGrade(percentage);
        csv += `"${m.id}","${m.paper}","${subjectName}","${m.marks}","${m.maxMarks}","${percentage.toFixed(2)}","${m.date}","${m.notes || ''}","${grade}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marks-${getToday()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Marks exported to CSV', 'success');
}

async function exportTimerSessionsCSV() {
    const sessions = await dbGetAll('timerSessions');
    const tasks = await dbGetAll('tasks');
    const subjects = await dbGetAll('subjects');
    
    let csv = 'ID,Task,Subject,Start Time,End Time,Duration (seconds),Type\n';
    
    sessions.forEach(s => {
        const task = tasks.find(t => t.id === s.taskId);
        const subject = subjects.find(su => su.id === s.subjectId);
        const taskName = task ? task.title : '';
        const subjectName = subject ? subject.name : '';
        csv += `"${s.id}","${taskName}","${subjectName}","${s.startTime}","${s.endTime || ''}","${s.duration}","${s.type || 'Pomodoro'}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timer-sessions-${getToday()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Timer sessions exported to CSV', 'success');
}

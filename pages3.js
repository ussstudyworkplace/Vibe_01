// ===== SUBJECTS =====
async function renderSubjects() {
    const subjects = await dbGetAll('subjects');
    AppState.subjectsCache = subjects;
    
    return `
        <div class="page-subjects">
            <div class="section-header mb-md">
                <h2 class="section-title">Subjects</h2>
                <button class="btn btn-primary btn-sm" onclick="showSubjectModal()">+ Add Subject</button>
            </div>
            
            <!-- Stats -->
            <div class="stats-grid mb-lg">
                <div class="stat-item">
                    <div class="stat-value">${subjects.length}</div>
                    <div class="stat-label">Total Subjects</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${subjects.filter(s => s.notes).length}</div>
                    <div class="stat-label">With Notes</div>
                </div>
            </div>
            
            <!-- Subject List -->
            <div class="d-flex gap-md flex-wrap">
                ${subjects.length > 0 ? subjects.map(s => renderSubjectCard(s)).join('') : '
                    <div class="empty-state w-100">
                        <div class="empty-state-icon">📚</div>
                        <div class="empty-state-title">No subjects yet</div>
                        <div class="empty-state-text">Add your subjects to track study time and marks</div>
                        <button class="btn btn-primary mt-md" onclick="showSubjectModal()">Add Subject</button>
                    </div>
                '}
            </div>
            
            <!-- Subject Detail Modal -->
            <div class="modal-overlay" id="subjectDetailModal">
                <div class="modal" style="max-width:600px">
                    <div class="modal-header">
                        <div class="modal-title" id="subjectModalTitle">Subject Details</div>
                        <button class="modal-close" onclick="closeSubjectModal()">&times;</button>
                    </div>
                    <div class="modal-body" id="subjectModalBody"></div>
                    <div class="modal-footer" id="subjectModalFooter"></div>
                </div>
            </div>
            
            <!-- Add/Edit Subject Modal -->
            <div class="modal-overlay" id="subjectFormModal">
                <div class="modal" style="max-width:600px">
                    <div class="modal-header">
                        <div class="modal-title" id="subjectFormTitle">Add Subject</div>
                        <button class="modal-close" onclick="closeSubjectFormModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="subjectForm" onsubmit="saveSubject(event)">
                            <input type="hidden" id="subjectId">
                            <div class="form-group">
                                <label class="form-label">Subject Name *</label>
                                <input type="text" class="form-input" id="subjectName" required placeholder="e.g., Mathematics">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Subject Code</label>
                                <input type="text" class="form-input" id="subjectCode" placeholder="e.g., MATH101">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Color</label>
                                <div class="d-flex gap-sm flex-wrap">
                                    <label class="color-option" style="cursor:pointer">
                                        <input type="radio" name="subjectColor" value="#8b5cf6" checked>
                                        <span style="display:inline-block;width:30px;height:30px;background:#8b5cf6;border-radius:50%;border:2px solid var(--border-color)"></span>
                                    </label>
                                    <label class="color-option" style="cursor:pointer">
                                        <input type="radio" name="subjectColor" value="#ef4444">
                                        <span style="display:inline-block;width:30px;height:30px;background:#ef4444;border-radius:50%;border:2px solid var(--border-color)"></span>
                                    </label>
                                    <label class="color-option" style="cursor:pointer">
                                        <input type="radio" name="subjectColor" value="#22c55e">
                                        <span style="display:inline-block;width:30px;height:30px;background:#22c55e;border-radius:50%;border:2px solid var(--border-color)"></span>
                                    </label>
                                    <label class="color-option" style="cursor:pointer">
                                        <input type="radio" name="subjectColor" value="#3b82f6">
                                        <span style="display:inline-block;width:30px;height:30px;background:#3b82f6;border-radius:50%;border:2px solid var(--border-color)"></span>
                                    </label>
                                    <label class="color-option" style="cursor:pointer">
                                        <input type="radio" name="subjectColor" value="#f97316">
                                        <span style="display:inline-block;width:30px;height:30px;background:#f97316;border-radius:50%;border:2px solid var(--border-color)"></span>
                                    </label>
                                    <label class="color-option" style="cursor:pointer">
                                        <input type="radio" name="subjectColor" value="#f59e0b">
                                        <span style="display:inline-block;width:30px;height:30px;background:#f59e0b;border-radius:50%;border:2px solid var(--border-color)"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Icon</label>
                                <select class="form-select" id="subjectIcon">
                                    <option value="📚">📚 Book</option>
                                    <option value="🧮">🧮 Math</option>
                                    <option value="🔬">🔬 Science</option>
                                    <option value="🌍">🌍 Geography</option>
                                    <option value="📖">📖 Literature</option>
                                    <option value="💻">💻 Computer</option>
                                    <option value="🎨">🎨 Art</option>
                                    <option value="🎵">🎵 Music</option>
                                    <option value="🏃">🏃 PE</option>
                                    <option value="⚖️">⚖️ History</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Notes</label>
                                <textarea class="form-textarea" id="subjectNotes" placeholder="Additional notes about this subject..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeSubjectFormModal()">Cancel</button>
                        <button type="button" class="btn btn-danger" onclick="deleteSubject()" id="deleteSubjectBtn" style="display:none">Delete</button>
                        <button type="button" class="btn btn-primary" onclick="saveSubject()">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initSubjects() {
    // Event listeners
    ['subjectDetailModal', 'subjectFormModal'].forEach(id => {
        document.getElementById(id).addEventListener('click', e => {
            if (e.target === e.currentTarget) {
                if (id === 'subjectDetailModal') closeSubjectModal();
                else closeSubjectFormModal();
            }
        });
    });
}

function renderSubjectCard(subject) {
    return `
        <div class="card" style="width:200px;cursor:pointer" onclick="loadSubjectDetails(${subject.id})">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
                <span style="font-size:24px">${subject.icon || '📚'}</span>
                <div>
                    <div style="font-weight:600">${subject.name}</div>
                    <div style="font-size:12px;color:var(--text-muted)">${subject.code || ''}</div>
                </div>
            </div>
            <div style="height:4px;background:${subject.color || '#8b5cf6'};border-radius:2px;margin-bottom:10px"></div>
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px">
                ${subject.notes ? subject.notes.substring(0, 50) + '...' : 'No notes'}
            </div>
            <div style="display:flex;gap:5px">
                <button class="btn btn-sm btn-outline" onclick="showSubjectModal(${subject.id});event.stopPropagation()">Edit</button>
            </div>
        </div>
    `;
}

function showSubjectModal(subjectId) {
    if (subjectId) {
        loadSubjectDetails(subjectId);
    } else {
        document.getElementById('subjectFormTitle').textContent = 'Add Subject';
        document.getElementById('subjectId').value = '';
        document.getElementById('subjectName').value = '';
        document.getElementById('subjectCode').value = '';
        document.getElementById('subjectIcon').value = '📚';
        document.getElementById('subjectNotes').value = '';
        document.querySelector('input[name="subjectColor"][value="#8b5cf6"]').checked = true;
        document.getElementById('deleteSubjectBtn').style.display = 'none';
    }
    document.getElementById('subjectFormModal').classList.add('active');
}

function closeSubjectModal() {
    document.getElementById('subjectDetailModal').classList.remove('active');
}

function closeSubjectFormModal() {
    document.getElementById('subjectFormModal').classList.remove('active');
}

async function loadSubjectDetails(subjectId) {
    const subject = await dbGet('subjects', subjectId);
    if (!subject) return;
    
    // Load related data
    const tasks = await dbGetAll('tasks');
    const subjectTasks = tasks.filter(t => t.subjectId === subjectId);
    const completedTasks = subjectTasks.filter(t => t.status === 'completed');
    
    const marks = await dbGetAll('marks');
    const subjectMarks = marks.filter(m => m.subjectId === subjectId);
    const avgMarks = subjectMarks.length > 0 ? (subjectMarks.reduce((sum, m) => sum + (m.marks || 0), 0) / subjectMarks.length) : 0;
    const maxMarks = subjectMarks.length > 0 ? Math.max(...subjectMarks.map(m => m.maxMarks || 0)) : 100;
    const avgPercentage = subjectMarks.length > 0 ? (avgMarks / maxMarks * 100) : 0;
    
    const timerSessions = await dbGetAll('timerSessions');
    const subjectSessions = timerSessions.filter(s => s.subjectId === subjectId);
    const totalStudyTime = subjectSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    
    document.getElementById('subjectModalTitle').textContent = subject.name;
    document.getElementById('subjectModalBody').innerHTML = `
        <div style="display:flex;align-items:center;gap:15px;margin-bottom:20px">
            <span style="font-size:48px">${subject.icon || '📚'}</span>
            <div>
                <h3 style="margin:0">${subject.name}</h3>
                <div style="color:var(--text-muted)">${subject.code || 'No code'}</div>
            </div>
        </div>
        <div style="height:4px;background:${subject.color || '#8b5cf6'};border-radius:2px;margin-bottom:20px"></div>
        
        <div class="stats-grid mb-lg">
            <div class="stat-item">
                <div class="stat-value">${subjectTasks.length}</div>
                <div class="stat-label">Total Tasks</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${completedTasks.length}</div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${formatDuration(totalStudyTime)}</div>
                <div class="stat-label">Study Time</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${Math.round(avgPercentage)}%</div>
                <div class="stat-label">Avg Marks</div>
            </div>
        </div>
        
        <div class="form-group">
            <label class="form-label">Notes</label>
            <div style="padding:10px;background:var(--bg-tertiary);border-radius:var(--radius-md);min-height:50px">
                ${subject.notes || '<em>No notes</em>'}
            </div>
        </div>
        
        ${subjectTasks.length > 0 ? `
            <div class="mt-lg">
                <h4 style="margin-bottom:10px">Recent Tasks</h4>
                ${subjectTasks.slice(0, 5).map(t => `
                    <div class="card mb-sm" style="padding:10px">
                        <div style="display:flex;justify-content:space-between">
                            <div>
                                <div style="font-weight:600">${t.title}</div>
                                <div style="font-size:12px;color:var(--text-muted)">${t.dueDate ? formatDate(t.dueDate) : 'No due date'}</div>
                            </div>
                            <div>
                                <span class="badge badge-${t.status === 'completed' ? 'success' : 'warning'}">${t.status === 'completed' ? 'Done' : 'Pending'}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : ''}
        
        ${subjectMarks.length > 0 ? `
            <div class="mt-lg">
                <h4 style="margin-bottom:10px">Marks</h4>
                ${subjectMarks.slice(0, 5).map(m => `
                    <div class="card mb-sm" style="padding:10px">
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
                    </div>
                `).join('')}
            </div>
        ` : ''}
    `;
    
    document.getElementById('subjectModalFooter').innerHTML = `
        <button class="btn btn-secondary" onclick="closeSubjectModal()">Close</button>
        <button class="btn btn-primary" onclick="showSubjectModal(${subject.id})">Edit</button>
        <button class="btn btn-danger" onclick="showConfirm('Delete Subject','Are you sure you want to delete this subject? All related tasks and marks will remain.',()=>deleteSubject(${subject.id}))">Delete</button>
    `;
    
    document.getElementById('subjectDetailModal').classList.add('active');
}

async function saveSubject() {
    const id = document.getElementById('subjectId').value;
    const name = document.getElementById('subjectName').value.trim();
    const code = document.getElementById('subjectCode').value.trim();
    const icon = document.getElementById('subjectIcon').value;
    const notes = document.getElementById('subjectNotes').value.trim();
    const color = document.querySelector('input[name="subjectColor"]:checked')?.value || '#8b5cf6';
    
    if (!name) {
        showToast('Please enter a subject name', 'danger');
        return;
    }
    
    const subject = {
        id: id || generateId(),
        name,
        code: code || null,
        icon,
        color,
        notes: notes || null,
        createdAt: new Date().toISOString()
    };
    
    try {
        await dbPut('subjects', subject);
        showToast('Subject saved successfully', 'success');
        closeSubjectFormModal();
        
        if (AppState.currentPage === 'subjects') {
            loadPage('subjects');
        }
        
        // Refresh cache
        AppState.subjectsCache = await dbGetAll('subjects');
        
    } catch (error) {
        showToast('Error saving subject: ' + error.message, 'danger');
    }
}

async function deleteSubject(subjectId) {
    if (!subjectId) return;
    
    try {
        await dbDelete('subjects', subjectId);
        showToast('Subject deleted successfully', 'success');
        closeSubjectModal();
        closeSubjectFormModal();
        
        if (AppState.currentPage === 'subjects') {
            loadPage('subjects');
        }
        
        // Refresh cache
        AppState.subjectsCache = await dbGetAll('subjects');
        
    } catch (error) {
        showToast('Error deleting subject: ' + error.message, 'danger');
    }
}

// ===== MARKS TRACKER =====
async function renderMarks() {
    const marks = await dbGetAll('marks');
    const subjects = await dbGetAll('subjects');
    AppState.subjectsCache = subjects;
    
    const today = getToday();
    const thisMonth = getCurrentMonth();
    const recentMarks = marks.filter(m => m.date >= thisMonth.firstDay).slice(0, 10);
    
    // Calculate statistics
    const avgMarks = marks.length > 0 ? (marks.reduce((sum, m) => sum + (m.marks || 0), 0) / marks.length) : 0;
    const maxMarks = marks.length > 0 ? Math.max(...marks.map(m => m.maxMarks || 0)) : 100;
    const avgPercentage = marks.length > 0 ? (avgMarks / maxMarks * 100) : 0;
    
    // Group by subject
    const marksBySubject = {};
    marks.forEach(m => {
        const subjectId = m.subjectId || 'none';
        if (!marksBySubject[subjectId]) marksBySubject[subjectId] = [];
        marksBySubject[subjectId].push(m);
    });
    
    return `
        <div class="page-marks">
            <div class="section-header mb-md">
                <h2 class="section-title">Marks Tracker</h2>
                <button class="btn btn-primary btn-sm" onclick="showMarkModal()">+ Add Marks</button>
            </div>
            
            <!-- Stats -->
            <div class="stats-grid mb-lg">
                <div class="stat-item">
                    <div class="stat-value">${marks.length}</div>
                    <div class="stat-label">Total Papers</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.round(avgPercentage)}%</div>
                    <div class="stat-label">Average Score</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${recentMarks.length}</div>
                    <div class="stat-label">This Month</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Object.keys(marksBySubject).length}</div>
                    <div class="stat-label">Subjects</div>
                </div>
            </div>
            
            <!-- Subject-wise Performance -->
            <section class="section">
                <div class="section-header">
                    <h3 class="section-title">Subject-wise Performance</h3>
                </div>
                <div class="d-flex gap-md flex-wrap">
                    ${Object.entries(marksBySubject).map(([subjectId, subjectMarks]) => {
                        const subject = subjects.find(s => s.id === subjectId);
                        const subjectName = subject?.name || 'No Subject';
                        const subjectCode = subject?.code || '';
                        const subjectColor = subject?.color || '#8b5cf6';
                        const avg = subjectMarks.reduce((sum, m) => sum + (m.marks || 0), 0) / subjectMarks.length;
                        const max = Math.max(...subjectMarks.map(m => m.maxMarks || 0));
                        const percentage = (avg / max * 100);
                        
                        return `
                            <div class="card" style="min-width:200px">
                                <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
                                    <span style="font-size:20px">${subject?.icon || '📚'}</span>
                                    <div>
                                        <div style="font-weight:600">${subjectName}</div>
                                        <div style="font-size:12px;color:var(--text-muted)">${subjectCode}</div>
                                    </div>
                                </div>
                                <div style="text-align:center;margin:10px 0">
                                    <div style="font-size:24px;font-weight:700;color:${percentage >= 80 ? 'var(--success)' : percentage >= 50 ? 'var(--warning)' : 'var(--danger)'}">
                                        ${Math.round(percentage)}%
                                    </div>
                                    <div style="font-size:12px;color:var(--text-muted)">${subjectMarks.length} papers</div>
                                </div>
                                <div style="height:4px;background:${subjectColor};border-radius:2px"></div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </section>
            
            <!-- Recent Marks -->
            <section class="section">
                <div class="section-header">
                    <h3 class="section-title">Recent Marks</h3>
                </div>
                ${recentMarks.length > 0 ? `
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Paper</th>
                                    <th>Subject</th>
                                    <th>Marks</th>
                                    <th>Percentage</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${recentMarks.map(m => {
                                    const subject = subjects.find(s => s.id === m.subjectId);
                                    const percentage = Math.round(m.marks / m.maxMarks * 100);
                                    const percentageColor = percentage >= 80 ? 'success' : percentage >= 50 ? 'warning' : 'danger';
                                    return `
                                        <tr>
                                            <td>${m.paper}</td>
                                            <td>${subject ? subject.name : 'No Subject'}</td>
                                            <td>${m.marks}/${m.maxMarks}</td>
                                            <td><span class="badge badge-${percentageColor}">${percentage}%</span></td>
                                            <td>${formatDate(m.date)}</td>
                                            <td>
                                                <button class="btn btn-sm btn-ghost" onclick="showMarkModal(${m.id})">Edit</button>
                                                <button class="btn btn-sm btn-ghost" onclick="showConfirm('Delete Marks','Are you sure?',()=>deleteMark(${m.id}))">Delete</button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : '<div class="empty-state"><div class="empty-state-text">No marks recorded yet</div></div>'}
            </section>
            
            <!-- All Marks -->
            <section class="section">
                <div class="section-header">
                    <h3 class="section-title">All Marks</h3>
                    <button class="btn btn-sm btn-outline" onclick="exportMarksCSV()">Export CSV</button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Paper</th>
                                <th>Subject</th>
                                <th>Marks</th>
                                <th>Max Marks</th>
                                <th>Percentage</th>
                                <th>Grade</th>
                                <th>Date</th>
                                <th>Notes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="marksTableBody">
                            ${marks.slice(0, 50).map(m => {
                                const subject = subjects.find(s => s.id === m.subjectId);
                                const percentage = Math.round(m.marks / m.maxMarks * 100);
                                const percentageColor = percentage >= 80 ? 'success' : percentage >= 50 ? 'warning' : 'danger';
                                const grade = calculateGrade(percentage, m.gradingRule || AppState.settings.gradingRule);
                                return `
                                    <tr>
                                        <td>${m.paper}</td>
                                        <td>${subject ? subject.name : 'No Subject'}</td>
                                        <td>${m.marks}</td>
                                        <td>${m.maxMarks}</td>
                                        <td><span class="badge badge-${percentageColor}">${percentage}%</span></td>
                                        <td>${grade}</td>
                                        <td>${formatDate(m.date)}</td>
                                        <td>${m.notes || '-'}</td>
                                        <td>
                                            <button class="btn btn-sm btn-ghost" onclick="showMarkModal(${m.id})">Edit</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                ${marks.length > 50 ? `<div class="mt-md text-center"><button class="btn btn-sm btn-outline" onclick="loadAllMarks()">Load All (${marks.length})</button></div>` : ''}
            </section>
            
            <!-- Add/Edit Mark Modal -->
            <div class="modal-overlay" id="markFormModal">
                <div class="modal" style="max-width:600px">
                    <div class="modal-header">
                        <div class="modal-title" id="markFormTitle">Add Marks</div>
                        <button class="modal-close" onclick="closeMarkFormModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="markForm" onsubmit="saveMark(event)">
                            <input type="hidden" id="markId">
                            <div class="form-group">
                                <label class="form-label">Paper Name *</label>
                                <input type="text" class="form-input" id="markPaper" required placeholder="e.g., Mid-term Exam">
                            </div>
                            <div class="d-flex gap-md flex-wrap">
                                <div class="form-group flex-1" style="min-width:150px">
                                    <label class="form-label">Subject</label>
                                    <select class="form-select" id="markSubjectId">
                                        <option value="">No Subject</option>
                                        ${subjects.map(s => `<option value="${s.id}">${s.name} (${s.code})</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group flex-1" style="min-width:150px">
                                    <label class="form-label">Date</label>
                                    <input type="date" class="form-input" id="markDate" value="${getToday()}">
                                </div>
                            </div>
                            <div class="d-flex gap-md flex-wrap">
                                <div class="form-group flex-1" style="min-width:150px">
                                    <label class="form-label">Marks Obtained *</label>
                                    <input type="number" class="form-input" id="markMarks" required min="0" step="0.01" placeholder="0">
                                </div>
                                <div class="form-group flex-1" style="min-width:150px">
                                    <label class="form-label">Max Marks *</label>
                                    <input type="number" class="form-input" id="markMaxMarks" required min="0.01" step="0.01" value="100">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Notes</label>
                                <textarea class="form-textarea" id="markNotes" placeholder="Additional notes..."></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Grading Rule</label>
                                <select class="form-select" id="markGradingRule">
                                    <option value="">Default</option>
                                    <option value="A">A (90-100%)</option>
                                    <option value="B">B (80-89%)</option>
                                    <option value="C">C (70-79%)</option>
                                    <option value="D">D (60-69%)</option>
                                    <option value="E">E (50-59%)</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>
                            <div class="form-group" id="manualGradeGroup" style="display:none">
                                <label class="form-label">Manual Grade Override</label>
                                <input type="text" class="form-input" id="markManualGrade" placeholder="e.g., A+">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeMarkFormModal()">Cancel</button>
                        <button type="button" class="btn btn-danger" onclick="deleteMark()" id="deleteMarkBtn" style="display:none">Delete</button>
                        <button type="button" class="btn btn-primary" onclick="saveMark()">Save</button>
                    </div>
                </div>
            </div>
            
            <!-- Mark Detail Modal -->
            <div class="modal-overlay" id="markDetailModal">
                <div class="modal" style="max-width:600px">
                    <div class="modal-header">
                        <div class="modal-title" id="markDetailTitle">Mark Details</div>
                        <button class="modal-close" onclick="closeMarkDetailModal()">&times;</button>
                    </div>
                    <div class="modal-body" id="markDetailBody"></div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="closeMarkDetailModal()">Close</button>
                        <button class="btn btn-primary" onclick="showMarkModal()">Add New</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initMarks() {
    // Event listeners
    ['markFormModal', 'markDetailModal'].forEach(id => {
        document.getElementById(id).addEventListener('click', e => {
            if (e.target === e.currentTarget) {
                if (id === 'markFormModal') closeMarkFormModal();
                else closeMarkDetailModal();
            }
        });
    });
    
    // Grading rule change
    document.getElementById('markGradingRule').addEventListener('change', function() {
        const manualGradeGroup = document.getElementById('manualGradeGroup');
        manualGradeGroup.style.display = this.value === 'custom' ? 'block' : 'none';
    });
}

function showMarkModal(markId) {
    if (markId) {
        loadMarkDetails(markId);
    } else {
        document.getElementById('markFormTitle').textContent = 'Add Marks';
        document.getElementById('markId').value = '';
        document.getElementById('markPaper').value = '';
        document.getElementById('markSubjectId').value = '';
        document.getElementById('markDate').value = getToday();
        document.getElementById('markMarks').value = '';
        document.getElementById('markMaxMarks').value = '100';
        document.getElementById('markNotes').value = '';
        document.getElementById('markGradingRule').value = '';
        document.getElementById('markManualGrade').value = '';
        document.getElementById('manualGradeGroup').style.display = 'none';
        document.getElementById('deleteMarkBtn').style.display = 'none';
    }
    document.getElementById('markFormModal').classList.add('active');
}

function closeMarkFormModal() {
    document.getElementById('markFormModal').classList.remove('active');
}

function closeMarkDetailModal() {
    document.getElementById('markDetailModal').classList.remove('active');
}

async function loadMarkDetails(markId) {
    const mark = await dbGet('marks', markId);
    if (!mark) return;
    
    const subject = AppState.subjectsCache?.find(s => s.id === mark.subjectId);
    const percentage = Math.round(mark.marks / mark.maxMarks * 100);
    const grade = calculateGrade(percentage, mark.gradingRule || AppState.settings.gradingRule);
    
    document.getElementById('markDetailTitle').textContent = mark.paper;
    document.getElementById('markDetailBody').innerHTML = `
        <div class="d-flex gap-md flex-wrap mb-lg">
            <div class="card flex-1" style="min-width:150px">
                <div class="card-title" style="font-size:14px">Marks</div>
                <div style="text-align:center;margin:10px 0">
                    <div style="font-size:24px;font-weight:700">${mark.marks}/${mark.maxMarks}</div>
                </div>
            </div>
            <div class="card flex-1" style="min-width:150px">
                <div class="card-title" style="font-size:14px">Percentage</div>
                <div style="text-align:center;margin:10px 0">
                    <div style="font-size:24px;font-weight:700;color:${percentage >= 80 ? 'var(--success)' : percentage >= 50 ? 'var(--warning)' : 'var(--danger)'}">${percentage}%</div>
                </div>
            </div>
            <div class="card flex-1" style="min-width:150px">
                <div class="card-title" style="font-size:14px">Grade</div>
                <div style="text-align:center;margin:10px 0">
                    <div style="font-size:24px;font-weight:700">${grade || mark.manualGrade || 'N/A'}</div>
                </div>
            </div>
        </div>
        
        <div class="form-group">
            <label class="form-label">Subject</label>
            <div>${subject ? `${subject.name} (${subject.code})` : 'No subject'}</div>
        </div>
        <div class="form-group">
            <label class="form-label">Date</label>
            <div>${formatDate(mark.date)}</div>
        </div>
        <div class="form-group">
            <label class="form-label">Notes</label>
            <div style="padding:10px;background:var(--bg-tertiary);border-radius:var(--radius-md)">${mark.notes || 'No notes'}</div>
        </div>
        ${mark.manualGrade ? `
            <div class="form-group">
                <label class="form-label">Manual Grade</label>
                <div>${mark.manualGrade}</div>
            </div>
        ` : ''}
    `;
    
    document.getElementById('markDetailModal').classList.add('active');
}

async function saveMark() {
    const id = document.getElementById('markId').value;
    const paper = document.getElementById('markPaper').value.trim();
    const subjectId = document.getElementById('markSubjectId').value;
    const date = document.getElementById('markDate').value;
    const marks = parseFloat(document.getElementById('markMarks').value);
    const maxMarks = parseFloat(document.getElementById('markMaxMarks').value);
    const notes = document.getElementById('markNotes').value.trim();
    const gradingRule = document.getElementById('markGradingRule').value;
    const manualGrade = document.getElementById('markManualGrade').value.trim();
    
    if (!paper) {
        showToast('Please enter a paper name', 'danger');
        return;
    }
    if (isNaN(marks) || isNaN(maxMarks) || marks < 0 || maxMarks <= 0) {
        showToast('Please enter valid marks', 'danger');
        return;
    }
    if (marks > maxMarks) {
        showToast('Marks cannot exceed max marks', 'danger');
        return;
    }
    
    const mark = {
        id: id || generateId(),
        paper,
        subjectId: subjectId || null,
        date: date || getToday(),
        marks,
        maxMarks,
        notes: notes || null,
        gradingRule: gradingRule || null,
        manualGrade: manualGrade || null,
        createdAt: new Date().toISOString()
    };
    
    try {
        await dbPut('marks', mark);
        showToast('Marks saved successfully', 'success');
        closeMarkFormModal();
        
        if (AppState.currentPage === 'marks') {
            loadPage('marks');
        }
        
    } catch (error) {
        showToast('Error saving marks: ' + error.message, 'danger');
    }
}

async function deleteMark(markId) {
    if (!markId) return;
    
    try {
        await dbDelete('marks', markId);
        showToast('Marks deleted successfully', 'success');
        closeMarkFormModal();
        closeMarkDetailModal();
        
        if (AppState.currentPage === 'marks') {
            loadPage('marks');
        }
        
    } catch (error) {
        showToast('Error deleting marks: ' + error.message, 'danger');
    }
}

function calculateGrade(percentage, rule) {
    if (!rule) rule = 'default';
    
    const gradingRules = {
        'A': percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : percentage >= 50 ? 'E' : 'F',
        'B': percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F',
        'C': percentage >= 70 ? 'A' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : 'F',
        'default': percentage >= 90 ? 'A+' : percentage >= 85 ? 'A' : percentage >= 80 ? 'A-' : 
                  percentage >= 75 ? 'B+' : percentage >= 70 ? 'B' : percentage >= 65 ? 'B-' : 
                  percentage >= 60 ? 'C+' : percentage >= 55 ? 'C' : percentage >= 50 ? 'C-' : 
                  percentage >= 45 ? 'D' : 'F'
    };
    
    return gradingRules[rule] || gradingRules['default'];
}

async function loadAllMarks() {
    const marks = await dbGetAll('marks');
    const subjects = await dbGetAll('subjects');
    
    const html = marks.map(m => {
        const subject = subjects.find(s => s.id === m.subjectId);
        const percentage = Math.round(m.marks / m.maxMarks * 100);
        const percentageColor = percentage >= 80 ? 'success' : percentage >= 50 ? 'warning' : 'danger';
        const grade = calculateGrade(percentage, m.gradingRule || AppState.settings.gradingRule);
        return `
            <tr>
                <td>${m.paper}</td>
                <td>${subject ? subject.name : 'No Subject'}</td>
                <td>${m.marks}</td>
                <td>${m.maxMarks}</td>
                <td><span class="badge badge-${percentageColor}">${percentage}%</span></td>
                <td>${grade}</td>
                <td>${formatDate(m.date)}</td>
                <td>${m.notes || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-ghost" onclick="showMarkModal(${m.id})">Edit</button>
                </td>
            </tr>
        `;
    }).join('');
    
    document.getElementById('marksTableBody').innerHTML = html;
}

function exportMarksCSV() {
    showToast('CSV export functionality will be added soon', 'info');
}

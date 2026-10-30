// ===== SETTINGS =====
async function renderSettings() {
    const settings = await dbGetAll('settings');
    const settingValues = {};
    settings.forEach(s => settingValues[s.key] = s.value);
    
    return `
        <div class="page-settings">
            <div class="section-header mb-md">
                <h2 class="section-title">Settings</h2>
            </div>
            
            <!-- Profile Settings -->
            <section class="section">
                <h3 class="section-title mb-md">Profile Settings</h3>
                <div class="card">
                    <div class="form-group">
                        <label class="form-label">Your Name</label>
                        <input type="text" class="form-input" id="settingName" 
                               placeholder="Your Name" value="${settingValues.name || ''}" 
                               onchange="saveSetting('name', this.value)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email (Optional)</label>
                        <input type="email" class="form-input" id="settingEmail" 
                               placeholder="your@email.com" value="${settingValues.email || ''}" 
                               onchange="saveSetting('email', this.value)">
                    </div>
                </div>
            </section>
            
            <!-- Appearance -->
            <section class="section">
                <h3 class="section-title mb-md">Appearance</h3>
                <div class="card">
                    <div class="form-group">
                        <label class="form-label">Theme</label>
                        <select class="form-select" id="settingTheme" 
                                onchange="saveSetting('theme', this.value);applyTheme();">
                            <option value="dark" ${AppState.theme === 'dark' ? 'selected' : ''}>Dark</option>
                            <option value="light" ${AppState.theme === 'light' ? 'selected' : ''}>Light</option>
                            <option value="system" ${AppState.theme === 'system' ? 'selected' : ''}>System</option>
                        </select>
                    </div>
                </div>
            </section>
            
            <!-- Pomodoro Timer Settings -->
            <section class="section">
                <h3 class="section-title mb-md">Pomodoro Timer Settings</h3>
                <div class="card">
                    <div class="form-group">
                        <label class="form-label">Pomodoro Duration (minutes)</label>
                        <input type="number" class="form-input" id="settingPomodoroDuration" 
                               value="${settingValues.pomodoroDuration || AppState.pomodoroDuration / 60}" 
                               min="1" max="120" 
                               onchange="saveSetting('pomodoroDuration', parseInt(this.value) * 60);AppState.pomodoroDuration = parseInt(this.value) * 60">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Short Break Duration (minutes)</label>
                        <input type="number" class="form-input" id="settingShortBreakDuration" 
                               value="${settingValues.shortBreakDuration || AppState.shortBreakDuration / 60}" 
                               min="1" max="60" 
                               onchange="saveSetting('shortBreakDuration', parseInt(this.value) * 60);AppState.shortBreakDuration = parseInt(this.value) * 60">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Long Break Duration (minutes)</label>
                        <input type="number" class="form-input" id="settingLongBreakDuration" 
                               value="${settingValues.longBreakDuration || AppState.longBreakDuration / 60}" 
                               min="1" max="120" 
                               onchange="saveSetting('longBreakDuration', parseInt(this.value) * 60);AppState.longBreakDuration = parseInt(this.value) * 60">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Pomodoros Before Long Break</label>
                        <input type="number" class="form-input" id="settingPomodorosBeforeLongBreak" 
                               value="${settingValues.pomodorosBeforeLongBreak || AppState.pomodorosBeforeLongBreak}" 
                               min="1" max="10" 
                               onchange="saveSetting('pomodorosBeforeLongBreak', parseInt(this.value));AppState.pomodorosBeforeLongBreak = parseInt(this.value)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Auto-start Breaks</label>
                        <div class="form-switch">
                            <input type="checkbox" class="form-switch-input" id="settingAutoStartBreaks" 
                                   ${settingValues.autoStartBreaks ? 'checked' : ''} 
                                   onchange="saveSetting('autoStartBreaks', this.checked)">
                            <span class="form-switch-slider"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Show Timer in Title Bar</label>
                        <div class="form-switch">
                            <input type="checkbox" class="form-switch-input" id="settingShowTimerInTitle" 
                                   ${settingValues.showTimerInTitle ? 'checked' : ''} 
                                   onchange="saveSetting('showTimerInTitle', this.checked)">
                            <span class="form-switch-slider"></span>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Sound Settings -->
            <section class="section">
                <h3 class="section-title mb-md">Sound Settings</h3>
                <div class="card">
                    <div class="form-group">
                        <label class="form-label">Enable Timer Sounds</label>
                        <div class="form-switch">
                            <input type="checkbox" class="form-switch-input" id="settingTimerSound" 
                                   ${settingValues.timerSound ? 'checked' : ''} 
                                   onchange="saveSetting('timerSound', this.checked)">
                            <span class="form-switch-slider"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Timer Sound Volume</label>
                        <input type="range" class="form-input" id="settingTimerVolume" 
                               min="0" max="100" value="${settingValues.timerVolume || 50}" 
                               onchange="saveSetting('timerVolume', parseInt(this.value))">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Notification Sounds</label>
                        <div class="form-switch">
                            <input type="checkbox" class="form-switch-input" id="settingNotificationSound" 
                                   ${settingValues.notificationSound ? 'checked' : ''} 
                                   onchange="saveSetting('notificationSound', this.checked)">
                            <span class="form-switch-slider"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-outline" onclick="playTestSound()">Test Sound</button>
                    </div>
                </div>
            </section>
            
            <!-- Feature Controls -->
            <section class="section">
                <h3 class="section-title mb-md">Feature Controls</h3>
                <div class="card">
                    <div class="form-group">
                        <label class="form-label">Enable Forgetting Curve Reviews</label>
                        <div class="form-switch">
                            <input type="checkbox" class="form-switch-input" id="settingForgettingCurve" 
                                   ${settingValues.forgettingCurve !== false ? 'checked' : ''} 
                                   onchange="saveSetting('forgettingCurve', this.checked)">
                            <span class="form-switch-slider"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Enable Analytics</label>
                        <div class="form-switch">
                            <input type="checkbox" class="form-switch-input" id="settingAnalytics" 
                                   ${settingValues.analytics !== false ? 'checked' : ''} 
                                   onchange="saveSetting('analytics', this.checked)">
                            <span class="form-switch-slider"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Enable Goals & Streaks</label>
                        <div class="form-switch">
                            <input type="checkbox" class="form-switch-input" id="settingGoals" 
                                   ${settingValues.goals !== false ? 'checked' : ''} 
                                   onchange="saveSetting('goals', this.checked)">
                            <span class="form-switch-slider"></span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Enable Calendar Sync</label>
                        <div class="form-switch">
                            <input type="checkbox" class="form-switch-input" id="settingCalendarSync" 
                                   ${settingValues.calendarSync ? 'checked' : ''} 
                                   onchange="saveSetting('calendarSync', this.checked)">
                            <span class="form-switch-slider"></span>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Grading Rules -->
            <section class="section">
                <h3 class="section-title mb-md">Grading Rules</h3>
                <div class="card">
                    <div class="form-group">
                        <label class="form-label">Default Grading Scale</label>
                        <select class="form-select" id="settingGradingRule" 
                                onchange="saveSetting('gradingRule', this.value)">
                            <option value="A" ${settingValues.gradingRule === 'A' ? 'selected' : ''}>A (90-100% = A)</option>
                            <option value="B" ${settingValues.gradingRule === 'B' ? 'selected' : ''}>B (80-89% = A)</option>
                            <option value="C" ${settingValues.gradingRule === 'C' ? 'selected' : ''}>C (70-79% = A)</option>
                            <option value="default" ${(!settingValues.gradingRule || settingValues.gradingRule === 'default') ? 'selected' : ''}>Default (A+, A, A-, B+, etc.)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Study Day Cutoff Time</label>
                        <input type="time" class="form-input" id="settingStudyDayCutoff" 
                               value="${settingValues.studyDayCutoff || '23:59'}" 
                               onchange="saveSetting('studyDayCutoff', this.value)">
                    </div>
                </div>
            </section>
            
            <!-- Data Management -->
            <section class="section">
                <h3 class="section-title mb-md">Data Management</h3>
                <div class="card">
                    <div class="form-group">
                        <label class="form-label">Backup & Restore</label>
                        <div class="d-flex gap-sm flex-wrap">
                            <button class="btn btn-outline" onclick="exportAllData()">Export All Data (JSON)</button>
                            <button class="btn btn-outline" onclick="showImportModal()">Import Data (JSON)</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">CSV Export</label>
                        <div class="d-flex gap-sm flex-wrap">
                            <button class="btn btn-outline" onclick="exportTasksCSV()">Export Tasks</button>
                            <button class="btn btn-outline" onclick="exportMarksCSV()">Export Marks</button>
                            <button class="btn btn-outline" onclick="exportTimerSessionsCSV()">Export Timer Sessions</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Clear Data</label>
                        <div class="d-flex gap-sm flex-wrap">
                            <button class="btn btn-danger" onclick="showConfirm('Clear All Data','Are you sure you want to clear ALL data? This cannot be undone. Make sure to backup first.',clearAllData)">
                                Clear All Data
                            </button>
                        </div>
                        <div style="font-size:12px;color:var(--text-muted);margin-top:5px">
                            This will delete all tasks, subjects, marks, timer sessions, reviews, goals, and settings.
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- About -->
            <section class="section">
                <h3 class="section-title mb-md">About Study Room</h3>
                <div class="card">
                    <div style="text-align:center;margin-bottom:20px">
                        <div style="font-size:48px">📚</div>
                        <h3 style="margin:10px 0">Study Room</h3>
                        <div style="color:var(--text-muted)">Student Productivity App</div>
                    </div>
                    <div style="padding:15px;background:var(--bg-tertiary);border-radius:var(--radius-md)">
                        <p style="margin-bottom:10px"><strong>Version:</strong> 1.0.0</p>
                        <p style="margin-bottom:10px"><strong>Features:</strong> Tasks, Timer, Calendar, Subjects, Marks, Reviews, Analytics, Reports, Goals, Streaks, Notifications</p>
                        <p style="margin-bottom:10px"><strong>Storage:</strong> IndexedDB with localStorage fallback</p>
                        <p style="margin-bottom:10px"><strong>Privacy:</strong> All data is stored locally on your device. No data is sent to any server.</p>
                    </div>
                </div>
            </section>
            
            <!-- Import Modal -->
            <div class="modal-overlay" id="importModal">
                <div class="modal" style="max-width:600px">
                    <div class="modal-header">
                        <div class="modal-title">Import Data</div>
                        <button class="modal-close" onclick="closeImportModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">JSON Data</label>
                            <textarea class="form-textarea" id="importData" placeholder="Paste your JSON data here..."></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Import Options</label>
                            <div class="d-flex gap-sm">
                                <label class="form-check">
                                    <input type="radio" name="importMode" value="replace" checked>
                                    <span class="form-check-label">Replace All Data</span>
                                </label>
                                <label class="form-check">
                                    <input type="radio" name="importMode" value="merge">
                                    <span class="form-check-label">Merge with Existing</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="closeImportModal()">Cancel</button>
                        <button class="btn btn-primary" onclick="importData()">Import</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initSettings() {
    // Event listeners
    document.getElementById('importModal').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeImportModal();
    });
    
    // Load current settings
    document.getElementById('settingTheme').value = AppState.theme;
}

function showImportModal() {
    document.getElementById('importData').value = '';
    document.getElementById('importModal').classList.add('active');
}

function closeImportModal() {
    document.getElementById('importModal').classList.remove('active');
}

async function importData() {
    const json = document.getElementById('importData').value.trim();
    const mode = document.querySelector('input[name="importMode"]:checked')?.value || 'replace';
    
    if (!json) {
        showToast('Please paste JSON data to import', 'danger');
        return;
    }
    
    try {
        const data = JSON.parse(json);
        
        if (mode === 'replace') {
            // Clear all data first
            const stores = ['tasks', 'subjects', 'marks', 'timerSessions', 'reviews', 'goals', 'settings', 'notifications'];
            for (const store of stores) {
                await dbClear(store);
            }
        }
        
        // Import data
        if (data.tasks) {
            for (const task of data.tasks) {
                await dbPut('tasks', task);
            }
        }
        if (data.subjects) {
            for (const subject of data.subjects) {
                await dbPut('subjects', subject);
            }
        }
        if (data.marks) {
            for (const mark of data.marks) {
                await dbPut('marks', mark);
            }
        }
        if (data.timerSessions) {
            for (const session of data.timerSessions) {
                await dbPut('timerSessions', session);
            }
        }
        if (data.reviews) {
            for (const review of data.reviews) {
                await dbPut('reviews', review);
            }
        }
        if (data.goals) {
            for (const goal of data.goals) {
                await dbPut('goals', goal);
            }
        }
        if (data.settings) {
            for (const setting of data.settings) {
                await dbPut('settings', setting);
            }
        }
        if (data.notifications) {
            for (const notification of data.notifications) {
                await dbPut('notifications', notification);
            }
        }
        
        showToast(`Data imported successfully (${mode} mode)`, 'success');
        closeImportModal();
        
        // Reload settings
        await loadSettings();
        applyTheme();
        
        // Refresh current page
        loadPage(AppState.currentPage);
        
    } catch (error) {
        showToast('Error importing data: ' + error.message, 'danger');
    }
}

async function clearAllData() {
    showConfirm('Clear All Data', 'Are you absolutely sure? This will delete ALL your data including tasks, subjects, marks, timer sessions, reviews, goals, and settings. This cannot be undone.', async () => {
        try {
            const stores = ['tasks', 'subjects', 'marks', 'timerSessions', 'reviews', 'goals', 'settings', 'notifications'];
            for (const store of stores) {
                await dbClear(store);
            }
            showToast('All data cleared successfully', 'success');
            
            // Reset app state
            AppState.settings = {};
            AppState.subjectsCache = null;
            
            // Reload the app
            navigateTo('dashboard');
            
        } catch (error) {
            showToast('Error clearing data: ' + error.message, 'danger');
        }
    });
}

function playTestSound() {
    playNotificationSound();
    showToast('Test sound played', 'info');
}

// ===== MAIN INDEX FILE UPDATE =====
// This function should be called from index.html to load all the page scripts
function loadAllPageScripts() {
    // Load all page-related scripts
    const scripts = [
        'pages.js',
        'pages2.js',
        'pages3.js',
        'pages4.js',
        'pages5.js',
        'pages6.js',
        'pages7.js'
    ];
    
    scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        document.body.appendChild(script);
    });
}

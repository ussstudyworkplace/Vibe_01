/**
 * Video Downloader Web App
 * Main JavaScript Logic
 */

// ===== DOM Elements =====
const themeToggle = document.querySelector('.theme-toggle');
const videoUrlInput = document.getElementById('videoUrl');
const downloadBtn = document.getElementById('downloadBtn');
const errorMsg = document.getElementById('errorMsg');
const downloadModal = document.getElementById('downloadModal');
const closeModal = document.querySelector('.close-modal');
const startDownloadBtn = document.getElementById('startDownload');
const modalThumbnail = document.getElementById('modalThumbnail');
const modalTitle = document.getElementById('modalTitle');
const modalDuration = document.getElementById('modalDuration');
const modalViews = document.getElementById('modalViews');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const resultsSection = document.getElementById('resultsSection');
const downloadsGrid = document.getElementById('downloadsGrid');

// ===== State =====
let currentVideoData = null;
let selectedFormat = { format: 'mp4', quality: '1080p' };
let downloadHistory = JSON.parse(localStorage.getItem('downloadHistory')) || [];

// ===== Platform Configurations =====
const platformConfigs = {
    youtube: {
        name: 'YouTube',
        urlPatterns: [
            /^https?:\/\/(www\.)?youtube\.com\/watch\?v=([^&\s]+)/,
            /^https?:\/\/(www\.)?youtu\.be\/([^\?\s]+)/,
            /^https?:\/\/(www\.)?youtube\.com\/shorts\/([^\?\s]+)/
        ],
        icon: 'fab fa-youtube',
        color: '#ff0000'
    },
    facebook: {
        name: 'Facebook',
        urlPatterns: [
            /^https?:\/\/(www\.)?facebook\.com\/.*\/videos\/([^\/\s]+)/,
            /^https?:\/\/(www\.)?fb\.watch\/([^\/\s]+)/
        ],
        icon: 'fab fa-facebook',
        color: '#1877f2'
    },
    instagram: {
        name: 'Instagram',
        urlPatterns: [
            /^https?:\/\/(www\.)?instagram\.com\/reel\/([^\/\s]+)/,
            /^https?:\/\/(www\.)?instagram\.com\/p\/([^\/\s]+)/,
            /^https?:\/\/(www\.)?instagram\.com\/tv\/([^\/\s]+)/
        ],
        icon: 'fab fa-instagram',
        color: '#e4405f'
    },
    tiktok: {
        name: 'TikTok',
        urlPatterns: [
            /^https?:\/\/(www\.)?tiktok\.com\/(@[^\/\s]+\/video\/)?([^\?\s]+)/,
            /^https?:\/\/vm\.tiktok\.com\/([^\/\s]+)/
        ],
        icon: 'fab fa-tiktok',
        color: '#000000'
    },
    twitter: {
        name: 'Twitter',
        urlPatterns: [
            /^https?:\/\/(www\.)?twitter\.com\/.*\/status\/([^\/\s]+)/,
            /^https?:\/\/(www\.)?x\.com\/.*\/status\/([^\/\s]+)/
        ],
        icon: 'fab fa-twitter',
        color: '#1da1f2'
    }
};

// ===== Format Configurations =====
const formatConfigs = {
    mp4: {
        name: 'MP4',
        mime: 'video/mp4',
        qualities: ['480p', '720p', '1080p', '4K']
    },
    webm: {
        name: 'WebM',
        mime: 'video/webm',
        qualities: ['480p', '720p', '1080p']
    },
    audio: {
        name: 'Audio Only',
        mime: 'audio/mp3',
        qualities: ['128kbps', '256kbps', '320kbps']
    }
};

// ===== Theme Management =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
    showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode enabled`);
}

function updateThemeIcon() {
    const theme = document.documentElement.getAttribute('data-theme');
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// ===== URL Validation =====
function validateUrl(url) {
    if (!url || !url.trim()) {
        return { valid: false, message: 'Please enter a URL' };
    }

    // Check if it's a valid URL format
    try {
        new URL(url);
    } catch (e) {
        return { valid: false, message: 'Invalid URL format' };
    }

    // Check against known platforms
    for (const [platform, config] of Object.entries(platformConfigs)) {
        for (const pattern of config.urlPatterns) {
            if (pattern.test(url)) {
                return { 
                    valid: true, 
                    platform: platform,
                    message: `Detected ${config.name} URL` 
                };
            }
        }
    }

    // Generic video URL check
    const videoExtensions = ['\.mp4', '\.webm', '\.mov', '\.avi', '\.mkv'];
    for (const ext of videoExtensions) {
        if (new RegExp(ext + '$', 'i').test(url)) {
            return { valid: true, platform: 'direct', message: 'Direct video URL' };
        }
    }

    return { valid: false, message: 'Unsupported platform or URL' };
}

// ===== Extract Video ID =====
function extractVideoId(url, platform) {
    if (!platformConfigs[platform]) return null;

    for (const pattern of platformConfigs[platform].urlPatterns) {
        const match = url.match(pattern);
        if (match) {
            // Return the first capture group that has a value
            for (let i = 1; i < match.length; i++) {
                if (match[i]) return match[i];
            }
            return null;
        }
    }
    return null;
}

// ===== Simulate Video Data Fetch (In a real app, this would call an API) =====
async function fetchVideoData(url, platform) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const videoId = extractVideoId(url, platform);
    
    // Mock data based on platform
    const mockData = {
        youtube: {
            id: videoId,
            title: `Sample YouTube Video - ${videoId.substring(0, 8)}`,
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            duration: getRandomDuration(),
            views: Math.floor(Math.random() * 1000000) + 1000,
            formats: {
                mp4: ['480p', '720p', '1080p', '4K'],
                webm: ['480p', '720p', '1080p'],
                audio: ['128kbps', '256kbps']
            }
        },
        facebook: {
            id: videoId,
            title: `Facebook Video - ${videoId.substring(0, 8)}`,
            thumbnail: `https://via.placeholder.com/480x360/1877f2/ffffff?text=FB+Video`,
            duration: getRandomDuration(),
            views: Math.floor(Math.random() * 50000) + 1000,
            formats: {
                mp4: ['480p', '720p', '1080p'],
                audio: ['128kbps']
            }
        },
        instagram: {
            id: videoId,
            title: `Instagram Reel - ${videoId.substring(0, 8)}`,
            thumbnail: `https://via.placeholder.com/480x844/e4405f/ffffff?text=IG+Reel`,
            duration: getRandomDuration(),
            views: Math.floor(Math.random() * 100000) + 1000,
            formats: {
                mp4: ['480p', '720p', '1080p'],
                audio: ['128kbps']
            }
        },
        tiktok: {
            id: videoId,
            title: `TikTok Video - ${videoId.substring(0, 8)}`,
            thumbnail: `https://via.placeholder.com/480x844/000000/ffffff?text=TikTok`,
            duration: getRandomDuration(),
            views: Math.floor(Math.random() * 1000000) + 1000,
            formats: {
                mp4: ['480p', '720p'],
                audio: ['128kbps']
            }
        },
        direct: {
            id: videoId,
            title: `Direct Video - ${url.split('/').pop().split('?')[0]}`,
            thumbnail: `https://via.placeholder.com/480x360/6c5ce7/ffffff?text=Direct`,
            duration: getRandomDuration(),
            views: 0,
            formats: {
                mp4: ['Original'],
                audio: ['Original']
            }
        }
    };

    return mockData[platform] || mockData.direct;
}

function getRandomDuration() {
    const minutes = Math.floor(Math.random() * 30) + 1;
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ===== Format Seconds to MM:SS =====
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ===== Format Views =====
function formatViews(views) {
    if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
}

// ===== Show Modal =====
function showModal(videoData) {
    currentVideoData = videoData;
    
    // Update modal content
    modalThumbnail.src = videoData.thumbnail || 'https://via.placeholder.com/480x360/6c5ce7/ffffff?text=Video';
    modalTitle.textContent = videoData.title || 'Unknown Video';
    modalDuration.textContent = `Duration: ${videoData.duration || '--:--'}`;
    modalViews.textContent = `Views: ${formatViews(videoData.views || 0)}`;

    // Update format buttons based on available formats
    updateFormatButtons(videoData.formats);

    // Show modal
    downloadModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== Update Format Buttons =====
function updateFormatButtons(availableFormats) {
    const formatButtons = document.querySelectorAll('.format-btn');
    
    formatButtons.forEach(btn => {
        const format = btn.dataset.format;
        const quality = btn.dataset.quality;
        
        // Check if this format/quality is available
        if (availableFormats && availableFormats[format] && availableFormats[format].includes(quality)) {
            btn.style.display = 'flex';
        } else {
            btn.style.display = 'none';
        }
    });
}

// ===== Hide Modal =====
function hideModal() {
    downloadModal.classList.remove('active');
    document.body.style.overflow = '';
    progressContainer.style.display = 'none';
    progressFill.style.width = '0%';
    progressText.textContent = 'Preparing download...';
}

// ===== Select Format =====
function selectFormat(format, quality) {
    selectedFormat = { format, quality };
    
    // Update active button
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`.format-btn[data-format="${format}"][data-quality="${quality}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// ===== Simulate Download (In a real app, this would trigger actual download) =====
async function simulateDownload() {
    if (!currentVideoData) return;

    // Show progress
    progressContainer.style.display = 'block';
    startDownloadBtn.disabled = true;
    startDownloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    // Simulate progress
    let progress = 0;
    const progressSteps = [
        { text: 'Preparing download...', value: 0 },
        { text: 'Connecting to server...', value: 10 },
        { text: 'Fetching video info...', value: 30 },
        { text: 'Processing video...', value: 50 },
        { text: 'Converting format...', value: 70 },
        { text: 'Almost done...', value: 90 },
        { text: 'Finalizing...', value: 95 }
    ];

    for (const step of progressSteps) {
        progressText.textContent = step.text;
        progressFill.style.width = `${step.value}%`;
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Complete download
    progressFill.style.width = '100%';
    progressText.textContent = 'Download complete!';

    // Simulate saving to history
    const downloadItem = {
        id: Date.now().toString(),
        title: currentVideoData.title,
        thumbnail: currentVideoData.thumbnail,
        format: selectedFormat.format,
        quality: selectedFormat.quality,
        duration: currentVideoData.duration,
        timestamp: new Date().toISOString()
    };

    downloadHistory.unshift(downloadItem);
    if (downloadHistory.length > 10) {
        downloadHistory = downloadHistory.slice(0, 10);
    }
    localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));

    // Show success message
    showToast(`Download started! Format: ${selectedFormat.quality} ${formatConfigs[selectedFormat.format]?.name || selectedFormat.format.toUpperCase()}`);

    // Update results section
    updateResultsSection();

    // Reset
    setTimeout(() => {
        startDownloadBtn.disabled = false;
        startDownloadBtn.innerHTML = '<i class="fas fa-download"></i> Start Download';
        hideModal();
    }, 1000);
}

// ===== Update Results Section =====
function updateResultsSection() {
    if (downloadHistory.length === 0) {
        resultsSection.style.display = 'none';
        return;
    }

    resultsSection.style.display = 'block';
    
    // Clear existing items
    downloadsGrid.innerHTML = '';

    // Add each download
    downloadHistory.forEach(download => {
        const downloadCard = document.createElement('div');
        downloadCard.className = 'download-card';
        downloadCard.innerHTML = `
            <div class="download-thumbnail">
                <img src="${download.thumbnail || 'https://via.placeholder.com/480x360/6c5ce7/ffffff?text=Video'}" alt="${download.title}">
            </div>
            <div class="download-info">
                <h4>${download.title}</h4>
                <p>Format: ${download.quality} ${formatConfigs[download.format]?.name || download.format.toUpperCase()}</p>
                <p>Duration: ${download.duration}</p>
                <p>${new Date(download.timestamp).toLocaleDateString()}</p>
            </div>
            <div class="download-actions">
                <button class="play-btn" onclick="playVideo('${download.id}')">
                    <i class="fas fa-play"></i> Play
                </button>
                <button class="delete-btn" onclick="deleteDownload('${download.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        downloadsGrid.appendChild(downloadCard);
    });
}

// ===== Play Video (Placeholder) =====
function playVideo(id) {
    const download = downloadHistory.find(d => d.id === id);
    if (download) {
        showToast(`Playing: ${download.title}`);
        // In a real app, this would open a video player
    }
}

// ===== Delete Download =====
function deleteDownload(id) {
    downloadHistory = downloadHistory.filter(d => d.id !== id);
    localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
    updateResultsSection();
    showToast('Download removed from history');
}

// ===== Show Toast Notification =====
function showToast(message, isError = false) {
    toastMessage.textContent = message;
    toast.className = `toast ${isError ? 'error' : ''}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== Platform Button Click =====
function handlePlatformBtnClick(platform) {
    // Pre-fill with platform URL
    const platformUrls = {
        youtube: 'https://www.youtube.com/watch?v=',
        facebook: 'https://www.facebook.com/watch/?v=',
        instagram: 'https://www.instagram.com/reel/'
    };
    
    videoUrlInput.value = platformUrls[platform] || '';
    videoUrlInput.focus();
    showToast(`Paste your ${platformConfigs[platform]?.name || platform} URL`);
}

// ===== FAQ Toggle =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ===== Smooth Scroll for Navigation =====
function initSmoothScroll() {
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== Keyboard Shortcuts =====
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            videoUrlInput.focus();
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            hideModal();
        }
    });
}

// ===== URL Paste Detection =====
function initPasteDetection() {
    videoUrlInput.addEventListener('paste', async (e) => {
        // Wait a bit for the paste to complete
        setTimeout(async () => {
            const url = videoUrlInput.value.trim();
            const validation = validateUrl(url);
            
            if (validation.valid) {
                errorMsg.textContent = '';
                // Auto-trigger download
                await handleDownload();
            } else {
                errorMsg.textContent = validation.message;
            }
        }, 100);
    });
}

// ===== Main Download Handler =====
async function handleDownload() {
    const url = videoUrlInput.value.trim();
    const validation = validateUrl(url);
    
    if (!validation.valid) {
        errorMsg.textContent = validation.message;
        showToast(validation.message, true);
        return;
    }
    
    errorMsg.textContent = '';
    
    // Show loading state
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    try {
        // Fetch video data
        const videoData = await fetchVideoData(url, validation.platform);
        
        if (videoData) {
            // Show modal with options
            showModal(videoData);
        } else {
            showToast('Could not fetch video data', true);
        }
    } catch (error) {
        showToast('An error occurred. Please try again.', true);
        console.error('Download error:', error);
    } finally {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
    }
}

// ===== Initialize App =====
function initApp() {
    // Load theme
    initTheme();
    
    // Initialize FAQ
    initFAQ();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize keyboard shortcuts
    initKeyboardShortcuts();
    
    // Initialize paste detection
    initPasteDetection();
    
    // Load download history
    updateResultsSection();
    
    // Event Listeners
    themeToggle.addEventListener('click', toggleTheme);
    downloadBtn.addEventListener('click', handleDownload);
    closeModal.addEventListener('click', hideModal);
    startDownloadBtn.addEventListener('click', simulateDownload);
    
    // Format button selection
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectFormat(btn.dataset.format, btn.dataset.quality);
        });
    });
    
    // Platform buttons
    document.querySelectorAll('.platform-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handlePlatformBtnClick(btn.dataset.platform);
        });
    });
    
    // Close modal on outside click
    downloadModal.addEventListener('click', (e) => {
        if (e.target === downloadModal) {
            hideModal();
        }
    });
    
    // URL input validation on change
    videoUrlInput.addEventListener('input', () => {
        const url = videoUrlInput.value.trim();
        if (url) {
            const validation = validateUrl(url);
            if (validation.valid) {
                errorMsg.textContent = '';
            } else {
                errorMsg.textContent = validation.message;
            }
        } else {
            errorMsg.textContent = '';
        }
    });
    
    // Allow Enter key to trigger download
    videoUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleDownload();
        }
    });
}

// ===== Make functions globally available for inline handlers =====
window.playVideo = playVideo;
window.deleteDownload = deleteDownload;

// ===== Start App =====
document.addEventListener('DOMContentLoaded', initApp);

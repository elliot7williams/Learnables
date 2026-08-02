// Main JavaScript file - Game initialization and UI handling
let gameManager;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Learnables...');
    gameManager = new GameManager();
    setupEventListeners();
    updateMainMenuUI();
});

// Global functions called by HTML onclick handlers
function startGame() {
    console.log('Start Adventure button clicked');
    if (!gameManager) {
        console.error('GameManager not initialized');
        return;
    }
    
    gameManager.startGame();
    showGameView();
}

function showGameView() {
    document.getElementById('main-menu').classList.remove('visible');
    document.getElementById('game-view').classList.add('visible');
}

function showMainMenu() {
    document.getElementById('game-view').classList.remove('visible');
    document.getElementById('main-menu').classList.add('visible');
    updateMainMenuUI();
}

function showInventory() {
    if (!gameManager) return;
    gameManager.showInventory();
    document.getElementById('inventory-modal').classList.add('visible');
}

function showCompanions() {
    if (!gameManager) return;
    gameManager.showCompanions();
    document.getElementById('companions-modal').classList.add('visible');
}

function showLeaderboard() {
    if (!gameManager) return;
    gameManager.showLeaderboard();
    document.getElementById('leaderboard-modal').classList.add('visible');
}

function showAchievements() {
    if (!gameManager) return;
    gameManager.showAchievements();
    document.getElementById('achievements-modal').classList.add('visible');
}

function showSettings() {
    document.getElementById('settings-modal').classList.add('visible');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('visible');
}

function selectAnswer(index) {
    if (!gameManager) return;
    gameManager.selectAnswer(index);
}

function submitAnswer() {
    if (!gameManager) return;
    gameManager.submitAnswer();
}

function showHint() {
    document.getElementById('hint-text').style.display = 'block';
}

function tryAgain() {
    if (!gameManager) return;
    gameManager.resetGame();
    hideGameOver();
    startGame();
}

function backToMenu() {
    hideGameOver();
    showMainMenu();
}

function dismissAchievement() {
    document.getElementById('achievement-popup').classList.remove('visible');
}

function hideGameOver() {
    document.getElementById('game-over-overlay').classList.remove('visible');
}

function resetProgress() {
    if (!gameManager) return;
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        gameManager.resetAllProgress();
        updateMainMenuUI();
        closeModal('settings-modal');
    }
}

// Make choice in story
function makeChoice(choiceIndex) {
    if (!gameManager) return;
    gameManager.makeChoice(choiceIndex);
}

// Update main menu UI
function updateMainMenuUI() {
    if (!gameManager) return;
    
    const userProgress = gameManager.userProgress;
    
    // Update stats displays
    document.getElementById('level-display').textContent = userProgress.level;
    document.getElementById('xp-display').textContent = userProgress.xp;
    document.getElementById('lives-display').textContent = userProgress.lives;
    document.getElementById('streak-display').textContent = userProgress.streak;
    
    // Update daily quests
    updateDailyQuestsDisplay();
    
    // Update seasonal event if any
    updateSeasonalEventDisplay();
}

function updateDailyQuestsDisplay() {
    if (!gameManager) return;
    
    const questsList = document.getElementById('daily-quests-list');
    const dailyQuests = gameManager.dailyQuests;
    
    if (dailyQuests.length === 0) {
        questsList.innerHTML = '<p class="no-quests">No quests available today</p>';
        return;
    }
    
    questsList.innerHTML = dailyQuests.map(quest => `
        <div class="quest-item ${quest.completed ? 'completed' : ''}">
            <div class="quest-info">
                <h4>${quest.title}</h4>
                <p>${quest.description}</p>
            </div>
            <div class="quest-reward">
                <span class="xp-reward">+${quest.xpReward} XP</span>
                ${quest.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
        </div>
    `).join('');
}

function updateSeasonalEventDisplay() {
    if (!gameManager) return;
    
    const eventElement = document.getElementById('seasonal-event');
    const seasonalEvent = gameManager.seasonalEvent;
    
    if (!seasonalEvent) {
        eventElement.style.display = 'none';
        return;
    }
    
    eventElement.style.display = 'block';
    document.getElementById('event-name').textContent = seasonalEvent.name;
    document.getElementById('event-description').textContent = seasonalEvent.description;
    document.getElementById('event-bonus').textContent = `Bonus: ${seasonalEvent.bonus}`;
}

// Setup event listeners for interactive elements
function setupEventListeners() {
    // Settings modal event listeners
    const audioCheckbox = document.getElementById('audio-enabled');
    const hapticCheckbox = document.getElementById('haptic-enabled');
    const difficultySelect = document.getElementById('difficulty-mode');
    
    if (audioCheckbox) {
        audioCheckbox.addEventListener('change', function() {
            if (gameManager) {
                gameManager.audioEnabled = this.checked;
                gameManager.saveGameData();
            }
        });
    }
    
    if (hapticCheckbox) {
        hapticCheckbox.addEventListener('change', function() {
            if (gameManager) {
                gameManager.hapticEnabled = this.checked;
                gameManager.saveGameData();
            }
        });
    }
    
    if (difficultySelect) {
        difficultySelect.addEventListener('change', function() {
            if (gameManager) {
                gameManager.difficultyMode = this.value;
                gameManager.saveGameData();
            }
        });
    }
    
    // Inventory category tabs
    const categoryTabs = document.querySelectorAll('.tab-btn');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter inventory by category
            const category = this.dataset.category;
            if (gameManager) {
                gameManager.filterInventoryByCategory(category);
            }
        });
    });
    
    // Leaderboard period selector
    const periodButtons = document.querySelectorAll('.period-btn');
    periodButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            periodButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update leaderboard for selected period
            const period = this.dataset.period;
            if (gameManager) {
                gameManager.loadLeaderboardForPeriod(period);
            }
        });
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('visible');
        }
        if (event.target.classList.contains('overlay')) {
            event.target.classList.remove('visible');
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // ESC to close modals
        if (event.key === 'Escape') {
            const visibleModal = document.querySelector('.modal.visible, .overlay.visible');
            if (visibleModal) {
                visibleModal.classList.remove('visible');
            }
        }
        
        // Number keys for challenge answers
        if (gameManager && gameManager.showingChallenge) {
            const num = parseInt(event.key);
            if (num >= 1 && num <= 4) {
                selectAnswer(num - 1);
            }
            
            // Enter to submit answer
            if (event.key === 'Enter' && gameManager.selectedAnswer !== null) {
                submitAnswer();
            }
        }
        
        // Space to start game from main menu
        if (event.key === ' ' && document.getElementById('main-menu').classList.contains('visible')) {
            event.preventDefault();
            startGame();
        }
    });
}

// Utility functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('visible'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('visible');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Export for debugging
window.gameManager = gameManager;

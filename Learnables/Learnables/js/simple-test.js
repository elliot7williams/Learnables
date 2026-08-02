// Simple test file for Start Adventure functionality
console.log('Simple test file loaded');

// Create a simple game manager for testing
window.gameManager = {
    userProgress: {
        level: 1,
        xp: 0,
        lives: 3,
        streak: 0
    },
    
    startGame: function() {
        console.log('Simple startGame called');
        alert('Game started! This is a test implementation.');
        
        // Show game view
        document.getElementById('main-menu').classList.remove('visible');
        document.getElementById('game-view').classList.add('visible');
        
        // Display a simple story
        document.getElementById('story-title').textContent = 'Test Story';
        document.getElementById('story-description').textContent = 'This is a test story to verify the game functionality is working.';
        document.getElementById('story-choices').innerHTML = `
            <button onclick="testChoice()" class="choice-btn">Continue Test</button>
        `;
    }
};

// Simple functions for testing
function startGame() {
    console.log('Global startGame function called');
    if (window.gameManager) {
        window.gameManager.startGame();
    } else {
        console.error('GameManager not found');
        alert('Error: Game Manager not found');
    }
}

function showMainMenu() {
    console.log('Showing main menu');
    document.getElementById('game-view').classList.remove('visible');
    document.getElementById('main-menu').classList.add('visible');
}

function showGameView() {
    console.log('Showing game view');
    document.getElementById('main-menu').classList.remove('visible');
    document.getElementById('game-view').classList.add('visible');
}

function testChoice() {
    alert('Test choice selected! The basic functionality is working.');
    showMainMenu();
}

// Stub functions for other buttons
function showInventory() { alert('Inventory functionality - coming soon!'); }
function showCompanions() { alert('Companions functionality - coming soon!'); }
function showLeaderboard() { alert('Leaderboard functionality - coming soon!'); }
function showAchievements() { alert('Achievements functionality - coming soon!'); }
function showSettings() { alert('Settings functionality - coming soon!'); }
function closeModal() { console.log('Modal closed'); }

console.log('Simple test functions defined');

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - simple test ready');
    
    // Update display
    if (window.gameManager) {
        document.getElementById('level-display').textContent = window.gameManager.userProgress.level;
        document.getElementById('xp-display').textContent = window.gameManager.userProgress.xp;
        document.getElementById('lives-display').textContent = window.gameManager.userProgress.lives;
        document.getElementById('streak-display').textContent = window.gameManager.userProgress.streak;
    }
});

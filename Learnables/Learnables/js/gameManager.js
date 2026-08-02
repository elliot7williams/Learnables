// Game Manager - Core game logic and state management
class GameManager {
    constructor() {
        this.userProgress = {
            currentStoryId: null,
            xp: 0,
            level: 1,
            lives: 3,
            skillLevels: {
                vocabulary: 1,
                grammar: 1,
                reading: 1,
                listening: 1,
                writing: 1
            },
            completedStories: new Set(),
            achievements: [],
            streak: 0,
            lastPlayDate: null,
            unlocked: new Set(['starting_village'])
        };
        
        this.currentStory = null;
        this.allStories = [];
        this.currentChallenge = null;
        this.showingChallenge = false;
        this.showingGameOver = false;
        this.showingVictory = false;
        this.showingAchievement = null;
        
        // Settings
        this.audioEnabled = true;
        this.hapticEnabled = true;
        this.darkMode = false;
        this.difficultyMode = 'normal';
        
        // Game state
        this.currentWeather = 'none';
        this.timeOfDay = 'morning';
        this.inventory = [];
        this.companions = [];
        this.currentLocation = 'starting_village';
        this.leaderboard = [];
        this.dailyQuests = [];
        this.weeklyChallenge = null;
        this.seasonalEvent = null;
        this.notifications = [];
        
        // Challenge state
        this.selectedAnswer = null;
        this.challengeTimer = null;
        this.timeRemaining = 30;
        
        this.init();
    }
    
    init() {
        this.loadGameData();
        this.setupDailyQuests();
        this.setupWeeklyChallenge();
        this.checkSeasonalEvents();
        this.startTimeOfDayTimer();
        this.loadLeaderboard();
        this.updateUI();
    }
    
    // Game Flow
    startGame() {
        if (this.allStories.length === 0) {
            this.allStories = StoryDataManager.getAllStories();
        }
        
        if (!this.userProgress.currentStoryId) {
            this.currentStory = this.getStartingStory();
            this.userProgress.currentStoryId = this.currentStory.id;
        } else {
            this.currentStory = this.getStoryById(this.userProgress.currentStoryId);
            if (!this.currentStory) {
                this.currentStory = this.getStartingStory();
                this.userProgress.currentStoryId = this.currentStory.id;
            }
        }
        
        this.updateStreak();
        this.updateStoryDisplay();
        // this.analyticsManager.trackEvent("game_started"); // TODO: Implement analytics
        this.updateStreak();
        console.log(`Game started with ${this.allStories.length} stories loaded`);
    }
    
    makeChoice(choiceIndex) {
        if (!this.currentStory || choiceIndex >= this.currentStory.choices.length) return;
        
        const choice = this.currentStory.choices[choiceIndex];
        
        if (choice.challenge) {
            this.currentChallenge = choice.challenge;
            this.showChallenge();
        } else {
            this.processChoice(choice);
        }
    }
    
    processChoice(choice) {
        // Handle consequences
        if (choice.consequence) {
            this.handleConsequence(choice.consequence);
        }
        
        // Move to next story
        if (choice.nextStoryId) {
            this.moveToStory(choice.nextStoryId);
        }
        
        this.saveGameData();
    }
    
    showChallenge() {
        this.showingChallenge = true;
        this.selectedAnswer = null;
        this.timeRemaining = 30;
        this.updateChallengeDisplay();
        this.startChallengeTimer();
        document.getElementById('challenge-overlay').classList.add('visible');
    }
    
    hideChallenge() {
        this.showingChallenge = false;
        this.stopChallengeTimer();
        document.getElementById('challenge-overlay').classList.remove('visible');
    }
    
    selectAnswer(index) {
        this.selectedAnswer = index;
        this.updateChallengeOptions();
        document.getElementById('submit-btn').disabled = false;
    }
    
    submitAnswer() {
        if (this.selectedAnswer === null) return;
        
        const isCorrect = this.selectedAnswer === this.currentChallenge.correctAnswerIndex;
        
        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
        
        this.hideChallenge();
        this.currentChallenge = null;
        this.saveGameData();
    }
    
    handleCorrectAnswer() {
        const baseXP = this.getDifficultyMultiplier() * this.getXPForChallenge(this.currentChallenge);
        this.addXP(baseXP);
        
        // Update skill level
        const skillType = this.currentChallenge.type;
        this.userProgress.skillLevels[skillType] = (this.userProgress.skillLevels[skillType] || 1) + 1;
        
        // Add random reward
        this.addRandomReward();
        
        // Check for achievements
        this.checkAchievements();
        
        if (this.audioEnabled) {
            SoundManager.playSuccess();
        }
        
        // Continue with the story choice that triggered this challenge
        if (this.currentStory) {
            const choice = this.currentStory.choices.find(c => c.challenge === this.currentChallenge);
            if (choice) {
                this.processChoice(choice);
            }
        }
    }
    
    handleIncorrectAnswer() {
        this.loseLife();
        
        if (this.isGameOver()) {
            this.showGameOver();
        }
        
        if (this.audioEnabled) {
            SoundManager.playFailure();
        }
    }
    
    // Story Management
    getStartingStory() {
        return StoryDataManager.getStartingStory();
    }
    
    getStoryById(id) {
        return StoryDataManager.getStoryById(id);
    }
    
    moveToStory(id) {
        const story = this.getStoryById(id);
        if (story) {
            this.currentStory = story;
            this.userProgress.currentStoryId = id;
            this.userProgress.completedStories.add(id);
            this.updateStoryDisplay();
        }
    }
    
    // User Progress Management
    addXP(amount) {
        this.userProgress.xp += amount;
        this.checkLevelUp();
        this.updateUI();
    }
    
    loseLife() {
        this.userProgress.lives -= 1;
        this.updateUI();
    }
    
    restoreLife() {
        if (this.userProgress.lives < 3) {
            this.userProgress.lives += 1;
            this.updateUI();
        }
    }
    
    checkLevelUp() {
        const xpForNextLevel = this.userProgress.level * 100;
        if (this.userProgress.xp >= xpForNextLevel) {
            this.userProgress.level += 1;
            this.restoreLife();
            this.showAchievement({
                title: 'Level Up!',
                description: `You reached level ${this.userProgress.level}!`,
                type: 'level_up'
            });
        }
    }
    
    updateStreak() {
        const today = new Date();
        const lastDate = this.userProgress.lastPlayDate ? new Date(this.userProgress.lastPlayDate) : null;
        
        if (!lastDate) {
            this.userProgress.streak = 1;
        } else {
            const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
            if (daysDiff === 0) {
                // Already played today
                return;
            } else if (daysDiff === 1) {
                // Consecutive day
                this.userProgress.streak += 1;
            } else {
                // Streak broken
                this.userProgress.streak = 1;
            }
        }
        
        this.userProgress.lastPlayDate = today.toISOString();
    }
    
    isGameOver() {
        return this.userProgress.lives <= 0;
    }
    
    addRandomReward() {
        const rewards = [
            { name: 'Health Potion', type: 'consumable', rarity: 'common', effect: 'restore_life' },
            { name: 'XP Boost', type: 'consumable', rarity: 'uncommon', effect: 'double_xp' },
            { name: 'Wisdom Scroll', type: 'book', rarity: 'rare', effect: 'skill_boost' },
            { name: 'Lucky Charm', type: 'artifact', rarity: 'epic', effect: 'protection' }
        ];
        
        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        this.inventory.push({
            id: Date.now().toString(),
            ...reward
        });
    }

    checkAchievements() {
        const achievements = [
            {
                type: 'first_story',
                title: 'First Steps',
                description: 'Complete your first story',
                condition: () => this.userProgress.completedStories.size >= 1
            },
            {
                type: 'streak_master',
                title: 'Streak Master',
                description: 'Maintain a 7-day learning streak',
                condition: () => this.userProgress.streak >= 7
            },
            {
                type: 'vocabulary_expert',
                title: 'Word Wizard',
                description: 'Reach level 10 in vocabulary',
                condition: () => this.userProgress.skillLevels.vocabulary >= 10
            },
            {
                type: 'survivor',
                title: 'Survivor',
                description: 'Win with only 1 life remaining',
                condition: () => this.userProgress.lives === 1 && this.userProgress.completedStories.size > 0
            }
        ];
        
        achievements.forEach(achievement => {
            if (!this.userProgress.achievements.some(a => a.type === achievement.type) && achievement.condition()) {
                this.userProgress.achievements.push({
                    ...achievement,
                    unlockDate: new Date().toISOString()
                });
                this.showAchievement(achievement);
            }
        });
    }

    handleConsequence(consequence) {
        switch (consequence.type) {
            case 'death':
                this.loseLife();
                if (this.isGameOver()) {
                    this.showGameOver();
                }
                break;
            case 'injury':
                this.loseLife();
                break;
            case 'success':
                this.addXP(25);
                this.addRandomReward();
                break;
            case 'neutral':
                break;
        }
    }

    // Challenge Management
    startChallengeTimer() {
        this.challengeTimer = setInterval(() => {
            this.timeRemaining -= 0.1;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.stopChallengeTimer();
                this.selectedAnswer = -1; // Auto-fail
                this.submitAnswer();
            }
        }, 100);
    }
    
    stopChallengeTimer() {
        if (this.challengeTimer) {
            clearInterval(this.challengeTimer);
            this.challengeTimer = null;
        }
    }
    
    // Advanced Features
    setupDailyQuests() {
        // Use simple daily quests instead of external generator
        this.dailyQuests = [
            {
                id: '1',
                title: 'Complete 3 Stories',
                description: 'Finish any 3 story adventures',
                type: 'complete_stories',
                target: 3,
                progress: 0,
                reward: { xp: 50, items: [] }
            },
            {
                id: '2',
                title: 'Answer 10 Questions Correctly',
                description: 'Get 10 challenge questions right',
                type: 'answer_correctly',
                target: 10,
                progress: 0,
                reward: { xp: 75, items: [] }
            }
        ];
    }
    
    setupWeeklyChallenge() {
        // Use simple weekly challenge instead of external generator
        this.weeklyChallenge = {
            id: '1',
            title: 'Grammar Master',
            description: 'Complete 20 grammar challenges this week',
            difficulty: 'gold',
            requirements: [
                {
                    description: 'Complete 20 grammar challenges',
                    target: 20,
                    current: 0,
                    type: 'specific_skill'
                }
            ],
            rewards: [],
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
    }
    
    checkSeasonalEvents() {
        // Use simple seasonal events instead of external manager
        const now = new Date();
        const month = now.getMonth();
        
        if (month === 9) { // October - Halloween
            this.seasonalEvent = {
                id: '1',
                name: 'Spooky Stories',
                description: 'Special Halloween-themed adventures await!',
                theme: 'halloween',
                startDate: new Date(now.getFullYear(), 9, 1).toISOString(),
                endDate: new Date(now.getFullYear(), 9, 31).toISOString(),
                bonusMultiplier: 2.0
            };
        }
    }
    
    setupAdvancedFeatures() {
        // Remove analytics reference - implement when needed
        this.startTimeOfDayTimer();
    }
    
    showAchievement(achievement) {
        this.showingAchievement = achievement;
        document.getElementById('achievement-title').textContent = achievement.title;
        document.getElementById('achievement-description').textContent = achievement.description;
        document.getElementById('achievement-popup').classList.add('visible');
    }
    
    dismissAchievement() {
        this.showingAchievement = null;
        document.getElementById('achievement-popup').classList.remove('visible');
    }
    
    // Game Over
    showGameOver() {
        this.showingGameOver = true;
        document.getElementById('final-stories').textContent = this.userProgress.completedStories.size;
        document.getElementById('final-xp').textContent = this.userProgress.xp;
        document.getElementById('final-level').textContent = this.userProgress.level;
        document.getElementById('final-streak').textContent = `${this.userProgress.streak} days`;
        document.getElementById('game-over-overlay').classList.add('visible');
    }
    
    hideGameOver() {
        this.showingGameOver = false;
        document.getElementById('game-over-overlay').classList.remove('visible');
    }
    
    resetGame() {
        this.userProgress = {
            currentStoryId: null,
            xp: 0,
            level: 1,
            lives: 3,
            skillLevels: {
                vocabulary: 1,
                grammar: 1,
                reading: 1,
                listening: 1,
                writing: 1
            },
            completedStories: new Set(),
            achievements: [],
            streak: 0,
            lastPlayDate: null,
            unlocked: new Set(['starting_village'])
        };
        
        this.currentStory = null;
        this.inventory = [];
        this.companions = [];
        this.currentLocation = 'starting_village';
        this.hideGameOver();
        this.saveGameData();
        this.updateUI();
    }
    
    // Data Management
    loadGameData() {
        try {
            const saved = localStorage.getItem('learnables_save');
            if (saved) {
                const data = JSON.parse(saved);
                this.userProgress = {
                    ...this.userProgress,
                    ...data.userProgress,
                    completedStories: new Set(data.userProgress?.completedStories || []),
                    unlocked: new Set(data.userProgress?.unlocked || ['starting_village'])
                };
                this.inventory = data.inventory || [];
                this.companions = data.companions || [];
                this.audioEnabled = data.settings?.audioEnabled ?? true;
                this.hapticEnabled = data.settings?.hapticEnabled ?? true;
                this.difficultyMode = data.settings?.difficultyMode || 'normal';
            }
        } catch (error) {
            console.error('Failed to load game data:', error);
        }
    }
    
    saveGameData() {
        try {
            const data = {
                userProgress: {
                    ...this.userProgress,
                    completedStories: Array.from(this.userProgress.completedStories),
                    unlocked: Array.from(this.userProgress.unlocked)
                },
                inventory: this.inventory,
                companions: this.companions,
                settings: {
                    audioEnabled: this.audioEnabled,
                    hapticEnabled: this.hapticEnabled,
                    difficultyMode: this.difficultyMode
                }
            };
            localStorage.setItem('learnables_save', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save game data:', error);
        }
    }
    
    startTimeOfDayTimer() {
        this.updateTimeOfDay();
        setInterval(() => {
            this.updateTimeOfDay();
        }, 300000); // Every 5 minutes
    }
    
    updateTimeOfDay() {
        const hour = new Date().getHours();
        let newTimeOfDay;
        
        if (hour >= 5 && hour <= 6) newTimeOfDay = 'dawn';
        else if (hour >= 7 && hour <= 11) newTimeOfDay = 'morning';
        else if (hour >= 12 && hour <= 17) newTimeOfDay = 'afternoon';
        else if (hour >= 18 && hour <= 20) newTimeOfDay = 'evening';
        else if (hour >= 21 && hour <= 23) newTimeOfDay = 'night';
        else newTimeOfDay = 'midnight';
        
        if (newTimeOfDay !== this.timeOfDay) {
            this.timeOfDay = newTimeOfDay;
            this.updateBackgroundGradient();
        }
        
        // Random weather changes
        if (Math.random() < 0.1) {
            const weathers = ['none', 'rain', 'snow', 'storm', 'fog', 'sunny'];
            this.currentWeather = weathers[Math.floor(Math.random() * weathers.length)];
            WeatherEffects.setWeather(this.currentWeather);
        }
    }
    
    updateBackgroundGradient() {
        const gradientBg = document.querySelector('.gradient-bg');
        gradientBg.className = `gradient-bg ${this.timeOfDay}`;
    }
    
    loadLeaderboard() {
        // Mock leaderboard data
        this.leaderboard = [
            { id: '1', playerName: 'WordMaster', score: 2500, level: 15, rank: 1, country: 'USA', avatar: 'W' },
            { id: '2', playerName: 'GrammarGuru', score: 2200, level: 13, rank: 2, country: 'UK', avatar: 'G' },
            { id: '3', playerName: 'StorySeeker', score: 1900, level: 12, rank: 3, country: 'Canada', avatar: 'S' },
            { id: '4', playerName: 'LangLearner', score: 1750, level: 11, rank: 4, country: 'Australia', avatar: 'L' },
            { id: '5', playerName: 'BookWorm', score: 1600, level: 10, rank: 5, country: 'Germany', avatar: 'B' }
        ];
    }
    
    // Utility Methods
    getDifficultyMultiplier() {
        switch (this.difficultyMode) {
            case 'easy': return 1;
            case 'normal': return 2;
            case 'hard': return 3;
            case 'nightmare': return 5;
            default: return 2;
        }
    }
    
    getXPForChallenge(challenge) {
        const baseXP = 10;
        let difficultyMultiplier;
        
        switch (challenge.difficulty) {
            case 'easy': difficultyMultiplier = 1; break;
            case 'medium': difficultyMultiplier = 2; break;
            case 'hard': difficultyMultiplier = 3; break;
            default: difficultyMultiplier = 2;
        }
        
        return baseXP * difficultyMultiplier;
    }
    
    // UI Update Methods
    updateUI() {
        document.getElementById('level-display').textContent = this.userProgress.level;
        document.getElementById('xp-display').textContent = this.userProgress.xp;
        document.getElementById('lives-display').textContent = this.userProgress.lives;
        document.getElementById('streak-display').textContent = this.userProgress.streak;
        document.getElementById('game-xp').textContent = this.userProgress.xp;
        
        // Update lives display in game view
        const livesDisplay = document.querySelector('.lives-display');
        if (livesDisplay) {
            const hearts = livesDisplay.querySelectorAll('i');
            hearts.forEach((heart, index) => {
                heart.className = index < this.userProgress.lives ? 'fas fa-heart' : 'fas fa-heart inactive';
            });
        }
        
        this.updateDailyQuestsDisplay();
        this.updateSeasonalEventDisplay();
    }
    
    updateStoryDisplay() {
        if (!this.currentStory) return;
        
        document.getElementById('story-title').textContent = this.currentStory.title;
        document.getElementById('story-description').textContent = this.currentStory.description;
        
        const choicesContainer = document.getElementById('story-choices');
        choicesContainer.innerHTML = '';
        
        this.currentStory.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.innerHTML = `
                <span>${choice.text}</span>
                ${choice.challenge ? '<i class="fas fa-question-circle"></i>' : ''}
            `;
            button.onclick = () => this.makeChoice(index);
            choicesContainer.appendChild(button);
        });
    }
    
    updateChallengeDisplay() {
        if (!this.currentChallenge) return;
        
        document.getElementById('challenge-type').textContent = 
            this.currentChallenge.type.charAt(0).toUpperCase() + 
            this.currentChallenge.type.slice(1) + ' Challenge';
        
        const difficultyBadge = document.getElementById('challenge-difficulty');
        difficultyBadge.textContent = this.currentChallenge.difficulty.charAt(0).toUpperCase() + 
            this.currentChallenge.difficulty.slice(1);
        difficultyBadge.className = `difficulty-badge ${this.currentChallenge.difficulty}`;
        
        document.getElementById('challenge-question').textContent = this.currentChallenge.question;
        
        this.updateChallengeOptions();
        this.updateTimerDisplay();
    }
    
    updateChallengeOptions() {
        const optionsContainer = document.getElementById('challenge-options');
        optionsContainer.innerHTML = '';
        
        this.currentChallenge.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = `option-btn ${this.selectedAnswer === index ? 'selected' : ''}`;
            button.innerHTML = `
                <span>${option}</span>
                ${this.selectedAnswer === index ? '<i class="fas fa-check-circle"></i>' : ''}
            `;
            button.onclick = () => this.selectAnswer(index);
            optionsContainer.appendChild(button);
        });
    }
    
    updateTimerDisplay() {
        const timerFill = document.getElementById('timer-fill');
        const timerText = document.getElementById('timer-text');
        
        const percentage = Math.max(0, (this.timeRemaining / 30) * 100);
        timerFill.style.width = `${percentage}%`;
        timerFill.className = `timer-fill ${this.timeRemaining <= 10 ? 'warning' : ''}`;
        timerText.textContent = `${Math.ceil(this.timeRemaining)}s`;
    }
    
    updateDailyQuestsDisplay() {
        const questsList = document.getElementById('daily-quests-list');
        if (!questsList) return;
        
        questsList.innerHTML = '';
        
        this.dailyQuests.slice(0, 2).forEach(quest => {
            const questElement = document.createElement('div');
            questElement.className = 'quest-item';
            questElement.innerHTML = `
                <span>${quest.title}</span>
                <div class="quest-progress">
                    <div class="quest-progress-fill" style="width: ${(quest.progress / quest.target) * 100}%"></div>
                </div>
            `;
            questsList.appendChild(questElement);
        });
    }
    
    updateSeasonalEventDisplay() {
        const eventElement = document.getElementById('seasonal-event');
        if (!eventElement) return;
        
        if (this.seasonalEvent && this.isEventActive(this.seasonalEvent)) {
            document.getElementById('event-name').textContent = this.seasonalEvent.name;
            document.getElementById('event-description').textContent = this.seasonalEvent.description;
            document.getElementById('event-bonus').textContent = `${this.seasonalEvent.bonusMultiplier}x XP Bonus!`;
            eventElement.style.display = 'block';
        } else {
            eventElement.style.display = 'none';
        }
    }
    
    isEventActive(event) {
        const now = new Date();
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        return now >= start && now <= end;
    }
    
    // Missing methods for UI functionality
    showInventory() {
        console.log('Showing inventory');
        this.updateInventoryDisplay();
    }
    
    showCompanions() {
        console.log('Showing companions');
        this.updateCompanionsDisplay();
    }
    
    showLeaderboard() {
        console.log('Showing leaderboard');
        this.updateLeaderboardDisplay();
    }
    
    showAchievements() {
        console.log('Showing achievements');
        this.updateAchievementsDisplay();
    }
    
    resetAllProgress() {
        console.log('Resetting all progress');
        this.resetGame();
    }
    
    filterInventoryByCategory(category) {
        console.log('Filtering inventory by category:', category);
        this.updateInventoryDisplay(category);
    }
    
    loadLeaderboardForPeriod(period) {
        console.log('Loading leaderboard for period:', period);
        // TODO: Implement different leaderboard periods
        this.updateLeaderboardDisplay();
    }
    
    updateInventoryDisplay(category = null) {
        const inventoryGrid = document.getElementById('inventory-grid');
        if (!inventoryGrid) return;
        
        let filteredItems = this.inventory;
        if (category) {
            filteredItems = this.inventory.filter(item => item.type === category);
        }
        
        if (filteredItems.length === 0) {
            inventoryGrid.innerHTML = '<div class="empty-state"><p>No items found</p></div>';
            return;
        }
        
        inventoryGrid.innerHTML = filteredItems.map(item => `
            <div class="inventory-item ${item.rarity}">
                <div class="item-name">${item.name}</div>
                <div class="item-type">${item.type}</div>
                <div class="item-effect">${item.effect}</div>
            </div>
        `).join('');
    }
    
    updateCompanionsDisplay() {
        const companionsList = document.getElementById('companions-list');
        if (!companionsList) return;
        
        if (this.companions.length === 0) {
            companionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-slash"></i>
                    <h3>No Companions Yet</h3>
                    <p>Complete stories and level up to unlock companions who will help you on your journey!</p>
                </div>
            `;
            return;
        }
        
        companionsList.innerHTML = this.companions.map(companion => `
            <div class="companion-card">
                <div class="companion-avatar">${companion.avatar}</div>
                <div class="companion-info">
                    <h4>${companion.name}</h4>
                    <p>${companion.description}</p>
                    <div class="companion-stats">
                        <span>Level: ${companion.level}</span>
                        <span>Skill: ${companion.skill}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    updateLeaderboardDisplay() {
        const leaderboardList = document.getElementById('leaderboard-list');
        if (!leaderboardList) return;
        
        leaderboardList.innerHTML = this.leaderboard.map(player => `
            <div class="leaderboard-entry">
                <div class="rank">#${player.rank}</div>
                <div class="player-info">
                    <div class="player-avatar">${player.avatar}</div>
                    <div class="player-details">
                        <div class="player-name">${player.playerName}</div>
                        <div class="player-country">${player.country}</div>
                    </div>
                </div>
                <div class="player-stats">
                    <div class="score">${player.score}</div>
                    <div class="level">Level ${player.level}</div>
                </div>
            </div>
        `).join('');
    }
    
    updateAchievementsDisplay() {
        const achievementsList = document.getElementById('achievements-list');
        if (!achievementsList) return;
        
        // Create a list of all possible achievements
        const allAchievements = [
            {
                type: 'first_story',
                title: 'First Steps',
                description: 'Complete your first story',
                unlocked: this.userProgress.achievements.some(a => a.type === 'first_story')
            },
            {
                type: 'streak_master',
                title: 'Streak Master',
                description: 'Maintain a 7-day learning streak',
                unlocked: this.userProgress.achievements.some(a => a.type === 'streak_master')
            },
            {
                type: 'vocabulary_expert',
                title: 'Word Wizard',
                description: 'Reach level 10 in vocabulary',
                unlocked: this.userProgress.achievements.some(a => a.type === 'vocabulary_expert')
            },
            {
                type: 'survivor',
                title: 'Survivor',
                description: 'Win with only 1 life remaining',
                unlocked: this.userProgress.achievements.some(a => a.type === 'survivor')
            }
        ];
        
        achievementsList.innerHTML = allAchievements.map(achievement => `
            <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">
                    <i class="fas fa-${achievement.unlocked ? 'star' : 'lock'}"></i>
                </div>
                <div class="achievement-info">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                    ${achievement.unlocked ? '<div class="achievement-date">Unlocked!</div>' : ''}
                </div>
            </div>
        `).join('');
    }
}

// Global game manager instance
let gameManager;

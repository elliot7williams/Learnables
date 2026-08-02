// Achievement Manager - Handles all achievement logic and unlocking
class AchievementManager {
    static achievements = [];
    static unlockedAchievements = [];
    
    static init() {
        this.loadAchievements();
        this.unlockedAchievements = StorageManager.loadAchievements();
    }
    
    static loadAchievements() {
        this.achievements = [
            // Beginner Achievements
            {
                id: 'first_steps',
                title: 'First Steps',
                description: 'Complete your first story',
                icon: '👶',
                category: 'story',
                requirement: { type: 'stories_completed', value: 1 },
                reward: { xp: 50, item: null },
                rarity: 'common'
            },
            {
                id: 'word_warrior',
                title: 'Word Warrior',
                description: 'Answer 10 vocabulary challenges correctly',
                icon: '⚔️',
                category: 'vocabulary',
                requirement: { type: 'vocabulary_correct', value: 10 },
                reward: { xp: 100, item: { id: 'dictionary', name: 'Pocket Dictionary', type: 'book' } },
                rarity: 'common'
            },
            {
                id: 'grammar_guru',
                title: 'Grammar Guru',
                description: 'Perfect 5 grammar challenges in a row',
                icon: '📝',
                category: 'grammar',
                requirement: { type: 'grammar_streak', value: 5 },
                reward: { xp: 150, item: { id: 'grammar_guide', name: 'Grammar Guide', type: 'book' } },
                rarity: 'uncommon'
            },
            {
                id: 'speed_reader',
                title: 'Speed Reader',
                description: 'Complete a reading challenge in under 30 seconds',
                icon: '⚡',
                category: 'reading',
                requirement: { type: 'reading_speed', value: 30 },
                reward: { xp: 75, item: null },
                rarity: 'common'
            },
            {
                id: 'persistent_learner',
                title: 'Persistent Learner',
                description: 'Play for 3 consecutive days',
                icon: '🔥',
                category: 'streak',
                requirement: { type: 'daily_streak', value: 3 },
                reward: { xp: 200, item: { id: 'flame_sword', name: 'Flame Sword', type: 'weapon' } },
                rarity: 'uncommon'
            },
            
            // Intermediate Achievements
            {
                id: 'story_master',
                title: 'Story Master',
                description: 'Complete 25 stories',
                icon: '📚',
                category: 'story',
                requirement: { type: 'stories_completed', value: 25 },
                reward: { xp: 500, item: { id: 'master_cloak', name: 'Master\'s Cloak', type: 'armor' } },
                rarity: 'rare'
            },
            {
                id: 'vocabulary_virtuoso',
                title: 'Vocabulary Virtuoso',
                description: 'Learn 100 new words',
                icon: '🎭',
                category: 'vocabulary',
                requirement: { type: 'words_learned', value: 100 },
                reward: { xp: 750, item: { id: 'word_wand', name: 'Word Wand', type: 'weapon' } },
                rarity: 'rare'
            },
            {
                id: 'perfect_week',
                title: 'Perfect Week',
                description: 'Play every day for a week',
                icon: '🌟',
                category: 'streak',
                requirement: { type: 'daily_streak', value: 7 },
                reward: { xp: 1000, item: { id: 'crown_of_learning', name: 'Crown of Learning', type: 'armor' } },
                rarity: 'epic'
            },
            {
                id: 'skill_specialist',
                title: 'Skill Specialist',
                description: 'Reach level 10 in any skill',
                icon: '🎯',
                category: 'skill',
                requirement: { type: 'skill_level', value: 10 },
                reward: { xp: 300, item: { id: 'specialist_badge', name: 'Specialist Badge', type: 'accessory' } },
                rarity: 'uncommon'
            },
            {
                id: 'challenge_champion',
                title: 'Challenge Champion',
                description: 'Complete 50 challenges with perfect accuracy',
                icon: '🏆',
                category: 'challenge',
                requirement: { type: 'perfect_challenges', value: 50 },
                reward: { xp: 800, item: { id: 'champion_shield', name: 'Champion\'s Shield', type: 'armor' } },
                rarity: 'rare'
            },
            
            // Advanced Achievements
            {
                id: 'legend_scholar',
                title: 'Legend Scholar',
                description: 'Complete 100 stories',
                icon: '🎓',
                category: 'story',
                requirement: { type: 'stories_completed', value: 100 },
                reward: { xp: 2000, item: { id: 'scholars_robe', name: 'Scholar\'s Robe', type: 'armor' } },
                rarity: 'legendary'
            },
            {
                id: 'polyglot_prodigy',
                title: 'Polyglot Prodigy',
                description: 'Reach level 20 in all skills',
                icon: '🌍',
                category: 'skill',
                requirement: { type: 'all_skills_level', value: 20 },
                reward: { xp: 5000, item: { id: 'babel_staff', name: 'Staff of Babel', type: 'weapon' } },
                rarity: 'legendary'
            },
            {
                id: 'month_marathon',
                title: 'Month Marathon',
                description: 'Play every day for 30 days',
                icon: '📅',
                category: 'streak',
                requirement: { type: 'daily_streak', value: 30 },
                reward: { xp: 3000, item: { id: 'time_amulet', name: 'Amulet of Time', type: 'accessory' } },
                rarity: 'legendary'
            },
            {
                id: 'word_collector',
                title: 'Word Collector',
                description: 'Learn 500 words',
                icon: '📖',
                category: 'vocabulary',
                requirement: { type: 'words_learned', value: 500 },
                reward: { xp: 2500, item: { id: 'lexicon_tome', name: 'Lexicon Tome', type: 'book' } },
                rarity: 'legendary'
            },
            {
                id: 'perfect_hundred',
                title: 'Perfect Hundred',
                description: 'Complete 100 challenges without a single mistake',
                icon: '💯',
                category: 'challenge',
                requirement: { type: 'perfect_challenges', value: 100 },
                reward: { xp: 4000, item: { id: 'perfection_crystal', name: 'Crystal of Perfection', type: 'accessory' } },
                rarity: 'legendary'
            },
            
            // Secret/Special Achievements
            {
                id: 'night_owl',
                title: 'Night Owl',
                description: 'Complete a story between midnight and 6 AM',
                icon: '🦉',
                category: 'special',
                requirement: { type: 'night_play', value: 1 },
                reward: { xp: 200, item: { id: 'moonstone', name: 'Moonstone', type: 'accessory' } },
                rarity: 'rare',
                hidden: true
            },
            {
                id: 'speed_demon',
                title: 'Speed Demon',
                description: 'Complete 10 challenges in under 10 seconds each',
                icon: '💨',
                category: 'special',
                requirement: { type: 'speed_challenges', value: 10 },
                reward: { xp: 500, item: { id: 'lightning_boots', name: 'Lightning Boots', type: 'armor' } },
                rarity: 'epic',
                hidden: true
            },
            {
                id: 'comeback_king',
                title: 'Comeback King',
                description: 'Win a game after losing all but one life',
                icon: '👑',
                category: 'special',
                requirement: { type: 'comeback_victory', value: 1 },
                reward: { xp: 300, item: { id: 'phoenix_feather', name: 'Phoenix Feather', type: 'accessory' } },
                rarity: 'epic',
                hidden: true
            },
            {
                id: 'easter_egg_hunter',
                title: 'Easter Egg Hunter',
                description: 'Find and interact with 5 hidden elements',
                icon: '🥚',
                category: 'special',
                requirement: { type: 'easter_eggs', value: 5 },
                reward: { xp: 400, item: { id: 'hunters_compass', name: 'Hunter\'s Compass', type: 'accessory' } },
                rarity: 'epic',
                hidden: true
            },
            {
                id: 'ultimate_master',
                title: 'Ultimate Master',
                description: 'Complete all other achievements',
                icon: '🎆',
                category: 'special',
                requirement: { type: 'all_achievements', value: 1 },
                reward: { xp: 10000, item: { id: 'masters_crown', name: 'Master\'s Crown', type: 'armor' } },
                rarity: 'legendary',
                hidden: true
            }
        ];
    }
    
    static checkAchievements(gameState) {
        const newAchievements = [];
        
        for (const achievement of this.achievements) {
            // Skip if already unlocked
            if (this.isUnlocked(achievement.id)) continue;
            
            // Check if achievement is earned
            if (this.checkAchievementRequirement(achievement, gameState)) {
                this.unlockAchievement(achievement);
                newAchievements.push(achievement);
            }
        }
        
        return newAchievements;
    }
    
    static checkAchievementRequirement(achievement, gameState) {
        const req = achievement.requirement;
        
        switch (req.type) {
            case 'stories_completed':
                return gameState.userProgress.completedStories.size >= req.value;
                
            case 'vocabulary_correct':
                return gameState.statistics.vocabularyCorrect >= req.value;
                
            case 'grammar_streak':
                return gameState.statistics.grammarStreak >= req.value;
                
            case 'reading_speed':
                return gameState.statistics.fastestReading <= req.value;
                
            case 'daily_streak':
                return gameState.userProgress.streak >= req.value;
                
            case 'words_learned':
                return gameState.statistics.wordsLearned >= req.value;
                
            case 'skill_level':
                return Object.values(gameState.userProgress.skillLevels).some(level => level >= req.value);
                
            case 'all_skills_level':
                return Object.values(gameState.userProgress.skillLevels).every(level => level >= req.value);
                
            case 'perfect_challenges':
                return gameState.statistics.perfectChallenges >= req.value;
                
            case 'night_play':
                const hour = new Date().getHours();
                return (hour >= 0 && hour < 6) && gameState.statistics.nightPlays >= req.value;
                
            case 'speed_challenges':
                return gameState.statistics.speedChallenges >= req.value;
                
            case 'comeback_victory':
                return gameState.statistics.comebackVictories >= req.value;
                
            case 'easter_eggs':
                return gameState.statistics.easterEggs >= req.value;
                
            case 'all_achievements':
                const totalAchievements = this.achievements.filter(a => a.id !== 'ultimate_master').length;
                return this.unlockedAchievements.length >= totalAchievements;
                
            default:
                return false;
        }
    }
    
    static unlockAchievement(achievement) {
        if (this.isUnlocked(achievement.id)) return false;
        
        // Add to unlocked achievements
        this.unlockedAchievements.push({
            id: achievement.id,
            unlockedAt: Date.now(),
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            rarity: achievement.rarity,
            reward: achievement.reward
        });
        
        // Save to storage
        StorageManager.saveAchievements(this.unlockedAchievements);
        
        console.log(`Achievement unlocked: ${achievement.title}`);
        return true;
    }
    
    static isUnlocked(achievementId) {
        return this.unlockedAchievements.some(a => a.id === achievementId);
    }
    
    static getAchievement(id) {
        return this.achievements.find(a => a.id === id);
    }
    
    static getUnlockedAchievement(id) {
        return this.unlockedAchievements.find(a => a.id === id);
    }
    
    static getAllAchievements() {
        return this.achievements.map(achievement => ({
            ...achievement,
            unlocked: this.isUnlocked(achievement.id),
            unlockedAt: this.getUnlockedAchievement(achievement.id)?.unlockedAt || null
        }));
    }
    
    static getAchievementsByCategory(category) {
        return this.getAllAchievements().filter(a => a.category === category);
    }
    
    static getVisibleAchievements() {
        return this.getAllAchievements().filter(a => !a.hidden || a.unlocked);
    }
    
    static getUnlockedAchievements() {
        return this.unlockedAchievements;
    }
    
    static getAchievementProgress(achievement, gameState) {
        const req = achievement.requirement;
        let current = 0;
        
        switch (req.type) {
            case 'stories_completed':
                current = gameState.userProgress.completedStories.size;
                break;
            case 'vocabulary_correct':
                current = gameState.statistics.vocabularyCorrect || 0;
                break;
            case 'grammar_streak':
                current = gameState.statistics.grammarStreak || 0;
                break;
            case 'daily_streak':
                current = gameState.userProgress.streak;
                break;
            case 'words_learned':
                current = gameState.statistics.wordsLearned || 0;
                break;
            case 'perfect_challenges':
                current = gameState.statistics.perfectChallenges || 0;
                break;
            case 'skill_level':
                current = Math.max(...Object.values(gameState.userProgress.skillLevels));
                break;
            case 'all_skills_level':
                current = Math.min(...Object.values(gameState.userProgress.skillLevels));
                break;
            default:
                current = 0;
        }
        
        return {
            current: Math.min(current, req.value),
            target: req.value,
            percentage: Math.round((current / req.value) * 100)
        };
    }
    
    static getCompletionStats() {
        const total = this.achievements.filter(a => !a.hidden).length;
        const unlocked = this.unlockedAchievements.length;
        const hidden = this.achievements.filter(a => a.hidden && this.isUnlocked(a.id)).length;
        
        return {
            total,
            unlocked,
            hidden,
            percentage: Math.round((unlocked / total) * 100)
        };
    }
    
    static getRarityColor(rarity) {
        const colors = {
            common: '#9CA3AF',
            uncommon: '#10B981',
            rare: '#3B82F6',
            epic: '#8B5CF6',
            legendary: '#F59E0B'
        };
        return colors[rarity] || colors.common;
    }
    
    static showAchievementPopup(achievement) {
        // Show achievement popup in UI
        const popup = document.getElementById('achievement-popup');
        if (popup) {
            document.getElementById('achievement-title').textContent = achievement.title;
            document.getElementById('achievement-description').textContent = achievement.description;
            
            // Add rarity styling
            popup.className = `overlay achievement-popup ${achievement.rarity}`;
            popup.classList.add('visible');
            
            // Play achievement sound
            if (SoundManager) {
                SoundManager.playAchievement();
            }
            
            // Haptic feedback
            if (HapticManager) {
                HapticManager.achievementFeedback();
            }
            
            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                if (popup.classList.contains('visible')) {
                    popup.classList.remove('visible');
                }
            }, 5000);
        }
    }
    
    static formatAchievementList() {
        const categories = {
            story: 'Story Progress',
            vocabulary: 'Vocabulary Mastery',
            grammar: 'Grammar Excellence',
            reading: 'Reading Comprehension',
            listening: 'Listening Skills',
            writing: 'Writing Proficiency',
            skill: 'Skill Development',
            challenge: 'Challenge Completion',
            streak: 'Consistency',
            special: 'Special Achievements'
        };
        
        const achievements = this.getVisibleAchievements();
        const grouped = {};
        
        // Group by category
        for (const achievement of achievements) {
            const category = achievement.category;
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(achievement);
        }
        
        // Generate HTML
        let html = '';
        for (const [category, categoryAchievements] of Object.entries(grouped)) {
            html += `<div class="achievement-category">`;
            html += `<h3>${categories[category] || category}</h3>`;
            
            for (const achievement of categoryAchievements) {
                const unlockedClass = achievement.unlocked ? 'unlocked' : 'locked';
                const rarityClass = achievement.rarity;
                
                html += `
                    <div class="achievement-item ${unlockedClass} ${rarityClass}">
                        <div class="achievement-icon">${achievement.icon}</div>
                        <div class="achievement-info">
                            <h4>${achievement.title}</h4>
                            <p>${achievement.description}</p>
                            ${achievement.unlocked ? 
                                `<small>Unlocked: ${new Date(achievement.unlockedAt).toLocaleDateString()}</small>` :
                                `<div class="achievement-progress">Progress: ${this.getAchievementProgress(achievement, window.gameManager || {}).percentage}%</div>`
                            }
                        </div>
                        ${achievement.unlocked ? '<i class="fas fa-check achievement-check"></i>' : ''}
                    </div>
                `;
            }
            
            html += `</div>`;
        }
        
        return html;
    }
}

// Initialize achievements when the page loads
document.addEventListener('DOMContentLoaded', () => {
    AchievementManager.init();
});

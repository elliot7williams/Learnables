// Daily Quest Generator - Creates dynamic daily challenges
class DailyQuestGenerator {
    static questTemplates = [];
    static currentQuests = [];
    
    static init() {
        this.loadQuestTemplates();
        this.loadOrGenerateDailyQuests();
    }
    
    static loadQuestTemplates() {
        this.questTemplates = [
            // Vocabulary Quests
            {
                id: 'vocab_master',
                category: 'vocabulary',
                title: 'Vocabulary Master',
                description: 'Complete {count} vocabulary challenges',
                icon: '📚',
                requirements: [
                    { count: 3, xpReward: 100, difficulty: 'easy' },
                    { count: 5, xpReward: 150, difficulty: 'medium' },
                    { count: 8, xpReward: 200, difficulty: 'hard' }
                ],
                trackingKey: 'vocabularyChallengesCompleted'
            },
            {
                id: 'word_collector',
                category: 'vocabulary',
                title: 'Word Collector',
                description: 'Learn {count} new words today',
                icon: '🔤',
                requirements: [
                    { count: 5, xpReward: 80, difficulty: 'easy' },
                    { count: 10, xpReward: 120, difficulty: 'medium' },
                    { count: 15, xpReward: 160, difficulty: 'hard' }
                ],
                trackingKey: 'wordsLearnedToday'
            },
            {
                id: 'synonym_hunter',
                category: 'vocabulary',
                title: 'Synonym Hunter',
                description: 'Find synonyms for {count} words',
                icon: '🎯',
                requirements: [
                    { count: 3, xpReward: 90, difficulty: 'easy' },
                    { count: 5, xpReward: 130, difficulty: 'medium' },
                    { count: 8, xpReward: 170, difficulty: 'hard' }
                ],
                trackingKey: 'synonymsFound'
            },
            
            // Grammar Quests
            {
                id: 'grammar_guru',
                category: 'grammar',
                title: 'Grammar Guru',
                description: 'Perfect {count} grammar challenges',
                icon: '✏️',
                requirements: [
                    { count: 3, xpReward: 110, difficulty: 'easy' },
                    { count: 5, xpReward: 160, difficulty: 'medium' },
                    { count: 7, xpReward: 210, difficulty: 'hard' }
                ],
                trackingKey: 'grammarPerfectStreak'
            },
            {
                id: 'punctuation_pro',
                category: 'grammar',
                title: 'Punctuation Pro',
                description: 'Correctly punctuate {count} sentences',
                icon: '❗',
                requirements: [
                    { count: 5, xpReward: 85, difficulty: 'easy' },
                    { count: 8, xpReward: 125, difficulty: 'medium' },
                    { count: 12, xpReward: 165, difficulty: 'hard' }
                ],
                trackingKey: 'punctuationCorrect'
            },
            {
                id: 'tense_master',
                category: 'grammar',
                title: 'Tense Master',
                description: 'Master {count} different verb tenses',
                icon: '⏰',
                requirements: [
                    { count: 2, xpReward: 95, difficulty: 'easy' },
                    { count: 4, xpReward: 140, difficulty: 'medium' },
                    { count: 6, xpReward: 185, difficulty: 'hard' }
                ],
                trackingKey: 'tensesMastered'
            },
            
            // Reading Quests
            {
                id: 'speed_reader',
                category: 'reading',
                title: 'Speed Reader',
                description: 'Complete {count} reading challenges quickly',
                icon: '⚡',
                requirements: [
                    { count: 2, xpReward: 100, difficulty: 'easy' },
                    { count: 4, xpReward: 150, difficulty: 'medium' },
                    { count: 6, xpReward: 200, difficulty: 'hard' }
                ],
                trackingKey: 'fastReadingCompleted'
            },
            {
                id: 'comprehension_king',
                category: 'reading',
                title: 'Comprehension King',
                description: 'Answer {count} reading comprehension questions perfectly',
                icon: '👑',
                requirements: [
                    { count: 3, xpReward: 120, difficulty: 'easy' },
                    { count: 5, xpReward: 170, difficulty: 'medium' },
                    { count: 8, xpReward: 220, difficulty: 'hard' }
                ],
                trackingKey: 'comprehensionPerfect'
            },
            {
                id: 'inference_detective',
                category: 'reading',
                title: 'Inference Detective',
                description: 'Make {count} correct inferences from texts',
                icon: '🔍',
                requirements: [
                    { count: 2, xpReward: 110, difficulty: 'easy' },
                    { count: 4, xpReward: 160, difficulty: 'medium' },
                    { count: 6, xpReward: 210, difficulty: 'hard' }
                ],
                trackingKey: 'inferencesCorrect'
            },
            
            // Listening Quests
            {
                id: 'keen_listener',
                category: 'listening',
                title: 'Keen Listener',
                description: 'Complete {count} listening exercises',
                icon: '👂',
                requirements: [
                    { count: 3, xpReward: 90, difficulty: 'easy' },
                    { count: 5, xpReward: 135, difficulty: 'medium' },
                    { count: 8, xpReward: 180, difficulty: 'hard' }
                ],
                trackingKey: 'listeningCompleted'
            },
            {
                id: 'accent_master',
                category: 'listening',
                title: 'Accent Master',
                description: 'Identify {count} different accents correctly',
                icon: '🌍',
                requirements: [
                    { count: 2, xpReward: 100, difficulty: 'easy' },
                    { count: 3, xpReward: 145, difficulty: 'medium' },
                    { count: 5, xpReward: 190, difficulty: 'hard' }
                ],
                trackingKey: 'accentsIdentified'
            },
            
            // Writing Quests
            {
                id: 'creative_writer',
                category: 'writing',
                title: 'Creative Writer',
                description: 'Complete {count} creative writing exercises',
                icon: '✍️',
                requirements: [
                    { count: 2, xpReward: 120, difficulty: 'easy' },
                    { count: 3, xpReward: 170, difficulty: 'medium' },
                    { count: 5, xpReward: 220, difficulty: 'hard' }
                ],
                trackingKey: 'creativeWritingCompleted'
            },
            {
                id: 'essay_expert',
                category: 'writing',
                title: 'Essay Expert',
                description: 'Write {count} well-structured essays',
                icon: '📄',
                requirements: [
                    { count: 1, xpReward: 150, difficulty: 'easy' },
                    { count: 2, xpReward: 200, difficulty: 'medium' },
                    { count: 3, xpReward: 250, difficulty: 'hard' }
                ],
                trackingKey: 'essaysCompleted'
            },
            
            // General Learning Quests
            {
                id: 'story_explorer',
                category: 'general',
                title: 'Story Explorer',
                description: 'Complete {count} stories today',
                icon: '🗺️',
                requirements: [
                    { count: 2, xpReward: 100, difficulty: 'easy' },
                    { count: 3, xpReward: 150, difficulty: 'medium' },
                    { count: 5, xpReward: 200, difficulty: 'hard' }
                ],
                trackingKey: 'storiesCompletedToday'
            },
            {
                id: 'challenge_crusher',
                category: 'general',
                title: 'Challenge Crusher',
                description: 'Complete {count} challenges without mistakes',
                icon: '💪',
                requirements: [
                    { count: 5, xpReward: 130, difficulty: 'easy' },
                    { count: 8, xpReward: 180, difficulty: 'medium' },
                    { count: 12, xpReward: 230, difficulty: 'hard' }
                ],
                trackingKey: 'perfectChallengesCompleted'
            },
            {
                id: 'xp_hunter',
                category: 'general',
                title: 'XP Hunter',
                description: 'Earn {count} XP today',
                icon: '⭐',
                requirements: [
                    { count: 300, xpReward: 100, difficulty: 'easy' },
                    { count: 500, xpReward: 150, difficulty: 'medium' },
                    { count: 800, xpReward: 200, difficulty: 'hard' }
                ],
                trackingKey: 'xpEarnedToday'
            },
            {
                id: 'streak_keeper',
                category: 'general',
                title: 'Streak Keeper',
                description: 'Maintain your learning streak',
                icon: '🔥',
                requirements: [
                    { count: 1, xpReward: 80, difficulty: 'easy' }
                ],
                trackingKey: 'streakMaintained'
            },
            
            // Special/Seasonal Quests
            {
                id: 'weekend_warrior',
                category: 'special',
                title: 'Weekend Warrior',
                description: 'Complete extra challenges on weekends',
                icon: '🎮',
                requirements: [
                    { count: 5, xpReward: 150, difficulty: 'medium' },
                    { count: 8, xpReward: 200, difficulty: 'hard' }
                ],
                trackingKey: 'weekendChallengesCompleted',
                weekendOnly: true
            },
            {
                id: 'early_bird',
                category: 'special',
                title: 'Early Bird',
                description: 'Complete learning before 9 AM',
                icon: '🐦',
                requirements: [
                    { count: 1, xpReward: 120, difficulty: 'medium' }
                ],
                trackingKey: 'earlyMorningCompleted',
                timeRestricted: { start: 5, end: 9 }
            },
            {
                id: 'night_scholar',
                category: 'special',
                title: 'Night Scholar',
                description: 'Study during evening hours',
                icon: '🌙',
                requirements: [
                    { count: 1, xpReward: 100, difficulty: 'medium' }
                ],
                trackingKey: 'eveningStudyCompleted',
                timeRestricted: { start: 19, end: 23 }
            }
        ];
    }
    
    static loadOrGenerateDailyQuests() {
        // Try to load existing quests for today
        this.currentQuests = StorageManager.loadDailyQuests();
        
        if (!this.currentQuests || this.currentQuests.length === 0) {
            // Generate new daily quests
            this.currentQuests = this.generateDailyQuests();
            StorageManager.saveDailyQuests(this.currentQuests);
        }
        
        return this.currentQuests;
    }
    
    static generateDailyQuests() {
        const quests = [];
        const today = new Date();
        const isWeekend = today.getDay() === 0 || today.getDay() === 6;
        const currentHour = today.getHours();
        
        // Determine difficulty distribution based on user progress
        const userProgress = StorageManager.loadUserProgress();
        const avgSkillLevel = Object.values(userProgress.skillLevels).reduce((a, b) => a + b, 0) / 5;
        
        let difficulties;
        if (avgSkillLevel < 3) {
            difficulties = ['easy', 'easy', 'medium']; // Beginner
        } else if (avgSkillLevel < 7) {
            difficulties = ['easy', 'medium', 'medium']; // Intermediate
        } else if (avgSkillLevel < 12) {
            difficulties = ['medium', 'medium', 'hard']; // Advanced
        } else {
            difficulties = ['medium', 'hard', 'hard']; // Expert
        }
        
        // Select quest templates
        const availableTemplates = this.questTemplates.filter(template => {
            // Filter by weekend restriction
            if (template.weekendOnly && !isWeekend) return false;
            
            // Filter by time restriction
            if (template.timeRestricted) {
                const { start, end } = template.timeRestricted;
                if (currentHour < start || currentHour > end) return false;
            }
            
            return true;
        });
        
        // Ensure we have at least one quest from each major category
        const categories = ['vocabulary', 'grammar', 'reading', 'general'];
        const selectedTemplates = new Set();
        
        // Pick one quest from each category first
        for (const category of categories) {
            const categoryTemplates = availableTemplates.filter(t => 
                t.category === category && !selectedTemplates.has(t.id)
            );
            
            if (categoryTemplates.length > 0) {
                const template = this.getRandomElement(categoryTemplates);
                selectedTemplates.add(template.id);
                
                const difficulty = difficulties.shift() || 'medium';
                const quest = this.createQuestFromTemplate(template, difficulty);
                if (quest) quests.push(quest);
            }
        }
        
        // Fill remaining slots with random quests
        while (quests.length < 3 && difficulties.length > 0) {
            const remainingTemplates = availableTemplates.filter(t => !selectedTemplates.has(t.id));
            if (remainingTemplates.length === 0) break;
            
            const template = this.getRandomElement(remainingTemplates);
            selectedTemplates.add(template.id);
            
            const difficulty = difficulties.shift();
            const quest = this.createQuestFromTemplate(template, difficulty);
            if (quest) quests.push(quest);
        }
        
        // Add special quests based on conditions
        if (isWeekend && quests.length < 4) {
            const weekendQuest = this.createSpecialWeekendQuest();
            if (weekendQuest) quests.push(weekendQuest);
        }
        
        // Add streak maintenance quest if user has a streak
        if (userProgress.streak > 0 && !quests.some(q => q.trackingKey === 'streakMaintained')) {
            const streakQuest = this.createStreakQuest();
            if (streakQuest) quests.push(streakQuest);
        }
        
        return quests;
    }
    
    static createQuestFromTemplate(template, difficulty) {
        const requirements = template.requirements.filter(req => req.difficulty === difficulty);
        if (requirements.length === 0) return null;
        
        const requirement = this.getRandomElement(requirements);
        
        return {
            id: `${template.id}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            templateId: template.id,
            title: template.title,
            description: template.description.replace('{count}', requirement.count),
            icon: template.icon,
            category: template.category,
            difficulty: difficulty,
            requirement: requirement.count,
            xpReward: requirement.xpReward,
            progress: 0,
            completed: false,
            trackingKey: template.trackingKey,
            createdAt: Date.now(),
            expiresAt: this.getEndOfDay()
        };
    }
    
    static createSpecialWeekendQuest() {
        return {
            id: `weekend_special_${Date.now()}`,
            templateId: 'weekend_special',
            title: 'Weekend Challenge',
            description: 'Complete 3 different types of challenges',
            icon: '🎊',
            category: 'special',
            difficulty: 'medium',
            requirement: 3,
            xpReward: 200,
            progress: 0,
            completed: false,
            trackingKey: 'weekendSpecialCompleted',
            createdAt: Date.now(),
            expiresAt: this.getEndOfDay()
        };
    }
    
    static createStreakQuest() {
        return {
            id: `streak_${Date.now()}`,
            templateId: 'streak_keeper',
            title: 'Streak Keeper',
            description: 'Maintain your learning streak',
            icon: '🔥',
            category: 'general',
            difficulty: 'easy',
            requirement: 1,
            xpReward: 80,
            progress: 0,
            completed: false,
            trackingKey: 'streakMaintained',
            createdAt: Date.now(),
            expiresAt: this.getEndOfDay()
        };
    }
    
    static updateQuestProgress(trackingKey, increment = 1) {
        let progressMade = false;
        
        for (const quest of this.currentQuests) {
            if (quest.trackingKey === trackingKey && !quest.completed) {
                quest.progress = Math.min(quest.progress + increment, quest.requirement);
                
                if (quest.progress >= quest.requirement) {
                    quest.completed = true;
                    this.completeQuest(quest);
                }
                
                progressMade = true;
            }
        }
        
        if (progressMade) {
            StorageManager.saveDailyQuests(this.currentQuests);
        }
        
        return progressMade;
    }
    
    static completeQuest(quest) {
        console.log(`Daily quest completed: ${quest.title}`);
        
        // Award XP and other rewards
        if (window.gameManager) {
            window.gameManager.addXP(quest.xpReward);
            
            // Show completion notification
            this.showQuestCompletionNotification(quest);
            
            // Play completion sound
            if (SoundManager) {
                SoundManager.playNotification();
            }
            
            // Haptic feedback
            if (HapticManager) {
                HapticManager.questCompletedFeedback();
            }
        }
        
        quest.completedAt = Date.now();
    }
    
    static showQuestCompletionNotification(quest) {
        if (typeof showNotification === 'function') {
            showNotification(
                `Quest Complete! "${quest.title}" (+${quest.xpReward} XP)`,
                'success'
            );
        }
    }
    
    static getCurrentQuests() {
        return this.currentQuests.filter(quest => !this.isExpired(quest));
    }
    
    static getCompletedQuests() {
        return this.currentQuests.filter(quest => quest.completed);
    }
    
    static getActiveQuests() {
        return this.currentQuests.filter(quest => !quest.completed && !this.isExpired(quest));
    }
    
    static isExpired(quest) {
        return Date.now() > quest.expiresAt;
    }
    
    static getQuestProgress(questId) {
        const quest = this.currentQuests.find(q => q.id === questId);
        if (!quest) return null;
        
        return {
            current: quest.progress,
            target: quest.requirement,
            percentage: Math.round((quest.progress / quest.requirement) * 100)
        };
    }
    
    static getAllTimeStats() {
        const stats = StorageManager.loadStatistics();
        return {
            totalQuestsCompleted: stats.totalQuestsCompleted || 0,
            totalQuestXP: stats.totalQuestXP || 0,
            questCompletionStreak: stats.questCompletionStreak || 0,
            favoriteQuestCategory: stats.favoriteQuestCategory || 'general'
        };
    }
    
    static getEndOfDay() {
        const now = new Date();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
        return endOfDay.getTime();
    }
    
    static getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    static resetDailyQuests() {
        this.currentQuests = [];
        StorageManager.clearDailyQuests();
        this.loadOrGenerateDailyQuests();
    }
    
    static formatQuestList() {
        const quests = this.getCurrentQuests();
        
        if (quests.length === 0) {
            return '<div class="no-quests">No quests available today. Check back tomorrow!</div>';
        }
        
        return quests.map(quest => {
            const progressPercentage = Math.round((quest.progress / quest.requirement) * 100);
            const completedClass = quest.completed ? 'completed' : '';
            const difficultyClass = quest.difficulty;
            
            return `
                <div class="quest-item ${completedClass} ${difficultyClass}">
                    <div class="quest-icon">${quest.icon}</div>
                    <div class="quest-content">
                        <h4 class="quest-title">${quest.title}</h4>
                        <p class="quest-description">${quest.description}</p>
                        <div class="quest-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                            </div>
                            <span class="progress-text">${quest.progress}/${quest.requirement}</span>
                        </div>
                    </div>
                    <div class="quest-reward">
                        <span class="xp-reward">+${quest.xpReward} XP</span>
                        ${quest.completed ? '<i class="fas fa-check quest-check"></i>' : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Initialize daily quests when the page loads
document.addEventListener('DOMContentLoaded', () => {
    DailyQuestGenerator.init();
});

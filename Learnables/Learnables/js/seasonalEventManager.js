// Seasonal Event Manager - Manages seasonal content and special events
class SeasonalEventManager {
    static currentEvent = null;
    static events = [];
    
    static init() {
        this.loadSeasonalEvents();
        this.checkCurrentEvent();
    }
    
    static loadSeasonalEvents() {
        this.events = [
            // New Year Event
            {
                id: 'new_year_resolution',
                name: 'New Year Resolution',
                description: 'Start the year strong with enhanced learning rewards!',
                icon: '🎊',
                startDate: new Date(new Date().getFullYear(), 0, 1), // January 1st
                endDate: new Date(new Date().getFullYear(), 0, 31), // January 31st
                bonuses: {
                    xpMultiplier: 1.5,
                    questXpBonus: 50,
                    newWordsBonus: 2
                },
                specialQuests: [
                    {
                        title: 'Resolution Champion',
                        description: 'Complete 10 stories in January',
                        requirement: 10,
                        xpReward: 500,
                        trackingKey: 'newYearStories'
                    }
                ],
                theme: {
                    primaryColor: '#FFD700',
                    secondaryColor: '#FFA500',
                    backgroundImage: 'fireworks.gif'
                }
            },
            
            // Valentine's Day Event
            {
                id: 'love_language',
                name: 'Love Language',
                description: 'Fall in love with learning! Romance-themed challenges await.',
                icon: '💕',
                startDate: new Date(new Date().getFullYear(), 1, 10), // February 10th
                endDate: new Date(new Date().getFullYear(), 1, 18), // February 18th
                bonuses: {
                    xpMultiplier: 1.3,
                    vocabularyBonus: 3,
                    writingBonus: 2
                },
                specialQuests: [
                    {
                        title: 'Love Letter Writer',
                        description: 'Complete 5 writing challenges',
                        requirement: 5,
                        xpReward: 300,
                        trackingKey: 'valentineWriting'
                    },
                    {
                        title: 'Romantic Vocabulary',
                        description: 'Learn 20 romance-related words',
                        requirement: 20,
                        xpReward: 250,
                        trackingKey: 'romanticWords'
                    }
                ],
                theme: {
                    primaryColor: '#FF69B4',
                    secondaryColor: '#FFB6C1',
                    backgroundImage: 'hearts.gif'
                }
            },
            
            // Spring Event
            {
                id: 'spring_awakening',
                name: 'Spring Awakening',
                description: 'Bloom with knowledge as nature awakens!',
                icon: '🌸',
                startDate: new Date(new Date().getFullYear(), 2, 20), // March 20th
                endDate: new Date(new Date().getFullYear(), 4, 20), // May 20th
                bonuses: {
                    xpMultiplier: 1.2,
                    readingBonus: 2,
                    natureVocabBonus: 3
                },
                specialQuests: [
                    {
                        title: 'Nature Scholar',
                        description: 'Learn 30 nature-related words',
                        requirement: 30,
                        xpReward: 400,
                        trackingKey: 'natureWords'
                    },
                    {
                        title: 'Spring Reader',
                        description: 'Complete 15 reading comprehension challenges',
                        requirement: 15,
                        xpReward: 350,
                        trackingKey: 'springReading'
                    }
                ],
                theme: {
                    primaryColor: '#98FB98',
                    secondaryColor: '#90EE90',
                    backgroundImage: 'spring-flowers.gif'
                }
            },
            
            // Summer Event
            {
                id: 'summer_intensive',
                name: 'Summer Learning Intensive',
                description: 'Make this summer count with intensive learning challenges!',
                icon: '☀️',
                startDate: new Date(new Date().getFullYear(), 5, 21), // June 21st
                endDate: new Date(new Date().getFullYear(), 7, 31), // August 31st
                bonuses: {
                    xpMultiplier: 1.4,
                    dailyQuestBonus: 100,
                    streakBonus: 2
                },
                specialQuests: [
                    {
                        title: 'Summer Scholar',
                        description: 'Maintain a 30-day learning streak',
                        requirement: 30,
                        xpReward: 1000,
                        trackingKey: 'summerStreak'
                    },
                    {
                        title: 'Vacation Vocabulary',
                        description: 'Learn 50 travel and summer words',
                        requirement: 50,
                        xpReward: 600,
                        trackingKey: 'summerWords'
                    }
                ],
                theme: {
                    primaryColor: '#FFD700',
                    secondaryColor: '#FFA500',
                    backgroundImage: 'summer-sun.gif'
                }
            },
            
            // Halloween Event
            {
                id: 'spooky_stories',
                name: 'Spooky Stories',
                description: 'Learn with spine-chilling stories and mysterious challenges!',
                icon: '🎃',
                startDate: new Date(new Date().getFullYear(), 9, 25), // October 25th
                endDate: new Date(new Date().getFullYear(), 10, 2), // November 2nd
                bonuses: {
                    xpMultiplier: 1.6,
                    storyBonus: 3,
                    mysteryWordsBonus: 4
                },
                specialQuests: [
                    {
                        title: 'Ghost Story Master',
                        description: 'Complete 13 spooky stories',
                        requirement: 13,
                        xpReward: 666,
                        trackingKey: 'spookyStories'
                    },
                    {
                        title: 'Mysterious Vocabulary',
                        description: 'Learn 31 mystery and horror words',
                        requirement: 31,
                        xpReward: 500,
                        trackingKey: 'mysteryWords'
                    }
                ],
                theme: {
                    primaryColor: '#FF4500',
                    secondaryColor: '#800080',
                    backgroundImage: 'halloween-bats.gif'
                }
            },
            
            // Winter/Christmas Event
            {
                id: 'winter_wonderland',
                name: 'Winter Wonderland',
                description: 'Warm up your brain during the cold winter months!',
                icon: '❄️',
                startDate: new Date(new Date().getFullYear(), 11, 15), // December 15th
                endDate: new Date(new Date().getFullYear() + 1, 0, 5), // January 5th next year
                bonuses: {
                    xpMultiplier: 2.0,
                    giftBonus: 5,
                    holidayWordsBonus: 3
                },
                specialQuests: [
                    {
                        title: 'Holiday Spirit',
                        description: 'Learn 25 holiday-themed words',
                        requirement: 25,
                        xpReward: 400,
                        trackingKey: 'holidayWords'
                    },
                    {
                        title: 'Winter Wisdom',
                        description: 'Complete 20 challenges during the event',
                        requirement: 20,
                        xpReward: 800,
                        trackingKey: 'winterChallenges'
                    },
                    {
                        title: 'Gift of Knowledge',
                        description: 'Play every day during the event',
                        requirement: 21,
                        xpReward: 1000,
                        trackingKey: 'holidayStreak'
                    }
                ],
                theme: {
                    primaryColor: '#4169E1',
                    secondaryColor: '#87CEEB',
                    backgroundImage: 'winter-snow.gif'
                }
            },
            
            // Back to School Event
            {
                id: 'back_to_school',
                name: 'Back to School',
                description: 'Gear up for learning with academic challenges!',
                icon: '📚',
                startDate: new Date(new Date().getFullYear(), 7, 15), // August 15th
                endDate: new Date(new Date().getFullYear(), 8, 30), // September 30th
                bonuses: {
                    xpMultiplier: 1.5,
                    academicBonus: 4,
                    studyStreakBonus: 2
                },
                specialQuests: [
                    {
                        title: 'Academic Excellence',
                        description: 'Perfect 25 grammar challenges',
                        requirement: 25,
                        xpReward: 500,
                        trackingKey: 'academicGrammar'
                    },
                    {
                        title: 'Scholarly Vocabulary',
                        description: 'Learn 40 academic words',
                        requirement: 40,
                        xpReward: 600,
                        trackingKey: 'academicWords'
                    }
                ],
                theme: {
                    primaryColor: '#228B22',
                    secondaryColor: '#32CD32',
                    backgroundImage: 'school-books.gif'
                }
            }
        ];
    }
    
    static checkCurrentEvent() {
        const now = new Date();
        const currentEvents = this.events.filter(event => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            
            // Handle events that span across years
            if (end < start) {
                return now >= start || now <= end;
            }
            
            return now >= start && now <= end;
        });
        
        // Set the first active event as current
        this.currentEvent = currentEvents.length > 0 ? currentEvents[0] : null;
        
        if (this.currentEvent) {
            console.log(`Active seasonal event: ${this.currentEvent.name}`);
            this.applyEventTheme();
        }
    }
    
    static getCurrentEvent() {
        return this.currentEvent;
    }
    
    static isEventActive(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return false;
        
        const now = new Date();
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        
        if (end < start) {
            return now >= start || now <= end;
        }
        
        return now >= start && now <= end;
    }
    
    static getEventBonus(bonusType) {
        if (!this.currentEvent || !this.currentEvent.bonuses) return 1;
        return this.currentEvent.bonuses[bonusType] || 1;
    }
    
    static applyXPBonus(baseXP) {
        const multiplier = this.getEventBonus('xpMultiplier');
        return Math.floor(baseXP * multiplier);
    }
    
    static getSpecialQuests() {
        if (!this.currentEvent || !this.currentEvent.specialQuests) return [];
        return this.currentEvent.specialQuests;
    }
    
    static updateEventQuestProgress(trackingKey, increment = 1) {
        if (!this.currentEvent) return false;
        
        const quest = this.currentEvent.specialQuests.find(q => q.trackingKey === trackingKey);
        if (!quest) return false;
        
        if (!quest.progress) quest.progress = 0;
        if (!quest.completed) quest.completed = false;
        
        quest.progress = Math.min(quest.progress + increment, quest.requirement);
        
        if (quest.progress >= quest.requirement && !quest.completed) {
            quest.completed = true;
            this.completeEventQuest(quest);
        }
        
        return true;
    }
    
    static completeEventQuest(quest) {
        console.log(`Seasonal quest completed: ${quest.title}`);
        
        // Award XP
        if (window.gameManager) {
            window.gameManager.addXP(quest.xpReward);
            
            // Show completion notification
            this.showEventQuestNotification(quest);
            
            // Play special event sound
            if (SoundManager) {
                SoundManager.playAchievement();
            }
            
            // Special haptic feedback
            if (HapticManager) {
                HapticManager.eventQuestFeedback();
            }
        }
    }
    
    static showEventQuestNotification(quest) {
        if (typeof showNotification === 'function') {
            showNotification(
                `🎉 Seasonal Quest Complete! "${quest.title}" (+${quest.xpReward} XP)`,
                'success'
            );
        }
    }
    
    static applyEventTheme() {
        if (!this.currentEvent || !this.currentEvent.theme) return;
        
        const theme = this.currentEvent.theme;
        const root = document.documentElement;
        
        // Apply CSS custom properties for theming
        if (theme.primaryColor) {
            root.style.setProperty('--event-primary-color', theme.primaryColor);
        }
        if (theme.secondaryColor) {
            root.style.setProperty('--event-secondary-color', theme.secondaryColor);
        }
        
        // Add event class to body for specific styling
        document.body.classList.add(`event-${this.currentEvent.id}`);
        
        // Apply background if specified
        if (theme.backgroundImage) {
            const backgroundElement = document.getElementById('weather-effects');
            if (backgroundElement) {
                backgroundElement.classList.add('seasonal-event-bg');
                backgroundElement.style.backgroundImage = `url('assets/events/${theme.backgroundImage}')`;
            }
        }
    }
    
    static removeEventTheme() {
        const root = document.documentElement;
        root.style.removeProperty('--event-primary-color');
        root.style.removeProperty('--event-secondary-color');
        
        // Remove all event classes
        this.events.forEach(event => {
            document.body.classList.remove(`event-${event.id}`);
        });
        
        // Reset background
        const backgroundElement = document.getElementById('weather-effects');
        if (backgroundElement) {
            backgroundElement.classList.remove('seasonal-event-bg');
            backgroundElement.style.backgroundImage = '';
        }
    }
    
    static getEventProgress(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return null;
        
        const now = new Date();
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        const total = end.getTime() - start.getTime();
        const elapsed = now.getTime() - start.getTime();
        
        return {
            percentage: Math.max(0, Math.min(100, (elapsed / total) * 100)),
            daysRemaining: Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        };
    }
    
    static formatEventDisplay() {
        if (!this.currentEvent) {
            return '<div class="no-event">No seasonal events active right now.</div>';
        }
        
        const event = this.currentEvent;
        const progress = this.getEventProgress(event.id);
        
        let questsHtml = '';
        if (event.specialQuests && event.specialQuests.length > 0) {
            questsHtml = event.specialQuests.map(quest => {
                const questProgress = quest.progress || 0;
                const progressPercentage = Math.round((questProgress / quest.requirement) * 100);
                const completedClass = quest.completed ? 'completed' : '';
                
                return `
                    <div class="event-quest ${completedClass}">
                        <h5>${quest.title}</h5>
                        <p>${quest.description}</p>
                        <div class="quest-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                            </div>
                            <span>${questProgress}/${quest.requirement}</span>
                        </div>
                        <div class="quest-reward">+${quest.xpReward} XP</div>
                    </div>
                `;
            }).join('');
        }
        
        let bonusesHtml = '';
        if (event.bonuses) {
            const bonuses = Object.entries(event.bonuses).map(([key, value]) => {
                const bonusName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return `<li>${bonusName}: ${typeof value === 'number' ? `${value}x` : value}</li>`;
            }).join('');
            bonusesHtml = `<ul class="event-bonuses">${bonuses}</ul>`;
        }
        
        return `
            <div class="seasonal-event-display" data-event="${event.id}">
                <div class="event-header">
                    <span class="event-icon">${event.icon}</span>
                    <div class="event-info">
                        <h3>${event.name}</h3>
                        <p>${event.description}</p>
                    </div>
                </div>
                
                <div class="event-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                    </div>
                    <span class="days-remaining">${progress.daysRemaining} days remaining</span>
                </div>
                
                ${bonusesHtml ? `
                    <div class="event-bonuses-section">
                        <h4>Active Bonuses</h4>
                        ${bonusesHtml}
                    </div>
                ` : ''}
                
                ${questsHtml ? `
                    <div class="event-quests-section">
                        <h4>Special Quests</h4>
                        ${questsHtml}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    static getUpcomingEvents(limit = 3) {
        const now = new Date();
        return this.events
            .filter(event => new Date(event.startDate) > now)
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .slice(0, limit);
    }
    
    static getPastEvents(limit = 5) {
        const now = new Date();
        return this.events
            .filter(event => new Date(event.endDate) < now)
            .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
            .slice(0, limit);
    }
    
    static getAllEventStats() {
        const stats = {
            totalEventsParticipated: 0,
            totalEventXP: 0,
            completedEventQuests: 0,
            favoriteEventType: null
        };
        
        // This would be loaded from persistent storage in a real implementation
        return stats;
    }
}

// Initialize seasonal events when the page loads
document.addEventListener('DOMContentLoaded', () => {
    SeasonalEventManager.init();
    
    // Check for events every hour
    setInterval(() => {
        SeasonalEventManager.checkCurrentEvent();
    }, 3600000); // 1 hour
});

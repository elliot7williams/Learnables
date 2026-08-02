// Storage Manager - Handles all persistent data operations
class StorageManager {
    static VERSION = "1.0.0";
    static STORAGE_KEYS = {
        USER_PROGRESS: 'learnables_user_progress',
        SETTINGS: 'learnables_settings',
        ACHIEVEMENTS: 'learnables_achievements',
        DAILY_QUESTS: 'learnables_daily_quests',
        WEEKLY_CHALLENGE: 'learnables_weekly_challenge',
        INVENTORY: 'learnables_inventory',
        COMPANIONS: 'learnables_companions',
        STATISTICS: 'learnables_statistics',
        GAME_VERSION: 'learnables_version'
    };
    
    static isLocalStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    static saveUserProgress(progress) {
        try {
            const data = {
                ...progress,
                completedStories: Array.from(progress.completedStories || []),
                unlocked: Array.from(progress.unlocked || []),
                lastSaved: Date.now(),
                version: this.VERSION
            };
            
            const serialized = JSON.stringify(data);
            if (this.isLocalStorageAvailable()) {
                localStorage.setItem(this.STORAGE_KEYS.USER_PROGRESS, serialized);
            } else {
                // Fallback to cookie storage
                this.setCookie(this.STORAGE_KEYS.USER_PROGRESS, serialized, 365);
            }
            
            console.log('User progress saved successfully');
            return true;
        } catch (error) {
            console.error('Failed to save user progress:', error);
            return false;
        }
    }
    
    static loadUserProgress() {
        try {
            let data = null;
            
            if (this.isLocalStorageAvailable()) {
                data = localStorage.getItem(this.STORAGE_KEYS.USER_PROGRESS);
            } else {
                data = this.getCookie(this.STORAGE_KEYS.USER_PROGRESS);
            }
            
            if (!data) {
                console.log('No saved progress found, returning defaults');
                return this.getDefaultUserProgress();
            }
            
            const parsed = JSON.parse(data);
            
            // Convert arrays back to Sets
            if (parsed.completedStories) {
                parsed.completedStories = new Set(parsed.completedStories);
            }
            if (parsed.unlocked) {
                parsed.unlocked = new Set(parsed.unlocked);
            }
            
            // Migrate old data if necessary
            const migrated = this.migrateUserProgress(parsed);
            
            console.log('User progress loaded successfully');
            return migrated;
        } catch (error) {
            console.error('Failed to load user progress:', error);
            return this.getDefaultUserProgress();
        }
    }
    
    static getDefaultUserProgress() {
        return {
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
            unlocked: new Set(['starting_village']),
            totalPlayTime: 0,
            gamesPlayed: 0,
            perfectRuns: 0,
            version: this.VERSION
        };
    }
    
    static migrateUserProgress(data) {
        // Check version and migrate if necessary
        if (!data.version || data.version !== this.VERSION) {
            console.log('Migrating user progress from version', data.version, 'to', this.VERSION);
            
            // Add new fields with defaults
            data.totalPlayTime = data.totalPlayTime || 0;
            data.gamesPlayed = data.gamesPlayed || 0;
            data.perfectRuns = data.perfectRuns || 0;
            
            // Ensure all skill levels exist
            const defaultSkills = ['vocabulary', 'grammar', 'reading', 'listening', 'writing'];
            defaultSkills.forEach(skill => {
                if (!data.skillLevels[skill]) {
                    data.skillLevels[skill] = 1;
                }
            });
            
            data.version = this.VERSION;
        }
        
        return data;
    }
    
    static saveSettings(settings) {
        try {
            const data = {
                ...settings,
                lastUpdated: Date.now()
            };
            
            const serialized = JSON.stringify(data);
            if (this.isLocalStorageAvailable()) {
                localStorage.setItem(this.STORAGE_KEYS.SETTINGS, serialized);
            } else {
                this.setCookie(this.STORAGE_KEYS.SETTINGS, serialized, 365);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    }
    
    static loadSettings() {
        try {
            let data = null;
            
            if (this.isLocalStorageAvailable()) {
                data = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
            } else {
                data = this.getCookie(this.STORAGE_KEYS.SETTINGS);
            }
            
            if (!data) {
                return this.getDefaultSettings();
            }
            
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to load settings:', error);
            return this.getDefaultSettings();
        }
    }
    
    static getDefaultSettings() {
        return {
            audioEnabled: true,
            hapticEnabled: true,
            darkMode: false,
            difficultyMode: 'normal',
            soundVolume: 0.8,
            musicVolume: 0.6,
            animationsEnabled: true,
            autoSave: true,
            notificationsEnabled: true
        };
    }
    
    static saveAchievements(achievements) {
        try {
            const data = {
                achievements: achievements,
                lastUpdated: Date.now()
            };
            
            const serialized = JSON.stringify(data);
            if (this.isLocalStorageAvailable()) {
                localStorage.setItem(this.STORAGE_KEYS.ACHIEVEMENTS, serialized);
            } else {
                this.setCookie(this.STORAGE_KEYS.ACHIEVEMENTS, serialized, 365);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to save achievements:', error);
            return false;
        }
    }
    
    static loadAchievements() {
        try {
            let data = null;
            
            if (this.isLocalStorageAvailable()) {
                data = localStorage.getItem(this.STORAGE_KEYS.ACHIEVEMENTS);
            } else {
                data = this.getCookie(this.STORAGE_KEYS.ACHIEVEMENTS);
            }
            
            if (!data) {
                return [];
            }
            
            const parsed = JSON.parse(data);
            return parsed.achievements || [];
        } catch (error) {
            console.error('Failed to load achievements:', error);
            return [];
        }
    }
    
    static saveDailyQuests(quests) {
        try {
            const data = {
                quests: quests,
                date: new Date().toDateString(),
                lastUpdated: Date.now()
            };
            
            const serialized = JSON.stringify(data);
            if (this.isLocalStorageAvailable()) {
                localStorage.setItem(this.STORAGE_KEYS.DAILY_QUESTS, serialized);
            } else {
                this.setCookie(this.STORAGE_KEYS.DAILY_QUESTS, serialized, 1);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to save daily quests:', error);
            return false;
        }
    }
    
    static loadDailyQuests() {
        try {
            let data = null;
            
            if (this.isLocalStorageAvailable()) {
                data = localStorage.getItem(this.STORAGE_KEYS.DAILY_QUESTS);
            } else {
                data = this.getCookie(this.STORAGE_KEYS.DAILY_QUESTS);
            }
            
            if (!data) {
                return null;
            }
            
            const parsed = JSON.parse(data);
            const today = new Date().toDateString();
            
            // Check if quests are from today
            if (parsed.date === today) {
                return parsed.quests;
            } else {
                // Clear old daily quests
                this.clearDailyQuests();
                return null;
            }
        } catch (error) {
            console.error('Failed to load daily quests:', error);
            return null;
        }
    }
    
    static clearDailyQuests() {
        try {
            if (this.isLocalStorageAvailable()) {
                localStorage.removeItem(this.STORAGE_KEYS.DAILY_QUESTS);
            } else {
                this.deleteCookie(this.STORAGE_KEYS.DAILY_QUESTS);
            }
        } catch (error) {
            console.error('Failed to clear daily quests:', error);
        }
    }
    
    static saveWeeklyChallenge(challenge) {
        try {
            const data = {
                challenge: challenge,
                weekStart: this.getWeekStart(),
                lastUpdated: Date.now()
            };
            
            const serialized = JSON.stringify(data);
            if (this.isLocalStorageAvailable()) {
                localStorage.setItem(this.STORAGE_KEYS.WEEKLY_CHALLENGE, serialized);
            } else {
                this.setCookie(this.STORAGE_KEYS.WEEKLY_CHALLENGE, serialized, 7);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to save weekly challenge:', error);
            return false;
        }
    }
    
    static loadWeeklyChallenge() {
        try {
            let data = null;
            
            if (this.isLocalStorageAvailable()) {
                data = localStorage.getItem(this.STORAGE_KEYS.WEEKLY_CHALLENGE);
            } else {
                data = this.getCookie(this.STORAGE_KEYS.WEEKLY_CHALLENGE);
            }
            
            if (!data) {
                return null;
            }
            
            const parsed = JSON.parse(data);
            const currentWeekStart = this.getWeekStart();
            
            // Check if challenge is from this week
            if (parsed.weekStart === currentWeekStart) {
                return parsed.challenge;
            } else {
                // Clear old weekly challenge
                this.clearWeeklyChallenge();
                return null;
            }
        } catch (error) {
            console.error('Failed to load weekly challenge:', error);
            return null;
        }
    }
    
    static clearWeeklyChallenge() {
        try {
            if (this.isLocalStorageAvailable()) {
                localStorage.removeItem(this.STORAGE_KEYS.WEEKLY_CHALLENGE);
            } else {
                this.deleteCookie(this.STORAGE_KEYS.WEEKLY_CHALLENGE);
            }
        } catch (error) {
            console.error('Failed to clear weekly challenge:', error);
        }
    }
    
    static saveInventory(inventory) {
        try {
            const data = {
                inventory: inventory,
                lastUpdated: Date.now()
            };
            
            const serialized = JSON.stringify(data);
            if (this.isLocalStorageAvailable()) {
                localStorage.setItem(this.STORAGE_KEYS.INVENTORY, serialized);
            } else {
                this.setCookie(this.STORAGE_KEYS.INVENTORY, serialized, 365);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to save inventory:', error);
            return false;
        }
    }
    
    static loadInventory() {
        try {
            let data = null;
            
            if (this.isLocalStorageAvailable()) {
                data = localStorage.getItem(this.STORAGE_KEYS.INVENTORY);
            } else {
                data = this.getCookie(this.STORAGE_KEYS.INVENTORY);
            }
            
            if (!data) {
                return [];
            }
            
            const parsed = JSON.parse(data);
            return parsed.inventory || [];
        } catch (error) {
            console.error('Failed to load inventory:', error);
            return [];
        }
    }
    
    static saveCompanions(companions) {
        try {
            const data = {
                companions: companions,
                lastUpdated: Date.now()
            };
            
            const serialized = JSON.stringify(data);
            if (this.isLocalStorageAvailable()) {
                localStorage.setItem(this.STORAGE_KEYS.COMPANIONS, serialized);
            } else {
                this.setCookie(this.STORAGE_KEYS.COMPANIONS, serialized, 365);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to save companions:', error);
            return false;
        }
    }
    
    static loadCompanions() {
        try {
            let data = null;
            
            if (this.isLocalStorageAvailable()) {
                data = localStorage.getItem(this.STORAGE_KEYS.COMPANIONS);
            } else {
                data = this.getCookie(this.STORAGE_KEYS.COMPANIONS);
            }
            
            if (!data) {
                return [];
            }
            
            const parsed = JSON.parse(data);
            return parsed.companions || [];
        } catch (error) {
            console.error('Failed to load companions:', error);
            return [];
        }
    }
    
    static saveStatistics(stats) {
        try {
            const data = {
                ...stats,
                lastUpdated: Date.now()
            };
            
            const serialized = JSON.stringify(data);
            if (this.isLocalStorageAvailable()) {
                localStorage.setItem(this.STORAGE_KEYS.STATISTICS, serialized);
            } else {
                this.setCookie(this.STORAGE_KEYS.STATISTICS, serialized, 365);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to save statistics:', error);
            return false;
        }
    }
    
    static loadStatistics() {
        try {
            let data = null;
            
            if (this.isLocalStorageAvailable()) {
                data = localStorage.getItem(this.STORAGE_KEYS.STATISTICS);
            } else {
                data = this.getCookie(this.STORAGE_KEYS.STATISTICS);
            }
            
            if (!data) {
                return this.getDefaultStatistics();
            }
            
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to load statistics:', error);
            return this.getDefaultStatistics();
        }
    }
    
    static getDefaultStatistics() {
        return {
            totalPlayTime: 0,
            gamesPlayed: 0,
            storiesCompleted: 0,
            challengesCompleted: 0,
            perfectRuns: 0,
            averageScore: 0,
            bestStreak: 0,
            wordsLearned: 0,
            skillProgress: {
                vocabulary: 0,
                grammar: 0,
                reading: 0,
                listening: 0,
                writing: 0
            }
        };
    }
    
    static clearAllData() {
        try {
            if (this.isLocalStorageAvailable()) {
                Object.values(this.STORAGE_KEYS).forEach(key => {
                    localStorage.removeItem(key);
                });
            } else {
                Object.values(this.STORAGE_KEYS).forEach(key => {
                    this.deleteCookie(key);
                });
            }
            
            console.log('All game data cleared');
            return true;
        } catch (error) {
            console.error('Failed to clear all data:', error);
            return false;
        }
    }
    
    static exportData() {
        try {
            const data = {
                userProgress: this.loadUserProgress(),
                settings: this.loadSettings(),
                achievements: this.loadAchievements(),
                inventory: this.loadInventory(),
                companions: this.loadCompanions(),
                statistics: this.loadStatistics(),
                exportDate: Date.now(),
                version: this.VERSION
            };
            
            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('Failed to export data:', error);
            return null;
        }
    }
    
    static importData(dataString) {
        try {
            const data = JSON.parse(dataString);
            
            if (data.version && data.exportDate) {
                // Save imported data
                if (data.userProgress) this.saveUserProgress(data.userProgress);
                if (data.settings) this.saveSettings(data.settings);
                if (data.achievements) this.saveAchievements(data.achievements);
                if (data.inventory) this.saveInventory(data.inventory);
                if (data.companions) this.saveCompanions(data.companions);
                if (data.statistics) this.saveStatistics(data.statistics);
                
                console.log('Data imported successfully');
                return true;
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }
    
    // Cookie utility methods
    static setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }
    
    static getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    static deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
    
    // Utility methods
    static getWeekStart() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day;
        const weekStart = new Date(now.setDate(diff));
        return weekStart.toDateString();
    }
    
    static getStorageUsage() {
        if (!this.isLocalStorageAvailable()) {
            return { used: 0, total: 0, percentage: 0 };
        }
        
        let used = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                used += localStorage[key].length + key.length;
            }
        }
        
        const total = 5 * 1024 * 1024; // 5MB approximate limit
        const percentage = (used / total) * 100;
        
        return { used, total, percentage: Math.round(percentage * 100) / 100 };
    }
}

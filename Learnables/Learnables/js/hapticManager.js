// Haptic Manager - Handles tactile feedback for supported devices
class HapticManager {
    static isSupported = false;
    static enabled = true;
    static patterns = {};
    
    static init() {
        this.checkSupport();
        this.loadPatterns();
        this.loadSettings();
    }
    
    static checkSupport() {
        // Check for various haptic APIs
        this.isSupported = !!(
            navigator.vibrate ||
            navigator.webkitVibrate ||
            navigator.mozVibrate ||
            navigator.msVibrate ||
            (window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function')
        );
        
        console.log('Haptic feedback supported:', this.isSupported);
    }
    
    static loadPatterns() {
        this.patterns = {
            // Basic feedback patterns
            light: [50],
            medium: [100],
            heavy: [200],
            
            // Success patterns
            success: [100, 50, 100],
            achievement: [200, 100, 200, 100, 300],
            levelUp: [150, 75, 150, 75, 150, 75, 300],
            
            // Error/failure patterns
            error: [300, 100, 300],
            failure: [500],
            warning: [100, 100, 100],
            
            // Interaction patterns
            click: [25],
            tap: [50],
            longPress: [100, 50, 100],
            
            // Game-specific patterns
            correctAnswer: [75, 25, 75],
            incorrectAnswer: [200, 100, 200],
            questCompleted: [100, 50, 100, 50, 200],
            challengeCompleted: [150, 75, 150, 75, 250],
            eventQuestCompleted: [200, 100, 200, 100, 200, 100, 400],
            
            // Story/narrative patterns
            storyStart: [100],
            storyEnd: [150, 75, 150],
            choiceMade: [75],
            
            // Learning patterns
            wordLearned: [50, 25, 50],
            skillImproved: [100, 50, 150],
            streakMaintained: [75, 50, 75, 50, 100],
            
            // Special effects
            heartbeat: [100, 100, 100, 100, 100, 100, 100, 100],
            pulse: [200, 300, 200],
            rapid: [25, 25, 25, 25, 25, 25, 25, 25],
            
            // Notification patterns
            notification: [100, 200, 100],
            alert: [300, 200, 300, 200, 300],
            reminder: [100, 100, 100, 100, 100]
        };
    }
    
    static loadSettings() {
        const settings = StorageManager.loadSettings();
        this.enabled = settings.hapticEnabled !== false;
    }
    
    static vibrate(pattern) {
        if (!this.isSupported || !this.enabled) return false;
        
        try {
            if (navigator.vibrate) {
                return navigator.vibrate(pattern);
            } else if (navigator.webkitVibrate) {
                return navigator.webkitVibrate(pattern);
            } else if (navigator.mozVibrate) {
                return navigator.mozVibrate(pattern);
            } else if (navigator.msVibrate) {
                return navigator.msVibrate(pattern);
            }
        } catch (error) {
            console.warn('Haptic vibration failed:', error);
        }
        
        return false;
    }
    
    static playPattern(patternName) {
        const pattern = this.patterns[patternName];
        if (!pattern) {
            console.warn(`Haptic pattern '${patternName}' not found`);
            return false;
        }
        
        return this.vibrate(pattern);
    }
    
    static playCustomPattern(pattern) {
        return this.vibrate(pattern);
    }
    
    // Basic feedback methods
    static lightFeedback() {
        return this.playPattern('light');
    }
    
    static mediumFeedback() {
        return this.playPattern('medium');
    }
    
    static heavyFeedback() {
        return this.playPattern('heavy');
    }
    
    // Success feedback methods
    static successFeedback() {
        return this.playPattern('success');
    }
    
    static achievementFeedback() {
        return this.playPattern('achievement');
    }
    
    static levelUpFeedback() {
        return this.playPattern('levelUp');
    }
    
    // Error feedback methods
    static errorFeedback() {
        return this.playPattern('error');
    }
    
    static failureFeedback() {
        return this.playPattern('failure');
    }
    
    static warningFeedback() {
        return this.playPattern('warning');
    }
    
    // Interaction feedback methods
    static clickFeedback() {
        return this.playPattern('click');
    }
    
    static tapFeedback() {
        return this.playPattern('tap');
    }
    
    static longPressFeedback() {
        return this.playPattern('longPress');
    }
    
    // Game-specific feedback methods
    static correctAnswerFeedback() {
        return this.playPattern('correctAnswer');
    }
    
    static incorrectAnswerFeedback() {
        return this.playPattern('incorrectAnswer');
    }
    
    static questCompletedFeedback() {
        return this.playPattern('questCompleted');
    }
    
    static challengeCompletedFeedback() {
        return this.playPattern('challengeCompleted');
    }
    
    static eventQuestFeedback() {
        return this.playPattern('eventQuestCompleted');
    }
    
    // Story/narrative feedback methods
    static storyStartFeedback() {
        return this.playPattern('storyStart');
    }
    
    static storyEndFeedback() {
        return this.playPattern('storyEnd');
    }
    
    static choiceMadeFeedback() {
        return this.playPattern('choiceMade');
    }
    
    // Learning feedback methods
    static wordLearnedFeedback() {
        return this.playPattern('wordLearned');
    }
    
    static skillImprovedFeedback() {
        return this.playPattern('skillImproved');
    }
    
    static streakMaintainedFeedback() {
        return this.playPattern('streakMaintained');
    }
    
    // Special effect methods
    static heartbeatFeedback() {
        return this.playPattern('heartbeat');
    }
    
    static pulseFeedback() {
        return this.playPattern('pulse');
    }
    
    static rapidFeedback() {
        return this.playPattern('rapid');
    }
    
    // Notification methods
    static notificationFeedback() {
        return this.playPattern('notification');
    }
    
    static alertFeedback() {
        return this.playPattern('alert');
    }
    
    static reminderFeedback() {
        return this.playPattern('reminder');
    }
    
    // Advanced haptic methods
    static createSequence(patterns, delays = []) {
        if (!this.isSupported || !this.enabled) return false;
        
        let delay = 0;
        patterns.forEach((patternName, index) => {
            setTimeout(() => {
                this.playPattern(patternName);
            }, delay);
            
            delay += delays[index] || 500; // Default 500ms between patterns
        });
        
        return true;
    }
    
    static createRhythm(pattern, repetitions = 1, interval = 1000) {
        if (!this.isSupported || !this.enabled) return false;
        
        for (let i = 0; i < repetitions; i++) {
            setTimeout(() => {
                this.playPattern(pattern);
            }, i * interval);
        }
        
        return true;
    }
    
    static fadePattern(basePattern, steps = 5, duration = 2000) {
        if (!this.isSupported || !this.enabled) return false;
        
        const pattern = this.patterns[basePattern] || basePattern;
        const stepDuration = duration / steps;
        
        for (let i = 0; i < steps; i++) {
            const intensity = 1 - (i / steps); // Fade from 100% to 0%
            const fadedPattern = pattern.map(duration => Math.floor(duration * intensity));
            
            setTimeout(() => {
                this.vibrate(fadedPattern);
            }, i * stepDuration);
        }
        
        return true;
    }
    
    static buildUpPattern(basePattern, steps = 5, duration = 2000) {
        if (!this.isSupported || !this.enabled) return false;
        
        const pattern = this.patterns[basePattern] || basePattern;
        const stepDuration = duration / steps;
        
        for (let i = 0; i < steps; i++) {
            const intensity = (i + 1) / steps; // Build from 0% to 100%
            const builtPattern = pattern.map(duration => Math.floor(duration * intensity));
            
            setTimeout(() => {
                this.vibrate(builtPattern);
            }, i * stepDuration);
        }
        
        return true;
    }
    
    // Context-aware feedback
    static contextualFeedback(context, intensity = 'medium') {
        const contextPatterns = {
            'game_start': 'storyStart',
            'game_over': 'failure',
            'victory': 'achievement',
            'menu_navigate': 'click',
            'button_press': 'tap',
            'page_turn': 'light',
            'notification': 'notification',
            'error': 'error',
            'success': 'success',
            'achievement_unlock': 'achievement',
            'level_complete': 'levelUp',
            'quest_complete': 'questCompleted',
            'challenge_complete': 'challengeCompleted'
        };
        
        const pattern = contextPatterns[context];
        if (pattern) {
            return this.playPattern(pattern);
        } else {
            return this.playPattern(intensity);
        }
    }
    
    // Adaptive feedback based on user interaction
    static adaptiveFeedback(actionType, accuracy = 1.0, streak = 0) {
        if (!this.isSupported || !this.enabled) return false;
        
        let pattern;
        
        switch (actionType) {
            case 'answer':
                if (accuracy >= 0.9) {
                    pattern = streak > 5 ? 'achievement' : 'correctAnswer';
                } else if (accuracy >= 0.5) {
                    pattern = 'warning';
                } else {
                    pattern = 'incorrectAnswer';
                }
                break;
                
            case 'quest_progress':
                if (accuracy >= 0.8) {
                    pattern = 'success';
                } else {
                    pattern = 'medium';
                }
                break;
                
            case 'skill_improvement':
                const improvement = Math.min(streak / 10, 1);
                if (improvement > 0.7) {
                    pattern = 'levelUp';
                } else if (improvement > 0.3) {
                    pattern = 'skillImproved';
                } else {
                    pattern = 'wordLearned';
                }
                break;
                
            default:
                pattern = 'medium';
        }
        
        return this.playPattern(pattern);
    }
    
    // Settings and configuration
    static setEnabled(enabled) {
        this.enabled = enabled;
        
        // Save to storage
        const settings = StorageManager.loadSettings();
        settings.hapticEnabled = enabled;
        StorageManager.saveSettings(settings);
    }
    
    static isEnabled() {
        return this.enabled && this.isSupported;
    }
    
    static testPattern(patternName) {
        console.log(`Testing haptic pattern: ${patternName}`);
        return this.playPattern(patternName);
    }
    
    static getAllPatterns() {
        return Object.keys(this.patterns);
    }
    
    static getPatternDuration(patternName) {
        const pattern = this.patterns[patternName];
        if (!pattern) return 0;
        
        return pattern.reduce((total, duration, index) => {
            return total + duration + (index < pattern.length - 1 ? 100 : 0); // Add 100ms gaps
        }, 0);
    }
    
    // Debug and testing methods
    static playAllPatterns(interval = 1000) {
        if (!this.isSupported || !this.enabled) {
            console.log('Haptic feedback not supported or disabled');
            return false;
        }
        
        const patterns = Object.keys(this.patterns);
        patterns.forEach((pattern, index) => {
            setTimeout(() => {
                console.log(`Playing pattern: ${pattern}`);
                this.playPattern(pattern);
            }, index * interval);
        });
        
        return true;
    }
    
    static createCustomPattern(name, pattern) {
        this.patterns[name] = pattern;
        console.log(`Custom haptic pattern '${name}' created:`, pattern);
    }
    
    static removeCustomPattern(name) {
        if (this.patterns[name]) {
            delete this.patterns[name];
            console.log(`Custom haptic pattern '${name}' removed`);
        }
    }
    
    // Emergency stop
    static stopAll() {
        if (this.isSupported) {
            this.vibrate([]); // Empty array stops vibration
        }
    }
}

// Initialize haptic manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    HapticManager.init();
    
    // Test basic functionality on first load (optional)
    if (HapticManager.isSupported && HapticManager.enabled) {
        // Small welcome vibration
        setTimeout(() => {
            HapticManager.lightFeedback();
        }, 1000);
    }
});

// Handle visibility changes to disable haptics when app is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        HapticManager.stopAll();
    }
});

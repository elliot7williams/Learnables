// Sound Manager - Handles all audio effects and background music
class SoundManager {
    static audioContext = null;
    static sounds = {};
    static musicVolume = 0.7;
    static effectsVolume = 0.8;
    static muted = false;
    
    static init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.loadSounds();
        } catch (error) {
            console.warn('Audio not supported:', error);
        }
    }
    
    static loadSounds() {
        // For now, use simple beep sounds - in a real app these would be actual audio files
        this.sounds = {
            success: { frequency: 800, duration: 200 },
            failure: { frequency: 300, duration: 400 },
            click: { frequency: 600, duration: 100 },
            notification: { frequency: 1000, duration: 150 },
            levelUp: { frequency: 1200, duration: 300 },
            achievement: { frequency: 1500, duration: 500 }
        };
    }
    
    static playSuccess() {
        this.playBeep(this.sounds.success.frequency, this.sounds.success.duration);
    }
    
    static playFailure() {
        this.playBeep(this.sounds.failure.frequency, this.sounds.failure.duration);
    }
    
    static playClick() {
        this.playBeep(this.sounds.click.frequency, this.sounds.click.duration);
    }
    
    static playNotification() {
        this.playBeep(this.sounds.notification.frequency, this.sounds.notification.duration);
    }
    
    static playLevelUp() {
        this.playBeep(this.sounds.levelUp.frequency, this.sounds.levelUp.duration);
    }
    
    static playAchievement() {
        this.playBeep(this.sounds.achievement.frequency, this.sounds.achievement.duration);
    }
    
    static playBeep(frequency, duration) {
        if (!this.audioContext || this.muted) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.effectsVolume * 0.1, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration / 1000);
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }
    
    static setMuted(muted) {
        this.muted = muted;
    }
    
    static setEffectsVolume(volume) {
        this.effectsVolume = Math.max(0, Math.min(1, volume));
    }
    
    static setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }
}

// Initialize when document loads
document.addEventListener('DOMContentLoaded', () => {
    SoundManager.init();
});

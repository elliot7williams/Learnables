// Weekly Challenge Generator - Create and manage weekly challenges
class WeeklyChallengeGenerator {
    static currentChallenge = null;

    static init() {
        this.loadOrGenerateWeeklyChallenge();
    }

    static loadOrGenerateWeeklyChallenge() {
        this.currentChallenge = StorageManager.loadWeeklyChallenge();

        if (!this.currentChallenge) {
            this.currentChallenge = this.generateWeeklyChallenge();
            StorageManager.saveWeeklyChallenge(this.currentChallenge);
        }

        return this.currentChallenge;
    }

    static generateWeeklyChallenge() {
        const challengeTypes = ['vocabulary', 'grammar', 'reading', 'listening', 'writing'];
        const type = this.getRandomElement(challengeTypes);

        const challenge = {
            id: `weekly_${type}_${Date.now()}`,
            type: type,
            title: `Weekly ${type.charAt(0).toUpperCase() + type.slice(1)} Challenge`,
            description: this.getChallengeDescription(type),
            requirement: this.getChallengeRequirement(type),
            progress: 0,
            completed: false,
            xpReward: this.getChallengeXPReward(type),
            createdAt: Date.now(),
            expiresAt: this.getEndOfWeek()
        };

        return challenge;
    }

    static getChallengeDescription(type) {
        switch (type) {
            case 'vocabulary':
                return 'Master 50 new vocabulary words.';
            case 'grammar':
                return 'Perfect 20 grammar exercises.';
            case 'reading':
                return 'Achieve perfect comprehension in 10 reading exercises.';
            case 'listening':
                return 'Complete 15 listening exercises with perfect score.';
            case 'writing':
                return 'Draft and review 5 different essays.';
            default:
                return 'Complete this challenge to earn rewards!';
        }
    }

    static getChallengeRequirement(type) {
        switch (type) {
            case 'vocabulary':
                return 50;
            case 'grammar':
                return 20;
            case 'reading':
                return 10;
            case 'listening':
                return 15;
            case 'writing':
                return 5;
            default:
                return 10;
        }
    }

    static getChallengeXPReward(type) {
        return 1000 * this.getChallengeRequirement(type) / 50; // Scale XP reward
    }

    static updateChallengeProgress(trackingKey, increment = 1) {
        if (this.currentChallenge && !this.currentChallenge.completed && this.currentChallenge.type === trackingKey) {
            this.currentChallenge.progress += increment;

            if (this.currentChallenge.progress >= this.currentChallenge.requirement) {
                this.completeChallenge();
            }

            StorageManager.saveWeeklyChallenge(this.currentChallenge);
        }
    }

    static completeChallenge() {
        if (!this.currentChallenge || this.currentChallenge.completed) return false;

        this.currentChallenge.completed = true;

        // Award XP and other rewards
        if (window.gameManager) {
            window.gameManager.addXP(this.currentChallenge.xpReward);

            // Notify completion
            this.showChallengeCompletionNotification(this.currentChallenge);

            // Play completion sound
            if (SoundManager) {
                SoundManager.playNotification();
            }

            // Haptic feedback
            if (HapticManager) {
                HapticManager.challengeCompletedFeedback();
            }
        }

        console.log(`Weekly challenge completed: ${this.currentChallenge.title}`);
        return true;
    }

    static showChallengeCompletionNotification(challenge) {
        if (typeof showNotification === 'function') {
            showNotification(
                `Weekly Challenge Complete! "${challenge.title}" (+${challenge.xpReward} XP)`,
                'success'
            );
        }
    }

    static isExpired(challenge) {
        return Date.now() > challenge.expiresAt;
    }

    static getEndOfWeek() {
        const now = new Date();
        const day = now.getDay();
        const diff = (7 - day) % 7; // Days until end of the week
        const endOfWeek = new Date(now.setDate(now.getDate() + diff));
        endOfWeek.setHours(23, 59, 59, 999);

        return endOfWeek.getTime();
    }

    static getCurrentChallenge() {
        return this.currentChallenge;
    }

    static formatChallenge() {
        const challenge = this.getCurrentChallenge();

        if (!challenge) return '<p>No weekly challenge available.</p>';

        const progressPercentage = Math.round((challenge.progress / challenge.requirement) * 100);
        const completedClass = challenge.completed ? 'completed' : '';

        return `
            <div class="challenge-item ${completedClass}">
                <div class="challenge-title">
                    ${challenge.title}
                </div>
                <div class="challenge-description">
                    ${challenge.description}
                </div>
                <div class="challenge-progress-bar">
                    <div class="challenge-progress-text">
                        Progress: ${challenge.progress} / ${challenge.requirement}
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${progressPercentage}%"></div>
                    </div>
                </div>
                <div class="challenge-reward">
                    <span class="xp-reward">${challenge.xpReward} XP</span>
                    <i class="fas fa-check ${challenge.completed ? 'visible' : 'hidden'}"></i>
                </div>
            </div>
        `;
    }

    static getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

// Initialize weekly challenge when the page loads
document.addEventListener('DOMContentLoaded', () => {
    WeeklyChallengeGenerator.init();
});


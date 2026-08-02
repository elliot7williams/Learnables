// Weather Effects - Visual weather and atmospheric effects
class WeatherEffects {
    static currentWeather = 'clear';
    static weatherContainer = null;
    static animationId = null;
    
    static init() {
        this.weatherContainer = document.getElementById('weather-effects');
        if (!this.weatherContainer) {
            console.warn('Weather effects container not found');
            return;
        }
        
        // Start with clear weather
        this.setWeather('clear');
    }
    
    static setWeather(weatherType) {
        this.currentWeather = weatherType;
        this.clearEffects();
        
        switch (weatherType) {
            case 'rain':
                this.createRain();
                break;
            case 'snow':
                this.createSnow();
                break;
            case 'storm':
                this.createStorm();
                break;
            case 'fog':
                this.createFog();
                break;
            case 'clear':
            default:
                // No effects for clear weather
                break;
        }
    }
    
    static clearEffects() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (this.weatherContainer) {
            this.weatherContainer.innerHTML = '';
            this.weatherContainer.className = 'weather-effects';
        }
    }
    
    static createRain() {
        this.weatherContainer.className = 'weather-effects rain';
        
        for (let i = 0; i < 100; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDelay = Math.random() * 2 + 's';
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            this.weatherContainer.appendChild(drop);
        }
    }
    
    static createSnow() {
        this.weatherContainer.className = 'weather-effects snow';
        
        for (let i = 0; i < 50; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow-flake';
            flake.innerHTML = '❄';
            flake.style.left = Math.random() * 100 + '%';
            flake.style.animationDelay = Math.random() * 3 + 's';
            flake.style.animationDuration = (Math.random() * 3 + 2) + 's';
            flake.style.fontSize = (Math.random() * 10 + 10) + 'px';
            this.weatherContainer.appendChild(flake);
        }
    }
    
    static createStorm() {
        this.weatherContainer.className = 'weather-effects storm';
        
        // Create rain
        this.createRain();
        
        // Add lightning flashes
        this.createLightning();
    }
    
    static createLightning() {
        const flash = () => {
            const lightning = document.createElement('div');
            lightning.className = 'lightning-flash';
            this.weatherContainer.appendChild(lightning);
            
            setTimeout(() => {
                lightning.remove();
            }, 200);
            
            // Schedule next lightning
            setTimeout(flash, Math.random() * 10000 + 3000);
        };
        
        // Start lightning sequence
        setTimeout(flash, Math.random() * 5000);
    }
    
    static createFog() {
        this.weatherContainer.className = 'weather-effects fog';
        
        for (let i = 0; i < 20; i++) {
            const fog = document.createElement('div');
            fog.className = 'fog-layer';
            fog.style.left = Math.random() * 100 + '%';
            fog.style.top = Math.random() * 100 + '%';
            fog.style.animationDelay = Math.random() * 10 + 's';
            fog.style.animationDuration = (Math.random() * 20 + 10) + 's';
            this.weatherContainer.appendChild(fog);
        }
    }
    
    static getRandomWeather() {
        const weathers = ['clear', 'rain', 'snow', 'fog'];
        return weathers[Math.floor(Math.random() * weathers.length)];
    }
    
    static updateWeatherBasedOnTime(hour) {
        // Simulate weather patterns based on time
        if (hour >= 0 && hour < 6) {
            // Night - more likely to have fog
            const chance = Math.random();
            if (chance < 0.3) this.setWeather('fog');
            else if (chance < 0.5) this.setWeather('clear');
            else this.setWeather(this.getRandomWeather());
        } else if (hour >= 6 && hour < 12) {
            // Morning - usually clear
            const chance = Math.random();
            if (chance < 0.7) this.setWeather('clear');
            else this.setWeather(this.getRandomWeather());
        } else if (hour >= 12 && hour < 18) {
            // Afternoon - variable
            this.setWeather(this.getRandomWeather());
        } else {
            // Evening - chance of rain
            const chance = Math.random();
            if (chance < 0.4) this.setWeather('rain');
            else this.setWeather(this.getRandomWeather());
        }
    }
}

// Initialize when document loads
document.addEventListener('DOMContentLoaded', () => {
    WeatherEffects.init();
});

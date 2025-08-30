// Creature class - manages the virtual pet's state and behavior
class Creature {
    constructor() {
        this.name = '';
        this.age = 0; // in hours
        this.birthTime = Date.now();
        
        // Core needs (0-100)
        this.hunger = 100;
        this.happiness = 100;
        this.health = 100;
        this.energy = 100;
        
        // States
        this.mood = 'neutral'; // happy, sad, angry, hungry, sleepy, sick
        this.isAlive = true;
        this.isSleeping = false;
        this.evolutionStage = 1;
        
        // Interaction tracking
        this.lastInteraction = Date.now();
        this.totalInteractions = 0;
        this.trustLevel = 50; // How much creature trusts user
        
        // Thought system
        this.thoughtGenerationRate = 0.3 + Math.random() * 0.4; // 0.3-0.7
        this.lastThought = Date.now();
        this.currentThoughts = [];
        this.lastSpontaneousSpeech = 0;
        
        // Visual elements
        this.element = document.getElementById('creature');
        this.leftEye = document.getElementById('leftEye');
        this.rightEye = document.getElementById('rightEye');
        this.mouth = document.getElementById('mouth');
        
        // Animation states
        this.isBlinking = false;
        this.isSpeaking = false;
        this.currentAnimation = '';
        
        this.init();
    }

    init() {
        this.startBlinkTimer();
        this.startMoodUpdates();
        this.startThoughtGeneration();
    }

    initializeNew() {
        this.name = this.generateRandomName();
        this.age = 0;
        this.birthTime = Date.now();
        this.hunger = 100;
        this.happiness = 100;
        this.health = 100;
        this.energy = 100;
        this.mood = 'happy';
        this.evolutionStage = 1;
        this.trustLevel = 50;
        this.totalInteractions = 0;
        this.lastInteraction = Date.now();
        this.currentThoughts = [];
        this.lastSpontaneousSpeech = Date.now();
        
        console.log(`New creature born: ${this.name}`);
    }

    generateRandomName() {
        const names = [
            'Pip', 'Mochi', 'Boba', 'Kiwi', 'Luna', 'Nova',
            'Zephyr', 'Pixel', 'Cosmos', 'Echo', 'Sage', 'Iris'
        ];
        return names[Math.floor(Math.random() * names.length)];
    }

    // Age management
    updateAge() {
        this.age = (Date.now() - this.birthTime) / (1000 * 60 * 60); // hours
    }

    getAgeInDays() {
        return Math.floor(this.age / 24);
    }

    // Need management
    addHunger(amount) {
        this.hunger = Math.min(100, this.hunger + amount);
        this.updateMood();
    }

    addHappiness(amount) {
        this.happiness = Math.min(100, this.happiness + amount);
        this.trustLevel = Math.min(100, this.trustLevel + amount * 0.5);
        this.updateMood();
        this.showInteractionEffect('heart');
    }

    addHealth(amount) {
        this.health = Math.min(100, this.health + amount);
        this.updateMood();
    }

    addEnergy(amount) {
        this.energy = Math.min(100, this.energy + amount);
        this.updateMood();
    }

    // Decrease needs over time
    decreaseHunger(amount = 0.5) {
        this.hunger = Math.max(0, this.hunger - amount);
        if (this.hunger === 0) {
            this.health = Math.max(0, this.health - 1);
        }
    }

    decreaseHappiness(amount = 0.3) {
        this.happiness = Math.max(0, this.happiness - amount);
    }

    decreaseEnergy(amount = 0.4) {
        if (!this.isSleeping) {
            this.energy = Math.max(0, this.energy - amount);
        }
    }

    decreaseHealth(amount = 0.1) {
        this.health = Math.max(0, this.health - amount);
        if (this.health === 0) {
            this.die();
        }
    }

    // Mood system
    updateMood() {
        if (!this.isAlive) {
            this.mood = 'dead';
            return;
        }

        if (this.health < 30) {
            this.mood = 'sick';
        } else if (this.energy < 20) {
            this.mood = 'sleepy';
        } else if (this.hunger < 20) {
            this.mood = 'hungry';
        } else if (this.happiness < 30) {
            this.mood = 'sad';
        } else if (this.trustLevel < 30) {
            this.mood = 'angry';
        } else if (this.happiness > 70 && this.hunger > 50) {
            this.mood = 'happy';
        } else {
            this.mood = 'neutral';
        }

        this.updateAppearance();
    }

    // THOUGHT GENERATION SYSTEM
    startThoughtGeneration() {
        setInterval(() => {
            this.generateThought();
        }, 3000 + Math.random() * 7000); // Every 3-10 seconds
    }

    generateThought() {
        if (!this.isAlive) return;
        
        const currentTime = Date.now();
        let thoughtType = 'general';
        let urgency = 0.1;
        
        // Generate thoughts based on current state
        if (this.hunger < 30) {
            thoughtType = 'hungry';
            urgency = (30 - this.hunger) / 30;
        } else if (this.health < 40) {
            thoughtType = 'sick';
            urgency = (40 - this.health) / 40;
        } else if (this.energy < 20) {
            thoughtType = 'tired';
            urgency = (20 - this.energy) / 20;
        } else if (this.happiness > 80) {
            thoughtType = 'happy';
            urgency = 0.6;
        } else if (currentTime - this.lastInteraction > 120000) { // 2 minutes
            thoughtType = 'lonely';
            urgency = Math.min(1.0, (currentTime - this.lastInteraction) / 300000);
        } else if (Math.random() < 0.3) {
            thoughtType = 'random_babble';
            urgency = 0.2;
        }
        
        this.currentThoughts.push({
            type: thoughtType,
            urgency: urgency,
            timestamp: currentTime
        });
        
        // Creature might express this thought
        if (window.tamagotchiGame && window.tamagotchiGame.languageLearning) {
            // Higher urgency = more likely to speak
            if (urgency > 0.4 || Math.random() < this.thoughtGenerationRate) {
                setTimeout(() => {
                    window.tamagotchiGame.languageLearning.expressThought(thoughtType, urgency);
                }, Math.random() * 2000);
            }
        }
        
        // Keep only recent thoughts
        if (this.currentThoughts.length > 10) {
            this.currentThoughts = this.currentThoughts.slice(-5);
        }
    }

    recordUserAbsence() {
        // Creature notices when user leaves
        if (Math.random() < 0.3) {
            this.addHappiness(-2);
            
            // Might express sadness about user leaving
            if (window.tamagotchiGame && window.tamagotchiGame.languageLearning) {
                setTimeout(() => {
                    window.tamagotchiGame.languageLearning.expressThought('user_left', 0.6);
                }, 2000 + Math.random() * 3000);
            }
        }
    }

    // Visual updates
    updateAppearance() {
        if (!this.element) return;

        // Remove all mood classes
        const moodClasses = ['happy', 'sad', 'angry', 'hungry', 'sleepy', 'sick', 'dead'];
        this.element.classList.remove(...moodClasses);
        
        // Add current mood class
        this.element.classList.add(this.mood);

        // Update facial expressions
        this.updateFacialExpression();
    }

    updateFacialExpression() {
        if (!this.mouth || !this.leftEye || !this.rightEye) return;

        // Remove existing expression classes
        const expressionClasses = ['happy', 'sad', 'angry', 'speaking', 'sleepy'];
        this.mouth.classList.remove(...expressionClasses);
        this.leftEye.classList.remove(...expressionClasses);
        this.rightEye.classList.remove(...expressionClasses);

        // Apply mood-based expressions
        switch (this.mood) {
            case 'happy':
                this.mouth.classList.add('happy');
                this.leftEye.classList.add('happy');
                this.rightEye.classList.add('happy');
                break;
            case 'sad':
                this.mouth.classList.add('sad');
                break;
            case 'angry':
                this.leftEye.classList.add('angry');
                this.rightEye.classList.add('angry');
                this.mouth.classList.add('angry');
                break;
            case 'sleepy':
                this.leftEye.classList.add('sleepy');
                this.rightEye.classList.add('sleepy');
                break;
        }
    }

    // Interaction effects
    showInteractionEffect(type) {
        const effectsContainer = document.getElementById('interactionEffects');
        const effect = document.createElement('div');
        
        switch (type) {
            case 'heart':
                effect.className = 'heart-effect';
                effect.innerHTML = '💖';
                break;
            case 'sparkle':
                effect.className = 'sparkle-effect';
                break;
        }

        effect.style.left = Math.random() * 100 + '%';
        effect.style.top = Math.random() * 100 + '%';

        effectsContainer.appendChild(effect);

        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 2000);
    }

    // Animations
    startBlinkTimer() {
        const blink = () => {
            if (!this.isAlive || this.isSleeping) return;
            
            this.blink();
            
            const nextBlink = 2000 + Math.random() * 4000;
            setTimeout(blink, nextBlink);
        };
        
        setTimeout(blink, 2000);
    }

    blink() {
        if (this.isBlinking || this.mood === 'sleepy') return;
        
        this.isBlinking = true;
        this.leftEye.classList.add('blink');
        this.rightEye.classList.add('blink');
        
        setTimeout(() => {
            this.leftEye.classList.remove('blink');
            this.rightEye.classList.remove('blink');
            this.isBlinking = false;
        }, 150);
    }

    speak(duration = 1000) {
        if (!this.isAlive) return;
        
        this.isSpeaking = true;
        this.mouth.classList.add('speaking');
        
        setTimeout(() => {
            this.mouth.classList.remove('speaking');
            this.isSpeaking = false;
        }, duration);
    }

    performRandomAction() {
        if (!this.isAlive || this.isSleeping) return;
        
        const actions = ['blink', 'wiggle', 'yawn'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        switch (action) {
            case 'blink':
                this.blink();
                break;
            case 'wiggle':
                this.wiggle();
                break;
            case 'yawn':
                if (this.energy < 50) this.yawn();
                break;
        }
    }

    wiggle() {
        this.element.style.transform = 'rotate(5deg)';
        setTimeout(() => {
            this.element.style.transform = 'rotate(-5deg)';
        }, 100);
        setTimeout(() => {
            this.element.style.transform = 'rotate(0deg)';
        }, 200);
    }

    yawn() {
        this.mouth.style.width = '30px';
        this.mouth.style.height = '15px';
        setTimeout(() => {
            this.mouth.style.width = '';
            this.mouth.style.height = '';
        }, 1000);
    }

    die() {
        this.isAlive = false;
        this.health = 0;
        this.mood = 'dead';
        this.updateAppearance();
        
        console.log(`${this.name} has died...`);
        
        if (window.tamagotchiGame) {
            window.tamagotchiGame.addChatMessage('System', `${this.name} has passed away due to neglect...`, 'system');
        }
    }

    revive() {
        this.isAlive = true;
        this.health = 50;
        this.hunger = 50;
        this.happiness = 50;
        this.energy = 50;
        this.updateMood();
        
        console.log(`${this.name} has been revived!`);
    }

    sleep() {
        this.isSleeping = true;
        this.energy = Math.min(100, this.energy + 30);
        this.element.style.opacity = '0.7';
    }

    wakeUp() {
        this.isSleeping = false;
        this.element.style.opacity = '1';
        this.addHappiness(10);
    }

    recordInteraction(type, intensity = 1) {
        this.lastInteraction = Date.now();
        this.totalInteractions++;
        
        if (type === 'gentle') {
            this.trustLevel = Math.min(100, this.trustLevel + intensity);
            this.addHappiness(intensity * 2);
        } else if (type === 'rough') {
            this.trustLevel = Math.max(0, this.trustLevel - intensity * 2);
            this.happiness = Math.max(0, this.happiness - intensity);
        }
    }

    evolve(newStage) {
        this.evolutionStage = newStage;
        this.element.classList.add('evolving');
        
        setTimeout(() => {
            this.element.classList.remove('evolving');
            this.updateAppearance();
        }, 2000);
        
        if (window.tamagotchiGame) {
            window.tamagotchiGame.addChatMessage('System', `${this.name} has evolved to stage ${newStage}!`, 'system');
        }
    }

    startMoodUpdates() {
        setInterval(() => {
            this.updateMood();
        }, 5000);
    }

    serialize() {
        return {
            name: this.name,
            age: this.age,
            birthTime: this.birthTime,
            hunger: this.hunger,
            happiness: this.happiness,
            health: this.health,
            energy: this.energy,
            mood: this.mood,
            isAlive: this.isAlive,
            isSleeping: this.isSleeping,
            evolutionStage: this.evolutionStage,
            lastInteraction: this.lastInteraction,
            totalInteractions: this.totalInteractions,
            trustLevel: this.trustLevel,
            thoughtGenerationRate: this.thoughtGenerationRate
        };
    }

    deserialize(data) {
        Object.assign(this, data);
        this.updateAppearance();
    }
}
// NeedsSystem - manages creature's basic needs and their effects
class NeedsSystem {
    constructor(creature) {
        this.creature = creature;
        this.isActive = true;
        
        // Need decay rates (per minute)
        this.hungerDecayRate = 1.5;
        this.happinessDecayRate = 0.8;
        this.energyDecayRate = 1.2;
        this.healthDecayRate = 0.3;
        
        // Last update timestamp for calculating time-based decay
        this.lastUpdate = Date.now();
        
        // Activity states
        this.lastFeedTime = 0;
        this.lastPlayTime = 0;
        this.lastMedicineTime = 0;
        
        this.init();
    }

    init() {
        console.log('Needs system initialized');
    }

    // Main update function - called every second from game loop
    update() {
        if (!this.isActive || !this.creature.isAlive) return;
        
        const currentTime = Date.now();
        const timeDelta = (currentTime - this.lastUpdate) / (1000 * 60); // minutes
        
        // Apply natural decay based on time passed
        this.applyNaturalDecay(timeDelta);
        
        // Check for critical states
        this.checkCriticalStates();
        
        // Update UI warnings
        this.updateWarnings();
        
        this.lastUpdate = currentTime;
    }

    applyNaturalDecay(timeDelta) {
        if (timeDelta <= 0) return;
        
        // Hunger decreases over time
        this.creature.decreaseHunger(this.hungerDecayRate * timeDelta);
        
        // Happiness slowly decreases without interaction
        if (Date.now() - this.creature.lastInteraction > 300000) { // 5 minutes
            this.creature.decreaseHappiness(this.happinessDecayRate * timeDelta);
        }
        
        // Energy decreases when awake
        if (!this.creature.isSleeping) {
            this.creature.decreaseEnergy(this.energyDecayRate * timeDelta);
        } else {
            // Restore energy when sleeping
            this.creature.addEnergy(2 * timeDelta);
        }
        
        // Health effects based on other needs
        if (this.creature.hunger < 20 || this.creature.happiness < 20) {
            this.creature.decreaseHealth(this.healthDecayRate * timeDelta * 2);
        } else if (this.creature.hunger > 80 && this.creature.happiness > 60) {
            this.creature.addHealth(0.5 * timeDelta);
        }
    }

    checkCriticalStates() {
        // Check if creature is in danger
        if (this.creature.health < 10) {
            this.triggerEmergency('health');
        } else if (this.creature.hunger < 5) {
            this.triggerEmergency('hunger');
        } else if (this.creature.energy < 5) {
            this.triggerEmergency('energy');
        }
    }

    triggerEmergency(type) {
        let message = '';
        switch (type) {
            case 'health':
                message = `${this.creature.name} is critically ill! 🚨 Give medicine immediately!`;
                break;
            case 'hunger':
                message = `${this.creature.name} is starving! 🚨 Feed immediately!`;
                break;
            case 'energy':
                message = `${this.creature.name} is exhausted! 🚨 Let them sleep!`;
                break;
        }
        
        if (window.tamagotchiGame && message) {
            window.tamagotchiGame.addChatMessage('EMERGENCY', message, 'emergency');
        }
        
        // Visual warning
        this.showEmergencyEffect();
    }

    showEmergencyEffect() {
        const creature = document.getElementById('creature');
        creature.style.animation = 'shake 0.5s ease-in-out infinite';
        
        setTimeout(() => {
            creature.style.animation = '';
        }, 3000);
    }

    updateWarnings() {
        // Update status bar warning states
        const needs = ['hunger', 'happiness', 'health', 'energy'];
        
        needs.forEach(need => {
            const bar = document.getElementById(`${need}Bar`);
            const value = this.creature[need];
            
            bar.classList.remove('low', 'critical', 'urgent');
            
            if (value < 15) {
                bar.classList.add('critical', 'urgent');
            } else if (value < 30) {
                bar.classList.add('low');
            }
        });
    }

    // Action methods
    feed() {
        const currentTime = Date.now();
        const timeSinceLastFeed = currentTime - this.lastFeedTime;
        
        // Prevent overfeeding (must wait at least 30 seconds)
        if (timeSinceLastFeed < 30000) {
            if (window.tamagotchiGame) {
                window.tamagotchiGame.addChatMessage('System', `${this.creature.name} is not hungry right now!`, 'system');
            }
            return false;
        }
        
        // Calculate feed effectiveness based on current hunger
        let feedAmount = 25;
        if (this.creature.hunger > 80) {
            feedAmount = 10; // Less effective when already full
        }
        
        this.creature.addHunger(feedAmount);
        this.creature.addHappiness(5);
        this.creature.recordInteraction('gentle', 1);
        
        this.lastFeedTime = currentTime;
        
        // Show feeding animation
        this.showFeedingEffect();
        
        if (window.tamagotchiGame) {
            const messages = [
                `${this.creature.name} enjoyed the meal! 🍎`,
                `Nom nom! ${this.creature.name} is satisfied! 😋`,
                `${this.creature.name} thanks you for the food! 🙏`
            ];
            const message = messages[Math.floor(Math.random() * messages.length)];
            window.tamagotchiGame.addChatMessage('System', message, 'system');
        }
        
        return true;
    }

    play() {
        const currentTime = Date.now();
        const timeSinceLastPlay = currentTime - this.lastPlayTime;
        
        // Check if creature is too tired or sick to play
        if (this.creature.energy < 20) {
            if (window.tamagotchiGame) {
                window.tamagotchiGame.addChatMessage('System', `${this.creature.name} is too tired to play! Let them rest.`, 'system');
            }
            return false;
        }
        
        if (this.creature.health < 30) {
            if (window.tamagotchiGame) {
                window.tamagotchiGame.addChatMessage('System', `${this.creature.name} doesn't feel well enough to play.`, 'system');
            }
            return false;
        }
        
        // Play costs energy but increases happiness
        this.creature.addHappiness(20);
        this.creature.decreaseEnergy(15);
        this.creature.recordInteraction('gentle', 2);
        
        this.lastPlayTime = currentTime;
        
        // Show play animation
        this.showPlayEffect();
        
        if (window.tamagotchiGame) {
            const messages = [
                `${this.creature.name} had so much fun playing! 🎾`,
                `Wheee! ${this.creature.name} loves playtime! 🎉`,
                `${this.creature.name} is bouncing with joy! ⚽`
            ];
            const message = messages[Math.floor(Math.random() * messages.length)];
            window.tamagotchiGame.addChatMessage('System', message, 'system');
        }
        
        return true;
    }

    toggleSleep() {
        if (this.creature.isSleeping) {
            // Wake up
            this.creature.wakeUp();
            if (window.tamagotchiGame) {
                window.tamagotchiGame.addChatMessage('System', `${this.creature.name} woke up refreshed! 😊`, 'system');
            }
        } else {
            // Go to sleep
            if (this.creature.energy > 80) {
                if (window.tamagotchiGame) {
                    window.tamagotchiGame.addChatMessage('System', `${this.creature.name} is not sleepy right now!`, 'system');
                }
                return false;
            }
            
            this.creature.sleep();
            if (window.tamagotchiGame) {
                window.tamagotchiGame.addChatMessage('System', `${this.creature.name} is now sleeping... 😴`, 'system');
            }
        }
        
        return true;
    }

    giveMedicine() {
        const currentTime = Date.now();
        const timeSinceLastMedicine = currentTime - this.lastMedicineTime;
        
        // Prevent medicine overdose (must wait at least 2 minutes)
        if (timeSinceLastMedicine < 120000) {
            if (window.tamagotchiGame) {
                window.tamagotchiGame.addChatMessage('System', `${this.creature.name} doesn't need medicine right now!`, 'system');
            }
            return false;
        }
        
        // Medicine is most effective when health is low
        let healAmount = 15;
        if (this.creature.health < 30) {
            healAmount = 30;
        } else if (this.creature.health > 80) {
            healAmount = 5;
        }
        
        this.creature.addHealth(healAmount);
        this.creature.recordInteraction('gentle', 1);
        
        this.lastMedicineTime = currentTime;
        
        // Show medicine effect
        this.showMedicineEffect();
        
        if (window.tamagotchiGame) {
            if (this.creature.health < 50) {
                window.tamagotchiGame.addChatMessage('System', `${this.creature.name} feels much better! 💊✨`, 'system');
            } else {
                window.tamagotchiGame.addChatMessage('System', `${this.creature.name} is already healthy! 💪`, 'system');
            }
        }
        
        return true;
    }

    // Visual effects for actions
    showFeedingEffect() {
        const effect = document.createElement('div');
        effect.innerHTML = '🍎';
        effect.style.position = 'absolute';
        effect.style.fontSize = '24px';
        effect.style.left = '50%';
        effect.style.top = '30%';
        effect.style.transform = 'translate(-50%, -50%)';
        effect.style.animation = 'floatUp 1s ease-out forwards';
        effect.style.pointerEvents = 'none';
        
        document.getElementById('interactionEffects').appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1000);
    }

    showPlayEffect() {
        const effects = ['⚽', '🎾', '🎯', '🎪'];
        const effect = document.createElement('div');
        effect.innerHTML = effects[Math.floor(Math.random() * effects.length)];
        effect.style.position = 'absolute';
        effect.style.fontSize = '20px';
        effect.style.left = (30 + Math.random() * 40) + '%';
        effect.style.top = (30 + Math.random() * 40) + '%';
        effect.style.animation = 'sparkle 1s ease-out forwards';
        effect.style.pointerEvents = 'none';
        
        document.getElementById('interactionEffects').appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1000);
        
        // Trigger creature bounce animation
        this.creature.element.style.animation = 'bounce 0.5s ease-in-out 3';
        setTimeout(() => {
            this.creature.element.style.animation = '';
        }, 1500);
    }

    showMedicineEffect() {
        const effect = document.createElement('div');
        effect.innerHTML = '✨💊✨';
        effect.style.position = 'absolute';
        effect.style.fontSize = '18px';
        effect.style.left = '50%';
        effect.style.top = '40%';
        effect.style.transform = 'translate(-50%, -50%)';
        effect.style.animation = 'sparkle 2s ease-out forwards';
        effect.style.pointerEvents = 'none';
        
        document.getElementById('interactionEffects').appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 2000);
    }

    // Emergency revival (in case creature dies)
    emergencyRevive() {
        if (this.creature.isAlive) return false;
        
        this.creature.revive();
        
        if (window.tamagotchiGame) {
            window.tamagotchiGame.addChatMessage('System', `${this.creature.name} has been revived! Please take better care! 🌟`, 'system');
        }
        
        return true;
    }

    // Get status summary for debugging/display
    getStatusSummary() {
        return {
            hunger: Math.round(this.creature.hunger),
            happiness: Math.round(this.creature.happiness),
            health: Math.round(this.creature.health),
            energy: Math.round(this.creature.energy),
            mood: this.creature.mood,
            isAlive: this.creature.isAlive,
            isSleeping: this.creature.isSleeping,
            trustLevel: Math.round(this.creature.trustLevel)
        };
    }
}
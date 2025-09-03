// Enhanced NeedsSystem - integrates with complex emotional states and cognitive architecture
class NeedsSystem {
    constructor(creature) {
        this.creature = creature;
        this.isActive = true;
        
        // Adjusted decay rates for more realistic progression
        this.hungerDecayRate = 0.25;     // per minute
        this.happinessDecayRate = 0.15;  // per minute
        this.energyDecayRate = 0.2;      // per minute (when awake)
        this.healthDecayRate = 0.08;     // per minute
        
        // New emotional decay rates
        this.trustDecayRate = 0.05;      // very slow natural decay
        this.aggressionDecayRate = 0.1;  // aggression fades over time
        this.anxietyBaseLevel = 20;      // baseline anxiety level
        
        // Last update timestamp
        this.lastUpdate = Date.now();
        
        // Activity cooldowns
        this.lastFeedTime = 0;
        this.lastPlayTime = 0;
        this.lastMedicineTime = 0;
        
        // Environmental factors
        this.environmentalStress = 0;
        this.socialComfort = 50;
        
        // Cognitive integration
        this.conceptualMemory = null;
        this.cognitiveProcessor = null;
        
        this.init();
    }

    init() {
        console.log('Enhanced needs system initialized');
    }

    // COGNITIVE SYSTEM INTEGRATION
    setCognitiveComponents(conceptualMemory, cognitiveProcessor) {
        this.conceptualMemory = conceptualMemory;
        this.cognitiveProcessor = cognitiveProcessor;
    }

    // MAIN UPDATE FUNCTION
    update() {
        if (!this.isActive || !this.creature.isAlive) return;
        
        const currentTime = Date.now();
        const timeDelta = (currentTime - this.lastUpdate) / (1000 * 60); // minutes
        
        // Apply natural decay with personality modifications
        this.applyNaturalDecay(timeDelta);
        
        // Apply emotional interactions
        this.processEmotionalDynamics(timeDelta);
        
        // Check for critical states
        this.checkCriticalStates();
        
        // Update environmental factors
        this.updateEnvironmentalFactors();
        
        // Update UI warnings
        this.updateWarnings();
        
        this.lastUpdate = currentTime;
    }

    applyNaturalDecay(timeDelta) {
        if (timeDelta <= 0) return;
        
        // Personality-modified decay rates
        const personalityMod = this.calculatePersonalityModifier();
        
        // Hunger decay (affected by metabolism personality)
        const hungerDecay = this.hungerDecayRate * timeDelta * personalityMod.metabolism;
        this.creature.decreaseHunger(hungerDecay);
        
        // Happiness decay (affected by emotional stability)
        const interactionGap = Date.now() - this.creature.lastInteraction;
        if (interactionGap > 180000) { // 3 minutes without interaction
            const lonelinessFactor = 1 + (this.creature.personalityTraits.affectionNeed * 0.5);
            const happinessDecay = this.happinessDecayRate * timeDelta * lonelinessFactor;
            this.creature.decreaseHappiness(happinessDecay);
        }
        
        // Energy decay when awake
        if (!this.creature.isSleeping) {
            const energyDecay = this.energyDecayRate * timeDelta * personalityMod.activity;
            this.creature.decreaseEnergy(energyDecay);
        } else {
            // Energy restoration during sleep
            const restQuality = this.calculateSleepQuality();
            const energyRestore = 3 * timeDelta * restQuality;
            this.creature.addEnergy(energyRestore);
        }
        
        // Health effects based on multiple factors
        this.applyHealthEffects(timeDelta);
    }

    calculatePersonalityModifier() {
        const traits = this.creature.personalityTraits;
        return {
            metabolism: 0.8 + (traits.conscientiousness * 0.4), // disciplined eating
            activity: 0.7 + (traits.extraversion * 0.6), // social energy consumption  
            resilience: 0.5 + (traits.resilience * 1.0), // stress resistance
            stability: 0.6 + ((1 - traits.neuroticism) * 0.8) // emotional stability
        };
    }

    applyHealthEffects(timeDelta) {
        let healthChange = 0;
        
        // Negative health factors
        if (this.creature.hunger < 20) {
            healthChange -= this.healthDecayRate * timeDelta * 3; // starvation
        }
        
        if (this.creature.happiness < 20) {
            healthChange -= this.healthDecayRate * timeDelta * 2; // depression effect
        }
        
        if (this.creature.aggressionLevel > 70) {
            healthChange -= this.healthDecayRate * timeDelta * 1.5; // stress from anger
        }
        
        if (this.creature.socialAnxiety > 80) {
            healthChange -= this.healthDecayRate * timeDelta; // anxiety stress
        }
        
        // Positive health factors
        if (this.creature.hunger > 70 && this.creature.happiness > 60 && this.creature.trustLevel > 50) {
            healthChange += this.healthDecayRate * timeDelta * 0.8; // thriving condition
        }
        
        // Apply health change
        if (healthChange < 0) {
            this.creature.decreaseHealth(-healthChange);
        } else if (healthChange > 0) {
            this.creature.addHealth(healthChange);
        }
    }

    processEmotionalDynamics(timeDelta) {
        // Trust level changes
        this.updateTrustLevel(timeDelta);
        
        // Aggression level changes
        this.updateAggressionLevel(timeDelta);
        
        // Social anxiety changes
        this.updateSocialAnxiety(timeDelta);
        
        // Attachment level changes
        this.updateAttachmentLevel(timeDelta);
        
        // Frustration changes
        this.updateFrustrationLevel(timeDelta);
    }

    updateTrustLevel(timeDelta) {
        // Trust naturally decays very slowly without positive interaction
        const trustDecay = this.trustDecayRate * timeDelta;
        
        // But stabilizes at personality-based baseline
        const personalityBaseline = 30 + (this.creature.personalityTraits.agreeableness * 40);
        
        if (this.creature.trustLevel > personalityBaseline) {
            this.creature.trustLevel = Math.max(personalityBaseline, this.creature.trustLevel - trustDecay);
        } else if (this.creature.trustLevel < personalityBaseline && this.creature.aggressionLevel < 30) {
            this.creature.trustLevel = Math.min(personalityBaseline, this.creature.trustLevel + trustDecay * 0.5);
        }
    }

    updateAggressionLevel(timeDelta) {
        // Aggression naturally decays
        const aggressionDecay = this.aggressionDecayRate * timeDelta;
        this.creature.aggressionLevel = Math.max(0, this.creature.aggressionLevel - aggressionDecay);
        
        // But increases with unmet needs
        if (this.creature.hunger < 15) {
            this.creature.aggressionLevel = Math.min(100, this.creature.aggressionLevel + 0.3 * timeDelta);
        }
        
        if (this.creature.frustrationLevel > 60) {
            const frustrationToAggression = (this.creature.frustrationLevel - 60) * 0.01 * timeDelta;
            this.creature.aggressionLevel = Math.min(100, this.creature.aggressionLevel + frustrationToAggression);
        }
    }

    updateSocialAnxiety(timeDelta) {
        // Social anxiety gravitates toward personality baseline
        const personalityBaseline = this.anxietyBaseLevel + 
            (this.creature.personalityTraits.neuroticism * 50) - 
            (this.creature.personalityTraits.extraversion * 30);
        
        const targetAnxiety = Math.max(0, Math.min(100, personalityBaseline));
        
        if (this.creature.socialAnxiety > targetAnxiety) {
            this.creature.socialAnxiety = Math.max(targetAnxiety, 
                this.creature.socialAnxiety - 0.5 * timeDelta);
        } else if (this.creature.socialAnxiety < targetAnxiety) {
            this.creature.socialAnxiety = Math.min(targetAnxiety, 
                this.creature.socialAnxiety + 0.2 * timeDelta);
        }
    }

    updateAttachmentLevel(timeDelta) {
        // Attachment slowly increases with consistent positive care
        const recentInteractions = this.getRecentPositiveInteractions(600000); // 10 minutes
        
        if (recentInteractions > 2) {
            this.creature.attachmentLevel = Math.min(100, 
                this.creature.attachmentLevel + 0.1 * timeDelta);
        } else if (Date.now() - this.creature.lastInteraction > 900000) { // 15 minutes
            // Attachment decreases with neglect
            this.creature.attachmentLevel = Math.max(0, 
                this.creature.attachmentLevel - 0.05 * timeDelta);
        }
    }

    updateFrustrationLevel(timeDelta) {
        // Frustration increases with unmet needs
        let frustrationIncrease = 0;
        
        if (this.creature.hunger < 30) frustrationIncrease += 0.2;
        if (this.creature.health < 40) frustrationIncrease += 0.15;
        if (this.creature.energy < 20) frustrationIncrease += 0.1;
        
        // Loneliness increases frustration
        const timeSinceInteraction = Date.now() - this.creature.lastInteraction;
        if (timeSinceInteraction > 300000) { // 5 minutes
            frustrationIncrease += 0.3;
        }
        
        // Apply frustration change
        if (frustrationIncrease > 0) {
            this.creature.frustrationLevel = Math.min(100, 
                this.creature.frustrationLevel + frustrationIncrease * timeDelta);
        } else {
            // Frustration slowly decreases when needs are met
            this.creature.frustrationLevel = Math.max(0, 
                this.creature.frustrationLevel - 0.15 * timeDelta);
        }
    }

    calculateSleepQuality() {
        let quality = 1.0;
        
        // Sleep quality affected by emotional state
        if (this.creature.aggressionLevel > 50) {
            quality *= 0.7; // anger disrupts sleep
        }
        
        if (this.creature.socialAnxiety > 60) {
            quality *= 0.8; // anxiety disrupts sleep
        }
        
        if (this.creature.trustLevel > 70) {
            quality *= 1.2; // feeling safe improves sleep
        }
        
        return Math.max(0.3, Math.min(1.5, quality));
    }

    // ENHANCED ACTION METHODS
    feed() {
        const currentTime = Date.now();
        const timeSinceLastFeed = currentTime - this.lastFeedTime;
        
        // Check feeding constraints
        if (timeSinceLastFeed < 30000) {
            this.showFeedbackMessage(`${this.creature.name} is not hungry right now!`);
            return false;
        }
        
        // Calculate feed effectiveness based on multiple factors
        const hungerLevel = this.creature.hunger;
        const moodModifier = this.getMoodFeedingModifier();
        
        let feedAmount = 25 * moodModifier;
        
        if (hungerLevel > 80) {
            feedAmount = 8; // Less effective when full
        } else if (hungerLevel < 20) {
            feedAmount = 35; // More effective when very hungry
        }
        
        // Apply feeding
        this.creature.addHunger(feedAmount);
        this.creature.addHappiness(5 + (feedAmount * 0.2));
        
        // Emotional effects
        this.creature.frustrationLevel = Math.max(0, this.creature.frustrationLevel - 10);
        if (this.creature.aggressionLevel > 20) {
            this.creature.aggressionLevel = Math.max(0, this.creature.aggressionLevel - 8);
        }
        
        // Record interaction
        this.creature.recordComplexInteraction('fed', {
            feedAmount: feedAmount,
            hungerLevel: hungerLevel,
            effectiveness: feedAmount / 25
        }, { actionType: 'care' });
        
        this.lastFeedTime = currentTime;
        this.showFeedingEffect();
        
        // Generate contextual feedback
        this.generateFeedingFeedback(feedAmount, hungerLevel);
        
        return true;
    }

    getMoodFeedingModifier() {
        // Different moods affect feeding effectiveness
        const moodModifiers = {
            'happy': 1.2,
            'sad': 0.8,
            'angry': 0.6,
            'frustrated': 0.7,
            'lonely': 0.9,
            'neutral': 1.0
        };
        
        return moodModifiers[this.creature.mood] || 1.0;
    }

    play() {
        const currentTime = Date.now();
        const timeSinceLastPlay = currentTime - this.lastPlayTime;
        
        // Check play constraints
        if (this.creature.energy < 20) {
            this.showFeedbackMessage(`${this.creature.name} is too tired to play!`);
            return false;
        }
        
        if (this.creature.health < 25) {
            this.showFeedbackMessage(`${this.creature.name} doesn't feel well enough to play.`);
            return false;
        }
        
        if (this.creature.aggressionLevel > 70) {
            this.showFeedbackMessage(`${this.creature.name} is too angry to play right now.`);
            return false;
        }
        
        // Calculate play effectiveness
        const playfulness = this.creature.personalityTraits.playfulness;
        const energyLevel = this.creature.energy;
        
        const happinessGain = 15 + (playfulness * 10) + (energyLevel * 0.1);
        const energyCost = 12 - (this.creature.personalityTraits.extraversion * 3);
        
        // Apply play effects
        this.creature.addHappiness(happinessGain);
        this.creature.decreaseEnergy(Math.max(5, energyCost));
        
        // Emotional benefits
        this.creature.socialAnxiety = Math.max(0, this.creature.socialAnxiety - 5);
        this.creature.frustrationLevel = Math.max(0, this.creature.frustrationLevel - 15);
        this.creature.aggressionLevel = Math.max(0, this.creature.aggressionLevel - 10);
        
        // Trust building through play
        if (this.creature.trustLevel < 80) {
            this.creature.trustLevel = Math.min(100, this.creature.trustLevel + 3);
        }
        
        // Record interaction
        this.creature.recordComplexInteraction('played', {
            happinessGain: happinessGain,
            energyCost: energyCost,
            playfulness: playfulness
        }, { actionType: 'social' });
        
        this.lastPlayTime = currentTime;
        this.showPlayEffect();
        
        // Generate contextual feedback
        this.generatePlayFeedback(happinessGain);
        
        return true;
    }

    toggleSleep() {
        if (this.creature.isSleeping) {
            return this.wakeUp();
        } else {
            return this.goToSleep();
        }
    }

    goToSleep() {
        if (this.creature.energy > 85) {
            this.showFeedbackMessage(`${this.creature.name} is not sleepy right now!`);
            return false;
        }
        
        // Emotional factors affecting sleep
        if (this.creature.aggressionLevel > 60) {
            this.showFeedbackMessage(`${this.creature.name} is too agitated to sleep peacefully.`);
            // Still allow sleep but with reduced effectiveness
        }
        
        if (this.creature.socialAnxiety > 70) {
            this.showFeedbackMessage(`${this.creature.name} seems anxious but will try to rest.`);
        }
        
        this.creature.sleep();
        
        // Record sleep initiation
        this.creature.recordComplexInteraction('went_to_sleep', {
            voluntarily: true,
            energyLevel: this.creature.energy,
            emotionalState: {
                aggression: this.creature.aggressionLevel,
                anxiety: this.creature.socialAnxiety
            }
        });
        
        this.showFeedbackMessage(`${this.creature.name} is now sleeping... 😴`);
        return true;
    }

    wakeUp() {
        // Calculate sleep benefit
        const sleepQuality = this.calculateSleepQuality();
        const restfulness = Math.min(100, this.creature.energy * sleepQuality);
        
        this.creature.wakeUp();
        
        // Apply sleep benefits
        if (restfulness > 70) {
            this.creature.addHappiness(10);
            this.creature.socialAnxiety = Math.max(0, this.creature.socialAnxiety - 5);
        }
        
        // Record wake up
        this.creature.recordComplexInteraction('woke_up', {
            sleepQuality: sleepQuality,
            restfulness: restfulness,
            energyAfterSleep: this.creature.energy
        });
        
        const restMessage = restfulness > 70 ? 'refreshed' : restfulness > 40 ? 'okay' : 'still tired';
        this.showFeedbackMessage(`${this.creature.name} woke up feeling ${restMessage}!`);
        
        return true;
    }

    giveMedicine() {
        const currentTime = Date.now();
        const timeSinceLastMedicine = currentTime - this.lastMedicineTime;
        
        // Medicine constraints
        if (timeSinceLastMedicine < 120000) { // 2 minutes
            this.showFeedbackMessage(`${this.creature.name} doesn't need medicine right now!`);
            return false;
        }
        
        // Calculate medicine effectiveness
        const healthLevel = this.creature.health;
        let healAmount = 15;
        let trustImpact = 1;
        
        if (healthLevel < 30) {
            healAmount = 30; // More effective when very sick
            trustImpact = 2; // Grateful for help when really needed
        } else if (healthLevel > 80) {
            healAmount = 5; // Less effective when healthy
            trustImpact = 0; // Might be annoyed by unnecessary medicine
        }
        
        // Apply medicine effects
        this.creature.addHealth(healAmount);
        
        // Emotional effects depend on necessity
        if (healthLevel < 50) {
            // Medicine was needed - positive emotional response
            this.creature.trustLevel = Math.min(100, this.creature.trustLevel + (3 * trustImpact));
            this.creature.addHappiness(5);
            this.creature.socialAnxiety = Math.max(0, this.creature.socialAnxiety - 3);
        } else {
            // Medicine wasn't really needed - neutral to negative response
            if (this.creature.personalityTraits.agreeableness < 0.5) {
                this.creature.aggressionLevel = Math.min(100, this.creature.aggressionLevel + 2);
            }
        }
        
        // Record interaction
        this.creature.recordComplexInteraction('given_medicine', {
            healAmount: healAmount,
            healthLevel: healthLevel,
            wasNeeded: healthLevel < 50,
            trustImpact: trustImpact
        }, { actionType: 'medical_care' });
        
        this.lastMedicineTime = currentTime;
        this.showMedicineEffect();
        
        // Generate contextual feedback
        this.generateMedicineFeedback(healAmount, healthLevel);
        
        return true;
    }

    // CRISIS MANAGEMENT
    checkCriticalStates() {
        const criticalThresholds = {
            health: 15,
            hunger: 10,
            energy: 8
        };
        
        // Health crisis
        if (this.creature.health < criticalThresholds.health) {
            this.triggerHealthCrisis();
        }
        
        // Starvation crisis
        if (this.creature.hunger < criticalThresholds.hunger) {
            this.triggerStarvationCrisis();
        }
        
        // Exhaustion crisis
        if (this.creature.energy < criticalThresholds.energy && !this.creature.isSleeping) {
            this.triggerExhaustionCrisis();
        }
        
        // Emotional crisis
        if (this.creature.aggressionLevel > 85 || this.creature.socialAnxiety > 90) {
            this.triggerEmotionalCrisis();
        }
        
        // Attachment crisis (severe neglect)
        if (this.creature.attachmentLevel < 5 && this.creature.trustLevel < 10) {
            this.triggerAttachmentCrisis();
        }
    }

    triggerHealthCrisis() {
        this.showCrisisMessage('HEALTH CRISIS', `${this.creature.name} is critically ill! 🚨 Give medicine immediately!`);
        this.creature.aggressionLevel = Math.min(100, this.creature.aggressionLevel + 5);
        this.showEmergencyEffect('health');
    }

    triggerStarvationCrisis() {
        this.showCrisisMessage('STARVATION CRISIS', `${this.creature.name} is starving! 🚨 Feed immediately!`);
        this.creature.aggressionLevel = Math.min(100, this.creature.aggressionLevel + 10);
        this.creature.frustrationLevel = Math.min(100, this.creature.frustrationLevel + 15);
        this.showEmergencyEffect('starvation');
    }

    triggerExhaustionCrisis() {
        this.showCrisisMessage('EXHAUSTION CRISIS', `${this.creature.name} is exhausted! 🚨 Let them sleep!`);
        this.creature.socialAnxiety = Math.min(100, this.creature.socialAnxiety + 8);
        this.showEmergencyEffect('exhaustion');
    }

    triggerEmotionalCrisis() {
        if (this.creature.aggressionLevel > 85) {
            this.showCrisisMessage('EMOTIONAL CRISIS', `${this.creature.name} is extremely agitated! They need gentle care and patience.`);
        } else {
            this.showCrisisMessage('ANXIETY CRISIS', `${this.creature.name} is overwhelmed with anxiety! They need comfort and reassurance.`);
        }
        this.showEmergencyEffect('emotional');
    }

    triggerAttachmentCrisis() {
        this.showCrisisMessage('ATTACHMENT CRISIS', `${this.creature.name} feels completely abandoned and has lost trust. This will take time to heal.`);
        this.creature.mood = 'despair';
        this.showEmergencyEffect('attachment');
    }

    // UTILITY METHODS
    updateEnvironmentalFactors() {
        // Environmental stress based on creature's current state
        this.environmentalStress = 0;
        
        if (this.creature.aggressionLevel > 60) {
            this.environmentalStress += 20;
        }
        
        if (this.creature.socialAnxiety > 70) {
            this.environmentalStress += 15;
        }
        
        // Social comfort based on recent interactions
        const recentInteractionCount = this.getRecentPositiveInteractions(300000); // 5 minutes
        this.socialComfort = Math.min(100, 30 + (recentInteractionCount * 15));
    }

    getRecentPositiveInteractions(timeWindow) {
        if (!this.creature.interactionHistory) return 0;
        
        const cutoff = Date.now() - timeWindow;
        return this.creature.interactionHistory
            .filter(interaction => interaction.timestamp > cutoff && interaction.positive)
            .length;
    }

    updateWarnings() {
        const needs = ['hunger', 'happiness', 'health', 'energy'];
        const emotions = ['trust', 'attachment', 'aggression', 'anxiety'];
        
        // Update basic needs warnings
        needs.forEach(need => {
            const bar = document.getElementById(`${need}Bar`);
            const value = this.creature[need];
            
            if (bar) {
                bar.classList.remove('low', 'critical', 'urgent');
                
                if (value < 10) {
                    bar.classList.add('critical', 'urgent');
                } else if (value < 25) {
                    bar.classList.add('low');
                }
            }
        });
        
        // Update emotional state warnings
        const trustBar = document.getElementById('trustBar');
        if (trustBar) {
            trustBar.classList.remove('low', 'critical', 'high');
            if (this.creature.trustLevel < 20) {
                trustBar.classList.add('critical');
            } else if (this.creature.trustLevel < 40) {
                trustBar.classList.add('low');
            } else if (this.creature.trustLevel > 80) {
                trustBar.classList.add('high');
            }
        }
        
        const aggressionBar = document.getElementById('aggressionBar');
        if (aggressionBar) {
            aggressionBar.classList.remove('low', 'critical', 'high');
            if (this.creature.aggressionLevel > 70) {
                aggressionBar.classList.add('critical');
            } else if (this.creature.aggressionLevel > 50) {
                aggressionBar.classList.add('high');
            }
        }
    }

    // FEEDBACK AND EFFECTS
    generateFeedingFeedback(feedAmount, hungerLevel) {
        let messages = [];
        
        if (hungerLevel < 20) {
            messages = [
                `${this.creature.name} devours the food hungrily! 🍎`,
                `${this.creature.name} was so hungry! They feel much better now. 😌`,
                `That hit the spot! ${this.creature.name} looks relieved. 🙂`
            ];
        } else if (hungerLevel > 80) {
            messages = [
                `${this.creature.name} nibbles politely but isn't very hungry. 😐`,
                `${this.creature.name} takes a small bite. They're pretty full already.`,
                `${this.creature.name} appreciates the gesture but is quite satisfied. 😊`
            ];
        } else {
            messages = [
                `${this.creature.name} enjoys the meal! 😋`,
                `Nom nom! ${this.creature.name} is content. 🍽️`,
                `${this.creature.name} thanks you for the food! 🙏`
            ];
        }
        
        this.showFeedbackMessage(messages[Math.floor(Math.random() * messages.length)]);
    }

    generatePlayFeedback(happinessGain) {
        let messages = [];
        
        if (happinessGain > 25) {
            messages = [
                `${this.creature.name} is having the time of their life! 🎉`,
                `What an amazing play session! ${this.creature.name} is ecstatic! ⭐`,
                `${this.creature.name} is practically bouncing with joy! 🎾`
            ];
        } else if (happinessGain < 15) {
            messages = [
                `${this.creature.name} played along but seems distracted. 😕`,
                `${this.creature.name} participated but their heart wasn't in it. 😐`,
                `Play time was okay, but ${this.creature.name} seems to have other things on their mind. 🤔`
            ];
        } else {
            messages = [
                `${this.creature.name} had fun playing with you! 😄`,
                `Great play session! ${this.creature.name} is happy and energized! 🎯`,
                `${this.creature.name} loves spending time with you! ❤️`
            ];
        }
        
        this.showFeedbackMessage(messages[Math.floor(Math.random() * messages.length)]);
    }

    generateMedicineFeedback(healAmount, healthLevel) {
        let messages = [];
        
        if (healthLevel < 30) {
            messages = [
                `${this.creature.name} feels much better! The medicine really helped! 💊✨`,
                `That was exactly what ${this.creature.name} needed! They look relieved. 😌`,
                `${this.creature.name} is grateful for your care! Their health is improving. 🌟`
            ];
        } else if (healthLevel > 80) {
            messages = [
                `${this.creature.name} is already quite healthy, but appreciates your concern. 💪`,
                `${this.creature.name} takes the medicine dutifully, though they feel fine. 😐`,
                `${this.creature.name} seems puzzled by the medicine but trusts your judgment. 🤷`
            ];
        } else {
            messages = [
                `${this.creature.name} feels a bit better after the medicine. 💊`,
                `The medicine helps ${this.creature.name} feel more stable. ⚖️`,
                `${this.creature.name} trusts you to know what's best for their health. 💙`
            ];
        }
        
        this.showFeedbackMessage(messages[Math.floor(Math.random() * messages.length)]);
    }

    showFeedbackMessage(message) {
        if (window.tamagotchiGame) {
            window.tamagotchiGame.addChatMessage('System', message, 'system');
        }
    }

    showCrisisMessage(title, message) {
        if (window.tamagotchiGame) {
            window.tamagotchiGame.addChatMessage(title, message, 'emergency');
        }
    }

    // VISUAL EFFECTS
    showFeedingEffect() {
        this.createEffect('🍎', 'feeding-effect');
    }

    showPlayEffect() {
        const playEffects = ['⚽', '🎾', '🎯', '🎪', '🎨'];
        const effect = playEffects[Math.floor(Math.random() * playEffects.length)];
        this.createEffect(effect, 'play-effect');
        
        // Trigger creature animation
        if (this.creature.element) {
            this.creature.element.style.animation = 'bounce 0.5s ease-in-out 3';
setTimeout(() => {
               this.creature.element.style.animation = '';
           }, 1500);
       }
   }

   showMedicineEffect() {
       this.createEffect('💊✨', 'medicine-effect');
   }

   showEmergencyEffect(type) {
       const emergencyEffects = {
           health: '🚨💊',
           starvation: '🚨🍎',
           exhaustion: '🚨😴',
           emotional: '🚨💔',
           attachment: '🚨💙'
       };
       
       const effect = emergencyEffects[type] || '🚨';
       this.createEffect(effect, 'emergency-effect');
       
       // Shake creature for emergency
       if (this.creature.element) {
           this.creature.element.style.animation = 'shake 0.5s ease-in-out infinite';
           setTimeout(() => {
               this.creature.element.style.animation = '';
           }, 3000);
       }
   }

   createEffect(emoji, className) {
       const effectsContainer = document.getElementById('interactionEffects');
       if (!effectsContainer) return;
       
       const effect = document.createElement('div');
       effect.innerHTML = emoji;
       effect.className = `interaction-effect ${className}`;
       effect.style.position = 'absolute';
       effect.style.fontSize = '24px';
       effect.style.left = (30 + Math.random() * 40) + '%';
       effect.style.top = (20 + Math.random() * 60) + '%';
       effect.style.animation = 'floatUp 2s ease-out forwards';
       effect.style.pointerEvents = 'none';
       effect.style.zIndex = '1000';
       
       effectsContainer.appendChild(effect);
       
       setTimeout(() => {
           if (effect.parentNode) {
               effect.parentNode.removeChild(effect);
           }
       }, 2000);
   }

   // EMERGENCY REVIVAL
   emergencyRevive() {
       if (this.creature.isAlive) return false;
       
       this.creature.revive();
       
       // Post-revival state adjustments
       this.creature.trustLevel = Math.max(10, this.creature.trustLevel - 15);
       this.creature.socialAnxiety = Math.min(100, this.creature.socialAnxiety + 20);
       this.creature.attachmentLevel = Math.max(0, this.creature.attachmentLevel - 10);
       
       // Record the revival
       if (this.conceptualMemory) {
           this.conceptualMemory.recordEpisode('creature_revived', {
               previousDeathCause: this.creature.deathCause || 'unknown',
               emotionalImpact: 'severe',
               trustDamage: true
           });
       }
       
       this.showFeedbackMessage(`${this.creature.name} has been revived! They remember what happened and seem more cautious now.`);
       
       return true;
   }

   // STATUS REPORTING
   getStatusSummary() {
       return {
           // Basic needs
           hunger: Math.round(this.creature.hunger),
           happiness: Math.round(this.creature.happiness),
           health: Math.round(this.creature.health),
           energy: Math.round(this.creature.energy),
           
           // Emotional state
           mood: this.creature.mood,
           trustLevel: Math.round(this.creature.trustLevel),
           attachmentLevel: Math.round(this.creature.attachmentLevel),
           aggressionLevel: Math.round(this.creature.aggressionLevel),
           socialAnxiety: Math.round(this.creature.socialAnxiety),
           frustrationLevel: Math.round(this.creature.frustrationLevel),
           
           // Meta status
           isAlive: this.creature.isAlive,
           isSleeping: this.creature.isSleeping,
           attachmentStyle: this.creature.attachmentStyle,
           
           // Environmental factors
           environmentalStress: Math.round(this.environmentalStress),
           socialComfort: Math.round(this.socialComfort),
           
           // Activity status
           canFeed: Date.now() - this.lastFeedTime > 30000,
           canPlay: this.creature.energy > 20 && this.creature.health > 25,
           canGiveMedicine: Date.now() - this.lastMedicineTime > 120000,
           shouldSleep: this.creature.energy < 30 && !this.creature.isSleeping,
           
           // Crisis indicators
           inCrisis: this.creature.health < 15 || this.creature.hunger < 10 || 
                    this.creature.aggressionLevel > 85 || this.creature.socialAnxiety > 90
       };
   }

   // PERSONALITY-BASED RECOMMENDATIONS
   getPersonalizedCareRecommendations() {
       const recommendations = [];
       const personality = this.creature.personalityTraits;
       
       // Based on personality traits
       if (personality.affectionNeed > 0.7 && Date.now() - this.creature.lastInteraction > 180000) {
           recommendations.push({
               type: 'social',
               priority: 'high',
               message: `${this.creature.name} has a high need for affection and hasn't been interacted with recently.`
           });
       }
       
       if (personality.playfulness > 0.6 && this.creature.energy > 50 && Date.now() - this.lastPlayTime > 300000) {
           recommendations.push({
               type: 'play',
               priority: 'medium',
               message: `${this.creature.name} is naturally playful and would enjoy some interactive time.`
           });
       }
       
       if (personality.neuroticism > 0.6 && this.creature.socialAnxiety > 60) {
           recommendations.push({
               type: 'comfort',
               priority: 'medium',
               message: `${this.creature.name} tends toward anxiety and could use gentle, reassuring interactions.`
           });
       }
       
       // Based on current state
       if (this.creature.aggressionLevel > 50) {
           recommendations.push({
               type: 'patience',
               priority: 'high',
               message: `${this.creature.name} is feeling aggressive. Give them space and gentle care to help them calm down.`
           });
       }
       
       if (this.creature.trustLevel < 30) {
           recommendations.push({
               type: 'trust_building',
               priority: 'high',
               message: `${this.creature.name} has low trust. Consistent, gentle care will help rebuild their confidence.`
           });
       }
       
       return recommendations.sort((a, b) => {
           const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
           return priorityOrder[b.priority] - priorityOrder[a.priority];
       });
   }

   // INTEGRATION METHODS
   recordMemoryEvent(eventType, details) {
       if (this.conceptualMemory) {
           this.conceptualMemory.recordEpisode(eventType, details, {
               creatureState: {
                   mood: this.creature.mood,
                   trustLevel: this.creature.trustLevel,
                   needs: {
                       hunger: this.creature.hunger,
                       happiness: this.creature.happiness,
                       health: this.creature.health,
                       energy: this.creature.energy
                   }
               },
               environmentalFactors: {
                   stress: this.environmentalStress,
                   comfort: this.socialComfort
               }
           });
       }
   }

   processHypothesisTest(hypothesis, outcome) {
       if (this.cognitiveProcessor) {
           // Help cognitive processor evaluate needs-related hypotheses
           if (hypothesis.id === 'feeding_reduces_aggression' && outcome.actionType === 'feed') {
               const aggressionBefore = outcome.aggressionBefore || this.creature.aggressionLevel + 8;
               const aggressionAfter = this.creature.aggressionLevel;
               
               return {
                   relevant: true,
                   supports: aggressionAfter < aggressionBefore,
                   evidence: { before: aggressionBefore, after: aggressionAfter }
               };
           }
       }
       
       return { relevant: false };
   }

   // CLEANUP
   destroy() {
       this.isActive = false;
       console.log('Needs system deactivated');
   }
}
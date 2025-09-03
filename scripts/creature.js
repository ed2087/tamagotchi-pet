// Enhanced Creature class - integrates with advanced cognitive architecture
class Creature {
    constructor() {
        // Basic identity generateMoodBasedThought()
        this.name = '';
        this.age = 0; // in hours
        this.birthTime = Date.now();
        
        // Core needs (0-100)
        this.hunger = 100;
        this.happiness = 100;
        this.health = 100;
        this.energy = 100;
        
        // Enhanced emotional system
        this.mood = 'neutral';
        this.isAlive = true;
        this.isSleeping = false;
        this.evolutionStage = 1;
        
        // New emotional complexity
        this.trustLevel = 50;
        this.attachmentLevel = 10; // starts low, grows with positive interactions
        this.aggressionLevel = 0;
        this.socialAnxiety = 20;
        this.frustrationLevel = 0;
        
        // Interaction tracking
        this.lastInteraction = Date.now();
        this.totalInteractions = 0;
        this.interactionHistory = [];
        
        // Cognitive integration
        this.entityManager = null;
        this.conceptualMemory = null;
        this.cognitiveProcessor = null;
        
        // Personality development
        this.personalityTraits = this.generatePersonality();
        this.attachmentStyle = 'developing'; // secure, anxious, avoidant, disorganized
        this.learningStyle = 'observational'; // observational, experimental, social
        
        // Advanced behavior states
        this.currentThoughts = [];
        this.emotionalMemory = new Map(); // remember emotional events
        this.behaviorPatterns = new Map(); // learned behavior patterns
        
        // Visual elements
        this.element = document.getElementById('creature');
        this.leftEye = document.getElementById('leftEye');
        this.rightEye = document.getElementById('rightEye');
        this.mouth = document.getElementById('mouth');
        this.thoughtBubble = document.getElementById('thoughtBubble');
        
        // Animation states
        this.isBlinking = false;
        this.isSpeaking = false;
        this.currentAnimation = '';
        
        this.init();
    }

    init() {
        this.startBlinkTimer();
        this.startEmotionalProcessing();
        this.startBehaviorLearning();
        console.log('Enhanced creature initialized');
    }

    // INTEGRATION WITH COGNITIVE SYSTEMS
    setCognitiveComponents(entityManager, conceptualMemory, cognitiveProcessor) {
        this.entityManager = entityManager;
        this.conceptualMemory = conceptualMemory;
        this.cognitiveProcessor = cognitiveProcessor;
        
        console.log('Creature connected to cognitive systems');
    }

    // PERSONALITY AND ATTACHMENT DEVELOPMENT
    generatePersonality() {
        return {
            openness: Math.random(), // willingness to try new things
            conscientiousness: Math.random(), // how organized/reliable
            extraversion: Math.random(), // social energy level
            agreeableness: Math.random(), // cooperative vs competitive
            neuroticism: Math.random(), // emotional stability
            
            // Creature-specific traits
            playfulness: 0.3 + Math.random() * 0.7,
            curiosity: 0.4 + Math.random() * 0.6,
            affectionNeed: 0.2 + Math.random() * 0.8,
            independence: Math.random(),
            resilience: 0.3 + Math.random() * 0.7
        };
    }

    updateAttachmentStyle() {
        const positiveInteractions = this.interactionHistory.filter(i => i.positive).length;
        const totalInteractions = this.interactionHistory.length;
        const consistencyScore = this.calculateInteractionConsistency();
        
        if (totalInteractions < 10) {
            this.attachmentStyle = 'developing';
        } else {
            const positiveRatio = positiveInteractions / totalInteractions;
            
            if (positiveRatio > 0.7 && consistencyScore > 0.6) {
                this.attachmentStyle = 'secure';
            } else if (positiveRatio > 0.5 && consistencyScore < 0.4) {
                this.attachmentStyle = 'anxious';
            } else if (positiveRatio < 0.4 && this.aggressionLevel > 30) {
                this.attachmentStyle = 'avoidant';
            } else {
                this.attachmentStyle = 'disorganized';
            }
        }
        
        // Attachment style affects behavior
        this.adjustBehaviorForAttachment();
    }

    adjustBehaviorForAttachment() {
        switch (this.attachmentStyle) {
            case 'secure':
                this.personalityTraits.affectionNeed *= 0.9;
                this.socialAnxiety = Math.max(5, this.socialAnxiety - 5);
                break;
            case 'anxious':
                this.personalityTraits.affectionNeed *= 1.3;
                this.socialAnxiety = Math.min(80, this.socialAnxiety + 10);
                break;
            case 'avoidant':
                this.personalityTraits.independence *= 1.2;
                this.aggressionLevel = Math.min(60, this.aggressionLevel + 5);
                break;
            case 'disorganized':
                // Unpredictable behavior - handled elsewhere
                break;
        }
    }

    calculateInteractionConsistency() {
        if (this.interactionHistory.length < 5) return 0.5;
        
        const recent = this.interactionHistory.slice(-10);
        const intervals = [];
        
        for (let i = 1; i < recent.length; i++) {
            intervals.push(recent[i].timestamp - recent[i-1].timestamp);
        }
        
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((acc, interval) => 
            acc + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
        
        // Lower variance = more consistency
        return Math.max(0, 1 - (variance / (avgInterval * avgInterval)));
    }

    // ENHANCED EMOTIONAL SYSTEM
    startEmotionalProcessing() {
        setInterval(() => {
            this.processEmotions();
        }, 5000);
    }

    processEmotions() {
        if (!this.isAlive) return;
        
        // Process complex emotional states
        this.updateFrustrationLevel();
        this.updateTrustDynamics();
        this.updateSocialAnxiety();
        this.processEmotionalMemory();
        
        // Update overall mood based on multiple factors
        this.updateComplexMood();
    }

    updateFrustrationLevel() {
        const timeSinceLastInteraction = Date.now() - this.lastInteraction;
        
        // Frustration increases without interaction (based on personality)
        if (timeSinceLastInteraction > 120000) { // 2 minutes
            const frustrationIncrease = (1 - this.personalityTraits.independence) * 2;
            this.frustrationLevel = Math.min(100, this.frustrationLevel + frustrationIncrease);
        } else {
            // Frustration decreases with positive interaction
            this.frustrationLevel = Math.max(0, this.frustrationLevel - 1);
        }
        
        // High frustration can lead to aggression
        if (this.frustrationLevel > 60) {
            this.aggressionLevel = Math.min(80, this.aggressionLevel + 0.5);
        }
    }

    updateTrustDynamics() {
        // Trust changes based on recent interactions
        const recentInteractions = this.interactionHistory.slice(-5);
        
        if (recentInteractions.length > 0) {
            const positiveCount = recentInteractions.filter(i => i.positive).length;
            const negativeCount = recentInteractions.filter(i => !i.positive).length;
            
            if (positiveCount > negativeCount) {
                this.trustLevel = Math.min(100, this.trustLevel + 0.5);
            } else if (negativeCount > positiveCount) {
                this.trustLevel = Math.max(0, this.trustLevel - 1);
            }
        }
    }

    updateSocialAnxiety() {
        // Social anxiety affected by trust level and personality
        const baseAnxiety = (1 - this.personalityTraits.extraversion) * 30;
        const trustInfluence = (100 - this.trustLevel) * 0.3;
        const attachmentInfluence = this.attachmentStyle === 'anxious' ? 15 : 0;
        
        this.socialAnxiety = Math.max(0, Math.min(100, 
            baseAnxiety + trustInfluence + attachmentInfluence));
    }

    processEmotionalMemory() {
        // Strengthen or weaken emotional memories based on time and significance
        for (let [event, memory] of this.emotionalMemory.entries()) {
            const age = Date.now() - memory.timestamp;
            
            // Important emotional events are remembered longer
            if (memory.importance > 0.7) {
                memory.strength = Math.max(0.3, memory.strength * 0.999);
            } else {
                memory.strength = Math.max(0, memory.strength * 0.995);
            }
            
            // Remove very weak memories
            if (memory.strength < 0.1) {
                this.emotionalMemory.delete(event);
            }
        }
    }

    updateComplexMood() {
        const moodFactors = {
            physical: this.calculatePhysicalWellbeing(),
            emotional: this.calculateEmotionalWellbeing(),
            social: this.calculateSocialWellbeing(),
            cognitive: this.calculateCognitiveState()
        };
        
        // Determine dominant mood
        let newMood = 'neutral';
        
        if (moodFactors.physical < 0.3) {
            newMood = this.health < 30 ? 'sick' : 'tired';
        } else if (moodFactors.social < 0.3) {
            newMood = 'lonely';
        } else if (this.aggressionLevel > 50) {
            newMood = 'angry';
        } else if (this.frustrationLevel > 60) {
            newMood = 'frustrated';
        } else if (moodFactors.emotional > 0.7 && moodFactors.social > 0.6) {
            newMood = 'happy';
        } else if (moodFactors.emotional < 0.4) {
            newMood = 'sad';
        }
        
        // Mood change triggers
        if (newMood !== this.mood) {
            this.onMoodChange(this.mood, newMood);
            this.mood = newMood;
        }
        
        this.updateAppearance();
    }

    calculatePhysicalWellbeing() {
        return (this.hunger + this.health + this.energy) / 300;
    }

    calculateEmotionalWellbeing() {
        return (this.happiness + this.trustLevel + (100 - this.aggressionLevel)) / 300;
    }

    calculateSocialWellbeing() {
        const timeSinceInteraction = Date.now() - this.lastInteraction;
        const interactionRecency = Math.max(0, 1 - (timeSinceInteraction / 300000));
        const socialComfort = (100 - this.socialAnxiety) / 100;
        return (interactionRecency + socialComfort) / 2;
    }

    calculateCognitiveState() {
        if (!this.cognitiveProcessor) return 0.5;
        
        const cognitiveLoad = this.cognitiveProcessor.calculateCognitiveLoad();
        return Math.max(0, 1 - cognitiveLoad);
    }

    onMoodChange(oldMood, newMood) {
        console.log(`Mood changed: ${oldMood} → ${newMood}`);
        
        // Record mood change in memory systems
        if (this.conceptualMemory) {
            this.conceptualMemory.recordEpisode('mood_change', {
                from: oldMood,
                to: newMood,
                triggers: this.identifyMoodTriggers(newMood)
            });
        }
        
        // Adjust behavior based on new mood
        this.adjustBehaviorForMood(newMood);
        
        // Trigger mood-specific thoughts
        if (Math.random() < 0.4) {
            this.generateMoodBasedThought(newMood);
        }
    }

    identifyMoodTriggers(newMood) {
        const triggers = [];
        
        if (this.hunger < 30) triggers.push('hunger');
        if (this.health < 30) triggers.push('poor_health');
        if (this.energy < 20) triggers.push('fatigue');
        if (Date.now() - this.lastInteraction > 180000) triggers.push('loneliness');
        if (this.aggressionLevel > 40) triggers.push('frustration');
        if (this.trustLevel < 30) triggers.push('distrust');
        
        return triggers;
    }

    adjustBehaviorForMood(mood) {
        switch (mood) {
            case 'angry':
                this.personalityTraits.agreeableness *= 0.7;
                this.socialAnxiety = Math.min(100, this.socialAnxiety + 10);
                break;
            case 'happy':
                this.personalityTraits.playfulness *= 1.2;
                this.personalityTraits.extraversion *= 1.1;
                break;
            case 'sad':
                this.personalityTraits.extraversion *= 0.8;
                this.personalityTraits.affectionNeed *= 1.3;
                break;
            case 'frustrated':
                this.personalityTraits.patience *= 0.6;
                break;
        }
    }

    // ENHANCED INTERACTION PROCESSING
    recordComplexInteraction(type, details, context = {}) {
        const interaction = {
            type: type,
            details: details,
            context: context,
            timestamp: Date.now(),
            creatureState: {
                mood: this.mood,
                trustLevel: this.trustLevel,
                aggressionLevel: this.aggressionLevel,
                needs: {
                    hunger: this.hunger,
                    happiness: this.happiness,
                    health: this.health,
                    energy: this.energy
                }
            },
            positive: this.evaluateInteractionPositivity(type, details),
            intensity: details.intensity || 1
        };
        
        this.interactionHistory.push(interaction);
        this.processInteractionEffects(interaction);
        this.lastInteraction = Date.now();
        this.totalInteractions++;
        
        // Record in conceptual memory
        if (this.conceptualMemory) {
            this.conceptualMemory.recordEpisode(type, details, {
                creatureState: interaction.creatureState,
                peoplePresent: context.peoplePresent || [],
                emotionalState: this.mood
            });
        }
        
        // Update cognitive understanding
        if (this.cognitiveProcessor) {
            this.cognitiveProcessor.formHypothesis({
                type: type + '_observation',
                details: details,
                outcome: interaction.positive
            }, context);
        }
        
        // Trim old interactions
        if (this.interactionHistory.length > 100) {
            this.interactionHistory = this.interactionHistory.slice(-50);
        }
        
        return interaction;
    }

    evaluateInteractionPositivity(type, details) {
        const positiveTypes = ['fed', 'played', 'petted_gently', 'praised', 'comforted'];
        const negativeTypes = ['scolded', 'ignored', 'petted_roughly', 'frightened'];
        
        if (positiveTypes.includes(type)) return true;
        if (negativeTypes.includes(type)) return false;
        
        // Neutral interactions depend on context and creature state
        return this.happiness > 50 && this.trustLevel > 40;
    }

    processInteractionEffects(interaction) {
        const intensity = interaction.intensity || 1;
        
        if (interaction.positive) {
            this.processPositiveInteraction(interaction.type, intensity);
        } else {
            this.processNegativeInteraction(interaction.type, intensity);
        }
        
        // Update attachment development
        this.updateAttachmentLevel(interaction);
        
        // Create emotional memory
        this.createEmotionalMemory(interaction);
        
        // Update trust and relationship dynamics
        this.updateRelationshipDynamics(interaction);
    }

    processPositiveInteraction(type, intensity) {
        this.addHappiness(10 * intensity);
        this.trustLevel = Math.min(100, this.trustLevel + 3 * intensity);
        this.aggressionLevel = Math.max(0, this.aggressionLevel - 2 * intensity);
        this.frustrationLevel = Math.max(0, this.frustrationLevel - 5 * intensity);
        
        // Specific positive interaction effects
        switch (type) {
            case 'praised':
                this.addHappiness(15 * intensity);
                this.trustLevel = Math.min(100, this.trustLevel + 5 * intensity);
                break;
            case 'petted_gently':
                this.addHappiness(8 * intensity);
                this.socialAnxiety = Math.max(0, this.socialAnxiety - 3 * intensity);
                break;
            case 'played':
                this.addHappiness(12 * intensity);
                this.personalityTraits.playfulness = Math.min(1, this.personalityTraits.playfulness + 0.05);
                break;
        }
        
        this.showPositiveEffect();
    }

    processNegativeInteraction(type, intensity) {
        this.happiness = Math.max(0, this.happiness - 8 * intensity);
        this.trustLevel = Math.max(0, this.trustLevel - 5 * intensity);
        this.aggressionLevel = Math.min(100, this.aggressionLevel + 3 * intensity);
        this.frustrationLevel = Math.min(100, this.frustrationLevel + 4 * intensity);
        
        // Specific negative interaction effects
        switch (type) {
            case 'scolded':
                this.aggressionLevel = Math.min(100, this.aggressionLevel + 8 * intensity);
                this.socialAnxiety = Math.min(100, this.socialAnxiety + 5 * intensity);
                break;
            case 'ignored':
                this.frustrationLevel = Math.min(100, this.frustrationLevel + 10 * intensity);
                this.personalityTraits.affectionNeed = Math.min(1, this.personalityTraits.affectionNeed + 0.1);
                break;
            case 'petted_roughly':
                this.aggressionLevel = Math.min(100, this.aggressionLevel + 12 * intensity);
                this.trustLevel = Math.max(0, this.trustLevel - 10 * intensity);
                break;
        }
        
        this.showNegativeEffect();
    }

    updateAttachmentLevel(interaction) {
        if (interaction.positive && interaction.intensity > 1) {
            this.attachmentLevel = Math.min(100, this.attachmentLevel + 2);
        } else if (!interaction.positive && interaction.intensity > 1) {
            this.attachmentLevel = Math.max(0, this.attachmentLevel - 3);
        }
        
        // Update attachment style based on new level
        if (this.totalInteractions % 5 === 0) {
            this.updateAttachmentStyle();
        }
    }

    createEmotionalMemory(interaction) {
        const memoryKey = interaction.type + '_' + Date.now();
        const importance = this.calculateMemoryImportance(interaction);
        
        this.emotionalMemory.set(memoryKey, {
            interaction: interaction,
            importance: importance,
            strength: importance,
            timestamp: interaction.timestamp,
            associatedMood: this.mood,
            contextualFactors: {
                trustLevel: this.trustLevel,
                aggressionLevel: this.aggressionLevel,
                needsState: {
                    hunger: this.hunger,
                    happiness: this.happiness,
                    health: this.health,
                    energy: this.energy
                }
            }
        });
    }

    calculateMemoryImportance(interaction) {
        let importance = 0.3; // base importance
        
        // First-time events are more important
        const similarInteractions = this.interactionHistory.filter(i => i.type === interaction.type).length;
        if (similarInteractions === 1) importance += 0.4;
        
        // Intense interactions are more memorable
        importance += (interaction.intensity || 1) * 0.2;
        
        // Extreme emotional states make events more memorable
        if (this.aggressionLevel > 70 || this.happiness < 20 || this.trustLevel < 20) {
            importance += 0.3;
        }
        
        // Positive interactions during low mood are more significant
        if (interaction.positive && this.happiness < 40) {
            importance += 0.2;
        }
        
        return Math.min(1.0, importance);
    }

    updateRelationshipDynamics(interaction) {
        if (this.entityManager && interaction.context.personId) {
            const interactionType = interaction.positive ? 'positive_interaction' : 'negative_interaction';
            this.entityManager.updateRelationship(
                interaction.context.personId, 
                interactionType, 
                interaction.details
            );
        }
    }

    // BEHAVIOR LEARNING SYSTEM
    startBehaviorLearning() {
        setInterval(() => {
            this.learnBehaviorPatterns();
        }, 10000);
    }

    learnBehaviorPatterns() {
        if (this.interactionHistory.length < 5) return;
        
        // Analyze recent interaction patterns
        const patterns = this.identifyBehaviorPatterns();
        
        for (let pattern of patterns) {
            this.updateBehaviorPattern(pattern);
        }
    }

    identifyBehaviorPatterns() {
        const recent = this.interactionHistory.slice(-20);
        const patterns = [];
        
        // Pattern: Sequence of interactions
        for (let i = 0; i < recent.length - 2; i++) {
            const sequence = recent.slice(i, i + 3);
            const sequenceKey = sequence.map(s => s.type).join('-');
            
            patterns.push({
                type: 'sequence',
                pattern: sequenceKey,
                outcome: sequence[2].positive,
                frequency: 1
            });
        }
        
        return patterns;
    }

    updateBehaviorPattern(pattern) {
        const patternKey = pattern.pattern;
        
        if (!this.behaviorPatterns.has(patternKey)) {
            this.behaviorPatterns.set(patternKey, {
                pattern: pattern,
                successes: 0,
                attempts: 0,
                confidence: 0
            });
        }
        
        const behaviorData = this.behaviorPatterns.get(patternKey);
        behaviorData.attempts++;
        
        if (pattern.outcome) {
            behaviorData.successes++;
        }
        
        behaviorData.confidence = behaviorData.successes / behaviorData.attempts;
    }

    // THOUGHT GENERATION
    generateMoodBasedThought(mood) {
        if (!window.tamagotchiGame?.languageLearning) return;
        
        const thoughtIntensity = this.calculateThoughtIntensity(mood);
        
        setTimeout(() => {
            window.tamagotchiGame.languageLearning.expressThought(mood, thoughtIntensity);
        }, 500 + Math.random() * 2000);
    }

    calculateThoughtIntensity(mood) {
        const intensityMap = {
            'angry': 0.8,
            'frustrated': 0.7,
            'sad': 0.6,
            'lonely': 0.7,
            'happy': 0.6,
            'sick': 0.9,
            'tired': 0.5
        };
        
        return intensityMap[mood] || 0.4;
    }

    showThought(content) {
        if (!this.thoughtBubble) return;
        
        this.thoughtBubble.querySelector('#thoughtContent').textContent = content;
        this.thoughtBubble.style.display = 'block';
        
        setTimeout(() => {
            this.thoughtBubble.style.display = 'none';
        }, 3000 + Math.random() * 2000);
    }

    // VISUAL EFFECTS
    showPositiveEffect() {
        this.showInteractionEffect('heart');
        if (Math.random() < 0.3) {
            this.wiggle();
        }
    }

    showNegativeEffect() {
        this.showInteractionEffect('storm');
        if (this.aggressionLevel > 50) {
            this.shake();
        }
    }

    shake() {
        this.element.classList.add('shaking');
        setTimeout(() => {
            this.element.classList.remove('shaking');
        }, 1000);
    }

    // ENHANCED SERIALIZATION
    serialize() {
        return {
            // Basic properties
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
            
            // Enhanced properties
            trustLevel: this.trustLevel,
            attachmentLevel: this.attachmentLevel,
            aggressionLevel: this.aggressionLevel,
            socialAnxiety: this.socialAnxiety,
            frustrationLevel: this.frustrationLevel,
            
            // Complex systems
            personalityTraits: this.personalityTraits,
            attachmentStyle: this.attachmentStyle,
            learningStyle: this.learningStyle,
            
            // Interaction tracking
            lastInteraction: this.lastInteraction,
            totalInteractions: this.totalInteractions,
            interactionHistory: this.interactionHistory.slice(-20), // save recent history
            
            // Memory systems
            emotionalMemory: Array.from(this.emotionalMemory.entries()),
            behaviorPatterns: Array.from(this.behaviorPatterns.entries())
        };
    }

    deserialize(data) {
        // Restore all properties
        Object.assign(this, data);
        
        // Restore complex data structures
        if (data.emotionalMemory) {
            this.emotionalMemory = new Map(data.emotionalMemory);
        }
        if (data.behaviorPatterns) {
            this.behaviorPatterns = new Map(data.behaviorPatterns);
        }
        
        // Update visual appearance
        this.updateAppearance();
    }

    // Keep existing methods but enhance them
    initializeNew() {
        this.name = this.generateRandomName();
        this.age = 0;
        this.birthTime = Date.now();
        this.hunger = 100;
        this.happiness = 100;
        this.health = 100;
        this.energy = 100;
        this.mood = 'curious';
        this.evolutionStage = 1;
        
        // Initialize enhanced properties
        this.trustLevel = 50;
        this.attachmentLevel = 10;
        this.aggressionLevel = 0;
        this.socialAnxiety = 20;
        this.frustrationLevel = 0;
        
        this.personalityTraits = this.generatePersonality();
        this.attachmentStyle = 'developing';
        this.learningStyle = 'observational';
        
        this.interactionHistory = [];
        this.emotionalMemory = new Map();
        this.behaviorPatterns = new Map();
        
        console.log(`New enhanced creature born: ${this.name}`);
    }

    // Keep all existing methods (generateRandomName, updateAge, etc.) from original creature.js
    // but they now work with the enhanced emotional and cognitive systems

    generateRandomName() {
        // Use the existing name generation logic from the original creature.js
        const prefixes = [
            'Zap', 'Glitch', 'Fizz', 'Blip', 'Neko', 'Zorb',
            'Bloop', 'Mecha', 'Frost', 'Echo', 'Tiko', 'Vox',
            'Pika', 'Rift', 'Skorb', 'Wub', 'Nova', 'Robo',
            'Nano', 'Cyber', 'Digi', 'Hyper', 'Meta', 'Neuro',
            'Quantum', 'Synth', 'Techno', 'Virtual', 'Xeno', 'Zero'
        ];

        const suffixes = [
            'let', 'tron', 'boo', 'doop', 'craft', 'nug', 
            'spark', 'byte', 'ling', 'mancer', 'zilla', 'fluff',
            'blitz', 'puff', 'core', 'flip', 'whirl', 'mote',
            'bot', 'droid', 'flux', 'grid', 'node', 'pixel',
            'script', 'sys', 'ware', 'bit', 'chip', 'drive'
        ];

        const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const prefix = getRandomElement(prefixes);
        const suffix = getRandomElement(suffixes);

        return prefix.charAt(0).toUpperCase() + prefix.slice(1) + suffix.toLowerCase();
    }

    // Enhanced versions of basic methods
    addHunger(amount) {
        this.hunger = Math.min(100, this.hunger + amount);
        this.updateComplexMood();
    }

    addHappiness(amount) {
        this.happiness = Math.min(100, this.happiness + amount);
        this.frustrationLevel = Math.max(0, this.frustrationLevel - amount * 0.5);
        this.updateComplexMood();
    }

    addHealth(amount) {
        this.health = Math.min(100, this.health + amount);
        this.updateComplexMood();
    }

    addEnergy(amount) {
        this.energy = Math.min(100, this.energy + amount);
        this.updateComplexMood();
    }

    // Keep all other existing methods (updateAge, blink, speak, etc.) with enhancements
    updateAppearance() {
        if (!this.element) return;

        // Remove all mood classes
        const moodClasses = ['happy', 'sad', 'angry', 'hungry', 'sleepy', 'sick', 'dead', 'frustrated', 'lonely'];
        this.element.classList.remove(...moodClasses);
        
        // Add current mood class
        this.element.classList.add(this.mood);

// Add attachment style class for visual variations
       this.element.classList.remove('secure', 'anxious', 'avoidant', 'disorganized');
       this.element.classList.add(this.attachmentStyle);

       // Update facial expressions based on complex emotional state
       this.updateComplexFacialExpression();
   }

   updateComplexFacialExpression() {
       if (!this.mouth || !this.leftEye || !this.rightEye) return;

       // Remove existing expression classes
       const expressionClasses = ['happy', 'sad', 'angry', 'speaking', 'sleepy', 'frustrated', 'anxious', 'aggressive'];
       this.mouth.classList.remove(...expressionClasses);
       this.leftEye.classList.remove(...expressionClasses);
       this.rightEye.classList.remove(...expressionClasses);

       // Apply complex mood-based expressions
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
           case 'frustrated':
               this.mouth.classList.add('frustrated');
               this.leftEye.classList.add('frustrated');
               this.rightEye.classList.add('frustrated');
               break;
           case 'sleepy':
               this.leftEye.classList.add('sleepy');
               this.rightEye.classList.add('sleepy');
               break;
           case 'lonely':
               this.mouth.classList.add('sad');
               this.leftEye.classList.add('sad');
               this.rightEye.classList.add('sad');
               break;
       }

       // Add anxiety indicators
       if (this.socialAnxiety > 60) {
           this.leftEye.classList.add('anxious');
           this.rightEye.classList.add('anxious');
       }

       // Add aggression indicators
       if (this.aggressionLevel > 40) {
           this.mouth.classList.add('aggressive');
       }
   }

   // Keep existing methods but enhance with emotional complexity
   blink() {
       if (this.isBlinking || this.mood === 'sleepy') return;
       
       this.isBlinking = true;
       this.leftEye.classList.add('blink');
       this.rightEye.classList.add('blink');
       
       // Blink duration affected by emotional state
       const blinkDuration = this.socialAnxiety > 50 ? 200 : 150; // nervous creatures blink longer
       
       setTimeout(() => {
           this.leftEye.classList.remove('blink');
           this.rightEye.classList.remove('blink');
           this.isBlinking = false;
       }, blinkDuration);
   }

   speak(duration = 1000) {
       if (!this.isAlive) return;
       
       this.isSpeaking = true;
       this.mouth.classList.add('speaking');
       
       // Speaking animation affected by personality and mood
       const personalityMultiplier = this.personalityTraits.extraversion;
       const adjustedDuration = duration * (0.5 + personalityMultiplier * 0.5);
       
       setTimeout(() => {
           this.mouth.classList.remove('speaking');
           this.isSpeaking = false;
       }, adjustedDuration);
   }

   performRandomAction() {
       if (!this.isAlive || this.isSleeping) return;
       
       // Action probability affected by personality and mood
       const actionProbability = this.personalityTraits.playfulness * 
                                (this.happiness / 100) * 
                                (1 - this.socialAnxiety / 200);
       
       if (Math.random() > actionProbability) return;
       
       const actions = ['blink', 'wiggle', 'yawn', 'thoughtful_pause'];
       let availableActions = [...actions];
       
       // Mood-specific actions
       if (this.mood === 'frustrated') {
           availableActions.push('frustrated_gesture', 'impatient_wiggle');
       }
       if (this.mood === 'happy') {
           availableActions.push('happy_bounce', 'content_sigh');
       }
       if (this.aggressionLevel > 50) {
           availableActions.push('aggressive_stance');
       }
       
       const action = availableActions[Math.floor(Math.random() * availableActions.length)];
       
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
           case 'thoughtful_pause':
               this.thoughtfulPause();
               break;
           case 'frustrated_gesture':
               this.frustratedGesture();
               break;
           case 'happy_bounce':
               this.happyBounce();
               break;
           case 'aggressive_stance':
               this.aggressiveStance();
               break;
       }
   }

   // New action methods
   thoughtfulPause() {
       this.element.style.transform = 'rotate(3deg)';
       setTimeout(() => {
           this.element.style.transform = 'rotate(-3deg)';
       }, 500);
       setTimeout(() => {
           this.element.style.transform = 'rotate(0deg)';
       }, 1000);
   }

   frustratedGesture() {
       this.element.style.animation = 'shake 0.3s ease-in-out 3';
       setTimeout(() => {
           this.element.style.animation = '';
       }, 1000);
   }

   happyBounce() {
       this.element.style.animation = 'bounce 0.5s ease-in-out 2';
       setTimeout(() => {
           this.element.style.animation = '';
       }, 1000);
   }

   aggressiveStance() {
       this.element.style.transform = 'scale(1.1)';
       this.element.style.filter = 'hue-rotate(20deg)';
       setTimeout(() => {
           this.element.style.transform = 'scale(1)';
           this.element.style.filter = '';
       }, 2000);
   }

   wiggle() {
       const intensity = this.personalityTraits.playfulness;
       const rotation = intensity * 10; // 0-10 degrees
       
       this.element.style.transform = `rotate(${rotation}deg)`;
       setTimeout(() => {
           this.element.style.transform = `rotate(${-rotation}deg)`;
       }, 100);
       setTimeout(() => {
           this.element.style.transform = 'rotate(0deg)';
       }, 200);
   }

   yawn() {
       this.mouth.style.width = '30px';
       this.mouth.style.height = '15px';
       this.mouth.style.borderRadius = '50%';
       
       setTimeout(() => {
           this.mouth.style.width = '';
           this.mouth.style.height = '';
           this.mouth.style.borderRadius = '';
       }, 1500);
   }

   showInteractionEffect(type) {
       const effectsContainer = document.getElementById('interactionEffects');
       if (!effectsContainer) return;
       
       const effect = document.createElement('div');
       
       switch (type) {
           case 'heart':
               effect.className = 'heart-effect';
               effect.innerHTML = '💖';
               break;
           case 'sparkle':
               effect.className = 'sparkle-effect';
               effect.innerHTML = '✨';
               break;
           case 'storm':
               effect.className = 'storm-effect';
               effect.innerHTML = '💢';
               break;
           case 'tears':
               effect.className = 'tears-effect';
               effect.innerHTML = '💧';
               break;
       }

       effect.style.left = (30 + Math.random() * 40) + '%';
       effect.style.top = (20 + Math.random() * 60) + '%';
       effect.style.position = 'absolute';
       effect.style.fontSize = '24px';
       effect.style.pointerEvents = 'none';
       effect.style.animation = 'floatUp 2s ease-out forwards';
       effect.style.zIndex = '1000';

       effectsContainer.appendChild(effect);

       setTimeout(() => {
           if (effect.parentNode) {
               effect.parentNode.removeChild(effect);
           }
       }, 2000);
   }

   // Keep existing methods (sleep, wakeUp, die, revive, etc.) but enhance them
   sleep() {
       this.isSleeping = true;
       this.energy = Math.min(100, this.energy + 30);
       this.frustrationLevel = Math.max(0, this.frustrationLevel - 10);
       this.aggressionLevel = Math.max(0, this.aggressionLevel - 5);
       this.element.style.opacity = '0.7';
       
       this.recordComplexInteraction('went_to_sleep', {
           voluntarily: true,
           energyLevel: this.energy
       });
   }

   wakeUp() {
       this.isSleeping = false;
       this.element.style.opacity = '1';
       this.addHappiness(10);
       
       // Mood upon waking depends on sleep quality
       if (this.energy > 80) {
           this.addHappiness(5);
       }
       
       this.recordComplexInteraction('woke_up', {
           rested: this.energy > 70,
           energyLevel: this.energy
       });
   }

   die() {
       this.isAlive = false;
       this.health = 0;
       this.mood = 'dead';
       this.updateAppearance();
       
       // Record death circumstances in memory
       if (this.conceptualMemory) {
           this.conceptualMemory.recordEpisode('creature_death', {
               cause: this.identifyDeathCause(),
               finalStats: {
                   hunger: this.hunger,
                   happiness: this.happiness,
                   health: this.health,
                   energy: this.energy,
                   trustLevel: this.trustLevel,
                   aggressionLevel: this.aggressionLevel
               },
               ageAtDeath: this.age,
               totalInteractions: this.totalInteractions
           });
       }
       
       console.log(`${this.name} has died at age ${Math.floor(this.age / 24)} days...`);
       
       if (window.tamagotchiGame) {
           window.tamagotchiGame.addChatMessage('System', `${this.name} has passed away...`, 'system');
       }
   }

   identifyDeathCause() {
       if (this.health <= 0) return 'illness';
       if (this.hunger <= 0) return 'starvation';
       if (this.happiness <= 0 && this.trustLevel <= 0) return 'despair';
       return 'unknown';
   }

   revive() {
       this.isAlive = true;
       this.health = 50;
       this.hunger = 50;
       this.happiness = 50;
       this.energy = 50;
       this.aggressionLevel = 0;
       this.frustrationLevel = 0;
       this.socialAnxiety = 30; // higher anxiety after death experience
       this.trustLevel = Math.max(20, this.trustLevel - 20); // trust damaged by death
       
       this.updateComplexMood();
       
       console.log(`${this.name} has been revived with complex emotional state!`);
   }

   // Enhanced need modification methods
   decreaseHunger(amount = 0.5) {
       this.hunger = Math.max(0, this.hunger - amount);
       if (this.hunger === 0) {
           this.health = Math.max(0, this.health - 1);
           this.aggressionLevel = Math.min(100, this.aggressionLevel + 0.5);
       }
       this.updateComplexMood();
   }

   decreaseHappiness(amount = 0.3) {
       this.happiness = Math.max(0, this.happiness - amount);
       this.frustrationLevel = Math.min(100, this.frustrationLevel + amount * 0.5);
       this.updateComplexMood();
   }

   decreaseEnergy(amount = 0.4) {
       if (!this.isSleeping) {
           this.energy = Math.max(0, this.energy - amount);
           if (this.energy < 20) {
               this.aggressionLevel = Math.min(100, this.aggressionLevel + 0.2);
           }
       }
       this.updateComplexMood();
   }

   decreaseHealth(amount = 0.1) {
       this.health = Math.max(0, this.health - amount);
       if (this.health < 30) {
           this.socialAnxiety = Math.min(100, this.socialAnxiety + 0.5);
       }
       if (this.health === 0) {
           this.die();
       }
       this.updateComplexMood();
   }

   // Keep existing utility methods
   updateAge() {
       this.age = (Date.now() - this.birthTime) / (1000 * 60 * 60); // hours
   }


   adjustTrust(amount) {
    this.trustLevel = Math.max(0, Math.min(100, this.trustLevel + amount));
    console.log(`Trust adjusted by ${amount}. New trust level: ${this.trustLevel}`);
    
    // Record trust change
    if (this.conceptualMemory) {
        this.conceptualMemory.recordEpisode('trust_change', {
            change: amount,
            newLevel: this.trustLevel,
            timestamp: Date.now()
        });
    }
}

adjustEnergy(amount) {
    this.energy = Math.max(0, Math.min(100, this.energy + amount));
    console.log(`Energy adjusted by ${amount}. New energy level: ${this.energy}`);
    
    // If energy gets too low, creature becomes tired
    if (this.energy < 20 && this.mood !== 'tired') {
        this.setMood('tired');
    }
}

setMood(newMood) {
    if (this.mood === newMood) return; // No change needed
    
    const oldMood = this.mood;
    this.mood = newMood;
    
    // Trigger mood change processing
    this.onMoodChange(oldMood, newMood);
    
    // Update visual appearance
    this.updateAppearance();
    
    console.log(`Mood set to: ${newMood}`);
}

   recordUserAbsence() {
        this.lastInteraction = Date.now();
        this.timeSinceLastHuman = Date.now() - this.lastInteraction;
        
        // Increase loneliness when user is absent
        this.loneliness = Math.min(100, this.loneliness + 2);
        
        // Record absence event in conceptual memory if available
        if (this.conceptualMemory) {
            this.conceptualMemory.recordEpisode('user_absence', {
                duration: this.timeSinceLastHuman,
                mood: this.mood,
                loneliness: this.loneliness,
                timestamp: Date.now()
            });
        }
        
        console.log('User absence recorded');
    }

   getAgeInDays() {
       return Math.floor(this.age / 24);
   }

   startBlinkTimer() {
       const blink = () => {
           if (!this.isAlive || this.isSleeping) return;
           
           this.blink();
           
           // Blink frequency affected by anxiety and mood
           const baseInterval = 3000;
           const anxietyMultiplier = 1 + (this.socialAnxiety / 200); // more anxiety = more blinking
           const nextBlink = baseInterval / anxietyMultiplier + Math.random() * 4000;
           
           setTimeout(blink, nextBlink);
       };
       
       setTimeout(blink, 2000);
   }
}
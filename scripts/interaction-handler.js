// Enhanced InteractionHandler - sophisticated interaction processing with cognitive integration
class InteractionHandler {
    constructor(creature, languageLearning) {
        this.creature = creature;
        this.languageLearning = languageLearning;
        
        // Cognitive system references (will be set later)
        this.entityManager = null;
        this.conceptualMemory = null;
        this.cognitiveProcessor = null;
        
        // Interaction tracking
        this.lastClickTime = 0;
        this.clickSequence = [];
        this.interactionPatterns = new Map();
        this.userBehaviorProfile = this.createUserBehaviorProfile();
        
        // Advanced interaction tracking (ADD THESE)
        this.isInteracting = false;
        this.interactionStartTime = null;
        this.interactionStartPos = null;
        this.currentMovement = 0;
        
        // Voice recognition
        this.recognition = null;
        this.isRecording = false;
        this.recordingTimeout = null;
        this.voiceAnalysis = new VoiceAnalysis();
        
        // Activity monitoring
        this.lastUserActivity = Date.now();
        this.userAttentionLevel = 0.5;
        this.activityPattern = [];
        this.presenceDetection = new PresenceDetection();
        
        // Contextual awareness
        this.currentContext = this.initializeContext();
        this.socialSituation = 'one_on_one';
        this.interactionMode = 'casual';
        
        // Activity timeout tracking (ADD THESE)
        this.inactivityTimeout = null;
        this.isIgnoring = false;
        this.ignoreStartTime = 0;
        
        this.init();
    }

    init() {
        this.initializeVoiceRecognition();
        this.setupAdvancedInteractionHandlers();
        this.startContextualMonitoring();
        this.startBehaviorAnalysis();
        console.log('Enhanced Interaction Handler initialized');
    }

    // COGNITIVE SYSTEM INTEGRATION
    setCognitiveComponents(entityManager, conceptualMemory, cognitiveProcessor) {
        this.entityManager = entityManager;
        this.conceptualMemory = conceptualMemory;
        this.cognitiveProcessor = cognitiveProcessor;
        
        console.log('Interaction Handler connected to cognitive systems');
    }

    // Add this method to InteractionHandler class:
    initializeContext() {
        return {
            timestamp: Date.now(),
            sessionStart: Date.now(),
            userPresent: true,
            interactionCount: 0,
            mood: 'neutral',
            socialSituation: 'one_on_one',
            environmentalFactors: {
                timeOfDay: this.getTimeOfDay(),
                sessionDuration: 0
            }
        };
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 6) return 'night';
        if (hour < 12) return 'morning';  
        if (hour < 18) return 'afternoon';
        return 'evening';
    }

    // USER BEHAVIOR PROFILING calculateActionIntensity
    createUserBehaviorProfile() {
        return {
            // Existing properties
            interactionStyle: 'unknown', // gentle, rough, playful, caring, neglectful
            consistency: 0.5, // how predictable their behavior is
            attentiveness: 0.5, // how much attention they pay
            responsiveness: 0.5, // how quickly they respond
            emotionalTone: 'neutral', // predominant emotional tone
            
            // Missing properties that other methods expect
            totalInteractions: 0,
            averageGentleness: 0.5,
            preferredPlayfulness: 0.5,
            preferredIntensity: 0.5,
            kindnessLevel: 0.5,
            averageInteractionInterval: 5000,
            lastInteractionTime: null,
            
            // Existing nested objects
            communicationPatterns: {
                averageResponseTime: 5000,
                typicalSessionLength: 300000, // 5 minutes
                preferredInteractions: [],
                avoidedInteractions: []
            },
            learningHistory: {
                teachingAttempts: 0,
                patienceLevel: 0.5,
                correctionStyle: 'unknown',
                effectiveness: 0.5 // Missing property
            },
            relationship: {
                trustBuilding: 0.5,
                boundaryRespect: 0.5,
                empathy: 0.5,
                playfulness: 0.5
            },
            
            // Additional missing properties
            patterns: {
                consistency: 0.5,
                kindness: 0.5,
                engagement: 0.5,
                patience: 0.5
            }
        };
    }

    handleInteractionMove(event) {
        if (!this.isInteracting) return;
        
        const currentPos = this.getEventPosition(event);
        this.currentMovement = this.calculateMovement(this.interactionStartPos, currentPos);
        
        // Optional: provide visual feedback during movement
        if (this.currentMovement > 20) {
            // Large movement - could show drag effect
            this.showDragEffect(currentPos);
        }
    }

    handleInteractionAbort(event) {
        // Called when mouse/touch leaves the creature area
        if (this.isInteracting) {
            console.log('Interaction aborted');
            this.isInteracting = false;
            this.interactionStartTime = null;
            this.interactionStartPos = null;
        }
    }

    showDragEffect(position) {
        // Optional visual effect during dragging
        const effect = document.createElement('div');
        effect.className = 'drag-effect';
        effect.style.position = 'absolute';
        effect.style.left = position.x + 'px';
        effect.style.top = position.y + 'px';
        effect.style.width = '10px';
        effect.style.height = '10px';
        effect.style.borderRadius = '50%';
        effect.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '999';
        
        document.getElementById('interactionEffects').appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 100);
    }


    updateRelationshipAssessment() {
    // Assess the relationship between user and creature
    if (!this.entityManager || !this.creature) return;
    
    // Initialize relationship object if missing
    if (!this.userBehaviorProfile.relationship) {
        this.userBehaviorProfile.relationship = {
            trustBuilding: 0.5,
            boundaryRespect: 0.5,
            empathy: 0.5,
            playfulness: 0.5
        };
    }
    
    const recentInteractions = this.getRecentInteractions(1800000); // Last 30 minutes
    
    if (recentInteractions.length > 0) {
        // Calculate relationship metrics
        const positiveRatio = recentInteractions.filter(i => i.positive).length / recentInteractions.length;
        const interactionFrequency = recentInteractions.length / 30; // per minute
        const averageIntensity = recentInteractions.reduce((sum, i) => sum + (i.intensity || 1), 0) / recentInteractions.length;
        
        // Update user behavior profile based on relationship assessment
        this.userBehaviorProfile.relationship.trustBuilding = positiveRatio;
        this.userBehaviorProfile.relationship.empathy = Math.min(1.0, averageIntensity * positiveRatio);
        this.userBehaviorProfile.attentiveness = Math.min(1.0, interactionFrequency);
        
        // Update creature's trust based on relationship quality
        if (positiveRatio > 0.7) {
            this.creature.trustLevel = Math.min(100, this.creature.trustLevel + 0.5);
        } else if (positiveRatio < 0.3) {
            this.creature.trustLevel = Math.max(0, this.creature.trustLevel - 0.3);
        }
    }
}

getRecentInteractions(timeWindow) {
    // Get interactions from the specified time window
    if (!this.activityPattern) return [];
    
    const cutoffTime = Date.now() - timeWindow;
    return this.activityPattern
        .filter(activity => activity.timestamp > cutoffTime)
        .map(activity => ({
            type: activity.type,
            timestamp: activity.timestamp,
            positive: this.isPositiveInteraction(activity.type),
            intensity: this.estimateInteractionIntensity(activity.type)
        }));
}

isPositiveInteraction(type) {
    const positiveTypes = ['gentle_pet', 'praise', 'play', 'feed', 'comfort', 'introduce_someone'];
    return positiveTypes.includes(type);
}

estimateInteractionIntensity(type) {
    const intensityMap = {
        'gentle_pet': 0.3,
        'praise': 0.6,
        'play': 0.8,
        'scold': 0.7,
        'ignore': 0.1,
        'feed': 0.4,
        'medicine': 0.5,
        'voice_interaction': 0.6
    };
    
    return intensityMap[type] || 0.5;
}

assessLearningProgress() {
    // Assess how well the user is helping the creature learn
    if (!this.languageLearning || !this.creature) return;
    
    // Initialize learningHistory if missing
    if (!this.userBehaviorProfile.learningHistory) {
        this.userBehaviorProfile.learningHistory = {
            teachingAttempts: 0,
            effectiveness: 0.5
        };
    }
    
    const languageStats = this.languageLearning.getLanguageStats();
    const creatureAge = this.creature.age;
    
    // Calculate learning effectiveness
    const expectedVocabulary = Math.floor(creatureAge / 2) + 3; // Expected words based on age
    const actualVocabulary = languageStats.vocabularySize;
    const learningEffectiveness = Math.min(1.0, actualVocabulary / expectedVocabulary);
    
    // Update user behavior profile
    this.userBehaviorProfile.learningHistory.teachingAttempts = this.creature.totalInteractions;
    this.userBehaviorProfile.learningHistory.effectiveness = learningEffectiveness;
}



    // ADVANCED VOICE RECOGNITION
    initializeVoiceRecognition() {
        console.log('Initializing advanced voice recognition...');

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error('Web Speech API not supported');
            this.showVoiceError('Voice recognition not supported in this browser');
            return;
        }

        try {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            this.recognition.maxAlternatives = 5; // Get multiple interpretations

            this.setupVoiceEventHandlers();
            console.log('Advanced voice recognition initialized');

        } catch (error) {
            console.error('Failed to initialize voice recognition:', error);
            this.showVoiceError('Voice recognition initialization failed');
        }
    }

    setupVoiceEventHandlers() {
        this.recognition.onstart = () => {
            console.log('Voice recognition started');
            this.isRecording = true;
            this.updateVoiceButton(true);
            this.showVoiceStatus('Listening...');
            this.recordUserActivity('voice_start');
        };

        this.recognition.onresult = (event) => {
            const results = [];
            
            for (let i = 0; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    for (let j = 0; j < result.length; j++) {
                        results.push({
                            transcript: result[j].transcript,
                            confidence: result[j].confidence
                        });
                    }
                }
            }
            
            if (results.length > 0) {
                this.processVoiceResults(results);
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            this.handleVoiceError(event.error);
            this.stopVoiceRecording();
        };

        this.recognition.onend = () => {
            console.log('Voice recognition ended');
            this.stopVoiceRecording();
        };
    }

    ensureUserBehaviorProfile() {
        if (!this.userBehaviorProfile) {
            console.log('Initializing missing user behavior profile');
            this.userBehaviorProfile = this.createUserBehaviorProfile();
            return;
        }
        
        // Ensure all required nested objects exist
        if (!this.userBehaviorProfile.relationship) {
            this.userBehaviorProfile.relationship = {
                trustBuilding: 0.5,
                boundaryRespect: 0.5,
                empathy: 0.5,
                playfulness: 0.5
            };
        }
        
        if (!this.userBehaviorProfile.patterns) {
            this.userBehaviorProfile.patterns = {
                consistency: 0.5,
                kindness: 0.5,
                engagement: 0.5,
                patience: 0.5
            };
        }
        
        if (!this.userBehaviorProfile.learningHistory) {
            this.userBehaviorProfile.learningHistory = {
                teachingAttempts: 0,
                patienceLevel: 0.5,
                correctionStyle: 'unknown',
                effectiveness: 0.5
            };
        }
        
        if (!this.userBehaviorProfile.communicationPatterns) {
            this.userBehaviorProfile.communicationPatterns = {
                averageResponseTime: 5000,
                typicalSessionLength: 300000,
                preferredInteractions: [],
                avoidedInteractions: []
            };
        }
    }

    processVoiceResults(results) {
        // Choose best result based on confidence and handleSocialAction
        const bestResult = this.selectBestVoiceResult(results);
        
        if (bestResult && bestResult.confidence > 0.3) {
            console.log(`Voice input: "${bestResult.transcript}" (confidence: ${bestResult.confidence})`);
            
            // Analyze voice characteristics
            const voiceAnalysis = this.voiceAnalysis.analyze(bestResult);
            
            // Process with enhanced context
            this.processVoiceInput(bestResult.transcript, voiceAnalysis);
            
            this.showVoiceStatus(`Heard: "${bestResult.transcript}"`);
        } else {
            this.showVoiceStatus('Could not understand clearly - try speaking closer to the microphone');
            this.handleLowConfidenceVoice(results);
        }
    }

    selectBestVoiceResult(results) {
        // Score results based on confidence and contextual relevance
        return results.reduce((best, current) => {
            const contextualScore = this.calculateContextualRelevance(current.transcript);
            const totalScore = current.confidence * 0.7 + contextualScore * 0.3;
            
            const bestScore = best ? (best.confidence * 0.7 + this.calculateContextualRelevance(best.transcript) * 0.3) : 0;
            
            return totalScore > bestScore ? current : best;
        }, null);
    }

    calculateContextualRelevance(transcript) {
        let score = 0.5; // base score
        
        // Check against known vocabulary
        if (this.languageLearning) {
            const words = transcript.toLowerCase().split(' ');
            const knownWords = words.filter(word => this.languageLearning.vocabulary.has(word));
            score += (knownWords.length / words.length) * 0.3;
        }
        
        // Check against current creature needs
        if (this.creature.hunger < 30 && transcript.toLowerCase().includes('food')) {
            score += 0.4;
        }
        if (this.creature.mood === 'lonely' && transcript.toLowerCase().includes('hello')) {
            score += 0.3;
        }
        
        return Math.min(1.0, score);
    }

    processVoiceInput(transcript, voiceAnalysis) {
        if (!transcript || !this.creature.isAlive) return;

        const context = {
            inputType: 'voice',
            voiceAnalysis: voiceAnalysis,
            userBehavior: this.userBehaviorProfile,
            currentContext: this.currentContext,
            timestamp: Date.now()
        };
        
        // Record the interaction
        this.recordComplexInteraction('voice_input', {
            transcript: transcript,
            voiceAnalysis: voiceAnalysis,
            confidence: voiceAnalysis.confidence
        }, context);
        
        // Update user behavior profile
        this.updateUserBehaviorFromVoice(voiceAnalysis);
        
        // Process through language learning system
        if (this.languageLearning) {
            this.languageLearning.processUserInput(transcript, 'voice', context);
        }
        
        // Display in chat
        if (window.tamagotchiGame) {
            window.tamagotchiGame.addChatMessage('You', transcript + ' (voice)', 'user');
        }
        
        // Record user attention
        this.recordUserActivity('voice_interaction');
        
        // Creature emotional response to voice
        this.creature.addHappiness(8);
        this.creature.recordComplexInteraction('voice_interaction', {
            transcript: transcript,
            voiceCharacteristics: voiceAnalysis
        }, context);
    }

    updateUserBehaviorFromVoice(voiceAnalysis) {
        const profile = this.userBehaviorProfile;
        
        // Update emotional tone assessment
        if (voiceAnalysis.emotionalTone) {
            profile.emotionalTone = this.blendEmotionalAssessment(
                profile.emotionalTone, 
                voiceAnalysis.emotionalTone, 
                0.3
            );
        }
        
        // Update communication patterns
        profile.communicationPatterns.averageResponseTime = 
            (profile.communicationPatterns.averageResponseTime * 0.8) + 
            (voiceAnalysis.responseTime * 0.2);
        
        // Assess patience from voice characteristics
        if (voiceAnalysis.rushed) {
            profile.learningHistory.patienceLevel = Math.max(0.1, profile.learningHistory.patienceLevel - 0.1);
        } else if (voiceAnalysis.calm) {
            profile.learningHistory.patienceLevel = Math.min(1.0, profile.learningHistory.patienceLevel + 0.05);
        }
    }

    // ENHANCED TOUCH INTERACTION
    setupAdvancedInteractionHandlers() {
        const creatureStage = document.getElementById('creatureStage');
        if (!creatureStage) return;

        // Enhanced click/touch handling
        creatureStage.addEventListener('mousedown', (e) => this.handleInteractionStart(e));
        creatureStage.addEventListener('mouseup', (e) => this.handleInteractionEnd(e));
        creatureStage.addEventListener('mousemove', (e) => this.handleInteractionMove(e));
        creatureStage.addEventListener('mouseleave', (e) => this.handleInteractionAbort(e));
        
        // Touch events for mobile
        creatureStage.addEventListener('touchstart', (e) => this.handleInteractionStart(e));
        creatureStage.addEventListener('touchend', (e) => this.handleInteractionEnd(e));
        creatureStage.addEventListener('touchmove', (e) => this.handleInteractionMove(e));
        
        // Context menu for advanced interactions
        creatureStage.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showInteractionContextMenu(e);
        });

        // Global activity monitoring
        document.addEventListener('mousemove', () => this.recordUserActivity('mouse_movement'));
        document.addEventListener('keypress', () => this.recordUserActivity('keyboard_input'));
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        // New social action buttons
        this.setupSocialActionButtons();
    }

    setupSocialActionButtons() {
        const actionHandlers = {
            'gentlePetBtn': () => this.handleSocialAction('gentle_pet'),
            'praiseBtn': () => this.handleSocialAction('praise'),
            'scoldBtn': () => this.handleSocialAction('scold'),
            'ignoreBtn': () => this.handleSocialAction('ignore'),
            'introduceBtn': () => this.handleSocialAction('introduce_someone'),
            'debugBtn': () => this.toggleDebugPanel()
        };

        for (let [buttonId, handler] of Object.entries(actionHandlers)) {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', handler);
            }
        }
    }

    handleSocialAction(actionType) {
        // Ensure profile exists before using it
        this.ensureUserBehaviorProfile();
        
        const intensity = this.calculateActionIntensity(actionType);
        const context = {
            actionType: actionType,
            userBehavior: this.userBehaviorProfile,
            socialContext: this.currentContext,
            deliberate: true
        };

        switch (actionType) {
            case 'gentle_pet':
                this.performGentlePet(intensity, context);
                break;
            case 'praise':
                this.performPraise(intensity, context);
                break;
            case 'scold':
                this.performScold(intensity, context);
                break;
            case 'ignore':
                this.performIgnore(context);
                break;
            case 'introduce_someone':
                this.initiateIntroduction(context);
                break;
            default:
                console.warn(`Unknown social action: ${actionType}`);
                break;
        }

        this.recordUserActivity('social_action');
    }
//ensureUserBehaviorProfile
    performGentlePet(intensity, context) {
        // Gentle interaction with positive effects
        this.creature.recordComplexInteraction('gentle_pet', {
            intensity: intensity,
            userIntent: 'affection'
        }, context);
        
        this.creature.addHappiness(15 * intensity);
        this.creature.trustLevel = Math.min(100, this.creature.trustLevel + 5 * intensity);
        this.creature.socialAnxiety = Math.max(0, this.creature.socialAnxiety - 3 * intensity);
        
        this.showInteractionEffect('gentle_pet', {x: 200, y: 150});
        this.updateUserBehaviorProfile('gentle', 0.3);
        
        // Creature might respond verbally updateRelationshipAssessment
        if (Math.random() < 0.6) {
            setTimeout(() => {
                this.languageLearning.expressThought('happy', 0.7);
            }, 500);
        }
    }

    performPraise(intensity, context) {
        this.creature.recordComplexInteraction('praised', {
            intensity: intensity,
            userIntent: 'positive_reinforcement'
        }, context);
        
        this.creature.addHappiness(20 * intensity);
        this.creature.trustLevel = Math.min(100, this.creature.trustLevel + 8 * intensity);
        
        // Record as teaching attempt
        this.userBehaviorProfile.learningHistory.teachingAttempts++;
        
        this.showInteractionEffect('praise', {x: 200, y: 100});
        this.updateUserBehaviorProfile('supportive', 0.4);
        
        // Creature learns this was good behavior
        if (this.conceptualMemory) {
            this.conceptualMemory.recordEpisode('received_praise', {
                context: this.creature.mood,
                recentActions: this.getRecentCreatureActions()
            });
        }
        
        // Happy response
        setTimeout(() => {
            this.languageLearning.expressThought('praised', 0.8);
        }, 800);
    }

    performScold(intensity, context) {
        this.creature.recordComplexInteraction('scolded', {
            intensity: intensity,
            userIntent: 'negative_reinforcement',
            fairness: this.assessScoldingFairness(context)
        }, context);
        
        this.creature.happiness = Math.max(0, this.creature.happiness - 12 * intensity);
        this.creature.trustLevel = Math.max(0, this.creature.trustLevel - 6 * intensity);
        this.creature.aggressionLevel = Math.min(100, this.creature.aggressionLevel + 4 * intensity);
        this.creature.socialAnxiety = Math.min(100, this.creature.socialAnxiety + 5 * intensity);
        
        this.showInteractionEffect('scold', {x: 200, y: 150});
        this.updateUserBehaviorProfile('strict', 0.3);
        
        // Creature might react defensively or sadly
        const reactionType = this.creature.aggressionLevel > 50 ? 'angry' : 'sad';
        setTimeout(() => {
            this.languageLearning.expressThought(reactionType, 0.9);
        }, 1000);
        
        // Learn what behavior led to scolding
        if (this.conceptualMemory) {
            this.conceptualMemory.recordEpisode('received_scolding', {
                context: this.creature.mood,
                recentActions: this.getRecentCreatureActions(),
                perceivedFairness: this.assessScoldingFairness(context)
            });
        }
    }

    performIgnore(context) {
        // Start ignore period
        this.startIgnorePeriod(300000); // 5 minutes
        
        this.creature.recordComplexInteraction('ignored', {
            duration: 300000,
            creatureState: this.creature.mood
        }, context);
        
        this.updateUserBehaviorProfile('distant', 0.5);
        
        if (window.tamagotchiGame) {
            window.tamagotchiGame.addChatMessage('System', 'You are now ignoring your pet for 5 minutes...', 'system');
        }
    }

    startIgnorePeriod(duration) {
        this.isIgnoring = true;
        this.ignoreStartTime = Date.now();
        
        // Disable most interactions during ignore period
        this.disableInteractionButtons(true);
        
        setTimeout(() => {
            this.endIgnorePeriod();
        }, duration);
        
        // Creature reaction to being ignored
        this.creature.frustrationLevel = Math.min(100, this.creature.frustrationLevel + 20);
        this.creature.attachmentLevel = Math.max(0, this.creature.attachmentLevel - 5);
    }

    endIgnorePeriod() {
        this.isIgnoring = false;
        this.disableInteractionButtons(false);
        
        if (window.tamagotchiGame) {
            window.tamagotchiGame.addChatMessage('System', 'Ignore period ended. Your pet missed you!', 'system');
        }
        
        // Creature reaction to end of ignore
        if (Math.random() < 0.8) {
            setTimeout(() => {
                this.languageLearning.expressThought('see_user_return', 0.9);
            }, 1000);
        }
    }

    initiateIntroduction(context) {
        // Simulate introducing the creature to someone new
        const names = ['Alex', 'Sam', 'Jordan', 'Casey', 'Taylor', 'Riley'];
        const name = names[Math.floor(Math.random() * names.length)];
        
        const introduction = `This is ${name}, they're my friend!`;
        
        // Process through entity manager and language system
        if (this.entityManager) {
            const personData = this.entityManager.registerPerson(introduction, 'introduction');
            
            if (personData && personData.isNewPerson) {
                // Creature meets new person
                this.creature.socialAnxiety = Math.min(100, this.creature.socialAnxiety + 10);
                
                if (window.tamagotchiGame) {
                    window.tamagotchiGame.addChatMessage('System', introduction, 'system');
                }
                
                // Creature reaction to meeting new person
                const reactionType = this.creature.socialAnxiety > 60 ? 'nervous_meeting' : 'excited_meeting';
                setTimeout(() => {
                    this.languageLearning.expressThought(reactionType, 0.8);
                }, 1500);
            }
        }
        
        this.recordUserActivity('social_introduction');
    }

    // ADVANCED INTERACTION ANALYSIS
    handleInteractionStart(event) {
        this.interactionStartTime = Date.now();
        this.interactionStartPos = this.getEventPosition(event);
        this.isInteracting = true;
        
        this.recordUserActivity('interaction_start');
    }

    handleInteractionEnd(event) {
        if (!this.isInteracting) return;
        
        const endTime = Date.now();
        const endPos = this.getEventPosition(event);
        const duration = endTime - this.interactionStartTime;
        
        const interactionData = {
            duration: duration,
            startPos: this.interactionStartPos,
            endPos: endPos,
            movement: this.calculateMovement(this.interactionStartPos, endPos),
            pressure: this.estimatePressure(event),
            type: this.classifyInteractionType(duration, this.calculateMovement(this.interactionStartPos, endPos))
        };
        
        this.processComplexInteraction(interactionData);
        this.isInteracting = false;
    }

    classifyInteractionType(duration, movement) {
        if (duration < 200) {
            return movement < 10 ? 'quick_tap' : 'swipe';
        } else if (duration < 1000) {
            return movement < 20 ? 'press' : 'drag';
        } else {
            return movement < 30 ? 'long_press' : 'complex_gesture';
        }
    }

    processComplexInteraction(interactionData) {
        const interpretation = this.interpretInteraction(interactionData);
        
        // Record interaction with full context
        const context = {
            interactionData: interactionData,
            interpretation: interpretation,
            userBehavior: this.userBehaviorProfile,
            creatureState: {
                mood: this.creature.mood,
                trustLevel: this.creature.trustLevel,
                aggressionLevel: this.creature.aggressionLevel
            }
        };
        
        this.creature.recordComplexInteraction(interpretation.type, interpretation, context);
        
        // Update user behavior profile
        this.updateUserBehaviorFromInteraction(interactionData, interpretation);
        
        // Generate appropriate response
        this.respondToInteraction(interpretation, context);
        
        // Learn from the interaction
        this.learnFromInteraction(interactionData, interpretation, context);
    }

    interpretInteraction(data) {
        const interpretation = {
            type: 'neutral_touch',
            intensity: 1.0,
            intent: 'attention',
            gentleness: 0.5,
            playfulness: 0.3
        };
        
        // Analyze duration
        if (data.duration < 300) {
            interpretation.intent = 'quick_attention';
            interpretation.playfulness += 0.3;
        } else if (data.duration > 2000) {
            interpretation.intent = 'comfort_seeking';
            interpretation.gentleness += 0.4;
        }
        
        // Analyze movement
        if (data.movement > 50) {
            interpretation.type = 'playful_interaction';
            interpretation.playfulness += 0.5;
            interpretation.intensity += 0.3;
        } else if (data.movement < 10) {
            interpretation.type = 'gentle_touch';
            interpretation.gentleness += 0.5;
        }
        
        // Analyze pressure (estimated)
        if (data.pressure > 0.8) {
            interpretation.intensity += 0.4;
            interpretation.gentleness -= 0.3;
        }
        
        // Context modifications
        if (this.creature.mood === 'angry' && interpretation.intensity > 1.2) {
            interpretation.type = 'potentially_annoying';
        }
        if (this.creature.socialAnxiety > 70 && interpretation.intensity > 1.0) {
            interpretation.type = 'overwhelming_touch';
        }
        
        return interpretation;
    }

    // CONTEXTUAL MONITORING
    startContextualMonitoring() {
        setInterval(() => {
            this.updateContext();
            this.analyzeUserBehaviorPatterns();
            this.assessSocialSituation();
        }, 10000); // Every 10 seconds
    }

    updateContext() {
        const now = Date.now();
        this.currentContext = {
            timestamp: now,
            timeOfDay: this.getTimeOfDay(),
            sessionDuration: now - (this.sessionStartTime || now),
            userPresent: !document.hidden,
            recentActivity: this.getRecentActivity(),
            creatureState: {
                mood: this.creature.mood,
                needsUrgency: this.calculateNeedsUrgency(),
                emotionalStability: this.calculateEmotionalStability()
            },
            interactionHistory: this.getRecentInteractionSummary()
        };
    }

    calculateNeedsUrgency() {
        const needs = [
            this.creature.hunger,
            this.creature.health,
            this.creature.energy,
            this.creature.happiness
        ];
        
        const urgency = needs.reduce((total, need) => {
            if (need < 20) return total + 0.8;
            if (need < 40) return total + 0.4;
            return total;
        }, 0);
        
        return Math.min(1.0, urgency);
    }

    calculateEmotionalStability() {
        const factors = [
            1 - (this.creature.aggressionLevel / 100),
            1 - (this.creature.frustrationLevel / 100),
            1 - (this.creature.socialAnxiety / 100),
            this.creature.trustLevel / 100
        ];
        
        return factors.reduce((a, b) => a + b, 0) / factors.length;
    }

    // BEHAVIOR ANALYSIS
    startBehaviorAnalysis() {
        setInterval(() => {
            this.analyzeLongTermPatterns();
            this.updateRelationshipAssessment();
            this.assessLearningProgress();
        }, 30000); // Every 30 seconds
    }

    analyzeLongTermPatterns() {
        const recentInteractions = this.getRecentInteractions(600000); // Last 10 minutes
        
        if (recentInteractions.length > 5) {
            const patterns = {
                consistency: this.calculatePatternConsistency(recentInteractions),
                kindness: this.assessOverallKindness(recentInteractions),
                engagement: this.calculateEngagementLevel(recentInteractions),
                patience: this.assessUserPatience(recentInteractions)
            };
            
            this.updateUserBehaviorProfile('patterns', patterns);
        }
    }

    // Add this method to InteractionHandler class:
    analyzeUserBehaviorPatterns() {
        const recentInteractions = this.getRecentInteractions(600000); // Last 10 minutes
        
        if (recentInteractions.length > 3) {
            // Analyze interaction frequency
            const averageInterval = this.calculateAverageInterval(recentInteractions);
            this.userBehaviorProfile.consistency = this.calculateConsistency(recentInteractions);
            
            // Analyze interaction types
            const interactionTypes = recentInteractions.map(i => i.type);
            this.userBehaviorProfile.preferredInteractions = this.findMostFrequentTypes(interactionTypes);
            
            // Update overall behavior assessment
            this.updateBehaviorAssessment(recentInteractions);
        }
    }


    respondToInteraction(interpretation, context) {
    // Generate appropriate creature response based on interaction
    const response = this.generateInteractionResponse(interpretation, context);
    
    // Apply the response to the creature
    this.applyCreatureResponse(response, interpretation);
    
    // Update creature's emotional state
    this.updateCreatureEmotionalState(interpretation, context);
    
    // Possibly generate verbal response
    if (Math.random() < this.calculateVerbalizationProbability(interpretation)) {
        setTimeout(() => {
            this.generateVerbalResponse(interpretation, context);
        }, 200 + Math.random() * 1000);
    }
    
    console.log(`Creature responded to ${interpretation.type} with ${response.type}`);
}

generateInteractionResponse(interpretation, context) {
    const responses = {
        'gentle_touch': { type: 'purr', happiness: 5, trust: 2 },
        'playful_interaction': { type: 'excited_movement', happiness: 8, energy: -3 },
        'rough_handling': { type: 'recoil', happiness: -3, trust: -1, aggression: 2 },
        'neutral_touch': { type: 'acknowledge', happiness: 2 }
    };
    
    const baseResponse = responses[interpretation.type] || responses['neutral_touch'];
    
    // Modify response based on creature's current state
    if (this.creature.mood === 'angry') {
        baseResponse.happiness = Math.min(baseResponse.happiness, 0);
        baseResponse.aggression = (baseResponse.aggression || 0) + 1;
    }
    
    if (this.creature.trustLevel < 30) {
        baseResponse.trust = (baseResponse.trust || 0) * 0.5;
    }
    
    return baseResponse;
}

applyCreatureResponse(response, interpretation) {
    // Apply stat changes
    if (response.happiness) this.creature.addHappiness(response.happiness);
    if (response.trust) this.creature.adjustTrust(response.trust);
    if (response.energy) this.creature.adjustEnergy(response.energy);
    if (response.aggression) {
        this.creature.aggressionLevel = Math.max(0, 
            Math.min(100, (this.creature.aggressionLevel || 0) + response.aggression));
    }
    
    // Create visual feedback
    this.createInteractionEffect(interpretation.type, response.type);
}

updateCreatureEmotionalState(interpretation, context) {
    // Update mood based on interaction quality
    const moodImpact = this.calculateMoodImpact(interpretation, context);
    
    if (moodImpact > 0.3) {
        this.creature.setMood('happy');
    } else if (moodImpact < -0.3) {
        this.creature.setMood('sad');
    } else if (interpretation.intensity > 0.8) {
        this.creature.setMood('excited');
    }
}

calculateVerbalizationProbability(interpretation) {
    let probability = 0.3; // base probability
    
    if (interpretation.type === 'playful_interaction') probability += 0.3;
    if (interpretation.type === 'gentle_touch') probability += 0.2;
    if (this.creature.mood === 'happy') probability += 0.2;
    if (this.creature.mood === 'lonely') probability += 0.4;
    
    return Math.min(0.8, probability);
}

generateVerbalResponse(interpretation, context) {
    if (this.languageLearning) {
        const responseType = this.mapInteractionToResponseType(interpretation);
        this.languageLearning.expressThought(responseType, interpretation.intensity);
    }
}

mapInteractionToResponseType(interpretation) {
    const mapping = {
        'gentle_touch': 'content',
        'playful_interaction': 'playful',
        'rough_handling': 'distressed',
        'neutral_touch': 'acknowledge',
        'long_press': 'comfort'
    };
    
    return mapping[interpretation.type] || 'neutral';
}

learnFromInteraction(interactionData, interpretation, context) {
    // Learn user patterns
    this.updateInteractionPatterns(interpretation, context);
    
    // Update expectations
    this.updateUserExpectations(interpretation, context);
    
    // Record learning data
    this.recordInteractionLearning(interactionData, interpretation, context);
    
    // Update cognitive models if available
    if (this.cognitiveProcessor) {
        this.cognitiveProcessor.processInteractionLearning(interpretation, context);
    }
}

updateInteractionPatterns(interpretation, context) {
    const patternKey = `${interpretation.type}_${context.creatureState.mood}`;
    
    if (!this.interactionPatterns.has(patternKey)) {
        this.interactionPatterns.set(patternKey, {
            count: 0,
            totalIntensity: 0,
            outcomes: []
        });
    }
    
    const pattern = this.interactionPatterns.get(patternKey);
    pattern.count++;
    pattern.totalIntensity += interpretation.intensity;
    pattern.outcomes.push({
        userSatisfaction: this.estimateUserSatisfaction(interpretation, context),
        creatureResponse: context.creatureState.mood,
        timestamp: Date.now()
    });
    
    // Keep only recent outcomes
    if (pattern.outcomes.length > 10) {
        pattern.outcomes = pattern.outcomes.slice(-5);
    }
}

updateUserExpectations(interpretation, context) {
    // Update what we expect the user to do next
    // This is used for predictive responses
    if (!this.userBehaviorProfile.expectations) {
        this.userBehaviorProfile.expectations = {};
    }
    
    const currentTime = Date.now();
    const timeSinceLastInteraction = currentTime - (this.userBehaviorProfile.lastInteractionTime || currentTime);
    
    this.userBehaviorProfile.expectations.nextInteractionTime = currentTime + timeSinceLastInteraction;
    this.userBehaviorProfile.expectations.likelyNextAction = this.predictNextAction(interpretation);
}

predictNextAction(interpretation) {
    // Simple prediction based on current interaction
    if (interpretation.type === 'gentle_touch') return 'continued_gentle_interaction';
    if (interpretation.type === 'playful_interaction') return 'more_play';
    return 'unknown';
}

recordInteractionLearning(interactionData, interpretation, context) {
    // Record in conceptual memory if available
    if (this.conceptualMemory) {
        this.conceptualMemory.recordEpisode('interaction_learning', {
            interactionType: interpretation.type,
            userBehavior: {
                gentleness: interpretation.gentleness,
                playfulness: interpretation.playfulness,
                intensity: interpretation.intensity
            },
            creatureResponse: context.creatureState,
            outcome: 'learning_recorded',
            timestamp: Date.now()
        });
    }
}

estimateUserSatisfaction(interpretation, context) {
    // Estimate how satisfied the user seemed with the interaction
    let satisfaction = 0.5;
    
    if (interpretation.gentleness > 0.7) satisfaction += 0.2;
    if (interpretation.playfulness > 0.5 && context.creatureState.mood === 'happy') satisfaction += 0.3;
    if (interpretation.intensity < 0.3) satisfaction += 0.1; // gentle is usually good
    
    return Math.max(0, Math.min(1, satisfaction));
}

calculateMoodImpact(interpretation, context) {
    let impact = 0;
    
    if (interpretation.type === 'gentle_touch') impact += 0.4;
    if (interpretation.type === 'playful_interaction') impact += 0.3;
    if (interpretation.type === 'rough_handling') impact -= 0.5;
    if (interpretation.gentleness > 0.7) impact += 0.2;
    if (interpretation.intensity > 0.9) impact -= 0.1; // too intense can be negative
    
    // Consider creature's current state
    if (context.creatureState.mood === 'sad' && impact > 0) impact *= 1.5;
    if (context.creatureState.trustLevel < 30 && impact > 0) impact *= 0.5;
    
    return Math.max(-1, Math.min(1, impact));
}

createInteractionEffect(interactionType, responseType) {
    // Create visual feedback for the interaction
    const effectsContainer = document.getElementById('effectsContainer') || document.body;
    
    const effect = document.createElement('div');
    effect.className = 'interaction-feedback';
    effect.style.position = 'absolute';
    effect.style.pointerEvents = 'none';
    effect.style.fontSize = '24px';
    effect.style.zIndex = '1000';
    
    const effectMap = {
        'gentle_touch': '💖',
        'playful_interaction': '🎉',
        'rough_handling': '😢',
        'neutral_touch': '✨'
    };
    
    effect.textContent = effectMap[interactionType] || '✨';
    
    // Position near creature
    const creatureStage = document.getElementById('creatureStage');
    if (creatureStage) {
        const rect = creatureStage.getBoundingClientRect();
        effect.style.left = (rect.left + rect.width / 2) + 'px';
        effect.style.top = (rect.top + rect.height / 2) + 'px';
    }
    
    effectsContainer.appendChild(effect);
    
    // Animate and remove
    setTimeout(() => {
        effect.style.transform = 'translateY(-30px)';
        effect.style.opacity = '0';
        effect.style.transition = 'all 1s ease-out';
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1000);
    }, 100);
}

    updateUserBehaviorFromInteraction(interactionData, interpretation) {
        if (!this.userBehaviorProfile) {
            this.userBehaviorProfile = this.createUserBehaviorProfile();
        }
        
        // Update interaction frequency
        this.userBehaviorProfile.totalInteractions++;
        
        // Update gentleness profile
        this.userBehaviorProfile.averageGentleness = 
            (this.userBehaviorProfile.averageGentleness * 0.9) + (interpretation.gentleness * 0.1);
        
        // Update playfulness profile
        this.userBehaviorProfile.preferredPlayfulness = 
            (this.userBehaviorProfile.preferredPlayfulness * 0.9) + (interpretation.playfulness * 0.1);
        
        // Update intensity preference
        this.userBehaviorProfile.preferredIntensity = 
            (this.userBehaviorProfile.preferredIntensity * 0.9) + (interpretation.intensity * 0.1);
        
        // Update timing patterns
        const currentTime = Date.now();
        if (this.userBehaviorProfile.lastInteractionTime) {
            const interval = currentTime - this.userBehaviorProfile.lastInteractionTime;
            this.userBehaviorProfile.averageInteractionInterval = 
                (this.userBehaviorProfile.averageInteractionInterval * 0.8) + (interval * 0.2);
        }
        this.userBehaviorProfile.lastInteractionTime = currentTime;
        
        // Update kindness score
        const kindnessScore = this.calculateKindnessScore(interpretation);
        this.userBehaviorProfile.kindnessLevel = 
            (this.userBehaviorProfile.kindnessLevel * 0.9) + (kindnessScore * 0.1);
        
        console.log('Updated user behavior profile', this.userBehaviorProfile);
    }

    calculateKindnessScore(interpretation) {
        let kindnessScore = 0.5; // baseline
        
        if (interpretation.type === 'gentle_touch') kindnessScore += 0.3;
        if (interpretation.type === 'playful_interaction') kindnessScore += 0.2;
        if (interpretation.intent === 'comfort_seeking') kindnessScore += 0.2;
        if (interpretation.gentleness > 0.7) kindnessScore += 0.2;
        if (interpretation.intensity < 0.3) kindnessScore += 0.1; // gentle interactions
        
        return Math.max(0, Math.min(1, kindnessScore));
    }

    createUserBehaviorProfile() {
        return {
            totalInteractions: 0,
            averageGentleness: 0.5,
            preferredPlayfulness: 0.5,
            preferredIntensity: 0.5,
            kindnessLevel: 0.5,
            averageInteractionInterval: 5000,
            lastInteractionTime: null,
            consistency: 0.5,
            patterns: {
                consistency: 0.5,
                kindness: 0.5,
                engagement: 0.5,
                patience: 0.5
            }
        };
    }


    updateRelationshipAssessment() {
        // Assess the relationship between user and creature
        if (!this.entityManager || !this.creature) return;
        
        // Ensure user behavior profile exists with all nested objects
        this.ensureUserBehaviorProfile();
        
        const recentInteractions = this.getRecentInteractions(1800000); // Last 30 minutes
        
        if (recentInteractions.length > 0) {
            // Calculate relationship metrics
            const positiveRatio = recentInteractions.filter(i => i.positive).length / recentInteractions.length;
            const interactionFrequency = recentInteractions.length / 30; // per minute
            const averageIntensity = recentInteractions.reduce((sum, i) => sum + (i.intensity || 1), 0) / recentInteractions.length;
            
            // Update user behavior profile based on relationship assessment
            // Now safe to access since ensureUserBehaviorProfile() was called
            this.userBehaviorProfile.relationship.trustBuilding = positiveRatio;
            this.userBehaviorProfile.relationship.empathy = Math.min(1.0, averageIntensity * positiveRatio);
            this.userBehaviorProfile.attentiveness = Math.min(1.0, interactionFrequency);
            
            // Update creature's trust based on relationship quality
            if (positiveRatio > 0.7) {
                this.creature.trustLevel = Math.min(100, this.creature.trustLevel + 0.5);
            } else if (positiveRatio < 0.3) {
                this.creature.trustLevel = Math.max(0, this.creature.trustLevel - 0.3);
            }
        }
    }

    assessLearningProgress() {
        // Assess how well the user is helping the creature learn
        if (!this.languageLearning || !this.creature) return;
        
        const languageStats = this.languageLearning.getLanguageStats();
        const creatureAge = this.creature.age;
        
        // Calculate learning effectiveness
        const expectedVocabulary = Math.floor(creatureAge / 2) + 3; // Expected words based on age
        const actualVocabulary = languageStats.vocabularySize;
        const learningEffectiveness = Math.min(1.0, actualVocabulary / expectedVocabulary);
        
        // Update user behavior profile
        this.userBehaviorProfile.learningHistory.teachingAttempts = this.creature.totalInteractions;
        this.userBehaviorProfile.learningHistory.effectiveness = learningEffectiveness;
        
        // Provide feedback if learning is particularly good or poor
        if (learningEffectiveness > 1.2 && Math.random() < 0.1) {
            // Creature is learning exceptionally well
            if (window.tamagotchiGame) {
                window.tamagotchiGame.addChatMessage('System', 
                    `${this.creature.name} is learning remarkably well thanks to your interaction style!`, 
                    'system');
            }
        } else if (learningEffectiveness < 0.5 && this.creature.age > 5 && Math.random() < 0.1) {
            // Learning might be slower than expected
            if (window.tamagotchiGame) {
                window.tamagotchiGame.addChatMessage('System', 
                    `${this.creature.name} might benefit from more varied interactions to help with language development.`, 
                    'system');
            }
        }
    }

    calculateAverageInterval(interactions) {
        if (interactions.length < 2) return 0;
        
        const intervals = [];
        for (let i = 1; i < interactions.length; i++) {
            intervals.push(interactions[i].timestamp - interactions[i-1].timestamp);
        }
        
        return intervals.reduce((a, b) => a + b, 0) / intervals.length;
    }

    calculateConsistency(interactions) {
        // Simple consistency measure based on interaction timing
        const intervals = [];
        for (let i = 1; i < interactions.length; i++) {
            intervals.push(interactions[i].timestamp - interactions[i-1].timestamp);
        }
        
        if (intervals.length === 0) return 0.5;
        
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((sum, interval) => 
            sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
        
        return Math.max(0, 1 - (variance / (avgInterval * avgInterval)));
    }

    findMostFrequentTypes(types) {
        const frequency = {};
        for (let type of types) {
            frequency[type] = (frequency[type] || 0) + 1;
        }
        
        return Object.keys(frequency)
            .sort((a, b) => frequency[b] - frequency[a])
            .slice(0, 3);
    }

    updateBehaviorAssessment(interactions) {
        const positiveCount = interactions.filter(i => i.positive).length;
        const positiveRatio = positiveCount / interactions.length;
        
        this.userBehaviorProfile.kindness = positiveRatio;
        this.userBehaviorProfile.engagement = Math.min(1.0, interactions.length / 10);
    }

    getRecentInteractions(timeWindow) {
        if (!this.creature.interactionHistory) return [];
        
        const cutoff = Date.now() - timeWindow;
        return this.creature.interactionHistory.filter(interaction => 
            interaction.timestamp > cutoff
        );
    }

    // Also add this method:
    assessSocialSituation() {
        // Assess current social context
        const timeSinceLastInteraction = Date.now() - this.creature.lastInteraction;
        
        if (timeSinceLastInteraction > 300000) { // 5 minutes
            this.socialSituation = 'alone';
        } else if (this.userAttentionLevel > 0.7) {
            this.socialSituation = 'active_interaction';
        } else {
            this.socialSituation = 'passive_presence';
        }
    }

    // UTILITY METHODS
    getEventPosition(event) {
        const rect = event.target.getBoundingClientRect();
        const clientX = event.clientX || (event.touches && event.touches[0]?.clientX);
        const clientY = event.clientY || (event.touches && event.touches[0]?.clientY);
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    calculateMovement(pos1, pos2) {
        return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
    }

    estimatePressure(event) {
        // Very rough pressure estimation
        if (event.force !== undefined) return event.force;
        if (event.touches && event.touches[0]?.force !== undefined) return event.touches[0].force;
        return 0.5; // default estimate
    }

    showInteractionEffect(type, position) {
        const effectsContainer = document.getElementById('interactionEffects');
        if (!effectsContainer) return;
        
        const effect = document.createElement('div');
        effect.className = `interaction-effect ${type}`;
        
        const effectMap = {
            gentle_pet: '💖',
            praise: '⭐',
            scold: '⚠️',
            play: '🎾',
            comfort: '🤗'
        };
        
        effect.innerHTML = effectMap[type] || '✨';
        effect.style.left = position.x + 'px';
        effect.style.top = position.y + 'px';
        
        effectsContainer.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 2000);
    }

    recordUserActivity(activityType) {
        this.lastUserActivity = Date.now();
        this.userAttentionLevel = Math.min(1.0, this.userAttentionLevel + 0.1);
        
        this.activityPattern.push({
            type: activityType,
            timestamp: this.lastUserActivity
        });
        
        // Keep only recent activity
        if (this.activityPattern.length > 100) {
            this.activityPattern = this.activityPattern.slice(-50);
        }
        
        // Clear inactivity timeout
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
        }
        
        // Set new inactivity timeout
        this.inactivityTimeout = setTimeout(() => {
            this.handleUserInactivity();
        }, 300000); // 5 minutes
    }

    handleUserInactivity() {
        this.userAttentionLevel = Math.max(0, this.userAttentionLevel - 0.3);
        this.creature.recordUserAbsence();
        
        // Creature might express loneliness
        if (Math.random() < 0.6) {
            setTimeout(() => {
                this.languageLearning.expressThought('lonely', 0.7);
            }, 2000);
        }
    }

    toggleDebugPanel() {
        const debugPanel = document.getElementById('debugPanel');
        if (debugPanel) {
            const isVisible = debugPanel.style.display !== 'none';
            debugPanel.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                this.updateDebugPanel();
            }
        }
    }

    updateDebugPanel() {
        const debugPanel = document.getElementById('debugPanel');
        if (!debugPanel || debugPanel.style.display === 'none') return;
        
        // Update debug information
        document.getElementById('currentThoughts').textContent = 
            JSON.stringify(this.cognitiveProcessor?.getCurrentThoughts() || {}, null, 2);
        
        document.getElementById('entityStatus').textContent = 
            JSON.stringify(this.entityManager?.getAllKnownPeople() || [], null, 2);
        
        document.getElementById('recentLearning').textContent = 
            JSON.stringify(this.languageLearning?.getLanguageStats() || {}, null, 2);
        
        document.getElementById('activeHypotheses').textContent = 
            JSON.stringify(this.cognitiveProcessor?.getDebugInfo()?.currentHypotheses || [], null, 2);
    }

    // Voice recognition helpers (continuing from earlier)
    startVoiceRecording() {
        if (!this.recognition || this.isRecording) return;

        try {
            this.recognition.start();
            this.recordingTimeout = setTimeout(() => {
                this.stopVoiceRecording();
            }, 10000);
        } catch (error) {
            console.error('Failed to start voice recording:', error);
            this.showVoiceError('Could not start voice recording: ' + error.message);
        }
    }

    stopVoiceRecording() {
        if (!this.isRecording) return;

        this.isRecording = false;
        
        if (this.recognition) {
            try {
                this.recognition.stop();
            } catch (error) {

                console.warn('Error stopping recognition:', error);
           }
       }
       
       if (this.recordingTimeout) {
           clearTimeout(this.recordingTimeout);
           this.recordingTimeout = null;
       }
       
       this.updateVoiceButton(false);
       this.showVoiceStatus('Voice recording stopped');
   }

   updateVoiceButton(isRecording) {
       const voiceButton = document.getElementById('voiceButton');
       if (voiceButton) {
           if (isRecording) {
               voiceButton.innerHTML = '🔴 Recording...';
               voiceButton.style.backgroundColor = '#e17055';
               voiceButton.classList.add('recording');
           } else {
               voiceButton.innerHTML = '🎤 Voice';
               voiceButton.style.backgroundColor = '';
               voiceButton.classList.remove('recording');
           }
       }
   }

   showVoiceStatus(message) {
       console.log('Voice status:', message);
       if (window.tamagotchiGame) {
           window.tamagotchiGame.addChatMessage('System', message, 'system');
       }
   }

   showVoiceError(message) {
       console.error('Voice error:', message);
       if (window.tamagotchiGame) {
           window.tamagotchiGame.addChatMessage('System', 'Voice error: ' + message, 'system');
       }
   }

   handleVoiceError(errorType) {
       const errorMessages = {
           'no-speech': 'No speech detected. Try speaking closer to the microphone.',
           'audio-capture': 'Microphone access denied or unavailable.',
           'not-allowed': 'Microphone permission denied.',
           'network': 'Network error during voice recognition.',
           'service-not-allowed': 'Voice recognition service not available.'
       };
       
       const message = errorMessages[errorType] || 'Unknown voice recognition error: ' + errorType;
       this.showVoiceError(message);
   }

   handleLowConfidenceVoice(results) {
       // Try to salvage something from low-confidence results
       if (results.length > 0) {
           const bestEffort = results[0].transcript;
           console.log(`Low confidence voice input: "${bestEffort}"`);
           
           // Still process but mark as uncertain
           this.processVoiceInput(bestEffort + ' [uncertain]', {
               confidence: results[0].confidence,
               uncertain: true
           });
       }
   }

   // Helper methods for interaction processing
   assessScoldingFairness(context) {
       // Simple fairness assessment based on creature's recent behavior
       const recentBehavior = this.getRecentCreatureActions();
       const problematicBehavior = recentBehavior.filter(action => 
           action.type === 'aggressive' || action.type === 'destructive'
       );
       
       return problematicBehavior.length > 0 ? 0.8 : 0.2;
   }

   getRecentCreatureActions() {
       // Get creature's recent actions from interaction history
       return this.creature.interactionHistory
           .slice(-5)
           .map(interaction => ({
               type: interaction.type,
               timestamp: interaction.timestamp
           }));
   }

   disableInteractionButtons(disable) {
       const buttons = ['feedBtn', 'playBtn', 'gentlePetBtn', 'praiseBtn'];
       buttons.forEach(buttonId => {
           const button = document.getElementById(buttonId);
           if (button) {
               button.disabled = disable;
               button.style.opacity = disable ? '0.5' : '1.0';
           }
       });
   }

    calculateActionIntensity(actionType) {
        // Base intensity modified by user behavior profile
        const baseIntensity = {
            'gentle_pet': 1.0,
            'praise': 1.2,
            'scold': 1.0,
            'play': 1.1,
            'ignore': 0.8,
            'introduce_someone': 1.0
        };
        
        const base = baseIntensity[actionType] || 1.0;
        
        // Safety check: ensure relationship object exists
        if (!this.userBehaviorProfile || !this.userBehaviorProfile.relationship) {
            console.warn('User behavior profile relationship not initialized, using defaults');
            this.userBehaviorProfile = this.createUserBehaviorProfile();
        }
        
        const personalityModifier = this.userBehaviorProfile.relationship.empathy || 0.5;
        
        return base * (0.5 + personalityModifier * 0.5);
    }

   updateUserBehaviorProfile(trait, value) {
       const profile = this.userBehaviorProfile;
       
       // Update specific traits based on interactions
       if (typeof value === 'number') {
           // Gradually adjust trait
           switch (trait) {
               case 'gentle':
                   profile.interactionStyle = this.blendTraits(profile.interactionStyle, 'gentle', value);
                   profile.relationship.empathy = Math.min(1.0, profile.relationship.empathy + value * 0.1);
                   break;
               case 'supportive':
                   profile.relationship.empathy = Math.min(1.0, profile.relationship.empathy + value * 0.2);
                   profile.learningHistory.patienceLevel = Math.min(1.0, profile.learningHistory.patienceLevel + value * 0.1);
                   break;
               case 'strict':
                   profile.learningHistory.correctionStyle = 'firm';
                   break;
               case 'distant':
                   profile.attentiveness = Math.max(0.1, profile.attentiveness - value * 0.2);
                   break;
           }
       } else if (typeof value === 'object') {
           // Update pattern analysis
           Object.assign(profile, value);
       }
   }

   blendTraits(currentTrait, newTrait, strength) {
       // Simple trait blending - in a real system this would be more sophisticated
       return strength > 0.5 ? newTrait : currentTrait;
   }

   blendEmotionalAssessment(current, newTone, blendFactor) {
       // Simple emotional tone blending
       if (current === 'neutral' || Math.random() < blendFactor) {
           return newTone;
       }
       return current;
   }

   getRecentInteractions(timeWindow = 300000) {
       const cutoff = Date.now() - timeWindow;
       return this.creature.interactionHistory.filter(interaction => 
           interaction.timestamp > cutoff
       );
   }

   getRecentActivity(timeWindow = 60000) {
       const cutoff = Date.now() - timeWindow;
       return this.activityPattern.filter(activity => 
           activity.timestamp > cutoff
       );
   }

   getRecentInteractionSummary() {
       const recent = this.getRecentInteractions(600000); // 10 minutes
       return {
           count: recent.length,
           types: [...new Set(recent.map(i => i.type))],
           averagePositivity: recent.length > 0 ? 
               recent.filter(i => i.positive).length / recent.length : 0.5,
           mostRecentType: recent.length > 0 ? recent[recent.length - 1].type : null
       };
   }

   getTimeOfDay() {
       const hour = new Date().getHours();
       if (hour < 6) return 'night';
       if (hour < 12) return 'morning';
       if (hour < 18) return 'afternoon';
       return 'evening';
   }

   calculatePatternConsistency(interactions) {
       // Measure how consistent user behavior patterns are
       const intervals = [];
       for (let i = 1; i < interactions.length; i++) {
           intervals.push(interactions[i].timestamp - interactions[i-1].timestamp);
       }
       
       if (intervals.length < 2) return 0.5;
       
       const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
       const variance = intervals.reduce((sum, interval) => 
           sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
       
       return Math.max(0, 1 - (variance / (avgInterval * avgInterval)));
   }

   assessOverallKindness(interactions) {
       const positiveInteractions = interactions.filter(i => i.positive).length;
       return interactions.length > 0 ? positiveInteractions / interactions.length : 0.5;
   }

   calculateEngagementLevel(interactions) {
       const engagementScores = {
           'voice_interaction': 1.0,
           'gentle_pet': 0.8,
           'play': 0.9,
           'praise': 0.7,
           'fed': 0.6,
           'scold': 0.5,
           'ignored': 0.0
       };
       
       const totalScore = interactions.reduce((sum, interaction) => 
           sum + (engagementScores[interaction.type] || 0.5), 0);
       
       return interactions.length > 0 ? totalScore / interactions.length : 0.5;
   }

   assessUserPatience(interactions) {
       // Look for signs of impatience in interaction patterns
       let patienceScore = 0.7; // baseline
       
       // Rapid repeated interactions suggest impatience
       let rapidSequences = 0;
       for (let i = 1; i < interactions.length; i++) {
           if (interactions[i].timestamp - interactions[i-1].timestamp < 1000) {
               rapidSequences++;
           }
       }
       
       if (rapidSequences > interactions.length * 0.3) {
           patienceScore -= 0.3;
       }
       
       return Math.max(0.1, Math.min(1.0, patienceScore));
   }

   handleVisibilityChange() {
       if (document.hidden) {
           this.userAttentionLevel = 0;
           this.recordUserActivity('page_hidden');
           
           // Creature notices user left
           this.creature.recordUserAbsence();
       } else {
           this.recordUserActivity('page_visible');
           this.userAttentionLevel = 0.7;
           
           // Creature notices user returned
           if (Math.random() < 0.6) {
               setTimeout(() => {
                   this.languageLearning.expressThought('see_user_return', 0.8);
               }, 1000);
           }
       }
   }

   // Context menu for advanced interactions
   showInteractionContextMenu(event) {
       // Create context menu with advanced interaction options
       const menu = document.createElement('div');
       menu.className = 'interaction-context-menu';
       menu.innerHTML = `
           <div class="menu-item" data-action="gentle_stroke">Gentle Stroke</div>
           <div class="menu-item" data-action="playful_poke">Playful Poke</div>
           <div class="menu-item" data-action="comfort_touch">Comfort Touch</div>
           <div class="menu-item" data-action="examine">Examine Creature</div>
       `;
       
       menu.style.position = 'absolute';
       menu.style.left = event.clientX + 'px';
       menu.style.top = event.clientY + 'px';
       menu.style.zIndex = '10000';
       
       document.body.appendChild(menu);
       
       // Handle menu clicks
       menu.addEventListener('click', (e) => {
           if (e.target.classList.contains('menu-item')) {
               const action = e.target.dataset.action;
               this.handleContextMenuAction(action);
               document.body.removeChild(menu);
           }
       });
       
       // Remove menu when clicking elsewhere
       setTimeout(() => {
           document.addEventListener('click', function removeMenu() {
               if (menu.parentNode) {
                   document.body.removeChild(menu);
               }
               document.removeEventListener('click', removeMenu);
           });
       }, 100);
   }

   handleContextMenuAction(action) {
       const context = {
           actionType: action,
           deliberate: true,
           contextMenuUsed: true
       };
       
       switch (action) {
           case 'gentle_stroke':
               this.performGentlePet(1.2, context);
               break;
           case 'playful_poke':
               this.handleSocialAction('play');
               break;
           case 'comfort_touch':
               this.performComfortTouch(context);
               break;
           case 'examine':
               this.performExamination(context);
               break;
       }
   }

   performComfortTouch(context) {
       // Special comforting interaction
       this.creature.recordComplexInteraction('comfort_touch', {
           userIntent: 'comfort',
           emotionalSupport: true
       }, context);
       
       this.creature.socialAnxiety = Math.max(0, this.creature.socialAnxiety - 10);
       this.creature.addHappiness(12);
       
       if (this.creature.mood === 'sad' || this.creature.mood === 'lonely') {
           this.creature.addHappiness(8); // extra comfort bonus
       }
       
       this.showInteractionEffect('comfort', {x: 200, y: 150});
       
       setTimeout(() => {
           this.languageLearning.expressThought('comforted', 0.7);
       }, 800);
   }

   performExamination(context) {
       // User examines the creature - increases creature's self-awareness
       this.creature.recordComplexInteraction('examined', {
           userIntent: 'observation',
           increasesAwareness: true
       }, context);
       
       if (window.tamagotchiGame) {
           const status = this.generateExaminationReport();
           window.tamagotchiGame.addChatMessage('System', status, 'system');
       }
       
       // Creature becomes more self-aware
       if (this.cognitiveProcessor) {
           this.cognitiveProcessor.curiosityLevel = Math.min(1.0, this.cognitiveProcessor.curiosityLevel + 0.1);
       }
   }

   generateExaminationReport() {
       const creature = this.creature;
       const mood = creature.mood;
       const attachmentStyle = creature.attachmentStyle;
       
       let report = `${creature.name} appears to be ${mood}. `;
       
       if (creature.trustLevel > 70) {
           report += "They seem to trust you deeply. ";
       } else if (creature.trustLevel < 30) {
           report += "They seem wary and distrustful. ";
       }
       
       if (creature.aggressionLevel > 50) {
           report += "There are signs of frustration or aggression. ";
       }
       
       if (creature.socialAnxiety > 60) {
           report += "They appear anxious around social interaction. ";
       }
       
       report += `Their attachment style seems to be ${attachmentStyle}.`;
       
       return report;
   }
}

// Helper classes for advanced features
class VoiceAnalysis {
   analyze(voiceResult) {
       // Analyze voice characteristics (simplified)
       return {
           confidence: voiceResult.confidence,
           emotionalTone: this.detectTone(voiceResult.transcript),
           urgency: this.detectUrgency(voiceResult.transcript),
           responseTime: Date.now(), // would be actual response time
           rushed: false, // would detect speech speed
           calm: true // would detect speech patterns
       };
   }
   
   detectTone(transcript) {
       if (/[!]+/.test(transcript)) return 'excited';
       if (/[?]/.test(transcript)) return 'questioning';
       if (/please|thank/i.test(transcript)) return 'polite';
       return 'neutral';
   }
   
   detectUrgency(transcript) {
       const urgentWords = /urgent|now|quick|hurry|emergency/i;
       const caps = /[A-Z]{3,}/.test(transcript);
       const exclamation = /[!]{2,}/.test(transcript);
       
       return urgentWords.test(transcript) || caps || exclamation;
   }
}

class PresenceDetection {
   constructor() {
       this.lastActivity = Date.now();
       this.isPresent = true;
   }
   
   updatePresence(isActive) {
       this.isPresent = isActive;
       if (isActive) {
           this.lastActivity = Date.now();
       }
   }
   
   getPresenceInfo() {
       return {
           isPresent: this.isPresent,
           lastSeen: this.lastActivity,
           awayDuration: this.isPresent ? 0 : Date.now() - this.lastActivity
       };
   }
}


//InteractionHandler 
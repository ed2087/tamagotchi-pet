// Enhanced Main Game Controller - Cognitive Architecture Integration
class TamagotchiGame {
    constructor() {
        // Core systems
        this.creature = null;
        this.needsSystem = null;
        this.audioSystem = null;
        this.storageManager = null;
        this.interactionHandler = null;
        
        // Cognitive architecture
        this.entityManager = null;
        this.conceptualMemory = null;
        this.cognitiveProcessor = null;
        this.languageLearning = null;
        
        // Game state
        this.gameLoop = null;
        this.isGameRunning = false;
        this.lastUpdateTime = Date.now();
        this.sessionStartTime = Date.now();
        
        // UI state
        this.debugMode = false;
        this.updateInterval = 1000; // 1 second updates
        
        this.init();
    }

    async init() {
        console.log('Initializing Advanced Tamagotchi Game...');
        
        try {
            // Initialize storage first
            await this.initializeStorage();
            
            // Initialize cognitive architecture
            this.initializeCognitiveArchitecture();
            
            // Initialize creature with cognitive integration
            this.initializeCreature();
            
            // Initialize supporting systems
            await this.initializeSupportingSystems();
            
            // Load saved game if available
            await this.loadGame();
            
            // Connect all systems
            this.connectCognitiveSystems();
            
            // Setup UI
            this.setupEnhancedUI();
            
            // Start game loops
            this.startGameSystems();
            
            console.log('Advanced Tamagotchi Game initialized successfully!');
            this.displayWelcomeMessage();
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.displayErrorMessage('Game initialization failed: ' + error.message);
        }
    }

    async initializeStorage() {
        this.storageManager = new StorageManager();
        await this.storageManager.init();
        console.log('Storage manager initialized');
    }

    initializeCognitiveArchitecture() {
        // Create cognitive systems in dependency order
        this.entityManager = new EntityManager();
        this.conceptualMemory = new ConceptualMemory();
        
        // Cognitive processor needs references to the other systems
        this.cognitiveProcessor = new CognitiveProcessor(
            null, // creature will be set later
            this.entityManager,
            this.conceptualMemory
        );
        
        console.log('Cognitive architecture initialized');
    }

    initializeCreature() {
        this.creature = new Creature();
        
        // Connect creature to cognitive systems
        this.creature.setCognitiveComponents(
            this.entityManager,
            this.conceptualMemory,
            this.cognitiveProcessor
        );
        
        // Update cognitive processor with creature reference
        this.cognitiveProcessor.creature = this.creature;
        
        console.log('Enhanced creature initialized');
    }

    async initializeSupportingSystems() {
        // Audio system
        this.audioSystem = new AudioSystem();
        
        // Language learning system
        this.languageLearning = new AdvancedLanguageLearning(this.creature);
        this.languageLearning.setCognitiveComponents(
            this.entityManager,
            this.conceptualMemory,
            this.cognitiveProcessor
        );
        
        // Needs system
        this.needsSystem = new NeedsSystem(this.creature);
        
        // Interaction handler
        this.interactionHandler = new InteractionHandler(this.creature, this.languageLearning);
        this.interactionHandler.setCognitiveComponents(
            this.entityManager,
            this.conceptualMemory,
            this.cognitiveProcessor
        );
        
        console.log('Supporting systems initialized');
    }

    connectCognitiveSystems() {
        // Create bidirectional connections between cognitive systems
        
        // Entity manager callbacks
        this.entityManager.onPersonRegistered = (personData) => {
            this.conceptualMemory.recordEpisode('person_introduced', {
                personName: personData.profile.name,
                creatureName: personData.petName,
                isNewPerson: personData.isNewPerson,
                context: 'social_introduction'
            });
        };
        
        // Cognitive processor callbacks
        this.cognitiveProcessor.onHypothesisConfirmed = (hypothesis) => {
            this.languageLearning.integrateConfirmedLanguageRule(hypothesis);
            console.log(`Hypothesis confirmed and integrated: ${hypothesis.hypothesis}`);
        };
        
        // Conceptual memory callbacks
        this.conceptualMemory.onConceptFormed = (concept) => {
            this.languageLearning.learnConceptualVocabulary(concept);
            console.log(`New concept formed: ${concept.name}`);
        };
        
        // Language learning callbacks
        this.languageLearning.onStageEvolution = (oldStage, newStage) => {
            this.displayEvolutionMessage(oldStage, newStage);
            this.audioSystem.playEvolutionSound();
        };
        
        console.log('Cognitive systems connected');
    }

    setupEnhancedUI() {
        this.setupBasicActionButtons();
        this.setupSocialActionButtons();
        this.setupCommunicationInterface();
        this.setupDebugInterface();
        this.setupStatusDisplays();
        
        // Auto-save setup
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });
        
        setInterval(() => {
            this.saveGame();
        }, 30000); // Auto-save every 30 seconds
        
        console.log('Enhanced UI setup complete');
    }

    setupBasicActionButtons() {
        const actionHandlers = {
            'feedBtn': () => this.handleFeedAction(),
            'playBtn': () => this.handlePlayAction(),
            'sleepBtn': () => this.handleSleepAction(),
            'medicineBtn': () => this.handleMedicineAction(),
            'resetBtn': () => this.handleResetAction()
        };

        for (let [buttonId, handler] of Object.entries(actionHandlers)) {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', handler);
            }
        }
    }

    setupSocialActionButtons() {
        // These are handled by the interaction handler, but we can add game-level logic
        const socialButtons = ['gentlePetBtn', 'praiseBtn', 'scoldBtn', 'ignoreBtn', 'introduceBtn'];
        
        socialButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => {
                    this.recordGameEvent('social_action', { action: buttonId });
                });
            }
        });
    }

    setupCommunicationInterface() {
        // Text input handling
        document.getElementById('sendButton').addEventListener('click', () => {
            this.handleTextInput();
        });

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleTextInput();
            }
        });

        // Voice input handling
        const voiceBtn = document.getElementById('voiceButton');
        if (voiceBtn) {
            voiceBtn.addEventListener('mousedown', () => {
                this.interactionHandler.startVoiceRecording();
            });
            
            voiceBtn.addEventListener('mouseup', () => {
                this.interactionHandler.stopVoiceRecording();
            });
            
            voiceBtn.addEventListener('mouseleave', () => {
                this.interactionHandler.stopVoiceRecording();
            });
        }
    }

    setupDebugInterface() {
        const debugBtn = document.getElementById('debugBtn');
        if (debugBtn) {
            debugBtn.addEventListener('click', () => {
                this.toggleDebugMode();
            });
        }
    }

    setupStatusDisplays() {
        // The status displays will be updated in the main game loop
        console.log('Status displays configured');
    }

    startGameSystems() {
        if (this.isGameRunning) return;
        
        this.isGameRunning = true;
        
        // Main game loop
        this.gameLoop = setInterval(() => {
            this.update();
        }, this.updateInterval);
        
        // UI update loop (faster)
        this.uiUpdateLoop = setInterval(() => {
            this.updateUI();
        }, 500);
        
        // Periodic system maintenance
        this.maintenanceLoop = setInterval(() => {
            this.performSystemMaintenance();
        }, 60000); // Every minute
        
        console.log('Game systems started');
    }

    // MAIN GAME UPDATE LOOP
    update() {
        if (!this.isGameRunning || !this.creature.isAlive) return;
        
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdateTime;
        this.lastUpdateTime = currentTime;
        
        try {
            // Update core systems
            this.needsSystem.update();
            this.creature.updateAge();
            
            // Update cognitive systems
            this.languageLearning.update(currentTime);
            this.cognitiveProcessor.processCognition();
            
            // Update conceptual memory
            this.conceptualMemory.update(currentTime);
            
            // Periodic creature actions
            if (Math.random() < 0.03) { // 3% chance per second
                this.creature.performRandomAction();
            }
            
            // Check for significant state changes
            this.checkForStateChanges();
            
        } catch (error) {
            console.error('Error in game update loop:', error);
        }
    }

    updateUI() {
        try {
            // Update basic status bars
            this.updateBasicStatusBars();
            
            // Update emotional status bars
            this.updateEmotionalStatusBars();
            
            // Update information displays
            this.updateInformationDisplays();
            
            // Update debug panel if active
            if (this.debugMode) {
                this.updateDebugPanel();
            }
            
            // Update context display
            this.updateContextDisplay();
            
        } catch (error) {
            console.error('Error in UI update:', error);
        }
    }

    updateBasicStatusBars() {
        this.updateStatusBar('hunger', this.creature.hunger);
        this.updateStatusBar('health', this.creature.health);
        this.updateStatusBar('energy', this.creature.energy);
    }

    updateEmotionalStatusBars() {
        this.updateStatusBar('trust', this.creature.trustLevel);
        this.updateStatusBar('attachment', this.creature.attachmentLevel);
        this.updateStatusBar('aggression', this.creature.aggressionLevel);
        this.updateStatusBar('anxiety', this.creature.socialAnxiety);
    }

    updateStatusBar(type, value) {
        const bar = document.getElementById(`${type}Bar`);
        const valueSpan = document.getElementById(`${type}Value`);
        
        if (bar && valueSpan) {
            const clampedValue = Math.max(0, Math.min(100, value));
            bar.style.width = `${clampedValue}%`;
            valueSpan.textContent = Math.round(clampedValue);
            
            // Update visual states
            bar.classList.remove('low', 'critical', 'high');
            if (clampedValue < 15) {
                bar.classList.add('critical');
            } else if (clampedValue < 30) {
                bar.classList.add('low');
            } else if (clampedValue > 80 && ['trust', 'attachment'].includes(type)) {
                bar.classList.add('high');
            }
        }
    }

    updateInformationDisplays() {
        // Basic info
        const ageDisplay = document.getElementById('creatureAge');
        if (ageDisplay) {
            ageDisplay.textContent = this.creature.getAgeInDays();
        }
        
        const stageDisplay = document.getElementById('evolutionStage');
        if (stageDisplay) {
            stageDisplay.textContent = this.languageLearning.getStageName();
        }
        
        const nameDisplay = document.getElementById('creatureName');
        if (nameDisplay) {
            nameDisplay.textContent = this.creature.name || 'Unnamed';
        }
        
        // Cognitive info
        const knownPeopleCount = document.getElementById('knownPeopleCount');
        if (knownPeopleCount) {
            knownPeopleCount.textContent = this.entityManager.getAllKnownPeople().length;
        }
        
        const vocabularySize = document.getElementById('vocabularySize');
        if (vocabularySize) {
            vocabularySize.textContent = this.languageLearning.vocabulary.size;
        }
        
        const conceptsLearned = document.getElementById('conceptsLearned');
        if (conceptsLearned) {
            conceptsLearned.textContent = this.conceptualMemory.concepts.size;
        }
        
        // User pet name
        const userPetName = document.getElementById('userPetName');
        if (userPetName && this.entityManager.currentPerson) {
            const petName = this.entityManager.getCurrentPersonName(this.entityManager.currentPerson);
            userPetName.textContent = petName || 'Unknown';
        }
        
        // Relationship display
        const relationshipDisplay = document.getElementById('relationshipDisplay');
        if (relationshipDisplay && this.entityManager.currentPerson) {
            const relationship = this.entityManager.getRelationshipSummary(this.entityManager.currentPerson);
            if (relationship) {
                relationshipDisplay.innerHTML = `
                    <div>I call you: <strong>${relationship.creatureName}</strong></div>
                    <div>Relationship: <strong>${relationship.relationship}</strong></div>
                    <div>Trust: ${relationship.trust}%</div>
                `;
            }
        }
    }

    updateContextDisplay() {
        const currentMood = document.getElementById('currentMood');
        if (currentMood) {
            currentMood.textContent = `Mood: ${this.creature.mood}`;
        }
        
        const socialContext = document.getElementById('socialContext');
        if (socialContext) {
            const context = this.cognitiveProcessor.contextualState.social;
            socialContext.textContent = `Context: ${context ? context.currentInteractionTarget || 'Solo' : 'Unknown'}`;
        }
        
        const learningFocus = document.getElementById('learningFocus');
        if (learningFocus) {
            const focus = this.cognitiveProcessor.attentionFocus;
            learningFocus.textContent = `Focus: ${focus || 'General awareness'}`;
        }
    }

    updateDebugPanel() {
        if (!this.debugMode) return;
        
        // Update debug information
        const debugInfo = this.gatherDebugInformation();
        
        const currentThoughts = document.getElementById('currentThoughts');
        if (currentThoughts) {
            currentThoughts.textContent = JSON.stringify(debugInfo.thoughts, null, 2);
        }
        
        const entityStatus = document.getElementById('entityStatus');
        if (entityStatus) {
            entityStatus.textContent = JSON.stringify(debugInfo.entities, null, 2);
        }
        
        const recentLearning = document.getElementById('recentLearning');
        if (recentLearning) {
            recentLearning.textContent = JSON.stringify(debugInfo.learning, null, 2);
        }
        
        const activeHypotheses = document.getElementById('activeHypotheses');
        if (activeHypotheses) {
            activeHypotheses.textContent = JSON.stringify(debugInfo.hypotheses, null, 2);
        }
    }

    gatherDebugInformation() {
        return {
            thoughts: this.cognitiveProcessor.getCurrentThoughts(),
            entities: this.entityManager.getAllKnownPeople().slice(0, 3), // Show first 3
            learning: this.languageLearning.getLanguageStats(),
            hypotheses: this.cognitiveProcessor.getDebugInfo().currentHypotheses.slice(0, 3),
            memory: this.conceptualMemory.getMemoryStats()
        };
    }

    // ACTION HANDLERS
    handleFeedAction() {
        const success = this.needsSystem.feed();
        this.languageLearning.recordUserReaction('feed', Date.now(), success);
        
        if (success) {
            this.creature.addHappiness(5);
            this.recordGameEvent('action', { type: 'feed', success: true });
        }
    }

    handlePlayAction() {
        const success = this.needsSystem.play();
        this.languageLearning.recordUserReaction('play', Date.now(), success);
        
        if (success) {
            this.recordGameEvent('action', { type: 'play', success: true });
        }
    }

    handleSleepAction() {
        const success = this.needsSystem.toggleSleep();
        this.languageLearning.recordUserReaction('sleep', Date.now(), success);
        
        if (success) {
            this.recordGameEvent('action', { type: 'sleep', success: true });
        }
    }

    handleMedicineAction() {
        const success = this.needsSystem.giveMedicine();
        this.languageLearning.recordUserReaction('medicine', Date.now(), success);
        
        if (success) {
            this.recordGameEvent('action', { type: 'medicine', success: true });
        }
    }

    handleResetAction() {
        const confirmed = confirm('Are you sure you want to reset your creature? This will erase all progress and relationships.');
        if (confirmed) {
            this.resetGame();
        }
    }

    handleTextInput() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message && this.creature.isAlive) {
            this.addChatMessage('You', message, 'user');
            
            // Process through language learning system
            this.languageLearning.processUserInput(message, 'text', {
                speaker: 'primary_user',
                timestamp: Date.now()
            });
            
            // Record user attention
            this.interactionHandler.recordUserActivity('text_input');
            
            input.value = '';
            
            this.recordGameEvent('communication', { type: 'text', message: message });
        }
    }

    // COMMUNICATION INTERFACE
    addChatMessage(sender, message, type = 'user') {
        const chatHistory = document.getElementById('chatHistory');
        if (!chatHistory) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        
        const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="sender">${sender}</span>
                <span class="timestamp">${timestamp}</span>
            </div>
            <div class="message-content">${this.sanitizeMessage(message)}</div>
        `;
        
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        
        // Limit chat history length
        if (chatHistory.children.length > 100) {
            chatHistory.removeChild(chatHistory.firstChild);
        }
    }

    sanitizeMessage(message) {
        // Basic HTML sanitization
        return message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // SYSTEM MANAGEMENT
    performSystemMaintenance() {
        try {
            // Clean up old memories
            this.conceptualMemory.performMemoryDecay();
            
            // Update long-term behavioral patterns
            this.analyzeSessionPatterns();
            
            // Check system health
            this.checkSystemHealth();
            
            // Garbage collection hints
            if (window.gc && Math.random() < 0.1) {
                window.gc();
            }
            
        } catch (error) {
            console.error('Error in system maintenance:', error);
        }
    }

    analyzeSessionPatterns() {
        const sessionDuration = Date.now() - this.sessionStartTime;
        
        // Update user behavior profile based on session
        if (this.interactionHandler.userBehaviorProfile) {
            const profile = this.interactionHandler.userBehaviorProfile;
            profile.communicationPatterns.typicalSessionLength = 
                (profile.communicationPatterns.typicalSessionLength * 0.8) + 
                (sessionDuration * 0.2);
        }
    }

    checkSystemHealth() {
        const warnings = [];
        
        // Check memory usage
        if (this.conceptualMemory.episodicMemory.length > 200) {
            warnings.push('High memory usage detected');
        }
        
        // Check cognitive load
        if (this.cognitiveProcessor.calculateCognitiveLoad() > 0.9) {
            warnings.push('High cognitive load');
        }
        
        // Check interaction responsiveness
        const timeSinceLastInteraction = Date.now() - this.creature.lastInteraction;
        if (timeSinceLastInteraction > 600000) { // 10 minutes
            warnings.push('No recent user interaction');
        }
        
        if (warnings.length > 0) {
            console.warn('System health warnings:', warnings);
        }
    }

    checkForStateChanges() {
        // Monitor for significant changes that need special handling
        
        // Evolution check
        const oldStage = this.languageLearning.learningStage;
        if (this.languageLearning.learningStage !== oldStage) {
            this.handleEvolution(oldStage, this.languageLearning.learningStage);
        }
        
        // Death check
        if (!this.creature.isAlive && this.isGameRunning) {
            this.handleCreatureDeath();
        }
        
        // Attachment style changes
        const currentAttachment = this.creature.attachmentStyle;
        if (currentAttachment !== this.lastKnownAttachment) {
            this.handleAttachmentChange(this.lastKnownAttachment, currentAttachment);
            this.lastKnownAttachment = currentAttachment;
        }
    }

    handleEvolution(oldStage, newStage) {
        this.displayEvolutionMessage(oldStage, newStage);
        
        // Record significant event
        this.conceptualMemory.recordEpisode('creature_evolution', {
            fromStage: oldStage,
            toStage: newStage,
            age: this.creature.age,
            triggers: 'language_development'
        });
    }

    handleCreatureDeath() {
        this.addChatMessage('System', 
            `${this.creature.name} has passed away. Their memory will live on in the relationships they built.`,
            'system'
        );
        
        // Stop some game systems but keep others for memorial/revival
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        
        // Show revival option
        setTimeout(() => {
            this.showRevivalOptions();
        }, 5000);
    }

    handleAttachmentChange(oldStyle, newStyle) {
        this.addChatMessage('System',
            `${this.creature.name}'s attachment style has evolved from ${oldStyle} to ${newStyle}`,
            'system'
        );
    }

    // GAME STATE MANAGEMENT
    async saveGame() {
        try {
            const gameData = {
                creature: this.creature.serialize(),
                entityManager: this.entityManager.serialize(),
                conceptualMemory: this.conceptualMemory.serialize(),
                cognitiveProcessor: this.cognitiveProcessor.serialize(),
                languageLearning: this.languageLearning.serialize(),
                gameState: {
                    sessionStartTime: this.sessionStartTime,
                    totalPlayTime: Date.now() - this.sessionStartTime,
                    version: '2.0'
                },
                timestamp: Date.now()
            };
            
            const success = await this.storageManager.saveGame(gameData);
            if (success) {
                console.log('Game saved successfully');
            }
        } catch (error) {
            console.error('Failed to save game:', error);
        }
    }

    async loadGame() {
        try {
            const savedData = await this.storageManager.loadGame();
            
            if (savedData && savedData.creature) {
                console.log('Loading saved game...');
                
                // Deserialize all systems
                this.creature.deserialize(savedData.creature);
                
                if (savedData.entityManager) {
                    this.entityManager.deserialize(savedData.entityManager);
                }
                
                if (savedData.conceptualMemory) {
                    this.conceptualMemory.deserialize(savedData.conceptualMemory);
                }
                
                if (savedData.cognitiveProcessor) {
                    this.cognitiveProcessor.deserialize(savedData.cognitiveProcessor);
                }
                
                if (savedData.languageLearning) {
                    this.languageLearning.deserialize(savedData.languageLearning);
                }
                
                // Restore game state
                if (savedData.gameState) {
                    this.sessionStartTime = savedData.gameState.sessionStartTime || Date.now();
                }
                
                console.log('Game loaded successfully');
                this.addChatMessage('System', `Welcome back! ${this.creature.name} remembers you!`, 'system');
                
            } else {
                console.log('No saved game found, starting fresh');
                this.startNewGame();
            }
        } catch (error) {
            console.error('Failed to load game:', error);
            this.startNewGame();
        }
    }

    startNewGame() {
        this.creature.initializeNew();
        this.sessionStartTime = Date.now();
        
        this.addChatMessage('System', `Meet your new digital companion: ${this.creature.name}!`, 'system');
        this.addChatMessage('System', 'Try talking to them - they\'re learning to communicate!', 'system');
        
        console.log('New game started');
    }

    resetGame() {
        // Stop all systems
        this.stopGameSystems();
        
        // Clear all storage
        this.storageManager.clearAllData();
        
        // Reset all cognitive systems
        this.entityManager = new EntityManager();
        this.conceptualMemory = new ConceptualMemory();
        this.cognitiveProcessor = new CognitiveProcessor(null, this.entityManager, this.conceptualMemory);
        
        // Reset creature
        this.creature.initializeNew();
        this.creature.setCognitiveComponents(this.entityManager, this.conceptualMemory, this.cognitiveProcessor);
        this.cognitiveProcessor.creature = this.creature;
        
        // Reset language learning
        this.languageLearning = new AdvancedLanguageLearning(this.creature);
        this.languageLearning.setCognitiveComponents(this.entityManager, this.conceptualMemory, this.cognitiveProcessor);
        
        // Reset interaction handler
        this.interactionHandler.creature = this.creature;
        this.interactionHandler.languageLearning = this.languageLearning;
        
        // Reconnect systems
        this.connectCognitiveSystems();
        
        // Clear chat
        const chatHistory = document.getElementById('chatHistory');
        if (chatHistory) {
            chatHistory.innerHTML = '';
        }
        
        // Restart systems
        this.sessionStartTime = Date.now();
        this.startGameSystems();
        
        this.addChatMessage('System', `${this.creature.name} is born! Everything is new to them.`, 'system');
        console.log('Game reset completed');
    }

    stopGameSystems() {
        this.isGameRunning = false;
        
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        
        if (this.uiUpdateLoop) {
            clearInterval(this.uiUpdateLoop);
            this.uiUpdateLoop = null;
        }
        
        if (this.maintenanceLoop) {
            clearInterval(this.maintenanceLoop);
            this.maintenanceLoop = null;
        }
    }

    // UI HELPERS
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        
        const debugPanel = document.getElementById('debugPanel');
        if (debugPanel) {
            debugPanel.style.display = this.debugMode ? 'block' : 'none';
        }
        
        if (this.debugMode) {
            this.updateDebugPanel();
        }
        
        console.log(`Debug mode ${this.debugMode ? 'enabled' : 'disabled'}`);
    }

    displayWelcomeMessage() {
        if (this.creature.name) {
            this.addChatMessage('System', 
                `Your digital companion ${this.creature.name} is learning and growing! Try interacting with them.`,
                'system'
            );
        }
    }

    displayEvolutionMessage(oldStage, newStage) {
        const stageNames = {
            1: 'Babbling',
            2: 'First Words',
            3: 'Simple Grammar',
            4: 'Complex Language',
            5: 'Advanced Communication'
        };
        
        this.addChatMessage('System',
            `🎉 ${this.creature.name} has evolved from ${stageNames[oldStage]} to ${stageNames[newStage]}!`,
            'system'
        );
    }

    analyzeSessionPatterns() {
        if (!this.interactionHandler || !this.interactionHandler.userBehaviorProfile) return;
        
        // Initialize communicationPatterns if missing
        if (!this.interactionHandler.userBehaviorProfile.communicationPatterns) {
            this.interactionHandler.userBehaviorProfile.communicationPatterns = {
                averageResponseTime: 5000,
                typicalSessionLength: 300000,
                preferredInteractions: [],
                avoidedInteractions: []
            };
        }
        
        const profile = this.interactionHandler.userBehaviorProfile;
        const sessionLength = Date.now() - this.startTime;
        
        // Update typical session length
        profile.communicationPatterns.typicalSessionLength = 
            (profile.communicationPatterns.typicalSessionLength * 0.8) + (sessionLength * 0.2);
        
        // Analyze interaction preferences
        const recentInteractions = this.interactionHandler.getRecentInteractions(300000); // Last 5 minutes
        if (recentInteractions.length > 0) {
            const interactionCounts = {};
            recentInteractions.forEach(interaction => {
                interactionCounts[interaction.type] = (interactionCounts[interaction.type] || 0) + 1;
            });
            
            // Update preferred interactions
            const mostCommon = Object.entries(interactionCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(entry => entry[0]);
            
            profile.communicationPatterns.preferredInteractions = mostCommon;
        }
        
        console.log('Session patterns analyzed', profile.communicationPatterns);
    }

    displayErrorMessage(message) {
        this.addChatMessage('System', '❌ ' + message, 'system');
        console.error(message);
    }

    showRevivalOptions() {
        const reviveConfirm = confirm(`${this.creature.name} has passed away. Would you like to revive them? They will remember everything but be weakened.`);
        
        if (reviveConfirm) {
            this.needsSystem.emergencyRevive();
            this.startGameSystems();
            this.addChatMessage('System', `${this.creature.name} has been revived! They're grateful but still learning from their experience.`, 'system');
        }
    }

    recordGameEvent(eventType, details) {
        // Record significant game events for analytics
        if (this.conceptualMemory) {
            this.conceptualMemory.recordEpisode('game_event', {
                eventType: eventType,
                details: details,
                gameState: {
                    creatureMood: this.creature.mood,
                    sessionTime: Date.now() - this.sessionStartTime
                }
            });
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.tamagotchiGame = new TamagotchiGame();
});

// Expose some methods for console debugging
window.debugGame = {
    getCreatureState: () => window.tamagotchiGame?.creature,
    getCognitiveState: () => window.tamagotchiGame?.cognitiveProcessor?.getDebugInfo(),
    getLanguageStats: () => window.tamagotchiGame?.languageLearning?.getLanguageStats(),
    getEntityData: () => window.tamagotchiGame?.entityManager?.getAllKnownPeople(),
getMemoryStats: () => window.tamagotchiGame?.conceptualMemory?.getMemoryStats(),
   forceEvolution: () => {
       if (window.tamagotchiGame?.languageLearning) {
           window.tamagotchiGame.languageLearning.learningStage = Math.min(5, window.tamagotchiGame.languageLearning.learningStage + 1);
           console.log('Forced evolution to stage', window.tamagotchiGame.languageLearning.learningStage);
       }
   },
   addTestPerson: (name) => {
       if (window.tamagotchiGame?.entityManager) {
           const result = window.tamagotchiGame.entityManager.registerPerson(`my name is ${name}`, 'debug');
           console.log('Added test person:', result);
       }
   },
   triggerThought: (type, intensity = 0.7) => {
       if (window.tamagotchiGame?.languageLearning) {
           window.tamagotchiGame.languageLearning.expressThought(type, intensity);
       }
   }
};

// Global error handling
window.addEventListener('error', (event) => {
   console.error('Global error:', event.error);
   if (window.tamagotchiGame) {
       window.tamagotchiGame.displayErrorMessage('An error occurred: ' + event.error.message);
   }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
   if (window.tamagotchiGame?.interactionHandler) {
       window.tamagotchiGame.interactionHandler.handleVisibilityChange();
   }
});

// Performance monitoring
if (typeof PerformanceObserver !== 'undefined') {
   const observer = new PerformanceObserver((list) => {
       for (const entry of list.getEntries()) {
           if (entry.duration > 16) { // Frame took longer than 16ms (60fps)
               console.warn(`Performance: ${entry.name} took ${entry.duration}ms`);
           }
       }
   });
   
   try {
       observer.observe({ entryTypes: ['measure'] });
   } catch (e) {
       console.log('Performance monitoring not available');
   }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
   if (window.tamagotchiGame) {
       window.tamagotchiGame.stopGameSystems();
       window.tamagotchiGame.saveGame();
   }
});
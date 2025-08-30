// InteractionHandler - manages all user interactions with the creature
class InteractionHandler {
    constructor(creature, languageLearning) {
        this.creature = creature;
        this.languageLearning = languageLearning;
        
        // Interaction tracking
        this.lastClickTime = 0;
        this.clickCount = 0;
        this.hoverStartTime = 0;
        this.isHovering = false;
        
        // Voice recording
        this.recognition = null;
        this.isRecording = false;
        this.recordingTimeout = null;
        
        // Touch/mouse interaction types
        this.interactionTypes = {
            gentle: { minTime: 1000, maxClicks: 3, effect: 'positive' },
            normal: { minTime: 200, maxClicks: 5, effect: 'neutral' },
            rough: { minTime: 0, maxClicks: 10, effect: 'negative' }
        };
        
        this.init();
    }

    init() {
        this.initializeVoiceRecognition();
        this.setupCreatureInteractions();
        console.log('Interaction handler initialized');
    }

initializeVoiceRecognition() {
    console.log('Checking voice recognition support...');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.error('Web Speech API not supported in this browser');
        this.showVoiceError('Voice recognition not supported in this browser');
        return;
    }

    try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true; // Changed to true to get partial results
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 3; // Get more alternatives
        
        console.log('Voice recognition initialized');
        
        this.recognition.onstart = () => {
            console.log('Voice recognition started');
            this.isRecording = true;
            this.updateVoiceButton(true);
            this.showVoiceStatus('🎤 Listening... Speak now!');
        };
        
        this.recognition.onresult = (event) => {
            console.log('Voice recognition result received:', event);
            
            // Get the latest result
            const lastResultIndex = event.results.length - 1;
            const result = event.results[lastResultIndex];
            
            if (result.isFinal) {
                console.log('Final result:', result[0].transcript, 'Confidence:', result[0].confidence);
                
                if (result[0].confidence > 0.1) { // Very low threshold
                    this.processVoiceInput(result[0].transcript);
                    this.showVoiceStatus('✅ Heard: "' + result[0].transcript + '"');
                } else {
                    this.showVoiceStatus('❌ Could not understand clearly (confidence: ' + Math.round(result[0].confidence * 100) + '%)');
                }
            } else {
                // Show interim results for debugging
                console.log('Interim result:', result[0].transcript);
                this.showVoiceStatus('🔄 Processing: "' + result[0].transcript + '"...');
            }
        };
        
        this.recognition.onspeechstart = () => {
            console.log('Speech detected');
            this.showVoiceStatus('🗣️ Speech detected!');
        };
        
        this.recognition.onspeechend = () => {
            console.log('Speech ended');
            this.showVoiceStatus('🔇 Speech ended, processing...');
        };
        
        this.recognition.onaudiostart = () => {
            console.log('Audio capture started');
        };
        
        this.recognition.onaudioend = () => {
            console.log('Audio capture ended');
        };
        
        this.recognition.onsoundstart = () => {
            console.log('Sound detected');
        };
        
        this.recognition.onsoundend = () => {
            console.log('Sound ended');
        };
        
        this.recognition.onnomatch = () => {
            console.log('No match found');
            this.showVoiceStatus('❓ No speech recognized');
        };
        
        this.recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            this.showVoiceError('Error: ' + event.error);
            this.stopVoiceRecording();
        };
        
        this.recognition.onend = () => {
            console.log('Voice recognition ended');
            this.stopVoiceRecording();
        };
        
    } catch (error) {
        console.error('Failed to initialize voice recognition:', error);
        this.showVoiceError('Voice recognition initialization failed');
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
        window.tamagotchiGame.addChatMessage('System', '🚫 ' + message, 'system');
    }
    
    // Disable voice button if there's a permanent error this.recognition.onresult
    const voiceButton = document.getElementById('voiceButton');
    if (voiceButton) {
        voiceButton.disabled = true;
        voiceButton.title = message;
    }
}

startVoiceRecording() {
    console.log('Attempting to start voice recording...');
    
    if (!this.recognition) {
        console.error('Voice recognition not initialized');
        this.showVoiceError('Voice recognition not available');
        return;
    }
    
    if (this.isRecording) {
        console.log('Already recording, ignoring start request');
        return;
    }

    try {
        console.log('Starting recognition...');
        this.recognition.start();
        
        // Set timeout for maximum recording time (10 seconds)
        this.recordingTimeout = setTimeout(() => {
            console.log('Voice recording timeout reached');
            this.stopVoiceRecording();
        }, 10000);
        
    } catch (error) {
        console.error('Failed to start voice recording:', error);
        this.showVoiceError('Could not start voice recording: ' + error.message);
    }
}

stopVoiceRecording() {
    console.log('Stopping voice recording...');
    
    if (!this.isRecording) {
        console.log('Not recording, nothing to stop');
        return;
    }
    
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

    setupCreatureInteractions() {
        const creatureStage = document.getElementById('creatureStage');
        
        // Reset click tracking every few seconds
        setInterval(() => {
            if (Date.now() - this.lastClickTime > 3000) {
                this.clickCount = 0;
            }
        }, 1000);
    }

    // Mouse/Touch interactions
    handleCreatureClick(event) {
        if (!this.creature.isAlive) return;
        
        const currentTime = Date.now();
        const timeSinceLastClick = currentTime - this.lastClickTime;
        
        // Track click patterns
        if (timeSinceLastClick < 1000) {
            this.clickCount++;
        } else {
            this.clickCount = 1;
        }
        
        this.lastClickTime = currentTime;
        
        // Determine interaction type
        const interactionType = this.classifyClickInteraction(timeSinceLastClick, this.clickCount);
        
        // Process interaction
        this.processClickInteraction(interactionType, event);
        
        // Play interaction sound
        if (window.tamagotchiGame && window.tamagotchiGame.audioSystem) {
            window.tamagotchiGame.audioSystem.playInteractionSound('click');
        }
        
        // Resume audio context if needed (browser requirement)
        if (window.tamagotchiGame && window.tamagotchiGame.audioSystem) {
            window.tamagotchiGame.audioSystem.resumeAudioContext();
        }
    }

    classifyClickInteraction(timeSinceLastClick, clickCount) {
        if (clickCount >= 8) {
            return 'rough'; // Too many rapid clicks = rough
        } else if (clickCount >= 4 && timeSinceLastClick < 500) {
            return 'rough'; // Fast repeated clicking = rough
        } else if (clickCount <= 2) {
            return 'gentle'; // Few clicks = gentle
        } else {
            return 'normal'; // Moderate clicking = normal
        }
    }

    processClickInteraction(type, event) {
        const intensity = Math.min(3, this.clickCount);
        
        switch (type) {
            case 'gentle':
                this.creature.recordInteraction('gentle', intensity);
                this.creature.addHappiness(5 * intensity);
                this.showClickEffect(event, '💖', '#e84393');
                
                // Positive responses for gentle interactions
                if (Math.random() < 0.3) {
                    this.triggerCreatureResponse('gentle');
                }
                break;
                
            case 'rough':
                this.creature.recordInteraction('rough', intensity);
                this.creature.addHappiness(-2 * intensity);
                this.showClickEffect(event, '💢', '#d63031');
                
                // Negative responses for rough interactions
                if (Math.random() < 0.4) {
                    this.triggerCreatureResponse('rough');
                }
                break;
                
            default: // normal
                this.creature.recordInteraction('gentle', 1);
                this.creature.addHappiness(2);
                this.showClickEffect(event, '✨', '#fdcb6e');
                
                if (Math.random() < 0.2) {
                    this.triggerCreatureResponse('normal');
                }
        }
    }

    handleCreatureHover(event) {
        if (!this.creature.isAlive) return;
        
        const currentTime = Date.now();
        
        if (!this.isHovering) {
            this.isHovering = true;
            this.hoverStartTime = currentTime;
        }
        
        const hoverDuration = currentTime - this.hoverStartTime;
        
        // Long hover = petting effect
        if (hoverDuration > 2000 && Math.random() < 0.1) {
            this.creature.addHappiness(1);
            this.creature.showInteractionEffect('sparkle');
        }
    }

    showClickEffect(event, emoji, color) {
        const effect = document.createElement('div');
        effect.innerHTML = emoji;
        effect.style.position = 'absolute';
        effect.style.left = event.offsetX + 'px';
        effect.style.top = event.offsetY + 'px';
        effect.style.color = color;
        effect.style.fontSize = '20px';
        effect.style.pointerEvents = 'none';
        effect.style.animation = 'floatUp 1s ease-out forwards';
        effect.style.zIndex = '1000';
        
        document.getElementById('interactionEffects').appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1000);
    }

    triggerCreatureResponse(interactionType) {
        const responses = {
            gentle: [
                'I feel warm!',
                'That tickles!',
                'More please!',
                'Happy happy!',
                'Youre nice!'
            ],
            rough: [
                'Ouch!',
                'Too rough!',
                'No no!',
                'That hurt!',
                'Be gentle!'
],
            normal: [
                'Hi there!',
                'Hello friend!',
                'I see you!',
                'What\'s up?',
                'Nice to meet!'
            ]
        };
        
        const responseList = responses[interactionType] || responses.normal;
        const response = responseList[Math.floor(Math.random() * responseList.length)];
        
        // Process through language learning system
        setTimeout(() => {
            if (this.languageLearning) {
                this.languageLearning.displayCreatureResponse({
                    text: response,
                    translated: this.creature.evolutionStage <= 2,
                    emotion: this.creature.mood,
                    stage: this.creature.evolutionStage
                });
            }
        }, 300 + Math.random() * 800);
    }

    // Voice interaction methods
    startVoiceRecording() {
        if (!this.recognition || this.isRecording) return;
        
        try {
            this.recognition.start();
            
            // Set timeout for maximum recording time (10 seconds)
            this.recordingTimeout = setTimeout(() => {
                this.stopVoiceRecording();
            }, 10000);
            
        } catch (error) {
            console.warn('Failed to start voice recording:', error);
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
    }

    updateVoiceButton(isRecording) {
        const voiceButton = document.getElementById('voiceButton');
        if (voiceButton) {
            if (isRecording) {
                voiceButton.innerHTML = '🔴';
                voiceButton.style.backgroundColor = '#e17055';
                voiceButton.classList.add('recording');
            } else {
                voiceButton.innerHTML = '🎤';
                voiceButton.style.backgroundColor = '';
                voiceButton.classList.remove('recording');
            }
        }
    }

    processVoiceInput(transcript) {
        if (!transcript || !this.creature.isAlive) return;
        
        console.log('Processing voice input:', transcript);
        
        // Add to chat history
        if (window.tamagotchiGame) {
            window.tamagotchiGame.addChatMessage('You', transcript + ' 🎤', 'user');
        }
        
        // Process through language learning
        if (this.languageLearning) {
            this.languageLearning.processUserInput(transcript, 'voice');
        }
        
        // Voice input gives extra happiness boost
        this.creature.addHappiness(3);
        this.creature.recordInteraction('gentle', 2);
        
        // Show voice input effect
        this.showVoiceInputEffect();
    }

    showVoiceInputEffect() {
        const effect = document.createElement('div');
        effect.innerHTML = '🎵';
        effect.style.position = 'absolute';
        effect.style.left = '50%';
        effect.style.top = '20%';
        effect.style.transform = 'translate(-50%, -50%)';
        effect.style.fontSize = '24px';
        effect.style.pointerEvents = 'none';
        effect.style.animation = 'floatUp 2s ease-out forwards';
        effect.style.color = '#74b9ff';
        
        document.getElementById('interactionEffects').appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 2000);
    }

    // Keyboard interactions
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            if (!this.creature.isAlive) return;
            
            // Only handle shortcuts when not typing in input fields
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (event.key.toLowerCase()) {
                case 'f':
                    event.preventDefault();
                    document.getElementById('feedBtn').click();
                    break;
                case 'p':
                    event.preventDefault();
                    document.getElementById('playBtn').click();
                    break;
                case 's':
                    event.preventDefault();
                    document.getElementById('sleepBtn').click();
                    break;
                case 'm':
                    event.preventDefault();
                    document.getElementById('medicineBtn').click();
                    break;
                case ' ': // Spacebar to interact with creature
                    event.preventDefault();
                    this.handleCreatureClick({ offsetX: 60, offsetY: 60 }); // Center click
                    break;
            }
        });
    }

    // Handle creature leaving the screen (mouse out)
    handleCreatureMouseLeave() {
        this.isHovering = false;
        this.hoverStartTime = 0;
        
        // Small happiness decrease for leaving
        if (this.creature.isAlive && Math.random() < 0.1) {
            this.creature.addHappiness(-1);
        }
    }

    // Idle detection and attention-seeking behavior
    startIdleDetection() {
        setInterval(() => {
            this.checkIdleState();
        }, 30000); // Check every 30 seconds
    }

    checkIdleState() {
        if (!this.creature.isAlive) return;
        
        const timeSinceLastInteraction = Date.now() - this.creature.lastInteraction;
        const idleMinutes = Math.floor(timeSinceLastInteraction / (1000 * 60));
        
        // Creature gets lonely after 5 minutes
        if (idleMinutes >= 5 && idleMinutes < 15) {
            this.triggerAttentionSeeking('lonely');
        }
        // Creature gets really sad after 15 minutes
        else if (idleMinutes >= 15 && idleMinutes < 30) {
            this.triggerAttentionSeeking('neglected');
        }
        // Creature starts getting sick after 30 minutes of no interaction
        else if (idleMinutes >= 30) {
            this.triggerAttentionSeeking('critical');
        }
    }

    triggerAttentionSeeking(level) {
        const messages = {
            lonely: [
                'Are you there?',
                'I miss you...',
                'Come play with me!',
                'Feeling lonely here...'
            ],
            neglected: [
                'Please don\'t ignore me!',
                'I need attention!',
                'Did I do something wrong?',
                'I\'m getting sad...'
            ],
            critical: [
                'I really need you!',
                'Please come back!',
                'I don\'t feel good...',
                'Help me please!'
            ]
        };
        
        const messageList = messages[level];
        const message = messageList[Math.floor(Math.random() * messageList.length)];
        
        // Show attention-seeking message
        if (this.languageLearning) {
            this.languageLearning.displayCreatureResponse({
                text: message,
                translated: this.creature.evolutionStage <= 2,
                emotion: 'sad',
                stage: this.creature.evolutionStage
            });
        }
        
        // Visual attention-seeking behavior
        this.creature.element.style.animation = 'bounce 0.5s ease-in-out 3';
        setTimeout(() => {
            this.creature.element.style.animation = '';
        }, 1500);
        
        // Play attention sound
        if (window.tamagotchiGame && window.tamagotchiGame.audioSystem) {
            if (level === 'critical') {
                window.tamagotchiGame.audioSystem.playEmergencyAlert();
            } else {
                window.tamagotchiGame.audioSystem.playCreatureSound('sad');
            }
        }
        
        // Browser notification (if permitted)
        this.showBrowserNotification(message, level);
    }

    showBrowserNotification(message, level) {
        if (!('Notification' in window)) return;
        
        if (Notification.permission === 'granted') {
            const urgency = level === 'critical' ? '🚨 ' : level === 'neglected' ? '😢 ' : '💙 ';
            
            const notification = new Notification(`${urgency}${this.creature.name || 'Your Pet'}`, {
                body: message,
                icon: '🐾', // Would need to be a proper icon file
                badge: '🐾',
                tag: 'tamagotchi-attention',
                requireInteraction: level === 'critical'
            });
            
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
            
            // Auto-close after 5 seconds unless critical
            if (level !== 'critical') {
                setTimeout(() => notification.close(), 5000);
            }
        } else if (Notification.permission === 'default') {
            // Request permission
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showBrowserNotification(message, level);
                }
            });
        }
    }

    // Context menu for advanced interactions
    setupContextMenu() {
        const creatureStage = document.getElementById('creatureStage');
        
        creatureStage.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            this.showContextMenu(event);
        });
        
        // Close context menu on click elsewhere
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });
    }

    showContextMenu(event) {
        // Remove existing context menu
        this.hideContextMenu();
        
        const menu = document.createElement('div');
        menu.id = 'creatureContextMenu';
        menu.className = 'context-menu';
        menu.style.position = 'absolute';
        menu.style.left = event.pageX + 'px';
        menu.style.top = event.pageY + 'px';
        menu.style.zIndex = '10000';
        
        const options = [
            { label: '🎾 Play', action: () => document.getElementById('playBtn').click() },
            { label: '🍎 Feed', action: () => document.getElementById('feedBtn').click() },
            { label: '😴 Sleep', action: () => document.getElementById('sleepBtn').click() },
            { label: '💊 Medicine', action: () => document.getElementById('medicineBtn').click() },
            { label: '📊 Status', action: () => this.showStatusDialog() },
            { label: '💾 Save', action: () => window.tamagotchiGame?.saveGame() }
        ];
        
        options.forEach(option => {
            const item = document.createElement('div');
            item.className = 'context-menu-item';
            item.textContent = option.label;
            item.onclick = (e) => {
                e.stopPropagation();
                option.action();
                this.hideContextMenu();
            };
            menu.appendChild(item);
        });
        
        document.body.appendChild(menu);
    }

    hideContextMenu() {
        const existing = document.getElementById('creatureContextMenu');
        if (existing) {
            existing.remove();
        }
    }

    showStatusDialog() {
        if (!window.tamagotchiGame || !window.tamagotchiGame.needsSystem) return;
        
        const status = window.tamagotchiGame.needsSystem.getStatusSummary();
        const vocabSize = this.languageLearning ? this.languageLearning.vocabulary.size : 0;
        
        const message = `
${this.creature.name || 'Your Pet'} Status:
🍎 Hunger: ${status.hunger}%
😊 Happiness: ${status.happiness}%
💗 Health: ${status.health}%
⚡ Energy: ${status.energy}%
🧠 Trust: ${status.trustLevel}%
📚 Vocabulary: ${vocabSize} words
🎭 Mood: ${status.mood}
⭐ Stage: ${this.languageLearning?.getStageNameInE() || 'Unknown'}
        `;
        
        if (window.tamagotchiGame) {
            window.tamagotchiGame.addChatMessage('System', message.trim(), 'system');
        }
    }

    // Initialize all interaction systems
    initializeAllSystems() {
        this.setupKeyboardShortcuts();
        this.setupContextMenu();
        this.startIdleDetection();
        
        console.log('All interaction systems initialized');
    }

    // Clean up resources
    destroy() {
        if (this.recognition) {
            this.recognition.abort();
        }
        
        if (this.recordingTimeout) {
            clearTimeout(this.recordingTimeout);
        }
        
        this.hideContextMenu();
        
        console.log('Interaction handler destroyed');
    }
}
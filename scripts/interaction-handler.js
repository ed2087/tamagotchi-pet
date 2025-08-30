// InteractionHandler - Enhanced with contextual learning feedback
class InteractionHandler {
    constructor(creature, languageLearning) {
        this.creature = creature;
        this.languageLearning = languageLearning;
        
        this.lastClickTime = 0;
        this.clickCount = 0;
        this.userAttentionLevel = 0;
        this.lastUserActivity = Date.now();
        this.reactionTimingHistory = [];
        
        this.recognition = null;
        this.isRecording = false;
        this.recordingTimeout = null;
        
        this.init();
    }

    init() {
        this.initializeVoiceRecognition();
        this.setupCreatureInteractions();
        this.startAttentionTracking();
        console.log('Enhanced interaction handler initialized');
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
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            this.recognition.maxAlternatives = 3;
            
            console.log('Voice recognition initialized');
            
            this.recognition.onstart = () => {
                console.log('Voice recognition started');
                this.isRecording = true;
                this.updateVoiceButton(true);
                this.showVoiceStatus('Listening... Speak now!');
            };
            
            this.recognition.onresult = (event) => {
                const lastResultIndex = event.results.length - 1;
                const result = event.results[lastResultIndex];
                
                if (result.isFinal) {
                    console.log('Final result:', result[0].transcript, 'Confidence:', result[0].confidence);
                    
                    if (result[0].confidence > 0.1) {
                        this.processVoiceInput(result[0].transcript);
                        this.showVoiceStatus('Heard: "' + result[0].transcript + '"');
                    } else {
                        this.showVoiceStatus('Could not understand clearly');
                    }
                }
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
            window.tamagotchiGame.addChatMessage('System', 'Voice error: ' + message, 'system');
        }
        
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

    updateVoiceButton(isRecording) {
        const voiceButton = document.getElementById('voiceButton');
        if (voiceButton) {
            if (isRecording) {
                voiceButton.innerHTML = 'Recording...';
                voiceButton.style.backgroundColor = '#e17055';
                voiceButton.classList.add('recording');
            } else {
                voiceButton.innerHTML = 'Voice';
                voiceButton.style.backgroundColor = '';
                voiceButton.classList.remove('recording');
            }
        }
    }

    processVoiceInput(transcript) {
        if (!transcript || !this.creature.isAlive) return;
        
        console.log('Processing voice input:', transcript);
        
        if (window.tamagotchiGame) {
            window.tamagotchiGame.addChatMessage('You', transcript + ' (voice)', 'user');
        }
        
        if (this.languageLearning) {
            this.languageLearning.processUserInput(transcript, 'voice');
        }
        
        this.recordUserAttention();
        this.creature.addHappiness(5);
        this.creature.recordInteraction('gentle', 2);
    }

    setupCreatureInteractions() {
        const creatureStage = document.getElementById('creatureStage');
        
        creatureStage.addEventListener('click', (e) => {
            this.handleCreatureClick(e);
        });
        
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        document.addEventListener('mousemove', () => {
            this.recordUserActivity();
        });
    }

    handleCreatureClick(event) {
        if (!this.creature.isAlive) return;
        
        const currentTime = Date.now();
        const timeSinceLastClick = currentTime - this.lastClickTime;
        
        if (timeSinceLastClick < 1000) {
            this.clickCount++;
        } else {
            this.clickCount = 1;
        }
        
        this.lastClickTime = currentTime;
        
        const interactionType = this.classifyClickInteraction(timeSinceLastClick, this.clickCount);
        this.processClickInteraction(interactionType, event);
        
        const isPositive = interactionType === 'gentle';
        this.languageLearning.recordUserReaction('pet', currentTime, isPositive);
        
        this.recordUserAttention();
    }

    classifyClickInteraction(timeSinceLastClick, clickCount) {
        if (clickCount >= 8) {
            return 'rough';
        } else if (clickCount >= 4 && timeSinceLastClick < 500) {
            return 'rough';
        } else if (clickCount <= 2) {
            return 'gentle';
        } else {
            return 'normal';
        }
    }

    processClickInteraction(type, event) {
        const intensity = Math.min(3, this.clickCount);
        
        switch (type) {
            case 'gentle':
                this.creature.recordInteraction('gentle', intensity);
                this.creature.addHappiness(5 * intensity);
                this.showClickEffect(event, 'heart', '#e84393');
                break;
                
            case 'rough':
                this.creature.recordInteraction('rough', intensity);
                this.creature.addHappiness(-2 * intensity);
                this.showClickEffect(event, 'angry', '#d63031');
                this.languageLearning.recordUserReaction('rough_touch', Date.now(), false);
                break;
                
            default:
                this.creature.recordInteraction('gentle', 1);
                this.creature.addHappiness(2);
                this.showClickEffect(event, 'sparkle', '#fdcb6e');
        }
    }

    showClickEffect(event, effectType, color) {
        const effect = document.createElement('div');
        
        if (effectType === 'heart') {
            effect.innerHTML = '💖';
        } else if (effectType === 'angry') {
            effect.innerHTML = '💢';
        } else {
            effect.innerHTML = '✨';
        }
        
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

    startAttentionTracking() {
        setInterval(() => {
            this.updateUserAttentionLevel();
        }, 5000);
    }

    updateUserAttentionLevel() {
        const currentTime = Date.now();
        const timeSinceActivity = currentTime - this.lastUserActivity;
        
        if (timeSinceActivity > 30000) {
            this.userAttentionLevel = Math.max(0, this.userAttentionLevel - 0.1);
        }
        
        if (document.hidden) {
            this.userAttentionLevel = 0;
            this.creature.recordUserAbsence();
        }
    }

    recordUserActivity() {
        this.lastUserActivity = Date.now();
        this.userAttentionLevel = Math.min(1.0, this.userAttentionLevel + 0.1);
    }

    recordUserAttention() {
        this.recordUserActivity();
        
        if (this.languageLearning) {
            this.languageLearning.recordUserAttention(Date.now());
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.userAttentionLevel = 0;
            console.log('User left page');
        } else {
            this.recordUserAttention();
            console.log('User returned to page');
            
            if (this.languageLearning && Math.random() < 0.7) {
                setTimeout(() => {
                    this.languageLearning.expressThought('see_user_return', 0.8);
                }, 500);
            }
        }
    }
}
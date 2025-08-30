// Main game controller - Enhanced with contextual feedback
class TamagotchiGame {
    constructor() {
        this.creature = null;
        this.needsSystem = null;
        this.languageLearning = null;
        this.audioSystem = null;
        this.interactionHandler = null;
        this.storageManager = null;
        
        this.gameLoop = null;
        this.isGameRunning = false;
        
        this.init();
    }

    async init() {
        console.log('Initializing Tamagotchi Game...');
        
        this.storageManager = new StorageManager();
        await this.storageManager.init();
        
        this.creature = new Creature();
        this.needsSystem = new NeedsSystem(this.creature);
        this.languageLearning = new LanguageLearning(this.creature);
        this.audioSystem = new AudioSystem();
        this.interactionHandler = new InteractionHandler(this.creature, this.languageLearning);
        
        await this.loadGame();
        this.setupUIEventListeners();
        this.startGameLoop();
        
        console.log('Tamagotchi Game initialized successfully!');
    }

    setupUIEventListeners() {
        // Action buttons with context tracking
        document.getElementById('feedBtn').addEventListener('click', () => {
            const success = this.needsSystem.feed();
            this.languageLearning.recordUserReaction('feed', Date.now(), success);
            
            if (success) {
                this.creature.addHappiness(5);
            }
        });

        document.getElementById('playBtn').addEventListener('click', () => {
            const success = this.needsSystem.play();
            this.languageLearning.recordUserReaction('play', Date.now(), success);
        });

        document.getElementById('sleepBtn').addEventListener('click', () => {
            const success = this.needsSystem.toggleSleep();
            this.languageLearning.recordUserReaction('sleep', Date.now(), success);
        });

        document.getElementById('medicineBtn').addEventListener('click', () => {
            const success = this.needsSystem.giveMedicine();
            this.languageLearning.recordUserReaction('medicine', Date.now(), success);
        });

        document.getElementById('sendButton').addEventListener('click', () => {
            this.handleTextInput();
        });

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleTextInput();
            }
        });

        const voiceBtn = document.getElementById('voiceButton');
        voiceBtn.addEventListener('mousedown', () => {
            this.interactionHandler.startVoiceRecording();
        });
        
        voiceBtn.addEventListener('mouseup', () => {
            this.interactionHandler.stopVoiceRecording();
        });
        
        voiceBtn.addEventListener('mouseleave', () => {
            this.interactionHandler.stopVoiceRecording();
        });

        document.getElementById('creatureStage').addEventListener('click', (e) => {
            this.interactionHandler.handleCreatureClick(e);
        });

        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });

        setInterval(() => {
            this.saveGame();
        }, 30000);
    }

    handleTextInput() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message) {
            this.addChatMessage('You', message, 'user');
            this.languageLearning.processUserInput(message, 'text');
            this.interactionHandler.recordUserAttention();
            input.value = '';
        }
    }

    addChatMessage(sender, message, type = 'user') {
        const chatHistory = document.getElementById('chatHistory');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        
        const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="sender">${sender}</span>
                <span class="timestamp">${timestamp}</span>
            </div>
            <div class="message-content">${message}</div>
        `;
        
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    startGameLoop() {
        if (this.isGameRunning) return;
        
        this.isGameRunning = true;
        this.gameLoop = setInterval(() => {
            this.update();
        }, 1000);
    }

    stopGameLoop() {
        this.isGameRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    update() {
        this.needsSystem.update();
        this.creature.updateAge();
        this.languageLearning.update(Date.now());
        this.updateUI();
        
        if (Math.random() < 0.05) {
            this.creature.performRandomAction();
        }
    }

    updateUI() {
        this.updateStatusBar('hunger', this.creature.hunger);
        this.updateStatusBar('happiness', this.creature.happiness);
        this.updateStatusBar('health', this.creature.health);
        this.updateStatusBar('energy', this.creature.energy);
        
        document.getElementById('creatureAge').textContent = Math.floor(this.creature.age / 24);
        document.getElementById('evolutionStage').textContent = this.languageLearning.getStageName();
        document.getElementById('creatureName').textContent = this.creature.name || 'Unnamed';
        
        this.creature.updateAppearance();
    }

    updateStatusBar(type, value) {
        const bar = document.getElementById(`${type}Bar`);
        const valueSpan = document.getElementById(`${type}Value`);
        
        bar.style.width = `${Math.max(0, Math.min(100, value))}%`;
        valueSpan.textContent = Math.round(value);
        
        bar.classList.remove('low', 'critical');
        if (value < 30) {
            bar.classList.add('low');
        }
        if (value < 15) {
            bar.classList.add('critical');
        }
    }

    async saveGame() {
        const gameData = {
            creature: this.creature.serialize(),
            language: this.languageLearning.serialize(),
            timestamp: Date.now()
        };
        
        await this.storageManager.saveGame(gameData);
        console.log('Game saved!');
    }

    async loadGame() {
        const savedData = await this.storageManager.loadGame();
        
        if (savedData) {
            this.creature.deserialize(savedData.creature);
            this.languageLearning.deserialize(savedData.language);
            console.log('Game loaded!');
        } else {
            this.creature.initializeNew();
            console.log('New game started!');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.tamagotchiGame = new TamagotchiGame();
});
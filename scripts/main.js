// Main game controller
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
        
        // Initialize storage manager first
        this.storageManager = new StorageManager();
        await this.storageManager.init();
        
        // Initialize core systems
        this.creature = new Creature();
        this.needsSystem = new NeedsSystem(this.creature);
        this.languageLearning = new LanguageLearning(this.creature);
        this.audioSystem = new AudioSystem();
        this.interactionHandler = new InteractionHandler(this.creature, this.languageLearning);
        
        // Load saved data or create new creature
        await this.loadGame();
        
        // Set up UI event listeners
        this.setupUIEventListeners();
        
        // Start game loop
        this.startGameLoop();
        
        console.log('Tamagotchi Game initialized successfully!');
    }

    setupUIEventListeners() {
        // Action buttons
        document.getElementById('feedBtn').addEventListener('click', () => {
            this.needsSystem.feed();
            this.creature.addHappiness(5);
        });

        document.getElementById('playBtn').addEventListener('click', () => {
            this.needsSystem.play();
        });

        document.getElementById('sleepBtn').addEventListener('click', () => {
            this.needsSystem.toggleSleep();
        });

        document.getElementById('medicineBtn').addEventListener('click', () => {
            this.needsSystem.giveMedicine();
        });

        // Chat input
        document.getElementById('sendButton').addEventListener('click', () => {
            this.handleTextInput();
        });

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleTextInput();
            }
        });

        // Voice input
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

        // Creature interactions
        document.getElementById('creatureStage').addEventListener('click', (e) => {
            this.interactionHandler.handleCreatureClick(e);
        });

        document.getElementById('creatureStage').addEventListener('mousemove', (e) => {
            this.interactionHandler.handleCreatureHover(e);
        });

        // Window events
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });

        // Auto-save every 30 seconds
        setInterval(() => {
            this.saveGame();
        }, 30000);
    }

    handleTextInput() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message) {
            this.languageLearning.processUserInput(message, 'text');
            this.addChatMessage('You', message, 'user');
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
        }, 1000); // Update every second
    }

    stopGameLoop() {
        this.isGameRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    update() {
        // Update creature needs (hunger decreases over time, etc.)
        this.needsSystem.update();
        
        // Update creature age
        this.creature.updateAge();
        
        // Update UI
        this.updateUI();
        
        // Check for evolution
        this.languageLearning.checkEvolution();
        
        // Random creature actions
        if (Math.random() < 0.05) { // 5% chance each second
            this.creature.performRandomAction();
        }
    }

    updateUI() {
        // Update status bars
        this.updateStatusBar('hunger', this.creature.hunger);
        this.updateStatusBar('happiness', this.creature.happiness);
        this.updateStatusBar('health', this.creature.health);
        this.updateStatusBar('energy', this.creature.energy);
        
        // Update creature info
        document.getElementById('creatureAge').textContent = Math.floor(this.creature.age);
        document.getElementById('evolutionStage').textContent = this.languageLearning.getStageNameInE();
        document.getElementById('creatureName').textContent = this.creature.name || 'Unnamed';
        
        // Update creature appearance based on mood
        this.creature.updateAppearance();
    }

    updateStatusBar(type, value) {
        const bar = document.getElementById(`${type}Bar`);
        const valueSpan = document.getElementById(`${type}Value`);
        
        bar.style.width = `${Math.max(0, Math.min(100, value))}%`;
        valueSpan.textContent = Math.round(value);
        
        // Add warning classes for low values
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
            // Create new creature
            this.creature.initializeNew();
            this.languageLearning.initializeNew();
            console.log('New game started!');
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.tamagotchiGame = new TamagotchiGame();
});
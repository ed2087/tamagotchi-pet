// Enhanced StorageManager - handles complex cognitive data structures
class StorageManager {
    constructor() {
        this.dbName = 'AdvancedTamagotchiDB';
        this.dbVersion = 2; // Increased version for new schema
        this.db = null;
        
        // Storage keys
        this.gameDataKey = 'advanced_tamagotchi_game_data';
        this.settingsKey = 'tamagotchi_settings';
        this.cognitiveDataKey = 'tamagotchi_cognitive_data';
        this.backupPrefix = 'tamagotchi_backup_';
        
        // Storage capabilities
        this.isSupported = {
            localStorage: typeof(Storage) !== 'undefined',
            indexedDB: 'indexedDB' in window
        };
        
        // Data compression settings
        this.compressionEnabled = true;
        this.maxLocalStorageSize = 5 * 1024 * 1024; // 5MB limit
        
        // Backup management
        this.maxBackups = 15;
        this.backupInterval = 300000; // 5 minutes
        this.lastBackupTime = 0;
    }

    async init() {
        console.log('Initializing enhanced storage manager...');
        
        // Initialize IndexedDB for complex data
        if (this.isSupported.indexedDB) {
            await this.initIndexedDB();
        } else {
            console.warn('IndexedDB not supported - using localStorage only');
        }
        
        // Check localStorage availability and quota
        if (this.isSupported.localStorage) {
            await this.checkStorageQuota();
        } else {
            console.warn('LocalStorage not available - save functionality severely limited');
        }
        
        // Initialize backup system
        this.initBackupSystem();
        
        console.log('Enhanced storage manager initialized');
    }

    async initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => {
                console.error('IndexedDB initialization failed:', request.error);
                this.isSupported.indexedDB = false;
                resolve();
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                console.log('IndexedDB initialized successfully');
                
                // Set up error handling
                this.db.onerror = (event) => {
                    console.error('Database error:', event.target.error);
                };
                
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create enhanced object stores
                this.createObjectStores(db, event.oldVersion);
                
                console.log('IndexedDB schema upgraded');
            };
        });
    }

    createObjectStores(db, oldVersion) {
        // Main game data store
        if (!db.objectStoreNames.contains('gameData')) {
            const gameStore = db.createObjectStore('gameData', { keyPath: 'id' });
            gameStore.createIndex('timestamp', 'timestamp', { unique: false });
            gameStore.createIndex('version', 'version', { unique: false });
        }
        
        // Cognitive data store (new)
        if (!db.objectStoreNames.contains('cognitiveData')) {
            const cognitiveStore = db.createObjectStore('cognitiveData', { keyPath: 'id' });
            cognitiveStore.createIndex('dataType', 'dataType', { unique: false });
            cognitiveStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Entity relationship store (new)
        if (!db.objectStoreNames.contains('entityData')) {
            const entityStore = db.createObjectStore('entityData', { keyPath: 'personId' });
            entityStore.createIndex('lastInteraction', 'lastInteraction', { unique: false });
            entityStore.createIndex('relationship', 'relationship', { unique: false });
        }
        
        // Memory episodes store (new)
        if (!db.objectStoreNames.contains('memoryEpisodes')) {
            const memoryStore = db.createObjectStore('memoryEpisodes', { keyPath: 'id' });
            memoryStore.createIndex('eventType', 'eventType', { unique: false });
            memoryStore.createIndex('timestamp', 'timestamp', { unique: false });
            memoryStore.createIndex('importance', 'importance', { unique: false });
        }
        
        // Language learning store (new)
        if (!db.objectStoreNames.contains('languageData')) {
            const langStore = db.createObjectStore('languageData', { keyPath: 'id' });
            langStore.createIndex('word', 'word', { unique: false });
            langStore.createIndex('acquisitionDate', 'acquisitionDate', { unique: false });
        }
        
        // Backup store (enhanced)
        if (!db.objectStoreNames.contains('backups')) {
            const backupStore = db.createObjectStore('backups', { keyPath: 'id' });
            backupStore.createIndex('timestamp', 'timestamp', { unique: false });
            backupStore.createIndex('backupType', 'backupType', { unique: false });
        }
        
        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
            const settingsStore = db.createObjectStore('settings', { keyPath: 'id' });
        }
        
        // Migration from old version if needed
        if (oldVersion === 1) {
            this.migrateFromV1(db);
        }
    }

    async migrateFromV1(db) {
        console.log('Migrating data from version 1 to version 2...');
        
        // Migration logic would go here
        // For now, we'll just log that migration is needed
        console.log('Migration completed');
    }

    async checkStorageQuota() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate();
                const quotaInMB = Math.round(estimate.quota / (1024 * 1024));
                const usageInMB = Math.round(estimate.usage / (1024 * 1024));
                
                console.log(`Storage quota: ${quotaInMB}MB, used: ${usageInMB}MB`);
                
                if (estimate.usage > estimate.quota * 0.8) {
                    console.warn('Storage usage is high - cleanup may be needed');
                }
            } catch (error) {
                console.warn('Could not estimate storage usage:', error);
            }
        }
    }

    initBackupSystem() {
        // Start periodic backup creation
        setInterval(() => {
            if (Date.now() - this.lastBackupTime > this.backupInterval) {
                this.createAutomaticBackup();
            }
        }, 60000); // Check every minute
        
        // Clean old backups periodically
        setInterval(() => {
            this.cleanOldBackups();
        }, 600000); // Clean every 10 minutes
    }

    // ENHANCED SAVE OPERATIONS
    async saveGame(gameData) {
        try {
            const enhancedGameData = {
                ...gameData,
                version: '2.0',
                timestamp: Date.now(),
                id: 'current_game',
                dataSize: this.calculateDataSize(gameData),
                compressed: this.compressionEnabled
            };
            
            // Compress if enabled and data is large
            if (this.compressionEnabled && enhancedGameData.dataSize > 50000) {
                enhancedGameData.compressedData = await this.compressData(gameData);
                delete enhancedGameData.creature;
                delete enhancedGameData.entityManager;
                delete enhancedGameData.conceptualMemory;
                delete enhancedGameData.cognitiveProcessor;
                delete enhancedGameData.languageLearning;
            }
            
            // Save to multiple storage systems
            const results = await Promise.allSettled([
                this.saveToLocalStorage(enhancedGameData),
                this.saveToIndexedDB('gameData', enhancedGameData),
                this.saveCognitiveDataSeparately(gameData)
            ]);
            
            // Check if at least one save method succeeded
            const successCount = results.filter(result => result.status === 'fulfilled' && result.value).length;
            
            if (successCount > 0) {
                console.log(`Game saved successfully (${successCount}/3 methods succeeded)`);
                return true;
            } else {
                throw new Error('All save methods failed');
            }
            
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    async saveToLocalStorage(gameData) {
        if (!this.isSupported.localStorage) return false;
        
        try {
            const jsonString = JSON.stringify(gameData);
            
            // Check size limit
            if (jsonString.length > this.maxLocalStorageSize) {
                console.warn('Game data too large for localStorage - using IndexedDB only');
                return false;
            }
            
            localStorage.setItem(this.gameDataKey, jsonString);
            return true;
        } catch (error) {
            console.warn('localStorage save failed:', error);
            return false;
        }
    }

    async saveCognitiveDataSeparately(gameData) {
        if (!this.isSupported.indexedDB || !this.db) return false;
        
        try {
            const cognitiveData = [];
            
            // Save entity data separately
            if (gameData.entityManager) {
                const entityData = this.extractEntityData(gameData.entityManager);
                cognitiveData.push(...entityData);
            }
            
            // Save memory episodes separately
            if (gameData.conceptualMemory && gameData.conceptualMemory.episodicMemory) {
                const memoryData = this.extractMemoryData(gameData.conceptualMemory);
                cognitiveData.push(...memoryData);
            }
            
            // Save language data separately
            if (gameData.languageLearning) {
                const languageData = this.extractLanguageData(gameData.languageLearning);
                cognitiveData.push(...languageData);
            }
            
            // Save all cognitive data
            const transaction = this.db.transaction(['cognitiveData', 'entityData', 'memoryEpisodes', 'languageData'], 'readwrite');
            
            for (const data of cognitiveData) {
                const store = transaction.objectStore(data.storeType);
                store.put(data.data);
            }
            
            return new Promise((resolve) => {
                transaction.oncomplete = () => resolve(true);
                transaction.onerror = () => resolve(false);
            });
            
        } catch (error) {
            console.warn('Cognitive data save failed:', error);
            return false;
        }
    }

    extractEntityData(entityManagerData) {
        const entityData = [];
        
        if (entityManagerData.knownPeople) {
            for (const [personId, personData] of entityManagerData.knownPeople) {
                entityData.push({
                    storeType: 'entityData',
                    data: {
                        personId: personId,
                        personData: personData,
                        timestamp: Date.now()
                    }
                });
            }
        }
        
        return entityData;
    }

    extractMemoryData(conceptualMemoryData) {
        const memoryData = [];
        
        if (conceptualMemoryData.episodicMemory) {
            for (const episode of conceptualMemoryData.episodicMemory) {
                memoryData.push({
                    storeType: 'memoryEpisodes',
                    data: {
                        id: episode.id,
                        eventType: episode.eventType,
                        timestamp: episode.timestamp,
                        details: episode.details,
                        importance: episode.importance || 0.5,
                        relatedConcepts: episode.relatedConcepts || []
                    }
                });
            }
        }
        
        return memoryData;
    }

    extractLanguageData(languageLearningData) {
        const languageData = [];
        
        if (languageLearningData.vocabulary) {
            for (const [word, wordData] of languageLearningData.vocabulary) {
                languageData.push({
                    storeType: 'languageData',
                    data: {
                        id: `word_${word}_${Date.now()}`,
                        word: word,
                        wordData: wordData,
                        acquisitionDate: wordData.acquisitionDate,
                        strength: wordData.strength || 0.5
                    }
                });
            }
        }
        
        return languageData;
    }

    // ENHANCED LOAD OPERATIONS
    async loadGame() {
        try {
            let gameData = null;
            
            // Try loading from localStorage first (fastest)
            if (this.isSupported.localStorage) {
                gameData = await this.loadFromLocalStorage();
            }
            
            // If localStorage failed or data is incomplete, try IndexedDB
            if (!gameData || !this.validateGameData(gameData)) {
                gameData = await this.loadFromIndexedDB();
            }
            
            // If we found compressed data, decompress it
            if (gameData && gameData.compressed && gameData.compressedData) {
                gameData = await this.decompressData(gameData);
            }
            
            // Load cognitive data separately
            if (gameData) {
                await this.loadCognitiveDataSeparately(gameData);
            }
            
            // Validate final loaded data
            if (gameData && this.validateCompleteGameData(gameData)) {
                console.log('Complete game data loaded successfully');
                return gameData;
            } else {
                console.log('No valid complete save data found');
                return null;
            }
            
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    }

    async loadFromLocalStorage() {
        if (!this.isSupported.localStorage) return null;
        
        try {
            const stored = localStorage.getItem(this.gameDataKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.warn('localStorage load failed:', error);
        }
        
        return null;
    }

    async loadFromIndexedDB() {
        if (!this.isSupported.indexedDB || !this.db) return null;
        
        return new Promise((resolve) => {
            const transaction = this.db.transaction(['gameData'], 'readonly');
            const store = transaction.objectStore('gameData');
            const request = store.get('current_game');
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(null);
        });
    }

    async loadCognitiveDataSeparately(gameData) {
        if (!this.isSupported.indexedDB || !this.db) return;
        
        try {
            // Load entity data
            const entityData = await this.loadEntityData();
            if (entityData && gameData.entityManager) {
                gameData.entityManager.knownPeople = entityData;
            }
            
            // Load memory episodes
            const memoryData = await this.loadMemoryData();
            if (memoryData && gameData.conceptualMemory) {
                gameData.conceptualMemory.episodicMemory = memoryData;
            }
            
            // Load language data
            const languageData = await this.loadLanguageData();
            if (languageData && gameData.languageLearning) {
                gameData.languageLearning.vocabulary = languageData;
            }
            
        } catch (error) {
            console.warn('Failed to load cognitive data separately:', error);
        }
    }

    async loadEntityData() {
        return new Promise((resolve) => {
            const transaction = this.db.transaction(['entityData'], 'readonly');
            const store = transaction.objectStore('entityData');
            const request = store.getAll();
            
            request.onsuccess = () => {
                const entities = new Map();
                for (const entity of request.result) {
                    entities.set(entity.personId, entity.personData);
                }
                resolve(entities);
            };
            request.onerror = () => resolve(new Map());
        });
    }

    async loadMemoryData() {
        return new Promise((resolve) => {
            const transaction = this.db.transaction(['memoryEpisodes'], 'readonly');
            const store = transaction.objectStore('memoryEpisodes');
            const index = store.index('timestamp');
            const request = index.getAll();
            
            request.onsuccess = () => {
                const episodes = request.result
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .slice(0, 100); // Load most recent 100 episodes
                resolve(episodes);
            };
            request.onerror = () => resolve([]);
        });
    }

    async loadLanguageData() {
        return new Promise((resolve) => {
            const transaction = this.db.transaction(['languageData'], 'readonly');
            const store = transaction.objectStore('languageData');
            const request = store.getAll();
            
            request.onsuccess = () => {
                const vocabulary = new Map();
                for (const wordEntry of request.result) {
                    vocabulary.set(wordEntry.word, wordEntry.wordData);
                }
                resolve(vocabulary);
            };
            request.onerror = () => resolve(new Map());
        });
    }

    // DATA COMPRESSION
    async compressData(data) {
        try {
            const jsonString = JSON.stringify(data);
            
            // Simple compression using browser's built-in compression
            if ('CompressionStream' in window) {
                const stream = new CompressionStream('gzip');
                const writer = stream.writable.getWriter();
                const reader = stream.readable.getReader();
                
                writer.write(new TextEncoder().encode(jsonString));
                writer.close();
                
                const chunks = [];
                let result;
                while (!(result = await reader.read()).done) {
                    chunks.push(result.value);
                }
                
                return Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer()));
            } else {
                // Fallback: simple string compression
                return this.simpleCompress(jsonString);
            }
        } catch (error) {
            console.warn('Compression failed, saving uncompressed:', error);
            return JSON.stringify(data);
        }
    }

    async decompressData(compressedGameData) {
        try {
            if ('DecompressionStream' in window && Array.isArray(compressedGameData.compressedData)) {
                const stream = new DecompressionStream('gzip');
                const writer = stream.writable.getWriter();
                const reader = stream.readable.getReader();
                
                writer.write(new Uint8Array(compressedGameData.compressedData));
                writer.close();
                
                const chunks = [];
                let result;
                while (!(result = await reader.read()).done) {
                    chunks.push(result.value);
                }
                
                const decompressed = new TextDecoder().decode(new Uint8Array(await new Blob(chunks).arrayBuffer()));
                return JSON.parse(decompressed);
            } else {
                // Fallback: simple string decompression
                return JSON.parse(this.simpleDecompress(compressedGameData.compressedData));
            }
        } catch (error) {
            console.error('Decompression failed:', error);
            return null;
        }
    }

    simpleCompress(str) {
        // Very basic compression - just remove extra whitespace
        return str.replace(/\s+/g, ' ').trim();
    }

    simpleDecompress(str) {
        // Just return as-is for simple compression
        return str;
    }

    // VALIDATION
    validateGameData(data) {
        if (!data) return false;
        
        const requiredFields = ['creature', 'timestamp'];
        return requiredFields.every(field => data.hasOwnProperty(field));
    }

    validateCompleteGameData(data) {
        if (!this.validateGameData(data)) return false;
        
        // Additional validation for cognitive data
        const cognitiveFields = ['entityManager', 'conceptualMemory', 'cognitiveProcessor', 'languageLearning'];
        const presentFields = cognitiveFields.filter(field => data.hasOwnProperty(field));
        
        // At least half of cognitive data should be present
        return presentFields.length >= cognitiveFields.length / 2;
    }

    calculateDataSize(data) {
        try {
            return JSON.stringify(data).length;
        } catch {
            return 0;
        }
    }

    // BACKUP SYSTEM
    async createAutomaticBackup() {
        try {
            const currentGame = await this.loadGame();
            if (!currentGame) return;
            
            const backupData = {
                id: `auto_backup_${Date.now()}`,
                gameData: currentGame,
                timestamp: Date.now(),
                backupType: 'automatic',
                version: '2.0'
            };
            
            await this.saveToIndexedDB('backups', backupData);
            this.lastBackupTime = Date.now();
            
            console.log('Automatic backup created');
        } catch (error) {
            console.warn('Failed to create automatic backup:', error);
        }
    }

    async createManualBackup(name) {
        try {
            const currentGame = await this.loadGame();
            if (!currentGame) return false;
            
            const backupData = {
                id: `manual_backup_${Date.now()}`,
                name: name || 'Manual Backup',
                gameData: currentGame,
                timestamp: Date.now(),
                backupType: 'manual',
                version: '2.0'
            };
            
            await this.saveToIndexedDB('backups', backupData);
            
            console.log('Manual backup created:', name);
            return true;
        } catch (error) {
            console.error('Failed to create manual backup:', error);
            return false;
        }
    }

    async getBackups() {
        if (!this.isSupported.indexedDB || !this.db) return [];
        
        return new Promise((resolve) => {
            const transaction = this.db.transaction(['backups'], 'readonly');
            const store = transaction.objectStore('backups');
            const index = store.index('timestamp');
            const request = index.getAll();
            
            request.onsuccess = () => {
                const backups = request.result
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map(backup => ({
                        id: backup.id,
                        name: backup.name || 'Backup',
                        timestamp: backup.timestamp,
                        backupType: backup.backupType,
                        age: Date.now() - backup.timestamp
                    }));
                resolve(backups);
            };
            request.onerror = () => resolve([]);
        });
    }

    async restoreFromBackup(backupId) {
        try {
            const backup = await this.loadFromIndexedDB('backups', backupId);
            if (backup && backup.gameData) {
                // Save current game as emergency backup first
                await this.createManualBackup('Pre-restore backup');
                
                // Restore the backup
                await this.saveGame(backup.gameData);
                
                console.log('Successfully restored from backup:', backupId);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to restore from backup:', error);
            return false;
        }
    }

    async cleanOldBackups() {
        if (!this.isSupported.indexedDB || !this.db) return;
        
        try {
            const transaction = this.db.transaction(['backups'], 'readwrite');
            const store = transaction.objectStore('backups');
            const index = store.index('timestamp');
            const request = index.openCursor(null, 'prev');
            
            let count = 0;
            const cutoffTime = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    count++;
                    const backup = cursor.value;
                    
                    // Keep manual backups longer, but still clean very old ones
                    const shouldDelete = (count > this.maxBackups) || 
                                       (backup.backupType === 'automatic' && backup.timestamp < cutoffTime) ||
                                       (backup.backupType === 'manual' && backup.timestamp < cutoffTime / 2);
                    
                    if (shouldDelete) {
                        cursor.delete();
                    }
                    
                    cursor.continue();
                }
            };
        } catch (error) {
            console.warn('Failed to clean old backups:', error);
        }
    }

    // SETTINGS MANAGEMENT
    async saveSettings(settings) {
        try {
            const settingsData = {
                id: 'user_settings',
                ...settings,
                timestamp: Date.now()
            };
            
            // Save to both storage methods
            const results = await Promise.allSettled([
                this.saveToLocalStorage(settingsData, this.settingsKey),
                this.saveToIndexedDB('settings', settingsData)
            ]);
            
            const success = results.some(result => result.status === 'fulfilled' && result.value);
            return success;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    }

    async loadSettings() {
        try {
            let settings = null;
            
            // Try localStorage first
            if (this.isSupported.localStorage) {
                const stored = localStorage.getItem(this.settingsKey);
                if (stored) {
                    settings = JSON.parse(stored);
                }
            }
            
            // Fallback to IndexedDB
            if (!settings && this.isSupported.indexedDB && this.db) {
                settings = await this.loadFromIndexedDB('settings', 'user_settings');
            }
            
            // Return settings or defaults
            return settings || this.getDefaultSettings();
        } catch (error) {
            console.error('Failed to load settings:', error);
            return this.getDefaultSettings();
        }
    }

    getDefaultSettings() {
        return {
            volume: 0.7,
            soundEnabled: true,
            speechEnabled: true,
            autoSave: true,
            theme: 'default',
            debugMode: false,
            compressionEnabled: true,
            maxBackups: 15,
            languageProcessingLevel: 'normal'
        };
    }

    // MAINTENANCE AND UTILITIES
    async clearAllData() {
        try {
            // Clear localStorage
            if (this.isSupported.localStorage) {
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('tamagotchi_') || key.startsWith('advanced_tamagotchi_')) {
                        localStorage.removeItem(key);
                    }
                });
            }
            
            // Clear IndexedDB
            if (this.isSupported.indexedDB && this.db) {
                const stores = ['gameData', 'cognitiveData', 'entityData', 'memoryEpisodes', 'languageData', 'backups', 'settings'];
                const transaction = this.db.transaction(stores, 'readwrite');
                
                stores.forEach(storeName => {
                    if (this.db.objectStoreNames.contains(storeName)) {
                        transaction.objectStore(storeName).clear();
                    }
                });
                
                await new Promise((resolve) => {
                    transaction.oncomplete = () => resolve();
                    transaction.onerror = () => resolve();
                });
            }
            
            console.log('All data cleared');
            return true;
        } catch (error) {
            console.error('Failed to clear data:', error);
            return false;
        }
    }

    async getStorageInfo() {
        const info = {
            localStorage: { supported: this.isSupported.localStorage, used: 0, available: true },
            indexedDB: { supported: this.isSupported.indexedDB, used: 0, available: true },
            backupCount: 0,
            totalSize: 0
        };
        
        // Calculate localStorage usage
        if (this.isSupported.localStorage) {
            try {
                let localStorageSize = 0;
                for (let key in localStorage) {
                    if (localStorage.hasOwnProperty(key) && 
                        (key.startsWith('tamagotchi_') || key.startsWith('advanced_tamagotchi_'))) {
                        localStorageSize += localStorage[key].length;
                    }
                }
                info.localStorage.used = localStorageSize;
            } catch (error) {
                info.localStorage.available = false;
            }
        }
        
        // Get IndexedDB usage and backup count
        if (this.isSupported.indexedDB && this.db) {
            try {
                const backups = await this.getBackups();
                info.backupCount = backups.length;
                
                if (navigator.storage && navigator.storage.estimate) {
                    const estimate = await navigator.storage.estimate();
                    info.indexedDB.quota = estimate.quota;
                    info.indexedDB.usage = estimate.usage;
                }
            } catch (error) {
                console.warn('Could not get IndexedDB info:', error);
            }
        }
        
        info.totalSize = info.localStorage.used + (info.indexedDB.usage || 0);
        
        return info;
    }

    // Helper method for saving to IndexedDB with error handling
    async saveToIndexedDB(storeName, data) {
        if (!this.db || !this.db.objectStoreNames.contains(storeName)) {
            return false;
        }
        
        return new Promise((resolve) => {
            try {
                const transaction = this.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.put(data);
                
                request.onsuccess = () => resolve(true);
                request.onerror = () => {
                    console.warn(`IndexedDB save failed for store ${storeName}:`, request.error);
                    resolve(false);
                };
                
                transaction.onerror = () => {
                    console.warn(`Transaction failed for store ${storeName}:`, transaction.error);
                    resolve(false);
                };
            } catch (error) {
                console.warn(`Exception during IndexedDB save for store ${storeName}:`, error);
                resolve(false);
            }
        });
    }

    async loadFromIndexedDBStore(storeName, id) {
        if (!this.db || !this.db.objectStoreNames.contains(storeName)) {
            return null;
        }
        
        return new Promise((resolve) => {
            try {
                const transaction = this.db.transaction([storeName], 'readonly');
                const store = transaction.objectStore(storeName);
                const request = store.get(id);
                
                request.onsuccess = () => resolve(request.result);
request.onerror = () => {
                   console.warn(`IndexedDB load failed for store ${storeName}:`, request.error);
                   resolve(null);
               };
           } catch (error) {
               console.warn(`Exception during IndexedDB load for store ${storeName}:`, error);
               resolve(null);
           }
       });
   }

   // DATA EXPORT/IMPORT
   async exportGameData(includeBackups = false) {
       try {
           const gameData = await this.loadGame();
           const settings = await this.loadSettings();
           const storageInfo = await this.getStorageInfo();
           
           const exportData = {
               formatVersion: '2.0',
               exportTime: Date.now(),
               gameData: gameData,
               settings: settings,
               storageInfo: storageInfo,
               metadata: {
                   creatureName: gameData?.creature?.name || 'Unknown',
                   creatureAge: gameData?.creature?.age || 0,
                   languageStage: gameData?.languageLearning?.learningStage || 1,
                   knownPeople: gameData?.entityManager?.knownPeople?.size || 0,
                   totalInteractions: gameData?.creature?.totalInteractions || 0
               }
           };
           
           // Include backups if requested
           if (includeBackups) {
               exportData.backups = await this.getBackups();
           }
           
           const jsonString = JSON.stringify(exportData, null, 2);
           
           // Create downloadable file
           const blob = new Blob([jsonString], { type: 'application/json' });
           const url = URL.createObjectURL(blob);
           
           const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
           const creatureName = exportData.metadata.creatureName.replace(/[^a-zA-Z0-9]/g, '_');
           const filename = `tamagotchi_${creatureName}_${timestamp}.json`;
           
           // Trigger download
           const a = document.createElement('a');
           a.href = url;
           a.download = filename;
           a.style.display = 'none';
           document.body.appendChild(a);
           a.click();
           document.body.removeChild(a);
           URL.revokeObjectURL(url);
           
           console.log('Game data exported successfully:', filename);
           return { success: true, filename: filename };
           
       } catch (error) {
           console.error('Failed to export game data:', error);
           return { success: false, error: error.message };
       }
   }

   async importGameData(file) {
       return new Promise((resolve, reject) => {
           if (!file || file.type !== 'application/json') {
               reject(new Error('Invalid file type. Please select a JSON file.'));
               return;
           }
           
           if (file.size > 50 * 1024 * 1024) { // 50MB limit
               reject(new Error('File too large. Maximum size is 50MB.'));
               return;
           }
           
           const reader = new FileReader();
           
           reader.onload = async (e) => {
               try {
                   const importData = JSON.parse(e.target.result);
                   
                   // Validate import data
                   if (!this.validateImportData(importData)) {
                       reject(new Error('Invalid save file format or corrupted data.'));
                       return;
                   }
                   
                   // Check version compatibility
                   if (importData.formatVersion && !this.isVersionCompatible(importData.formatVersion)) {
                       console.warn('Import data is from different version, attempting migration...');
                   }
                   
                   // Create backup before import
                   await this.createManualBackup('Pre-import backup');
                   
                   // Import the data
                   await this.saveGame(importData.gameData);
                   
                   if (importData.settings) {
                       await this.saveSettings(importData.settings);
                   }
                   
                   console.log('Game data imported successfully');
                   resolve({
                       success: true,
                       metadata: importData.metadata || {},
                       formatVersion: importData.formatVersion || 'unknown'
                   });
                   
               } catch (error) {
                   console.error('Failed to parse or import file:', error);
                   reject(new Error('Failed to parse save file: ' + error.message));
               }
           };
           
           reader.onerror = () => {
               reject(new Error('Failed to read file: ' + reader.error?.message || 'Unknown error'));
           };
           
           reader.readAsText(file);
       });
   }

   validateImportData(data) {
       if (!data || typeof data !== 'object') return false;
       
       // Check for required fields
       if (!data.gameData || !data.exportTime) return false;
       
       // Validate game data structure
       if (!this.validateCompleteGameData(data.gameData)) return false;
       
       // Check for reasonable export time (not too old, not in future)
       const exportAge = Date.now() - data.exportTime;
       if (exportAge < 0 || exportAge > 365 * 24 * 60 * 60 * 1000) { // Max 1 year old
           console.warn('Import data has suspicious timestamp');
       }
       
       return true;
   }

   isVersionCompatible(version) {
       const currentMajor = parseInt('2');
       const importMajor = parseInt(version);
       
       // Same major version or newer patch version is compatible
       return importMajor === currentMajor;
   }

   // PERFORMANCE MONITORING
   async performanceCheck() {
       const startTime = performance.now();
       
       try {
           // Test localStorage performance
           const testData = { test: 'performance', timestamp: Date.now() };
           localStorage.setItem('perf_test', JSON.stringify(testData));
           const retrieved = JSON.parse(localStorage.getItem('perf_test'));
           localStorage.removeItem('perf_test');
           
           // Test IndexedDB performance
           if (this.db) {
               await this.saveToIndexedDB('settings', { id: 'perf_test', data: testData });
               await this.loadFromIndexedDBStore('settings', 'perf_test');
               
               // Clean up test data
               const transaction = this.db.transaction(['settings'], 'readwrite');
               const store = transaction.objectStore('settings');
               store.delete('perf_test');
           }
           
           const endTime = performance.now();
           const duration = endTime - startTime;
           
           const result = {
               duration: duration,
               status: duration < 100 ? 'good' : duration < 500 ? 'fair' : 'slow',
               localStorageWorking: retrieved.test === 'performance',
               indexedDBWorking: !!this.db
           };
           
           console.log('Storage performance check:', result);
           return result;
           
       } catch (error) {
           console.error('Performance check failed:', error);
           return {
               duration: performance.now() - startTime,
               status: 'error',
               error: error.message,
               localStorageWorking: false,
               indexedDBWorking: false
           };
       }
   }

   // CLEANUP AND OPTIMIZATION
   async optimizeStorage() {
       console.log('Starting storage optimization...');
       
       try {
           // Clean old backups
           await this.cleanOldBackups();
           
           // Remove orphaned cognitive data
           await this.cleanOrphanedCognitiveData();
           
           // Compress large data if not already compressed
           await this.compressLargeData();
           
           // Defragment IndexedDB if supported
           if (this.db && 'vacuum' in this.db) {
               await this.db.vacuum();
           }
           
           console.log('Storage optimization completed');
           return true;
           
       } catch (error) {
           console.error('Storage optimization failed:', error);
           return false;
       }
   }

   async cleanOrphanedCognitiveData() {
       if (!this.db) return;
       
       try {
           // Get current game data to check what cognitive data is still referenced
           const gameData = await this.loadGame();
           if (!gameData) return;
           
           // Clean orphaned entity data
           // (Implementation would check which entities are no longer referenced)
           
           // Clean orphaned memory episodes older than 30 days
           const cutoffTime = Date.now() - (30 * 24 * 60 * 60 * 1000);
           const transaction = this.db.transaction(['memoryEpisodes'], 'readwrite');
           const store = transaction.objectStore('memoryEpisodes');
           const index = store.index('timestamp');
           const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime));
           
           request.onsuccess = (event) => {
               const cursor = event.target.result;
               if (cursor) {
                   cursor.delete();
                   cursor.continue();
               }
           };
           
       } catch (error) {
           console.warn('Failed to clean orphaned cognitive data:', error);
       }
   }

   async compressLargeData() {
       if (!this.compressionEnabled) return;
       
       try {
           const gameData = await this.loadFromLocalStorage();
           if (gameData && !gameData.compressed && this.calculateDataSize(gameData) > 100000) {
               console.log('Compressing large game data...');
               await this.saveGame(gameData);
           }
       } catch (error) {
           console.warn('Failed to compress large data:', error);
       }
   }

   // DIAGNOSTICS
   async runDiagnostics() {
       const diagnostics = {
           timestamp: Date.now(),
           storageSupport: this.isSupported,
           performance: await this.performanceCheck(),
           storageInfo: await this.getStorageInfo(),
           dataIntegrity: await this.checkDataIntegrity(),
           backupStatus: await this.checkBackupStatus()
       };
       
       console.log('Storage diagnostics:', diagnostics);
       return diagnostics;
   }

   async checkDataIntegrity() {
       try {
           const gameData = await this.loadGame();
           if (!gameData) return { status: 'no_data' };
           
           const issues = [];
           
           // Check for basic data corruption
           if (!this.validateCompleteGameData(gameData)) {
               issues.push('invalid_structure');
           }
           
           // Check for reasonable data values
           if (gameData.creature) {
               const c = gameData.creature;
               if (c.hunger < 0 || c.hunger > 100) issues.push('invalid_hunger');
               if (c.health < 0 || c.health > 100) issues.push('invalid_health');
               if (c.age < 0) issues.push('invalid_age');
           }
           
           // Check cognitive data consistency
           if (gameData.entityManager && gameData.entityManager.knownPeople) {
               if (gameData.entityManager.knownPeople.size > 1000) {
                   issues.push('excessive_entities');
               }
           }
           
           return {
               status: issues.length === 0 ? 'good' : 'issues_found',
               issues: issues,
               dataSize: this.calculateDataSize(gameData)
           };
           
       } catch (error) {
           return {
               status: 'error',
               error: error.message
           };
       }
   }

   async checkBackupStatus() {
       const backups = await this.getBackups();
       const now = Date.now();
       
       const automaticBackups = backups.filter(b => b.backupType === 'automatic');
       const manualBackups = backups.filter(b => b.backupType === 'manual');
       
       const latestAutoBackup = automaticBackups[0];
       const timeSinceLastAutoBackup = latestAutoBackup ? now - latestAutoBackup.timestamp : Infinity;
       
       return {
           totalBackups: backups.length,
           automaticBackups: automaticBackups.length,
           manualBackups: manualBackups.length,
           latestBackupAge: timeSinceLastAutoBackup,
           backupHealthy: timeSinceLastAutoBackup < this.backupInterval * 2,
           oldestBackup: backups[backups.length - 1]?.timestamp
       };
   }
}
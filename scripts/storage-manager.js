// StorageManager - handles saving/loading game data
class StorageManager {
    constructor() {
        this.dbName = 'TamagotchiDB';
        this.dbVersion = 1;
        this.db = null;
        
        // Storage keys
        this.gameDataKey = 'tamagotchi_game_data';
        this.settingsKey = 'tamagotchi_settings';
        this.languageDataKey = 'tamagotchi_language_data';
        
        this.isSupported = {
            localStorage: typeof(Storage) !== 'undefined',
            indexedDB: 'indexedDB' in window
        };
    }

    async init() {
        console.log('Initializing storage manager...');
        
        // Initialize IndexedDB for complex data
        if (this.isSupported.indexedDB) {
            await this.initIndexedDB();
        }
        
        // Check localStorage availability
        if (this.isSupported.localStorage) {
            console.log('LocalStorage available');
        } else {
            console.warn('LocalStorage not available - save functionality limited');
        }
        
        console.log('Storage manager initialized');
    }

    async initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => {
                console.warn('IndexedDB initialization failed:', request.error);
                this.isSupported.indexedDB = false;
                resolve();
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                console.log('IndexedDB initialized successfully');
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('gameData')) {
                    const gameStore = db.createObjectStore('gameData', { keyPath: 'id' });
                    gameStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('languageData')) {
                    const langStore = db.createObjectStore('languageData', { keyPath: 'id' });
                    langStore.createIndex('creatureId', 'creatureId', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('backups')) {
                    const backupStore = db.createObjectStore('backups', { keyPath: 'id' });
                    backupStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
                
                console.log('IndexedDB object stores created');
            };
        });
    }

    // Main save/load functions
    async saveGame(gameData) {
        try {
            const saveData = {
                ...gameData,
                version: '1.0',
                timestamp: Date.now(),
                id: 'current_game'
            };
            
            // Save to localStorage (primary)
            if (this.isSupported.localStorage) {
                localStorage.setItem(this.gameDataKey, JSON.stringify(saveData));
            }
            
            // Save to IndexedDB (backup)
            if (this.isSupported.indexedDB && this.db) {
                await this.saveToIndexedDB('gameData', saveData);
            }
            
            // Create periodic backup
            await this.createBackup(saveData);
            
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    async loadGame() {
        try {
            let gameData = null;
            
            // Try localStorage first
            if (this.isSupported.localStorage) {
                const stored = localStorage.getItem(this.gameDataKey);
                if (stored) {
                    gameData = JSON.parse(stored);
                }
            }
            
            // Fallback to IndexedDB if localStorage fails
            if (!gameData && this.isSupported.indexedDB && this.db) {
                gameData = await this.loadFromIndexedDB('gameData', 'current_game');
            }
            
            // Validate loaded data
            if (gameData && this.validateGameData(gameData)) {
                console.log('Game data loaded successfully');
                return gameData;
            } else {
                console.log('No valid save data found');
                return null;
            }
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    }

    validateGameData(data) {
        // Check if the data has required fields
        const requiredFields = ['creature', 'timestamp'];
        return requiredFields.every(field => data.hasOwnProperty(field));
    }

    // Settings management
    async saveSettings(settings) {
        try {
            const settingsData = {
                ...settings,
                timestamp: Date.now()
            };
            
            if (this.isSupported.localStorage) {
                localStorage.setItem(this.settingsKey, JSON.stringify(settingsData));
            }
            
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    }

    async loadSettings() {
        try {
            if (this.isSupported.localStorage) {
                const stored = localStorage.getItem(this.settingsKey);
                if (stored) {
                    return JSON.parse(stored);
                }
            }
            
            // Return default settings
            return {
                volume: 0.7,
                soundEnabled: true,
                speechEnabled: true,
                autoSave: true,
                theme: 'default'
            };
        } catch (error) {
            console.error('Failed to load settings:', error);
            return null;
        }
    }

    // IndexedDB operations
    async saveToIndexedDB(storeName, data) {
        if (!this.db) return false;
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async loadFromIndexedDB(storeName, id) {
        if (!this.db) return null;
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Backup system
    async createBackup(gameData) {
        if (!this.isSupported.indexedDB || !this.db) return;
        
        try {
            const backupData = {
                ...gameData,
                id: `backup_${Date.now()}`,
                isBackup: true
            };
            
            await this.saveToIndexedDB('backups', backupData);
            
            // Clean old backups (keep only last 10)
            await this.cleanOldBackups();
        } catch (error) {
            console.warn('Failed to create backup:', error);
        }
    }

    async cleanOldBackups() {
        if (!this.db) return;
        
        try {
            const transaction = this.db.transaction(['backups'], 'readwrite');
            const store = transaction.objectStore('backups');
            const index = store.index('timestamp');
            const request = index.openCursor(null, 'prev'); // Newest first
            
            let count = 0;
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    count++;
                    if (count > 10) {
                        // Delete old backups
                        store.delete(cursor.primaryKey);
                    }
                    cursor.continue();
                }
            };
        } catch (error) {
            console.warn('Failed to clean old backups:', error);
        }
    }

    async getBackups() {
        if (!this.isSupported.indexedDB || !this.db) return [];
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['backups'], 'readonly');
            const store = transaction.objectStore('backups');
            const index = store.index('timestamp');
            const request = index.getAll();
            
            request.onsuccess = () => {
                const backups = request.result.sort((a, b) => b.timestamp - a.timestamp);
                resolve(backups);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async restoreFromBackup(backupId) {
        try {
            const backup = await this.loadFromIndexedDB('backups', backupId);
            if (backup) {
                // Remove backup-specific fields
                delete backup.isBackup;
                backup.id = 'current_game';
                backup.timestamp = Date.now();
                
                // Save as current game
                await this.saveGame(backup);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to restore from backup:', error);
            return false;
        }
    }

    // Data export/import
    async exportGameData() {
        try {
            const gameData = await this.loadGame();
            const settings = await this.loadSettings();
            
            const exportData = {
                game: gameData,
                settings: settings,
                exportTime: Date.now(),
                version: '1.0'
            };
            
            const jsonString = JSON.stringify(exportData, null, 2);
            
            // Create downloadable file
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `tamagotchi_save_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Failed to export game data:', error);
            return false;
        }
    }

    async importGameData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    // Validate import data
                    if (importData.game && this.validateGameData(importData.game)) {
                        await this.saveGame(importData.game);
                        
                        if (importData.settings) {
                            await this.saveSettings(importData.settings);
                        }
                        
                        resolve(true);
                    } else {
                        reject(new Error('Invalid save file format'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    // Clear all data
    async clearAllData() {
        try {
            // Clear localStorage
            if (this.isSupported.localStorage) {
                localStorage.removeItem(this.gameDataKey);
                localStorage.removeItem(this.settingsKey);
                localStorage.removeItem(this.languageDataKey);
            }
            
            // Clear IndexedDB
            if (this.isSupported.indexedDB && this.db) {
                const stores = ['gameData', 'languageData', 'backups'];
                const transaction = this.db.transaction(stores, 'readwrite');
                
                stores.forEach(storeName => {
                    transaction.objectStore(storeName).clear();
                });
            }
            
            console.log('All data cleared');
            return true;
        } catch (error) {
            console.error('Failed to clear data:', error);
            return false;
        }
    }

    // Storage usage information
    async getStorageInfo() {
        const info = {
            localStorage: { supported: this.isSupported.localStorage, used: 0 },
            indexedDB: { supported: this.isSupported.indexedDB, used: 0 }
        };
        
        // Calculate localStorage usage
        if (this.isSupported.localStorage) {
            let localStorageSize = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key) && key.startsWith('tamagotchi_')) {
                    localStorageSize += localStorage[key].length;
                }
            }
            info.localStorage.used = localStorageSize;
        }
        
        // IndexedDB usage estimation
        if (this.isSupported.indexedDB && navigator.storage && navigator.storage.estimate) {
            try {
                const estimate = await navigator.storage.estimate();
                info.indexedDB.quota = estimate.quota;
                info.indexedDB.usage = estimate.usage;
            } catch (error) {
                console.warn('Could not estimate storage usage:', error);
            }
        }
        
        return info;
    }
}
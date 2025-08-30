// AudioSystem - handles all sound effects and speech synthesis
class AudioSystem {
    constructor() {
        this.isEnabled = true;
        this.volume = 0.7;
        
        // Web Audio API context
        this.audioContext = null;
        this.sounds = new Map();
        
        // Speech synthesis
        this.speechSynth = window.speechSynthesis;
        this.creatureVoice = null;
        
        // Sound generation parameters
        this.baseFrequency = 220; // A3
        this.moodFrequencies = {
            happy: 1.2,
            sad: 0.8,
            angry: 1.5,
            sleepy: 0.6,
            hungry: 0.9,
            sick: 0.7
        };
        
        this.init();
    }

    async init() {
        try {
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Set up speech synthesis
            this.initializeSpeechSynthesis();
            
            // Pre-generate some basic sounds
            this.generateBasicSounds();
            
            console.log('Audio system initialized');
        } catch (error) {
            console.warn('Audio system initialization failed:', error);
            this.isEnabled = false;
        }
    }

    initializeSpeechSynthesis() {
        if (!this.speechSynth) {
            console.warn('Speech synthesis not supported');
            return;
        }

        const setVoice = () => {
            const voices = this.speechSynth.getVoices();
            
            // Look for the cutest/highest voices first
            this.creatureVoice = voices.find(voice => 
                voice.name.includes('Google UK English Female') ||
                voice.name.includes('Microsoft Zira') ||
                voice.name.includes('Female') ||
                voice.name.includes('Child') ||
                voice.name.includes('Young')
            ) || voices.find(voice => 
                voice.gender === 'female'
            ) || voices[0];
            
            if (this.creatureVoice) {
                console.log('Cute creature voice set:', this.creatureVoice.name);
            }
        };

        if (this.speechSynth.getVoices().length > 0) {
            setVoice();
        } else {
            this.speechSynth.addEventListener('voiceschanged', setVoice);
        }
    }

    generateBasicSounds() {
        if (!this.audioContext) return;

        // Generate mood-based sound patterns
        Object.keys(this.moodFrequencies).forEach(mood => {
            this.sounds.set(mood, this.createMoodSound(mood));
        });

        // Generate interaction sounds
        this.sounds.set('click', this.createClickSound());
        this.sounds.set('feed', this.createFeedSound());
        this.sounds.set('play', this.createPlaySound());
        this.sounds.set('sleep', this.createSleepSound());
        this.sounds.set('medicine', this.createMedicineSound());
    }

    createMoodSound(mood) {
        const frequency = this.baseFrequency * this.moodFrequencies[mood];
        const duration = mood === 'sleepy' ? 0.8 : 0.3;
        
        return () => this.playTone(frequency, duration, mood);
    }

    createClickSound() {
        return () => this.playTone(440, 0.1, 'neutral', 'square');
    }

    createFeedSound() {
        return () => {
            // Multiple quick tones for eating sound
            setTimeout(() => this.playTone(300, 0.1), 0);
            setTimeout(() => this.playTone(350, 0.1), 100);
            setTimeout(() => this.playTone(300, 0.1), 200);
        };
    }

    createPlaySound() {
        return () => {
            // Happy ascending tones
            setTimeout(() => this.playTone(400, 0.2), 0);
            setTimeout(() => this.playTone(500, 0.2), 150);
            setTimeout(() => this.playTone(600, 0.3), 300);
        };
    }

    createSleepSound() {
        return () => {
            // Soft descending tones
            setTimeout(() => this.playTone(300, 0.5, 'sleepy'), 0);
            setTimeout(() => this.playTone(250, 0.8, 'sleepy'), 400);
        };
    }

    createMedicineSound() {
        return () => {
            // Healing sparkle sound
            const frequencies = [523, 659, 784, 880]; // C, E, G, A
            frequencies.forEach((freq, index) => {
                setTimeout(() => this.playTone(freq, 0.15, 'neutral', 'triangle'), index * 100);
            });
        };
    }

    playTone(frequency, duration, mood = 'neutral', waveType = 'sine') {
        if (!this.audioContext || !this.isEnabled) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = waveType;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

            // Apply mood-based volume and envelope
            let volume = this.volume * 0.3; // Base volume
            
            switch (mood) {
                case 'angry':
                    volume *= 1.2;
                    break;
                case 'sad':
                    volume *= 0.6;
                    break;
                case 'sleepy':
                    volume *= 0.4;
                    break;
                case 'happy':
                    volume *= 0.9;
                    break;
            }

            // Envelope for natural sound
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);

        } catch (error) {
            console.warn('Failed to play tone:', error);
        }
    }

    // Public methods for game events
    playCreatureSound(mood) {
        if (!this.isEnabled) return;

        const sound = this.sounds.get(mood);
        if (sound) {
            sound();
        } else {
            // Fallback to generic mood sound
            this.playTone(this.baseFrequency * (this.moodFrequencies[mood] || 1), 0.3, mood);
        }
    }

    playInteractionSound(type) {
        if (!this.isEnabled) return;

        const sound = this.sounds.get(type);
        if (sound) {
            sound();
        }
    }

    speakText(text, emotion = 'neutral', stage = 1) {
        if (!this.speechSynth || !this.creatureVoice || !this.isEnabled) return;

        try {
            this.speechSynth.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = this.creatureVoice;
            utterance.volume = this.volume;

            // CUTE VOICE SETTINGS
            utterance.pitch = 1.8; // Much higher pitch = cuter
            utterance.rate = 0.7;  // Slower = more baby-like

            // Adjust based on emotion (but keep it cute)
            switch (emotion) {
                case 'happy':
                    utterance.pitch = 2.0; // Extra high when happy
                    utterance.rate = 0.8;
                    break;
                case 'sad':
                    utterance.pitch = 1.6; // Still high but lower
                    utterance.rate = 0.6;  // Slower when sad
                    break;
                case 'angry':
                    utterance.pitch = 1.7; // Angry but still cute
                    utterance.rate = 0.9;
                    break;
                case 'sleepy':
                    utterance.pitch = 1.4; // Lower and sleepy
                    utterance.rate = 0.5;  // Very slow
                    break;
                default:
                    utterance.pitch = 1.8;
                    utterance.rate = 0.7;
            }

            // Make younger stages even cuter
            if (stage <= 2) {
                utterance.pitch += 0.3; // Even higher for baby stages
                utterance.rate *= 0.8;   // Even slower
            }

            this.speechSynth.speak(utterance);

        } catch (error) {
            console.warn('Speech synthesis failed:', error);
        }
    }

    playEmergencyAlert() {
        if (!this.isEnabled) return;

        // Urgent beeping pattern
        const beep = () => this.playTone(800, 0.1, 'angry', 'square');
        
        beep();
        setTimeout(beep, 200);
        setTimeout(beep, 400);
    }

    playEvolutionSound() {
        if (!this.isEnabled) return;

        // Magical evolution sound
        const frequencies = [261, 329, 392, 523, 659]; // C major scale
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.4, 'happy', 'triangle');
            }, index * 200);
        });
    }

    // Volume and settings control
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    toggleEnabled() {
        this.isEnabled = !this.isEnabled;
        if (!this.isEnabled && this.speechSynth) {
            this.speechSynth.cancel();
        }
        return this.isEnabled;
    }

    // Initialize audio context if suspended (required by some browsers)
    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('Audio context resumed');
            } catch (error) {
                console.warn('Failed to resume audio context:', error);
            }
        }
    }
}
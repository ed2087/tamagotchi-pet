// LanguageLearning - Core system for creature's language development
class LanguageLearning {
    constructor(creature) {
        this.creature = creature;
        
        // Evolution stages
        this.stages = {
            1: { name: 'Raw Mimicking', minAge: 0, minInteractions: 0 },
            2: { name: 'Pattern Recognition', minAge: 168, minInteractions: 50 }, // 1 week
            3: { name: 'Creative Recombination', minAge: 504, minInteractions: 150 }, // 3 weeks
            4: { name: 'Advanced Communication', minAge: 1344, minInteractions: 300 } // 8 weeks
        };
        
        // Language data
        this.vocabulary = new Map(); // word -> { frequency, emotional_context, first_learned }
        this.learnedPhrases = []; // Common phrases the creature has picked up
        this.emotionalAssociations = new Map(); // emotion -> associated words/sounds
        this.userNickname = ''; // What the creature calls the user
        this.communicationStyle = {
            formality: 0.5, // 0 = very casual, 1 = very formal
            chattiness: 0.5, // How much the creature likes to talk
            creativity: 0.3 // How creative with language
        };
        
        // Learning parameters
        this.learningRate = 1.0;
        this.memoryRetention = 0.95;
        this.creativeThreshold = 0.6;
        
        // Response generation
        this.recentInputs = []; // Last 10 inputs for context
        this.responseTemplates = new Map();
        
        this.init();
    }

    init() {
        this.initializeBasicVocabulary();
        this.initializeResponseTemplates();
        console.log('Language learning system initialized');
    }

    initializeNew() {
        this.vocabulary.clear();
        this.learnedPhrases = [];
        this.emotionalAssociations.clear();
        this.userNickname = '';
        this.communicationStyle = {
            formality: 0.5,
            chattiness: 0.5,
            creativity: 0.3
        };
        this.recentInputs = [];
        
        this.initializeBasicVocabulary();
        console.log('Language learning reset for new creature');
    }

    initializeBasicVocabulary() {
        // Basic survival words the creature knows instinctively
        const basicWords = [
            { word: 'hungry', emotion: 'need', frequency: 5 },
            { word: 'tired', emotion: 'need', frequency: 5 },
            { word: 'happy', emotion: 'joy', frequency: 5 },
            { word: 'sad', emotion: 'sadness', frequency: 5 },
            { word: 'help', emotion: 'need', frequency: 3 },
            { word: 'play', emotion: 'joy', frequency: 4 }
        ];
        
        basicWords.forEach(item => {
            this.vocabulary.set(item.word, {
                frequency: item.frequency,
                emotionalContext: item.emotion,
                firstLearned: Date.now(),
                stage: 1
            });
        });
    }

    initializeResponseTemplates() {
        // Templates for generating responses based on stage
        this.responseTemplates.set(1, {
            // Raw mimicking - phonetic approximations
            patterns: [
                { input: /hello|hi|hey/i, responses: ['helo', 'hai', 'hii'] },
                { input: /good|nice|great/i, responses: ['gud', 'nais', 'grat'] },
                { input: /love|like/i, responses: ['luv', 'lik', 'lub'] },
                { input: /you are|you're/i, responses: ['yu ar', 'yur', 'u r'] }
            ],
            fallbacks: ['???', 'hm?', 'uh', 'mm']
        });
        
        this.responseTemplates.set(2, {
            // Pattern recognition - starting to use learned words correctly
            patterns: [
                { input: /how are you/i, responses: ['me good!', 'happy me', 'tired little'] },
                { input: /hungry|eat|food/i, responses: ['hungry yes!', 'want food', 'eat please'] },
                { input: /play|game|fun/i, responses: ['play fun!', 'want play', 'happy play'] }
            ],
            fallbacks: ['no understand', 'what mean?', 'learn more']
        });
        
        this.responseTemplates.set(3, {
            // Creative recombination - mixing learned concepts
            patterns: [
                { input: /love|like/i, responses: ['me love you too!', 'happy love feeling', 'you nice friend'] },
                { input: /sad|upset|hurt/i, responses: ['why sad? me help', 'no sad! me make happy', 'hug make better?'] }
            ],
            fallbacks: ['tell me more', 'interesting...', 'me think about']
        });
        
        this.responseTemplates.set(4, {
            // Advanced communication - complex thoughts
            patterns: [
                { input: /how.*feel/i, responses: ['I feel warm inside when you talk', 'My thoughts dance with happiness', 'Sometimes I wonder about dreams'] },
                { input: /what.*think/i, responses: ['I think friendship is like sunlight', 'My mind creates colors from your words', 'I believe we understand each other'] }
            ],
            fallbacks: ['Let me share a thought...', 'I sense something in your words', 'Your energy feels different today']
        });
    }

    // Main input processing
    processUserInput(input, type = 'text') {
        if (!input || !this.creature.isAlive) return;
        
        // Store input for context
        this.recentInputs.push({
            text: input,
            type: type,
            timestamp: Date.now(),
            emotion: this.detectEmotion(input)
        });
        
        // Keep only last 10 inputs
        if (this.recentInputs.length > 10) {
            this.recentInputs.shift();
        }
        
        // Learn from input
        this.learnFromInput(input, type);
        
        // Generate and display response
        setTimeout(() => {
            const response = this.generateResponse(input);
            this.displayCreatureResponse(response);
        }, 500 + Math.random() * 1500); // Realistic thinking time
    }

    learnFromInput(input, type) {
        const words = this.extractWords(input);
        const emotion = this.detectEmotion(input);
        const currentStage = this.creature.evolutionStage;
        
        // Learn vocabulary
        words.forEach(word => {
            if (word.length < 2) return; // Skip very short words
            
            if (this.vocabulary.has(word)) {
                // Reinforce existing word
                const data = this.vocabulary.get(word);
                data.frequency += this.learningRate;
                data.lastSeen = Date.now();
            } else {
                // Learn new word
                this.vocabulary.set(word, {
                    frequency: this.learningRate,
                    emotionalContext: emotion,
                    firstLearned: Date.now(),
                    lastSeen: Date.now(),
                    stage: currentStage
                });
            }
        });
        
        // Learn phrases (stage 2+)
        if (currentStage >= 2) {
            this.learnPhrase(input, emotion);
        }
        
        // Update emotional associations
        this.updateEmotionalAssociations(words, emotion);
        
        // Adapt communication style based on user's input
        this.adaptCommunicationStyle(input, type);
        
        // Generate nickname for user (stage 3+)
        if (currentStage >= 3 && !this.userNickname) {
            this.generateUserNickname();
        }
    }

    extractWords(input) {
        return input.toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .split(/\s+/)
            .filter(word => word.length > 0);
    }

    detectEmotion(input) {
        const emotionKeywords = {
            joy: ['happy', 'good', 'great', 'awesome', 'love', 'wonderful', 'amazing', 'fantastic'],
            sadness: ['sad', 'upset', 'cry', 'hurt', 'lonely', 'depressed', 'down'],
            anger: ['angry', 'mad', 'hate', 'furious', 'annoyed', 'irritated'],
            fear: ['scared', 'afraid', 'worried', 'anxious', 'nervous'],
            surprise: ['wow', 'amazing', 'incredible', 'unbelievable'],
            neutral: ['okay', 'fine', 'alright']
        };
        
        const words = this.extractWords(input);
        const emotionScores = {};
        
        Object.keys(emotionKeywords).forEach(emotion => {
            emotionScores[emotion] = 0;
            emotionKeywords[emotion].forEach(keyword => {
                if (words.includes(keyword)) {
                    emotionScores[emotion]++;
                }
            });
        });
        
        // Return emotion with highest score, or neutral
        return Object.keys(emotionScores).reduce((a, b) => 
            emotionScores[a] > emotionScores[b] ? a : b
        ) || 'neutral';
    }

    learnPhrase(input, emotion) {
        if (input.length > 50) return; // Don't learn very long phrases
        
        const existingPhrase = this.learnedPhrases.find(p => p.text === input);
        if (existingPhrase) {
            existingPhrase.frequency++;
            existingPhrase.lastSeen = Date.now();
        } else {
            this.learnedPhrases.push({
                text: input,
                emotion: emotion,
                frequency: 1,
                firstLearned: Date.now(),
                lastSeen: Date.now()
            });
        }
        
        // Keep only top 50 phrases
        if (this.learnedPhrases.length > 50) {
            this.learnedPhrases.sort((a, b) => b.frequency - a.frequency);
            this.learnedPhrases = this.learnedPhrases.slice(0, 50);
        }
    }

    updateEmotionalAssociations(words, emotion) {
        if (!this.emotionalAssociations.has(emotion)) {
            this.emotionalAssociations.set(emotion, new Map());
        }
        
        const emotionWords = this.emotionalAssociations.get(emotion);
        
        words.forEach(word => {
            if (emotionWords.has(word)) {
                emotionWords.set(word, emotionWords.get(word) + 1);
            } else {
                emotionWords.set(word, 1);
            }
        });
    }

    adaptCommunicationStyle(input, type) {
        // Adapt based on user's communication patterns
        const words = this.extractWords(input);
        
        // Formality adaptation
        const formalWords = ['please', 'thank', 'excuse', 'pardon'];
        const casualWords = ['yeah', 'yep', 'nah', 'gonna', 'wanna'];
        
        const formalCount = words.filter(w => formalWords.includes(w)).length;
        const casualCount = words.filter(w => casualWords.includes(w)).length;
        
        if (formalCount > casualCount) {
            this.communicationStyle.formality += 0.01;
        } else if (casualCount > formalCount) {
            this.communicationStyle.formality -= 0.01;
        }
        
        // Chattiness adaptation
        if (input.length > 50) {
            this.communicationStyle.chattiness += 0.01;
        } else if (input.length < 10) {
            this.communicationStyle.chattiness -= 0.01;
        }
        
        // Creativity adaptation
        const uniqueWords = new Set(words);
        if (uniqueWords.size / words.length > 0.8) { // High word diversity
            this.communicationStyle.creativity += 0.01;
        }
        
        // Clamp values
        Object.keys(this.communicationStyle).forEach(key => {
            this.communicationStyle[key] = Math.max(0, Math.min(1, this.communicationStyle[key]));
        });
    }

    generateUserNickname() {
        const commonWords = Array.from(this.vocabulary.entries())
            .sort((a, b) => b[1].frequency - a[1].frequency)
            .slice(0, 5)
            .map(([word]) => word);
        
        const nicknamePatterns = [
            () => commonWords[0] + '-friend',
            () => 'my-' + commonWords[0],
            () => commonWords[1] + '-human',
            () => 'friend-' + commonWords[0]
        ];
        
        const pattern = nicknamePatterns[Math.floor(Math.random() * nicknamePatterns.length)];
        this.userNickname = pattern() || 'friend';
    }

    generateResponse(input) {
        const currentStage = this.creature.evolutionStage;
        const templates = this.responseTemplates.get(currentStage);
        
        // Try to match patterns first
        for (let pattern of templates.patterns) {
            if (pattern.input.test(input)) {
                const responses = pattern.responses;
                let response = responses[Math.floor(Math.random() * responses.length)];
                
                // Add creature's personality
                response = this.addPersonality(response, currentStage);
                
                return {
                    text: response,
                    translated: currentStage <= 2,
                    emotion: this.creature.mood,
                    stage: currentStage
                };
            }
        }
        
        // Generate creative response based on learned vocabulary
        if (currentStage >= 3 && Math.random() < this.communicationStyle.creativity) {
            const creativeResponse = this.generateCreativeResponse(input);
            if (creativeResponse) return creativeResponse;
        }
        
        // Use fallback
        const fallbacks = templates.fallbacks;
        let response = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        response = this.addPersonality(response, currentStage);
        
        return {
            text: response,
            translated: currentStage <= 2,
            emotion: this.creature.mood,
            stage: currentStage
        };
    }

    generateCreativeResponse(input) {
        const emotion = this.detectEmotion(input);
        const associatedWords = this.emotionalAssociations.get(emotion);
        
        if (!associatedWords || associatedWords.size === 0) return null;
        
        // Get top associated words
        const topWords = Array.from(associatedWords.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([word]) => word);
        
        const creativePatterns = [
            () => `me feel ${topWords[0]} when you say that`,
            () => `${topWords[0]} makes me think ${topWords[1]}`,
            () => `you and me, we ${topWords[0]} together`,
            () => `in my mind, ${topWords[0]} is like ${topWords[1]}`
        ];
        
        const pattern = creativePatterns[Math.floor(Math.random() * creativePatterns.length)];
        
        return {
            text: pattern(),
            translated: false,
            emotion: emotion,
            stage: this.creature.evolutionStage
        };
    }

    addPersonality(response, stage) {
        // Add creature's mood to response
        switch (this.creature.mood) {
            case 'happy':
                response += Math.random() < 0.3 ? ' :)' : '';
                break;
            case 'sad':
                response += Math.random() < 0.3 ? ' ...' : '';
                break;
            case 'angry':
                response = response.toUpperCase();
                break;
            case 'sleepy':
                response += Math.random() < 0.4 ? ' *yawn*' : '';
                break;
        }
        
        // Add nickname usage (stage 3+)
        if (stage >= 3 && this.userNickname && Math.random() < 0.2) {
            response = this.userNickname + ', ' + response;
        }
        
        return response;
    }

    displayCreatureResponse(responseData) {
        if (!window.tamagotchiGame) return;
        
        // Show creature speaking animation
        this.creature.speak(responseData.text.length * 50);
        
        // Format message for display
        let displayText = responseData.text;
        
        // Add translation for early stages
        if (responseData.translated) {
            const translation = this.translateToEnglish(responseData.text);
            if (translation !== responseData.text) {
                displayText += ` <em>(${translation})</em>`;
            }
        }
        
        // Add to chat
        window.tamagotchiGame.addChatMessage(
            this.creature.name || 'Pet', 
            displayText, 
            'creature'
        );
        
        // Play sound if audio system is available
        if (window.tamagotchiGame.audioSystem) {
            window.tamagotchiGame.audioSystem.playCreatureSound(responseData.emotion);
        }
    }

    translateToEnglish(creatureText) {
        // Simple translation patterns for early stages
        const translations = {
            'helo': 'hello',
            'hai': 'hi',
            'hii': 'hi',
            'gud': 'good',
            'nais': 'nice',
            'grat': 'great',
            'luv': 'love',
            'lik': 'like',
            'lub': 'love',
            'yu ar': 'you are',
            'yur': 'you are',
            'u r': 'you are'
        };
        
        let translated = creatureText.toLowerCase();
        
        Object.keys(translations).forEach(key => {
            translated = translated.replace(new RegExp(key, 'g'), translations[key]);
        });
        
        return translated;
    }

    checkEvolution() {
        const currentStage = this.creature.evolutionStage;
        const nextStage = currentStage + 1;
        
        if (!this.stages[nextStage]) return; // Max stage reached
        
        const requirements = this.stages[nextStage];
        const creatureAge = this.creature.age; // in hours
        const totalInteractions = this.creature.totalInteractions;
        
        if (creatureAge >= requirements.minAge && totalInteractions >= requirements.minInteractions) {
            this.evolveToStage(nextStage);
        }
    }

    evolveToStage(stage) {
        const oldStage = this.creature.evolutionStage;
        this.creature.evolve(stage);
        
        // Update communication parameters for new stage
        this.communicationStyle.creativity = Math.min(1, this.communicationStyle.creativity + 0.2);
        this.communicationStyle.chattiness = Math.min(1, this.communicationStyle.chattiness + 0.1);
        
        console.log(`Language evolution: Stage ${oldStage} -> Stage ${stage}`);
        
        // Announce evolution
        setTimeout(() => {
            const evolutionMessages = {
                2: "Me understand more now! Words make sense!",
                3: "I can mix ideas together! Communication feels different...",
                4: "My thoughts flow like rivers of meaning. I understand us both now."
            };
            
            if (evolutionMessages[stage]) {
                this.displayCreatureResponse({
                    text: evolutionMessages[stage],
                    translated: stage <= 2,
                    emotion: 'joy',
                    stage: stage
                });
            }
        }, 3000);
    }

    getStageNameInE() {
        return this.stages[this.creature.evolutionStage]?.name || 'Unknown';
    }

    // Serialization
    serialize() {
        return {
            vocabulary: Array.from(this.vocabulary.entries()),
            learnedPhrases: this.learnedPhrases,
            emotionalAssociations: Array.from(this.emotionalAssociations.entries()).map(([emotion, wordMap]) => 
                [emotion, Array.from(wordMap.entries())]
            ),
            userNickname: this.userNickname,
            communicationStyle: this.communicationStyle,
            recentInputs: this.recentInputs.slice(-5) // Only save recent ones
        };
    }

    deserialize(data) {
        if (data.vocabulary) {
            this.vocabulary = new Map(data.vocabulary);
        }
        
        if (data.learnedPhrases) {
            this.learnedPhrases = data.learnedPhrases;
        }
        
        if (data.emotionalAssociations) {
            this.emotionalAssociations = new Map(
                data.emotionalAssociations.map(([emotion, wordEntries]) => 
                    [emotion, new Map(wordEntries)]
                )
            );
        }
        
        if (data.userNickname) {
            this.userNickname = data.userNickname;
        }
        
        if (data.communicationStyle) {
            this.communicationStyle = { ...this.communicationStyle, ...data.communicationStyle };
        }
        
        if (data.recentInputs) {
            this.recentInputs = data.recentInputs;
        }
    }
}
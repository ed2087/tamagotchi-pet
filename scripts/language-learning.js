// LanguageLearning - Contextual language development through trial and error
class LanguageLearning {
    constructor(creature) {
        this.creature = creature;
        
        // Core language development
        this.vocabulary = new Map(); // creature's invented words
        this.contextualLearning = new Map(); // word -> user reaction patterns
        this.speechAttempts = []; // history of what creature said and what happened
        this.thoughtQueue = []; // things creature wants to express
        
        // Communication patterns
        this.communicationFrequency = 0.3; // how often creature talks (0-1)
        this.currentTopic = null;
        this.conversationMood = 'neutral';
        this.lastSpeechTime = 0;
        this.speechCooldown = 3000; // minimum time between speeches
        
        // Learning mechanics
        this.learningStage = 1;
        this.comprehensionLevel = 0;
        this.wordSuccessRates = new Map(); // track which words work
        this.toneMemory = new Map(); // remember user tone responses
        
        // Personality-driven speech
        this.personality = this.generateSpeechPersonality();
        this.internalMonologue = [];
        
        this.init();
    }

    init() {
        this.generateBasicSounds();
        this.startSpontaneousSpeech();
        console.log('Contextual language learning system initialized');
    }

    generateSpeechPersonality() {
        return {
            chattiness: Math.random(), // 0 = quiet, 1 = very talkative
            boldness: Math.random(), // willingness to try new words
            attention_seeking: Math.random(), // how much it wants user focus
            emotional_expression: Math.random(), // how much it shows feelings
            curiosity: Math.random(), // asks questions vs makes statements
            repetition_tendency: Math.random() // repeats successful words
        };
    }

    generateBasicSounds() {
        const vowels = ['a', 'e', 'i', 'o', 'u', 'ah', 'oh', 'ee'];
        const consonants = ['b', 'd', 'g', 'k', 'l', 'm', 'n', 'p', 'r', 't', 'w', 'y'];
        
        const numSounds = 5 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < numSounds; i++) {
            const sound = this.createRandomSound(vowels, consonants);
            this.vocabulary.set(sound, {
                concept: 'unknown',
                successRate: 0,
                usageCount: 0,
                learnedAt: Date.now(),
                contexts: [],
                userReactions: []
            });
        }
    }

    createRandomSound(vowels, consonants) {
        const structures = ['CV', 'CVC', 'VC', 'CCV'];
        const structure = structures[Math.floor(Math.random() * structures.length)];
        
        let sound = '';
        for (let char of structure) {
            if (char === 'C') {
                sound += consonants[Math.floor(Math.random() * consonants.length)];
            } else {
                sound += vowels[Math.floor(Math.random() * vowels.length)];
            }
        }
        
        return sound;
    }

    // SPONTANEOUS SPEECH SYSTEM
    startSpontaneousSpeech() {
        setInterval(() => {
            this.attemptSpontaneousSpeech();
        }, 4000 + Math.random() * 6000); // Every 4-10 seconds
    }

    attemptSpontaneousSpeech() {
        if (!this.creature.isAlive) return;
        
        const currentTime = Date.now();
        
        // Check cooldown
        if (currentTime - this.lastSpeechTime < this.speechCooldown) return;
        
        // Calculate speech probability based on personality and state
        let speechChance = this.personality.chattiness * 0.2;
        
        // Increase chance based on creature state
        if (this.creature.hunger < 30) speechChance += 0.6; // hungry = more vocal
        if (this.creature.happiness > 80) speechChance += 0.4; // happy = more chatty
        if (this.creature.energy < 20) speechChance += 0.3; // tired = complains
        if (this.creature.health < 40) speechChance += 0.7; // sick = calls for help
        
        // Attention seeking behavior
        const timeSinceInteraction = currentTime - this.creature.lastInteraction;
        if (timeSinceInteraction > 60000) { // 1 minute without attention
            speechChance += 0.8;
        }
        
        if (Math.random() < speechChance) {
            this.generateSpontaneousThought();
        }
    }

    generateSpontaneousThought() {
        const currentTime = Date.now();
        let thoughtType = 'general';
        let intensity = 0.5;
        
        // Determine what creature wants to express
        if (this.creature.hunger < 30) {
            thoughtType = 'hungry';
            intensity = (30 - this.creature.hunger) / 30;
        } else if (this.creature.health < 40) {
            thoughtType = 'sick';
            intensity = (40 - this.creature.health) / 40;
        } else if (this.creature.energy < 20) {
            thoughtType = 'tired';
            intensity = (20 - this.creature.energy) / 20;
        } else if (this.creature.happiness > 80) {
            thoughtType = 'happy';
            intensity = (this.creature.happiness - 80) / 20;
        } else if (currentTime - this.creature.lastInteraction > 120000) {
            thoughtType = 'lonely';
            intensity = Math.min(1.0, (currentTime - this.creature.lastInteraction) / 300000);
        }
        
        this.expressThought(thoughtType, intensity);
    }

    expressThought(thoughtType, intensity) {
        const currentTime = Date.now();
        let wordsToUse = [];
        
        // Find words creature knows for this concept
        const conceptWords = this.findWordsForConcept(thoughtType);
        
        if (conceptWords.length > 0) {
            // Use existing words that have worked before
            wordsToUse = conceptWords.slice(0, Math.min(2, Math.floor(intensity * 3) + 1));
        } else {
            // Create new word for this feeling
            const newWord = this.inventWordForFeeling(thoughtType);
            wordsToUse = [newWord];
            
            this.vocabulary.set(newWord, {
                concept: thoughtType,
                successRate: 0,
                usageCount: 0,
                learnedAt: currentTime,
                contexts: [thoughtType],
                userReactions: []
            });
        }
        
        // Construct speech
        let speech = this.constructSpeech(wordsToUse, intensity);
        
        // Add repetition for urgency
        if (intensity > 0.7) {
            speech = speech + ' ' + speech; // repeat for urgency
        }
        
        // Say it out loud and in chat
        this.saySpeechy(speech, thoughtType, intensity);
        
        // Track this speech attempt
        this.trackSpeechAttempt(speech, thoughtType, intensity, currentTime);
        
        this.lastSpeechTime = currentTime;
    }

    findWordsForConcept(concept) {
        const words = [];
        this.vocabulary.forEach((data, word) => {
            if (data.concept === concept || data.contexts.includes(concept)) {
                words.push({
                    word: word,
                    successRate: data.successRate,
                    data: data
                });
            }
        });
        
        // Sort by success rate - use words that have worked before
        return words
            .sort((a, b) => b.successRate - a.successRate)
            .map(item => item.word);
    }

    inventWordForFeeling(feeling) {
        const soundPatterns = {
            hungry: () => 'g' + this.pickRandom(['ra', 'ro', 'ru']) + this.pickRandom(['k', 'm', 'b']),
            happy: () => this.pickRandom(['yi', 'wi', 'pi']) + this.pickRandom(['mi', 'ha', 'ya']),
            sad: () => this.pickRandom(['oo', 'ah', 'uh']) + this.pickRandom(['wa', 'ma', 'na']),
            tired: () => this.pickRandom(['zzz', 'meh', 'ugh']) + this.pickRandom(['', 'a', 'o']),
            sick: () => this.pickRandom(['ick', 'ugh', 'bleh']) + this.pickRandom(['', 'y', 'i']),
            lonely: () => this.pickRandom(['hey', 'hel', 'loo']) + this.pickRandom(['o', 'p', '']),
            general: () => this.pickRandom(['ba', 'ma', 'da', 'wa']) + this.pickRandom(['ba', 'ma', 'ya'])
        };
        
        const generator = soundPatterns[feeling] || soundPatterns.general;
        return generator();
    }

    constructSpeech(words, intensity) {
        if (words.length === 0) return 'meh';
        
        let speech = words[0];
        
        // Add additional words based on learning stage and intensity
        if (this.learningStage >= 2 && words.length > 1) {
            speech += ' ' + words[1];
        }
        
        // Add emotional modifiers
        if (intensity > 0.8) {
            speech += '!';
        } else if (intensity < 0.3) {
            speech += '...';
        }
        
        return speech;
    }

    saySpeechy(speech, context, intensity) {
        // Display in chat
        if (window.tamagotchiGame) {
            window.tamagotchiGame.addChatMessage(
                this.creature.name || 'Pet', 
                speech, 
                'creature'
            );
        }
        
        // Speak out loud
        if (window.tamagotchiGame && window.tamagotchiGame.audioSystem) {
            let emotion = this.mapContextToEmotion(context);
            
            window.tamagotchiGame.audioSystem.speakText(
                speech, 
                emotion, 
                this.learningStage
            );
            
            window.tamagotchiGame.audioSystem.playCreatureSound(emotion);
        }
        
        // Visual speaking animation
        this.creature.speak(speech.length * 150);
    }

    mapContextToEmotion(context) {
        const emotionMap = {
            hungry: 'sad',
            happy: 'happy',
            sad: 'sad',
            tired: 'sleepy',
            sick: 'sad',
            lonely: 'sad',
            excited: 'happy',
            angry: 'angry'
        };
        
        return emotionMap[context] || 'neutral';
    }

    trackSpeechAttempt(speech, context, intensity, timestamp) {
        const attemptId = Date.now() + Math.random();
        
        this.speechAttempts.push({
            id: attemptId,
            speech: speech,
            context: context,
            intensity: intensity,
            timestamp: timestamp,
            userReaction: null,
            reactionTime: null,
            success: null
        });
        
        // Start watching for user reaction
        this.startReactionTimer(attemptId);
        
        // Keep only recent attempts
        if (this.speechAttempts.length > 50) {
            this.speechAttempts = this.speechAttempts.slice(-30);
        }
    }

    startReactionTimer(attemptId) {
        // Watch for user reaction for 10 seconds
        setTimeout(() => {
            this.evaluateSpeechAttempt(attemptId);
        }, 10000);
    }

    // USER REACTION TRACKING
    recordUserAction(actionType, timestamp) {
        // Find recent speech attempts that haven't been evaluated
        const recentAttempts = this.speechAttempts.filter(attempt => 
            !attempt.userReaction && 
            timestamp - attempt.timestamp < 10000 && 
            timestamp > attempt.timestamp
        );
        
        // Record reaction for the most recent attempt
        if (recentAttempts.length > 0) {
            const attempt = recentAttempts[recentAttempts.length - 1];
            attempt.userReaction = actionType;
            attempt.reactionTime = timestamp - attempt.timestamp;
            
            // Immediate evaluation if reaction is clear
            if (['feed', 'play', 'pet', 'ignore'].includes(actionType)) {
                this.evaluateSpeechAttempt(attempt.id);
            }
        }
    }

    recordUserReaction(actionType, timestamp, isPositive) {
        this.recordUserAction(actionType, timestamp);
        
        // Learn broader behavioral patterns
        if (isPositive) {
            this.communicationFrequency = Math.min(1.0, this.communicationFrequency + 0.1);
        } else {
            this.communicationFrequency = Math.max(0.1, this.communicationFrequency - 0.05);
        }
    }

    evaluateSpeechAttempt(attemptId) {
        const attempt = this.speechAttempts.find(a => a.id === attemptId);
        if (!attempt || attempt.success !== null) return;
        
        let success = false;
        let learningValue = 0;
        
        // Evaluate success based on context and user reaction
        if (attempt.context === 'hungry' && attempt.userReaction === 'feed') {
            success = true;
            learningValue = 0.3;
        } else if (attempt.context === 'happy' && ['pet', 'play'].includes(attempt.userReaction)) {
            success = true;
            learningValue = 0.2;
        } else if (attempt.context === 'lonely' && attempt.userReaction !== 'ignore') {
            success = true;
            learningValue = 0.25;
        } else if (attempt.context === 'sick' && attempt.userReaction === 'medicine') {
            success = true;
            learningValue = 0.4;
        } else if (attempt.userReaction === 'ignore' || attempt.reactionTime > 8000) {
            success = false;
            learningValue = -0.1;
        } else if (attempt.userReaction === 'pet') {
            success = true;
            learningValue = 0.1;
        }
        
        attempt.success = success;
        
        // Update vocabulary based on success/failure
        this.updateVocabularyFromAttempt(attempt, learningValue);
    }

updateVocabularyFromAttempt(attempt, learningValue) {
       const words = attempt.speech.split(' ');
       
       words.forEach(word => {
           if (this.vocabulary.has(word)) {
               const wordData = this.vocabulary.get(word);
               
               // Update success rate
               const totalAttempts = wordData.usageCount + 1;
               const previousSuccess = wordData.successRate * wordData.usageCount;
               wordData.successRate = (previousSuccess + (learningValue > 0 ? 1 : 0)) / totalAttempts;
               wordData.usageCount = totalAttempts;
               
               // Update concept understanding
               if (learningValue > 0.2) {
                   wordData.concept = attempt.context; // successful context becomes meaning
                   wordData.contexts.push(attempt.context);
               }
               
               // Record user reaction pattern
               wordData.userReactions.push({
                   reaction: attempt.userReaction,
                   reactionTime: attempt.reactionTime,
                   success: attempt.success,
                   timestamp: attempt.timestamp
               });
               
               // Strengthen or weaken word
               if (learningValue > 0) {
                   this.reinforceWord(word);
               } else {
                   this.weakenWord(word);
               }
           }
       });
   }

   reinforceWord(word) {
       const wordData = this.vocabulary.get(word);
       if (!wordData) return;
       
       wordData.strength = Math.min(1.0, (wordData.strength || 0.5) + 0.15);
       
       if (wordData.successRate > 0.7 && wordData.usageCount > 3) {
           wordData.priority = 'high';
       }
   }

   weakenWord(word) {
       const wordData = this.vocabulary.get(word);
       if (!wordData) return;
       
       wordData.strength = Math.max(0.1, (wordData.strength || 0.5) - 0.1);
       
       if (wordData.successRate < 0.2 && wordData.usageCount > 5) {
           this.vocabulary.delete(word);
       }
   }

   // USER INPUT PROCESSING
   processUserInput(input, type = 'text') {
       console.log(`Processing user input: "${input}"`);
       
       const userTone = this.detectUserTone(input);
       const userEmotion = this.detectUserEmotion(input);
       
       this.recordUserAttention(Date.now());
       
       setTimeout(() => {
           this.respondToUser(input, userTone, userEmotion);
       }, 500 + Math.random() * 1500);
       
       this.learnFromUserInput(input, userTone, userEmotion);
   }

   detectUserTone(input) {
       const indicators = {
           happy: ['!', 'good', 'great', 'awesome', 'love', 'yes', 'yay'],
           angry: ['bad', 'no', 'stop', 'shut', 'stupid', 'hate', 'angry'],
           sad: ['sad', 'sorry', 'hurt', 'cry', 'miss'],
           excited: ['wow', 'amazing', 'incredible', '!!', 'omg'],
           gentle: ['please', 'thank', 'sweet', 'cute', 'love'],
           harsh: ['shut up', 'stupid', 'dumb', 'annoying']
       };
       
       const inputLower = input.toLowerCase();
       
       for (let [tone, keywords] of Object.entries(indicators)) {
           for (let keyword of keywords) {
               if (inputLower.includes(keyword)) {
                   return tone;
               }
           }
       }
       
       return 'neutral';
   }

   detectUserEmotion(input) {
       const patterns = {
           praise: /good|great|awesome|amazing|wonderful|perfect|smart|clever/i,
           scold: /bad|no|stop|wrong|stupid|shut/i,
           question: /\?|what|who|where|when|why|how/i,
           command: /go|come|sit|stay|do|get/i,
           affection: /love|cute|sweet|adorable|precious/i
       };
       
       for (let [emotion, pattern] of Object.entries(patterns)) {
           if (pattern.test(input)) {
               return emotion;
           }
       }
       
       return 'neutral';
   }

   respondToUser(input, userTone, userEmotion) {
       let responseContext = 'social_response';
       let intensity = 0.5;
       
       if (userTone === 'happy' || userEmotion === 'praise') {
           responseContext = 'happy';
           intensity = 0.8;
           this.creature.addHappiness(10);
       } else if (userTone === 'angry' || userEmotion === 'scold') {
           responseContext = 'sad';
           intensity = 0.9;
           this.creature.addHappiness(-15);
       } else if (userEmotion === 'affection') {
           responseContext = 'love';
           intensity = 0.9;
           this.creature.addHappiness(15);
       } else if (userEmotion === 'question') {
           responseContext = 'confused';
           intensity = 0.6;
       }
       
       this.expressThought(responseContext, intensity);
   }

   learnFromUserInput(input, userTone, userEmotion) {
       const words = input.toLowerCase().split(' ');
       
       words.forEach(userWord => {
           if (userWord.length > 2) {
               if (!this.toneMemory.has(userWord)) {
                   this.toneMemory.set(userWord, {
                       positiveCount: 0,
                       negativeCount: 0,
                       contexts: []
                   });
               }
               
               const memory = this.toneMemory.get(userWord);
               
               if (['happy', 'gentle', 'affection', 'praise'].includes(userTone) || 
                   ['praise', 'affection'].includes(userEmotion)) {
                   memory.positiveCount++;
               } else if (['angry', 'harsh'].includes(userTone) || 
                         ['scold'].includes(userEmotion)) {
                   memory.negativeCount++;
               }
               
               memory.contexts.push({
                   tone: userTone,
                   emotion: userEmotion,
                   timestamp: Date.now()
               });
           }
       });
   }

   recordUserAttention(timestamp) {
       this.thoughtQueue = this.thoughtQueue.filter(thought => thought.type !== 'want_attention');
       this.creature.addHappiness(3);
       this.creature.lastInteraction = timestamp;
   }

   update(currentTime) {
       // Update learning stage based on age and interactions
       this.updateLearningStage();
       
       // Process thought queue
       this.processThoughtQueue(currentTime);
   }

   updateLearningStage() {
       const age = this.creature.age;
       const interactions = this.creature.totalInteractions;
       const vocabularySize = this.vocabulary.size;
       
       let targetStage = 1;
       if (age > 0.5 && interactions > 3) targetStage = 2;
       if (age > 2 && interactions > 10 && vocabularySize > 3) targetStage = 3;
       if (age > 8 && interactions > 25 && vocabularySize > 8) targetStage = 4;
       
       if (targetStage > this.learningStage) {
           this.learningStage = targetStage;
           console.log(`Language stage evolved to: ${targetStage}`);
       }
   }

   processThoughtQueue(currentTime) {
       // Express urgent thoughts
       const urgentThoughts = this.thoughtQueue.filter(thought => 
           thought.urgency > 0.6 && 
           currentTime - thought.timestamp < 30000
       );
       
       if (urgentThoughts.length > 0 && currentTime - this.lastSpeechTime > this.speechCooldown) {
           const thought = urgentThoughts[0];
           this.expressThought(thought.type, thought.urgency);
           
           // Remove expressed thought
           this.thoughtQueue = this.thoughtQueue.filter(t => t !== thought);
       }
   }

   pickRandom(array) {
       return array[Math.floor(Math.random() * array.length)];
   }

   getStageName() {
       const stages = {
           1: 'Babbling',
           2: 'First Words', 
           3: 'Simple Speech',
           4: 'Complex Language'
       };
       return stages[Math.floor(this.learningStage)] || 'Unknown';
   }

   serialize() {
       return {
           vocabulary: Array.from(this.vocabulary.entries()),
           contextualLearning: Array.from(this.contextualLearning.entries()),
           speechAttempts: this.speechAttempts.slice(-20),
           learningStage: this.learningStage,
           personality: this.personality,
           communicationFrequency: this.communicationFrequency,
           toneMemory: Array.from(this.toneMemory.entries())
       };
   }

   deserialize(data) {
       if (data.vocabulary) this.vocabulary = new Map(data.vocabulary);
       if (data.contextualLearning) this.contextualLearning = new Map(data.contextualLearning);
       if (data.speechAttempts) this.speechAttempts = data.speechAttempts;
       if (data.learningStage) this.learningStage = data.learningStage;
       if (data.personality) this.personality = data.personality;
       if (data.communicationFrequency) this.communicationFrequency = data.communicationFrequency;
       if (data.toneMemory) this.toneMemory = new Map(data.toneMemory);
   }
}
// AdvancedLanguageLearning - sophisticated language acquisition with cognitive integration
class AdvancedLanguageLearning {
    constructor(creature) {
        this.creature = creature;
        
        // Core language development
        this.vocabulary = new Map(); // word -> linguistic data
        this.grammarRules = new Map(); // discovered grammar patterns
        this.pragmaticKnowledge = new Map(); // social context understanding
        this.semanticNetwork = new Map(); // meaning relationships
        
        // Communication system 
        this.communicationGoals = []; // what creature wants to express
        this.thoughtQueue = [];
        this.conversationContext = null; // current conversation state
        this.speechPlanning = []; // planned utterances
        this.speechAttempts = [];
        this.responseGeneration = new ResponseGenerator(this);
        
        // Learning mechanisms
        this.learningStage = 1; // 1-5: babbling -> complex language
        this.comprehensionLevel = 0.1; // understanding of human language
        this.productionAbility = 0.1; // ability to generate language
        this.socialAwareness = 0.3; // understanding social context
        
        // Cognitive integration
        this.entityManager = null;
        this.conceptualMemory = null;
        this.cognitiveProcessor = null;
        
        // Language personality
        this.communicationStyle = this.generateCommunicationStyle();
        this.languagePersonality = this.generateLanguagePersonality();
        
        // Processing state
        this.currentlyProcessing = false;
        this.lastSpeechTime = 0;
        // Random between 20s and 40s
        this.speechCooldown = 10000 + Math.floor(Math.random() * 20000);


        
        this.init();
    }

    init() {
        this.initializeBasicVocabulary();
        this.startLanguageProcessing();
        console.log('Advanced Language Learning system initialized');
    }

    // COGNITIVE SYSTEM INTEGRATION
    setCognitiveComponents(entityManager, conceptualMemory, cognitiveProcessor) {
        this.entityManager = entityManager;
        this.conceptualMemory = conceptualMemory;
        this.cognitiveProcessor = cognitiveProcessor;
        
        // Register for cognitive events
        this.setupCognitiveEventHandlers();
    }

    setupCognitiveEventHandlers() {
        // Listen for new concepts being formed
        if (this.conceptualMemory) {
            this.conceptualMemory.onConceptFormed = (concept) => {
                this.learnConceptualVocabulary(concept);
            };
        }
        
        // Listen for hypothesis confirmations
        if (this.cognitiveProcessor) {
            this.cognitiveProcessor.onHypothesisConfirmed = (hypothesis) => {
                this.integrateConfirmedLanguageRule(hypothesis);
            };
        }
    }

    // Add this method to the AdvancedLanguageLearning class:
    update(currentTime) {
        // Update learning stage based on age and interactions
        this.updateLearningStage();
        
        // Process thought queue
        this.processThoughtQueue(currentTime);
        
        // Update communication goals
        this.processCommunicationGoals();
        
        // Decay unused vocabulary
        this.performLanguageMaintenance();
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

    // LANGUAGE PERSONALITY GENERATION
    generateCommunicationStyle() {
        const creature = this.creature;
        return {
            verbosity: 0.3 + creature.personalityTraits.extraversion * 0.7,
            formality: 0.1 + creature.personalityTraits.conscientiousness * 0.4,
            emotiveness: 0.2 + creature.personalityTraits.neuroticism * 0.6,
            directness: 0.4 + (1 - creature.personalityTraits.agreeableness) * 0.6,
            playfulness: creature.personalityTraits.playfulness || 0.5,
            questionAsking: 0.2 + creature.personalityTraits.curiosity * 0.8
        };
    }

    // Add this method to AdvancedLanguageLearning class:
    processCommunicationGoals() {
        // Process pending communication goals
        if (this.communicationGoals.length === 0) return;
        
        // Sort goals by priority
        this.communicationGoals.sort((a, b) => b.priority - a.priority);
        
        // Process highest priority goal
        const goal = this.communicationGoals[0];
        if (Date.now() - goal.timestamp < 30000) { // Goal is fresh (less than 30 seconds old)
            this.processGoal(goal);
            
            // Remove processed goal
            this.communicationGoals = this.communicationGoals.filter(g => g.id !== goal.id);
        }
        
        // Clean up old goals
        this.communicationGoals = this.communicationGoals.filter(g => 
            Date.now() - g.timestamp < 300000 // Keep goals for 5 minutes
        );
    }

    processGoal(goal) {
        switch (goal.type) {
            case 'express_need':
                this.expressThought(goal.needType, goal.urgency);
                break;
            case 'respond_to_input':
                // Goal already processed during input handling
                break;
            case 'social_interaction':
                this.expressThought('social', goal.intensity || 0.5);
                break;
            default:
                console.log('Unknown communication goal type:', goal.type);
        }
    }

    // Also add this method to handle spontaneous speech:
    generateSpontaneousSpeech() {
        if (Date.now() - this.lastSpeechTime < this.speechCooldown) return;
        
        // Determine what the creature wants to express spontaneously
        const thoughtType = this.determineSpontaneousThoughtType();
        const intensity = this.calculateSpontaneousIntensity(thoughtType);
        
        this.expressThought(thoughtType, intensity);
    }

    determineSpontaneousThoughtType() {
        // Choose based on creature's current state
        if (this.creature.hunger < 30) return 'hungry';
        if (this.creature.health < 40) return 'sick';  
        if (this.creature.energy < 20) return 'tired';
        if (this.creature.mood === 'lonely') return 'lonely';
        if (this.creature.mood === 'happy') return 'happy';
        
        return 'general';
    }

    calculateSpontaneousIntensity(thoughtType) {
        const intensityMap = {
            'hungry': Math.min(1.0, (50 - this.creature.hunger) / 50),
            'sick': Math.min(1.0, (50 - this.creature.health) / 50),
            'tired': Math.min(1.0, (30 - this.creature.energy) / 30),
            'lonely': 0.7,
            'happy': 0.6,
            'general': 0.4
        };
        
        return Math.max(0.1, intensityMap[thoughtType] || 0.4);
    }

    generateLanguagePersonality() {
        return {
            preferredSoundPatterns: this.generateSoundPreferences(),
            semanticBiases: this.generateSemanticBiases(),
            syntacticTendencies: this.generateSyntacticTendencies(),
            pragmaticStyle: this.generatePragmaticStyle()
        };
    }

    generateSoundPreferences() {
        // Creature develops preferences for certain sounds based on personality
        const sounds = ['soft', 'sharp', 'melodic', 'rhythmic', 'breathy', 'crisp'];
        const preferences = {};
        
        sounds.forEach(sound => {
            preferences[sound] = Math.random();
        });
        
        // Adjust based on personality
        if (this.creature.personalityTraits.agreeableness > 0.6) {
            preferences['soft'] += 0.3;
            preferences['melodic'] += 0.2;
        }
        if (this.creature.aggressionLevel > 40) {
            preferences['sharp'] += 0.4;
            preferences['crisp'] += 0.3;
        }
        
        return preferences;
    }

    generateSemanticBiases() {
        // What kinds of meanings the creature gravitates toward
        return {
            emotionFocus: 0.3 + this.creature.personalityTraits.neuroticism * 0.5,
            socialFocus: 0.2 + this.creature.personalityTraits.extraversion * 0.6,
            actionFocus: 0.4 + this.creature.personalityTraits.conscientiousness * 0.4,
            abstractionLevel: Math.min(0.8, this.learningStage * 0.15 + 0.1)
        };
    }

    generateSyntacticTendencies() {
        // Grammar patterns the creature tends toward
        return {
            wordOrder: Math.random() > 0.5 ? 'SOV' : 'SVO',
            questionMarking: Math.random() > 0.5 ? 'intonation' : 'particle',
            negationStyle: Math.random() > 0.5 ? 'prefix' : 'separate_word',
            repetitionTendency: 0.1 + this.creature.personalityTraits.neuroticism * 0.4
        };
    }

    generatePragmaticStyle() {
        // How creature uses language socially
        return {
            politenessLevel: 0.3 + this.creature.personalityTraits.agreeableness * 0.5,
            attentionSeeking: 0.2 + (1 - this.creature.personalityTraits.independence) * 0.6,
            cooperativeness: 0.4 + this.creature.personalityTraits.agreeableness * 0.4,
            assertiveness: 0.3 + (1 - this.creature.personalityTraits.agreeableness) * 0.5
        };
    }

    // VOCABULARY DEVELOPMENT
    initializeBasicVocabulary() {
        // Start with proto-language sounds
        const protoSounds = this.generateProtoLanguage();
        
        for (let sound of protoSounds) {
            this.vocabulary.set(sound, {
                phonology: sound,
                meanings: [], // will be learned through interaction
                usageContexts: [],
                successRate: 0.0,
                acquisitionDate: Date.now(),
                strength: 0.3,
                semanticConnections: [],
                pragmaticUses: []
            });
        }
    }

    generateProtoLanguage() {
        const vowels = ['a', 'e', 'i', 'o', 'u', 'eh', 'oh', 'ah'];
        const consonants = ['m', 'n', 'p', 'b', 't', 'd', 'k', 'g', 'l', 'r', 'w', 'y'];
        const sounds = [];
        
        // Generate basic sound inventory based on creature's sound preferences
        const soundCount = 8 + Math.floor(Math.random() * 7); // 8-15 initial sounds
        
        for (let i = 0; i < soundCount; i++) {
            let sound = '';
            
            // Different phonological structures
            const structures = ['V', 'CV', 'VC', 'CVC', 'CVV'];
            const structure = structures[Math.floor(Math.random() * structures.length)];
            
            for (let phoneme of structure) {
                if (phoneme === 'C') {
                    sound += consonants[Math.floor(Math.random() * consonants.length)];
                } else {
                    sound += vowels[Math.floor(Math.random() * vowels.length)];
                }
            }
            
            // Apply sound preferences
            if (this.shouldKeepSound(sound)) {
                sounds.push(sound);
            }
        }
        
        return sounds;
    }

    generatePlayfulBehavior() {
    const playfulSounds = this.getHighEnergyVocalizations();
    return {
        text: playfulSounds + '! ' + playfulSounds + '!',
        confidence: 0.7,
        expectedReaction: 'attention'
    };
}
//addSemanticConnection
generateSadAppeal() {
    const sadSounds = this.getSoftVocalizations();
    return {
        text: sadSounds + '? ' + sadSounds + '...',
        confidence: 0.6,
        expectedReaction: 'comfort'
    };
}

generateAttentionGetting() {
    const attentionSounds = ['hey', 'pst', 'ahem', 'yooo'];
    const sound = attentionSounds[Math.floor(Math.random() * attentionSounds.length)];
    return {
        text: sound + '! ' + sound + '!',
        confidence: 0.8,
        expectedReaction: 'attention'
    };
}

generateMildComplaint() {
    const complaintSounds = this.getAggressiveVocalizations();
    return {
        text: complaintSounds + '...',
        confidence: 0.5,
        expectedReaction: 'attention'
    };
}

generateWithdrawal() {
    const withdrawalSounds = this.getSoftVocalizations();
    return {
        text: withdrawalSounds + '...',
        confidence: 0.3,
        expectedReaction: 'concern'
    };
}

generateShyAcknowledgment() {
    const shySounds = this.getSoftVocalizations();
    return {
        text: shySounds + '... ' + this.generateBasicSound('happy').text,
        confidence: 0.4,
        expectedReaction: 'gentle'
    };
}

generateProudResponse() {
    const proudSounds = this.getHighEnergyVocalizations();
    return {
        text: proudSounds + '! ' + proudSounds + '!',
        confidence: 0.9,
        expectedReaction: 'positive'
    };
}

generateCautiousResponse() {
    const cautiousSounds = this.getSoftVocalizations();
    return {
        text: cautiousSounds + '?',
        confidence: 0.3,
        expectedReaction: 'patience'
    };
}

generateFriendlyResponse(analysis) {
    const friendlySounds = this.getHighEnergyVocalizations();
    return {
        text: friendlySounds + '! ' + this.generateBasicSound('happy').text,
        confidence: 0.7,
        expectedReaction: 'positive'
    };
}

generateSubtleHint(goal) {
    const hintSounds = this.getSoftVocalizations();
    return {
        text: hintSounds + '... ' + hintSounds + '?',
        confidence: 0.4,
        expectedReaction: 'understanding'
    };
}

generateDramaticExpression(goal) {
    const dramaticSounds = this.getAggressiveVocalizations();
    return {
        text: dramaticSounds + '! ' + dramaticSounds + '! ' + dramaticSounds + '!',
        confidence: 0.9,
        expectedReaction: 'immediate_action'
    };
}

generateEmotionalDeflection() {
    const emotionalSounds = this.getSoftVocalizations();
    return {
        text: emotionalSounds + '... ' + this.generateBasicSound('confused').text,
        confidence: 0.3,
        expectedReaction: 'redirection'
    };
}

    shouldKeepSound(sound) {
        // Filter sounds based on creature's phonological preferences
        const preferences = this.languagePersonality.preferredSoundPatterns;
        
        if (sound.includes('p') || sound.includes('k')) {
            return preferences['sharp'] > 0.4;
        }
        if (sound.includes('l') || sound.includes('r')) {
            return preferences['melodic'] > 0.3;
        }
        if (sound.includes('m') || sound.includes('n')) {
            return preferences['soft'] > 0.4;
        }
        
        return true; // default acceptance
    }

    // Add this method to the AdvancedLanguageLearning class:
    updateVocabularyFromAttempt(attempt, learningValue) {
        if (!attempt.response || !attempt.response.text) return;
        
        // Extract words from the response
        const words = attempt.response.text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
        
        for (let word of words) {
            if (this.vocabulary.has(word)) {
                const wordData = this.vocabulary.get(word);
                
                // Update success rate
                const totalAttempts = (wordData.usageCount || 0) + 1;
                const previousSuccesses = (wordData.successRate || 0) * (wordData.usageCount || 0);
                const newSuccesses = previousSuccesses + (learningValue > 0 ? 1 : 0);
                
                wordData.successRate = newSuccesses / totalAttempts;
                wordData.usageCount = totalAttempts;
                
                // Update strength based on learning value
                if (learningValue > 0) {
                    wordData.strength = Math.min(1.0, (wordData.strength || 0.5) + Math.abs(learningValue));
                } else {
                    wordData.strength = Math.max(0.1, (wordData.strength || 0.5) - Math.abs(learningValue));
                }
                
                // Record usage context
                if (!wordData.usageContexts) {
                    wordData.usageContexts = [];
                }
                
                wordData.usageContexts.push({
                    attempt: attempt.goal?.type || 'unknown',
                    success: learningValue > 0,
                    timestamp: Date.now(),
                    learningValue: learningValue
                });
                
                // Keep only recent contexts (last 10)
                if (wordData.usageContexts.length > 10) {
                    wordData.usageContexts = wordData.usageContexts.slice(-10);
                }
                
                // Update the vocabulary
                this.vocabulary.set(word, wordData);
            } else {
                // New word learned from failed/successful attempt
                this.vocabulary.set(word, {
                    phonology: word,
                    meanings: [],
                    usageContexts: [{
                        attempt: attempt.goal?.type || 'unknown',
                        success: learningValue > 0,
                        timestamp: Date.now(),
                        learningValue: learningValue
                    }],
                    successRate: learningValue > 0 ? 1.0 : 0.0,
                    acquisitionDate: Date.now(),
                    strength: Math.max(0.1, 0.3 + learningValue),
                    semanticConnections: [],
                    pragmaticUses: [],
                    usageCount: 1
                });
            }
        }
    }

    assessPoliteness(input) {
        const politeWords = ['please', 'thank you', 'thanks', 'excuse me', 'sorry'];
        const rudeWords = ['stupid', 'idiot', 'shut up', 'dumb', 'hate', 'noob'];

        const inputLower = input.toLowerCase();
        let score = 0;

        for (const word of politeWords) {
            if (inputLower.includes(word)) score += 1;
        }

        for (const word of rudeWords) {
            if (inputLower.includes(word)) score -= 1;
        }

        const total = politeWords.length + rudeWords.length;
        const normalized = Math.max(-1, Math.min(1, score / total)); // clamp between -1 and 1

        return {
            level: normalized,
            label: normalized > 0.3 ? 'polite'
                : normalized < -0.3 ? 'rude'
                : 'neutral'
        };
    }

    identifySyntacticPatterns(input) {
        const patterns = [];

        if (/\?$/.test(input)) {
            patterns.push({ type: 'interrogative', confidence: 0.8 });
        }

        if (/^(please\s|can you|could you)/i.test(input)) {
            patterns.push({ type: 'request', confidence: 0.7 });
        }

        if (/^[A-Z][^.?!]*[.?!]$/.test(input)) {
            patterns.push({ type: 'complete_sentence', confidence: 0.6 });
        }

        if (/[^a-zA-Z0-9\s]/.test(input)) {
            patterns.push({ type: 'punctuation_usage', confidence: 0.5 });
        }

        return patterns;
    }


    analyzeInformationStructure(input) {
        const structure = {
            topic: null,
            focus: null,
            background: null,
            givenInfo: [],
            newInfo: [],
            emphasis: []
        };
        
        // Identify topic (usually the subject or first significant noun/pronoun)
        const tokens = this.tokenizeInput(input);
        const firstNoun = tokens.find(token => this.isNoun(token));
        if (firstNoun) {
            structure.topic = firstNoun;
        }
        
        // Identify focus (stressed/emphasized information)
        // Look for capitalization, repeated words, exclamation marks
        if (input.includes('!')) {
            structure.emphasis.push({ type: 'exclamation', strength: 0.7 });
        }
        
        const uppercaseWords = input.match(/\b[A-Z][A-Z]+\b/g);
        if (uppercaseWords) {
            structure.emphasis.push({ type: 'capitalization', words: uppercaseWords, strength: 0.8 });
        }
        
        // Identify given vs new information
        // Given: pronouns, articles, previously mentioned concepts
        // New: proper nouns, unfamiliar words
        for (let token of tokens) {
            if (this.isPronoun(token) || ['the', 'this', 'that'].includes(token.toLowerCase())) {
                structure.givenInfo.push(token);
            } else if (!this.vocabulary.has(token) && token.length > 2) {
                structure.newInfo.push(token);
            }
        }
        
        // Identify focus based on word order and syntax
        if (tokens[0] && tokens[0] !== structure.topic) {
            structure.focus = tokens[0]; // fronted elements are often focused
        }
        
        return structure;
    }

    // Helper methods for analyzeInformationStructure
    isNoun(word) {
        // Simple heuristic - check if word is likely a noun
        const commonNouns = ['person', 'thing', 'place', 'time', 'way', 'day', 'man', 'woman', 'child', 'world', 'life', 'hand', 'part', 'eye', 'work', 'case', 'point', 'company', 'number', 'group', 'problem', 'fact'];
        return commonNouns.includes(word.toLowerCase()) || 
            /^[A-Z]/.test(word) || // Proper nouns
            this.vocabulary.has(word) && this.vocabulary.get(word).type === 'noun';
    }

    isPronoun(word) {
        const pronouns = ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs'];
        return pronouns.includes(word.toLowerCase());
    }


    // Add these methods to the AdvancedLanguageLearning class

    assessUnderstandingConfidence(input) {
        let confidence = 0.5; // baseline confidence
        
        // Factor 1: Known vs unknown words
        const words = this.tokenizeInput(input);
        const knownWords = this.identifyKnownWords(input);
        const unknownWords = this.identifyUnknownWords(input);
        
        if (words.length > 0) {
            const knownRatio = knownWords.length / words.length;
            confidence *= (0.3 + knownRatio * 0.7); // 30% base + 70% based on known words
        }
        
        // Factor 2: Grammar pattern recognition
        const syntacticPatterns = this.identifySyntacticPatterns(input);
        if (syntacticPatterns.length > 0) {
            const avgPatternConfidence = syntacticPatterns.reduce((sum, p) => sum + p.confidence, 0) / syntacticPatterns.length;
            confidence += avgPatternConfidence * 0.2;
        }
        
        // Factor 3: Intent recognition confidence
        const intent = this.inferIntent(input, {});
        confidence += intent.confidence * 0.3;
        
        // Factor 4: Sentence structure familiarity
        if (input.includes('?') && this.grammarRules.has('interrogative')) {
            confidence += 0.1;
        }
        if (input.match(/^[A-Z]/) && input.match(/[.!?]$/)) {
            confidence += 0.1; // complete sentence structure
        }
        
        return Math.min(1.0, Math.max(0.1, confidence));
    }

    assessInputNovelty(input) {
        let novelty = 0.0;
        
        // Check for completely unknown words
        const unknownWords = this.identifyUnknownWords(input);
        if (unknownWords.length > 0) {
            novelty += Math.min(0.5, unknownWords.length * 0.15);
        }
        
        // Check for new syntactic patterns
        const patterns = this.identifySyntacticPatterns(input);
        for (let pattern of patterns) {
            if (!this.grammarRules.has(pattern.type)) {
                novelty += 0.2;
            }
        }
        
        // Check for new concepts referenced
        const concepts = this.identifyReferencedConcepts(input);
        const newConcepts = concepts.filter(c => !this.conceptualMemory || !this.conceptualMemory.concepts.has(c.name));
        novelty += Math.min(0.3, newConcepts.length * 0.1);
        
        // Check for unusual sentence structure
        const words = this.tokenizeInput(input);
        if (words.length > 15) novelty += 0.1; // very long sentences
        if (words.length < 2) novelty += 0.05; // very short inputs
        
        // Check for new intent types
        const intent = this.inferIntent(input, {});
        if (intent.primary === 'unknown') {
            novelty += 0.2;
        }
        
        return Math.min(1.0, novelty);
    }

    assessInputComplexity(input) {
        let complexity = 0.0;
        
        const words = this.tokenizeInput(input);
        
        // Factor 1: Length complexity
        if (words.length > 10) complexity += 0.2;
        if (words.length > 20) complexity += 0.2;
        
        // Factor 2: Vocabulary complexity
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / Math.max(words.length, 1);
        if (avgWordLength > 6) complexity += 0.2;
        
        // Factor 3: Syntactic complexity
        const patterns = this.identifySyntacticPatterns(input);
        complexity += Math.min(0.3, patterns.length * 0.1);
        
        // Factor 4: Punctuation and structure
        const punctuationCount = (input.match(/[,.!?;:]/g) || []).length;
        if (punctuationCount > 2) complexity += 0.1;
        
        // Factor 5: Multiple clauses or sentences
        const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length > 1) complexity += 0.2;
        
        // Factor 6: Question complexity
        if (input.includes('?')) {
            const questionWords = ['what', 'why', 'how', 'when', 'where', 'who', 'which'];
            const questionWordCount = questionWords.filter(qw => input.toLowerCase().includes(qw)).length;
            if (questionWordCount > 1) complexity += 0.1;
        }
        
        // Factor 7: Entity and concept complexity
        const entities = this.extractEntities(input);
        const concepts = this.identifyReferencedConcepts(input);
        complexity += Math.min(0.2, (entities.length + concepts.length) * 0.05);
        
        return Math.min(1.0, complexity);
    }

    // Also add these helper methods that might be referenced elsewhere:

    analyzeSocialContext(input, context) {
        const socialContext = {
            formality: 'neutral',
            intimacy: 'neutral',
            authority: 'neutral',
            emotional_tone: 'neutral'
        };
        
        // Analyze formality
        const formalWords = ['please', 'thank you', 'excuse me', 'pardon', 'sir', 'madam'];
        const informalWords = ['hey', 'yeah', 'nah', 'gonna', 'wanna'];
        
        const formalCount = formalWords.filter(word => input.toLowerCase().includes(word)).length;
        const informalCount = informalWords.filter(word => input.toLowerCase().includes(word)).length;
        
        if (formalCount > informalCount) {
            socialContext.formality = 'formal';
        } else if (informalCount > formalCount) {
            socialContext.formality = 'informal';
        }
        
        // Analyze emotional tone from social perspective
        if (input.includes('!') || /[A-Z]{2,}/.test(input)) {
            socialContext.emotional_tone = 'excited';
        } else if (input.includes('?')) {
            socialContext.emotional_tone = 'curious';
        }
        
        return socialContext;
    }

    detectEmotionalTone(input) {
        const positiveWords = ['happy', 'great', 'good', 'awesome', 'love', 'like', 'wonderful', 'amazing'];
        const negativeWords = ['sad', 'bad', 'angry', 'hate', 'terrible', 'awful', 'horrible', 'upset'];
        const excitedWords = ['wow', 'exciting', 'fantastic', 'incredible', 'brilliant'];
        
        const positiveCount = positiveWords.filter(word => input.toLowerCase().includes(word)).length;
        const negativeCount = negativeWords.filter(word => input.toLowerCase().includes(word)).length;
        const excitedCount = excitedWords.filter(word => input.toLowerCase().includes(word)).length;
        
        if (excitedCount > 0 || input.includes('!')) {
            return { tone: 'excited', confidence: 0.7 };
        } else if (positiveCount > negativeCount) {
            return { tone: 'positive', confidence: 0.6 };
        } else if (negativeCount > positiveCount) {
            return { tone: 'negative', confidence: 0.6 };
        } else {
            return { tone: 'neutral', confidence: 0.5 };
        }
    }



    // ADVANCED INPUT PROCESSING
    processUserInput(input, type = 'text', context = {}) {
        if (this.currentlyProcessing) return;
        this.currentlyProcessing = true;
        
        console.log(`Processing user input: "${input}" (${type})`);
        
        // Multi-level analysis
        const analysis = this.analyzeInput(input, type, context);
        
        // Extract learning opportunities
        this.extractLearningOpportunities(analysis);
        
        // Update language understanding
        this.updateLanguageUnderstanding(analysis);
        
        // Plan response
        this.planResponse(analysis, context);
        
        this.currentlyProcessing = false;
        
        // Record interaction for learning
        this.recordLanguageInteraction(input, type, analysis, context);
    }

    analyzeInput(input, type, context) {
        return {
            // Lexical analysis
            words: this.tokenizeInput(input),
            unknownWords: this.identifyUnknownWords(input),
            knownWords: this.identifyKnownWords(input),
            
            // Semantic analysis
            entities: this.extractEntities(input),
            concepts: this.identifyReferencedConcepts(input),
            intent: this.inferIntent(input, context),
            
            // Pragmatic analysis
            socialContext: this.analyzeSocialContext(input, context),
            emotionalTone: this.detectEmotionalTone(input),
            politenessLevel: this.assessPoliteness(input),
            
            // Structural analysis
            syntacticPatterns: this.identifySyntacticPatterns(input),
            informationStructure: this.analyzeInformationStructure(input),
            
            // Meta-linguistic
            confidence: this.assessUnderstandingConfidence(input),
            novelty: this.assessInputNovelty(input),
            complexity: this.assessInputComplexity(input)
        };
    }

    tokenizeInput(input) {
        return input.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 0);
    }

    identifyUnknownWords(input) {
        const words = this.tokenizeInput(input);
        return words.filter(word => !this.vocabulary.has(word) && word.length > 1);
    }

    identifyKnownWords(input) {
        const words = this.tokenizeInput(input);
        return words.filter(word => this.vocabulary.has(word));
    }

    extractEntities(input) {
        const entities = [];
        
        // Use entity manager to identify people
        if (this.entityManager) {
            const personInfo = this.entityManager.extractPersonInfo(input);
            if (personInfo.name) {
                entities.push({
                    type: 'person',
                    value: personInfo.name,
                    relationship: personInfo.relationship
                });
            }
        }
        
        // Identify other entity types
        const pronouns = ['i', 'you', 'me', 'my', 'your'];
        for (let pronoun of pronouns) {
            if (input.toLowerCase().includes(pronoun)) {
                entities.push({
                    type: 'pronoun',
                    value: pronoun,
                    reference: this.resolvePronounReference(pronoun)
                });
            }
        }
        
        return entities;
    }

    resolvePronounReference(pronoun) {
        // Simple pronoun resolution
        const resolutions = {
            'i': 'speaker',
            'me': 'speaker',
            'my': 'speaker',
            'you': 'creature',
            'your': 'creature'
        };
        return resolutions[pronoun] || 'unknown';
    }

    identifyReferencedConcepts(input) {
        const concepts = [];
        
        if (this.conceptualMemory) {
            for (let [conceptName, concept] of this.conceptualMemory.concepts.entries()) {
                if (input.toLowerCase().includes(conceptName.toLowerCase())) {
                    concepts.push({
                        name: conceptName,
                        confidence: concept.strength || 0.5
                    });
                }
                
                // Check concept properties
                for (let property of concept.properties || []) {
                    if (input.toLowerCase().includes(property.toLowerCase())) {
                        concepts.push({
                            name: conceptName,
                            confidence: (concept.strength || 0.5) * 0.8,
                            via: property
                        });
                    }
                }
            }
        }
        
        return concepts;
    }

    inferIntent(input, context) {
        const intents = {
            greeting: /^(hi|hello|hey|good|morning|afternoon|evening)/i,
            question: /\?|what|how|why|when|where|who|can you|do you|are you/i,
            command: /^(go|come|sit|stay|stop|start|do|get|bring|take)/i,
            praise: /good|great|awesome|amazing|wonderful|perfect|smart|clever|nice/i,
            scold: /bad|no|stop|wrong|stupid|shut|quiet|behave/i,
            introduction: /my name is|i am|i'm|call me/i,
            affection: /love|cute|sweet|adorable|precious|like you|care about/i,
            information: /tell me|show me|explain|describe|what is|who is/i,
            farewell: /bye|goodbye|see you|talk later|going away/i
        };
        
        for (let [intentName, pattern] of Object.entries(intents)) {
            if (pattern.test(input)) {
                return {
                    primary: intentName,
                    confidence: this.calculateIntentConfidence(input, pattern)
                };
            }
        }
        
        return { primary: 'unknown', confidence: 0.1 };
    }

    calculateIntentConfidence(input, pattern) {
        const matches = input.match(pattern);
        return matches ? Math.min(0.9, matches.length * 0.3 + 0.4) : 0.1;
    }

    analyzeSocialContext(input, context) {
        return {
            speaker: context.speaker || 'unknown',
            relationship: this.determineRelationship(context.speaker),
            setting: context.setting || 'casual',
            previousTopic: this.conversationContext?.topic || null,
            emotionalContext: this.creature.mood,
            powerDynamics: this.assessPowerDynamics(context.speaker)
        };
    }

    determineRelationship(speaker) {
        if (this.entityManager && speaker) {
            const relationship = this.entityManager.getRelationshipSummary(speaker);
            return relationship?.relationship || 'unknown';
        }
        return 'unknown';
    }

    assessPowerDynamics(speaker) {
        // Creature generally views humans as having higher status initially
        if (this.creature.trustLevel > 80 && this.creature.attachmentLevel > 60) {
            return 'equal';
        }
        return 'human_dominant';
    }

    detectEmotionalTone(input) {
        const toneIndicators = {
            excited: /!/g,
            questioning: /\?/g,
            shouting: /[A-Z]{2,}/g,
            happy: /happy|joy|great|awesome|wonderful|love|like/i,
            sad: /sad|sorry|hurt|miss|cry|upset/i,
            angry: /angry|mad|furious|hate|stupid|shut up/i,
            gentle: /please|thank|sweet|soft|gentle|kind/i
        };
        
        const scores = {};
        for (let [tone, pattern] of Object.entries(toneIndicators)) {
            const matches = input.match(pattern);
            scores[tone] = matches ? matches.length : 0;
        }
        
        // Return dominant tone
        const maxTone = Object.keys(scores).reduce((a, b) => 
            scores[a] > scores[b] ? a : b);
        
        return {
            primary: maxTone,
            intensity: scores[maxTone],
            distribution: scores
        };
    }

    // LEARNING FROM INTERACTIONS
    extractLearningOpportunities(analysis) {
        // Learn new words
        for (let word of analysis.unknownWords) {
            this.learnNewWord(word, analysis);
        }
        
        // Learn syntactic patterns
        if (analysis.syntacticPatterns.length > 0) {
            this.learnSyntacticPatterns(analysis.syntacticPatterns);
        }
        
        // Learn pragmatic conventions
        this.learnPragmaticUse(analysis.intent, analysis.socialContext, analysis.emotionalTone);
        
        // Learn semantic relationships
        this.learnSemanticConnections(analysis.concepts, analysis.entities);
    }

    learnNewWord(word, analysis) {
        if (word.length < 2 || this.vocabulary.has(word)) return;
        
        const wordData = {
            phonology: word,
            meanings: this.inferWordMeaning(word, analysis),
            usageContexts: [analysis.socialContext],
            successRate: 0.0,
            acquisitionDate: Date.now(),
            strength: 0.1,
            semanticConnections: [],
            pragmaticUses: [analysis.intent.primary],
            acquisitionContext: {
                intent: analysis.intent,
                concepts: analysis.concepts,
                emotionalTone: analysis.emotionalTone
            }
        };
        
        this.vocabulary.set(word, wordData);
        console.log(`Learned new word: ${word}`);
        
        // Record learning event
        if (this.conceptualMemory) {
            this.conceptualMemory.recordEpisode('learned_word', {
                word: word,
                context: analysis.socialContext,
                inferredMeaning: wordData.meanings
            });
        }
    }

    inferWordMeaning(word, analysis) {
        const meanings = [];
        
        // Context-based meaning inference
        if (analysis.intent.primary === 'praise') {
            meanings.push({ concept: 'positive_evaluation', confidence: 0.6 });
        }
        if (analysis.intent.primary === 'scold') {
            meanings.push({ concept: 'negative_evaluation', confidence: 0.6 });
        }
        if (analysis.intent.primary === 'question') {
            meanings.push({ concept: 'information_seeking', confidence: 0.5 });
        }
        
        // Co-occurrence based inference
        for (let concept of analysis.concepts) {
            meanings.push({
                concept: concept.name,
                confidence: concept.confidence * 0.4,
                via: 'co_occurrence'
            });
        }
        
        return meanings;
    }

    learnSyntacticPatterns(patterns) {
        for (let pattern of patterns) {
            if (!this.grammarRules.has(pattern.type)) {
                this.grammarRules.set(pattern.type, {
                    examples: [],
                    confidence: 0.0,
                    productivity: 0.0
                });
            }
            
            const rule = this.grammarRules.get(pattern.type);
            rule.examples.push(pattern);
            rule.confidence = Math.min(0.95, rule.confidence + 0.1);
        }
    }

    learnPragmaticUse(intent, socialContext, emotionalTone) {
    // Learn how language is used in different social contexts
    const pragmaticRule = {
        intent: intent.primary,
        socialContext: socialContext || {},
        emotionalTone: emotionalTone.primary || emotionalTone.tone || 'neutral',
        confidence: intent.confidence || 0.5,
        examples: [{ intent, socialContext, emotionalTone, timestamp: Date.now() }]
    };
    
    const ruleKey = `${intent.primary}_${(socialContext && socialContext.formality) || 'neutral'}`;
    
    if (this.pragmaticKnowledge.has(ruleKey)) {
        const existingRule = this.pragmaticKnowledge.get(ruleKey);
        existingRule.examples.push(pragmaticRule.examples[0]);
        existingRule.confidence = Math.min(0.95, existingRule.confidence + 0.05);
        
        // Keep only recent examples (last 5)
        if (existingRule.examples.length > 5) {
            existingRule.examples = existingRule.examples.slice(-5);
        }
    } else {
        this.pragmaticKnowledge.set(ruleKey, pragmaticRule);
        console.log(`Learned pragmatic rule: ${ruleKey}`);
    }
}

learnSemanticConnections(concepts, entities) {
    // Learn relationships between concepts and entities
    if (!concepts || !entities) return;
    
    for (let i = 0; i < concepts.length; i++) {
        for (let j = i + 1; j < concepts.length; j++) {
            const concept1 = concepts[i];
            const concept2 = concepts[j];
            
            if (concept1.name && concept2.name) {
                this.addSemanticConnection(concept1.name, concept2.name, 'co_occurrence');
            }
        }
        
        // Connect concepts to entities
        for (let entity of entities) {
            if (concepts[i].name && entity.value) {
                this.addSemanticConnection(concepts[i].name, entity.value, 'entity_association');
            }
        }
    }
}
//deserialize
addSemanticConnection(concept1, concept2, relationType) {
    if (!this.semanticNetwork.has(concept1)) {
        this.semanticNetwork.set(concept1, {
            connections: new Map(),
            strength: 0.1
        });
    }
    
    const concept1Data = this.semanticNetwork.get(concept1);
    
    // Fix: Ensure connections is a Map, not a plain object
    if (!(concept1Data.connections instanceof Map)) {
        // Convert plain object to Map if needed
        const oldConnections = concept1Data.connections || {};
        concept1Data.connections = new Map();
        
        // Convert existing connections from object to Map
        for (let [key, value] of Object.entries(oldConnections)) {
            concept1Data.connections.set(key, value);
        }
    }
    
    if (concept1Data.connections.has(concept2)) {
        const connection = concept1Data.connections.get(concept2);
        connection.strength = Math.min(1.0, connection.strength + 0.1);
        connection.count++;
    } else {
        concept1Data.connections.set(concept2, {
            type: relationType,
            strength: 0.2,
            count: 1,
            lastSeen: Date.now()
        });
    }
}

updateLanguageUnderstanding(analysis) {
    // Update overall language comprehension and production abilities
    if (!analysis) return;
    
    // Update comprehension level
    const understandingConfidence = analysis.confidence || 0.5;
    const currentComprehension = this.comprehensionLevel;
    const learningRate = 0.02;
    
    this.comprehensionLevel = currentComprehension + 
        (understandingConfidence - currentComprehension) * learningRate;
    
    // Update production ability based on response attempts
    if (analysis.intent && analysis.intent.confidence > 0.6) {
        this.productionAbility = Math.min(0.95, this.productionAbility + 0.01);
    }
    
    // Update social awareness
    if (analysis.socialContext && analysis.emotionalTone) {
        const socialComplexity = this.calculateSocialComplexity(analysis.socialContext, analysis.emotionalTone);
        this.socialAwareness = Math.min(0.95, this.socialAwareness + socialComplexity * 0.005);
    }
    
    // Update learning stage if thresholds are met
    this.checkForStageProgression();
}

calculateSocialComplexity(socialContext, emotionalTone) {
    let complexity = 0.0;
    
    // Formality adds complexity
    if (socialContext.formality === 'formal') complexity += 0.3;
    else if (socialContext.formality === 'informal') complexity += 0.1;
    
    // Emotional recognition adds complexity
    if (emotionalTone.confidence && emotionalTone.confidence > 0.6) {
        complexity += 0.2;
    }
    
    return Math.min(1.0, complexity);
}

checkForStageProgression() {
    const currentStage = this.learningStage;
    let newStage = currentStage;
    
    // Stage progression criteria
    if (currentStage < 2 && this.vocabulary.size >= 5 && this.comprehensionLevel > 0.3) {
        newStage = 2;
    } else if (currentStage < 3 && this.vocabulary.size >= 15 && this.grammarRules.size >= 3) {
        newStage = 3;
    } else if (currentStage < 4 && this.vocabulary.size >= 30 && this.socialAwareness > 0.4) {
        newStage = 4;
    } else if (currentStage < 5 && this.vocabulary.size >= 50 && this.productionAbility > 0.6) {
        newStage = 5;
    }
    
    if (newStage > currentStage) {
        this.learningStage = newStage;
        console.log(`🎓 Language stage evolved from ${currentStage} to ${newStage}!`);
        
        // Record learning milestone
        if (this.conceptualMemory) {
            this.conceptualMemory.recordEpisode('language_milestone', {
                previousStage: currentStage,
                newStage: newStage,
                vocabularySize: this.vocabulary.size,
                comprehension: this.comprehensionLevel,
                production: this.productionAbility,
                socialAwareness: this.socialAwareness
            });
        }
    }
}

recordLanguageInteraction(input, type, analysis, context) {
    // Record this interaction for future learning and analysis
    const interaction = {
        input: input,
        type: type,
        analysis: analysis,
        context: context,
        timestamp: Date.now(),
        learningStage: this.learningStage,
        vocabularySize: this.vocabulary.size,
        comprehensionLevel: this.comprehensionLevel
    };
    
    // Store in conceptual memory if available generateMirrorGreeting
    if (this.conceptualMemory) {
        this.conceptualMemory.recordEpisode('language_interaction', {
            userInput: input,
            inputType: type,
            understandingConfidence: analysis.confidence || 0.5,
            intent: analysis.intent ? analysis.intent.primary : 'unknown',
            novelty: analysis.novelty || 0,
            complexity: analysis.complexity || 0,
            wordsLearned: analysis.unknownWords ? analysis.unknownWords.length : 0,
            stage: this.learningStage
        });
    }
}

    // RESPONSE GENERATION
    planResponse(analysis, context) {
        const responseGoal = this.determineResponseGoal(analysis, context);
        const responseStrategy = this.selectResponseStrategy(responseGoal, analysis);
        
        setTimeout(() => {
            this.generateAndDeliverResponse(responseGoal, responseStrategy, analysis, context);
        }, 500 + Math.random() * 2000); // thinking time
    }

    determineResponseGoal(analysis, context) {
        const goals = [];
        
        // Reactive goals based on input
        if (analysis.intent.primary === 'greeting') {
            goals.push({ type: 'greeting_response', priority: 0.8 });
        }
        if (analysis.intent.primary === 'question') {
            goals.push({ type: 'answer_question', priority: 0.9 });
        }
        if (analysis.intent.primary === 'praise') {
            goals.push({ type: 'acknowledge_praise', priority: 0.7 });
        }
        if (analysis.intent.primary === 'introduction') {
            goals.push({ type: 'respond_to_introduction', priority: 0.9 });
        }
        
        // Proactive goals based on creature state
        if (this.creature.hunger < 30) {
            goals.push({ type: 'express_hunger', priority: 0.8 });
        }
        if (this.creature.mood === 'lonely') {
            goals.push({ type: 'seek_attention', priority: 0.6 });
        }
        if (this.creature.aggressionLevel > 60) {
            goals.push({ type: 'express_frustration', priority: 0.7 });
        }
        
        // Learning goals
        if (analysis.unknownWords.length > 0) {
            goals.push({ type: 'request_clarification', priority: 0.4 });
        }
        
        // Sort by priority and return top goal
        goals.sort((a, b) => b.priority - a.priority);
        return goals[0] || { type: 'general_response', priority: 0.3 };
    }

    selectResponseStrategy(goal, analysis) {
        const strategies = {
            greeting_response: ['mirror_greeting', 'enthusiastic_greeting', 'shy_greeting'],
            answer_question: ['direct_answer', 'confused_response', 'deflect_with_emotion'],
            acknowledge_praise: ['happy_acceptance', 'shy_acknowledgment', 'proud_response'],
            respond_to_introduction: ['excited_meeting', 'cautious_response', 'friendly_response'],
            express_hunger: ['direct_request', 'subtle_hint', 'dramatic_expression'],
            seek_attention: ['playful_behavior', 'sad_appeal', 'attention_getting'],
            express_frustration: ['mild_complaint', 'emotional_outburst', 'withdrawal'],
            request_clarification: ['confused_sounds', 'repeat_back', 'questioning_tone'],
            general_response: ['acknowledge', 'express_mood', 'random_vocalization']
        };
        
        const availableStrategies = strategies[goal.type] || strategies.general_response;
        
        // Select strategy based on creature personality and state
        return this.selectStrategyByPersonality(availableStrategies);
    }

    selectStrategyByPersonality(strategies) {
        const creature = this.creature;
        const weights = {};
        
        for (let strategy of strategies) {
            let weight = 0.33; // base weight
            
            // Adjust based on personality traits
            if (strategy.includes('enthusiastic') && creature.personalityTraits.extraversion > 0.6) {
                weight += 0.3;
            }
            if (strategy.includes('shy') && creature.personalityTraits.extraversion < 0.4) {
                weight += 0.3;
            }
            if (strategy.includes('dramatic') && creature.personalityTraits.neuroticism > 0.6) {
                weight += 0.2;
            }
            if (strategy.includes('direct') && this.communicationStyle.directness > 0.6) {
                weight += 0.2;
            }
            
            // Adjust based on current emotional state
            if (creature.mood === 'happy' && strategy.includes('happy')) {
                weight += 0.4;
            }
            if (creature.aggressionLevel > 50 && strategy.includes('outburst')) {
                weight += 0.3;
            }
            if (creature.socialAnxiety > 60 && strategy.includes('cautious')) {
                weight += 0.3;
            }
            
            weights[strategy] = weight;
        }
        
        // Weighted random selection
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        
        for (let [strategy, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) {
                return strategy;
            }
        }
        
        return strategies[0]; // fallback
    }

    generateAndDeliverResponse(goal, strategy, analysis, context) {
        const currentTime = Date.now();
        if (currentTime - this.lastSpeechTime < this.speechCooldown) return;
        
        const response = this.generateResponse(goal, strategy, analysis, context);
        
        if (response) {
            this.deliverResponse(response, goal, strategy);
            this.lastSpeechTime = currentTime;
        }
    }

    generateResponse(goal, strategy, analysis, context) {
        const generator = new ResponseGenerator(this);
        return generator.generate(goal, strategy, analysis, context);
    }

    deliverResponse(response, goal, strategy) {
        // Display in chat
        if (window.tamagotchiGame) {
            window.tamagotchiGame.addChatMessage(
                this.creature.name || 'Pet',
                response.text,
                'creature'
            );
        }
        
        // Speak aloud
        if (window.tamagotchiGame?.audioSystem) {
            window.tamagotchiGame.audioSystem.speakText(
                response.text,
                response.emotion,
                this.learningStage
            );
        }
        
        // Visual animation
        this.creature.speak(response.text.length * 100);
        
        // Record the attempt for learning
        this.recordSpeechAttempt(response, goal, strategy);
    }

    recordSpeechAttempt(response, goal, strategy) {
        const attempt = {
            id: Date.now() + Math.random(),
            response: response,
            goal: goal,
            strategy: strategy,
            timestamp: Date.now(),
            success: null, // will be determined by user reaction
            learningValue: 0
        };
        
        this.speechAttempts = this.speechAttempts || [];
        this.speechAttempts.push(attempt);
        
        // Watch for user reaction
        setTimeout(() => {
            this.evaluateResponseSuccess(attempt.id);
        }, 10000);
    }

    evaluateResponseSuccess(attemptId) {
        const attempt = (this.speechAttempts || []).find(a => a.id === attemptId);
        if (!attempt || attempt.success !== null) return;
        
        // Default evaluation if no user reaction within timeout
        let success = false;
        let learningValue = 0;
        
        if (attempt.userReaction) {
            // Evaluate based on user reaction type
            const positiveReactions = ['feed', 'play', 'pet', 'praise'];
            const negativeReactions = ['scold', 'ignore'];
            
            if (positiveReactions.includes(attempt.userReaction)) {
                success = true;
                learningValue = 0.2;
            } else if (negativeReactions.includes(attempt.userReaction)) {
                success = false;
                learningValue = -0.1;
            } else {
                // Neutral reaction
                success = Math.random() > 0.5;
                learningValue = success ? 0.1 : -0.05;
            }
        } else {
            // No reaction - assume neutral to negative
            success = false;
            learningValue = -0.05;
        }
        
        attempt.success = success;
        attempt.learningValue = learningValue;
        
        // Update vocabulary based on success/failure
        this.updateVocabularyFromAttempt(attempt, learningValue);
    }

    // LANGUAGE PROCESSING LOOP
    startLanguageProcessing() {
        setInterval(() => {
            this.processLanguageState();
        }, 3000);
    }

    processLanguageState() {
        if (!this.creature.isAlive) return;
        
        // Update learning stage
        this.updateLearningStage();
        
        // Process pending communications
        this.processCommunicationGoals();
        
        // Generate spontaneous speech
        if (Math.random() < this.calculateSpontaneousSpeechProbability()) {
            this.generateSpontaneousSpeech();
        }
        
        // Maintain language systems
        this.performLanguageMaintenance();
    }

    updateLearningStage() {
        const factors = {
            age: Math.min(1.0, this.creature.age / 48), // 48 hours to mature
            interactions: Math.min(1.0, this.creature.totalInteractions / 50),
            vocabulary: Math.min(1.0, this.vocabulary.size / 30),
            comprehension: this.comprehensionLevel,
            social: Math.min(1.0, (this.creature.trustLevel + this.creature.attachmentLevel) / 200)
        };
        
        const overallProgress = Object.values(factors).reduce((a, b) => a + b, 0) / Object.keys(factors).length;
        
        let targetStage = 1;
        if (overallProgress > 0.2) targetStage = 2;
        if (overallProgress > 0.4) targetStage = 3;
        if (overallProgress > 0.6) targetStage = 4;
        if (overallProgress > 0.8) targetStage = 5;
        
        if (targetStage > this.learningStage) {
            const oldStage = this.learningStage;
            this.learningStage = targetStage;
            console.log(`Language stage evolved: ${oldStage} → ${targetStage}`);
            
            this.onStageEvolution(oldStage, targetStage);
        }
    }

    onStageEvolution(oldStage, newStage) {
        // Unlock new language capabilities
        if (newStage >= 2) {
            this.comprehensionLevel = Math.max(this.comprehensionLevel, 0.3);
        }
        if (newStage >= 3) {
            this.productionAbility = Math.max(this.productionAbility, 0.4);
        }
        if (newStage >= 4) {
            this.socialAwareness = Math.max(this.socialAwareness, 0.6);
        }
        
        // Generate evolution response
        if (window.tamagotchiGame?.audioSystem) {
            window.tamagotchiGame.audioSystem.playEvolutionSound();
        }
        
        // Express excitement about new capabilities
        setTimeout(() => {
            this.expressLanguageEvolution(newStage);
        }, 2000);
    }

    calculateSpontaneousSpeechProbability() {
        let probability = this.communicationStyle.verbosity * 0.3;
        
        // Increase based on creature state
        if (this.creature.mood === 'happy') probability += 0.2;
        if (this.creature.mood === 'lonely') probability += 0.4;
        if (this.creature.frustrationLevel > 50) probability += 0.3;
        if (this.creature.aggressionLevel > 40) probability += 0.2;
        
        // Decrease if recently spoke
        const timeSinceLastSpeech = Date.now() - this.lastSpeechTime;
        if (timeSinceLastSpeech < this.speechCooldown * 2) {
            probability *= 0.3;
        }
        
        return Math.min(0.8, probability);
    }

    // PUBLIC INTERFACE METHODS
    getStageName() {
        const stages = {
            1: 'Proto-Language',
            2: 'First Words',
            3: 'Simple Grammar',
            4: 'Complex Language',
            5: 'Advanced Communication'
        };
        return stages[this.learningStage] || 'Unknown';
    }

getLanguageStats() {
       return {
           stage: this.learningStage,
           stageName: this.getStageName(),
           vocabularySize: this.vocabulary.size,
           comprehensionLevel: Math.round(this.comprehensionLevel * 100),
           productionAbility: Math.round(this.productionAbility * 100),
           socialAwareness: Math.round(this.socialAwareness * 100),
           confirmedRules: this.grammarRules.size,
           communicationStyle: {
               verbosity: Math.round(this.communicationStyle.verbosity * 100),
               formality: Math.round(this.communicationStyle.formality * 100),
               playfulness: Math.round(this.communicationStyle.playfulness * 100)
           }
       };
   }

   recordUserReaction(actionType, timestamp, isPositive) {
       // Find recent speech attempts to credit/blame
       const recentAttempts = (this.speechAttempts || []).filter(attempt => 
           !attempt.success && 
           timestamp - attempt.timestamp < 15000 && 
           timestamp > attempt.timestamp
       );
       
       if (recentAttempts.length > 0) {
           const attempt = recentAttempts[recentAttempts.length - 1];
           attempt.success = isPositive;
           attempt.userReaction = actionType;
           attempt.reactionTime = timestamp - attempt.timestamp;
           
           this.learnFromUserReaction(attempt, actionType, isPositive);
       }
       
       // Update overall communication confidence
       if (isPositive) {
           this.productionAbility = Math.min(0.95, this.productionAbility + 0.02);
           this.comprehensionLevel = Math.min(0.95, this.comprehensionLevel + 0.01);
       } else {
           this.productionAbility = Math.max(0.05, this.productionAbility - 0.01);
       }
   }

   learnFromUserReaction(attempt, actionType, isPositive) {
       // Update vocabulary based on success/failure
       const words = attempt.response.text.split(' ');
       for (let word of words) {
           if (this.vocabulary.has(word)) {
               const wordData = this.vocabulary.get(word);
               const oldRate = wordData.successRate;
               const attempts = wordData.usageCount || 1;
               
               wordData.successRate = ((oldRate * attempts) + (isPositive ? 1 : 0)) / (attempts + 1);
               wordData.usageCount = attempts + 1;
               
               if (isPositive) {
                   wordData.strength = Math.min(1.0, wordData.strength + 0.1);
               } else {
                   wordData.strength = Math.max(0.1, wordData.strength - 0.05);
               }
           }
       }
       
       // Update strategy effectiveness
       if (!this.strategySuccess) this.strategySuccess = new Map();
       
       const strategyKey = attempt.strategy;
       if (!this.strategySuccess.has(strategyKey)) {
           this.strategySuccess.set(strategyKey, { successes: 0, attempts: 0 });
       }
       
       const strategyData = this.strategySuccess.get(strategyKey);
       strategyData.attempts++;
       if (isPositive) strategyData.successes++;
   }

   // EXPRESS THOUGHTS AND FEELINGS
   expressThought(thoughtType, intensity) {
       if (Date.now() - this.lastSpeechTime < this.speechCooldown) return;
       
       const analysis = {
           intent: { primary: thoughtType, confidence: 0.8 },
           emotionalTone: { primary: this.creature.mood, intensity: intensity },
           concepts: [{ name: thoughtType, confidence: 0.9 }]
       };
       
       const goal = { type: 'express_internal_state', priority: intensity };
       const strategy = this.selectEmotionalExpressionStrategy(thoughtType, intensity);
       
       this.generateAndDeliverResponse(goal, strategy, analysis, {});
   }

   selectEmotionalExpressionStrategy(thoughtType, intensity) {
       const strategies = {
           hungry: ['food_request', 'hunger_complaint', 'food_memory'],
           happy: ['joy_expression', 'playful_chatter', 'contentment'],
           sad: ['sadness_expression', 'comfort_seeking', 'melancholy'],
           lonely: ['attention_seeking', 'social_invitation', 'attachment_display'],
           frustrated: ['complaint', 'demand_attention', 'restless_behavior'],
           sick: ['help_request', 'discomfort_expression', 'weakness_display'],
           tired: ['rest_request', 'energy_complaint', 'sleepy_behavior'],
           curious: ['question_asking', 'exploration_interest', 'learning_excitement'],
           angry: ['frustration_expression', 'boundary_assertion', 'aggressive_display']
       };
       
       const available = strategies[thoughtType] || strategies.happy;
       
       // High intensity = more direct strategies
       if (intensity > 0.7) {
           return available.filter(s => s.includes('request') || s.includes('demand'))[0] || available[0];
       }
       
       return this.selectStrategyByPersonality(available);
   }

   // MAINTENANCE AND SERIALIZATION
   performLanguageMaintenance() {
       // Decay unused vocabulary
       for (let [word, data] of this.vocabulary.entries()) {
           const age = Date.now() - data.acquisitionDate;
           if (age > 600000 && data.strength < 0.2) { // 10 minutes, very weak
               this.vocabulary.delete(word);
               console.log(`Forgot weak word: ${word}`);
           } else if (age > 300000) { // 5 minutes
               data.strength *= 0.99;
           }
       }
       
       // Strengthen frequently used words
       for (let [word, data] of this.vocabulary.entries()) {
           if (data.usageCount > 5 && data.successRate > 0.7) {
               data.strength = Math.min(1.0, data.strength + 0.01);
           }
       }
   }

   serialize() {
       return {
           vocabulary: Array.from(this.vocabulary.entries()),
           grammarRules: Array.from(this.grammarRules.entries()),
           pragmaticKnowledge: Array.from(this.pragmaticKnowledge.entries()),
           semanticNetwork: Array.from(this.semanticNetwork.entries()),
           learningStage: this.learningStage,
           comprehensionLevel: this.comprehensionLevel,
           productionAbility: this.productionAbility,
           socialAwareness: this.socialAwareness,
           communicationStyle: this.communicationStyle,
           languagePersonality: this.languagePersonality,
           strategySuccess: this.strategySuccess ? Array.from(this.strategySuccess.entries()) : [],
           speechAttempts: (this.speechAttempts || []).slice(-20)
       };
   }

    deserialize(data) {
        if (data.vocabulary) this.vocabulary = new Map(data.vocabulary);
        if (data.grammarRules) this.grammarRules = new Map(data.grammarRules);
        if (data.pragmaticKnowledge) this.pragmaticKnowledge = new Map(data.pragmaticKnowledge);
        
        // Fix semantic network deserialization
        if (data.semanticNetwork) {
            this.semanticNetwork = new Map(data.semanticNetwork);
            
            // Ensure all connections are Maps, not plain objects
            for (let [concept, conceptData] of this.semanticNetwork.entries()) {
                if (conceptData.connections && !(conceptData.connections instanceof Map)) {
                    const oldConnections = conceptData.connections;
                    conceptData.connections = new Map();
                    
                    // Convert from plain object to Map
                    for (let [key, value] of Object.entries(oldConnections)) {
                        conceptData.connections.set(key, value);
                    }
                }
            }
        }
        
        if (data.learningStage) this.learningStage = data.learningStage;
        if (data.comprehensionLevel) this.comprehensionLevel = data.comprehensionLevel;
        if (data.productionAbility) this.productionAbility = data.productionAbility;
        if (data.socialAwareness) this.socialAwareness = data.socialAwareness;
        if (data.communicationStyle) this.communicationStyle = data.communicationStyle;
        if (data.languagePersonality) this.languagePersonality = data.languagePersonality;
        if (data.strategySuccess) this.strategySuccess = new Map(data.strategySuccess);
        if (data.speechAttempts) this.speechAttempts = data.speechAttempts;
    }
}

// RESPONSE GENERATION HELPER CLASS
class ResponseGenerator {
    constructor(languageSystem) {
        this.languageSystem = languageSystem;
        this.creature = languageSystem ? languageSystem.creature : null; // Add null check
    }

    generate(goal, strategy, analysis, context) {
        const responseData = this.generateByStrategy(strategy, goal, analysis, context);
        
        if (!responseData) return null;
        
        return {
            text: responseData.text,
            emotion: this.determineEmotionalDelivery(responseData, strategy),
            confidence: responseData.confidence || 0.5,
            expectedReaction: responseData.expectedReaction || 'neutral'
        };
    }

   generateByStrategy(strategy, goal, analysis, context) {
       const generators = {
           // Greeting responses
           mirror_greeting: () => this.generateMirrorGreeting(analysis),
           enthusiastic_greeting: () => this.generateEnthusiasticGreeting(),
           shy_greeting: () => this.generateShyGreeting(),
           
           // Question responses
           direct_answer: () => this.generateDirectAnswer(analysis),
           confused_response: () => this.generateConfusedResponse(),
           deflect_with_emotion: () => this.generateEmotionalDeflection(),
           
           // Praise responses
           happy_acceptance: () => this.generateHappyAcceptance(),
           shy_acknowledgment: () => this.generateShyAcknowledgment(),
           proud_response: () => this.generateProudResponse(),
           
           // Introduction responses
           excited_meeting: () => this.generateExcitedMeeting(analysis),
           cautious_response: () => this.generateCautiousResponse(),
           friendly_response: () => this.generateFriendlyResponse(analysis),
           
           // Need expression
           direct_request: () => this.generateDirectRequest(goal),
           subtle_hint: () => this.generateSubtleHint(goal),
           dramatic_expression: () => this.generateDramaticExpression(goal),
           
           // Attention seeking
           playful_behavior: () => this.generatePlayfulBehavior(),
           sad_appeal: () => this.generateSadAppeal(),
           attention_getting: () => this.generateAttentionGetting(),
           
           // Frustration expression
           mild_complaint: () => this.generateMildComplaint(),
           emotional_outburst: () => this.generateEmotionalOutburst(),
           withdrawal: () => this.generateWithdrawal(),
           
           // Default
           acknowledge: () => this.generateAcknowledgment(),
           express_mood: () => this.generateMoodExpression(),
           random_vocalization: () => this.generateRandomVocalization()
       };
       
       const generator = generators[strategy] || generators.random_vocalization;
       return generator();
   }

   // SPECIFIC RESPONSE GENERATORS
    generateMirrorGreeting(analysis) {
        const greetingWord = this.getWordsForConcept('greeting');
        if (greetingWord) {
            return {
                text: greetingWord + (Math.random() > 0.5 ? '!' : ''),
                confidence: 0.7
            };
        }
        return this.generateBasicSound('happy');
    }

   generateEnthusiasticGreeting() {
       const enthusiasticSounds = this.getHighEnergyVocalizations();
       return {
           text: enthusiasticSounds + '! ' + enthusiasticSounds + '!',
           confidence: 0.8,
           expectedReaction: 'positive'
       };
   }

   generateShyGreeting() {
       const softSounds = this.getSoftVocalizations();
       return {
           text: softSounds + '...',
           confidence: 0.4,
           expectedReaction: 'gentle'
       };
   }


   // Add these methods to the AdvancedLanguageLearning class

learnPragmaticUse(intent, socialContext, emotionalTone) {
    // Learn how language is used in different social contexts
    const pragmaticRule = {
        intent: intent.primary,
        socialContext: socialContext,
        emotionalTone: emotionalTone.primary || emotionalTone.tone,
        confidence: intent.confidence || 0.5,
        examples: [{ intent, socialContext, emotionalTone, timestamp: Date.now() }]
    };
    
    const ruleKey = `${intent.primary}_${socialContext.formality || 'neutral'}`;
    
    if (this.pragmaticKnowledge.has(ruleKey)) {
        const existingRule = this.pragmaticKnowledge.get(ruleKey);
        existingRule.examples.push(pragmaticRule.examples[0]);
        existingRule.confidence = Math.min(0.95, existingRule.confidence + 0.05);
        
        // Keep only recent examples (last 5)
        if (existingRule.examples.length > 5) {
            existingRule.examples = existingRule.examples.slice(-5);
        }
    } else {
        this.pragmaticKnowledge.set(ruleKey, pragmaticRule);
        console.log(`Learned pragmatic rule: ${ruleKey}`);
    }
}

learnSemanticConnections(concepts, entities) {
    // Learn relationships between concepts and entities
    for (let i = 0; i < concepts.length; i++) {
        for (let j = i + 1; j < concepts.length; j++) {
            const concept1 = concepts[i];
            const concept2 = concepts[j];
            
            this.addSemanticConnection(concept1.name, concept2.name, 'co_occurrence');
        }
        
        // Connect concepts to entities
        for (let entity of entities) {
            this.addSemanticConnection(concepts[i].name, entity.value, 'entity_association');
        }
    }
}

addSemanticConnection(concept1, concept2, relationType) {
    if (!this.semanticNetwork.has(concept1)) {
        this.semanticNetwork.set(concept1, {
            connections: new Map(),
            strength: 0.1
        });
    }
    
    const concept1Data = this.semanticNetwork.get(concept1);
    if (concept1Data.connections.has(concept2)) {
        const connection = concept1Data.connections.get(concept2);
        connection.strength = Math.min(1.0, connection.strength + 0.1);
        connection.count++;
    } else {
        concept1Data.connections.set(concept2, {
            type: relationType,
            strength: 0.2,
            count: 1,
            lastSeen: Date.now()
        });
    }
    
    console.log(`Strengthened semantic connection: ${concept1} -> ${concept2} (${relationType})`);
}

updateLanguageUnderstanding(analysis) {
    // Update overall language comprehension and production abilities
    
    // Update comprehension level
    const understandingConfidence = analysis.confidence;
    const currentComprehension = this.comprehensionLevel;
    const learningRate = 0.02;
    
    this.comprehensionLevel = currentComprehension + 
        (understandingConfidence - currentComprehension) * learningRate;
    
    // Update production ability based on response attempts
    if (analysis.intent.confidence > 0.6) {
        this.productionAbility = Math.min(0.95, this.productionAbility + 0.01);
    }
    
    // Update social awareness
    if (analysis.socialContext && analysis.emotionalTone) {
        const socialComplexity = this.calculateSocialComplexity(analysis.socialContext, analysis.emotionalTone);
        this.socialAwareness = Math.min(0.95, this.socialAwareness + socialComplexity * 0.005);
    }
    
    // Update learning stage if thresholds are met
    this.checkForStageProgression();
}

calculateSocialComplexity(socialContext, emotionalTone) {
    let complexity = 0.0;
    
    // Formality adds complexity
    if (socialContext.formality === 'formal') complexity += 0.3;
    else if (socialContext.formality === 'informal') complexity += 0.1;
    
    // Emotional recognition adds complexity
    if (emotionalTone.confidence && emotionalTone.confidence > 0.6) {
        complexity += 0.2;
    }
    
    // Authority/intimacy dynamics
    if (socialContext.authority !== 'neutral') complexity += 0.2;
    if (socialContext.intimacy !== 'neutral') complexity += 0.1;
    
    return Math.min(1.0, complexity);
}

checkForStageProgression() {
    const currentStage = this.learningStage;
    let newStage = currentStage;
    
    // Stage progression criteria
    if (currentStage < 2 && this.vocabulary.size >= 5 && this.comprehensionLevel > 0.3) {
        newStage = 2;
    } else if (currentStage < 3 && this.vocabulary.size >= 15 && this.grammarRules.size >= 3) {
        newStage = 3;
    } else if (currentStage < 4 && this.vocabulary.size >= 30 && this.socialAwareness > 0.4) {
        newStage = 4;
    } else if (currentStage < 5 && this.vocabulary.size >= 50 && this.productionAbility > 0.6) {
        newStage = 5;
    }
    
    if (newStage > currentStage) {
        this.learningStage = newStage;
        console.log(`🎓 Language stage evolved from ${currentStage} to ${newStage}!`);
        
        // Record learning milestone
        if (this.conceptualMemory) {
            this.conceptualMemory.recordEpisode('language_milestone', {
                previousStage: currentStage,
                newStage: newStage,
                vocabularySize: this.vocabulary.size,
                comprehension: this.comprehensionLevel,
                production: this.productionAbility,
                socialAwareness: this.socialAwareness
            });
        }
    }
}

recordLanguageInteraction(input, type, analysis, context) {
    // Record this interaction for future learning and analysis
    const interaction = {
        input: input,
        type: type,
        analysis: analysis,
        context: context,
        timestamp: Date.now(),
        learningStage: this.learningStage,
        vocabularySize: this.vocabulary.size,
        comprehensionLevel: this.comprehensionLevel
    };
    
    // Store in conceptual memory if available
    if (this.conceptualMemory) {
        this.conceptualMemory.recordEpisode('language_interaction', {
            userInput: input,
            inputType: type,
            understandingConfidence: analysis.confidence,
            intent: analysis.intent.primary,
            novelty: analysis.novelty,
            complexity: analysis.complexity,
            wordsLearned: analysis.unknownWords.length,
            stage: this.learningStage
        });
    }
    
    console.log(`📝 Recorded language interaction: "${input}" (confidence: ${Math.round(analysis.confidence * 100)}%)`);
}

// Also add this helper method that might be needed:
learnNewWord(word, analysis) {
    if (word.length < 2 || this.vocabulary.has(word)) return;
    
    const wordData = {
        phonology: word,
        meanings: this.inferWordMeaning(word, analysis),
        usageContexts: [analysis.socialContext || {}],
        successRate: 0.0,
        acquisitionDate: Date.now(),
        strength: 0.1,
        semanticConnections: [],
        pragmaticUses: [analysis.intent.primary],
        usageCount: 1,
        acquisitionContext: {
            intent: analysis.intent,
            concepts: analysis.concepts || [],
            emotionalTone: analysis.emotionalTone
        }
    };
    
    this.vocabulary.set(word, wordData);
    console.log(`📚 Learned new word: "${word}"`);
    
    // Record learning event learnSyntacticPatterns
    if (this.conceptualMemory) {
        this.conceptualMemory.recordEpisode('learned_word', {
            word: word,
            context: analysis.socialContext,
            inferredMeaning: wordData.meanings
        });
    }
}

   generateDirectAnswer(analysis) {
       // Try to answer based on what creature understands
       if (analysis.intent.primary === 'question') {
           if (analysis.words.includes('name')) {
               return {
                   text: (this.creature.name || 'me') + '!',
                   confidence: 0.9
               };
           }
           if (analysis.words.includes('how') && analysis.words.includes('are')) {
               return this.generateMoodBasedResponse();
           }
       }
       
       return this.generateConfusedResponse();
   }

   generateConfusedResponse() {
       const confusedSounds = ['eh?', 'hm?', 'wha?', 'mm?'];
       const sound = confusedSounds[Math.floor(Math.random() * confusedSounds.length)];
       return {
           text: sound,
           confidence: 0.3,
           expectedReaction: 'clarification'
       };
   }

   generateHappyAcceptance() {
       const happySounds = this.getWordsForConcept('happiness') || this.getHighEnergyVocalizations();
       return {
           text: happySounds + '! ' + this.generateBasicSound('happy').text,
           confidence: 0.8,
           expectedReaction: 'positive'
       };
   }

   generateExcitedMeeting(analysis) {
       const name = this.extractPersonName(analysis);
       const excitedSound = this.getHighEnergyVocalizations();
       
       if (name && this.languageSystem.entityManager) {
           // Create personalized response
           const petName = this.languageSystem.entityManager.getCurrentPersonName(name);
           return {
               text: excitedSound + '! ' + petName + '!',
               confidence: 0.9,
               expectedReaction: 'positive'
           };
       }
       
       return {
           text: excitedSound + '! ' + this.generateBasicSound('happy').text,
           confidence: 0.7
       };
   }

   generateDirectRequest(goal) {
       const requestMap = {
           express_hunger: () => this.getWordsForConcept('food') || 'grub',
           seek_attention: () => 'hey! ' + this.generateBasicSound('attention').text,
           express_discomfort: () => this.getWordsForConcept('help') || 'ow'
       };
       
       const generator = requestMap[goal.type];
       if (generator) {
           const word = generator();
           return {
               text: word + '!',
               confidence: 0.8,
               expectedReaction: 'action'
           };
       }
       
       return this.generateBasicSound('need');
   }

   generateEmotionalOutburst() {
       const aggressiveSounds = this.getAggressiveVocalizations();
       const frustrationSound = this.generateBasicSound('frustrated').text;
       
       return {
           text: aggressiveSounds + '! ' + frustrationSound + '! ' + aggressiveSounds + '!',
           confidence: 0.9,
           expectedReaction: 'concern'
       };
   }

   generateMoodBasedResponse() {
       const moodResponses = {
           happy: () => this.getHighEnergyVocalizations() + '!',
           sad: () => this.getSoftVocalizations() + '...',
           angry: () => this.getAggressiveVocalizations() + '!',
           frustrated: () => this.getAggressiveVocalizations() + ' ' + this.generateBasicSound('frustrated').text,
           lonely: () => this.getSoftVocalizations() + '? ' + this.generateBasicSound('lonely').text,
           tired: () => this.generateBasicSound('tired').text + '...',
           sick: () => this.generateBasicSound('sick').text + ' ' + this.getSoftVocalizations()
       };
       
       const generator = moodResponses[this.creature.mood] || moodResponses.happy;
       return {
           text: generator(),
           confidence: 0.7
       };
   }

   // VOCALIZATION GENERATION HELPERS
   getWordsForConcept(concept) {
       const conceptWords = [];
       
       for (let [word, data] of this.languageSystem.vocabulary.entries()) {
           if (data.meanings.some(meaning => meaning.concept === concept)) {
               conceptWords.push(word);
           }
       }
       
       if (conceptWords.length > 0) {
           return conceptWords[Math.floor(Math.random() * conceptWords.length)];
       }
       
       return null;
   }

   generateBasicSound(emotionalContext) {
       const creature = this.creature;
       const sounds = Array.from(this.languageSystem.vocabulary.keys());
       
       if (sounds.length === 0) {
           // Fallback to basic vocalizations
           const fallbackSounds = ['meh', 'bah', 'gah', 'nah', 'wah'];
           return {
               text: fallbackSounds[Math.floor(Math.random() * fallbackSounds.length)],
               confidence: 0.2
           };
       }
       
       // Select sound based on emotional context and creature state
       let weightedSounds = sounds.map(sound => ({
           sound: sound,
           weight: this.calculateSoundWeight(sound, emotionalContext)
       }));
       
       // Weighted random selection
       const totalWeight = weightedSounds.reduce((sum, item) => sum + item.weight, 0);
       let random = Math.random() * totalWeight;
       
       for (let item of weightedSounds) {
           random -= item.weight;
           if (random <= 0) {
               return {
                   text: item.sound,
                   confidence: 0.6
               };
           }
       }
       
       return {
           text: sounds[0],
           confidence: 0.3
       };
   }

   calculateSoundWeight(sound, emotionalContext) {
       const wordData = this.languageSystem.vocabulary.get(sound);
       let weight = wordData.strength || 0.3;
       
       // Boost sounds that match emotional context
       if (wordData.meanings.some(m => m.concept === emotionalContext)) {
           weight *= 2;
       }
       
       // Boost successful sounds
       if (wordData.successRate > 0.5) {
           weight *= 1.5;
       }
       
       return weight;
   }

   getHighEnergyVocalizations() {
       const energySounds = ['yay', 'woo', 'yeah', 'yip', 'wee'];
       return energySounds[Math.floor(Math.random() * energySounds.length)];
   }

   getSoftVocalizations() {
       const softSounds = ['mmm', 'ohh', 'ahh', 'hmm', 'ooh'];
       return softSounds[Math.floor(Math.random() * softSounds.length)];
   }

   getAggressiveVocalizations() {
       const aggressiveSounds = ['grah', 'argh', 'grr', 'hmph', 'bah'];
       return aggressiveSounds[Math.floor(Math.random() * aggressiveSounds.length)];
   }

   extractPersonName(analysis) {
       for (let entity of analysis.entities || []) {
           if (entity.type === 'person') {
               return entity.value;
           }
       }
       return null;
   }

   generateRandomVocalization() {
       return this.generateBasicSound('neutral');
   }

   generateAcknowledgment() {
       const ackSounds = ['mm', 'mhm', 'yeah', 'ok', 'yep'];
       return {
           text: ackSounds[Math.floor(Math.random() * ackSounds.length)],
           confidence: 0.5
       };
   }

   generateMoodExpression() {
       return this.generateMoodBasedResponse();
   }

   determineEmotionalDelivery(responseData, strategy) {
       // Map strategy to emotional delivery
       const emotionMap = {
           enthusiastic_greeting: 'happy',
           shy_greeting: 'sleepy',
           emotional_outburst: 'angry',
           sad_appeal: 'sad',
           happy_acceptance: 'happy',
           dramatic_expression: 'angry',
           confused_response: 'neutral'
       };
       
       return emotionMap[strategy] || this.creature.mood;
   }
}


//ResponseGenerator 
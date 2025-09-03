// CognitiveProcessor - the creature's reasoning engine and decision-making system
class CognitiveProcessor {
    constructor(creature, entityManager, conceptualMemory) {
        this.creature = creature;
        this.entityManager = entityManager;
        this.conceptualMemory = conceptualMemory;
        
        // Hypothesis formation and testing
        this.currentHypotheses = []; // language rules being tested
        this.confirmedRules = new Map(); // proven language patterns
        this.rejectedHypotheses = []; // failed attempts
        
        // Decision making
        this.attentionFocus = null; // what creature is currently thinking about
        this.goalStack = []; // ordered list of current goals
        this.contextualState = {}; // current understanding of situation
        
        // Cognitive capabilities
        this.confidenceLevels = new Map(); // confidence in various concepts
        this.metacognition = new Map(); // thinking about thinking
        this.problemSolving = []; // active problem-solving attempts
        
        // Learning mechanisms
        this.learningMode = 'passive'; // passive, active, experimental
        this.curiosityLevel = 0.6;
        this.explorationTendency = 0.4;
        
        this.init();
    }

    init() {
        this.initializeBasicHypotheses();
        this.startCognitiveLoop();
        console.log('Cognitive Processor initialized');
    }

    initializeBasicHypotheses() {
        // Start with some basic language hypotheses
        const basicHypotheses = [
            {
                id: 'names_identify_people',
                hypothesis: 'when humans say "my name is X", X identifies that specific person',
                confidence: 0.3,
                evidence: [],
                testAttempts: 0,
                status: 'testing'
            },
            {
                id: 'repeated_words_mean_urgency',
                hypothesis: 'when humans repeat words, they want more attention',
                confidence: 0.2,
                evidence: [],
                testAttempts: 0,
                status: 'testing'
            },
            {
                id: 'tone_indicates_emotion',
                hypothesis: 'how humans say things indicates their emotional state',
                confidence: 0.5,
                evidence: [],
                testAttempts: 0,
                status: 'testing'
            }
        ];

        this.currentHypotheses = basicHypotheses;
    }

    // COGNITIVE PROCESSING LOOP
    startCognitiveLoop() {
        // Run cognitive processing every 2 seconds
        setInterval(() => {
            this.processCognition();
        }, 2000);
    }

    // Add this method to CognitiveProcessor class:
    determineShiftReason(oldFocus, newFocus) {
        const reasons = [];
        
        if (this.creature.health < 20) reasons.push('health_crisis');
        if (this.creature.hunger < 15) reasons.push('hunger_urgent');
        if (this.creature.aggressionLevel > 70) reasons.push('emotional_distress');
        if (this.currentHypotheses.length > 0) reasons.push('learning_opportunity');
        if (Date.now() - this.creature.lastInteraction > 180000) reasons.push('attention_seeking');
        
        return reasons.length > 0 ? reasons[0] : 'natural_attention_drift';
    }

    // Also add this method around line 545:
    expressLearningThought() {
        if (window.tamagotchiGame && window.tamagotchiGame.languageLearning) {
            window.tamagotchiGame.languageLearning.expressThought('learning_progress', 0.6);
        }
    }

    processCognition() {
        if (!this.creature.isAlive) return;
        
        // Update contextual understanding
        this.updateContextualState();
        
        // Process working memory
        this.processWorkingMemory();
        
        // Test active hypotheses
        this.processHypotheses();
        
        // Update attention and goals
        this.updateAttentionAndGoals();
        
        // Generate thoughts and responses
        this.generateCognitiveResponse();
    }

    updateContextualState() {
        this.contextualState = {
            currentTime: Date.now(),
            creature: {
                needsState: {
                    hunger: this.creature.hunger,
                    happiness: this.creature.happiness,
                    health: this.creature.health,
                    energy: this.creature.energy
                },
                emotionalState: this.creature.mood,
                aggressionLevel: this.creature.aggressionLevel || 0,
                trustLevel: this.creature.trustLevel
            },
            social: {
                knownPeople: this.entityManager.getAllKnownPeople().length,
                currentInteractionTarget: this.entityManager.currentPerson,
                recentInteractions: this.getRecentInteractions()
            },
            learning: {
                activeHypotheses: this.currentHypotheses.length,
                confidenceInLanguage: this.calculateLanguageConfidence(),
                vocabularySize: this.creature.vocabulary ? this.creature.vocabulary.size : 0
            }
        };
    }

    // HYPOTHESIS FORMATION AND TESTING
    formHypothesis(observation, context) {
        const hypothesis = {
            id: this.generateHypothesisId(observation),
            hypothesis: this.formulateHypothesis(observation, context),
            confidence: 0.1, // start with low confidence
            evidence: [{ observation, context, timestamp: Date.now() }],
            testAttempts: 0,
            status: 'forming',
            createdAt: Date.now(),
            relatedConcepts: this.identifyRelatedConcepts(observation)
        };

        // Check if similar hypothesis already exists
        const existing = this.findSimilarHypothesis(hypothesis);
        if (existing) {
            this.addEvidenceToHypothesis(existing.id, observation, context);
        } else {
            this.currentHypotheses.push(hypothesis);
            console.log(`New hypothesis formed: ${hypothesis.hypothesis}`);
        }

        return hypothesis;
    }

    formulateHypothesis(observation, context) {
        // Generate natural language hypothesis based on observation
        const patterns = {
            'person_said_name': 'when someone says "my name is X", they want me to know X is their identifier',
            'repeated_action_response': 'when humans repeat actions quickly, they might be frustrated',
            'tone_change': 'when humans change how they speak, their emotional state changed',
            'new_word_context': 'when humans use new words in specific situations, the word relates to that situation',
            'praise_after_action': 'when humans make happy sounds after I do something, that action was good',
            'silence_after_speech': 'when humans don\'t respond to my speech, they might not understand'
        };

        return patterns[observation.type] || `pattern observed: ${observation.type}`;
    }

    findSimilarHypothesis(newHypothesis) {
        return this.currentHypotheses.find(existing => 
            this.calculateHypothesisSimilarity(existing, newHypothesis) > 0.7
        );
    }

    calculateHypothesisSimilarity(h1, h2) {
        // Simple similarity check based on related concepts and keywords
        const concepts1 = new Set(h1.relatedConcepts || []);
        const concepts2 = new Set(h2.relatedConcepts || []);
        const intersection = new Set([...concepts1].filter(x => concepts2.has(x)));
        
        return intersection.size / Math.max(concepts1.size, concepts2.size, 1);
    }

    processHypotheses() {
        for (let hypothesis of this.currentHypotheses) {
            if (hypothesis.status === 'testing') {
                this.testHypothesis(hypothesis);
            }
        }
    }

    testHypothesis(hypothesis) {
        // Look for opportunities to test the hypothesis
        const recentMemories = this.conceptualMemory.recallEpisodes({
            timeframe: 30000, // last 30 seconds
            concepts: hypothesis.relatedConcepts
        });

        for (let memory of recentMemories) {
            const testResult = this.evaluateHypothesisAgainstEvidence(hypothesis, memory);
            
            if (testResult.relevant) {
                hypothesis.testAttempts++;
                
                if (testResult.supports) {
                    hypothesis.confidence = Math.min(0.95, hypothesis.confidence + 0.15);
                    hypothesis.evidence.push({
                        type: 'supporting',
                        memory: memory,
                        timestamp: Date.now()
                    });
                } else {
                    hypothesis.confidence = Math.max(0.05, hypothesis.confidence - 0.1);
                    hypothesis.evidence.push({
                        type: 'contradicting',
                        memory: memory,
                        timestamp: Date.now()
                    });
                }

                // Decision on hypothesis fate
                if (hypothesis.confidence > 0.8 && hypothesis.testAttempts > 2) {
                    this.confirmHypothesis(hypothesis);
                } else if (hypothesis.confidence < 0.1 && hypothesis.testAttempts > 3) {
                    this.rejectHypothesis(hypothesis);
                }
            }
        }
    }

    evaluateHypothesisAgainstEvidence(hypothesis, evidence) {
        // Specific evaluation logic based on hypothesis type
        const evaluators = {
            'names_identify_people': this.evaluateNameHypothesis,
            'repeated_words_mean_urgency': this.evaluateRepetitionHypothesis,
            'tone_indicates_emotion': this.evaluateToneHypothesis
        };

        const evaluator = evaluators[hypothesis.id];
        if (evaluator) {
            return evaluator.call(this, hypothesis, evidence);
        }

        return { relevant: false, supports: false };
    }

    evaluateNameHypothesis(hypothesis, evidence) {
        if (evidence.eventType === 'person_introduced') {
            // Check if person was successfully registered with name
            const wasRegistered = evidence.details.personRegistered;
            const nameWasUsed = evidence.details.nameRecognized;
            
            return {
                relevant: true,
                supports: wasRegistered && nameWasUsed
            };
        }
        return { relevant: false };
    }

    evaluateRepetitionHypothesis(hypothesis, evidence) {
        if (evidence.details.hasRepetition && evidence.context.userResponse) {
            const quickResponse = evidence.context.responseTime < 5000;
            const positiveResponse = evidence.context.userResponse.positive;
            
            return {
                relevant: true,
                supports: quickResponse || positiveResponse
            };
        }
        return { relevant: false };
    }

    evaluateToneHypothesis(hypothesis, evidence) {
        if (evidence.details.toneDetected && evidence.context.userEmotion) {
            const toneMatchesEmotion = evidence.details.toneDetected === evidence.context.userEmotion;
            
            return {
                relevant: true,
                supports: toneMatchesEmotion
            };
        }
        return { relevant: false };
    }

    confirmHypothesis(hypothesis) {
        hypothesis.status = 'confirmed';
        this.confirmedRules.set(hypothesis.id, {
            rule: hypothesis.hypothesis,
            confidence: hypothesis.confidence,
            confirmedAt: Date.now(),
            evidence: hypothesis.evidence
        });

        // Remove from active hypotheses
        this.currentHypotheses = this.currentHypotheses.filter(h => h.id !== hypothesis.id);
        
        console.log(`Hypothesis confirmed: ${hypothesis.hypothesis}`);
        
        // Update behavior based on confirmed rule
        this.integrateConfirmedRule(hypothesis);
    }

    rejectHypothesis(hypothesis) {
        hypothesis.status = 'rejected';
        this.rejectedHypotheses.push({
            ...hypothesis,
            rejectedAt: Date.now()
        });

        this.currentHypotheses = this.currentHypotheses.filter(h => h.id !== hypothesis.id);
        
        console.log(`Hypothesis rejected: ${hypothesis.hypothesis}`);
    }

    integrateConfirmedRule(hypothesis) {
        // Apply the confirmed rule to future behavior
        switch (hypothesis.id) {
            case 'names_identify_people':
                this.enhanceNameRecognition();
                break;
            case 'repeated_words_mean_urgency':
                this.adjustResponseToRepetition();
                break;
            case 'tone_indicates_emotion':
                this.improveToneRecognition();
                break;
        }
    }

    // ATTENTION AND GOAL MANAGEMENT
    updateAttentionAndGoals() {
        // Determine what should have creature's attention
        const newFocus = this.determineAttentionFocus();
        
        if (newFocus !== this.attentionFocus) {
            this.shiftAttention(newFocus);
        }

        // Update goals based on current state
        this.updateGoalStack();
    }

    determineAttentionFocus() {
        const priorities = [];
        
        // Urgent needs take priority
        if (this.creature.health < 20) {
            priorities.push({ focus: 'health_crisis', urgency: 0.9 });
        }
        if (this.creature.hunger < 15) {
            priorities.push({ focus: 'starvation', urgency: 0.85 });
        }
        
        // Social attention
        const timeSinceInteraction = Date.now() - this.creature.lastInteraction;
        if (timeSinceInteraction > 120000) { // 2 minutes
            priorities.push({ focus: 'loneliness', urgency: 0.6 });
        }
        
        // Learning opportunities
        if (this.currentHypotheses.length > 0) {
            priorities.push({ focus: 'hypothesis_testing', urgency: 0.4 });
        }
        
        // Active conversation
        if (this.entityManager.currentPerson) {
            priorities.push({ focus: 'social_interaction', urgency: 0.7 });
        }
        
        // Return highest priority focus
        priorities.sort((a, b) => b.urgency - a.urgency);
        return priorities[0]?.focus || 'general_awareness';
    }

    shiftAttention(newFocus) {
        const oldFocus = this.attentionFocus;
        this.attentionFocus = newFocus;
        
        console.log(`Attention shifted: ${oldFocus} → ${newFocus}`);
        
        // Record attention shift in conceptual memory
        this.conceptualMemory.recordEpisode('attention_shift', {
            from: oldFocus,
            to: newFocus,
            reason: this.determineShiftReason(oldFocus, newFocus)
        });
    }

    updateGoalStack() {
        // Clear old goals and generate new ones based on current state
        this.goalStack = [];
        
        // Survival goals
        if (this.creature.hunger < 30) {
            this.goalStack.push({ goal: 'get_food', priority: 0.8 });
        }
        if (this.creature.energy < 20) {
            this.goalStack.push({ goal: 'get_rest', priority: 0.7 });
        }
        if (this.creature.health < 40) {
            this.goalStack.push({ goal: 'get_medicine', priority: 0.9 });
        }
        
        // Social goals
        if (this.creature.trustLevel < 50) {
            this.goalStack.push({ goal: 'build_trust', priority: 0.6 });
        }
        if (Date.now() - this.creature.lastInteraction > 180000) {
            this.goalStack.push({ goal: 'get_attention', priority: 0.5 });
        }
        
        // Learning goals
        if (this.currentHypotheses.length > 0) {
            this.goalStack.push({ goal: 'test_hypotheses', priority: 0.4 });
        }
        
        // Sort by priority
        this.goalStack.sort((a, b) => b.priority - a.priority);
    }

    // DECISION MAKING
    makeDecision(situation, options) {
        // Evaluate each option based on current goals and knowledge
        const evaluatedOptions = options.map(option => ({
            option: option,
            score: this.evaluateOption(option, situation)
        }));
        
        // Choose best option (with some randomness to avoid being too predictable)
        evaluatedOptions.sort((a, b) => b.score - a.score);
        
        // Add some randomness - sometimes choose second-best option
        const choice = Math.random() < 0.8 ? evaluatedOptions[0] : evaluatedOptions[1];
        
        // Record decision in memory
        this.conceptualMemory.recordEpisode('decision_made', {
            situation: situation,
            options: options,
            chosen: choice?.option,
            reasoning: this.explainDecision(choice, evaluatedOptions)
        });
        
        return choice?.option;
    }

    calculateMetacognitionConfidence() {
        // Calculate confidence in our understanding of our own cognitive processes
        const factors = [];
        
        // Factor 1: How well do we understand our language capabilities
        if (this.confirmedRules.size > 5) factors.push(0.2);
        if (this.creature.vocabulary && this.creature.vocabulary.size > 20) factors.push(0.15);
        
        // Factor 2: How accurate our hypotheses have been
        const totalHypotheses = this.currentHypotheses.length + this.rejectedHypotheses.length + this.confirmedRules.size;
        if (totalHypotheses > 0) {
            const successRate = this.confirmedRules.size / totalHypotheses;
            factors.push(successRate * 0.3);
        }
        
        // Factor 3: Consistency of our decision making
        if (this.goalStack.length > 0) factors.push(0.1);
        
        // Factor 4: How well we can assess our own confidence
        const avgConfidence = this.currentHypotheses.reduce((sum, h) => sum + h.confidence, 0) / Math.max(this.currentHypotheses.length, 1);
        factors.push(Math.min(0.25, avgConfidence));
        
        const totalConfidence = factors.reduce((sum, factor) => sum + factor, 0);
        return Math.min(1.0, Math.max(0.1, totalConfidence));
    }

    evaluateOption(option, situation) {
        let score = 0;
        
        // Evaluate based on current goals
        for (let goal of this.goalStack) {
            if (this.optionSupportsGoal(option, goal)) {
                score += goal.priority * 10;
            }
        }
        
        // Consider past success/failure of similar options
        const pastOutcomes = this.recallSimilarDecisions(option);
        if (pastOutcomes.length > 0) {
            const successRate = pastOutcomes.filter(o => o.successful).length / pastOutcomes.length;
            score += successRate * 5;
        }
        
        // Factor in creature's current emotional state
        if (this.creature.mood === 'happy' && option.type === 'social') {
            score += 2;
        }
        if (this.creature.mood === 'angry' && option.type === 'aggressive') {
            score += 3;
        }
        
        return score;
    }

    optionSupportsGoal(option, goal) {
        const goalSupportMap = {
            'get_food': ['request_food', 'signal_hunger'],
            'get_rest': ['request_sleep', 'show_tiredness'],
            'get_medicine': ['request_help', 'show_sickness'],
            'build_trust': ['be_affectionate', 'respond_positively'],
            'get_attention': ['make_noise', 'perform_action'],
            'test_hypotheses': ['try_new_communication', 'observe_reaction']
        };
        
        const supportingOptions = goalSupportMap[goal.goal] || [];
        return supportingOptions.includes(option.type);
    }


    addEvidenceToHypothesis(hypothesisId, observation, context) {
    const hypothesis = this.currentHypotheses.find(h => h.id === hypothesisId);
    if (!hypothesis) {
        console.warn(`Hypothesis ${hypothesisId} not found`);
        return;
    }
    
    // Add new evidence
    hypothesis.evidence.push({
        observation: observation,
        context: context,
        timestamp: Date.now(),
        supporting: this.evaluateEvidenceSupport(hypothesis, observation, context)
    });
    
    // Update confidence based on evidence
    const supportingEvidence = hypothesis.evidence.filter(e => e.supporting);
    const contradictingEvidence = hypothesis.evidence.filter(e => !e.supporting);
    
    const supportRatio = supportingEvidence.length / hypothesis.evidence.length;
    hypothesis.confidence = Math.min(0.95, Math.max(0.05, supportRatio * 0.8 + 0.1));
    
    // Update test attempts
    hypothesis.testAttempts++;
    
    // Check if hypothesis should be confirmed or rejected
    if (hypothesis.confidence > 0.8 && hypothesis.testAttempts >= 3) {
        this.confirmHypothesis(hypothesis);
    } else if (hypothesis.confidence < 0.2 && hypothesis.testAttempts >= 5) {
        this.rejectHypothesis(hypothesis);
    }
    
    console.log(`Evidence added to hypothesis: ${hypothesis.hypothesis} (confidence: ${Math.round(hypothesis.confidence * 100)}%)`);
}

evaluateEvidenceSupport(hypothesis, observation, context) {
    // Simple heuristic to determine if evidence supports the hypothesis
    // This would be more sophisticated in a real implementation
    
    if (hypothesis.hypothesis.includes('gentle') && observation.type === 'gentle_touch') {
        return true;
    }
    
    if (hypothesis.hypothesis.includes('pattern') && observation.type.includes('observation')) {
        return true;
    }
    
    if (hypothesis.hypothesis.includes('happy') && context.mood === 'happy') {
        return true;
    }
    
    // Default to 70% chance of supporting evidence for learning
    return Math.random() < 0.7;
}

generateHypothesisId(observation) {
    return `hyp_${observation.type}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

processInteractionLearning(interpretation, context) {
    // Process learning from interactions
    this.analyzeInteractionPattern(interpretation, context);
    
    // Form hypotheses based on interaction outcomes
    this.generateInteractionHypotheses(interpretation, context);
    
    // Update social understanding
    this.updateSocialCognition(interpretation, context);
    
    // Adjust learning strategies based on interaction results
    this.adaptLearningStrategy(interpretation, context);
    
    console.log('Processed interaction learning:', interpretation.type);
}

analyzeInteractionPattern(interpretation, context) {
    // Analyze patterns in user interactions
    const patternKey = `${interpretation.type}_${context.creatureState.mood}`;
    
    if (!this.confidenceLevels.has(patternKey)) {
        this.confidenceLevels.set(patternKey, 0.1);
    }
    
    // Increase confidence in this pattern
    const currentConfidence = this.confidenceLevels.get(patternKey);
    this.confidenceLevels.set(patternKey, Math.min(0.95, currentConfidence + 0.05));
}

generateInteractionHypotheses(interpretation, context) {
    // Generate hypotheses about user behavior and interaction outcomes
    if (interpretation.type === 'gentle_touch' && context.creatureState.mood === 'happy') {
        this.formHypothesis({
            type: 'gentle_interaction_positive',
            context: context
        }, context);
    }
    
    if (interpretation.intensity > 0.8 && context.creatureState.trustLevel < 30) {
        this.formHypothesis({
            type: 'high_intensity_low_trust',
            context: context
        }, context);
    }
    
    // Hypothesis about user consistency
    if (this.countRecentSimilarInteractions(interpretation.type) > 3) {
        this.formHypothesis({
            type: 'user_consistency_pattern',
            context: context
        }, context);
    }
}

updateSocialCognition(interpretation, context) {
    // Update understanding of social dynamics
    if (interpretation.gentleness > 0.7) {
        this.updateGoal('build_trust', 0.2);
    }
    
    if (interpretation.playfulness > 0.6) {
        this.updateGoal('engage_socially', 0.3);
    }
    
    // Learn about user preferences
    this.learnUserPreferences(interpretation, context);
}

adaptLearningStrategy(interpretation, context) {
    // Adapt learning approach based on interaction success
    const interactionSuccess = this.evaluateInteractionSuccess(interpretation, context);
    
    if (interactionSuccess > 0.7) {
        this.learningMode = 'active'; // Become more engaged
        this.curiosityLevel = Math.min(1.0, this.curiosityLevel + 0.05);
    } else if (interactionSuccess < 0.3) {
        this.learningMode = 'cautious'; // Become more careful
        this.curiosityLevel = Math.max(0.1, this.curiosityLevel - 0.03);
    }
}

countRecentSimilarInteractions(interactionType) {
    // Count how many similar interactions happened recently
    if (!this.contextualState.social || !this.contextualState.social.recentInteractions) {
        return 0;
    }
    
    return this.contextualState.social.recentInteractions
        .filter(interaction => interaction.type === interactionType)
        .length;
}

updateGoal(goalType, priority) {
    // Update or add a goal
    const existingGoal = this.goalStack.find(g => g.goal === goalType);
    
    if (existingGoal) {
        existingGoal.priority = Math.min(1.0, existingGoal.priority + priority);
    } else {
        this.goalStack.push({
            goal: goalType,
            priority: priority,
            createdAt: Date.now(),
            status: 'active'
        });
        
        // Keep goal stack manageable
        if (this.goalStack.length > 10) {
            this.goalStack.sort((a, b) => b.priority - a.priority);
            this.goalStack = this.goalStack.slice(0, 8);
        }
    }
}

learnUserPreferences(interpretation, context) {
    // Learn what the user seems to prefer
    const preferenceData = {
        gentleness: interpretation.gentleness,
        playfulness: interpretation.playfulness,
        intensity: interpretation.intensity,
        timestamp: Date.now()
    };
    
    // Store in contextual state for pattern recognition
    if (!this.contextualState.userPreferences) {
        this.contextualState.userPreferences = [];
    }
    
    this.contextualState.userPreferences.push(preferenceData);
    
    // Keep only recent preferences
    if (this.contextualState.userPreferences.length > 20) {
        this.contextualState.userPreferences = this.contextualState.userPreferences.slice(-15);
    }
}

evaluateInteractionSuccess(interpretation, context) {
    // Evaluate how successful the interaction was
    let successScore = 0.5; // baseline
    
    // Positive indicators
    if (context.creatureState.mood === 'happy') successScore += 0.3;
    if (interpretation.gentleness > 0.6) successScore += 0.2;
    if (context.creatureState.trustLevel > 60) successScore += 0.2;
    
    // Negative indicators
    if (context.creatureState.mood === 'angry') successScore -= 0.4;
    if (interpretation.intensity > 0.9) successScore -= 0.1;
    if (context.creatureState.aggressionLevel > 50) successScore -= 0.3;
    
    return Math.max(0, Math.min(1, successScore));
}

identifyRelatedConcepts(observation) {
    const concepts = [];
    
    if (observation.type) {
        concepts.push(observation.type);
    }
    
    if (observation.context && observation.context.mood) {
        concepts.push(observation.context.mood);
    }
    
    if (observation.context && observation.context.interaction_type) {
        concepts.push(observation.context.interaction_type);
    }
    
    return concepts;
}

    // METACOGNITION - thinking about thinking
    assessSelfUnderstanding() {
        const selfAssessment = {
            languageAbility: this.calculateLanguageConfidence(),
            socialUnderstanding: this.calculateSocialConfidence(),
            learningProgress: this.calculateLearningProgress(),
            cognitiveLoad: this.calculateCognitiveLoad()
        };
        
        // Update metacognition map
        this.metacognition.set('self_assessment', {
            assessment: selfAssessment,
            timestamp: Date.now(),
            confidence: this.calculateMetacognitionConfidence()
        });
        
        return selfAssessment;
    }

    calculateLanguageConfidence() {
        const confirmedRules = this.confirmedRules.size;
        const activeHypotheses = this.currentHypotheses.length;
        const vocabularySize = this.creature.vocabulary ? this.creature.vocabulary.size : 0;
        
        return Math.min(1.0, (confirmedRules * 0.3 + vocabularySize * 0.02 + activeHypotheses * 0.1));
    }

    calculateSocialConfidence() {
        const knownPeople = this.entityManager.getAllKnownPeople().length;
        const averageTrust = knownPeople > 0 ? 
            this.entityManager.getAllKnownPeople()
                .reduce((sum, person) => sum + (person.relationship?.trust || 50), 0) / knownPeople 
            : 50;
        
        return Math.min(1.0, (knownPeople * 0.1 + averageTrust * 0.01));
    }

    calculateLearningProgress() {
        const conceptsLearned = this.conceptualMemory.concepts.size;
        const episodicMemories = this.conceptualMemory.episodicMemory.length;
        
        return Math.min(1.0, (conceptsLearned * 0.05 + episodicMemories * 0.01));
    }

    calculateCognitiveLoad() {
        const workingMemoryLoad = this.conceptualMemory.workingMemory.length / 7; // max capacity
        const hypothesesLoad = this.currentHypotheses.length / 10; // reasonable max
        const goalLoad = this.goalStack.length / 5; // reasonable max
        
        return Math.min(1.0, (workingMemoryLoad + hypothesesLoad + goalLoad) / 3);
    }

    // UTILITY METHODS
    generateCognitiveResponse() {
        // Generate thoughts or actions based on current cognitive state
        const currentGoal = this.goalStack[0];
        const attentionState = this.attentionFocus;
        
        if (currentGoal && Math.random() < 0.3) {
            this.expressGoalBasedThought(currentGoal);
        }
        
        if (this.currentHypotheses.length > 0 && Math.random() < 0.2) {
            this.expressLearningThought();
        }
    }

    expressGoalBasedThought(goal) {
        // Let the creature express what it's trying to achieve
        if (window.tamagotchiGame && window.tamagotchiGame.languageLearning) {
            const thoughtContext = this.translateGoalToThought(goal.goal);
            window.tamagotchiGame.languageLearning.expressThought(thoughtContext, goal.priority);
        }
    }

    translateGoalToThought(goalType) {
        const translations = {
            'get_food': 'hungry',
            'get_rest': 'tired',
            'get_medicine': 'sick',
            'build_trust': 'social',
            'get_attention': 'lonely',
            'test_hypotheses': 'curious'
        };
        
        return translations[goalType] || 'general';
    }

    getRecentInteractions() {
        return this.conceptualMemory.recallEpisodes({
            timeframe: 300000, // last 5 minutes
            concepts: ['human', 'social']
        }).slice(0, 5);
    }

    identifyRelatedConcepts(observation) {
        // Simple concept identification - could be much more sophisticated
        const conceptKeywords = {
            'name': ['name', 'called', 'identity'],
            'emotion': ['happy', 'sad', 'angry', 'tone'],
            'communication': ['speak', 'talk', 'word', 'language'],
            'social': ['person', 'human', 'interaction', 'relationship']
        };
        
        const observationText = JSON.stringify(observation).toLowerCase();
        const relatedConcepts = [];
        
        for (let [concept, keywords] of Object.entries(conceptKeywords)) {
            if (keywords.some(keyword => observationText.includes(keyword))) {
                relatedConcepts.push(concept);
            }
        }
        
        return relatedConcepts;
    }

    generateHypothesisId(observation) {
        return observation.type + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    // PUBLIC INTERFACE
    getCurrentThoughts() {
        return {
            attention: this.attentionFocus,
            goals: this.goalStack.slice(0, 3),
            hypotheses: this.currentHypotheses.length,
            confidence: this.calculateLanguageConfidence()
        };
    }

    getDebugInfo() {
        return {
            currentHypotheses: this.currentHypotheses.map(h => ({
                hypothesis: h.hypothesis,
                confidence: Math.round(h.confidence * 100) + '%',
                status: h.status
            })),
            confirmedRules: Array.from(this.confirmedRules.entries()),
            attentionFocus: this.attentionFocus,
            goals: this.goalStack.slice(0, 5),
            metacognition: this.assessSelfUnderstanding()
        };
    }

    serialize() {
        return {
            currentHypotheses: this.currentHypotheses,
            confirmedRules: Array.from(this.confirmedRules.entries()),
            contextualState: this.contextualState,
            confidenceLevels: Array.from(this.confidenceLevels.entries()),
            learningMode: this.learningMode,
            curiosityLevel: this.curiosityLevel
        };
    }

    // Add this method to the CognitiveProcessor class around line 85:

    processWorkingMemory() {
        // Process items currently in working memory
        const workingMemoryContents = this.conceptualMemory.getWorkingMemoryContents();
        
        for (let item of workingMemoryContents) {
            // Process each working memory item
            if (item.type === 'hypothesis_test') {
                this.processWorkingMemoryHypothesis(item);
            } else if (item.type === 'decision_pending') {
                this.processWorkingMemoryDecision(item);
            } else if (item.type === 'attention_focus') {
                this.processWorkingMemoryAttention(item);
            }
        }
        
        // Clear processed items
        this.conceptualMemory.clearWorkingMemory();
    }

    processWorkingMemoryHypothesis(item) {
        // Process hypothesis-related working memory
        const hypothesis = this.currentHypotheses.find(h => h.id === item.hypothesisId);
        if (hypothesis) {
            this.testHypothesis(hypothesis);
        }
    }

    processWorkingMemoryDecision(item) {
        // Process pending decisions
        if (item.options && item.situation) {
            const decision = this.makeDecision(item.situation, item.options);
            item.resolved = true;
            item.decision = decision;
        }
    }

    processWorkingMemoryAttention(item) {
        // Process attention-related working memory
        if (item.focusTarget !== this.attentionFocus) {
            this.shiftAttention(item.focusTarget);
        }
    }

    deserialize(data) {
        if (data.currentHypotheses) this.currentHypotheses = data.currentHypotheses;
        if (data.confirmedRules) this.confirmedRules = new Map(data.confirmedRules);
        if (data.contextualState) this.contextualState = data.contextualState;
        if (data.confidenceLevels) this.confidenceLevels = new Map(data.confidenceLevels);
        if (data.learningMode) this.learningMode = data.learningMode;
        if (data.curiosityLevel) this.curiosityLevel = data.curiosityLevel;
    }
}
// ConceptualMemory - handles abstract concept formation and episodic memory
class ConceptualMemory {
    constructor() {
        this.concepts = new Map(); // abstract ideas and their relationships
        this.episodicMemory = []; // specific events with full context
        this.semanticNetwork = new Map(); // how concepts connect to each other
        this.workingMemory = []; // currently active thoughts/processing
        this.memoryStrength = new Map(); // how well concepts are remembered
        
        // Learning mechanisms
        this.conceptFormationThreshold = 3; // how many examples needed for concept
        this.memoryDecayRate = 0.95; // how memories fade over time
        this.maxEpisodicMemories = 100; // prevent memory overflow
        
        this.init();
    }

    init() {
        this.initializeBasicConcepts();
        this.startMemoryMaintenance();
        console.log('Conceptual Memory system initialized');
    }

    initializeBasicConcepts() {
        // Hardcode some basic concepts the creature starts with
        const basicConcepts = {
            'self': {
                definition: 'the creature itself',
                properties: ['hungry', 'happy', 'tired', 'sick'],
                relationships: [],
                examples: [],
                strength: 1.0,
                createdAt: Date.now()
            },
            'human': {
                definition: 'beings that take care of creature',
                properties: ['talks', 'feeds', 'plays', 'has_name'],
                relationships: [],
                examples: [],
                strength: 0.8,
                createdAt: Date.now()
            },
            'food': {
                definition: 'things that satisfy hunger',
                properties: ['reduces_hunger', 'makes_happy'],
                relationships: [['human', 'gives'], ['self', 'eats']],
                examples: [],
                strength: 0.9,
                createdAt: Date.now()
            },
            'name': {
                definition: 'labels for individuals',
                properties: ['identifies_person', 'unique_to_individual'],
                relationships: [['human', 'has'], ['self', 'has']],
                examples: [],
                strength: 0.6,
                createdAt: Date.now()
            },
            'play': {
                definition: 'fun activities that increase happiness',
                properties: ['fun', 'uses_energy', 'increases_happiness'],
                relationships: [['human', 'initiates'], ['self', 'enjoys']],
                examples: [],
                strength: 0.7,
                createdAt: Date.now()
            }
        };

        for (let [conceptName, conceptData] of Object.entries(basicConcepts)) {
            this.concepts.set(conceptName, conceptData);
            this.memoryStrength.set(conceptName, conceptData.strength);
        }
    }

    // EPISODIC MEMORY - specific events
    recordEpisode(eventType, details, context = {}) {
        const episode = {
            id: Date.now() + Math.random(),
            eventType: eventType,
            timestamp: Date.now(),
            details: details,
            context: {
                creatureState: context.creatureState || {},
                peoplePresent: context.peoplePresent || [],
                emotionalState: context.emotionalState || 'neutral',
                location: context.location || 'home',
                ...context
            },
            relatedConcepts: this.identifyRelatedConcepts(eventType, details),
            importance: this.calculateImportance(eventType, details),
            recalled: 0 // how many times this memory has been accessed
        };

        this.episodicMemory.push(episode);
        
        // Update concept learning based on this episode
        this.learnFromEpisode(episode);
        
        // Trim old memories if needed
        this.maintainMemorySize();
        
        console.log(`New episode recorded: ${eventType}`, episode);
        return episode.id;
    }

    identifyRelatedConcepts(eventType, details) {
        const relatedConcepts = [];
        
        // Map event types to concepts
        const conceptMappings = {
            'person_introduced': ['human', 'name', 'social'],
            'fed': ['food', 'human', 'care', 'hunger'],
            'played': ['play', 'human', 'happiness', 'energy'],
            'petted': ['touch', 'human', 'affection', 'trust'],
            'scolded': ['human', 'negative', 'behavior', 'emotion'],
            'praised': ['human', 'positive', 'behavior', 'happiness'],
            'ignored': ['human', 'absence', 'loneliness', 'attention'],
            'learned_word': ['language', 'communication', 'human']
        };
        
        const mappedConcepts = conceptMappings[eventType] || [];
        relatedConcepts.push(...mappedConcepts);
        
        // Add concepts based on details content
        for (let [conceptName, concept] of this.concepts.entries()) {
            if (this.isConceptRelevant(conceptName, concept, details)) {
                if (!relatedConcepts.includes(conceptName)) {
                    relatedConcepts.push(conceptName);
                }
            }
        }
        
        return relatedConcepts;
    }

    //findCommonElements

    isConceptRelevant(conceptName, concept, details) {
        const detailsString = JSON.stringify(details).toLowerCase();
        
        // Check if concept properties appear in details
        for (let property of concept.properties || []) {
            if (detailsString.includes(property.toLowerCase())) {
                return true;
            }
        }
        
        // Check concept name
        if (detailsString.includes(conceptName.toLowerCase())) {
            return true;
        }
        
        return false;
    }

    calculateImportance(eventType, details) {
        let importance = 0.5; // base importance
        
        // Event type importance
        const importanceMultipliers = {
            'person_introduced': 0.9, // meeting people is very important
            'learned_word': 0.8,
            'praised': 0.7,
            'scolded': 0.8,
            'fed': 0.6,
            'played': 0.6,
            'petted': 0.5,
            'ignored': 0.7
        };
        
        importance = importanceMultipliers[eventType] || 0.5;
        
        // Adjust based on emotional intensity
        if (details.emotionalIntensity) {
            importance *= (0.5 + details.emotionalIntensity * 0.5);
        }
        
        // First-time events are more important
        if (details.isFirstTime) {
            importance *= 1.3;
        }
        
        return Math.min(1.0, importance);
    }

    // CONCEPT FORMATION AND LEARNING
    learnFromEpisode(episode) {
        // Strengthen related concepts
        for (let conceptName of episode.relatedConcepts) {
            this.strengthenConcept(conceptName);
        }
        
        // Try to form new concepts from patterns
        this.attemptConceptFormation(episode);
        
        // Update semantic network relationships
        this.updateSemanticRelationships(episode);
    }

    attemptConceptFormation(episode) {
        // Look for patterns in recent episodes to form new concepts
        const recentEpisodes = this.episodicMemory.slice(-10);
        const patterns = this.identifyPatterns(recentEpisodes);
        
        for (let pattern of patterns) {
            if (pattern.frequency >= this.conceptFormationThreshold) {
                this.createNewConcept(pattern);
            }
        }
    }

    identifyPatterns(episodes) {
        const patterns = [];
        const eventSequences = new Map();
        
        // Look for repeated event types
        for (let episode of episodes) {
            const key = episode.eventType;
            if (!eventSequences.has(key)) {
                eventSequences.set(key, []);
            }
            eventSequences.get(key).push(episode);
        }
        
        // Identify patterns with sufficient frequency
        for (let [eventType, episodeList] of eventSequences.entries()) {
            if (episodeList.length >= this.conceptFormationThreshold) {
                patterns.push({
                    type: 'repeated_event',
                    eventType: eventType,
                    frequency: episodeList.length,
                    examples: episodeList,
                    commonElements: this.findCommonElements(episodeList)
                });
            }
        }
        
        return patterns;
    }

    findCommonElements(episodes) {
        const commonElements = {
            contexts: {},
            outcomes: {},
            participants: {}
        };
        
        for (let episode of episodes) {
            // Count context elements (with null checks)
            if (episode.context && episode.context.emotionalState) {
                commonElements.contexts[episode.context.emotionalState] = 
                    (commonElements.contexts[episode.context.emotionalState] || 0) + 1;
            }
            
            // Count people present (with null checks)
            if (episode.context && episode.context.peoplePresent) {
                for (let person of episode.context.peoplePresent) {
                    commonElements.participants[person] = 
                        (commonElements.participants[person] || 0) + 1;
                }
            }
            
            // Count outcomes if available
            if (episode.details && episode.details.outcome) {
                commonElements.outcomes[episode.details.outcome] = 
                    (commonElements.outcomes[episode.details.outcome] || 0) + 1;
            }
        }
        
        return commonElements;
    }

    createNewConcept(pattern) {
        const conceptName = this.generateConceptName(pattern);
        
        if (this.concepts.has(conceptName)) return; // already exists
        
        const newConcept = {
            definition: this.generateConceptDefinition(pattern),
            properties: this.extractConceptProperties(pattern),
            relationships: [],
            examples: pattern.examples.map(ep => ep.id),
            strength: 0.3, // new concepts start weak
            createdAt: Date.now(),
            learnedFrom: pattern.type,
            confidence: pattern.frequency / 10 // confidence based on evidence
        };
        
        this.concepts.set(conceptName, newConcept);
        this.memoryStrength.set(conceptName, newConcept.strength);
        
        console.log(`New concept learned: ${conceptName}`, newConcept);
    }

    generateConceptName(pattern) {
        const baseNames = {
            'repeated_event': pattern.eventType + '_pattern',
            'person_behavior': 'behavior_' + pattern.commonElements.participants,
            'emotional_sequence': 'emotion_' + pattern.commonElements.contexts
        };
        
        return baseNames[pattern.type] || 'unknown_concept_' + Date.now();
    }

    // Add this method to ConceptualMemory class:
    update(currentTime) {
        // Process working memory items
        this.processWorkingMemoryItems();
        
        // Attempt concept formation from recent patterns
        this.attemptConceptFormation();
        
        // Update concept strengths
        this.updateConceptStrengths();
        
        // Maintain memory size and cleanup
        this.maintainMemorySize();
    }

    processWorkingMemoryItems() {
        // Process items in working memory
        const items = this.getWorkingMemoryContents();
        for (let item of items) {
            if (item.priority > 0.7) {
                // High priority items get immediate attention
                this.processHighPriorityItem(item);
            }
        }
    }

    processHighPriorityItem(item) {
        // Process high-priority working memory items
        if (item.type === 'urgent_memory') {
            this.recordEpisode(item.eventType, item.details, item.context);
        }
    }

    updateConceptStrengths() {
        // Gradually adjust concept strengths over time
        for (let [conceptName, concept] of this.concepts.entries()) {
            if (concept.strength > 0.1) {
                concept.strength *= 0.999; // Very slow decay
            }
        }
    }

    generateConceptDefinition(pattern) {
        const definitions = {
            'repeated_event': `Pattern of ${pattern.eventType} events that happen frequently`,
            'person_behavior': 'How specific people typically behave',
            'emotional_sequence': 'Emotional patterns that occur together'
        };
        
        return definitions[pattern.type] || 'A pattern observed in experiences';
    }

    extractConceptProperties(pattern) {
        const properties = [];
        
        if (pattern.frequency > 5) properties.push('frequent');
        if (pattern.commonElements.contexts) {
            properties.push(...Object.keys(pattern.commonElements.contexts));
        }
        
        return properties;
    }

    // SEMANTIC NETWORK - concept relationships
    updateSemanticRelationships(episode) {
        const concepts = episode.relatedConcepts;
        
        // Create relationships between co-occurring concepts
        for (let i = 0; i < concepts.length; i++) {
            for (let j = i + 1; j < concepts.length; j++) {
                const concept1 = concepts[i];
                const concept2 = concepts[j];
                
                this.strengthenConceptRelationship(concept1, concept2, episode.eventType);
            }
        }
    }

    strengthenConceptRelationship(concept1, concept2, context) {
        const key = concept1 < concept2 ? `${concept1}-${concept2}` : `${concept2}-${concept1}`;
        
        if (!this.semanticNetwork.has(key)) {
            this.semanticNetwork.set(key, {
                concepts: [concept1, concept2],
                strength: 0,
                contexts: [],
                examples: []
            });
        }
        
        const relationship = this.semanticNetwork.get(key);
        relationship.strength = Math.min(1.0, relationship.strength + 0.1);
        
        if (!relationship.contexts.includes(context)) {
            relationship.contexts.push(context);
        }
    }

    // MEMORY RETRIEVAL
    recallEpisodes(query) {
        const relevantEpisodes = [];
        
        for (let episode of this.episodicMemory) {
            let relevanceScore = 0;
            
            // Check event type match
            if (query.eventType && episode.eventType === query.eventType) {
                relevanceScore += 0.4;
            }
            
            // Check concept relevance
            if (query.concepts) {
                for (let concept of query.concepts) {
                    if (episode.relatedConcepts.includes(concept)) {
                        relevanceScore += 0.2;
                    }
                }
            }
            
            // Check time relevance
            if (query.timeframe) {
                const timeDiff = Date.now() - episode.timestamp;
                if (timeDiff <= query.timeframe) {
                    relevanceScore += 0.2;
                }
            }
            
            // Check people present
            if (query.peoplePresent) {
                for (let person of query.peoplePresent) {
                    if (episode.context.peoplePresent?.includes(person)) {
                        relevanceScore += 0.2;
                    }
                }
            }
            
            if (relevanceScore > 0.3) {
                relevantEpisodes.push({
                    episode: episode,
                    relevance: relevanceScore
                });
                
                // Update recall count
                episode.recalled++;
            }
        }
        
        // Sort by relevance
        return relevantEpisodes
            .sort((a, b) => b.relevance - a.relevance)
            .map(item => item.episode);
    }

    getConcept(conceptName) {
        const concept = this.concepts.get(conceptName);
        if (concept) {
            // Accessing a concept strengthens it slightly
            this.strengthenConcept(conceptName, 0.05);
        }
        return concept;
    }

    strengthenConcept(conceptName, amount = 0.1) {
        const currentStrength = this.memoryStrength.get(conceptName) || 0;
        const newStrength = Math.min(1.0, currentStrength + amount);
        this.memoryStrength.set(conceptName, newStrength);
        
        // Update concept object if it exists
        const concept = this.concepts.get(conceptName);
        if (concept) {
            concept.strength = newStrength;
        }
    }

    // WORKING MEMORY - active processing
    addToWorkingMemory(item) {
        this.workingMemory.push({
            item: item,
            timestamp: Date.now(),
            priority: item.priority || 0.5
        });
        
        // Keep working memory limited
        if (this.workingMemory.length > 7) { // magic number 7±2
            this.workingMemory.sort((a, b) => b.priority - a.priority);
            this.workingMemory = this.workingMemory.slice(0, 5);
        }
    }

    getWorkingMemoryContents() {
        return this.workingMemory
            .sort((a, b) => b.priority - a.priority)
            .map(item => item.item);
    }

    clearWorkingMemory() {
        this.workingMemory = [];
    }

    // MEMORY MAINTENANCE
    startMemoryMaintenance() {
        // Run memory maintenance every 30 seconds
        setInterval(() => {
            this.performMemoryDecay();
            this.maintainMemorySize();
        }, 30000);
    }

    performMemoryDecay() {
        // Gradually weaken unused concepts
        for (let [conceptName, strength] of this.memoryStrength.entries()) {
            const concept = this.concepts.get(conceptName);
            if (concept && Date.now() - concept.createdAt > 300000) { // 5 minutes old
                const newStrength = strength * this.memoryDecayRate;
                this.memoryStrength.set(conceptName, newStrength);
                concept.strength = newStrength;
                
                // Remove very weak concepts
                if (newStrength < 0.1) {
                    this.concepts.delete(conceptName);
                    this.memoryStrength.delete(conceptName);
                    console.log(`Forgot weak concept: ${conceptName}`);
                }
            }
        }
    }

    maintainMemorySize() {
        if (this.episodicMemory.length > this.maxEpisodicMemories) {
            // Remove least important old memories
            this.episodicMemory.sort((a, b) => {
                const scoreA = a.importance * (1 + a.recalled * 0.1);
                const scoreB = b.importance * (1 + b.recalled * 0.1);
                return scoreA - scoreB;
            });
            
            const removed = this.episodicMemory.splice(0, this.episodicMemory.length - this.maxEpisodicMemories);
            console.log(`Removed ${removed.length} old memories`);
        }
    }

    // UTILITY METHODS
    getMemoryStats() {
        return {
            totalConcepts: this.concepts.size,
            totalEpisodes: this.episodicMemory.length,
            workingMemoryItems: this.workingMemory.length,
            semanticConnections: this.semanticNetwork.size,
            strongestConcepts: this.getStrongestConcepts(5),
            recentEpisodes: this.episodicMemory.slice(-5).map(ep => ({
                type: ep.eventType,
                time: new Date(ep.timestamp).toLocaleTimeString()
            }))
        };
    }

    getStrongestConcepts(limit = 10) {
        return Array.from(this.memoryStrength.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([name, strength]) => ({ name, strength: Math.round(strength * 100) }));
    }

    serialize() {
        return {
            concepts: Array.from(this.concepts.entries()),
            episodicMemory: this.episodicMemory.slice(-50), // save recent episodes
            semanticNetwork: Array.from(this.semanticNetwork.entries()),
            memoryStrength: Array.from(this.memoryStrength.entries())
        };
    }

    deserialize(data) {
        if (data.concepts) this.concepts = new Map(data.concepts);
        if (data.episodicMemory) this.episodicMemory = data.episodicMemory;
        if (data.semanticNetwork) this.semanticNetwork = new Map(data.semanticNetwork);
        if (data.memoryStrength) this.memoryStrength = new Map(data.memoryStrength);
    }
}
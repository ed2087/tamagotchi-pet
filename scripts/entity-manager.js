// EntityManager - tracks people, relationships, and personalized naming
class EntityManager {
    constructor() {
        this.knownPeople = new Map(); // personId -> PersonProfile
        this.relationships = new Map(); // personId -> relationship data
        this.contextualNames = new Map(); // personId -> creature's name for them
        this.currentPerson = null; // who creature is currently interacting with
        this.meetingHistory = []; // log of first encounters
        
        // Name generation components
        this.nameGenerationRules = this.initializeNamingRules();
        this.observedTraits = new Map(); // personId -> observed characteristics
        
        this.init();
    }

    init() {
        console.log('Entity Manager initialized');
    }

    // PERSON REGISTRATION AND TRACKING
    registerPerson(inputText, context = 'chat') {
        const personInfo = this.extractPersonInfo(inputText);
        
        if (personInfo.name) {
            const personId = this.generatePersonId(personInfo.name);
            
            if (!this.knownPeople.has(personId)) {
                // First time meeting this person
                const profile = this.createPersonProfile(personInfo, context);
                this.knownPeople.set(personId, profile);
                this.initializeRelationship(personId, context);
                
                // Generate creature's personal name for them
                const petName = this.generatePersonalizedName(personId, personInfo);
                this.contextualNames.set(personId, petName);
                
                this.logMeeting(personId, personInfo.name, context);
                
                console.log(`New person registered: ${personInfo.name} (called "${petName}" by creature)`);
                return { isNewPerson: true, personId, profile, petName };
            } else {
                // Update existing person info
                this.updatePersonProfile(personId, personInfo, context);
                return { isNewPerson: false, personId, profile: this.knownPeople.get(personId) };
            }
        }
        
        return null;
    }

    extractPersonInfo(inputText) {
        const info = {
            name: null,
            relationship: null,
            context: [],
            introducedBy: null
        };
        
        // Pattern matching for name introductions
        const namePatterns = [
            /(?:my name is|i'm|i am|call me)\s+([a-zA-Z]+)/i,
            /(?:this is|meet|introduce)\s+([a-zA-Z]+)/i,
            /^([a-zA-Z]+)(?:\s+here|$)/i
        ];
        
        for (let pattern of namePatterns) {
            const match = inputText.match(pattern);
            if (match) {
                info.name = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
                break;
            }
        }
        
        // Extract relationship context
        const relationshipPatterns = [
            /my\s+(friend|mom|dad|sister|brother|colleague|teacher)/i,
            /(friend|family|work|school)/i
        ];
        
        for (let pattern of relationshipPatterns) {
            const match = inputText.match(pattern);
            if (match) {
                info.relationship = match[1].toLowerCase();
                break;
            }
        }
        
        return info;
    }

    createPersonProfile(personInfo, context) {
        return {
            name: personInfo.name,
            firstMet: Date.now(),
            lastInteraction: Date.now(),
            totalInteractions: 1,
            relationship: personInfo.relationship || 'unknown',
            observedTraits: [],
            communicationStyle: 'unknown',
            emotionalTone: 'neutral',
            interactionPatterns: {
                typical_greeting: null,
                favorite_topics: [],
                reaction_patterns: []
            },
            trustLevel: 50, // neutral starting point
            attachmentLevel: 10, // starts low
            contextFirstMet: context
        };
    }

    // PERSONALIZED NAME GENERATION
    generatePersonalizedName(personId, personInfo) {
        const profile = this.knownPeople.get(personId);
        const traits = this.observedTraits.get(personId) || [];
        
        // Base name components
        const prefixes = this.selectNamePrefixes(profile, traits);
        const suffixes = this.selectNameSuffixes(profile, traits);
        
        // Generate based on observed characteristics
        let baseName = personInfo.name.toLowerCase();
        let creatureName = '';
        
        // Different naming strategies based on creature's personality and relationship
        const namingStyle = this.selectNamingStyle(profile);
        
        switch (namingStyle) {
            case 'sound_mimicry':
                // Creature tries to say their name but modifies it
                creatureName = this.phoneticTransformation(baseName);
                break;
                
            case 'trait_based':
                // Names based on observed characteristics
                creatureName = this.generateTraitName(traits, prefixes);
                break;
                
            case 'affectionate':
                // Loving modifications of real name
                creatureName = this.generateAffectionateName(baseName, suffixes);
                break;
                
            case 'functional':
                // Names based on role/function
                creatureName = this.generateFunctionalName(profile, personInfo);
                break;
                
            default:
                creatureName = this.phoneticTransformation(baseName);
        }
        
        return creatureName;
    }

    selectNamingStyle(profile) {
        // Choose naming approach based on relationship and creature state
        if (profile.relationship === 'family') return 'affectionate';
        if (profile.trustLevel > 70) return 'affectionate';
        if (profile.trustLevel < 30) return 'functional';
        if (profile.totalInteractions < 3) return 'sound_mimicry';
        
        return Math.random() > 0.5 ? 'trait_based' : 'sound_mimicry';
    }

    phoneticTransformation(name) {
        // Creature's attempt at pronunciation with cute modifications
        const transformations = [
            // Simplify consonant clusters
            [/str/g, 'st'],
            [/thr/g, 'fr'],
            [/ck/g, 'k'],
            
            // Add creature-like sounds
            [/^ed/i, 'eda'],
            [/an$/i, 'ani'],
            [/er$/i, 'eri'],
            
            // Reduplication (baby-talk style)
            [/^([bcdfghklmnpqrstvwxz])/i, '$1i$1'],
        ];
        
        let result = name;
        for (let [pattern, replacement] of transformations) {
            if (Math.random() < 0.3) { // Apply randomly
                result = result.replace(pattern, replacement);
            }
        }
        
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    generateTraitName(traits, prefixes) {
        if (traits.length === 0) return this.getRandomName();
        
        const trait = traits[Math.floor(Math.random() * traits.length)];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        
        const traitNames = {
            gentle: ['softy', 'tender', 'sweet'],
            energetic: ['bouncy', 'zippy', 'sparky'],
            patient: ['steady', 'calm', 'gentle'],
            playful: ['silly', 'giggly', 'fun'],
            caring: ['hugger', 'nurture', 'warm']
        };
        
        const nameOptions = traitNames[trait] || ['friend', 'buddy', 'pal'];
        const baseName = nameOptions[Math.floor(Math.random() * nameOptions.length)];
        
        return prefix + baseName;
    }

    generateAffectionateName(baseName, suffixes) {
        const affectionateModifiers = [
            baseName + 'ie',
            baseName + 'y',
            baseName.slice(0, 2) + 'mi',
            baseName.slice(0, 3) + 'kins'
        ];
        
        return affectionateModifiers[Math.floor(Math.random() * affectionateModifiers.length)];
    }

    generateFunctionalName(profile, personInfo) {
        const functionalNames = {
            'unknown': ['person', 'human', 'visitor'],
            'friend': ['playmate', 'buddy', 'companion'],
            'family': ['family', 'kin', 'home'],
            'work': ['workperson', 'helper', 'colleague']
        };
        
        const options = functionalNames[profile.relationship] || functionalNames.unknown;
        return options[Math.floor(Math.random() * options.length)];
    }

    // RELATIONSHIP MANAGEMENT
    initializeRelationship(personId, context) {
        this.relationships.set(personId, {
            status: 'stranger',
            trust: 50,
            attachment: 10,
            communication_comfort: 30,
            shared_experiences: [],
            positive_interactions: 0,
            negative_interactions: 0,
            last_emotion: 'curious'
        });
    }

    updateRelationship(personId, interactionType, outcome) {
        const relationship = this.relationships.get(personId);
        if (!relationship) return;
        
        // Update based on interaction type and outcome
        switch (interactionType) {
            case 'gentle_interaction':
                relationship.trust = Math.min(100, relationship.trust + 5);
                relationship.attachment = Math.min(100, relationship.attachment + 3);
                relationship.positive_interactions++;
                break;
                
            case 'harsh_interaction':
                relationship.trust = Math.max(0, relationship.trust - 10);
                relationship.negative_interactions++;
                break;
                
            case 'ignored':
                relationship.attachment = Math.max(0, relationship.attachment - 2);
                break;
                
            case 'praised':
                relationship.trust = Math.min(100, relationship.trust + 8);
                relationship.attachment = Math.min(100, relationship.attachment + 5);
                relationship.positive_interactions++;
                break;
        }
        
        // Update relationship status based on metrics
        this.updateRelationshipStatus(personId);
    }

    updateRelationshipStatus(personId) {
        const relationship = this.relationships.get(personId);
        const profile = this.knownPeople.get(personId);
        
        if (relationship.trust > 80 && relationship.attachment > 60) {
            relationship.status = 'close_friend';
        } else if (relationship.trust > 60 && relationship.attachment > 40) {
            relationship.status = 'friend';
        } else if (relationship.trust < 30) {
            relationship.status = 'distrusted';
        } else if (profile.totalInteractions > 10) {
            relationship.status = 'acquaintance';
        }
    }

    // TRAIT OBSERVATION
    observeTrait(personId, trait, evidence) {
        if (!this.observedTraits.has(personId)) {
            this.observedTraits.set(personId, []);
        }
        
        const traits = this.observedTraits.get(personId);
        const existingTrait = traits.find(t => t.trait === trait);
        
        if (existingTrait) {
            existingTrait.confidence = Math.min(1.0, existingTrait.confidence + 0.1);
            existingTrait.evidence.push(evidence);
        } else {
            traits.push({
                trait: trait,
                confidence: 0.3,
                evidence: [evidence],
                firstObserved: Date.now()
            });
        }
    }

    // UTILITY METHODS
    initializeNamingRules() {
        return {
            prefixes: {
                affectionate: ['my', 'dear', 'sweet', 'little'],
                functional: ['the', 'that', 'main'],
                playful: ['silly', 'bouncy', 'wiggly', 'giggly']
            },
            suffixes: {
                diminutive: ['ie', 'y', 'kins', 'let'],
                affectionate: ['love', 'heart', 'dear'],
                creature_style: ['boop', 'fluff', 'nug', 'bit']
            }
        };
    }

    selectNamePrefixes(profile, traits) {
        if (profile.relationship === 'family') return this.nameGenerationRules.prefixes.affectionate;
        if (traits.some(t => t.trait === 'playful')) return this.nameGenerationRules.prefixes.playful;
        return this.nameGenerationRules.prefixes.functional;
    }

    selectNameSuffixes(profile, traits) {
        if (profile.trustLevel > 70) return this.nameGenerationRules.suffixes.affectionate;
        if (traits.some(t => t.trait === 'gentle')) return this.nameGenerationRules.suffixes.diminutive;
        return this.nameGenerationRules.suffixes.creature_style;
    }

    generatePersonId(name) {
        return name.toLowerCase() + '_' + Date.now();
    }

    logMeeting(personId, realName, context) {
        this.meetingHistory.push({
            personId: personId,
            realName: realName,
            context: context,
            timestamp: Date.now(),
            creatureName: this.contextualNames.get(personId)
        });
    }

    getRandomName() {
        const randomNames = ['buddy', 'friend', 'pal', 'mate', 'companion'];
        return randomNames[Math.floor(Math.random() * randomNames.length)];
    }

    // PUBLIC INTERFACE METHODS
    getCurrentPersonName(personId) {
        return this.contextualNames.get(personId) || 'someone';
    }

    getRelationshipSummary(personId) {
        const profile = this.knownPeople.get(personId);
        const relationship = this.relationships.get(personId);
        
        if (!profile || !relationship) return null;
        
        return {
            realName: profile.name,
            creatureName: this.contextualNames.get(personId),
            relationship: relationship.status,
            trust: relationship.trust,
            attachment: relationship.attachment,
            interactions: profile.totalInteractions
        };
    }

    getAllKnownPeople() {
        const people = [];
        this.knownPeople.forEach((profile, personId) => {
            people.push({
                personId: personId,
                realName: profile.name,
                creatureName: this.contextualNames.get(personId),
                relationship: this.relationships.get(personId)?.status || 'unknown',
                lastSeen: profile.lastInteraction
            });
        });
        return people;
    }

    serialize() {
        return {
            knownPeople: Array.from(this.knownPeople.entries()),
            relationships: Array.from(this.relationships.entries()),
            contextualNames: Array.from(this.contextualNames.entries()),
            observedTraits: Array.from(this.observedTraits.entries()),
            meetingHistory: this.meetingHistory
        };
    }

    deserialize(data) {
        if (data.knownPeople) this.knownPeople = new Map(data.knownPeople);
        if (data.relationships) this.relationships = new Map(data.relationships);
        if (data.contextualNames) this.contextualNames = new Map(data.contextualNames);
        if (data.observedTraits) this.observedTraits = new Map(data.observedTraits);
        if (data.meetingHistory) this.meetingHistory = data.meetingHistory;
    }
}
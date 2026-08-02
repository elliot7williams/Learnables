// Story Data Manager - Handles all story content and generation
class StoryDataManager {
    static stories = [];
    
    static getAllStories() {
        if (this.stories.length === 0) {
            this.loadStories();
        }
        return this.stories;
    }
    
    static getStartingStory() {
        const stories = this.getAllStories();
        return stories[0] || this.createDefaultStory();
    }
    
    static getStoryById(id) {
        return this.getAllStories().find(story => story.id === id);
    }
    
    static loadStories() {
        this.stories = this.createComprehensiveStorySet();
    }
    
    static createDefaultStory() {
        const challenge = {
            type: 'vocabulary',
            question: "What does 'serendipity' mean?",
            options: ["A planned discovery", "A pleasant surprise", "A difficult situation", "A long journey"],
            correctAnswerIndex: 1,
            difficulty: 'easy'
        };
        
        const choice = {
            id: this.generateId(),
            text: "Accept the challenge",
            nextStoryId: null,
            challenge: challenge,
            consequence: null
        };
        
        return {
            id: this.generateId(),
            title: "The Beginning",
            description: "Welcome to your English learning adventure! You find yourself in a mystical village where words have power.",
            choices: [choice],
            requiredSkillLevel: 1,
            xpReward: 50
        };
    }
    
    static createComprehensiveStorySet() {
        let stories = [this.createDefaultStory()];
        
        // Generate diverse learning stories
        stories.push(...this.generateVocabularyStories());
        stories.push(...this.generateGrammarStories());
        stories.push(...this.generateReadingComprehensionStories());
        stories.push(...this.generateListeningStories());
        stories.push(...this.generateWritingStories());
        stories.push(...this.generateAdvancedLiteratureStories());
        stories.push(...this.generateBusinessEnglishStories());
        stories.push(...this.generateConversationalStories());
        stories.push(...this.generateIdiomStories());
        stories.push(...this.generatePronunciationStories());
        
        return stories;
    }
    
    static generateVocabularyStories() {
        const vocabularyData = [
            ["eloquent", ["Speaking clearly", "Speaking beautifully", "Speaking loudly", "Speaking quickly"], 1, "The orator's eloquent speech moved the entire audience."],
            ["ubiquitous", ["Rare", "Everywhere", "Hidden", "Expensive"], 1, "Smartphones have become ubiquitous in modern society."],
            ["ephemeral", ["Eternal", "Temporary", "Beautiful", "Dangerous"], 1, "The cherry blossoms' beauty is ephemeral, lasting only a few weeks."],
            ["fastidious", ["Careless", "Quick", "Very careful", "Hungry"], 2, "She was fastidious about keeping her workspace organized."],
            ["perspicacious", ["Confused", "Having keen insight", "Tired", "Angry"], 2, "The detective's perspicacious observations solved the case."],
            ["magnanimous", ["Selfish", "Generous in spirit", "Angry", "Small"], 2, "The winner was magnanimous in victory, praising their opponent."],
            ["pusillanimous", ["Brave", "Cowardly", "Large", "Intelligent"], 2, "His pusillanimous behavior disappointed his teammates."],
            ["sanguine", ["Pessimistic", "Optimistic", "Bloody", "Pale"], 1, "Despite setbacks, she remained sanguine about the project's success."],
            ["mellifluous", ["Harsh", "Sweet-sounding", "Loud", "Silent"], 2, "The singer's mellifluous voice captivated the audience."],
            ["recalcitrant", ["Obedient", "Stubbornly defiant", "Happy", "Sad"], 2, "The recalcitrant child refused to follow instructions."]
        ];
        
        const stories = [];
        
        vocabularyData.forEach(([word, options, correctIndex, context], index) => {
            const difficulty = index < 3 ? 'easy' : (index < 6 ? 'medium' : 'hard');
            
            const challenge = {
                type: 'vocabulary',
                question: `Based on the context: '${context}' What does '${word}' mean?`,
                options: options,
                correctAnswerIndex: correctIndex,
                difficulty: difficulty
            };
            
            const choices = [
                {
                    id: this.generateId(),
                    text: "Analyze the word carefully",
                    nextStoryId: null,
                    challenge: challenge,
                    consequence: null
                },
                {
                    id: this.generateId(),
                    text: "Skip this word for now",
                    nextStoryId: null,
                    challenge: null,
                    consequence: { type: 'neutral', description: "You missed learning a new word." }
                }
            ];
            
            stories.push({
                id: this.generateId(),
                title: `The ${word.charAt(0).toUpperCase() + word.slice(1)} Challenge`,
                description: `You encounter an ancient scroll containing the word '${word}'. Understanding its meaning could unlock hidden knowledge. ${context}`,
                choices: choices,
                requiredSkillLevel: Math.floor(index / 3) + 1,
                xpReward: 75 + (index * 5)
            });
        });
        
        return stories;
    }
    
    static generateGrammarStories() {
        const grammarChallenges = [
            ["The team _____ playing exceptionally well this season.", ["is", "are", "were", "be"], 0, "Collective noun 'team' is singular"],
            ["Neither the manager nor the employees _____ satisfied.", ["is", "are", "was", "be"], 1, "With 'neither...nor', verb agrees with the nearer subject"],
            ["Everyone in the office _____ working late tonight.", ["is", "are", "were", "have"], 0, "Indefinite pronouns like 'everyone' are singular"],
            ["The data _____ conclusive evidence of climate change.", ["shows", "show", "showing", "shown"], 1, "'Data' is plural form of 'datum'"],
            ["Physics _____ my favorite subject in school.", ["is", "are", "were", "be"], 0, "Subjects ending in -ics are usually singular"],
            ["By the time you arrive, I _____ the presentation.", ["will finish", "will have finished", "finish", "finished"], 1, "Future perfect for action completed before future time"],
            ["She said she _____ to the party if she had time.", ["will come", "would come", "comes", "came"], 1, "Conditional tense in reported speech"],
            ["If I _____ you, I would accept the job offer.", ["am", "was", "were", "will be"], 2, "Subjunctive mood in hypothetical situations"],
            ["I wish I _____ more time to complete the project.", ["have", "had", "will have", "would have"], 1, "Past tense after 'wish' for present situations"],
            ["It's time we _____ this issue seriously.", ["take", "took", "will take", "have taken"], 1, "Subjunctive after 'it's time'"]
        ];
        
        const stories = [];
        
        grammarChallenges.forEach(([sentence, options, correctIndex, explanation], index) => {
            const difficulty = index < 3 ? 'easy' : (index < 6 ? 'medium' : 'hard');
            
            const challenge = {
                type: 'grammar',
                question: `Complete the sentence correctly:\n${sentence}`,
                options: options,
                correctAnswerIndex: correctIndex,
                difficulty: difficulty
            };
            
            const choices = [
                {
                    id: this.generateId(),
                    text: "Analyze the grammar carefully",
                    nextStoryId: null,
                    challenge: challenge,
                    consequence: null
                },
                {
                    id: this.generateId(),
                    text: "Guess quickly",
                    nextStoryId: null,
                    challenge: challenge,
                    consequence: { type: 'injury', description: "Hasty decisions led to mistakes!" }
                }
            ];
            
            stories.push({
                id: this.generateId(),
                title: `Grammar Fortress Challenge ${index + 1}`,
                description: `The Grammar Guardians block your path with a linguistic puzzle. ${explanation} Choose wisely to proceed through the enchanted syntax forest.`,
                choices: choices,
                requiredSkillLevel: Math.floor(index / 3) + 1,
                xpReward: 80 + (index * 3)
            });
        });
        
        return stories;
    }
    
    static generateReadingComprehensionStories() {
        const readingPassages = [
            [
                "The Ancient Library",
                "In the heart of Alexandria stood the greatest library the world had ever known. Founded in the 3rd century BCE, it housed over 400,000 scrolls containing the accumulated knowledge of the ancient world. Scholars from across the Mediterranean came to study astronomy, mathematics, medicine, and philosophy. The library's most famous librarian, Eratosthenes, calculated the Earth's circumference with remarkable accuracy using only shadows and geometry. Unfortunately, the library's decline began in the Roman period, and by the 5th century CE, it had lost much of its former glory.",
                "What was Eratosthenes known for?",
                ["Founding the library", "Calculating Earth's circumference", "Collecting scrolls", "Teaching philosophy"],
                1
            ],
            [
                "The Butterfly Effect",
                "The butterfly effect, a concept from chaos theory, suggests that small changes in initial conditions can lead to large-scale and unpredictable consequences. The term comes from the metaphorical example of a butterfly flapping its wings in Brazil causing a tornado in Texas. This theory, popularized by meteorologist Edward Lorenz, demonstrates the sensitive dependence on initial conditions in complex systems. While often misunderstood as meaning that tiny events directly cause major disasters, it actually highlights the inherent unpredictability in complex systems like weather patterns.",
                "According to the passage, what does the butterfly effect actually demonstrate?",
                ["Small events cause disasters", "Weather is predictable", "Complex systems are unpredictable", "Butterflies affect weather"],
                2
            ]
        ];
        
        const stories = [];
        
        readingPassages.forEach(([title, passage, question, options, correctIndex], index) => {
            const difficulty = index === 0 ? 'easy' : 'medium';
            
            const challenge = {
                type: 'reading',
                question: `Read the passage about ${title} carefully, then answer:\n\n${passage}\n\n${question}`,
                options: options,
                correctAnswerIndex: correctIndex,
                difficulty: difficulty
            };
            
            const choices = [
                {
                    id: this.generateId(),
                    text: "Read carefully and answer",
                    nextStoryId: null,
                    challenge: challenge,
                    consequence: null
                },
                {
                    id: this.generateId(),
                    text: "Skim quickly",
                    nextStoryId: null,
                    challenge: challenge,
                    consequence: { type: 'injury', description: "Rushed reading led to misunderstanding!" }
                }
            ];
            
            stories.push({
                id: this.generateId(),
                title: `The Scholar's Test: ${title}`,
                description: "Ancient texts appear before you, glowing with mystical energy. The spirits of knowledge will only let you pass if you demonstrate true comprehension.",
                choices: choices,
                requiredSkillLevel: index + 1,
                xpReward: 100 + (index * 10)
            });
        });
        
        return stories;
    }
    
    static generateListeningStories() {
        const stories = [];
        
        for (let i = 1; i <= 20; i++) {
            const difficulty = i <= 7 ? 'easy' : (i <= 14 ? 'medium' : 'hard');
            
            const challenge = {
                type: 'listening',
                question: "Listen to the audio clip and identify the main emotion conveyed.",
                options: ["Joy", "Sadness", "Anger", "Surprise"],
                correctAnswerIndex: Math.floor(Math.random() * 4),
                difficulty: difficulty
            };
            
            const choices = [
                {
                    id: this.generateId(),
                    text: "Listen carefully",
                    nextStoryId: null,
                    challenge: challenge,
                    consequence: null
                },
                {
                    id: this.generateId(),
                    text: "Trust your instincts",
                    nextStoryId: null,
                    challenge: challenge,
                    consequence: { type: 'success', description: "Intuition served you well!" }
                }
            ];
            
            stories.push({
                id: this.generateId(),
                title: `Echo Chamber ${i}`,
                description: "The cave walls resonate with mysterious voices. Your ability to understand spoken English will determine if you can decipher their message.",
                choices: choices,
                requiredSkillLevel: Math.floor((i - 1) / 3) + 1,
                xpReward: 85 + i
            });
        }
        
        return stories;
    }
    
    static generateWritingStories() {
        const writingPrompts = [
            ["Descriptive Writing", "Choose the most vivid description:", ["The cat was big", "The enormous feline prowled majestically", "There was a cat", "A cat existed"], 1],
            ["Narrative Structure", "Which sentence best starts a story?", ["Once upon a time", "The explosion shattered the morning silence", "This is a story", "I will tell you about"], 1],
            ["Persuasive Writing", "Select the strongest argument opener:", ["I think that", "Evidence clearly demonstrates that", "Maybe we should", "It seems like"], 1],
            ["Character Development", "Which reveals character best?", ["John was brave", "John charged into the burning building", "John seemed fearless", "John appeared courageous"], 1],
            ["Setting Description", "Choose the most atmospheric setting:", ["It was dark", "Shadows danced menacingly across the moonlit graveyard", "The place was scary", "Nighttime arrived"], 1]
        ];
        
        const stories = [];
        
        writingPrompts.forEach(([category, prompt, options, correctIndex], categoryIndex) => {
            for (let variation = 1; variation <= 5; variation++) {
                const challenge = {
                    type: 'writing',
                    question: `${category}: ${prompt}`,
                    options: options,
                    correctAnswerIndex: correctIndex,
                    difficulty: variation <= 2 ? 'easy' : (variation <= 3 ? 'medium' : 'hard')
                };
                
                const choices = [
                    {
                        id: this.generateId(),
                        text: "Craft carefully",
                        nextStoryId: null,
                        challenge: challenge,
                        consequence: null
                    },
                    {
                        id: this.generateId(),
                        text: "Write instinctively",
                        nextStoryId: null,
                        challenge: challenge,
                        consequence: { type: 'neutral', description: "Sometimes instinct guides the pen." }
                    }
                ];
                
                stories.push({
                    id: this.generateId(),
                    title: `Scribe's Trial: ${category} ${variation}`,
                    description: "The mystical quill hovers before you, ready to test your writing prowess. The words you choose will shape reality itself.",
                    choices: choices,
                    requiredSkillLevel: categoryIndex + 1,
                    xpReward: 95 + (categoryIndex * 10) + (variation * 2)
                });
            }
        });
        
        return stories;
    }
    
    static generateAdvancedLiteratureStories() {
        const literaryWorks = [
            ["Shakespeare", "What does 'To be or not to be' contemplate?", ["Love", "Existence", "Death", "All of these"], 3],
            ["Jane Austen", "Pride and Prejudice explores themes of:", ["Social class", "Love", "Personal growth", "All of these"], 3],
            ["Charles Dickens", "A Tale of Two Cities begins with:", ["'It was the best of times'", "'Call me Ishmael'", "'In a hole lived a hobbit'", "'Once upon a time'"], 0],
            ["Emily Dickinson", "Her poetry is known for:", ["Unconventional punctuation", "Nature themes", "Death imagery", "All of these"], 3],
            ["Mark Twain", "The Adventures of Huckleberry Finn addresses:", ["Slavery", "Friendship", "Coming of age", "All of these"], 3]
        ];
        
        const stories = [];
        
        literaryWorks.forEach(([author, question, options, correctIndex], authorIndex) => {
            for (let level = 1; level <= 3; level++) {
                const challenge = {
                    type: 'reading',
                    question: `${author}: ${question}`,
                    options: options,
                    correctAnswerIndex: correctIndex,
                    difficulty: level === 1 ? 'easy' : (level === 2 ? 'medium' : 'hard')
                };
                
                const choices = [
                    {
                        id: this.generateId(),
                        text: "Delve into analysis",
                        nextStoryId: null,
                        challenge: challenge,
                        consequence: null
                    }
                ];
                
                stories.push({
                    id: this.generateId(),
                    title: `Literary Mastery: ${author} ${level}`,
                    description: "Enter the realm of classic literature where the greatest minds in English writing await your understanding.",
                    choices: choices,
                    requiredSkillLevel: level,
                    xpReward: 120 + level * 5
                });
            }
        });
        
        return stories;
    }
    
    static generateBusinessEnglishStories() {
        const businessScenarios = [
            ["Meeting", "The most professional way to disagree:", ["You're wrong", "I respectfully disagree", "That's stupid", "No way"], 1],
            ["Email", "Best email opening:", ["Hey", "Dear Sir/Madam", "Yo", "What's up"], 1],
            ["Presentation", "Engaging opener:", ["Um, hello", "Good morning, thank you for your time", "So, yeah", "Hi everyone"], 1],
            ["Negotiation", "Professional compromise:", ["Fine, whatever", "Let's find middle ground", "You win", "Forget it"], 1],
            ["Networking", "Best introduction:", ["I'm Bob", "I'm Bob Smith from XYZ Company", "Bob here", "Just Bob"], 1]
        ];
        
        const stories = [];
        
        businessScenarios.forEach(([scenario, question, options, correctIndex], scenarioIndex) => {
            for (let instance = 1; instance <= 3; instance++) {
                const challenge = {
                    type: 'vocabulary',
                    question: `${scenario} scenario: ${question}`,
                    options: options,
                    correctAnswerIndex: correctIndex,
                    difficulty: instance === 1 ? 'easy' : (instance === 2 ? 'medium' : 'hard')
                };
                
                const choices = [
                    {
                        id: this.generateId(),
                        text: "Choose professionally",
                        nextStoryId: null,
                        challenge: challenge,
                        consequence: null
                    },
                    {
                        id: this.generateId(),
                        text: "Be casual",
                        nextStoryId: null,
                        challenge: challenge,
                        consequence: { type: 'injury', description: "Informality hurt your professional image!" }
                    }
                ];
                
                stories.push({
                    id: this.generateId(),
                    title: `Corporate Quest: ${scenario} ${instance}`,
                    description: "Navigate the treacherous waters of professional communication where every word choice affects your career.",
                    choices: choices,
                    requiredSkillLevel: Math.floor(instance / 2) + 1,
                    xpReward: 110 + instance * 3
                });
            }
        });
        
        return stories;
    }
    
    static generateConversationalStories() {
        const situations = ["Restaurant", "Airport", "Hotel", "Shopping", "Hospital", "Bank", "School", "Office", "Park", "Library"];
        const stories = [];
        
        for (let i = 1; i <= 20; i++) {
            const situation = situations[i % situations.length];
            
            const challenge = {
                type: 'vocabulary',
                question: `In a ${situation.toLowerCase()}, how would you politely ask for help?`,
                options: ["Hey you", "Excuse me, could you help me?", "Help me now", "I need help"],
                correctAnswerIndex: 1,
                difficulty: i <= 7 ? 'easy' : (i <= 14 ? 'medium' : 'hard')
            };
            
            const choices = [
                {
                    id: this.generateId(),
                    text: "Be polite and respectful",
                    nextStoryId: null,
                    challenge: challenge,
                    consequence: null
                },
                {
                    id: this.generateId(),
                    text: "Be direct and quick",
                    nextStoryId: null,
                    challenge: challenge,
                    consequence: { type: 'neutral', description: "Directness can be efficient but may seem rude." }
                }
            ];
            
            stories.push({
                id: this.generateId(),
                title: `Social Interaction: ${situation} ${i}`,
                description: `Master the art of everyday conversation in a ${situation.toLowerCase()} setting where social skills are essential.`,
                choices: choices,
                requiredSkillLevel: Math.floor((i - 1) / 3) + 1,
                xpReward: 75 + i
            });
        }
        
        return stories;
    }
    
    static generateIdiomStories() {
        const idioms = [
            ["Break the ice", "Start a conversation", ["Destroy frozen water", "Start a conversation", "Stop talking", "Freeze something"]],
            ["Spill the beans", "Reveal a secret", ["Make a mess", "Cook dinner", "Reveal a secret", "Plant vegetables"]],
            ["Bite the bullet", "Face a difficult situation", ["Eat metal", "Face a difficult situation", "Shoot a gun", "Be brave in war"]],
            ["Hit the nail on the head", "Be exactly right", ["Use a hammer", "Be exactly right", "Hurt yourself", "Build something"]],
            ["Break a leg", "Good luck", ["Injure yourself", "Dance badly", "Good luck", "Fall down"]],
            ["It's raining cats and dogs", "Raining heavily", ["Animals falling", "Raining heavily", "Pet store sale", "Chaos outside"]],
            ["Piece of cake", "Very easy", ["Dessert", "Very easy", "Birthday party", "Sweet treat"]],
            ["Cost an arm and a leg", "Very expensive", ["Body parts for sale", "Very expensive", "Medical bill", "Amputation cost"]],
            ["Kill two birds with one stone", "Accomplish two things at once", ["Hunt efficiently", "Accomplish two things at once", "Be cruel to animals", "Use a slingshot"]],
            ["Let the cat out of the bag", "Reveal a secret", ["Free a pet", "Reveal a secret", "Make a mess", "Go shopping"]]
        ];
        
        const stories = [];
        
        idioms.forEach(([idiom, meaning, options], idiomIndex) => {
            const correctIndex = options.indexOf(meaning);
            
            for (let variation = 1; variation <= 2; variation++) {
                const challenge = {
                    type: 'vocabulary',
                    question: `What does the idiom '${idiom}' mean?`,
                    options: options,
                    correctAnswerIndex: correctIndex,
                    difficulty: variation === 1 ? 'easy' : 'medium'
                };
                
                const choices = [
                    {
                        id: this.generateId(),
                        text: "Think figuratively",
                        nextStoryId: null,
                        challenge: challenge,
                        consequence: null
                    },
                    {
                        id: this.generateId(),
                        text: "Take it literally",
                        nextStoryId: null,
                        challenge: challenge,
                        consequence: { type: 'injury', description: "Literal thinking missed the figurative meaning!" }
                    }
                ];
                
                stories.push({
                    id: this.generateId(),
                    title: `Idiom Island: ${idiom} ${variation}`,
                    description: "Navigate the mysterious realm where words mean more than they seem. Understanding idioms is key to cultural fluency.",
                    choices: choices,
                    requiredSkillLevel: variation,
                    xpReward: 85 + variation * 5
                });
            }
        });
        
        return stories;
    }
    
    static generatePronunciationStories() {
        const pronunciationChallenges = [
            ["Thorough", "Which is correct?", ["/θʌroʊ/", "/θɜroʊ/", "/θoroʊ/", "/θʊroʊ/"], 1],
            ["Colonel", "How is it pronounced?", ["/kolənel/", "/kɜrnəl/", "/kolonel/", "/kolɒnəl/"], 1],
            ["Archipelago", "Stress pattern:", ["ar-chi-PEL-a-go", "AR-chi-pel-a-go", "ar-CHI-pel-a-go", "ar-chi-pel-A-go"], 0],
            ["Worcestershire", "Pronunciation:", ["/wʊstərʃər/", "/wɔrsestərʃaɪər/", "/wɜrsɪstərʃər/", "/wɔrtsɪstərʃaɪər/"], 0],
            ["Epitome", "How to say it:", ["/epɪtoʊm/", "/ɪpɪtəmi/", "/epɪtəmi/", "/epɪtoʊmi/"], 1]
        ];
        
        const stories = [];
        
        pronunciationChallenges.forEach(([word, question, options, correctIndex], wordIndex) => {
            for (let level = 1; level <= 2; level++) {
                const challenge = {
                    type: 'listening',
                    question: `Pronunciation of '${word}': ${question}`,
                    options: options,
                    correctAnswerIndex: correctIndex,
                    difficulty: level === 1 ? 'easy' : 'medium'
                };
                
                const choices = [
                    {
                        id: this.generateId(),
                        text: "Listen carefully",
                        nextStoryId: null,
                        challenge: challenge,
                        consequence: null
                    },
                    {
                        id: this.generateId(),
                        text: "Sound it out",
                        nextStoryId: null,
                        challenge: challenge,
                        consequence: { type: 'neutral', description: "Phonetic thinking helped!" }
                    }
                ];
                
                stories.push({
                    id: this.generateId(),
                    title: `Pronunciation Portal: ${word} ${level}`,
                    description: "The guardians of spoken English test your ability to master the sounds that unlock clear communication.",
                    choices: choices,
                    requiredSkillLevel: level,
                    xpReward: 90 + level * 4
                });
            }
        });
        
        return stories;
    }
    
    static generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

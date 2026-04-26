import confetti from 'canvas-confetti';
import { generateText, generateImage } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const userLang = (() => {
        const lang = (navigator.language || 'en').toLowerCase();
        if (lang === 'zh-tw' || lang === 'zh-hk') {
            return 'zh-tw';
        }
        return lang.split('-')[0];
    })();

    const translations = {
        en: {
            title: "AI Visual Novel Generator",
            description: "Enter a theme for your visual novel (e.g., \"a lonely knight finds a magic sword\").",
            placeholder: "A haunted library where books whisper secrets to a young scholar...",
            stylePlaceholder: "Art style (optional, e.g., 'anime', 'oil painting'). Leave blank for AI to choose.",
            generateBtn: "Create Visual Novel",
            restartBtn: "Create a New Story",
            loadingStory: "Generating story...",
            loadingOutline: "Generating story outline from your theme...",
            loadingScript: "Fleshing out the story script...",
            loadingChars: "Generating character art... (this may take a moment)",
            loadingBgs: "Generating backgrounds...",
            errorTheme: "Sorry, something went wrong while generating the story. Please try again.",
            errorParse: "Could not parse the story. Please try a different one.",
            promptTheme: "Please enter a theme.",
            theEnd: "The End",
            clickRestart: "Click to create a new story.",
            narrator: "Narrator",
            exits: (name) => `(${name} exits.)`
        },
        'zh-tw': {
            title: "AI 視覺小說生成器",
            description: "為您的視覺小說輸入一個主題（例如，“一位孤獨的騎士找到了一把魔法劍”）。",
            placeholder: "一座鬧鬼的圖書館，書本對年輕的學者低語秘密...",
            stylePlaceholder: "美術風格（可選，例如 '動漫', '油畫'）。留空讓 AI 決定。",
            generateBtn: "創建視覺小說",
            restartBtn: "創建新故事",
            loadingStory: "正在生成故事...",
            loadingOutline: "正在根據您的主題生成故事大綱...",
            loadingScript: "正在豐富故事情節...",
            loadingChars: "正在生成角色美術...（這可能需要一些時間）",
            loadingBgs: "正在生成背景...",
            errorTheme: "抱歉，生成故事時發生錯誤。請再試一次。",
            errorParse: "無法解析故事。請嘗試不同的故事。",
            promptTheme: "請輸入一個主題。",
            theEnd: "劇終",
            clickRestart: "點擊以創建新故事。",
            narrator: "旁白",
            exits: (name) => `（${name} 離場。）`
        },
        es: {
            title: "Generador de Novelas Visuales IA",
            description: "Introduce un tema para tu novela visual (ej: \"un caballero solitario encuentra una espada mágica\").",
            placeholder: "Una biblioteca embrujada donde los libros susurran secretos a un joven erudito...",
            stylePlaceholder: "Estilo de arte (opcional, ej: 'anime', 'pintura al óleo'). Dejar en blanco para que la IA elija.",
            generateBtn: "Crear Novela Visual",
            restartBtn: "Crear una Nueva Historia",
            loadingStory: "Generando historia...",
            loadingOutline: "Generando esquema de la historia desde tu tema...",
            loadingScript: "Desarrollando el guion de la historia...",
            loadingChars: "Generando arte de personajes... (esto puede tardar un momento)",
            loadingBgs: "Generando fondos...",
            errorTheme: "Lo siento, algo salió mal al generar la historia. Por favor, inténtalo de nuevo.",
            errorParse: "No se pudo analizar la historia. Por favor, prueba con una diferente.",
            promptTheme: "Por favor, introduce un tema.",
            theEnd: "Fin",
            clickRestart: "Haz clic para crear una nueva historia.",
            narrator: "Narrador",
            exits: (name) => `(${name} sale.)`
        },
        fr: {
            title: "Générateur de Roman Visuel IA",
            description: "Entrez un thème pour votre roman visuel (par ex. \"un chevalier solitaire trouve une épée magique\").",
            placeholder: "Une bibliothèque hantée où les livres murmurent des secrets à un jeune érudit...",
            stylePlaceholder: "Style artistique (optionnel, ex: 'anime', 'peinture à l'huile'). Laisser vide pour que l'IA choisisse.",
            generateBtn: "Créer le Roman Visuel",
            restartBtn: "Créer une Nouvelle Histoire",
            loadingStory: "Génération de l'histoire...",
            loadingOutline: "Génération du plan de l'histoire à partir de votre thème...",
            loadingScript: "Étoffement du scénario de l'histoire...",
            loadingChars: "Génération des personnages... (cela peut prendre un moment)",
            loadingBgs: "Génération des arrière-plans...",
            errorTheme: "Désolé, une erreur est survenue lors de la génération de l'histoire. Veuillez réessayer.",
            errorParse: "Impossible d'analyser l'histoire. Veuillez en essayer une autre.",
            promptTheme: "Veuillez entrer un thème.",
            theEnd: "Fin",
            clickRestart: "Cliquez pour créer une nouvelle histoire.",
            narrator: "Narrateur",
            exits: (name) => `(${name} sort.)`
        },
        de: {
            title: "KI-Visual-Novel-Generator",
            description: "Gib ein Thema für deine Visual Novel ein (z.B. \"ein einsamer Ritter findet ein magisches Schwert\").",
            placeholder: "Eine Spukbibliothek, in der Bücher einem jungen Gelehrten Geheimnisse zuflüstern...",
            stylePlaceholder: "Kunststil (optional, z.B. 'Anime', 'Ölgemälde'). Leer lassen, damit die KI wählt.",
            generateBtn: "Visual Novel erstellen",
            restartBtn: "Neue Geschichte erstellen",
            loadingStory: "Geschichte wird generiert...",
            loadingOutline: "Handlungsübersicht wird aus deinem Thema generiert...",
            loadingScript: "Das Story-Skript wird ausgearbeitet...",
            loadingChars: "Charakterkunst wird generiert... (dies kann einen Moment dauern)",
            loadingBgs: "Hintergründe werden generiert...",
            errorTheme: "Entschuldigung, beim Erstellen der Geschichte ist ein Fehler aufgetreten. Bitte versuche es erneut.",
            errorParse: "Die Geschichte konnte nicht analysiert werden. Bitte versuche eine andere.",
            promptTheme: "Bitte gib ein Thema ein.",
            theEnd: "Ende",
            clickRestart: "Klicke, um eine neue Geschichte zu erstellen.",
            narrator: "Erzähler",
            exits: (name) => `(${name} geht.)`
        },
    };

    const T = translations[userLang] || translations.en;
    
    // --- UI Translation ---
    document.querySelector('title').textContent = T.title;
    document.querySelector('#creator-view h1').textContent = T.title;
    document.querySelector('#creator-view > p').textContent = T.description; // Make selector more specific
    document.getElementById('story-input').placeholder = T.placeholder;
    document.getElementById('style-input').placeholder = T.stylePlaceholder;
    document.getElementById('generate-btn').textContent = T.generateBtn;
    document.getElementById('restart-btn').textContent = T.restartBtn;
    document.getElementById('loading-text').textContent = T.loadingStory;
    // --- End UI Translation ---

    const creatorView = document.getElementById('creator-view');
    const loadingView = document.getElementById('loading-view');
    const gameView = document.getElementById('game-view');
    
    const storyInput = document.getElementById('story-input');
    const styleInput = document.getElementById('style-input');
    const generateBtn = document.getElementById('generate-btn');
    const loadingText = document.getElementById('loading-text');
    const restartBtn = document.getElementById('restart-btn');

    const backgroundContainer = document.getElementById('background-container');
    const characterContainer = document.getElementById('character-container');
    const dialogueBox = document.getElementById('dialogue-box');
    const characterNameEl = document.getElementById('character-name');
    const dialogueTextEl = document.getElementById('dialogue-text');

    let gameState = {};

    const switchView = (view) => {
        creatorView.classList.add('hidden');
        loadingView.classList.add('hidden');
        gameView.classList.add('hidden');
        view.classList.remove('hidden');
    };
    
    generateBtn.addEventListener('click', async () => {
        const theme = storyInput.value.trim();
        if (!theme) {
            alert(T.promptTheme);
            return;
        }
        const artStyle = styleInput.value.trim();
        await generateGameFromTheme(theme, artStyle);
    });

    gameView.addEventListener('click', advanceStory);
    restartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        switchView(creatorView);
        gameView.classList.add('hidden');
        restartBtn.classList.add('hidden');
        characterContainer.innerHTML = '';
        backgroundContainer.style.backgroundImage = '';
    });

    async function generateGameFromTheme(theme, artStyle) {
        switchView(loadingView);
        loadingText.textContent = T.loadingOutline;

        try {
            // Step 1: Generate the high-level story outline
            const storyOutline = await generateStoryOutline(theme, artStyle);
            if (!storyOutline || !storyOutline.style_prompt) {
                alert(T.errorTheme);
                switchView(creatorView);
                return;
            }

            // Step 2: Generate the full game script from the outline
            loadingText.textContent = T.loadingScript;
            const storyJson = await generateFullStory(storyOutline);
            if (!storyJson || !storyJson.scenes) {
                alert(T.errorParse);
                switchView(creatorView);
                return;
            }
            
            gameState.story = storyJson;
            gameState.currentSceneIndex = 0;
            gameState.currentEventIndex = 0;
            gameState.characterImages = {};
            gameState.backgroundImages = {};
            gameState.loadedCharacters = new Set();
            
            const stylePrompt = storyJson.style_prompt;
            loadingText.textContent = T.loadingChars;
            const characterPromises = storyJson.characters.map(char => 
                generateImage(`${char.image_prompt}, ${stylePrompt}, white background`, { aspectRatio: '2:3' })
                    .then(url => ({ name: char.name, url }))
            );
            const characterResults = await Promise.all(characterPromises);
            characterResults.forEach(res => {
                gameState.characterImages[res.name] = res.url;
            });

            loadingText.textContent = T.loadingBgs;
            const backgroundPromises = storyJson.scenes.map((scene, index) =>
                generateImage(`${scene.background_prompt}, ${stylePrompt}`, { aspectRatio: '4:3' })
                    .then(url => ({ index, url }))
            );
            const backgroundResults = await Promise.all(backgroundPromises);
            backgroundResults.forEach(res => {
                gameState.backgroundImages[res.index] = res.url;
            });

            startGame();
        } catch (error) {
            console.error("Error generating game from theme:", error);
            alert(T.errorTheme);
            switchView(creatorView);
        }
    }

    async function generateStoryOutline(theme, artStyle) {
        try {
            const styleInstruction = artStyle 
                ? `The user has specified an art style: "${artStyle}". Use this for the 'style_prompt' value.`
                : `Based on the story, determine a concise, evocative art style and use it for the 'style_prompt' value. Examples: 'Ghibli-inspired watercolor', 'dark fantasy oil painting', 'cyberpunk anime', 'pixel art'.`;

            return await generateText([{
                    role: 'system',
                    content: `You are an experienced author and screenwriter, skilled in crafting compelling narratives. Your task is to transform a user's theme into a structured outline for a short visual novel.
The story should have a clear beginning, middle, and end, following a classic three-act structure.
- **Act 1 (Setup):** Introduce the main characters, the world, and the central conflict or inciting incident.
- **Act 2 (Confrontation):** The characters attempt to resolve the conflict, facing rising stakes and complications. This should be the longest part of the story.
- **Act 3 (Resolution):** The story reaches its climax, and the conflict is resolved. Show the aftermath and character development.

The JSON must follow this schema:
{
  "title": "string",
  "overall_summary": "string (A short, 2-3 sentence summary of the entire story, highlighting the main character's journey)",
  "style_prompt": "string (A concise, evocative art style description in English, like 'vaporwave anime' or 'storybook illustration')",
  "characters": [ { "name": "string", "gender": "string (male|female)", "description": "string (A one-sentence description of the character, including their primary motivation)" } ],
  "chapters": [ { "title": "string", "summary": "string (A sentence summarizing this chapter's key event and its contribution to the plot)" } ]
}
Rules:
- All user-visible text ("title", "overall_summary", "description", chapter "title", "summary") must be in the user's language: ${userLang}. Character "name" should be appropriate for the language.
- All prompts for the system ("style_prompt") must be in English.
- ${styleInstruction}
- Create 2-3 compelling characters with distinct personalities and motivations.
- For each character, specify their gender as 'male' or 'female'. This is crucial for accurate visual generation.
- Create 3-5 chapters to map out the story's progression. Ensure the chapters logically follow the three-act structure.
- Respond ONLY with the JSON object. No other text.`,
                }, {
                    role: 'user',
                    content: `Theme: ${theme}`,
                }]);
        } catch (e) {
            console.error("Failed to generate story outline:", e);
            return null;
        }
    }
    
    async function generateFullStory(storyOutline) {
        try {
            return await generateText([{
                    role: 'system',
                    content: `You are a professional screenwriter. Expand the provided story outline into a complete visual novel script. Write engaging dialogue and clear, evocative narration that brings the scenes and characters to life.
The final JSON must follow this schema:
{
  "title": "string",
  "style_prompt": "string (A concise, evocative art style description in English)",
  "characters": [ { "name": "string", "image_prompt": "string (English description of character, full body, for image generation)" } ],
  "scenes": [ {
      "background_prompt": "string (English description of the background for image generation)",
      "events": [ { "type": "enter|dialogue|narration|exit", "character": "string (optional)", "text": "string (optional)" } ]
  } ]
}
Rules:
- All user-facing text ("title", "text" fields) MUST be in the user's language: ${userLang}. Character "name" should also be appropriate for the language.
- All prompts for image generation ("style_prompt", "image_prompt", "background_prompt") MUST be in English.
- The 'image_prompt' for characters should be a rich description based on the outline, focusing on appearance and personality.
- Crucially, the 'image_prompt' MUST start with the character's specified gender (e.g., "Male knight...", "Female scientist...") to ensure correct visual generation.
- Do NOT include style information like 'anime' or 'white background' in the image_prompt.
- Each "chapter" from the outline becomes a "scene". The events within each scene must faithfully expand on that chapter's summary from the outline.
- Use a mix of "narration" and "dialogue" to tell the story. Narration sets the scene and describes actions, while dialogue reveals character and advances the plot.
- Dialogue should be natural and reflect each character's personality.
- The first event for a character in a scene should be "enter" to make them appear.
- A character only needs one "enter" event per scene they appear in, at the beginning of their appearance.
- Use "exit" when a character leaves the scene before it ends.
- The pacing should be deliberate. Use narration to build atmosphere and let emotional moments breathe.
- Respond ONLY with the JSON object. No other text.`,
                }, {
                    role: 'user',
                    content: JSON.stringify(storyOutline),
                }]);
        } catch (e) {
            console.error("Failed to parse LLM response into JSON:", e);
            return null;
        }
    }

    function startGame() {
        switchView(gameView);
        restartBtn.classList.add('hidden');
        updateScene();
    }
    
    function advanceStory() {
        if (gameState.currentEventIndex >= gameState.story.scenes[gameState.currentSceneIndex].events.length - 1) {
            // End of scene
            if (gameState.currentSceneIndex >= gameState.story.scenes.length - 1) {
                // End of game
                endGame();
            } else {
                // Go to next scene
                gameState.currentSceneIndex++;
                gameState.currentEventIndex = 0;
                // Add a small delay for scene transitions
                setTimeout(() => {
                    characterContainer.style.opacity = 0;
                    backgroundContainer.style.opacity = 0;
                    setTimeout(() => {
                        updateScene();
                        characterContainer.style.opacity = 1;
                        backgroundContainer.style.opacity = 1;
                    }, 500);
                }, 200);
            }
        } else {
            // Go to next event in the same scene
            gameState.currentEventIndex++;
            updateEvent();
        }
    }

    function updateScene() {
        const scene = gameState.story.scenes[gameState.currentSceneIndex];
        backgroundContainer.style.backgroundImage = `url(${gameState.backgroundImages[gameState.currentSceneIndex]})`;
        
        // Clear characters that are not in the new scene
        const sceneCharacters = new Set(scene.events.map(e => e.character).filter(Boolean));
        const charactersToRemove = [...gameState.loadedCharacters].filter(c => !sceneCharacters.has(c));
        charactersToRemove.forEach(charName => {
            const charEl = document.querySelector(`.character-sprite[data-char="${charName}"]`);
            if (charEl) charEl.remove();
            gameState.loadedCharacters.delete(charName);
        });

        updateEvent();
    }

    function updateEvent() {
        const event = gameState.story.scenes[gameState.currentSceneIndex].events[gameState.currentEventIndex];
        
        // Skip events that would result in an empty dialogue box.
        if ((event.type === 'dialogue' || event.type === 'narration' || event.type === 'enter') && !event.text) {
            // We still need to process the 'enter' event to show the character, but without advancing.
            // So we'll run the character appearance logic here and then advance.
            if (event.type === 'enter') {
                let charEl = document.querySelector(`.character-sprite[data-char="${event.character}"]`);
                if (!charEl) {
                    charEl = document.createElement('img');
                    charEl.src = gameState.characterImages[event.character];
                    charEl.classList.add('character-sprite');
                    charEl.dataset.char = event.character;
                    characterContainer.appendChild(charEl);
                    gameState.loadedCharacters.add(event.character);
                    updateCharacterPositions();
                }
            }
            advanceStory();
            return;
        }
        
        const allSprites = document.querySelectorAll('.character-sprite');
        allSprites.forEach(el => el.classList.remove('active'));

        if (event.type === 'dialogue' || event.type === 'enter') {
            let charEl = document.querySelector(`.character-sprite[data-char="${event.character}"]`);
            if (!charEl) {
                charEl = document.createElement('img');
                charEl.src = gameState.characterImages[event.character];
                charEl.classList.add('character-sprite');
                charEl.dataset.char = event.character;
                characterContainer.appendChild(charEl);
                gameState.loadedCharacters.add(event.character);
                
                // New character entered, update all positions
                updateCharacterPositions();
            }
            charEl.classList.add('active');
        }

        if (event.type === 'exit') {
            const charEl = document.querySelector(`.character-sprite[data-char="${event.character}"]`);
            if (charEl) {
                charEl.remove();
                gameState.loadedCharacters.delete(event.character);
                // Character exited, update all positions
                updateCharacterPositions();
            }

            characterNameEl.textContent = '';
            dialogueTextEl.textContent = T.exits(event.character);
            return;
        }
        
        // Update scales for active/inactive after class change
        updateCharacterPositions();

        if (event.type === 'narration') {
            characterNameEl.textContent = T.narrator;
            dialogueTextEl.textContent = event.text;
        } else {
            characterNameEl.textContent = event.character;
            dialogueTextEl.textContent = event.text;
        }
    }

    function updateCharacterPositions() {
        const activeSprites = Array.from(document.querySelectorAll('.character-sprite'));
        const characterCount = activeSprites.length;

        if (characterCount === 0) return;

        // Determine the horizontal positions
        const positions = [];
        for (let i = 0; i < characterCount; i++) {
            positions.push((100 / (characterCount + 1)) * (i + 1));
        }

        // We need to sort the sprites based on their desired order on screen if possible
        // A simple sort by character name can provide consistency.
        activeSprites.sort((a, b) => a.dataset.char.localeCompare(b.dataset.char));

        activeSprites.forEach((sprite, i) => {
            sprite.style.left = `${positions[i]}%`;
            const isActive = sprite.classList.contains('active');
            const scale = isActive ? 'scale(1.05)' : 'scale(1)';
            sprite.style.transform = `translateX(-50%) ${scale}`;
        });
    }

    function endGame() {
        characterNameEl.textContent = T.theEnd;
        dialogueTextEl.textContent = T.clickRestart;
        restartBtn.classList.remove('hidden');
        gameView.removeEventListener('click', advanceStory);
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 }
        });
        setTimeout(() => gameView.addEventListener('click', advanceStory), 500); // prevent immediate restart
    }
    
    // This function is obsolete and replaced by the two-step process
    /*
    async function getStoryJson(storySummary, artStyle = '') {
        try {
            const styleInstruction = artStyle 
                ? `The user has specified an art style: "${artStyle}". Use this for the 'style_prompt' value.`
                : `Based on the story, determine a concise, evocative art style and use it for the 'style_prompt' value. Examples: 'Ghibli-inspired watercolor', 'dark fantasy oil painting', 'cyberpunk anime', 'pixel art', 'classic comic book style'.`;

            const completion = await websim.chat.completions.create({
                messages: [{
                    role: "system",
                    content: `You are a game script writer. Convert the user's story summary into a JSON object for a visual novel.
The JSON must follow this schema:
{
  "title": "string",
  "style_prompt": "string (A concise, evocative art style description in English)",
  "characters": [ { "name": "string", "image_prompt": "string (English description of character, full body, for image generation)" } ],
  "scenes": [ {
      "background_prompt": "string (English description of the background for image generation)",
      "events": [ { "type": "enter|dialogue|narration|exit", "character": "string (optional)", "text": "string (optional)" } ]
  } ]
}
Rules:
- All text for the user to see ("title", "text" fields) MUST be in the user's language: ${userLang}. The character "name" should also be appropriate for the language.
- All prompts for image generation ("style_prompt", "image_prompt", "background_prompt") MUST be in English.
- ${styleInstruction}
- The 'image_prompt' for characters should NOT include style information like 'anime' or 'transparent background', as this will be handled by the game engine. Just describe the character.
- Create 2-3 characters.
- Create 2-4 scenes.
- The first event for a character in a scene should be "enter". A character only needs one "enter" event per scene.
- DO NOT include the "position" field. Character positioning is handled automatically by the game engine.
- Use "narration" for setting the scene or describing actions.
- Use "dialogue" for character speech.
- Use "exit" when a character leaves before the scene ends.
- The final event should wrap up the story.
- Respond ONLY with the JSON object. No other text.`,
                }, {
                    role: 'user',
                    content: storySummary,
                }],
                json: true,
            });
            return JSON.parse(completion.content);
        } catch (e) {
            console.error("Failed to parse LLM response into JSON:", e);
            return null;
        }
    }
    */
});
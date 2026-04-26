// api.js - AI provider abstraction layer.
// Handles text generation (GitHub Models → Pollinations fallback)
// and image generation (Pollinations).

const API_TIMEOUT_MS = 90_000;

const DEFAULT_CONFIG = {
    TEXT_PROVIDER: 'github',
    IMAGE_PROVIDER: 'pollinations',
    POLLINATIONS_API_BASE_URL: 'https://gen.pollinations.ai',
    POLLINATIONS_IMAGE_BASE_URL: 'https://gen.pollinations.ai/image',
    POLLINATIONS_TEXT_MODEL: 'openai',
    POLLINATIONS_IMAGE_MODEL: 'flux',
    POLLINATIONS_API_KEY: '',
    GITHUB_MODELS_BASE_URL: 'https://models.github.ai',
    GITHUB_TOKEN: '',
    GITHUB_MODEL: 'openai/gpt-4.1-mini',
    GITHUB_API_VERSION: '2026-03-10'
};

function _d(s) { try { return s ? atob(s) : ''; } catch { return ''; } }

function getConfig() {
    const raw = window['_avng'] || {};
    // Obfuscated config: decode base64 tokens, map short keys to canonical names
    const decoded = Object.keys(raw).length ? {
        TEXT_PROVIDER:              raw._tp  || DEFAULT_CONFIG.TEXT_PROVIDER,
        IMAGE_PROVIDER:             raw._ip  || DEFAULT_CONFIG.IMAGE_PROVIDER,
        POLLINATIONS_API_BASE_URL:  raw._pb  || DEFAULT_CONFIG.POLLINATIONS_API_BASE_URL,
        POLLINATIONS_IMAGE_BASE_URL:raw._pib || DEFAULT_CONFIG.POLLINATIONS_IMAGE_BASE_URL,
        POLLINATIONS_TEXT_MODEL:    raw._ptm || DEFAULT_CONFIG.POLLINATIONS_TEXT_MODEL,
        POLLINATIONS_IMAGE_MODEL:   raw._pim || DEFAULT_CONFIG.POLLINATIONS_IMAGE_MODEL,
        POLLINATIONS_API_KEY:       _d(raw._pk),
        GITHUB_MODELS_BASE_URL:     raw._gb  || DEFAULT_CONFIG.GITHUB_MODELS_BASE_URL,
        GITHUB_TOKEN:               _d(raw._gk),
        GITHUB_MODEL:               raw._gm  || DEFAULT_CONFIG.GITHUB_MODEL,
        GITHUB_API_VERSION:         raw._gv  || DEFAULT_CONFIG.GITHUB_API_VERSION,
    } : {};
    // Legacy support: also accept window.AI_VISUAL_NOVEL_CONFIG (plain, for config.local.js)
    return { ...DEFAULT_CONFIG, ...(window.AI_VISUAL_NOVEL_CONFIG || {}), ...decoded };
}

function normalizeBaseUrl(url) {
    return url.replace(/\/$/, '');
}

async function postJson(url, options) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) {
            let errorMsg;
            try {
                const data = await response.json();
                errorMsg = data?.error?.message || data?.message || `${response.status} ${response.statusText}`;
            } catch {
                errorMsg = `${response.status} ${response.statusText}`;
            }
            throw new Error(errorMsg);
        }
        return await response.json();
    } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
            throw new Error('Request timed out. Check your connection and try again.');
        }
        throw err;
    }
}

function extractContent(result) {
    return result?.choices?.[0]?.message?.content || '';
}

function parseModelJson(raw) {
    // Strip markdown code fences (```json ... ``` or ``` ... ```)
    const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
    try {
        return JSON.parse(stripped);
    } catch {
        // Try extracting first {...} block from the original
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                return JSON.parse(match[0]);
            } catch { /* fall through */ }
        }
        console.error('[api] Raw model response that failed to parse:', raw.slice(0, 500));
        throw new Error('Could not parse JSON from model response.');
    }
}

// ─── Text: GitHub Models ─────────────────────────────────────────────────────

async function requestGitHubText(messages, config) {
    if (!config.GITHUB_TOKEN) {
        throw new Error('No GITHUB_TOKEN configured.');
    }
    const baseUrl = normalizeBaseUrl(config.GITHUB_MODELS_BASE_URL);
    const payload = {
        model: config.GITHUB_MODEL,
        messages,
        response_format: { type: 'json_object' }
    };
    const result = await postJson(`${baseUrl}/inference/chat/completions`, {
        method: 'POST',
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${config.GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': config.GITHUB_API_VERSION
        },
        body: JSON.stringify(payload)
    });
    return parseModelJson(extractContent(result));
}

// ─── Text: Pollinations ───────────────────────────────────────────────────────

async function requestPollinationsText(messages, config) {
    const baseUrl = normalizeBaseUrl(config.POLLINATIONS_API_BASE_URL);
    const headers = { 'Content-Type': 'application/json' };
    if (config.POLLINATIONS_API_KEY) {
        headers.Authorization = `Bearer ${config.POLLINATIONS_API_KEY}`;
    }
    const payload = {
        model: config.POLLINATIONS_TEXT_MODEL,
        messages,
        jsonMode: true
    };
    const result = await postJson(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    });
    return parseModelJson(extractContent(result));
}

// ─── Public: Text generation with fallback ────────────────────────────────────

/**
 * Generate text using the configured provider, with automatic fallback.
 * @param {Array<{role: string, content: string}>} messages - Chat messages array.
 * @returns {Promise<object>} Parsed JSON object from the model.
 */
export async function generateText(messages) {
    const config = getConfig();
    const provider = config.TEXT_PROVIDER;

    if (provider === 'github' && config.GITHUB_TOKEN) {
        try {
            console.log('[api] Using GitHub Models for text generation.');
            return await requestGitHubText(messages, config);
        } catch (err) {
            console.warn('[api] GitHub Models failed, falling back to Pollinations.', err.message);
        }
    } else if (provider === 'github' && !config.GITHUB_TOKEN) {
        console.log('[api] No GITHUB_TOKEN, using Pollinations for text generation.');
    }

    return await requestPollinationsText(messages, config);
}

// ─── Image: Pollinations ──────────────────────────────────────────────────────

/**
 * Generate an image using Pollinations.
 * @param {string} prompt - The image prompt (English).
 * @param {{ aspectRatio?: string, seed?: number, model?: string }} options
 * @returns {Promise<string>} A URL string to the generated image.
 */
export async function generateImage(prompt, options = {}) {
    const config = getConfig();
    const baseUrl = normalizeBaseUrl(config.POLLINATIONS_IMAGE_BASE_URL);

    const seed = options.seed ?? Math.floor(Math.random() * 1_000_000);
    const url = new URL(`${baseUrl}/${encodeURIComponent(prompt)}`);
    url.searchParams.set('model', options.model || config.POLLINATIONS_IMAGE_MODEL);
    url.searchParams.set('seed', String(seed));
    url.searchParams.set('nologo', 'true');

    if (options.aspectRatio) {
        const [w, h] = options.aspectRatio.split(':').map(Number);
        if (w && h) {
            // Pollinations uses width/height params; scale to ~768px long side
            const scale = 768 / Math.max(w, h);
            url.searchParams.set('width', String(Math.round(w * scale)));
            url.searchParams.set('height', String(Math.round(h * scale)));
        }
    }

    if (config.POLLINATIONS_API_KEY) {
        url.searchParams.set('key', config.POLLINATIONS_API_KEY);
    }

    console.log('[api] Generating image with Pollinations:', url.toString());
    return url.toString();
}

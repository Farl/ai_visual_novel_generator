// config.local.example.js - Template for local GitHub Models testing.
// Copy this file to config.local.js and fill in your token.
// config.local.js is gitignored and will NOT be committed.
window.AI_VISUAL_NOVEL_CONFIG = {
    ...window.AI_VISUAL_NOVEL_CONFIG,
    TEXT_PROVIDER: 'github',
    GITHUB_TOKEN: 'github_pat_YOUR_TOKEN_HERE',
    GITHUB_MODEL: 'openai/gpt-4.1-mini'
};

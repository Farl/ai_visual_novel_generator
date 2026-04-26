# AI Visual Novel Generator

A browser-based visual novel generator powered by AI. Enter a theme, and the AI
will write a full story, generate character art, and create background scenes.

## Features

- Two-step story generation (outline → full script)
- Multi-language UI (EN, ZH-TW, ES, FR, DE)
- GitHub Models as primary text provider, Pollinations.ai as fallback
- Pollinations.ai for image generation (no API key required)

## AI Provider Architecture

Text generation uses an automatic fallback chain:

```
GitHub Models (gpt-4.1-mini, free with token)
  ↓ on failure / no token
Pollinations.ai (openai model, fully free)
```

Image generation uses Pollinations.ai `flux` model (free, no account needed).
Character sprites are generated with a white background and displayed using
CSS `mix-blend-mode: multiply` for a pseudo-transparency effect.

## Configuration

Edit `config.js` for public deployment defaults. Never put secrets there.

For local testing with GitHub Models, copy `config.local.example.js` to
`config.local.js` and fill in your token. This file is gitignored.

```bash
cp config.local.example.js config.local.js
# then edit config.local.js and set GITHUB_TOKEN
```

## GitHub Pages Deployment

The included GitHub Actions workflow deploys to GitHub Pages automatically on
every push to `main`. It injects the GitHub token from repository secrets into
`config.js` at build time so the token is never committed.

### Required Secrets / Variables

Set these in your repository's **Settings → Secrets and variables → Actions**:

| Name | Type | Description |
|------|------|-------------|
| `GITHUB_MODELS_TOKEN` | Secret | PAT with `models:read` permission |

### Optional Variables

| Name | Default | Description |
|------|---------|-------------|
| `GITHUB_MODEL` | `openai/gpt-4.1-mini` | GitHub Models model name |
| `POLLINATIONS_IMAGE_MODEL` | `flux` | Pollinations image model |

### CLI Setup

```bash
# Create repo and push
gh repo create ai_visual_novel_generator --public --source=. --remote=origin --push

# Set the GitHub Models token
gh secret set GITHUB_MODELS_TOKEN

# Enable Pages (source: GitHub Actions)
gh api repos/{owner}/ai_visual_novel_generator/pages \
  -X POST -f build_type=workflow
```

## Future Work

- **Transparent character sprites via `gptimage`**: Pollinations supports
  `transparent=true` on the `gptimage` / `gptimage-large` models, which would
  give true alpha-channel PNGs instead of the current white-background +
  `mix-blend-mode` workaround. This is blocked by a known Pollinations bug
  ([#7266](https://github.com/pollinations/pollinations/issues/7266)) where
  `transparent=true` returns a JPEG with black background instead of a
  transparent PNG. Re-evaluate once the bug is marked closed.

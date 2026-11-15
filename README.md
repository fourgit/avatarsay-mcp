# AvatarSay MCP Server (`v1.2.0`)

[![npm version](https://img.shields.io/npm/v/avatarsay-mcp.svg)](https://www.npmjs.com/package/avatarsay-mcp)
[![CI](https://github.com/fourgit/avatarsay-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/fourgit/avatarsay-mcp/actions/workflows/ci.yml)
[![AvatarSay MCP Server MCP server – quality and maintenance score on Glama](https://glama.ai/mcp/servers/fourgit/avatarsay-mcp/badges/score.svg)](https://glama.ai/mcp/servers/fourgit/avatarsay-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/fourgit/avatarsay-mcp/blob/main/LICENSE)

Roll complete tabletop RPG / D&D NPCs (**SillyTavern Character Card V2** + **Foundry VTT Actor JSON**), import your existing non-photorealistic **character illustrations & VTT tokens**, synthesize fast (`<3s`) tabletop **MP3 voice barks**, generate original fictional character portraits (**2 × 1024 px** in 8 styles: Anime, 3D Cartoon, Pixel Art, Fantasy, Cyberpunk, Watercolor, Realistic, Professional), and animate them into lip-synced square talking videos (**960×960 H.264 MP4**, 8 built-in English voices, zero watermark) directly from **Claude Desktop, Claude Code, Cursor, Windsurf**, or any Model Context Protocol (MCP) client.

- **Remote MCP Endpoint (recommended, zero install):** `https://avatarsay.com/mcp`
- **Setup Guide & Live Docs:** [https://avatarsay.com/mcp](https://avatarsay.com/mcp)
- **API Keys:** [https://avatarsay.com/dashboard#mcp](https://avatarsay.com/dashboard#mcp)
- **Free Trial & Pay-Once Pricing:**
  - **Public zero-key NPC roller:** `roll_rpg_npc` and `list_voices_and_styles` run at **0 credits with no API key required**.
  - **30 free signup credits + 1 free talking MP4 via MCP:** New accounts receive **30 free credits** (up to 7 portrait pairs = 14 avatars, or **15 instant `.mp3` NPC voice barks** at 2 credits each) **plus 1 free `<=5s` (`<=75`-char) talking MP4 clip** (`0` credits via MCP or web, zero watermark).
  - **No subscription:** One-time credit packs start at **$9.90** for 500 credits and **never expire** ([pricing details](https://avatarsay.com/pricing)).

---

## Quick Start (Zero-Install Remote HTTP)

Modern MCP clients connect directly to `https://avatarsay.com/mcp` via **Streamable HTTP** — no local runtime needed.

### Cursor / Windsurf (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "avatarsay": {
      "url": "https://avatarsay.com/mcp",
      "headers": {
        "Authorization": "Bearer avs_YOUR_API_KEY"
      }
    }
  }
}
```

### Claude Code (CLI)

```bash
claude mcp add --transport http avatarsay https://avatarsay.com/mcp \
  --header "Authorization: Bearer avs_YOUR_API_KEY"
```

---

## Claude Desktop (`stdio` Bridge — Official npm Package)

Add `avatarsay-mcp` to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "avatarsay": {
      "command": "npx",
      "args": [
        "-y",
        "avatarsay-mcp"
      ],
      "env": {
        "AVATARSAY_API_KEY": "avs_YOUR_API_KEY"
      }
    }
  }
}
```

*(You can omit `AVATARSAY_API_KEY` if you only want public discovery and `roll_rpg_npc`.)*

---

## Tabletop VTT & Roleplay Companion Plugins

Using Foundry VTT or SillyTavern directly at your table? Install the official open-source companion plugins alongside MCP:

- **Foundry VTT Module (v12 / v13):** [fourgit/avatarsay-foundry-vtt](https://github.com/fourgit/avatarsay-foundry-vtt)  
  *1-line install in Foundry VTT → Add-on Modules → Install Module → Manifest URL:*  
  `https://github.com/fourgit/avatarsay-foundry-vtt/releases/latest/download/module.json`
- **SillyTavern Extension:** [fourgit/avatarsay-sillytavern](https://github.com/fourgit/avatarsay-sillytavern)  
  *1-line install in SillyTavern → Extensions → Install extension → Git URL:*  
  `https://github.com/fourgit/avatarsay-sillytavern`

---

## Available MCP Tools (10 Tools)

| Tool | Auth | Credit Cost | Description |
| --- | --- | --- | --- |
| `list_voices_and_styles` | Public (none) | 0 | Lists all 8 art styles, 8 English voices (with `.mp3` sample URLs), VTT/SillyTavern plugins, free-clip rules, voice-bark pricing, and one-time credit packs. |
| `roll_rpg_npc` | Public (none) | 0 | Deterministic tabletop RPG / D&D NPC generator with optional `seed`, `style`, `gender`, `ancestry`, `role`, and `exportFormat` filters. Returns full NPC sheet, `<=75`-char greeting (fits free 5s video!), **SillyTavern Card V2** JSON, **Foundry VTT Actor** JSON, and copy-pasteable `nextToolCalls`. |
| `get_credits` | `Bearer avs_…` | 0 | Checks current credit balance, quality tier (`standard` vs `hd`), `firstFreeVideoAvailable` & `firstFreeVideoStatus`, and remaining capacity across avatars, MP3 voice barks, and video seconds. |
| `list_avatars` | `Bearer avs_…` | 0 | Lists recent generated and imported character portraits (`ast_…`) with 24-hour signed URLs. |
| `list_videos` | `Bearer avs_…` | 0 | Lists recent 960×960 lip-synced talking MP4 videos (`ast_…`) with 24-hour signed download URLs. |
| `generate_avatars` | `Bearer avs_…` | 4 (Std) / 6 (HD) | Enqueues 2 × 1024 px character portraits from a text prompt and returns `jobId` immediately (~5–10s render). |
| `import_character_portrait` | `Bearer avs_…` | 0 | Imports an existing non-photorealistic fictional character illustration (`PNG` / `JPEG` / `WebP`, `256–4096 px`, `<=5 MB`, `confirmFictional: true`) via `imageUrl` or `imageBase64` so you can animate VTT tokens or Midjourney art with `create_talking_video`. Real human photos and camera EXIF are blocked. |
| `create_npc_voice_line` | `Bearer avs_…` | 2 / 100 chars (min 2) | Synchronous (`<3s`) tabletop NPC `.mp3` audio bark (`1–500` chars, optional `speed` `0.8–1.2` and `emotion`). Stores MP3 and returns a 24-hour signed download URL immediately (auto-refunds on error). |
| `create_talking_video` | `Bearer avs_…` | **0 (1st `<=5s` clip)**, then 12 / sec (min 60) | Enqueues a watermark-free lip-synced 960×960 MP4 (`5–30s`) from any generated or imported `ast_…` portrait and returns `jobId` immediately without blocking. First `<=5s` (`<=75`-char) clip is **0 credits** on eligible unpaid accounts! |
| `get_job` | `Bearer avs_…` | 0 | Polls `queued` / `running` / `succeeded` / `failed` status for image or video jobs and returns 24-hour signed download URLs (auto-refunds failed renders). |

### Built-In MCP Prompts (3 Workflow Templates)

- **`create-rpg-npc`** — Roll an NPC with SillyTavern V2 + Foundry VTT exports, generate 2 portraits, and render an instant MP3 voice bark or free 5s talking MP4.
- **`prep-tavern-encounter`** — Prep a 3-NPC tavern/dungeon encounter with interconnected hooks, VTT JSON imports, and tabletop MP3 greetings.
- **`create-talking-intro`** — Design a fictional mascot or channel character and animate a short spoken intro clip.

---

## Trust & Safety

- **Fictional & stylized characters only:** Generates original characters from text and accepts non-photorealistic character illustrations (`import_character_portrait` with EXIF camera-tag blocking + AI vision screening). Real human photos, camera captures, face swaps, real public figures, and voice cloning are strictly blocked.
- **Non-blocking async video jobs + instant audio barks:** `create_npc_voice_line` returns `.mp3` audio in `<3s`, while 3–5 minute video renders (`create_talking_video`) return `jobId` immediately so MCP clients never time out.
- **Hashed keys:** AvatarSay stores only the SHA-256 hash of `avs_…` keys. Revoke keys anytime in [Dashboard](https://avatarsay.com/dashboard#mcp).

## Related Tools

- [AvatarSay Talking Avatar Studio](https://avatarsay.com/talking-avatar)
- [Foundry VTT Module (`avatarsay-foundry-vtt`)](https://github.com/fourgit/avatarsay-foundry-vtt)
- [SillyTavern Extension (`avatarsay-sillytavern`)](https://github.com/fourgit/avatarsay-sillytavern)
- [Free Fantasy & D&D NPC Prompt Roller](https://avatarsay.com/fantasy-npc-generator)
- [Free Random Anime Character Roller](https://avatarsay.com/random-anime-character-generator)

## License

MIT

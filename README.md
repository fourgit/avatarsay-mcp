# AvatarSay MCP Server

Generate original fictional character portraits (**2 × 1024 px** in 8 styles: Anime, 3D Cartoon, Pixel Art, Fantasy, Cyberpunk, Watercolor, Realistic, Professional) and animate them into lip-synced square talking videos (**960×960 H.264 MP4**, 8 built-in English voices, no watermark) directly from **Claude Desktop, Claude Code, Cursor, Windsurf**, or any Model Context Protocol (MCP) client.

- **Remote MCP Endpoint (recommended, zero install):** `https://avatarsay.com/mcp`
- **Setup Guide & Live Docs:** [https://avatarsay.com/mcp](https://avatarsay.com/mcp)
- **API Keys:** [https://avatarsay.com/dashboard#mcp](https://avatarsay.com/dashboard#mcp)
- **Pricing:** **30 free credits** on sign-up (7 avatar generations = 14 portraits). One-time credit packs start at **$9.90** for 500 credits and **never expire** — no monthly subscription required to use MCP ([pricing details](https://avatarsay.com/pricing)).

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

## Local `stdio` Bridge (for stdio-only Desktop Clients)

This package includes a zero-dependency Node.js (`>= 18`) stdio bridge (`bin/avatarsay-mcp.mjs`) that forwards newline-delimited JSON-RPC 2.0 messages to `https://avatarsay.com/mcp`.

```json
{
  "mcpServers": {
    "avatarsay": {
      "command": "npx",
      "args": ["-y", "github:fourgit/avatarsay-mcp"],
      "env": {
        "AVATARSAY_API_KEY": "avs_YOUR_API_KEY"
      }
    }
  }
}
```

---

## Available MCP Tools

| Tool | Auth | Credit Cost | Description |
| --- | --- | --- | --- |
| `list_voices_and_styles` | Public (none) | 0 | Lists all 8 art styles, 8 English voices (with audio sample URLs), credit rules, and packs. |
| `get_credits` | `Bearer avs_…` | 0 | Checks current credit balance, quality tier (`standard` vs `hd`), and remaining capacity. |
| `list_avatars` | `Bearer avs_…` | 0 | Lists recent character portraits (`ast_…`) with 24-hour signed URLs. |
| `generate_avatars` | `Bearer avs_…` | 4 (Std) / 6 (HD) | Enqueues 2 × 1024 px character portraits from a text prompt and returns `jobId` immediately. |
| `create_talking_video` | `Bearer avs_…` | 12 / sec (min 60) | Enqueues a lip-synced 960×960 MP4 (5–30 s) and returns `jobId` immediately without blocking. |
| `get_job` | `Bearer avs_…` | 0 | Polls `queued` / `running` / `succeeded` / `failed` status and returns 24-hour signed download URLs (auto-refunds failed renders). |

---

## Trust & Safety

- **Fictional characters from text only:** No photo uploads, face swaps, real public figures, or voice cloning.
- **Non-blocking async jobs:** Video renders take ~3–5 minutes; `create_talking_video` returns `jobId` immediately so MCP clients never time out.
- **Hashed keys:** AvatarSay stores only the SHA-256 hash of `avs_…` keys. Revoke keys anytime in [Dashboard](https://avatarsay.com/dashboard#mcp).

## Related Tools

- [AvatarSay Talking Avatar Studio](https://avatarsay.com/talking-avatar)
- [Free Fantasy & D&D NPC Prompt Roller](https://avatarsay.com/fantasy-npc-generator)
- [Free Random Anime Character Roller](https://avatarsay.com/random-anime-character-generator)

## License

MIT

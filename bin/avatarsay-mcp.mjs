#!/usr/bin/env node
/**
 * AvatarSay MCP stdio → Streamable HTTP bridge (zero dependencies, Node >= 18).
 *
 * Preferred setup for modern clients (Claude Code, Cursor, Windsurf):
 *   Connect directly to Remote Streamable HTTP: https://avatarsay.com/mcp
 *
 * For desktop clients that only speak local stdio:
 *   AVATARSAY_API_KEY=avs_... node bin/avatarsay-mcp.mjs
 */

import { createInterface } from 'node:readline';

const ENDPOINT = process.env.AVATARSAY_MCP_URL || 'https://avatarsay.com/mcp';
const API_KEY = (process.env.AVATARSAY_API_KEY || '').trim();

const rl = createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

function writeJson(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

async function forwardLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return;

  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    writeJson({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error: invalid JSON on stdin.' } });
    return;
  }

  const hasId = parsed && typeof parsed === 'object' && !Array.isArray(parsed) && 'id' in parsed && parsed.id !== undefined;
  const headers = {
    'content-type': 'application/json',
    accept: 'application/json',
  };
  if (API_KEY) {
    headers.authorization = API_KEY.toLowerCase().startsWith('bearer ') ? API_KEY : `Bearer ${API_KEY}`;
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers,
      body: trimmed,
    });

    if (res.status === 202 || res.status === 204) return;
    const text = await res.text();
    if (!text.trim()) return;

    // Ensure single-line JSON output as required by MCP stdio framing.
    const data = JSON.parse(text);
    writeJson(data);
  } catch (err) {
    if (hasId) {
      writeJson({
        jsonrpc: '2.0',
        id: parsed.id,
        error: {
          code: -32603,
          message: `Failed to reach AvatarSay MCP endpoint (${ENDPOINT}): ${err instanceof Error ? err.message : String(err)}`,
        },
      });
    }
  }
}

for await (const line of rl) {
  await forwardLine(line);
}

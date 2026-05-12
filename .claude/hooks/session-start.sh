#!/bin/bash
set -euo pipefail

# Only run in Claude Code's remote (cloud) environment. Local sessions
# manage their own toolchain.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"

# Ensure pnpm is available. The cloud base image ships node + corepack,
# so we activate the pnpm version pinned in this repo.
if ! command -v pnpm >/dev/null 2>&1; then
  if command -v corepack >/dev/null 2>&1; then
    corepack enable >/dev/null
    corepack prepare pnpm@10.33.0 --activate >/dev/null
  else
    npm install -g pnpm@10.33.0 >/dev/null
  fi
fi

# Install dependencies. Idempotent: pnpm install is a no-op when
# node_modules already matches the lockfile.
pnpm install --prefer-offline

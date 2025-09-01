#!/bin/sh

HOOKS_DIR="$(pwd)/hooks"

if [ -f "$HOOKS_DIR/commit-msg" ]; then
  if [ -L ".git/hooks/commit-msg" ]; then
    echo "commit-msg hook already installed. Skipping."
  else
    ln -sf "$HOOKS_DIR/commit-msg" ".git/hooks/commit-msg"
    chmod +x "$HOOKS_DIR/commit-msg"
    echo "Installed commit-msg hook"
  fi
fi

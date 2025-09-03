#!/bin/sh

HOOKS_DIR="hooks"   # 프로젝트 루트 기준 hooks 디렉토리

if [ -f "$HOOKS_DIR/commit-msg" ]; then
  TARGET=".git/hooks/commit-msg"

  # 이미 올바른 심볼릭 링크인지 확인
  if [ "$(readlink -- "$TARGET")" = "../../$HOOKS_DIR/commit-msg" ]; then
    echo "commit-msg hook already installed and correct. Skipping."
  else
    ln -sf "../../$HOOKS_DIR/commit-msg" "$TARGET"
    chmod +x "$HOOKS_DIR/commit-msg"
    echo "Installed commit-msg hook"
  fi
fi

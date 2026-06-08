#!/bin/bash
export CLAW_DIR="/Users/isakzvegelj/clawd"
export OPENCODE_BIN="/Users/isakzvegelj/.opencode/bin/opencode"
cd "$CLAW_DIR"
/usr/bin/sandbox-exec -f "$CLAW_DIR/sandbox.sb" /opt/homebrew/bin/python3.14 -u ralph_daemon.py

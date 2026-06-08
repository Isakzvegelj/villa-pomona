import os
import time
import subprocess
import json
import socket
from datetime import datetime

# Configuration
WATCH_DIRS = ["/Users/isakzvegelj/clawd", "/Users/isakzvegelj/.opencode"]
SENSITIVE_PATHS = ["/Users/isakzvegelj/.ssh", "/Users/isakzvegelj/Documents/Private"]
LOG_FILE = "/Users/isakzvegelj/clawd/security_alerts.log"
CONFIG_PATH = "/Users/isakzvegelj/clawd/ralph_config.json"

def log_alert(msg):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(LOG_FILE, "a") as f:
        f.write(f"[{timestamp}] ALERT: {msg}\n")
    print(f"[{timestamp}] ALERT: {msg}")

def check_network():
    # Detect suspicious outbound connections
    try:
        output = subprocess.check_output(["lsof", "-i", "-n", "-P"]).decode()
        # Look for connections from python or node processes in clawd context
        lines = output.splitlines()
        for line in lines:
            # Monitor for suspicious processes making connections
            suspicious_apps = ["python", "node", "curl", "wget", "chromium", "firefox", "safari"]
            if any(app in line for app in suspicious_apps) and "ESTABLISHED" in line:
                # Basic check: log established connections from these processes
                log_alert(f"Active network connection detected: {line.strip()}")
    except:
        pass

def check_file_access():
    # Check if sensitive files have been accessed recently
    for path in SENSITIVE_PATHS:
        if os.path.exists(path):
            try:
                st = os.stat(path)
                last_access = st.st_atime
                if time.time() - last_access < 60: # Accessed in last minute
                    log_alert(f"SENSITIVE FILE ACCESS DETECTED: {path}")
            except:
                pass

def check_suspicious_processes():
    # Detect if any browser or downloader is running under suspicious circumstances
    try:
        output = subprocess.check_output(["ps", "-ax"]).decode()
        suspicious = ["chromium", "firefox", "safari", "headless", "puppeteer", "playwright"]
        for line in output.splitlines():
            if any(s in line.lower() for s in suspicious):
                log_alert(f"SUSPICIOUS PROCESS DETECTED: {line.strip()}")
    except:
        pass

def check_listening_ports():
    # Alert if any new unexpected ports are opened
    try:
        output = subprocess.check_output(["lsof", "-nP", "-iTCP", "-sTCP:LISTEN"]).decode()
        lines = output.splitlines()
        for line in lines[1:]: # Skip header
            log_alert(f"Listening port detected: {line.strip()}")
    except:
        pass

def check_persistence():
    # Check for new launch agents or cron jobs
    dirs = [
        f"/Users/{os.getlogin()}/Library/LaunchAgents",
        "/Library/LaunchAgents",
        "/Library/LaunchDaemons"
    ]
    for d in dirs:
        if os.path.exists(d):
            try:
                files = os.listdir(d)
                log_alert(f"Persistence check ({d}): {len(files)} items")
            except:
                pass

def check_shell_configs():
    # Monitor for changes in shell startup files
    user = os.getlogin()
    configs = [f"/Users/{user}/.zshrc", f"/Users/{user}/.bash_profile", f"/Users/{user}/.ssh/authorized_keys"]
    for c in configs:
        if os.path.exists(c):
            try:
                st = os.stat(c)
                if time.time() - st.st_mtime < 60: # Changed in last minute
                    log_alert(f"CRITICAL: SECURITY CONFIG MODIFIED: {c}")
            except:
                pass

def main():
    log_alert("Sentinel Security System Activated. Monitoring for Clawd Hijacks...")
    while True:
        check_network()
        check_file_access()
        check_suspicious_processes()
        check_listening_ports()
        check_persistence()
        check_shell_configs()
        time.sleep(30)

if __name__ == "__main__":
    main()

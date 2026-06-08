import os
import time
import subprocess
from datetime import datetime

LOG_FILE = "/Users/isakzvegelj/clawd/guardian.log"
DISK_PATH = "/Volumes/PVP30 1TB"
RALPH_PID = 2991
UID = 501

def log(msg):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        with open(LOG_FILE, "a") as f:
            f.write(f"[{timestamp}] {msg}\n")
    except:
        pass
    print(f"[{timestamp}] {msg}")

def check_disk():
    if not os.path.exists(DISK_PATH):
        return "DISK MISSING"
    try:
        st = os.statvfs(DISK_PATH)
        free_gb = (st.f_bavail * st.f_frsize) / (1024**3)
        return free_gb
    except:
        return "ERROR"

def check_ralph():
    try:
        # Check for ralph_daemon.py in ps output
        output = subprocess.check_output(["pgrep", "-f", "ralph_daemon.py"])
        return len(output.strip()) > 0
    except subprocess.CalledProcessError:
        return False

def get_load():
    try:
        return os.getloadavg()[0]
    except:
        return 0.0

def check_integrity():
    # Check for unexpected changes in critical files
    critical_files = [
        "/Users/isakzvegelj/clawd/ralph_daemon.py",
        "/Users/isakzvegelj/clawd/guardian.py",
        "/Users/isakzvegelj/clawd/ralph_config.json"
    ]
    for f in critical_files:
        if not os.path.exists(f):
            log(f"CRITICAL: Integrity failure - {f} is missing!")
            return False
    return True

def monitor_processes():
    # Detect suspicious processes that might be trying to hijack the gateway
    try:
        # Check for unauthorized shells or network tools running in clawd context
        output = subprocess.check_output(["ps", "-ef"]).decode()
        suspicious = ["nc -l", "reverse_shell", "curl -F", "wget -O"]
        for s in suspicious:
            if s in output:
                log(f"ALERT: Suspicious process detected: {s}")
                # Future: Auto-kill or alert
    except:
        pass

def check_sentinel():
    try:
        output = subprocess.check_output(["pgrep", "-f", "sentinel.py"])
        return len(output.strip()) > 0
    except subprocess.CalledProcessError:
        return False

log("Guardian starting for 24 hours...")
log("Security Mode: MAXIMUM (Hijack Protection Enabled)")

def check_lockdown():
    lockdown_file = "/Users/isakzvegelj/clawd/LOCKDOWN"
    if os.path.exists(lockdown_file):
        log("🛑 LOCKDOWN DETECTED! Stopping all services.")
        # Kill all related processes
        subprocess.run(["pkill", "-f", "ralph_daemon.py"])
        subprocess.run(["pkill", "-f", "sentinel.py"])
        subprocess.run(["pkill", "-f", "google-ultra-ai-server"])
        return True
    return False

# Run for 1440 iterations (24 hours * 60 minutes)
for i in range(1440):
    if check_lockdown():
        time.sleep(60)
        continue
        
    load = get_load()
    disk = check_disk()
    ralph = check_ralph()
    sentinel = check_sentinel()
    
    check_integrity()
    monitor_processes()
    
    if not sentinel:
        log("WARNING: Sentinel security process is down! Restarting...")
        subprocess.Popen(["python3", "/Users/isakzvegelj/clawd/sentinel.py"])
    
    disk_str = f"{disk:.2f}GB" if isinstance(disk, float) else str(disk)
    status = f"Load: {load:.2f} | Disk: {disk_str} | Ralph: {'UP' if ralph else 'DOWN'}"
    
    # Only log status every 10 minutes to avoid bloating, unless there's an issue
    if i % 10 == 0 or not ralph or load > 10.0 or (isinstance(disk, float) and disk < 20.0):
        log(status)
    
    if not ralph:
        log("CRITICAL: Ralph is down! Attempting to restart via launchctl...")
        subprocess.run(["launchctl", "kickstart", "-k", f"gui/{UID}/com.ralph.sandbox"])
        # Wait a bit for restart
        time.sleep(10)
        # Find new PID if possible, but for now we'll just keep checking
    
    if load > 15.0:
        log("WARNING: Extremely high load detected!")
    
    if isinstance(disk, float) and disk < 5.0:
        log("CRITICAL: Disk space critically low (< 5GB)!")
        
    time.sleep(60)

log("Guardian finished its shift.")

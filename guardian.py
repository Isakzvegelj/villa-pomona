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

log("Guardian starting for 9 hours...")

# Run for 540 iterations (9 hours * 60 minutes)
for i in range(540):
    load = get_load()
    disk = check_disk()
    ralph = check_ralph()
    
    disk_str = f"{disk:.2f}GB" if isinstance(disk, float) else str(disk)
    status = f"Load: {load:.2f} | Disk: {disk_str} | Ralph: {'UP' if ralph else 'DOWN'}"
    
    # Only log status every 10 minutes to avoid bloating, unless there's an issue
    if i % 10 == 0 or not ralph or load > 10.0 or (isinstance(disk, float) and disk < 20.0):
        log(status)
    
    if not ralph:
        log("CRITICAL: Ralph is down! Attempting to restart via launchctl...")
        subprocess.run(["launchctl", "kickstart", "-k", f"gui/{UID}/com.ralph.daemon"])
        # Wait a bit for restart
        time.sleep(10)
        # Find new PID if possible, but for now we'll just keep checking
    
    if load > 15.0:
        log("WARNING: Extremely high load detected!")
    
    if isinstance(disk, float) and disk < 5.0:
        log("CRITICAL: Disk space critically low (< 5GB)!")
        
    time.sleep(60)

log("Guardian finished its shift.")

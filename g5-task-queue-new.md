# G5 Value Extractor — Task Queue

> Last updated: 2026-06-08 09:10 (CET) by OWL cron agent
> G5: Dell G5 5587, i7-8750H, GTX 1060 6GB, 16GB RAM, Linux Mint 20.3
> Power cost: ~€16-18/month at €0.15/kWh (24/7)

## Current State (2026-06-08 09:10)
- Uptime: 18h 8m
- CPU: ~88% idle, load 0.66
- RAM: 4.1GB used / 16GB total (10.9GB available)
- GPU: GTX 1060 Max-Q 6GB, ~58°C, 3764MB VRAM used, 0% util
- Disk: 160GB/468GB used (36%), 285GB free
- Docker: v26.1.3 running, NO compose plugin, no containers running
- Ollama: NOT installed
- LLM Server: RUNNING as systemd user service at http://127.0.0.1:8080
- ExpressVPN: daemon running but SUBSCRIPTION EXPIRED (not connected)
- No services exposed to internet (UFW active, fail2ban active)
- HF cache: ~15GB (TinyLlama 4.4GB + phi-2 11.1GB)
- Downloads: 7.5GB (mostly old installers, ISOs)

## Active Services

### T1: LLM API Server ✅ LIVE + SYSTEMD
- Status: RUNNING (systemd user service, auto-restart)
- URL: http://127.0.0.1:8080 (localhost only, behind UFW)
- Endpoint: /v1/chat/completions (OpenAI-compatible)
- Endpoint: /health, /stats, /v1/models
- Model: TinyLlama-1.1B-Chat-v1.0
- Speed: ~24-30 tokens/sec on GPU (full model on GPU)
- GPU memory: 2.2GB used by model
- Value: €10-20/mo (replaces ChatGPT for basic tasks, coding help)
- Power: +20-40W when serving (GPU already warm from desktop)
- Start: `systemctl --user start g5-llm.service`
- Stop: `systemctl --user stop g5-llm.service`

## Task Queue

### T2: Try Larger Model (phi-2 / 3B class) [TESTED]
- Status: TESTED — phi-2 FITS but SLOW
- Result: phi-2 (2.7B) uses 1.68GB VRAM, runs at ~1.8 tok/s on GTX 1060 (full GPU)
- Verdict: Too slow for practical use. TinyLlama at 24 tok/s is better.
- Complexity: LOW | Power: +20-40W

### T11: Qwen2.5-1.5B Model Test [TESTED]
- Status: TESTED — VIABLE MIDDLE GROUND
- Result: Qwen2.5-1.5B uses 1.97GB VRAM with 18 GPU layers + 14 CPU layers
- Speed: 5.2-5.4 tok/s (with auto device_map CPU offload)
- Quality: Significantly better than TinyLlama for reasoning, instructions
- VRAM headroom: Fits alongside TinyLlama server (both fit in 6.4GB total)
- Verdict: Can be used as drop-in replacement by changing G5_MODEL env var.
  Quality upgrade over TinyLlama at cost of ~5x slower inference.
  For interactive use, 5 tok/s is acceptable (~12s for 60-token response).
- Recommendation: Deploy as alternative model option in server, let user choose
- Complexity: LOW | Power: +20-40W
- Model cached at: ~/.cache/huggingface/hub/models--Qwen--Qwen2.5-1.5B-Instruct

### T5: FFmpeg NVENC Video Transcoding [TESTED]
- Status: TESTED — WORKING GREAT
- Result: h264_nvenc encoder functional, 5.49x speed (faster than real-time)
- Capabilities: h264_nvenc, hevc_nvenc both available
- Value: Batch video transcoding, streaming prep, personal video projects
- Note: drums.mov (130MB) in home dir is a candidate for transcoding
- Complexity: LOW | Power: +80-120W during transcodes only
- Usage: `ffmpeg -i input.mov -c:v h264_nvenc -preset fast -b:v 5M output.mp4`

### T3: BOINC / Folding@home — Charity Computing [NOT TESTED]
- Status: NOT TESTED
- Value: Charity/social good (no direct revenue)
- Complexity: LOW | Power: +80-120W continuous
- Details: boinc-client available in apt repos, needs sudo to install
- Projects: World Community Grid, Rosetta@home, Einstein@home
- Estimated: ~50,000-100,000 BOINC credits/day
- Blocker: Requires sudo access (password needed)

### T4: Self-Hosted Docker Services [NOT TESTED]
- Status: NOT TESTED — Docker Compose plugin NOT installed
- Value: €10-30/mo (replaces paid services)
- Complexity: MEDIUM | Power: +5-10W baseline
- Blocker: No docker-compose, no sudo to install it
- Can use docker run directly without compose
- Candidates: Uptime Kuma (lightweight, fits in 16GB easily)
- Constraint: Must stay behind UFW

### T6: Blender Render Farm [NOT TESTED]
- Status: NOT TESTED
- Value: CUDA Cycles rendering for personal projects
- Complexity: LOW | Power: +100-150W during renders
- Details: GTX 1060 6GB supports CUDA rendering, 16GB RAM sufficient

### T7: CI/CD Runner [NOT TESTED]
- Status: NOT TESTED
- Value: Free CI for personal projects (saves GitHub Actions minutes)
- Complexity: MEDIUM | Power: +40-80W during builds

### T8: XMR CPU Mining [SKIP — NOT WORTH IT]
- Verdict: Net negative after power costs at current XMR prices

### T9: Petals Federated LLM [SKIP]
- Verdict: Too complex for GTX 1060, limited benefit

### T10: GPU Rental (Vast.ai / Salad) [SKIP]
- Verdict: GTX 1060 too old, security risk, low returns

### T12: Disk Cleanup Opportunity [NEW — LOW EFFORT]
- Status: IDENTIFIED
- Details: 7.5GB in Downloads (old ISOs, installers, zip files from 2022)
  11.1GB HF cache for phi-2 (not needed if not using)
  Total recoverable: ~15-18GB
- Value: Free disk space, better organization
- Complexity: NONE — just rm old files
- Recommendation: Clean Downloads, remove phi-2 from HF cache

### T13: Docker Uptime Kuma [NEW — LOW-HANGING FRUIT]
- Status: NOT TESTED
- Value: Self-hosted monitoring (replaces Better Uptime free tier, ~€5-10/mo value)
- Complexity: LOW — single docker run command
- Command: `docker run -d --restart=always -p 3001:3001 --name uptime-kuma louislam/uptime-kuma`
- Resource: ~200MB RAM, minimal CPU
- Stays on localhost (behind UFW)

## Benchmark Results (2026-06-08)
| Test | Result |
|------|--------|
| TinyLlama-1.1B GPU inference | ~24-30 tok/s |
| TinyLlama-1.1B CPU inference | ~4.3 tok/s |
| phi-2 (2.7B) GPU inference | ~1.8 tok/s (full GPU) |
| Qwen2.5-1.5B+CPU offload | ~5.2-5.4 tok/s (18 GPU + 14 CPU layers) |
| GPU VRAM (total) | 6.4GB |
| GPU compute capability | 6.1 (Pascal) |
| PyTorch CUDA | Working (2.4.1+cu121) |
| NVENC hardware encode | Working — 5.5x real-time |
| NVENC codecs | h264_nvenc, hevc_nvenc |
| Transformers library | 4.46.3 |
| accelerate library | 1.0.1 |
| bitsandbytes | NOT available (no 4-bit quantization) |
| LLM server systemd | Installed and enabled |
| ExpressVPN | EXPIRED (daemon running, not connected) |

## Key Findings This Run
1. **Qwen2.5-1.5B tested**: Works with CPU offload at 5.2 tok/s — viable middle ground between TinyLlama (fast, lower quality) and phi-2 (too slow)
2. **NVENC transcoding confirmed**: 5.5x real-time, perfect for batch video work
3. **LLM server survived benchmark**: Stable across runs, systemd auto-restart works
4. **ExpressVPN expired**: Subscription lapsed. No security impact — just unnecessary daemon running
5. **Disk cleanup opportunity**: 7.5GB old downloads + unnecessary phi-2 cache (11GB)
6. **Web search unavailable**: Firecrawl billing exhausted — couldn't research external opportunities
7. **Docker Compose still missing**: Single-container services still possible via docker run

## Next Run Checklist
- [ ] Try Docker Uptime Kuma (single container, no compose needed)
- [ ] Clean up disk: old downloads, phi-2 HF cache (recover ~15-18GB)
- [ ] Configure Qwen2.5-1.5B as server alternative model option
- [ ] Stop ExpressVPN daemon (subscription expired, wastes resources)
- [ ] Test Blender CUDA rendering (personal projects or charity)

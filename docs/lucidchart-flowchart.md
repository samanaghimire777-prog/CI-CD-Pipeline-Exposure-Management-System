# Flowchart — CI/CD Pipeline Exposure Management System

## How to import into lucid.app

1. Open **lucid.app** → **New Document → Lucidchart**
2. Click **Insert → More shapes → Mermaid** (or paste via **File → Import**)
3. Paste the code block below and click **Generate**

---

```mermaid
flowchart TD

    %% ── Actors ──────────────────────────────────────────────
    DEV([Developer])
    GH([GitHub Repository])

    %% ── Path A: User Scan ───────────────────────────────────
    subgraph A["Path A — User Scan  (browser)"]
        A1[Open Dashboard\nbrowser :3000]
        A2{Choose scan type}
        A3[Enter remote image name]
        A4[Select local Docker image]
        A5[View scan history\nor lookup a result]
        A6[Download PDF or\nExcel report]
    end

    %% ── Backend ─────────────────────────────────────────────
    subgraph B["Backend — FastAPI  :8000"]
        B1[POST /scan\nor POST /scan/local]
        B2[Scan Engine\nrun_trivy_scan]
        B3[GET /history\nor /vulnerabilities]
        B4[GET /report/pdf\nor /report/excel]
        B5[GET /events — SSE]
    end

    %% ── Scan execution ──────────────────────────────────────
    subgraph C["Scan Execution  (host)"]
        C1[Trivy Binary]
        C2[(Docker Socket)]
        C3[(Trivy Advisory DB)]
        C4[(Docker Hub)]
    end

    %% ── Result handling ─────────────────────────────────────
    subgraph D["Result Handling"]
        D1[(SQLite DB)]
        D2{Critical\nvulns found?}
        D3[Send Slack alert]
        D4[Return results to UI]
        D5[Generate PDF or Excel]
        D6[Live SSE push to browser]
    end

    %% ── Path B: CI/CD Pipeline ──────────────────────────────
    subgraph E["Path B — CI/CD Pipeline  (GitHub Actions)"]
        E1[Checkout code]
        E2[Build backend and\nfrontend images]
        E3[Run Trivy scan]
        E4[Upload scan artifacts]
        E5{CRITICAL or HIGH\nvulns found?}
        E6[Fail the job]
        E7[Generate job summary\nand pass]
    end

    %% ── Path C: Auto-scan ───────────────────────────────────
    subgraph F["Path C — Docker Auto-Scan  (background)"]
        F1[New container\nstarted on host]
        F2[Docker Event Monitor\ndetects start event]
        F3[Trigger scan\nautomatically]
    end

    %% ════════════════════════════════════════════════════════
    %% CONNECTIONS
    %% ════════════════════════════════════════════════════════

    %% Developer entry points
    DEV -->|opens browser| A1
    DEV -->|git push or PR| GH

    %% Path A — user navigates
    A1 --> A2
    A2 -->|remote image| A3
    A2 -->|local image| A4
    A2 -->|history| A5
    A2 -->|report| A6

    %% Frontend calls backend
    A3 -->|POST /scan| B1
    A4 -->|POST /scan/local| B1
    A5 -->|GET /history| B3
    A6 -->|GET /report| B4
    A1 -->|GET /events| B5

    %% Backend → scan engine
    B1 --> B2

    %% Scan engine → host tools
    B2 -->|spawn subprocess| C1
    C1 -->|inspect image| C2
    C2 -->|pull if remote| C4
    C1 -->|fetch CVE data| C3

    %% Scan results
    C1 -->|JSON results| B2
    B2 -->|save scan and vulns| D1
    B2 --> D2
    D2 -->|Yes| D3
    D3 -->|POST webhook| SL([Slack])
    D2 -->|No| D4
    D3 --> D4

    %% Read and report paths
    B3 -->|SELECT| D1
    B3 --> D4
    B4 -->|query| D1
    B4 --> D5
    B5 --> D6
    D6 -.->|live update| A1

    %% Path B — CI/CD
    GH -->|push or PR or schedule| E1
    E1 --> E2
    E2 --> E3
    E3 -->|pull advisories| C3
    E3 --> E4
    E4 --> E5
    E5 -->|Yes| E6
    E5 -->|No| E7

    %% Path C — auto-scan
    F1 --> F2
    F2 -->|listen via socket| C2
    F2 --> F3
    F3 --> B2

    %% ════════════════════════════════════════════════════════
    %% STYLES
    %% ════════════════════════════════════════════════════════
    classDef actor  fill:#dfe6e9,stroke:#636e72,color:#2d3436,font-weight:bold
    classDef fe     fill:#d5f5e3,stroke:#27ae60,color:#1e8449
    classDef be     fill:#fdebd0,stroke:#e67e22,color:#784212
    classDef scan   fill:#f5eef8,stroke:#8e44ad,color:#4a235a
    classDef result fill:#fef9e7,stroke:#d4ac0d,color:#7d6608
    classDef cicd   fill:#d6eaf8,stroke:#2980b9,color:#1a5276
    classDef auto   fill:#fadbd8,stroke:#e74c3c,color:#7b241c
    classDef db     fill:#f9ebea,stroke:#c0392b,color:#7b241c
    classDef decide fill:#fff9c4,stroke:#f39c12,color:#7d6608,font-weight:bold

    class DEV,GH,SL actor
    class A1,A2,A3,A4,A5,A6 fe
    class B1,B2,B3,B4,B5 be
    class C1,C2,C3,C4 scan
    class D1 db
    class D2,E5 decide
    class D3,D4,D5,D6 result
    class E1,E2,E3,E4,E6,E7 cicd
    class F1,F2,F3 auto
```

---

## Colour key

| Colour | Layer |
|--------|-------|
| 🟢 Green | Frontend (React, browser) |
| 🟠 Orange | Backend (FastAPI) |
| 🟣 Purple | Scan execution (Trivy, Docker socket) |
| 🔴 Red | Database (SQLite) |
| 🔵 Blue | CI/CD (GitHub Actions) |
| 🩷 Pink | Auto-scan (Docker Event Monitor) |
| 🟡 Yellow | Decision nodes |
| ⚪ Grey | External actors / services |

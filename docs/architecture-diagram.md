# System Architecture Diagram

> Paste the code block below into [Mermaid Live Editor](https://mermaid.live) to render the diagram.

```mermaid
graph TB
    %% ── External Actors ────────────────────────────────────────
    DEV(["👤 Developer / User\n(Browser)"])
    GH_REPO(["🐙 GitHub Repository"])
    DOCKERHUB(["🐳 Docker Hub\nRemote Registry"])
    SLACK(["💬 Slack API\nWebhook / Bot Token"])
    TRIVYDB(["🛡️ Trivy Advisory DB\nghcr.io"])

    %% ── GitHub Actions CI/CD ────────────────────────────────────
    subgraph CICD ["⚙️ GitHub Actions CI/CD  (security-scan.yml)"]
        direction TB
        GH_CHECKOUT["Checkout Code\nactions/checkout@v4"]
        GH_BUILD_BE["Build Backend Image\nsecurity-dashboard-backend:SHA"]
        GH_BUILD_FE["Build Frontend Image\nsecurity-dashboard-frontend:SHA"]
        GH_TRIVY["Install & Run Trivy\nJSON + Table output"]
        GH_ARTIFACTS["Upload Artifacts\ntrivy-backend-results.json\ntrivy-frontend-results.json\n(retention: 30 days)"]
        GH_CHECK["Vulnerability Count Check\nCRITICAL / HIGH via jq"]
        GH_SUMMARY["Generate Step Summary\nGitHub Actions UI"]
        GH_NODE["npm ci + npm run build\nfrontend/dist artifact\n(parallel job)"]

        GH_CHECKOUT --> GH_BUILD_BE --> GH_BUILD_FE --> GH_TRIVY
        GH_TRIVY --> GH_ARTIFACTS --> GH_CHECK --> GH_SUMMARY
        GH_CHECKOUT -.->|parallel job| GH_NODE
    end

    %% ── Docker Compose Host ─────────────────────────────────────
    subgraph HOST ["🖥️ Docker Compose Host"]
        direction TB

        subgraph FE ["🖼️ Frontend Container  · Port 3000"]
            REACT["React + Vite SPA\n(api.js → axios)"]
            subgraph PAGES ["Pages"]
                direction LR
                PG_DASH["Dashboard\n(Stats + Charts)"]
                PG_SCAN["Remote Image\nScanner"]
                PG_LOCAL["Local Docker\nScanner"]
                PG_HIST["Scan History"]
                PG_LOOKUP["Scan Lookup"]
                PG_VULN["Vulnerabilities"]
            end
            REACT --> PAGES
        end

        subgraph BE ["🔧 Backend Container  · Port 8000"]
            direction TB
            FASTAPI["FastAPI Application\n(Python 3.11)"]
            subgraph API_ENDPOINTS ["REST API Endpoints"]
                direction LR
                EP1["POST /scan\n(remote image)"]
                EP2["POST /scan/local\n(local image)"]
                EP3["GET /history"]
                EP4["GET /vulnerabilities"]
                EP5["GET /docker/images"]
                EP6["GET /report/pdf\nGET /report/excel"]
                EP7["GET /events\n(SSE stream)"]
            end
            SCAN_ENGINE["Scan Engine\nrun_trivy_scan()\nsubprocess + skip-db-update\nfast path + fallback retry"]
            SLACK_MOD["Slack Alert Module\nPrimary: Incoming Webhook\nFallback: Bot Token +\nchat.postMessage"]
            REPORT_GEN["Report Generator\nPDF  – ReportLab\nExcel – openpyxl"]
            DOCKER_MON["Docker Event Monitor\nSSE auto-scan loop\n(start / die events)"]

            FASTAPI --> API_ENDPOINTS
            EP1 & EP2 --> SCAN_ENGINE
            EP3 & EP4 & EP5 --> DB_READ["READ SQLite"]
            EP6 --> REPORT_GEN
            EP7 --> DOCKER_MON
        end

        subgraph PERSIST ["💾 Persistence"]
            SQLITE[("SQLite\nvulnerabilities.db\nWAL mode")]
            T_SCANS["scans table\n(id, image_name, scan_date,\nscan_source, total,\ncritical, high, medium, low)"]
            T_VULN["vulnerabilities table\n(id, scan_id, package_name,\ninstalled_version, fixed_version,\nvulnerability_id, severity,\ndescription)"]
            SQLITE --- T_SCANS
            SQLITE --- T_VULN
        end

        subgraph RESOURCES ["🔩 Host Resources"]
            direction LR
            TRIVY_BIN["Trivy Binary\n(installed in\nbackend container)"]
            DOCKER_SOCK["Docker Socket\n/var/run/docker.sock\n(bind-mounted)"]
            DATA_VOL["Named Volume\nvulnerability-data\n(/app/data)"]
            ENV_CFG[".env Config\nDATABASE_PATH\nTRIVY_TIMEOUT\nSLACK_WEBHOOK_URL\nSLACK_BOT_TOKEN\nSLACK_CHANNEL_ID"]
        end
    end

    %% ── Connections ─────────────────────────────────────────────

    %% Developer
    DEV -->|"Browser :3000"| REACT
    DEV -->|"git push / pull request"| GH_REPO

    %% CI trigger
    GH_REPO -->|"push (main/develop)\nPR · schedule · dispatch"| GH_CHECKOUT
    GH_TRIVY -->|"pull advisories"| TRIVYDB

    %% Frontend → Backend
    REACT -->|"REST HTTP :8000\n(CORS enabled)"| FASTAPI

    %% Backend → Scan Engine → Trivy
    SCAN_ENGINE --> TRIVY_BIN
    TRIVY_BIN --> DOCKER_SOCK
    DOCKER_SOCK -->|"docker pull\n(remote images)"| DOCKERHUB
    TRIVY_BIN -->|"fetch / update advisories"| TRIVYDB

    %% Backend → DB
    SCAN_ENGINE -->|"INSERT scan + vulns"| SQLITE
    DB_READ -->|"SELECT"| SQLITE

    %% Backend → Slack
    SCAN_ENGINE -->|"critical vulns found"| SLACK_MOD
    SLACK_MOD -->|"POST alert"| SLACK

    %% Docker monitor
    DOCKER_MON --> DOCKER_SOCK
    DOCKER_MON -->|"auto-trigger scan\non container start"| SCAN_ENGINE

    %% Persistence & config
    FASTAPI -->|"read on startup"| ENV_CFG
    BE -->|"persist db"| DATA_VOL

    %% Styles
    classDef external fill:#dfe6e9,stroke:#636e72,color:#2d3436
    classDef cicd    fill:#d6eaf8,stroke:#2980b9,color:#1a5276
    classDef fe      fill:#d5f5e3,stroke:#27ae60,color:#1e8449
    classDef be      fill:#fdebd0,stroke:#e67e22,color:#784212
    classDef db      fill:#f9ebea,stroke:#c0392b,color:#7b241c
    classDef res     fill:#f5eef8,stroke:#8e44ad,color:#4a235a

    class DEV,GH_REPO,DOCKERHUB,SLACK,TRIVYDB external
    class CICD,GH_CHECKOUT,GH_BUILD_BE,GH_BUILD_FE,GH_TRIVY,GH_ARTIFACTS,GH_CHECK,GH_SUMMARY,GH_NODE cicd
    class FE,REACT,PAGES,PG_DASH,PG_SCAN,PG_LOCAL,PG_HIST,PG_LOOKUP,PG_VULN fe
    class BE,FASTAPI,API_ENDPOINTS,EP1,EP2,EP3,EP4,EP5,EP6,EP7,SCAN_ENGINE,SLACK_MOD,REPORT_GEN,DOCKER_MON,DB_READ be
    class PERSIST,SQLITE,T_SCANS,T_VULN db
    class RESOURCES,TRIVY_BIN,DOCKER_SOCK,DATA_VOL,ENV_CFG res
```

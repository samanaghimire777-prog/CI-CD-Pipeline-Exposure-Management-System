# Testing Plan — CI/CD Pipeline Exposure Management System

**Project:** CI/CD Security Dashboard  
**Author:** Santosh Ghimire  
**Version:** 1.0.0

---

## Unit Testing

> Unit tests validate individual functions and modules in isolation (backend logic, API helpers, database operations).

### Unit Testing Summary Table

| Test Case | Objective | Action | Expected Test Result | Actual Test Result | Conclusion |
|-----------|-----------|--------|----------------------|--------------------|------------|
| **UT-01** Health Check Returns 200 | Verify `GET /` returns HTTP 200 OK. | Send `GET http://localhost:8000/`. | HTTP `200` with a JSON body confirming service is running. | *(to be filled in)* | *(Pass / Fail)* |
| **UT-02** DB Initialisation Creates Tables | Verify `init_db()` creates `scans` and `vulnerabilities` tables. | Call `init_db()` on a fresh in-memory SQLite DB; query `sqlite_master`. | Both tables exist after `init_db()` completes. | *(to be filled in)* | *(Pass / Fail)* |
| **UT-03** Schema Migration Adds `scan_source` | Verify migration adds `scan_source` column when absent. | Create `scans` table without `scan_source`, run `init_db()`, inspect `PRAGMA table_info(scans)`. | `scan_source` column present with default `'remote'`. | *(to be filled in)* | *(Pass / Fail)* |
| **UT-04** Password Hashing | Verify `pwd_context.hash()` returns a valid hash and `verify()` works. | Hash `"TestPass123!"` and verify against correct and incorrect passwords. | Correct password returns `True`; wrong password returns `False`. | *(to be filled in)* | *(Pass / Fail)* |
| **UT-05** Scan Rejects Empty Image Name | Verify blank `image_name` returns a validation error. | Send `POST /scan` with `{"image_name": ""}`. | HTTP `422 Unprocessable Entity`. | *(to be filled in)* | *(Pass / Fail)* |
| **UT-06** Severity Filter Returns Matching Records | Verify `?severity=CRITICAL` filters results correctly. | Pre-populate DB with mixed severities; call `GET /results?severity=CRITICAL`. | Only `CRITICAL` rows returned; no `HIGH` or `LOW` records. | *(to be filled in)* | *(Pass / Fail)* |
| **UT-07** Scan History in Descending Order | Verify `/scans` returns history newest-first. | Insert two scan records with different timestamps; call `GET /scans`. | Scan with later timestamp appears first. | *(to be filled in)* | *(Pass / Fail)* |
| **UT-08** Stats Aggregates Severity Counts | Verify `/stats` computes correct severity totals. | Insert known counts (3 CRITICAL, 5 HIGH); call `GET /stats`. | Response contains `critical_count: 3` and `high_count: 5`. | *(to be filled in)* | *(Pass / Fail)* |
| **UT-09** 404 for Non-Existent Scan | Verify `/scans/{id}` returns 404 for unknown ID. | Call `GET /scans/99999` on a DB with no such record. | HTTP `404 Not Found` with an error message. | *(to be filled in)* | *(Pass / Fail)* |
| **UT-10** Docker Images List | Verify `/docker/images` returns local image names. | Call `GET /docker/images` with at least one image present locally. | JSON array containing at least one image name string. | *(to be filled in)* | *(Pass / Fail)* |
| **UT-11** Signup Creates New User | Verify `POST /auth/signup` creates a user and returns a token. | Send `POST /auth/signup` with valid email and password. | HTTP `200` with non-empty `token` field in response. | *(to be filled in)* | *(Pass / Fail)* |
| **UT-12** Login Rejects Invalid Credentials | Verify `POST /auth/login` returns 401 for wrong password. | Send `POST /auth/login` with valid email but wrong password. | HTTP `401 Unauthorized`. | *(to be filled in)* | *(Pass / Fail)* |
| **UT-13** PDF Report Content-Type | Verify report endpoint returns correct MIME type for PDF. | Insert a scan record; call `GET /reports/scan/1?format=pdf`. | HTTP `200` with `Content-Type: application/pdf` and non-empty body. | *(to be filled in)* | *(Pass / Fail)* |

---

### UT-01 — Health Check Endpoint Returns 200

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that the `GET /` health check endpoint returns an HTTP 200 OK response. |
| **Action**           | Send a `GET` request to `http://localhost:8000/`. |
| **Expected Result**  | HTTP status `200` and a JSON body confirming the service is running (e.g., `{"status": "ok"}`). |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### UT-02 — Database Initialisation Creates Required Tables

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that `init_db()` creates the `scans` and `vulnerabilities` tables in SQLite when called on an empty database. |
| **Action**           | Call `init_db()` against a fresh in-memory SQLite database and query `sqlite_master` for table names. |
| **Expected Result**  | Both `scans` and `vulnerabilities` tables exist after `init_db()` completes. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### UT-03 — Schema Migration Adds `scan_source` Column to Existing DB

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify backward-compatible migration adds the `scan_source` column when it is absent from an older database file. |
| **Action**           | Create a `scans` table without `scan_source`, run `init_db()`, then inspect `PRAGMA table_info(scans)`. |
| **Expected Result**  | The `scan_source` column is present after migration with a default value of `'remote'`. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### UT-04 — Password Hashing Produces a Valid Hash

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that `pwd_context.hash()` returns a non-plaintext hash and that `pwd_context.verify()` confirms the correct password. |
| **Action**           | Hash the string `"TestPass123!"` and verify it against both the correct and an incorrect password. |
| **Expected Result**  | `verify("TestPass123!", hash)` returns `True`; `verify("wrong", hash)` returns `False`. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### UT-05 — `POST /scan` Rejects an Empty Image Name

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that submitting a blank `image_name` returns a validation error rather than launching Trivy. |
| **Action**           | Send `POST /scan` with body `{"image_name": ""}`. |
| **Expected Result**  | HTTP `422 Unprocessable Entity` (Pydantic validation error). |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### UT-06 — `GET /results` Severity Filter Returns Only Matching Records

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that the `severity` query parameter correctly filters vulnerability results. |
| **Action**           | Pre-populate the DB with `CRITICAL`, `HIGH`, and `LOW` rows, then call `GET /results?severity=CRITICAL`. |
| **Expected Result**  | Only rows with `severity = "CRITICAL"` are returned; no `HIGH` or `LOW` records appear. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### UT-07 — `GET /scans` Returns Scan History in Descending Order

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that the scan history list is ordered from most recent to oldest. |
| **Action**           | Insert two scan records with different timestamps, then call `GET /scans`. |
| **Expected Result**  | The scan with the later timestamp appears first in the returned list. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### UT-08 — `GET /stats` Aggregates Severity Counts Correctly

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that the `/stats` endpoint computes correct totals for each severity level. |
| **Action**           | Insert known vulnerability counts (e.g., 3 CRITICAL, 5 HIGH) and call `GET /stats`. |
| **Expected Result**  | Response JSON contains `critical_count: 3` and `high_count: 5` matching the inserted data. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### UT-09 — `GET /scans/{id}` Returns 404 for a Non-Existent Scan

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that requesting a scan record with an ID that does not exist returns a 404. |
| **Action**           | Call `GET /scans/99999` on a database that has no record with `id = 99999`. |
| **Expected Result**  | HTTP `404 Not Found` with a meaningful error message. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### UT-10 — `GET /docker/images` Returns a List of Local Images

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that the `/docker/images` endpoint returns available local Docker image names. |
| **Action**           | Call `GET /docker/images` when at least one Docker image (e.g., `alpine:latest`) is present locally. |
| **Expected Result**  | Response is a JSON array containing at least one image name string. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### UT-11 — `POST /auth/signup` Creates a New User

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that a valid signup request creates a user account and returns an authentication token. |
| **Action**           | Send `POST /auth/signup` with `{"email": "test@example.com", "password": "SecurePass1!"}`. |
| **Expected Result**  | HTTP `200` with a JSON body containing a non-empty `token` field. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### UT-12 — `POST /auth/login` Rejects Invalid Credentials

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that attempting to log in with an incorrect password returns an authentication error. |
| **Action**           | Send `POST /auth/login` with a valid email but wrong password. |
| **Expected Result**  | HTTP `401 Unauthorized`. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### UT-13 — Report Download Endpoint Returns Correct Content-Type for PDF

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that `GET /reports/scan/{id}?format=pdf` returns a PDF binary with the correct MIME type. |
| **Action**           | Insert a scan record, then call `GET /reports/scan/1?format=pdf`. |
| **Expected Result**  | HTTP `200` with `Content-Type: application/pdf` and a non-empty binary body. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

## System Testing

> System tests validate end-to-end behaviour of the full application stack (frontend + backend + database + Trivy scanner).

### System Testing Summary Table

| Test Case | Objective | Action | Expected Test Result | Actual Test Result | Conclusion |
|-----------|-----------|--------|----------------------|--------------------|------------|
| **ST-01** Full Stack Starts Without Errors | Verify all Docker services start cleanly. | Run `docker-compose up --build`; observe logs for 60 seconds. | All containers running; no `ERROR` or `FATAL` in startup logs. | *(to be filled in)* | *(Pass / Fail)* |
| **ST-02** End-to-End Remote Image Scan via UI | Verify a user can scan a remote image and see results on the dashboard. | Open `http://localhost:3000`, enter `alpine:latest`, click **Scan**. | Dashboard updates with vulnerability counts for `alpine:latest` within 120 s. | *(to be filled in)* | *(Pass / Fail)* |
| **ST-03** Scan Results Persist Across Restart | Verify SQLite data survives a backend container restart. | Scan via `POST /scan`, restart backend, call `GET /scans`. | Previously scanned image record still present after restart. | *(to be filled in)* | *(Pass / Fail)* |
| **ST-04** Dashboard Auto-Refresh Every 30 s | Verify the frontend re-fetches data automatically every 30 seconds. | Keep dashboard open, trigger a new scan via API, do not reload the page. | New scan result appears on the dashboard within 30 seconds. | *(to be filled in)* | *(Pass / Fail)* |
| **ST-05** Severity Filter Shows Correct Subset | Verify the frontend filter shows only the selected severity. | Scan an image with mixed severities; select **CRITICAL** in the filter. | Only CRITICAL vulnerabilities shown; other severities hidden. | *(to be filled in)* | *(Pass / Fail)* |
| **ST-06** Pagination Through Vulnerability Table | Verify the table paginates correctly with more than 10 results. | Scan an image with >10 vulnerabilities; navigate to page 2 in the UI. | Page 2 shows items 11–20 without repeating page 1 items. | *(to be filled in)* | *(Pass / Fail)* |
| **ST-07** User Registration and Authenticated Access | Verify sign-up → login → protected dashboard access works end-to-end. | Register a new account, log in, then view the dashboard. | Dashboard loads after login; unauthenticated routes redirect to login. | *(to be filled in)* | *(Pass / Fail)* |
| **ST-08** GitHub Actions CI Pipeline on Push | Verify a push to `main` triggers the workflow and it succeeds. | Push a minor commit to `main`; observe the **security-scan** workflow. | Workflow completes with green status; scan summary artifact stored. | *(to be filled in)* | *(Pass / Fail)* |
| **ST-09** PDF Report Download from UI | Verify a PDF vulnerability report can be downloaded from the UI. | Complete a scan, click **Download PDF** on the scan history entry. | A valid PDF file is downloaded containing scan ID, image name, and vulnerability table. | *(to be filled in)* | *(Pass / Fail)* |
| **ST-10** Excel Report Download from UI | Verify an Excel report can be downloaded from the UI. | Complete a scan, click **Download Excel** on the scan history entry. | A valid `.xlsx` file is downloaded with formatted vulnerability data and severity colour coding. | *(to be filled in)* | *(Pass / Fail)* |
| **ST-11** CORS Blocks Unauthorised Origins | Verify the backend rejects API calls from unlisted origins. | Send `GET /stats` with `Origin: http://evil.example.com` via curl. | Response lacks `Access-Control-Allow-Origin` for the disallowed origin; browser blocks it. | *(to be filled in)* | *(Pass / Fail)* |
| **ST-12** Local Docker Image Scan via UI | Verify a locally built image can be scanned through the UI. | Build `test-app:latest` locally, select it in the local images dropdown, start scan. | Scan completes; `test-app:latest` appears in scan history with correct vulnerability counts. | *(to be filled in)* | *(Pass / Fail)* |
| **ST-13** Scheduled CI Scan Stores Artifacts | Verify the scheduled workflow triggers and uploads a scan summary artifact. | Trigger the workflow via **workflow_dispatch** in GitHub Actions; inspect the artifacts tab. | Workflow succeeds; scan summary artifact visible and retained for ≥ 30 days. | *(to be filled in)* | *(Pass / Fail)* |

---

### ST-01 — Full Application Stack Starts Without Errors

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that `docker-compose up --build` starts all services (backend, frontend) without container crashes. |
| **Action**           | Run `docker-compose up --build` and observe container logs for at least 60 seconds. |
| **Expected Result**  | All containers reach a running state; no `ERROR` or `FATAL` lines appear in the startup logs. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### ST-02 — End-to-End Remote Image Scan via the UI

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that a user can scan a remote Docker image through the frontend and see results on the dashboard. |
| **Action**           | Open `http://localhost:3000`, enter `alpine:latest` in the scan input, and click **Scan**. |
| **Expected Result**  | A loading indicator appears, and within 120 seconds the dashboard updates showing vulnerability counts for `alpine:latest`. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### ST-03 — Scan Results Persist Across a Backend Restart

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that scan data stored in SQLite survives a backend container restart. |
| **Action**           | Perform a scan via `POST /scan`, restart the backend container (`docker-compose restart backend`), then call `GET /scans`. |
| **Expected Result**  | The previously scanned image record is present in the scan history after restart. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### ST-04 — Dashboard Auto-Refresh Updates Data Every 30 Seconds

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that the frontend dashboard automatically re-fetches data from the backend every 30 seconds without a manual page reload. |
| **Action**           | Keep the dashboard open, trigger a new scan via API, and observe the UI without refreshing the page. |
| **Expected Result**  | Within 30 seconds the new scan result appears on the dashboard automatically. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### ST-05 — Severity Filter on Dashboard Shows Correct Subset

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that selecting a severity filter on the frontend only displays vulnerabilities of that severity. |
| **Action**           | After scanning an image with mixed severities, select **CRITICAL** in the severity filter dropdown. |
| **Expected Result**  | Only CRITICAL vulnerabilities are shown in the table; counts for other severities disappear from the filtered view. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### ST-06 — Pagination Navigates Through the Vulnerability Table

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that the vulnerability table correctly paginates when more than 10 results are present. |
| **Action**           | Scan an image with more than 10 known vulnerabilities and navigate to page 2 in the UI. |
| **Expected Result**  | Page 2 displays the next set of vulnerabilities (items 11–20) and does not repeat items from page 1. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### ST-07 — User Registration and Authenticated Access End-to-End

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that a new user can sign up, log in, and access protected dashboard data. |
| **Action**           | Navigate to the sign-up page, register a new account, log in, then view the dashboard. |
| **Expected Result**  | Dashboard loads with data after login; unauthenticated access to protected routes redirects to login. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### ST-08 — GitHub Actions CI Pipeline Builds and Scans Successfully on Push

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that pushing code to the main branch triggers the GitHub Actions workflow and it completes without failure. |
| **Action**           | Push a minor commit to the `main` branch and observe the **security-scan** workflow in GitHub Actions. |
| **Expected Result**  | The workflow run completes with a green (success) status and a scan summary artifact is stored. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### ST-09 — PDF Report Download Works for a Completed Scan

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that a user can download a PDF vulnerability report for a completed scan from the UI. |
| **Action**           | Complete a scan, open the scan history, locate the scan entry, and click **Download PDF**. |
| **Expected Result**  | A valid PDF file is downloaded to the user's machine containing the scan ID, image name, and vulnerability table. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### ST-10 — Excel Report Download Works for a Completed Scan

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that a user can download an Excel (`.xlsx`) vulnerability report for a completed scan from the UI. |
| **Action**           | Complete a scan, open the scan history, locate the scan entry, and click **Download Excel**. |
| **Expected Result**  | A valid `.xlsx` file is downloaded containing formatted vulnerability data with severity colour coding. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### ST-11 — CORS Policy Blocks Requests from Unauthorised Origins

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that the backend CORS middleware rejects API calls originating from domains not in the allowlist. |
| **Action**           | Send a `GET /stats` request with the HTTP header `Origin: http://evil.example.com` using `curl` or a browser dev-tools fetch. |
| **Expected Result**  | The response does not include an `Access-Control-Allow-Origin` header matching the disallowed origin; a browser would block the response. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### ST-12 — Local Docker Image Scan via the UI

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that a locally built Docker image can be scanned through the "Scan Local Image" feature. |
| **Action**           | Build a test Docker image locally (e.g., `docker build -t test-app:latest .`), open the UI, select the image from the local images dropdown, and start a scan. |
| **Expected Result**  | The scan completes and results for `test-app:latest` appear in the scan history with correct vulnerability counts. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

### ST-13 — Scheduled CI Scan Runs Automatically and Stores Artifacts

| Field                | Detail |
|----------------------|--------|
| **Objective**        | Verify that the scheduled GitHub Actions workflow (daily cron) triggers automatically and uploads a scan summary artifact. |
| **Action**           | Manually trigger the scheduled workflow using **workflow_dispatch** in GitHub Actions, then inspect the run result and artifacts tab. |
| **Expected Result**  | The workflow completes successfully and a scan summary artifact is visible in the **Artifacts** section of the run, retained for at least 30 days. |
| **Actual Result**    | *(to be filled in during testing)* |
| **Conclusion**       | *(Pass / Fail)* |

---

*End of Testing Plan*

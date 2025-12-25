# Testing Node Showcase API Endpoints Locally

## Start the server:
```bash
cd fhevm-react-template/packages/node-showcase
pnpm start
```

Server will run on: `http://localhost:3001`

## Test Endpoints using PowerShell:

### 1. Get available endpoints:
```powershell
Invoke-RestMethod -Uri http://localhost:3001 -Method GET
```

### 2. Health check:
```powershell
Invoke-RestMethod -Uri http://localhost:3001/health -Method GET
```

### 3. Get configuration:
```powershell
Invoke-RestMethod -Uri http://localhost:3001/config -Method GET
```

### 4. Run Counter Demo (POST):
```powershell
Invoke-RestMethod -Uri http://localhost:3001/counter -Method POST | ConvertTo-Json -Depth 10
```

### 5. Run Voting Demo (POST):
```powershell
Invoke-RestMethod -Uri http://localhost:3001/voting -Method POST | ConvertTo-Json -Depth 10
```

### 6. Run Ratings Demo (POST):
```powershell
Invoke-RestMethod -Uri http://localhost:3001/ratings -Method POST | ConvertTo-Json -Depth 10
```

### 7. Run All Demos (POST):
```powershell
Invoke-RestMethod -Uri http://localhost:3001/run-all -Method POST | ConvertTo-Json -Depth 10
```

## Using curl (if installed):

### Counter Demo:
```bash
curl -X POST http://localhost:3001/counter
```

### Voting Demo:
```bash
curl -X POST http://localhost:3001/voting
```

### Ratings Demo:
```bash
curl -X POST http://localhost:3001/ratings
```

### All Demos:
```bash
curl -X POST http://localhost:3001/run-all
```

## Using Browser:

- Visit `http://localhost:3001/` - See available endpoints
- Visit `http://localhost:3001/health` - Health check
- Visit `http://localhost:3001/config` - Configuration

Note: GET endpoints work in browser, POST endpoints need a tool like Postman or the PowerShell commands above.


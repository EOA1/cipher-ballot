# Testing Node Showcase API Endpoints Locally

## Start the Server

```bash
cd packages/node-showcase
pnpm start
```

The server will start on `http://localhost:3000`

## Test Endpoints

### 1. Get Available Endpoints
```bash
curl http://localhost:3000
```

### 2. Health Check
```bash
curl http://localhost:3000/health
```

### 3. Get Configuration
```bash
curl http://localhost:3000/config
```

### 4. Run Counter Demo
```bash
curl -X POST http://localhost:3000/counter
```

### 5. Run Voting Demo
```bash
curl -X POST http://localhost:3000/voting
```

### 6. Run Ratings Demo
```bash
curl -X POST http://localhost:3000/ratings
```

### 7. Run All Demos
```bash
curl -X POST http://localhost:3000/run-all
```

## Using Browser

Open in your browser:
- `http://localhost:3000` - See all endpoints
- `http://localhost:3000/health` - Health check
- `http://localhost:3000/config` - Configuration

## Using PowerShell (Windows)

```powershell
# GET requests
Invoke-WebRequest -Uri http://localhost:3000
Invoke-WebRequest -Uri http://localhost:3000/health
Invoke-WebRequest -Uri http://localhost:3000/config

# POST requests
Invoke-WebRequest -Uri http://localhost:3000/counter -Method POST
Invoke-WebRequest -Uri http://localhost:3000/voting -Method POST
Invoke-WebRequest -Uri http://localhost:3000/ratings -Method POST
Invoke-WebRequest -Uri http://localhost:3000/run-all -Method POST
```

## Using Postman or Insomnia

Import these requests:
- `GET http://localhost:3000`
- `GET http://localhost:3000/health`
- `GET http://localhost:3000/config`
- `POST http://localhost:3000/counter`
- `POST http://localhost:3000/voting`
- `POST http://localhost:3000/ratings`
- `POST http://localhost:3000/run-all`


## 🧱 What is Hexagonal Architecture?

Hexagonal Architecture (also known as Ports and Adapters) is a software design pattern that separates the **core business logic** from **infrastructure** and **delivery mechanisms**. This separation allows the application to be:

- Easier to test (core logic can be tested independently)
- More maintainable (infra adapters can change without affecting core)
- Highly decoupled (more reusable and extensible)

In this structure:
- **Domain** and **Application** layers contain business rules
- **Interface** and **Infrastructure** layers act as adapters

---

## 📁 Project Structure (Hexagonal)

```
src/
├── newsletter/
│   ├── application/                # Use cases
│   │   └── use-cases/
│   ├── domain/                     # Entities and repository interfaces (ports)
│   │   ├── models/
│   │   └── ports/
│   ├── infrastructure/            # Adapters for Firestore, etc.
│   │   └── firestore/
│   ├── interface/                 # Controllers and DTOs
│   │   ├── controllers/
│   │   └── dto/
│   └── newsletter.module.ts       # NestJS module
├── common/
├── firebase/
├── main.ts
```

---

## 🌐 Environments

- **Development:** `http://localhost:8080`
- **Production:** `https://api.checkgithub.com`

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or later)
- Docker
- Kubernetes CLI (`kubectl`)
- GCP CLI (`gcloud`)
- NestJS CLI

### Installation

```bash
git clone https://github.com/jrs-soft/checkgithub-back.git
cd checkgithub-back
npm install
```

---

## ▶️ Running the App Locally

```bash
npm run dev
```

Then open:

- Swagger (local): `http://localhost:4000/api-docs`
- Swagger (prod): `https://api.checkgithub.com/api-docs`

---

## 🧪 Testing the App

### ✅ Run All Tests (unit + integration)
```bash
npm run test
```

### 🧪 Run Unit Tests Only
```bash
npx jest --testPathPattern=unit
```

Or (if naming convention is used like `*.spec.ts`):
```bash
npx jest
```

### 🔁 Run Integration Tests Only (e.g. `*.int-spec.ts`)
```bash
npx jest --testRegex="\.int-spec\.ts$"
```

Add to `package.json` for convenience:
```json
"scripts": {
  "test:int": "jest --testRegex=\.int-spec\.ts$"
}
```

Then:
```bash
npm run test:int
```

### 📊 Run With Coverage
```bash
npm run test -- --coverage
```

---

## 🐳 Docker

### Build Image

```bash
docker build -t checkgithub-backend .
```

### Run Container

```bash
docker run -p 4000:4000 checkgithub-backend
```

---

## ☸️ Kubernetes

### Configuration Files

- `kubernetes-deployment.yaml`
- `kubernetes-service.yaml`

### Apply Configuration

```bash
kubectl apply -f kubernetes-deployment.yaml
kubectl apply -f kubernetes-service.yaml
```

---

## 🔁 Git Repositories

- `develop`: Main development branch  
- `main`: Production-ready branch

---

## ⚙️ GitHub Actions: Deployment

### Workflow: `deploy.yaml`

1. On push to `develop` or `main`, the workflow:
   - Builds Docker image
   - Pushes to container registry
   - Deploys to Kubernetes cluster

---

## ☁️ GCP Kubernetes Setup

### Authenticate & Set Project

```bash
gcloud auth login
gcloud config set project <your-project-id>
```

### Create Cluster

```bash
gcloud container clusters create checkgithub-cluster --zone <your-zone>
```

### Logs

Access via **Google Cloud Console > Logging**.

---

## 📦 Versioning

This project follows [Semantic Versioning](https://semver.org/).

---

## 🧩 Modular Features

Each feature (e.g., `newsletter`) is implemented as a module using Hexagonal Architecture for clarity, isolation, and testability.

---

For more details, check the source code and internal documentation.


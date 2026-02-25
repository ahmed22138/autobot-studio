# 🐳 Docker + Kubernetes (Minikube) Complete Guide
## AutoBot Studio - Deployment Guide

---

## 📁 Files Created

```
my-app/
├── Dockerfile                  ← Docker image build
├── .dockerignore               ← Files to exclude from image
├── docker-compose.yml          ← Local Docker testing
└── k8s/
    ├── namespace.yaml          ← Kubernetes namespace
    ├── configmap.yaml          ← Non-sensitive env vars
    ├── secret.yaml             ← Sensitive env vars (keys)
    ├── deployment.yaml         ← App deployment (2 replicas)
    ├── service.yaml            ← NodePort service
    ├── ingress.yaml            ← Ingress (optional)
    └── deploy.sh               ← Auto deploy script
```

---

## 🏗️ ARCHITECTURE

```
                    Internet
                       │
                  ┌────▼────┐
                  │ Ingress  │ (optional)
                  └────┬────┘
                       │
              ┌────────▼────────┐
              │  Kubernetes     │
              │  Service        │
              │  (NodePort:80)  │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         │                           │
    ┌────▼────┐                 ┌────▼────┐
    │  Pod 1  │                 │  Pod 2  │
    │  Next.js│                 │  Next.js│
    │  :3000  │                 │  :3000  │
    └────┬────┘                 └────┬────┘
         │                           │
         └─────────────┬─────────────┘
                       │
              External Services
         ┌─────────────┼─────────────┐
         │             │             │
    ┌────▼────┐   ┌────▼────┐  ┌────▼────┐
    │Supabase │   │ Stripe  │  │  Gmail  │
    │(Cloud)  │   │(Cloud)  │  │  SMTP   │
    └─────────┘   └─────────┘  └─────────┘
```

**Backend is Supabase (Cloud)** - No separate backend container needed!
All APIs are in Next.js itself (app/api/ folder).

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### Prerequisites (Install These First)

```bash
# 1. Docker Desktop
# Download: https://www.docker.com/products/docker-desktop/

# 2. Minikube
# Download: https://minikube.sigs.k8s.io/docs/start/

# 3. kubectl
# Download: https://kubernetes.io/docs/tasks/tools/

# Verify installations:
docker --version
minikube version
kubectl version --client
```

---

### OPTION A: Automatic (Recommended)

```bash
# 1. Navigate to project
cd "E:\course-recover\autonomus-frontend\my-app"

# 2. Set environment variable
set NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 3. Run deploy script
bash k8s/deploy.sh
```

---

### OPTION B: Manual (Step by Step)

#### Step 1: Start Minikube

```bash
minikube start --driver=docker
```

Expected output:
```
✅  minikube v1.x.x on Windows 11
✅  Using Docker Desktop driver
✅  Starting control plane node minikube in cluster minikube
✅  Done! kubectl is now configured to use "minikube"
```

---

#### Step 2: Use Minikube's Docker

```bash
# Windows (PowerShell):
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Windows (Git Bash):
eval $(minikube docker-env)
```

**Why?** This makes Docker build images inside Minikube, so Kubernetes can use them.

---

#### Step 3: Update k8s/secret.yaml

Open `k8s/secret.yaml` and fill in real values:

```yaml
stringData:
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIs..."
  SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIs..."
  EMAIL_PASSWORD: "mana upha kxae hkgm"
  # Keep other stripe values as placeholder for now
```

---

#### Step 4: Get Minikube IP

```bash
minikube ip
# Example output: 192.168.49.2
```

Update `k8s/configmap.yaml`:
```yaml
NEXT_PUBLIC_APP_URL: "http://192.168.49.2:30080"
```

---

#### Step 5: Build Docker Image

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="https://atyjeaegzgtpbdawbjnq.supabase.co" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY" \
  --build-arg NEXT_PUBLIC_APP_URL="http://MINIKUBE_IP:30080" \
  -t autobot-studio:latest .
```

Verify image built:
```bash
docker images | grep autobot
# autobot-studio   latest   abc123   2 minutes ago   ~200MB
```

---

#### Step 6: Apply Kubernetes Manifests

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Apply config
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# Deploy app
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

---

#### Step 7: Verify Deployment

```bash
# Check namespace
kubectl get namespace autobot-studio

# Check pods (wait for Running status)
kubectl get pods -n autobot-studio

# Expected output:
# NAME                                READY   STATUS    RESTARTS
# autobot-frontend-6d8c4f5b9-abc12    1/1     Running   0
# autobot-frontend-6d8c4f5b9-def34    1/1     Running   0

# Check services
kubectl get services -n autobot-studio

# Expected output:
# NAME              TYPE       CLUSTER-IP    PORT(S)        AGE
# autobot-service   NodePort   10.96.0.100   80:30080/TCP   1m
```

---

#### Step 8: Access the App

```bash
# Get Minikube IP
minikube ip
# Example: 192.168.49.2

# Access app
# Browser: http://192.168.49.2:30080
```

Or use Minikube's service command:
```bash
minikube service autobot-service -n autobot-studio
# This automatically opens browser!
```

---

## 🐳 DOCKER ONLY (Without Kubernetes)

If you just want Docker without Kubernetes:

### Build & Run

```bash
# Build image
docker build -t autobot-studio:latest .

# Run with docker-compose
docker-compose up -d

# Access: http://localhost:3000
```

### View Logs
```bash
docker-compose logs -f
```

### Stop
```bash
docker-compose down
```

---

## 📊 KUBECTL USEFUL COMMANDS

### Check Status
```bash
# All resources in namespace
kubectl get all -n autobot-studio

# Pods
kubectl get pods -n autobot-studio

# Services
kubectl get services -n autobot-studio

# Deployments
kubectl get deployments -n autobot-studio
```

### View Logs
```bash
# All pods logs
kubectl logs -n autobot-studio -l app=autobot-frontend

# Specific pod logs
kubectl logs -n autobot-studio POD_NAME

# Follow logs (live)
kubectl logs -n autobot-studio -l app=autobot-frontend -f
```

### Debug
```bash
# Describe pod (for errors)
kubectl describe pod -n autobot-studio POD_NAME

# Execute into pod
kubectl exec -it -n autobot-studio POD_NAME -- sh

# Check events
kubectl get events -n autobot-studio
```

### Scaling
```bash
# Scale up to 3 replicas
kubectl scale deployment autobot-frontend -n autobot-studio --replicas=3

# Scale down to 1
kubectl scale deployment autobot-frontend -n autobot-studio --replicas=1
```

### Update & Redeploy
```bash
# After making code changes:

# 1. Rebuild image (in Minikube docker env)
eval $(minikube docker-env)
docker build -t autobot-studio:latest .

# 2. Restart deployment (pick up new image)
kubectl rollout restart deployment/autobot-frontend -n autobot-studio

# 3. Check rollout status
kubectl rollout status deployment/autobot-frontend -n autobot-studio
```

### Delete Everything
```bash
# Delete entire namespace (removes everything)
kubectl delete namespace autobot-studio

# Or delete individually
kubectl delete -f k8s/
```

---

## 🔧 TROUBLESHOOTING

### Problem: ImagePullBackOff or ErrImagePull

```bash
# Check if image exists
docker images | grep autobot

# If not found, rebuild:
eval $(minikube docker-env)  # MUST run first!
docker build -t autobot-studio:latest .
```

**Cause:** Built image outside Minikube's Docker context

---

### Problem: CrashLoopBackOff

```bash
# Check logs
kubectl logs -n autobot-studio POD_NAME --previous

# Common cause: Missing env variables
# Fix: Update k8s/secret.yaml with real values
kubectl apply -f k8s/secret.yaml
kubectl rollout restart deployment/autobot-frontend -n autobot-studio
```

---

### Problem: Pods Pending

```bash
# Check events
kubectl describe pod -n autobot-studio POD_NAME

# Common cause: Insufficient resources
# Fix: Increase Minikube resources
minikube stop
minikube start --memory=4096 --cpus=2
```

---

### Problem: App Not Loading

```bash
# Check service
kubectl get service -n autobot-studio

# Test connectivity
curl http://$(minikube ip):30080

# Check pod is running
kubectl get pods -n autobot-studio
```

---

### Problem: Environment Variables Not Loading

```bash
# Verify configmap
kubectl describe configmap autobot-config -n autobot-studio

# Verify secret
kubectl describe secret autobot-secrets -n autobot-studio

# View secret values (base64 encoded)
kubectl get secret autobot-secrets -n autobot-studio -o yaml
```

---

## 🌐 ARCHITECTURE EXPLANATION

### Frontend (Next.js) - Containerized ✅
- The entire Next.js app runs in Docker
- All API routes (`app/api/`) are inside Next.js
- No separate backend server needed!

### Backend Services - External (Cloud) ✅
- **Supabase** → Cloud database (no container needed)
- **Stripe** → Cloud payment service (no container needed)
- **Gmail SMTP** → Cloud email service (no container needed)

### Why No Separate Backend Container?
```
Your "backend" = Next.js API routes
app/api/chatbot/route.ts        ← Chatbot API
app/api/admin/users/route.ts    ← Admin API
app/api/support/route.ts        ← Support API
app/api/stripe/checkout/route.ts ← Stripe API
app/api/stripe/webhook/route.ts  ← Webhook handler

All in ONE Next.js container! ✅
```

---

## 📋 QUICK REFERENCE

### First Time Setup
```bash
minikube start --driver=docker
eval $(minikube docker-env)
docker build -t autobot-studio:latest .
kubectl apply -f k8s/
minikube service autobot-service -n autobot-studio
```

### Daily Usage
```bash
minikube start  # Start Minikube
kubectl get pods -n autobot-studio  # Check status
minikube service autobot-service -n autobot-studio  # Open app
minikube stop  # Stop when done
```

### Update App Code
```bash
eval $(minikube docker-env)
docker build -t autobot-studio:latest .
kubectl rollout restart deployment/autobot-frontend -n autobot-studio
```

---

## ✅ SUCCESS CHECKLIST

After deployment, verify:

- [ ] `minikube status` shows Running
- [ ] `kubectl get pods -n autobot-studio` shows 2/2 Running
- [ ] `kubectl get services -n autobot-studio` shows NodePort
- [ ] App opens in browser at Minikube IP:30080
- [ ] Login page works
- [ ] Signup works
- [ ] Dashboard loads
- [ ] Agent creation works
- [ ] Admin panel works
- [ ] Chatbot appears on site
- [ ] Support ticket works

---

## 📝 FILES SUMMARY

| File | Purpose |
|------|---------|
| `Dockerfile` | Builds optimized Next.js Docker image |
| `.dockerignore` | Excludes unnecessary files from image |
| `docker-compose.yml` | Local Docker testing |
| `k8s/namespace.yaml` | Creates autobot-studio namespace |
| `k8s/configmap.yaml` | Non-sensitive environment variables |
| `k8s/secret.yaml` | Sensitive keys (update before deploying!) |
| `k8s/deployment.yaml` | App deployment with 2 replicas |
| `k8s/service.yaml` | NodePort service (port 30080) |
| `k8s/ingress.yaml` | Ingress for domain routing (optional) |
| `k8s/deploy.sh` | Automated deployment script |

---

**Happy Deploying!** 🚀

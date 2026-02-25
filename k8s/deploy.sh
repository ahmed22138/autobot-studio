#!/bin/bash
# =====================================================
# AutoBot Studio - Kubernetes Deploy Script
# Run this to deploy everything to Minikube
# =====================================================

echo "🚀 AutoBot Studio - Kubernetes Deployment"
echo "=========================================="

# Step 1: Start Minikube
echo ""
echo "📦 Step 1: Starting Minikube..."
minikube start --driver=docker

# Step 2: Use Minikube's Docker daemon
echo ""
echo "🐳 Step 2: Connecting to Minikube Docker..."
eval $(minikube docker-env)

# Step 3: Build Docker image inside Minikube
echo ""
echo "🔨 Step 3: Building Docker image..."
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="https://atyjeaegzgtpbdawbjnq.supabase.co" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-arg NEXT_PUBLIC_APP_URL="http://$(minikube ip):30080" \
  -t autobot-studio:latest .

echo "✅ Docker image built!"

# Step 4: Apply Kubernetes manifests
echo ""
echo "☸️  Step 4: Applying Kubernetes manifests..."

kubectl apply -f k8s/namespace.yaml
echo "✅ Namespace created"

kubectl apply -f k8s/configmap.yaml
echo "✅ ConfigMap applied"

kubectl apply -f k8s/secret.yaml
echo "✅ Secrets applied"

kubectl apply -f k8s/deployment.yaml
echo "✅ Deployment applied"

kubectl apply -f k8s/service.yaml
echo "✅ Service applied"

# Step 5: Wait for pods to be ready
echo ""
echo "⏳ Step 5: Waiting for pods to start..."
kubectl rollout status deployment/autobot-frontend -n autobot-studio --timeout=120s

# Step 6: Get access URL
echo ""
echo "🌐 Step 6: Getting access URL..."
MINIKUBE_IP=$(minikube ip)
echo "✅ App is running!"
echo ""
echo "=========================================="
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "=========================================="
echo ""
echo "📱 Access URLs:"
echo "  Local:   http://localhost:3000"
echo "  Minikube: http://$MINIKUBE_IP:30080"
echo ""
echo "📊 Useful Commands:"
echo "  View pods:      kubectl get pods -n autobot-studio"
echo "  View logs:      kubectl logs -n autobot-studio -l app=autobot-frontend"
echo "  View services:  kubectl get services -n autobot-studio"
echo "  Delete all:     kubectl delete namespace autobot-studio"
echo ""

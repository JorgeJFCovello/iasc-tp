# docker build -t jferc1310/iasc-k8s-frontend:latest ./frontend
# docker build -t jferc1310/iasc-k8s-backend:latest ./backend
kubectl apply -f frontend-service.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f backend-service.yaml
#kubectl expose -f backend-deployment.yaml --type=LoadBalancer --name=backend
kubectl apply -f backend-deployment.yaml
minikube service frontend --url
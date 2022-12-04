
kubectl apply -f pv-backend.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f backend-statefulSet.yaml
kubectl apply -f proxy-service.yaml
kubectl apply -f proxy-deployment.yaml
minikube service frontend --url
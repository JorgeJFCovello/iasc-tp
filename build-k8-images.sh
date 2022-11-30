docker build -t jferc1310/iasc-k8s-frontend:latest ./frontend
docker build -t jferc1310/iasc-k8s-backend:latest ./backend
docker build -t jferc1310/iasc-k8s-proxy:latest ./proxy
docker push jferc1310/iasc-k8s-frontend:latest
docker push jferc1310/iasc-k8s-backend:latest 
docker push jferc1310/iasc-k8s-proxy:latest 
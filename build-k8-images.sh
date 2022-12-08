docker build -t jferc1310/iasc-k8s-frontend:demo ./frontend
docker build -t jferc1310/iasc-k8s-backend:demo ./backend
docker build -t jferc1310/iasc-k8s-proxy:demo ./proxy
docker push jferc1310/iasc-k8s-frontend:demo
docker push jferc1310/iasc-k8s-backend:demo 
docker push jferc1310/iasc-k8s-proxy:demo 
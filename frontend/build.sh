npm run build
docker buildx build  --platform=linux/amd64 -t  3.1.250.199:5000/frontend:v1.20.10 .
docker push 3.1.250.199:5000/frontend:v1.20.10

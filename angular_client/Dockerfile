FROM node:20.10.0 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

COPY wait-for-mongodb.sh /app/wait-for-mongodb.sh
RUN chmod +x /app/wait-for-mongodb.sh

RUN npm run build --legacy-peer-deps

FROM nginx:latest

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist/angular_client .

COPY --from=builder /app/wait-for-mongodb.sh /usr/share/nginx/html/wait-for-mongodb.sh
RUN chmod +x /usr/share/nginx/html/wait-for-mongodb.sh

EXPOSE 80

CMD ["/usr/share/nginx/html/wait-for-mongodb.sh", "mongodb:27017", "--", "nginx", "-g", "daemon off;"]

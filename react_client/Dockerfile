# # SIN NGINX
# FROM node:20.10.0

# WORKDIR /app

# COPY package*.json ./

# RUN npm install --legacy-peer-deps

# COPY . .

# COPY wait-for-mongodb.sh /app/wait-for-mongodb.sh
# RUN chmod +x /app/wait-for-mongodb.sh

# COPY config /app/config

# EXPOSE 3000

# CMD ["/app/wait-for-mongodb.sh", "mongodb:27017", "--", "npm", "start"]

#CON NGINX
FROM node:20.10.0 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

ENV PATH /app/node_modules/.bin:$PATH

COPY . .

COPY wait-for-mongodb.sh /app/wait-for-mongodb.sh
RUN chmod +x /app/wait-for-mongodb.sh

COPY config /app/config

RUN npm run build --legacy-peer-deps


FROM nginx:latest

RUN apt-get update && apt-get install -y nodejs npm

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/build .

COPY --from=builder /app/config /usr/share/nginx/html/config

COPY --from=builder /app/wait-for-mongodb.sh /usr/share/nginx/html/wait-for-mongodb.sh
RUN chmod +x /usr/share/nginx/html/wait-for-mongodb.sh


EXPOSE 80

CMD ["/usr/share/nginx/html/wait-for-mongodb.sh", "mongodb:27017", "--", "nginx", "-g", "daemon off;"]


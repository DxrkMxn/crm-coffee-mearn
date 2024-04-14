FROM node:20.10.0

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

COPY wait-for-mongodb.sh /app/wait-for-mongodb.sh
RUN chmod +x /app/wait-for-mongodb.sh

RUN apt-get update && apt-get install -y telnet

RUN npm install -g npm@7.24.0

EXPOSE 5000

CMD ["bash", "-c", "until nc -z mongodb 27017; do echo 'Waiting for MongoDB to start...'; sleep 20; done; node index.js"]
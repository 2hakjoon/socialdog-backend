FROM node:16
WORKDIR /usr/src/socialdog-backend
COPY package.json .
RUN npm install
COPY . .

EXPOSE 4000

CMD node dist/main.js
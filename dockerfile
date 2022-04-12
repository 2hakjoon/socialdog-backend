FROM node:16
WORKDIR /usr/src/socialdog-backend
COPY package.json .
RUN npm install
COPY . .

RUN npm run --script build

EXPOSE 3000

CMD node dist/main.js
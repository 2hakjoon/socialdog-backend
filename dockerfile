FROM node:16
RUN npm install -g npm@8.6.0
WORKDIR /usr/src/socialdog-backend
COPY package.json .
RUN npm install
COPY . .

EXPOSE 4000

CMD node dist/main.js
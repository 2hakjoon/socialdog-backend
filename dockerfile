FROM node:16
RUN npm install -g npm@8.6.0
WORKDIR /usr/src/socialdog-backend
COPY package.json package-lock.json ./
RUN npm install
COPY . .

EXPOSE 3000

CMD npm run start:dev
FROM node:17-alpine

WORKDIR /app
COPY . /app

RUN npm install

ENTRYPOINT [ "npm", "start" ]

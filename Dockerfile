FROM node:17-alpine

WORKDIR /app
ADD . /app

RUN npm install

ENTRYPOINT [ "npm", "start" ]

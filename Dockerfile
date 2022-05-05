FROM node:17-alpine

RUN mkdir -p /docker/stalkee
WORKDIR /docker/stalkee
ADD . /docker/stalkee/

RUN npm install

ENTRYPOINT npm start

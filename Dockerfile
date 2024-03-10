FROM node:21-alpine
LABEL maintainer="arelive <me@are.moe> (are.moe)"

WORKDIR /app
COPY . .

RUN npm install

ENTRYPOINT [ "npm", "start" ]

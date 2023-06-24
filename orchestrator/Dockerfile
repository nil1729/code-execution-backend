FROM node:18.14.2-alpine3.17
LABEL maintainer="Nilanjan Deb <nilanjan172nsvian@gmail.com>"
WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]
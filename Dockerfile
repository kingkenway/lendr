FROM node:19
RUN npm install -g nodemon
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm cache clear --force && npm install
ENTRYPOINT ["npm", "start"]


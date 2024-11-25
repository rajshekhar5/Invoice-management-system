# Use an official Node.js runtime as a parent image
FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app/

RUN npm run build

EXPOSE 5176

CMD ["npx", "serve", "build"]

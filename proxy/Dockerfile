FROM node:alpine
WORKDIR /app
COPY package.json .
RUN npm install
EXPOSE 5000
COPY . .
RUN rm .env
RUN mv .env.docker .env
CMD ["node", "index.js"]
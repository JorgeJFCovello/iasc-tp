FROM node:alpine
WORKDIR /app
COPY package.json .
RUN npm install
EXPOSE 3000
COPY . .
RUN rm .env
RUN mv .env.docker .env
RUN npm run build
CMD ["npm", "run", "start"]
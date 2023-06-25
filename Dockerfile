FROM node:14.18.0

WORKDIR /

COPY package.json .
COPY package-lock.json .
COPY . .
RUN npm install


# Bundle app source
RUN npm run build 

EXPOSE 3000
CMD [ "npm", "start" ]
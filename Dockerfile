FROM node:14.18.0 as BUILD_IMAGE

WORKDIR /app

COPY package*.json .
RUN npm install

FROM node:alpine as main

COPY --from=BUILD_IMAGE /app /


COPY . .
# Bundle app source
RUN npm run build 

EXPOSE 3000
CMD [ "npm", "start" ]
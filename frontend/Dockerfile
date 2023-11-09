FROM node:18-alpine

# Create app directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

RUN apk update && apk upgrade
RUN apk add git

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . /usr/src/nuxt-app/

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
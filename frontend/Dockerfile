FROM node:18-alpine

ENV HOST 0.0.0.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .


RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "node", ".output/server/index.mjs" ]
FROM node:14-alpine as base

COPY package*.json /
EXPOSE 3000

FROM base as production
ENV NODE_ENV=production
RUN apk add --no-cache python3 py3-pip
RUN npm install --ignore-scripts=false
RUN npm rebuild sharp
COPY . /
CMD ["node", "bin/www"]

FROM base as dev
ENV NODE_ENV=development
RUN apk add --no-cache python3 py3-pip
RUN npm install --ignore-scripts=false --verbose -g nodemon
RUN npm rebuild --verbose sharp
COPY . /
CMD ["nodemon", "bin/www"]

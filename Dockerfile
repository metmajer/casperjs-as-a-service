FROM node:latest

RUN mkdir -p /app
COPY package.json /app
COPY casperjs-as-a-service.js /app
WORKDIR /app

ENV RUNTIME_DEPS "python"
RUN apt-get update && \
    apt-get install -y ${RUNTIME_DEPS} && \
    rm -rf /var/lib/apt/lists/*

ENV NPM_RUNTIME_DEPS "phantomjs slimerjs casperjs"
RUN npm install -g ${NPM_RUNTIME_DEPS}
RUN npm install

EXPOSE 80

CMD ["npm", "run", "start"]
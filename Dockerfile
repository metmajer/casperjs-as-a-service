FROM node:latest

COPY . /app
WORKDIR /app

ENV RUNTIME_DEPS "python redis-server"
RUN apt-get update && \
    apt-get install -y ${RUNTIME_DEPS} && \
    rm -rf /var/lib/apt/lists/*

ENV NPM_RUNTIME_DEPS "phantomjs casperjs"
RUN npm install -g ${NPM_RUNTIME_DEPS}
RUN npm install

EXPOSE 80

CMD ["npm", "run", "start"]
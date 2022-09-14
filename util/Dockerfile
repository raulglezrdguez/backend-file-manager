FROM node:16

WORKDIR /app
COPY package.json .

ARG NODE_ENV
RUN if [ "NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --omit=dev; \
    fi

COPY . ./

ENV PORT 4000
ENV SECRET_KEY=
ENV EMAIL_HOST=smtp.gmail.com
ENV EMAIL_PORT=465
ENV EMAIL_USER=
ENV EMAIL_PASSWORD=
ENV HOST=http://localhost:3000
ENV MONGO_USER=
ENV MONGO_PASSWORD=
ENV MONGO_IP=127.0.0.1
ENV MONGO_PORT=27017
ENV MONGO_DATABASE=filemanager

EXPOSE ${PORT}
CMD [ "npm", "run", "dev" ]

FROM node:lts

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install --frozen-lockfile

ARG PORT
ENV PORT $PORT

COPY . /app/

EXPOSE $PORT

RUN yarn run build

USER node

CMD ["yarn", "start"]

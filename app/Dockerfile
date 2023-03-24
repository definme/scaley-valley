FROM node:19.8.1-buster as build-app
ARG REACT_APP_CHANNEL_PK
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json yarn.lock ./
RUN yarn
COPY src ./src
COPY public ./public
RUN yarn build

FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-app /app/build /usr/share/nginx/html
EXPOSE 80

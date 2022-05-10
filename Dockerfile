FROM node:17.6-alpine3.14 as builder

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN apk add --no-cache --virtual .gyp \
    python3 \
    make \
    g++ \
    && npm ci \
    && npm install react-scripts@3.3.0 -g --silent \
    && apk del .gyp

COPY ./ /usr/src/app
ARG REACT_APP_RESERVATIONS_URL
ENV REACT_APP_RESERVATIONS_URL $REACT_APP_RESERVATIONS_URL

RUN npx browserslist@latest --update-db
RUN npm run build
#CMD ["npm", "start"]

FROM nginx:1.21.6-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY /prod.conf /etc/nginx/conf.d
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
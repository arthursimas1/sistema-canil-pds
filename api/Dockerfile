# build stage
FROM node:15.5-alpine3.11 AS build

RUN apk update \
 && yarn config set script-shell /bin/bash

RUN apk add --no-cache python make g++

COPY ./package.json /build/
RUN yarn --cwd /build install

COPY ./config /build/config/
#COPY ./test /build/test/
COPY ./src /build/src/

# runtime stage
FROM node:15.5-alpine3.11 AS runtime

RUN yarn config set script-shell /bin/bash

RUN apk add --no-cache bash curl \
 && mkdir /sockets /log

COPY .bashrc /root/.bashrc

COPY --from=build /build /build/

STOPSIGNAL HUP

HEALTHCHECK --interval=5m --timeout=5s --retries=3 \
  CMD curl --unix-socket /sockets/pds.sock http://api.pds.3wx.ru/health_check -fs -H "authorization: h%mA5Uv&*q8i4Ler" > dev/null || exit 1

COPY ./container_entrypoint /
ENTRYPOINT ["/container_entrypoint"]

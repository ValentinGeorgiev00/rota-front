# Pull base image.
FROM nginx:alpine

COPY ./dist/rota-front /usr/share/nginx/html
COPY ./conf /etc/nginx/conf.d

COPY VERSION /

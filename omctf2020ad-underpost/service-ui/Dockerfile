FROM node:11.9.0-alpine as build
WORKDIR /opt/underpost-ui
#ENV PATH /opt/underpost-ui/node_modules/.bin:$PATH

COPY package.json ./package.json
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
COPY ./webpack.config.js ./webpack.config.js
COPY ./src ./src 

#API_HOST_ARG - base url to host machine with API container (http://192.165.100.34), API_PORT_ARG - external port to API since UI is client side js
ARG API_HOST_ARG=
ARG API_PORT_ARG=

ENV REACT_APP_API_HOST $API_HOST_ARG
ENV REACT_APP_API_PORT $API_PORT_ARG
RUN echo API CONFIGURATION $REACT_APP_API_HOST:$REACT_APP_API_PORT

RUN REACT_APP_API_HOST=$REACT_APP_API_HOST REACT_APP_API_PORT=$REACT_APP_API_PORT npm run-script build

FROM nginx:1.16.0-alpine
COPY --from=build /opt/underpost-ui/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d

ENV REACT_APP_API_HOST $API_HOST_ARG
ENV REACT_APP_API_PORT $API_PORT_ARG
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
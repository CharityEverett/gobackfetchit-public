FROM node:14-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src .

FROM nginx:alpine

COPY --from=build /app /usr/share/nginx/html
COPY --from=build /app/node_modules/aframe/dist/aframe-master.min.js /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

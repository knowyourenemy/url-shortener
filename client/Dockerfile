# build environment
FROM --platform=linux/amd64 node:15 as react-build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
RUN npm run build

# server environment
FROM --platform=linux/amd64 nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template

COPY --from=react-build /app/build /usr/share/nginx/html

EXPOSE 3000
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
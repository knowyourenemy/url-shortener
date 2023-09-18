FROM --platform=linux/amd64 node:15
WORKDIR /app
COPY server/package.json .
RUN npm install
COPY server/. ./
RUN npm run build
EXPOSE 8000
CMD ["npm", "run", "start"]
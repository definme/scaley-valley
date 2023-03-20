FROM node:16
WORKDIR /app
ADD api.js ./api.js
ADD bridge.js ./bridge.js
ADD package.json ./package.json
ADD package-lock.json ./package-lock.json
ADD ResourceToken.abi.json ./ResourceToken.abi.json
RUN npm install

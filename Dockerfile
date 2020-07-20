FROM node:12.18.2-stretch-slim
# Set a directory for the app
WORKDIR /usr/src/app
COPY yarn.lock ./
RUN yarn global add typeorm
RUN yarn --frozen-lockfile
# Copy all source files to the container
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
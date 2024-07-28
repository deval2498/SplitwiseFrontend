# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN npm install

# Ensure that your source code is correctly placed in the Docker image
# Assuming your app's entry point and other sources are inside the src directory
COPY src/ ./src

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Adjust the command to run your app if necessary, assuming 'node src/app.js'
CMD ["node", "src/app.js"]

# Use the Node.js LTS image as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies, including development dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Remove development dependencies to reduce image size
RUN npm prune --production

# Expose the application's port
EXPOSE 8080

# Command to start the application
CMD ["node", "dist/main"]

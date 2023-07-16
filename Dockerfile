# Use the official Node.js image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /client

# Copy the application files into the working directory
COPY . /client

# Install the application dependencies
RUN npm install

# Build the React application
RUN  npm run start

# Expose port 3000
EXPOSE 3000

# Define the entry point for the container
CMD ["npm", "start"]
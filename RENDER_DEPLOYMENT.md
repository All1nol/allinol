# Deploying Allinol to Render

This guide provides instructions for deploying the Allinol application to Render.

## Prerequisites

1. A Render account (https://render.com)
2. A MongoDB Atlas account (or any MongoDB provider)
3. A Groq API key for LLM services

## Deployment Steps

### Option 1: Deploy using the Render Dashboard

1. **Create a new Web Service for the API**:
   - Sign in to your Render account
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Set the following configuration:
     - Name: `allinol-api`
     - Root Directory: `server`
     - Environment: `Node`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   - Add the following environment variables:
     - `PORT`: `5000`
     - `NODE_ENV`: `production`
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure random string
     - `GROQ_API_KEY`: Your Groq API key
     - `GROQ_MODEL`: `llama-3.3-70b-specdec`
     - `GROQ_RATE_LIMIT`: `60`
   - Click "Create Web Service"

2. **Create a new Static Site for the client**:
   - Click "New" and select "Static Site"
   - Connect your GitHub repository
   - Set the following configuration:
     - Name: `allinol-client`
     - Root Directory: `client`
     - Build Command: `npm install && npm run build`
     - Publish Directory: `dist`
   - Add the following environment variable:
     - `VITE_API_URL`: The URL of your API service + `/api` (e.g., `https://allinol-api.onrender.com/api`)
   - Add the following redirect/rewrite rule:
     - Source: `/*`
     - Destination: `/index.html`
   - Click "Create Static Site"

### Option 2: Deploy using the render.yaml file

1. **Push the render.yaml file to your repository**:
   - The render.yaml file is already created in the root of your project
   - Push it to your GitHub repository

2. **Create a new Blueprint in Render**:
   - Sign in to your Render account
   - Click "New" and select "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the render.yaml file and create the services
   - You'll need to manually set the secret environment variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure random string
     - `GROQ_API_KEY`: Your Groq API key

3. **Deploy the Blueprint**:
   - Review the configuration
   - Click "Apply"
   - Render will create and deploy both services

## Verifying Deployment

1. **Check the API service**:
   - Visit the API URL (e.g., `https://allinol-api.onrender.com`)
   - You should see the message "Allinol API is running"
   - Visit the health check endpoint (e.g., `https://allinol-api.onrender.com/health`)
   - You should see a JSON response with the status "ok"

2. **Check the client service**:
   - Visit the client URL (e.g., `https://allinol-client.onrender.com`)
   - You should see the Allinol application
   - Try logging in or registering to verify the connection to the API

## Troubleshooting

1. **API Connection Issues**:
   - Check that the `VITE_API_URL` environment variable is set correctly in the client service
   - Ensure the API service is running and accessible
   - Check the CORS configuration in the API service

2. **Database Connection Issues**:
   - Verify that the `MONGO_URI` environment variable is set correctly
   - Ensure your MongoDB instance is running and accessible
   - Check the network access settings in MongoDB Atlas

3. **Build Failures**:
   - Check the build logs in the Render dashboard
   - Ensure all dependencies are correctly specified in package.json
   - Verify that the build commands are correct

## Updating the Deployment

Render automatically deploys changes when you push to your GitHub repository. To update your deployment:

1. Make changes to your code
2. Commit and push to GitHub
3. Render will automatically rebuild and deploy the changes 
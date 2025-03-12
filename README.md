# Allinol - AI-Driven Business Automation Platform

Allinol is a comprehensive business automation platform that centralizes company operations through a cross-platform application, integrating neural networks and third-party services.

## Features

- **Process Automation Engine**: Integration with automation tools (n8n, Flowise, Camunda)
- **Third-Party Service Integrations**: Short links, email marketing, social media publishing, and more
- **AI-Driven Automation**: AI-powered recommendations for workflow optimization
- **Data & Entity Management**: Store, manage, and structure key business data
- **Documentation & Knowledge Management**: AI-assisted document classification and retrieval
- **Visual Database Management**: Integration with Apitable, NocoDB

## Project Structure

The project is divided into two main parts:

- **Server**: Node.js + TypeScript backend with Express and MongoDB
- **Client**: React + TypeScript frontend with Vite, TailwindCSS, and ShadCN

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/allinol.git
   cd allinol
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the server directory based on `.env.example`
   - Create a `.env` file in the client directory based on `.env.example`

### Running the Application

1. Start the server:
   ```
   cd server
   npm run dev
   ```

2. Start the client:
   ```
   cd ../client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Development Roadmap

1. **PRD to AI Task Breakdown**
   - AI-powered PRD analysis
   - Task extraction & role categorization
   - Basic CRUD for managing tasks
   - API + simple frontend for viewing tasks

2. **Entity System + RBAC**
   - Build core database models
   - Implement entity relationships
   - Role-based access control
   - File storage integration

3. **Full Automation & Integrations**
   - Process automation
   - AI-powered project strategy & roadmap
   - API integrations
   - Advanced visual dashboards

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
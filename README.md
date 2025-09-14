# ClimateFlow - Workflow Optimization Platform

A React frontend with Python backend integration for analyzing and optimizing business workflows for climate impact.

## Project info

**URL**: https://lovable.dev/projects/9823f729-203f-4541-a4b4-94328eda3668

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9823f729-203f-4541-a4b4-94328eda3668) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

**Frontend:**
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Query (TanStack Query)

**Backend:**
- Python
- Flask
- Flask-CORS
- Pandas & NumPy

## Python Backend Integration

This project includes a Python backend that can interface with your React frontend. Here's how to set it up:

### Quick Start

1. **Start both servers automatically:**
   ```bash
   # Windows
   start-dev.bat
   
   # Mac/Linux
   chmod +x start-dev.sh
   ./start-dev.sh
   ```

2. **Or start manually:**
   ```bash
   # Terminal 1 - Python Backend
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   
   # Terminal 2 - React Frontend
   npm run dev
   ```

### Python Integration Features

- **REST API endpoints** for workflow data
- **Real-time data processing** from Python scripts
- **Automatic fallback** to sample data if backend is unavailable
- **Health monitoring** with connection status indicators

### Example Python Scripts

The `backend/` folder includes example scripts showing how to:
- Send analysis results to React (`data_processor.py`)
- Create custom analysis workflows (`example_analysis.py`)
- Process data and update the frontend in real-time

### API Endpoints

- `GET /api/health` - Backend health check
- `GET /api/workflow` - Get workflow data
- `GET /api/analytics/summary` - Get analytics summary
- `POST /api/process-data` - Send processed data to frontend

See `backend/README.md` for detailed API documentation.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9823f729-203f-4541-a4b4-94328eda3668) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

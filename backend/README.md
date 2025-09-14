# Python Backend for ClimateFlow

This Python backend provides REST API endpoints to serve workflow data to the React frontend.

## Setup

1. **Install Python dependencies:**
   ```bash
   cd backend
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On Mac/Linux:
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

2. **Set up API keys:**
   ```bash
   # Copy the example environment file
   cp env_example.txt .env
   
   # Edit .env and add your actual API keys:
   # - novita_api_key: For Llama models (get from https://novita.ai/)
   # - openai_api_key: For GPT-4 (get from https://platform.openai.com/)
   # - claude_api_key: For Claude (optional, get from https://console.anthropic.com/)
   ```

3. **Run the Flask server:**
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## Required API Keys

The workflow uses real AI models and requires API keys:

- **Novita API**: For Llama 3.3 70B and Llama 3.1 8B models
- **OpenAI API**: For GPT-4 prompt optimization analysis
- **Anthropic API**: For Claude (optional, not currently used but available)

Without these keys, the workflow will fail when trying to run the AI analysis steps.

## API Endpoints

### Health Check
- `GET /api/health` - Check if the backend is running

### Workflow Data
- `GET /api/workflow` - Get all workflow nodes
- `GET /api/workflow/{node_id}` - Get specific workflow node
- `GET /api/workflow/{node_id}/metrics` - Get metrics for a specific node

### Analytics
- `GET /api/analytics/summary` - Get overall analytics summary

### Data Processing
- `POST /api/process-data` - Process data from Python scripts

## Example Usage

### Running the Data Processor
```bash
python data_processor.py
```

This will:
1. Analyze workflow efficiency
2. Generate workflow variations
3. Send results to the React frontend via API

### Custom Python Scripts

You can create your own Python scripts that interface with the React app:

```python
import requests
import json

# Send data to React frontend
def send_to_frontend(data):
    response = requests.post(
        'http://localhost:5000/api/process-data',
        json=data,
        headers={'Content-Type': 'application/json'}
    )
    return response.json()

# Example usage
my_analysis_results = {
    "recommendations": ["Optimize data collection", "Reduce paper usage"],
    "cost_savings": 25,
    "climate_impact": -40
}

result = send_to_frontend(my_analysis_results)
print(result)
```

## Development

The backend uses Flask with CORS enabled to allow communication with the React frontend. The data structure matches the `WorkflowNode` interface defined in the React app.

### Adding New Endpoints

1. Add your endpoint function in `app.py`
2. Update the React hooks in `src/hooks/useWorkflowData.ts` if needed
3. Test the integration

### Data Format

Workflow nodes should follow this structure:
```json
{
  "id": "unique_id",
  "label": "Node Label",
  "type": "process|analysis|decision|output",
  "position": {"x": 50, "y": 150},
  "data": {
    "original": "Original workflow description",
    "steps": ["Step 1", "Step 2"],
    "optimized": "Optimized workflow description",
    "variations": ["Variation 1", "Variation 2"],
    "metrics": {
      "similarity": 85,
      "quality": 92,
      "costReduction": 45,
      "climateImpact": -35
    }
  }
}
```

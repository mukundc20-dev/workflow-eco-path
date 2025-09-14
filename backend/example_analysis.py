"""
Example script showing how to send custom analysis results to your React app
"""
import requests
import json
from datetime import datetime

def send_custom_analysis():
    """
    Example of sending custom analysis results to the React frontend
    """
    
    # Your custom analysis results
    analysis_results = {
        "timestamp": datetime.now().isoformat(),
        "analysisType": "Custom Workflow Optimization",
        "findings": {
            "bottlenecks": [
                {
                    "process": "Data Collection",
                    "issue": "Manual data entry taking 3 hours daily",
                    "impact": "High",
                    "recommendation": "Implement automated data capture"
                },
                {
                    "process": "Approval Workflow", 
                    "issue": "Paper-based signatures causing delays",
                    "impact": "Medium",
                    "recommendation": "Switch to digital signatures"
                }
            ],
            "opportunities": [
                {
                    "area": "Process Automation",
                    "potentialSavings": "$15,000/year",
                    "implementationTime": "2-3 months",
                    "climateImpact": "Reduce paper usage by 80%"
                },
                {
                    "area": "Digital Transformation",
                    "potentialSavings": "$8,000/year", 
                    "implementationTime": "1-2 months",
                    "climateImpact": "Eliminate printing costs"
                }
            ]
        },
        "recommendations": [
            "Prioritize data collection automation",
            "Implement digital approval workflows",
            "Set up real-time monitoring dashboards",
            "Train staff on new digital processes"
        ],
        "metrics": {
            "totalPotentialSavings": 23000,
            "estimatedClimateImpact": -65,
            "implementationComplexity": "Medium",
            "roi": 3.2
        }
    }
    
    try:
        # Send to backend API
        response = requests.post(
            'http://localhost:5000/api/process-data',
            json=analysis_results,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("✅ Custom analysis sent to React app successfully!")
            print("📊 Results:", response.json())
        else:
            print(f"❌ Failed to send analysis: {response.status_code}")
            print("Response:", response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend server.")
        print("Make sure the Flask app is running: python app.py")
    except Exception as e:
        print(f"❌ Error: {e}")

def send_workflow_update():
    """
    Example of sending updated workflow data to the React app
    """
    
    # Updated workflow node data
    updated_workflow = [
        {
            "id": "start",
            "label": "Data Collection",
            "type": "process",
            "position": {"x": 50, "y": 150},
            "data": {
                "original": "Manual data entry from multiple spreadsheets and paper forms.",
                "steps": ["Step 1: Gather paper forms", "Step 2: Input into spreadsheets"],
                "optimized": "AI-powered automated data collection with real-time validation.",
                "variations": [
                    "Mobile-first data capture",
                    "OCR-based form processing",
                    "API integration with existing systems"
                ],
                "metrics": {
                    "similarity": 90,  # Updated from 85
                    "quality": 95,     # Updated from 92
                    "costReduction": 60, # Updated from 45
                    "climateImpact": -50 # Updated from -35
                }
            }
        }
    ]
    
    try:
        # Note: You would need to add a PUT endpoint to update workflow data
        # For now, this is just an example of the data structure
        print("📝 Example updated workflow data:")
        print(json.dumps(updated_workflow, indent=2))
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 Running custom analysis examples...")
    print()
    
    print("1. Sending custom analysis results...")
    send_custom_analysis()
    print()
    
    print("2. Example workflow update data...")
    send_workflow_update()
    print()
    
    print("✅ Examples completed!")
    print("Check your React app to see the results.")

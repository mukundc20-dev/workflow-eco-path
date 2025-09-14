from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Sample workflow data that matches your React interface
SAMPLE_WORKFLOW_DATA = [
    {
        "id": "start",
        "label": "Data Collection",
        "type": "process",
        "position": {"x": 50, "y": 150},
        "data": {
            "original": "Manual data entry from multiple spreadsheets and paper forms. Team members spend 2-3 hours daily collecting information from various sources.",
            "steps": ["Step 1: Gather paper forms", "Step 2: Input into spreadsheets", "Step 3: Cross-reference data"],
            "optimized": "Automated data collection using digital forms with real-time validation and cloud synchronization.",
            "variations": [
                "Mobile-first data capture",
                "AI-powered form recognition", 
                "Integration with existing systems",
                "Real-time dashboard updates"
            ],
            "metrics": {
                "similarity": 85,
                "quality": 92,
                "costReduction": 45,
                "climateImpact": -35
            }
        }
    },
    {
        "id": "process",
        "label": "Analysis & Review",
        "type": "analysis",
        "position": {"x": 300, "y": 150},
        "data": {
            "original": "Weekly team meetings to review collected data, create reports manually in Excel, and generate charts for stakeholders.",
            "steps": ["Step 1: Schedule team review", "Step 2: Compile data manually", "Step 3: Create presentation"],
            "optimized": "AI-powered analysis with automated report generation and interactive dashboards for real-time insights.",
            "variations": [
                "Predictive analytics integration",
                "Custom visualization templates",
                "Automated stakeholder alerts",
                "Multi-format report export"
            ],
            "metrics": {
                "similarity": 78,
                "quality": 88,
                "costReduction": 62,
                "climateImpact": -72
            }
        }
    },
    {
        "id": "approval",
        "label": "Approval Process", 
        "type": "decision",
        "position": {"x": 550, "y": 150},
        "data": {
            "original": "Print documents, physical signatures, scan and email workflow. Multiple rounds of revisions via email attachments.",
            "steps": ["Step 1: Print documents", "Step 2: Collect signatures", "Step 3: Scan and distribute"],
            "optimized": "Digital approval workflow with electronic signatures and automated routing based on business rules.",
            "variations": [
                "Mobile approval capabilities",
                "Conditional approval logic",
                "Audit trail automation",
                "Integration with DocuSign"
            ],
            "metrics": {
                "similarity": 90,
                "quality": 95,
                "costReduction": 58,
                "climateImpact": -85
            }
        }
    },
    {
        "id": "distribution",
        "label": "Distribution",
        "type": "output",
        "position": {"x": 800, "y": 150},
        "data": {
            "original": "Email individual PDFs to team members, print copies for filing, manual distribution of physical documents.",
            "steps": ["Step 1: Generate PDF reports", "Step 2: Email distribution", "Step 3: Physical filing"],
            "optimized": "Automated distribution via secure cloud platform with role-based access and version control.",
            "variations": [
                "Push notification system",
                "Customizable access levels",
                "Automated archiving",
                "API integration options"
            ],
            "metrics": {
                "similarity": 82,
                "quality": 89,
                "costReduction": 40,
                "climateImpact": -68
            }
        }
    }
]

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "message": "Python backend is running"
    })

@app.route('/api/workflow', methods=['GET'])
def get_workflow():
    """Get workflow data"""
    return jsonify({
        "success": True,
        "data": SAMPLE_WORKFLOW_DATA,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/workflow/<node_id>', methods=['GET'])
def get_workflow_node(node_id):
    """Get specific workflow node data"""
    node = next((node for node in SAMPLE_WORKFLOW_DATA if node["id"] == node_id), None)
    
    if node:
        return jsonify({
            "success": True,
            "data": node,
            "timestamp": datetime.now().isoformat()
        })
    else:
        return jsonify({
            "success": False,
            "error": "Node not found",
            "timestamp": datetime.now().isoformat()
        }), 404

@app.route('/api/workflow/<node_id>/metrics', methods=['GET'])
def get_node_metrics(node_id):
    """Get metrics for a specific node"""
    node = next((node for node in SAMPLE_WORKFLOW_DATA if node["id"] == node_id), None)
    
    if node:
        return jsonify({
            "success": True,
            "data": {
                "nodeId": node_id,
                "metrics": node["data"]["metrics"]
            },
            "timestamp": datetime.now().isoformat()
        })
    else:
        return jsonify({
            "success": False,
            "error": "Node not found",
            "timestamp": datetime.now().isoformat()
        }), 404

@app.route('/api/analytics/summary', methods=['GET'])
def get_analytics_summary():
    """Get overall analytics summary"""
    total_nodes = len(SAMPLE_WORKFLOW_DATA)
    avg_cost_reduction = sum(node["data"]["metrics"]["costReduction"] for node in SAMPLE_WORKFLOW_DATA) / total_nodes
    avg_climate_impact = sum(node["data"]["metrics"]["climateImpact"] for node in SAMPLE_WORKFLOW_DATA) / total_nodes
    
    return jsonify({
        "success": True,
        "data": {
            "totalNodes": total_nodes,
            "averageCostReduction": round(avg_cost_reduction, 2),
            "averageClimateImpact": round(avg_climate_impact, 2),
            "totalPotentialSavings": round(avg_cost_reduction * total_nodes, 2)
        },
        "timestamp": datetime.now().isoformat()
    })

# Example endpoint that could process data from your Python scripts
@app.route('/api/process-data', methods=['POST'])
def process_data():
    """Example endpoint to process data from Python scripts"""
    try:
        data = request.get_json()
        
        # Here you could call your Python analysis functions
        # For example:
        # result = your_python_analysis_function(data)
        
        # For now, return a mock response
        return jsonify({
            "success": True,
            "message": "Data processed successfully",
            "processedData": {
                "inputSize": len(str(data)) if data else 0,
                "processingTime": "0.1s",
                "recommendations": [
                    "Consider implementing automated data collection",
                    "Optimize approval workflow",
                    "Reduce paper usage"
                ]
            },
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)

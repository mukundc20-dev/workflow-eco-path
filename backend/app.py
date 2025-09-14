from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI
import anthropic
import json
import os
from datetime import datetime
from workflow_executor import WorkflowExecutor

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Professor Profile Analysis Workflow Data
SAMPLE_WORKFLOW_DATA = [
    {
        "id": "profiles",
        "label": "Profile Collection",
        "type": "process",
        "position": {"x": 50, "y": 150},
        "data": {
            "original": "Manual collection of professor profiles from various university websites and databases. Time-consuming process requiring manual data entry and verification.",
            "steps": ["Step 1: Gather profile data", "Step 2: Extract key information", "Step 3: Validate and format"],
            "optimized": "Automated profile collection with AI-powered extraction and real-time validation from multiple sources.",
            "variations": [
                "API integration with university systems",
                "AI-powered profile parsing", 
                "Real-time data validation",
                "Automated profile updates"
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
        "id": "analysis",
        "label": "AI Model Analysis",
        "type": "analysis",
        "position": {"x": 300, "y": 150},
        "data": {
            "original": "Manual analysis of professor profiles using basic text processing. Limited insights and time-consuming review process.",
            "steps": ["Step 1: Run initial analysis", "Step 2: Compare model outputs", "Step 3: Identify patterns"],
            "optimized": "Multi-model AI analysis with automated comparison and pattern recognition for deeper insights.",
            "variations": [
                "Llama 3.3 70B analysis",
                "Llama 3.1 8B comparison",
                "GPT-4 evaluation",
                "Automated pattern detection"
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
        "id": "optimization",
        "label": "Prompt Optimization", 
        "type": "decision",
        "position": {"x": 550, "y": 150},
        "data": {
            "original": "Manual prompt engineering with trial-and-error approach. Inconsistent results and time-consuming iterations.",
            "steps": ["Step 1: Analyze model outputs", "Step 2: Identify improvements", "Step 3: Generate optimized prompt"],
            "optimized": "AI-powered prompt optimization with automated analysis and iterative improvement suggestions.",
            "variations": [
                "Automated prompt generation",
                "Performance-based optimization",
                "A/B testing integration",
                "Real-time prompt refinement"
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
        "id": "results",
        "label": "Optimized Output",
        "type": "output",
        "position": {"x": 800, "y": 150},
        "data": {
            "original": "Manual compilation of results with basic formatting. Limited visualization and no automated insights.",
            "steps": ["Step 1: Compile results", "Step 2: Format output", "Step 3: Generate insights"],
            "optimized": "Automated result compilation with intelligent formatting and actionable insights generation.",
            "variations": [
                "Interactive result visualization",
                "Automated insight extraction",
                "Custom report generation",
                "Real-time result updates"
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

# Professor profiles from the notebook
PROFESSOR_PROFILES = [
    r'''Matias Cattaneo
Position
Professor
Website
Matias Cattaneo's Site
Office Phone
(609) 258-8825
Email
cattaneo@princeton.edu
Office
230 - Sherrerd Hall
Bio/Description
Research Interests: Econometrics, statistics, machine learning, data science, causal inference, program evaluation, quantitative methods in the social, behavioral and biomedical sciences.''',
    r'''Jianqing Fan
Position
Frederick L. Moore Professor in Finance
Website
Jianqing Fan's Site
Office Phone
(609) 258-7924
Email
jqfan@princeton.edu
Office
205 - Sherrerd Hall
Bio/Description
Research Interests: High-dimensional statistics, Machine Learning, financial econometrics, computational biology, biostatistics, graphical and network modeling, portfolio theory, high-frequency finance, time series.''',
    r'''Jason Klusowski
Position
Assistant Professor
Website
Jason Klusowski's Site
Office Phone
(609) 258-5305
Email
jason.klusowski@princeton.edu
Office
327 - Sherrerd Hall
Bio/Description
Research Interests: Data science, statistical learning, deep learning, decision tree learning; high-dimensional statistics, information theory, statistical physics, network modeling'''
]

# Global state for workflow execution
workflow_state = {
    "current_step": None,
    "completed_steps": [],
    "optimized_prompt": None,
    "analysis_results": None,
    "workflow_results": None
}

# Initialize workflow executor
workflow_executor = WorkflowExecutor()

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

# Workflow execution endpoints
@app.route('/api/workflow/start', methods=['POST'])
def start_workflow():
    """Start the professor profile analysis workflow"""
    try:
        # Reset workflow state
        workflow_state["current_step"] = "profiles"
        workflow_state["completed_steps"] = []
        workflow_state["optimized_prompt"] = None
        workflow_state["analysis_results"] = None
        
        return jsonify({
            "success": True,
            "message": "Workflow started",
            "currentStep": "profiles",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/api/workflow/step/<step_id>', methods=['POST'])
def execute_workflow_step(step_id):
    """Execute a specific workflow step"""
    try:
        if step_id == "profiles":
            # Step 1: Profile Collection - Run real workflow
            try:
                result = workflow_executor.step1_collect_profiles()
                workflow_state["current_step"] = "analysis"
                workflow_state["completed_steps"].append("profiles")
                if workflow_state["workflow_results"] is None:
                    workflow_state["workflow_results"] = {}
                workflow_state["workflow_results"]["step1"] = result
                
                return jsonify({
                    "success": True,
                    "message": "Profile collection completed",
                    "currentStep": "analysis",
                    "completedSteps": workflow_state["completed_steps"],
                    "data": result["data"],
                    "timestamp": datetime.now().isoformat()
                })
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": f"Profile collection failed: {str(e)}",
                    "timestamp": datetime.now().isoformat()
                }), 500
            
        elif step_id == "analysis":
            # Step 2: AI Model Analysis - Run real AI models
            try:
                # Get the formatted prompt from step 1
                step1_data = workflow_state.get("workflow_results", {}).get("step1", {})
                if not step1_data or "data" not in step1_data:
                    return jsonify({
                        "success": False,
                        "error": "Step 1 must be completed first",
                        "timestamp": datetime.now().isoformat()
                    }), 400
                
                formatted_prompt = step1_data["data"]["formattedPrompt"]
                result = workflow_executor.step2_ai_analysis(formatted_prompt)
                
                workflow_state["current_step"] = "optimization"
                workflow_state["completed_steps"].append("analysis")
                if workflow_state["workflow_results"] is None:
                    workflow_state["workflow_results"] = {}
                workflow_state["workflow_results"]["step2"] = result
                workflow_state["analysis_results"] = result["data"]
                
                return jsonify({
                    "success": True,
                    "message": "AI model analysis completed",
                    "currentStep": "optimization",
                    "completedSteps": workflow_state["completed_steps"],
                    "data": result["data"],
                    "timestamp": datetime.now().isoformat()
                })
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": f"AI analysis failed: {str(e)}",
                    "timestamp": datetime.now().isoformat()
                }), 500
            
        elif step_id == "optimization":
            # Step 3: Prompt Optimization - Run real optimization
            try:
                # Get the analysis results from step 2
                step2_data = workflow_state.get("workflow_results", {}).get("step2", {})
                if not step2_data or "data" not in step2_data:
                    return jsonify({
                        "success": False,
                        "error": "Step 2 must be completed first",
                        "timestamp": datetime.now().isoformat()
                    }), 400
                
                analysis_results = step2_data["data"]
                result = workflow_executor.step3_prompt_optimization(analysis_results)
                
                if not result["success"]:
                    return jsonify(result), 500
                
                workflow_state["current_step"] = "results"
                workflow_state["completed_steps"].append("optimization")
                if workflow_state["workflow_results"] is None:
                    workflow_state["workflow_results"] = {}
                workflow_state["workflow_results"]["step3"] = result
                workflow_state["optimized_prompt"] = result["data"]["improvedPrompt"]
                
                return jsonify({
                    "success": True,
                    "message": "Prompt optimization completed",
                    "currentStep": "results",
                    "completedSteps": workflow_state["completed_steps"],
                    "data": result["data"],
                    "timestamp": datetime.now().isoformat()
                })
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": f"Prompt optimization failed: {str(e)}",
                    "timestamp": datetime.now().isoformat()
                }), 500
            
        elif step_id == "results":
            # Step 4: Test Improved Prompt - Run real test
            try:
                # Get the optimized prompt from step 3
                step3_data = workflow_state.get("workflow_results", {}).get("step3", {})
                if not step3_data or "data" not in step3_data:
                    return jsonify({
                        "success": False,
                        "error": "Step 3 must be completed first",
                        "timestamp": datetime.now().isoformat()
                    }), 400
                
                improved_prompt = step3_data["data"]["improvedPrompt"]
                # Get step2 results for evaluation
                step2_results = workflow_state["analysis_results"]
                result = workflow_executor.step4_test_improved_prompt(improved_prompt, step2_results)
                
                if not result["success"]:
                    return jsonify(result), 500
                
                workflow_state["current_step"] = None
                workflow_state["completed_steps"].append("results")
                if workflow_state["workflow_results"] is None:
                    workflow_state["workflow_results"] = {}
                workflow_state["workflow_results"]["step4"] = result
                
                return jsonify({
                    "success": True,
                    "message": "Workflow completed successfully",
                    "currentStep": None,
                    "completedSteps": workflow_state["completed_steps"],
                    "data": {
                        "optimizedPrompt": improved_prompt,
                        "improvedOutput": result["data"]["improvedOutput"],
                        "analysisResults": workflow_state["analysis_results"],
                        "summary": "Professor profile analysis and prompt optimization completed successfully",
                        "usage": result["data"]["usage"]
                    },
                    "timestamp": datetime.now().isoformat()
                })
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": f"Final testing failed: {str(e)}",
                    "timestamp": datetime.now().isoformat()
                }), 500
            
        else:
            return jsonify({
                "success": False,
                "error": f"Unknown step: {step_id}",
                "timestamp": datetime.now().isoformat()
            }), 400
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/api/workflow/status', methods=['GET'])
def get_workflow_status():
    """Get current workflow status"""
    return jsonify({
        "success": True,
        "data": {
            "currentStep": workflow_state["current_step"],
            "completedSteps": workflow_state["completed_steps"],
            "optimizedPrompt": workflow_state["optimized_prompt"],
            "analysisResults": workflow_state["analysis_results"],
            "workflowResults": workflow_state["workflow_results"],
            "isComplete": len(workflow_state["completed_steps"]) == 4
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

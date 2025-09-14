"""
Example Python script that processes data and can send results to your React app
"""
import requests
import json
import pandas as pd
import numpy as np
from datetime import datetime
import time

class WorkflowAnalyzer:
    def __init__(self, api_base_url="http://localhost:5000/api"):
        self.api_base_url = api_base_url
    
    def analyze_workflow_efficiency(self, workflow_data):
        """
        Analyze workflow efficiency and return optimization recommendations
        """
        analysis_results = {
            "timestamp": datetime.now().isoformat(),
            "totalNodes": len(workflow_data),
            "bottlenecks": [],
            "optimizationOpportunities": [],
            "costSavings": 0,
            "climateImpact": 0
        }
        
        for node in workflow_data:
            # Analyze each node for bottlenecks
            if node["data"]["metrics"]["costReduction"] < 50:
                analysis_results["bottlenecks"].append({
                    "nodeId": node["id"],
                    "nodeLabel": node["label"],
                    "issue": "High cost, low optimization",
                    "recommendation": "Implement automation"
                })
            
            # Calculate potential savings
            analysis_results["costSavings"] += node["data"]["metrics"]["costReduction"]
            analysis_results["climateImpact"] += node["data"]["metrics"]["climateImpact"]
            
            # Generate optimization opportunities
            if node["data"]["metrics"]["quality"] < 90:
                analysis_results["optimizationOpportunities"].append({
                    "nodeId": node["id"],
                    "nodeLabel": node["label"],
                    "currentQuality": node["data"]["metrics"]["quality"],
                    "suggestion": "Improve data validation and error handling"
                })
        
        return analysis_results
    
    def generate_workflow_variations(self, base_workflow):
        """
        Generate alternative workflow configurations
        """
        variations = []
        
        # Create different optimization scenarios
        scenarios = [
            {"name": "Conservative", "multiplier": 0.8},
            {"name": "Moderate", "multiplier": 1.0},
            {"name": "Aggressive", "multiplier": 1.3}
        ]
        
        for scenario in scenarios:
            variation = []
            for node in base_workflow:
                new_node = node.copy()
                new_node["data"] = node["data"].copy()
                new_node["data"]["metrics"] = node["data"]["metrics"].copy()
                
                # Apply scenario multiplier to metrics
                new_node["data"]["metrics"]["costReduction"] = min(
                    100, 
                    int(node["data"]["metrics"]["costReduction"] * scenario["multiplier"])
                )
                new_node["data"]["metrics"]["climateImpact"] = int(
                    node["data"]["metrics"]["climateImpact"] * scenario["multiplier"]
                )
                
                variation.append(new_node)
            
            variations.append({
                "scenario": scenario["name"],
                "workflow": variation,
                "totalCostSavings": sum(node["data"]["metrics"]["costReduction"] for node in variation),
                "totalClimateImpact": sum(node["data"]["metrics"]["climateImpact"] for node in variation)
            })
        
        return variations
    
    def send_analysis_to_frontend(self, analysis_data):
        """
        Send analysis results to the React frontend via API
        """
        try:
            response = requests.post(
                f"{self.api_base_url}/process-data",
                json=analysis_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                print("✅ Analysis data sent to frontend successfully")
                return response.json()
            else:
                print(f"❌ Failed to send data: {response.status_code}")
                return None
                
        except requests.exceptions.ConnectionError:
            print("❌ Could not connect to backend server. Make sure Flask app is running.")
            return None
        except Exception as e:
            print(f"❌ Error sending data: {e}")
            return None

def main():
    """
    Example usage of the WorkflowAnalyzer
    """
    print("🚀 Starting Workflow Analysis...")
    
    # Initialize analyzer
    analyzer = WorkflowAnalyzer()
    
    # Sample workflow data (you would load this from your actual data source)
    sample_workflow = [
        {
            "id": "start",
            "label": "Data Collection",
            "type": "process",
            "data": {
                "metrics": {
                    "costReduction": 45,
                    "climateImpact": -35,
                    "quality": 92
                }
            }
        },
        {
            "id": "process",
            "label": "Analysis & Review",
            "type": "analysis",
            "data": {
                "metrics": {
                    "costReduction": 62,
                    "climateImpact": -72,
                    "quality": 88
                }
            }
        }
    ]
    
    # Perform analysis
    print("📊 Analyzing workflow efficiency...")
    analysis_results = analyzer.analyze_workflow_efficiency(sample_workflow)
    
    # Generate variations
    print("🔄 Generating workflow variations...")
    variations = analyzer.generate_workflow_variations(sample_workflow)
    
    # Combine results
    final_results = {
        "analysis": analysis_results,
        "variations": variations,
        "recommendations": [
            "Implement automated data collection to reduce manual errors",
            "Use digital approval workflows to eliminate paper waste",
            "Set up real-time monitoring dashboards for better visibility"
        ]
    }
    
    # Send to frontend
    print("📤 Sending results to React frontend...")
    result = analyzer.send_analysis_to_frontend(final_results)
    
    if result:
        print("✅ Analysis complete! Check your React app for the results.")
    else:
        print("💾 Analysis complete! Results saved locally.")
        # Save to file as backup
        with open("analysis_results.json", "w") as f:
            json.dump(final_results, f, indent=2)
        print("📁 Results saved to analysis_results.json")

if __name__ == "__main__":
    main()

import { useState, useEffect } from "react";
import { WorkflowGraph } from "@/components/WorkflowGraph";
import { NodeSidebar } from "@/components/NodeSidebar";
import ClimateAnalytics from "@/components/ClimateAnalytics";
import { Leaf, AlertCircle, CheckCircle } from "lucide-react";
import { useWorkflowData, useAnalyticsSummary, useWorkflowStatus, checkBackendHealth } from "@/hooks/useWorkflowData";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface WorkflowNode {
  id: string;
  label: string;
  type: string;
  position: { x: number; y: number };
  data: {
    original: string;
    steps: string[];
    optimized: string;
    variations: string[];
    metrics: {
      similarity: number;
      quality: number;
      costReduction: number;
      climateImpact: number;
    };
  };
}

// Professor Profile Analysis Workflow
const dummyWorkflow: WorkflowNode[] = [
  {
    id: "profiles",
    label: "Profile Collection",
    type: "process",
    position: { x: 50, y: 150 },
    data: {
      original: "Manual collection of professor profiles from various university websites and databases. Time-consuming process requiring manual data entry and verification.",
      steps: ["Step 1: Gather profile data", "Step 2: Extract key information", "Step 3: Validate and format"],
      optimized: "Automated profile collection with AI-powered extraction and real-time validation from multiple sources.",
      variations: [
        "API integration with university systems",
        "AI-powered profile parsing", 
        "Real-time data validation",
        "Automated profile updates"
      ],
      metrics: {
        similarity: 85,
        quality: 92,
        costReduction: 45,
        climateImpact: -35
      }
    }
  },
  {
    id: "analysis",
    label: "AI Model Analysis",
    type: "analysis",
    position: { x: 300, y: 150 },
    data: {
      original: "Manual analysis of professor profiles using basic text processing. Limited insights and time-consuming review process.",
      steps: ["Step 1: Run initial analysis", "Step 2: Compare model outputs", "Step 3: Identify patterns"],
      optimized: "Multi-model AI analysis with automated comparison and pattern recognition for deeper insights.",
      variations: [
        "Llama 3.3 70B analysis",
        "Llama 3.1 8B comparison",
        "GPT-4 evaluation",
        "Automated pattern detection"
      ],
      metrics: {
        similarity: 78,
        quality: 88,
        costReduction: 62,
        climateImpact: -72
      }
    }
  },
  {
    id: "optimization",
    label: "Prompt Optimization", 
    type: "decision",
    position: { x: 550, y: 150 },
    data: {
      original: "Manual prompt engineering with trial-and-error approach. Inconsistent results and time-consuming iterations.",
      steps: ["Step 1: Analyze model outputs", "Step 2: Identify improvements", "Step 3: Generate optimized prompt"],
      optimized: "AI-powered prompt optimization with automated analysis and iterative improvement suggestions.",
      variations: [
        "Automated prompt generation",
        "Performance-based optimization",
        "A/B testing integration",
        "Real-time prompt refinement"
      ],
      metrics: {
        similarity: 90,
        quality: 95,
        costReduction: 58,
        climateImpact: -85
      }
    }
  },
  {
    id: "results",
    label: "Optimized Output",
    type: "output",
    position: { x: 800, y: 150 },
    data: {
      original: "Manual compilation of results with basic formatting. Limited visualization and no automated insights.",
      steps: ["Step 1: Compile results", "Step 2: Format output", "Step 3: Generate insights"],
      optimized: "Automated result compilation with intelligent formatting and actionable insights generation.",
      variations: [
        "Interactive result visualization",
        "Automated insight extraction",
        "Custom report generation",
        "Real-time result updates"
      ],
      metrics: {
        similarity: 82,
        quality: 89,
        costReduction: 40,
        climateImpact: -68
      }
    }
  }
];

const Index = () => {
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  // Fetch data from Python backend
  const { data: workflowData, isLoading: workflowLoading, error: workflowError } = useWorkflowData();
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalyticsSummary();
  const { data: workflowStatus } = useWorkflowStatus();

  // Check backend connection
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkBackendHealth();
      setBackendConnected(isConnected);
    };
    
    checkConnection();
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleNodeClick = (node: WorkflowNode) => {
    setSelectedNode(node);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedNode(null);
  };

  // Use backend data if available, otherwise fall back to dummy data
  const displayData = workflowData || dummyWorkflow;
  const isLoading = workflowLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Backend Connection Status */}
      {backendConnected === false && (
        <Alert className="m-4 border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Python backend is not connected. Using sample data. 
            <a href="http://localhost:5000/api/health" target="_blank" rel="noopener noreferrer" className="underline ml-1">
              Start the backend server
            </a>
          </AlertDescription>
        </Alert>
      )}
      
      {backendConnected === true && (
        <Alert className="m-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Connected to Python backend - Live data enabled
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo moved to top left */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">ClimateFlow</h1>
                <p className="text-sm text-muted-foreground">AI-powered professor profile analysis and prompt optimization</p>
              </div>
            </div>
            
            {/* Analytics Summary */}
            <div className="flex items-center gap-4">
              {analyticsData && (
                <div className="text-sm text-muted-foreground">
                  <div>Avg Cost Reduction: {analyticsData.averageCostReduction}%</div>
                  <div>Climate Impact: {analyticsData.averageClimateImpact}%</div>
                </div>
              )}
              
              {/* Climate Analytics Component */}
              <ClimateAnalytics 
                analysisResults={workflowStatus?.data?.analysisResults}
                workflowResults={workflowStatus?.data?.workflowResults}
              />
              
              <div className="text-sm text-muted-foreground">
                Workflow Analytics
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-96' : ''}`}>
          <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Professor Profile Analysis Workflow</h2>
              <p className="text-muted-foreground">Click on any node to view analysis details and optimization progress</p>
            </div>
            
            <div className="mx-auto" style={{ width: '1050px' }}>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-muted-foreground">Loading workflow data...</div>
                </div>
              ) : workflowError ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-red-500">Error loading data: {workflowError.message}</div>
                </div>
              ) : (
                <WorkflowGraph 
                  nodes={displayData} 
                  onNodeClick={handleNodeClick}
                  selectedNode={selectedNode}
                  completedSteps={workflowStatus?.data?.completedSteps || []}
                  currentStep={workflowStatus?.data?.currentStep}
                />
              )}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <NodeSidebar 
          node={selectedNode}
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
        />
      </div>
    </div>
  );
};

export default Index;
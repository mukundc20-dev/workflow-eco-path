import { useState } from "react";
import { WorkflowGraph } from "@/components/WorkflowGraph";
import { NodeSidebar } from "@/components/NodeSidebar";
import { Leaf } from "lucide-react";

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

// Hardcoded dummy workflow data
const dummyWorkflow: WorkflowNode[] = [
  {
    id: "start",
    label: "Data Collection",
    type: "process",
    position: { x: 100, y: 100 },
    data: {
      original: "Manual data entry from multiple spreadsheets and paper forms. Team members spend 2-3 hours daily collecting information from various sources.",
      steps: ["Step 1: Gather paper forms", "Step 2: Input into spreadsheets", "Step 3: Cross-reference data"],
      optimized: "Automated data collection using digital forms with real-time validation and cloud synchronization.",
      variations: [
        "Mobile-first data capture",
        "AI-powered form recognition", 
        "Integration with existing systems",
        "Real-time dashboard updates"
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
    id: "process",
    label: "Analysis & Review",
    type: "analysis",
    position: { x: 350, y: 150 },
    data: {
      original: "Weekly team meetings to review collected data, create reports manually in Excel, and generate charts for stakeholders.",
      steps: ["Step 1: Schedule team review", "Step 2: Compile data manually", "Step 3: Create presentation"],
      optimized: "AI-powered analysis with automated report generation and interactive dashboards for real-time insights.",
      variations: [
        "Predictive analytics integration",
        "Custom visualization templates",
        "Automated stakeholder alerts",
        "Multi-format report export"
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
    id: "approval",
    label: "Approval Process", 
    type: "decision",
    position: { x: 600, y: 100 },
    data: {
      original: "Print documents, physical signatures, scan and email workflow. Multiple rounds of revisions via email attachments.",
      steps: ["Step 1: Print documents", "Step 2: Collect signatures", "Step 3: Scan and distribute"],
      optimized: "Digital approval workflow with electronic signatures and automated routing based on business rules.",
      variations: [
        "Mobile approval capabilities",
        "Conditional approval logic",
        "Audit trail automation",
        "Integration with DocuSign"
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
    id: "distribution",
    label: "Distribution",
    type: "output",
    position: { x: 350, y: 300 },
    data: {
      original: "Email individual PDFs to team members, print copies for filing, manual distribution of physical documents.",
      steps: ["Step 1: Generate PDF reports", "Step 2: Email distribution", "Step 3: Physical filing"],
      optimized: "Automated distribution via secure cloud platform with role-based access and version control.",
      variations: [
        "Push notification system",
        "Customizable access levels",
        "Automated archiving",
        "API integration options"
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

  const handleNodeClick = (node: WorkflowNode) => {
    setSelectedNode(node);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedNode(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">ClimateFlow</h1>
              <p className="text-sm text-muted-foreground">Optimize workflows for climate impact</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-96' : ''}`}>
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">Workflow Overview</h2>
              <p className="text-muted-foreground">Click on any node to view optimization details and analytics</p>
            </div>
            
            <WorkflowGraph 
              nodes={dummyWorkflow} 
              onNodeClick={handleNodeClick}
              selectedNode={selectedNode}
            />
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
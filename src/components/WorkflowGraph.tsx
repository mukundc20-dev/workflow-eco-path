import { ArrowRight, Database, BarChart3, CheckCircle, Share2, Clock } from "lucide-react";
import { WorkflowNode } from "@/pages/Index";

interface WorkflowGraphProps {
  nodes: WorkflowNode[];
  onNodeClick: (node: WorkflowNode) => void;
  selectedNode: WorkflowNode | null;
  completedSteps?: string[];
  currentStep?: string | null;
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'process': return Database;
    case 'analysis': return BarChart3;
    case 'decision': return CheckCircle;
    case 'output': return Share2;
    default: return Database;
  }
};

const getNodeColor = (type: string, isCompleted: boolean, isCurrent: boolean) => {
  if (isCompleted) {
    return 'border-green-500 bg-green-50 shadow-md hover:shadow-lg';
  }
  if (isCurrent) {
    return 'border-blue-500 bg-blue-50 shadow-md hover:shadow-lg';
  }
  
  switch (type) {
    case 'process': return 'border-nature-blue bg-white shadow-sm hover:shadow-md';
    case 'analysis': return 'border-nature-green bg-white shadow-sm hover:shadow-md';
    case 'decision': return 'border-warning-orange bg-white shadow-sm hover:shadow-md';
    case 'output': return 'border-success-green bg-white shadow-sm hover:shadow-md';
    default: return 'border-border bg-white shadow-sm hover:shadow-md';
  }
};

export const WorkflowGraph = ({ nodes, onNodeClick, selectedNode, completedSteps = [], currentStep = null }: WorkflowGraphProps) => {
  const connections = [
    { from: "profiles", to: "analysis" },
    { from: "analysis", to: "optimization" },
    { from: "optimization", to: "results" }
  ];

  const getNodeById = (id: string) => nodes.find(node => node.id === id);

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-background to-muted/30 rounded-xl border overflow-hidden shadow-sm">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {connections.map((connection, index) => {
          const fromNode = getNodeById(connection.from);
          const toNode = getNodeById(connection.to);
          
          if (!fromNode || !toNode) return null;
          
          const startX = fromNode.position.x + 192; // Node width (w-48 = 192px)
          const startY = fromNode.position.y + 56; // Node height center (h-28 = 112px, center = 56px)
          const endX = toNode.position.x;
          const endY = toNode.position.y + 56; // Node height center
          
          return (
            <g key={index}>
              <defs>
                <marker
                  id={`arrowhead-${index}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="hsl(var(--primary))"
                  />
                </marker>
              </defs>
              <path
                d={`M ${startX} ${startY} L ${endX} ${endY}`}
                stroke="hsl(var(--primary))"
                strokeWidth="2.5"
                fill="none"
                markerEnd={`url(#arrowhead-${index})`}
                className="opacity-70 drop-shadow-sm"
                style={{
                  filter: 'drop-shadow(0 1px 2px hsl(var(--primary) / 0.2))'
                }}
              />
            </g>
          );
        })}
      </svg>

      <div className="relative" style={{ zIndex: 2 }}>
        {nodes.map((node) => {
          const Icon = getNodeIcon(node.type);
          const isSelected = selectedNode?.id === node.id;
          const isCompleted = completedSteps.includes(node.id);
          const isCurrent = currentStep === node.id;
          
          return (
            <div
              key={node.id}
              className={`absolute cursor-pointer transition-all duration-300 ease-spring group ${
                isSelected ? 'scale-105 z-10' : 'hover:scale-105 hover:-translate-y-1'
              }`}
              style={{
                left: node.position.x,
                top: node.position.y,
                transform: isSelected ? 'scale(1.05)' : undefined
              }}
              onClick={() => onNodeClick(node)}
            >
              <div className={`
                w-48 h-28 rounded-xl border-2 p-4
                ${getNodeColor(node.type, isCompleted, isCurrent)}
                ${isSelected ? 'ring-2 ring-primary ring-offset-2 shadow-lg' : 'shadow-sm group-hover:shadow-xl group-hover:border-primary/50'}
                transition-all duration-300 ease-out
                backdrop-blur-sm group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-gray-50/50
              `}>
                {/* Header with icon and type */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                      node.type === 'process' ? 'bg-nature-blue/10 group-hover:bg-nature-blue/20' :
                      node.type === 'analysis' ? 'bg-nature-green/10 group-hover:bg-nature-green/20' :
                      node.type === 'decision' ? 'bg-warning-orange/10 group-hover:bg-warning-orange/20' :
                      'bg-success-green/10 group-hover:bg-success-green/20'
                    }`}>
                      <Icon className={`w-3.5 h-3.5 transition-all duration-300 group-hover:scale-110 ${
                        node.type === 'process' ? 'text-nature-blue' :
                        node.type === 'analysis' ? 'text-nature-green' :
                        node.type === 'decision' ? 'text-warning-orange' :
                        'text-success-green'
                      }`} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {node.type}
                    </span>
                  </div>
                  
                  {/* Status indicator */}
                  {isCompleted && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  {isCurrent && (
                    <Clock className="w-4 h-4 text-blue-500 animate-spin" />
                  )}
                </div>
                
                {/* Node title */}
                <h3 className="text-sm font-semibold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                  {node.label}
                </h3>
                
                {/* Climate impact indicator */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-success-green"></div>
                    <span className="text-xs text-success-green font-medium">
                      {node.data.metrics.climateImpact}% CO₂
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {node.data.metrics.costReduction}% savings
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
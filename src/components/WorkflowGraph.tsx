import { ArrowRight, Database, BarChart3, CheckCircle, Share2 } from "lucide-react";
import { WorkflowNode } from "@/pages/Index";

interface WorkflowGraphProps {
  nodes: WorkflowNode[];
  onNodeClick: (node: WorkflowNode) => void;
  selectedNode: WorkflowNode | null;
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

const getNodeColor = (type: string) => {
  switch (type) {
    case 'process': return 'border-nature-blue bg-nature-blue-light';
    case 'analysis': return 'border-nature-green bg-nature-green-light';
    case 'decision': return 'border-warning-orange bg-orange-50';
    case 'output': return 'border-success-green bg-green-50';
    default: return 'border-border bg-card';
  }
};

export const WorkflowGraph = ({ nodes, onNodeClick, selectedNode }: WorkflowGraphProps) => {
  const connections = [
    { from: "start", to: "process" },
    { from: "process", to: "approval" },
    { from: "approval", to: "distribution" }
  ];

  const getNodeById = (id: string) => nodes.find(node => node.id === id);

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-background to-muted/30 rounded-xl border overflow-hidden">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {connections.map((connection, index) => {
          const fromNode = getNodeById(connection.from);
          const toNode = getNodeById(connection.to);
          
          if (!fromNode || !toNode) return null;
          
          const startX = fromNode.position.x + 120;
          const startY = fromNode.position.y + 40;
          const endX = toNode.position.x;
          const endY = toNode.position.y + 40;
          
          const midX = (startX + endX) / 2;
          
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
                    fill="hsl(var(--muted-foreground))"
                  />
                </marker>
              </defs>
              <path
                d={`M ${startX} ${startY} Q ${midX} ${startY} ${endX} ${endY}`}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                fill="none"
                markerEnd={`url(#arrowhead-${index})`}
                className="opacity-60"
              />
            </g>
          );
        })}
      </svg>

      <div className="relative p-6" style={{ zIndex: 2 }}>
        {nodes.map((node) => {
          const Icon = getNodeIcon(node.type);
          const isSelected = selectedNode?.id === node.id;
          
          return (
            <div
              key={node.id}
              className={`absolute cursor-pointer transition-all duration-300 ${
                isSelected ? 'scale-105 shadow-lg' : 'hover:scale-102 hover:shadow-node'
              }`}
              style={{
                left: node.position.x,
                top: node.position.y,
                transform: isSelected ? 'scale(1.05)' : undefined
              }}
              onClick={() => onNodeClick(node)}
            >
              <div className={`
                w-32 h-20 rounded-lg border-2 p-3 bg-gradient-node
                ${getNodeColor(node.type)}
                ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                transition-all duration-300
              `}>
                <div className="flex items-start gap-2">
                  <Icon className="w-4 h-4 text-foreground/70 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h3 className="text-xs font-medium text-foreground leading-tight">
                      {node.label}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-tight">
                      {node.type}
                    </p>
                  </div>
                </div>
                
                {/* Climate impact indicator */}
                <div className="mt-2 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-success-green"></div>
                  <span className="text-xs text-success-green font-medium">
                    {node.data.metrics.climateImpact}% CO₂
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
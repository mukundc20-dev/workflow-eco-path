import { X, RefreshCw, Zap, TrendingDown, DollarSign, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WorkflowNode } from "@/pages/Index";
import { CostComparisonChart } from "@/components/CostComparisonChart";

interface NodeSidebarProps {
  node: WorkflowNode | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NodeSidebar = ({ node, isOpen, onClose }: NodeSidebarProps) => {
  if (!node) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed right-0 top-0 h-full w-96 bg-card border-l shadow-sidebar z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{node.label}</h2>
              <p className="text-sm text-muted-foreground capitalize">{node.type} optimization</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Original Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                  Original Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {node.data.original}
                </p>
                <div className="space-y-2">
                  {node.data.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Optimized Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success-green"></div>
                  Optimized Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground mb-4">
                  {node.data.optimized}
                </p>
                
                {/* Variations */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {node.data.variations.map((variation, index) => (
                    <div 
                      key={index}
                      className="p-2 bg-nature-green-light rounded-md border border-nature-green/20"
                    >
                      <p className="text-xs text-foreground">{variation}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <RefreshCw className="w-3 h-3 mr-2" />
                    Optimize
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Zap className="w-3 h-3 mr-2" />
                    New Query
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Similarity Score */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Similarity Score</span>
                    <span className="text-sm font-medium">{node.data.metrics.similarity}%</span>
                  </div>
                  <Progress value={node.data.metrics.similarity} className="h-2" />
                </div>

                {/* Quality Check */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Quality Check</span>
                    <span className="text-sm font-medium">{node.data.metrics.quality}%</span>
                  </div>
                  <Progress value={node.data.metrics.quality} className="h-2" />
                </div>

                {/* Climate Analytics */}
                <div className="p-3 bg-nature-green-light rounded-lg border border-nature-green/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-4 h-4 text-nature-green" />
                    <span className="text-sm font-medium text-nature-green">Climate Impact</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-nature-green">
                      {node.data.metrics.climateImpact}%
                    </span>
                    <span className="text-sm text-muted-foreground">CO₂ reduction</span>
                  </div>
                </div>

                {/* Cost Analytics */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Cost Comparison</span>
                  </div>
                  <CostComparisonChart 
                    original={100}
                    optimized={100 - node.data.metrics.costReduction}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-success-green" />
                    <span className="text-sm text-success-green font-medium">
                      {node.data.metrics.costReduction}% cost reduction
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
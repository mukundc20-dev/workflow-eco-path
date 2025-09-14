import { X, RefreshCw, Zap, TrendingDown, DollarSign, Leaf, CheckCircle, Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WorkflowNode } from "@/pages/Index";
import { CostComparisonChart } from "@/components/CostComparisonChart";
import { useStartWorkflow, useExecuteWorkflowStep, useWorkflowStatus } from "@/hooks/useWorkflowData";
import { useState, useEffect } from "react";

interface NodeSidebarProps {
  node: WorkflowNode | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NodeSidebar = ({ node, isOpen, onClose }: NodeSidebarProps) => {
  const [workflowRunning, setWorkflowRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [optimizedPrompt, setOptimizedPrompt] = useState<string | null>(null);

  const startWorkflowMutation = useStartWorkflow();
  const executeStepMutation = useExecuteWorkflowStep();
  const { data: workflowStatus } = useWorkflowStatus();

  // Update local state when workflow status changes
  useEffect(() => {
    if (workflowStatus?.data) {
      setCurrentStep(workflowStatus.data.currentStep);
      setCompletedSteps(workflowStatus.data.completedSteps || []);
      setOptimizedPrompt(workflowStatus.data.optimizedPrompt);
      setWorkflowRunning(!!workflowStatus.data.currentStep);
    }
  }, [workflowStatus]);

  const handleOptimize = async () => {
    try {
      setWorkflowRunning(true);
      await startWorkflowMutation.mutateAsync();
      
      // Execute each step with a delay for visual effect
      const steps = ['profiles', 'analysis', 'optimization', 'results'];
      for (const step of steps) {
        await executeStepMutation.mutateAsync(step);
        await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
      }
      
      setWorkflowRunning(false);
    } catch (error) {
      console.error('Workflow execution failed:', error);
      setWorkflowRunning(false);
    }
  };

  const getStepStatus = (stepId: string) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (currentStep === stepId) return 'current';
    return 'pending';
  };

  const getStepIcon = (stepId: string) => {
    const status = getStepStatus(stepId);
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'current':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

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
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={handleOptimize}
                    disabled={workflowRunning}
                  >
                    {workflowRunning ? (
                      <Clock className="w-3 h-3 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-3 h-3 mr-2" />
                    )}
                    {workflowRunning ? 'Running...' : 'Start Analysis'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Progress Section */}
            {workflowRunning || completedSteps.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Workflow Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 'profiles', label: 'Profile Collection' },
                      { id: 'analysis', label: 'AI Model Analysis' },
                      { id: 'optimization', label: 'Prompt Optimization' },
                      { id: 'results', label: 'Generate Results' }
                    ].map((step) => (
                      <div key={step.id} className="flex items-center gap-3">
                        {getStepIcon(step.id)}
                        <span className="text-sm text-foreground">{step.label}</span>
                        {getStepStatus(step.id) === 'current' && (
                          <span className="text-xs text-blue-500 ml-auto">In Progress...</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* AI Analysis Results Section */}
            {workflowStatus?.data?.analysisResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">AI Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workflowStatus.data.analysisResults.llama_70b_analysis && (
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">GPT-4 Analysis</h4>
                        <div className="bg-gray-50 p-3 rounded-md border max-h-32 overflow-y-auto">
                          <p className="text-xs text-foreground">
                            {workflowStatus.data.analysisResults.llama_70b_analysis.substring(0, 300)}...
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {workflowStatus.data.analysisResults.llama_8b_analysis && (
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">Llama 3.1 70B Analysis</h4>
                        <div className="bg-gray-50 p-3 rounded-md border max-h-32 overflow-y-auto">
                          <p className="text-xs text-foreground">
                            {workflowStatus.data.analysisResults.llama_8b_analysis.substring(0, 300)}...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Optimized Prompt Section */}
            {optimizedPrompt && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Optimized Prompt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded-md border">
                    <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">
                      {optimizedPrompt}
                    </pre>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Prompt optimization completed</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Final Results Section */}
            {workflowStatus?.data?.workflowResults?.step4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Final Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Improved Output</h4>
                      <div className="bg-green-50 p-3 rounded-md border border-green-200 max-h-40 overflow-y-auto">
                        <p className="text-xs text-foreground">
                          {workflowStatus.data.workflowResults.step4.data.improvedOutput.substring(0, 500)}...
                        </p>
                      </div>
                    </div>
                    
                    {workflowStatus.data.workflowResults.step4.data.evaluation && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Quality Evaluation
                        </h4>
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                          <p className="text-sm text-foreground leading-relaxed">
                            {workflowStatus.data.workflowResults.step4.data.evaluation}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Comparison Section */}
                    {workflowStatus.data.analysisResults && workflowStatus.data.workflowResults.step4.data.improvedOutput && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-foreground mb-3">Response Comparison</h4>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="bg-gray-50 p-3 rounded-md border">
                            <h5 className="text-xs font-medium text-muted-foreground mb-2">Original (Llama 3.3 70B)</h5>
                            <p className="text-xs text-foreground max-h-20 overflow-y-auto">
                              {workflowStatus.data.analysisResults.llama_70b_analysis?.substring(0, 200)}...
                            </p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-md border border-green-200">
                            <h5 className="text-xs font-medium text-muted-foreground mb-2">Improved (Llama 3.1 8B)</h5>
                            <p className="text-xs text-foreground max-h-20 overflow-y-auto">
                              {workflowStatus.data.workflowResults.step4.data.improvedOutput.substring(0, 200)}...
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {workflowStatus.data.workflowResults.step4.data.usage && (
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Tokens used: {workflowStatus.data.workflowResults.step4.data.usage.total_tokens}</span>
                        <span>Cost: ~${(workflowStatus.data.workflowResults.step4.data.usage.total_tokens * 0.0001).toFixed(4)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

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
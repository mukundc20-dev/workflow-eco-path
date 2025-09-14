import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Leaf, Zap, TrendingDown, TrendingUp } from 'lucide-react';

interface EnergyData {
  llama_70b_energy: number;
  llama_8b_energy: number;
  comparisonEnergy: number;
  energy: number;
}

interface ClimateAnalyticsProps {
  analysisResults?: {
    llama_70b_energy?: number;
    llama_8b_energy?: number;
  };
  workflowResults?: {
    step3?: {
      data?: {
        comparisonEnergy?: number;
      };
    };
    step4?: {
      data?: {
        energy?: number;
      };
    };
  };
}

const ClimateAnalytics: React.FC<ClimateAnalyticsProps> = ({ 
  analysisResults, 
  workflowResults 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate energy consumption data
  const getEnergyData = (): EnergyData => {
    return {
      llama_70b_energy: analysisResults?.llama_70b_energy || 0,
      llama_8b_energy: analysisResults?.llama_8b_energy || 0,
      comparisonEnergy: workflowResults?.step3?.data?.comparisonEnergy || 0,
      energy: workflowResults?.step4?.data?.energy || 0
    };
  };

  const energyData = getEnergyData();
  
  // Calculate total energy consumption
  const totalEnergy = energyData.llama_70b_energy + energyData.llama_8b_energy + 
                     energyData.comparisonEnergy + energyData.energy;
  
  // Calculate energy difference between models
  const energyDifference = energyData.llama_70b_energy - energyData.llama_8b_energy;
  const energySavings = Math.abs(energyDifference);
  const isMoreEfficient = energyData.llama_8b_energy < energyData.llama_70b_energy;

  // Chart data for visualization
  const chartData = [
    { name: 'GPT-4', value: energyData.llama_70b_energy, color: '#ef4444' },
    { name: 'Llama 3.1 70B', value: energyData.llama_8b_energy, color: '#22c55e' },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 hover:bg-green-50 hover:border-green-200 transition-colors"
        >
          <Leaf className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium">Climate Analytics</span>
          {totalEnergy > 0 && (
            <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700">
              {totalEnergy.toFixed(3)} Wh
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Leaf className="h-5 w-5 text-green-600" />
            Climate Analytics Dashboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Energy Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Energy Consumption Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-600">
                    {energyData.llama_70b_energy.toFixed(3)} Wh
                  </div>
                  <div className="text-sm text-red-700">GPT-4</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {energyData.llama_8b_energy.toFixed(3)} Wh
                  </div>
                  <div className="text-sm text-green-700">Llama 3.1 70B</div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {totalEnergy.toFixed(3)} Wh
                </div>
                <div className="text-sm text-blue-700">Total Energy Consumption</div>
              </div>
            </CardContent>
          </Card>

          {/* Energy Comparison Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Energy Consumption by Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.value.toFixed(3)} Wh
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Efficiency Analysis */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {isMoreEfficient ? (
                  <TrendingDown className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-red-500" />
                )}
                Efficiency Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-700 mb-2">
                    {energySavings.toFixed(3)} Wh
                  </div>
                  <div className="text-sm text-gray-600">
                    {isMoreEfficient ? 'Energy Saved' : 'Additional Energy Used'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {isMoreEfficient 
                      ? 'Llama 3.1 8B is more energy efficient' 
                      : 'Llama 3.3 70B is more energy efficient'
                    }
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-700">Efficiency Ratio</div>
                  <div className="text-lg font-bold text-gray-900">
                    {energyData.llama_70b_energy > 0 
                      ? (energyData.llama_8b_energy / energyData.llama_70b_energy).toFixed(2)
                      : 'N/A'
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Llama 8B vs GPT-4
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-700">Carbon Impact</div>
                  <div className="text-lg font-bold text-gray-900">
                    {(totalEnergy * 0.0004).toFixed(4)} kg CO₂
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Est. based on grid mix
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-700">Environmental Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Energy Efficiency</span>
                  <Badge variant={isMoreEfficient ? "default" : "destructive"}>
                    {isMoreEfficient ? "Efficient" : "Less Efficient"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClimateAnalytics;

interface CostComparisonChartProps {
  original: number;
  optimized: number;
}

export const CostComparisonChart = ({ original, optimized }: CostComparisonChartProps) => {
  const maxValue = Math.max(original, optimized);
  const originalHeight = (original / maxValue) * 100;
  const optimizedHeight = (optimized / maxValue) * 100;

  return (
    <div className="flex items-end justify-center gap-4 h-20 p-2">
      <div className="flex flex-col items-center gap-1">
        <div className="w-8 bg-muted-foreground/20 rounded-t flex items-end" style={{ height: '60px' }}>
          <div 
            className="w-full bg-muted-foreground rounded-t transition-all duration-500"
            style={{ height: `${originalHeight}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">Original</span>
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <div className="w-8 bg-success-green/20 rounded-t flex items-end" style={{ height: '60px' }}>
          <div 
            className="w-full bg-success-green rounded-t transition-all duration-500"
            style={{ height: `${optimizedHeight}%` }}
          />
        </div>
        <span className="text-xs text-success-green">Optimized</span>
      </div>
    </div>
  );
};
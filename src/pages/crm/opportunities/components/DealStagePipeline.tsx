import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const STAGES = [
  { id: 'new', label: 'New', probability: 10 },
  { id: 'contacted', label: 'Contacted', probability: 20 },
  { id: 'qualified', label: 'Qualified', probability: 40 },
  { id: 'proposal', label: 'Proposal', probability: 60 },
  { id: 'negotiation', label: 'Negotiation', probability: 80 },
  { id: 'won', label: 'Won', probability: 100 },
  { id: 'lost', label: 'Lost', probability: 0 },
];

interface DealStagePipelineProps {
  currentStage: string;
  onStageChange: (stage: string, probability: number) => void;
}

const DealStagePipeline = ({ currentStage, onStageChange }: DealStagePipelineProps) => {
  const currentIndex = STAGES.findIndex(s => s.id === currentStage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deal Stage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {STAGES.map((stage, index) => {
          const isActive = stage.id === currentStage;
          const isPassed = index < currentIndex && currentStage !== 'lost';
          const isLost = currentStage === 'lost' && stage.id === 'lost';
          const isWon = currentStage === 'won' && stage.id === 'won';

          return (
            <Button
              key={stage.id}
              variant={isActive ? 'default' : 'outline'}
              className={`w-full justify-between ${
                (isPassed || isWon) && !isLost ? 'bg-green-500/10 border-green-500/20 text-green-500' : ''
              } ${isLost ? 'bg-red-500/10 border-red-500/20 text-red-500' : ''}`}
              onClick={() => onStageChange(stage.id, stage.probability)}
            >
              <span className="flex items-center gap-2">
                {(isPassed || isWon) && !isLost && (
                  <Check className="h-4 w-4" />
                )}
                {stage.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {stage.probability}%
              </span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DealStagePipeline;

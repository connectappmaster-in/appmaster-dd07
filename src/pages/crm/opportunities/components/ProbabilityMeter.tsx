import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Award, AlertCircle } from 'lucide-react';

interface ProbabilityMeterProps {
  probability: number;
}

const ProbabilityMeter = ({ probability }: ProbabilityMeterProps) => {
  const getProbabilityInfo = (prob: number) => {
    if (prob >= 70) {
      return {
        label: 'High Probability',
        color: 'text-green-500',
        icon: Award,
        message: 'Strong chance of winning',
      };
    }
    if (prob >= 40) {
      return {
        label: 'Medium Probability',
        color: 'text-yellow-500',
        icon: TrendingUp,
        message: 'Moderate chance of winning',
      };
    }
    return {
      label: 'Low Probability',
      color: 'text-red-500',
      icon: AlertCircle,
      message: 'Needs attention',
    };
  };

  const probInfo = getProbabilityInfo(probability);
  const ProbIcon = probInfo.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Win Probability
          <ProbIcon className={`h-5 w-5 ${probInfo.color}`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-5xl font-bold ${probInfo.color} mb-2`}>
            {probability}%
          </div>
          <p className="text-sm text-muted-foreground">{probInfo.message}</p>
        </div>

        <Progress value={probability} className="h-3" />

        <div className="pt-4 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0-39%</span>
            <span>40-69%</span>
            <span>70-100%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProbabilityMeter;

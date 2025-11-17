import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Flame, Snowflake } from 'lucide-react';

interface LeadScoreMeterProps {
  score: number;
}

const LeadScoreMeter = ({ score }: LeadScoreMeterProps) => {
  const getScoreInfo = (score: number) => {
    if (score >= 70) {
      return {
        label: 'Hot Lead',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        icon: Flame,
        message: 'High priority - act now!',
        progressColor: 'bg-red-500'
      };
    }
    if (score >= 40) {
      return {
        label: 'Warm Lead',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        icon: TrendingUp,
        message: 'Good potential - follow up soon',
        progressColor: 'bg-yellow-500'
      };
    }
    return {
      label: 'Cold Lead',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      icon: Snowflake,
      message: 'Needs nurturing',
      progressColor: 'bg-blue-500'
    };
  };

  const scoreInfo = getScoreInfo(score);
  const ScoreIcon = scoreInfo.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Lead Score
          <Badge className={`${scoreInfo.bgColor} ${scoreInfo.color} ${scoreInfo.borderColor}`}>
            <ScoreIcon className="h-3 w-3 mr-1" />
            {scoreInfo.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-5xl font-bold text-foreground mb-2">
            {score}
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
          <p className="text-sm text-muted-foreground">{scoreInfo.message}</p>
        </div>

        <Progress value={score} className="h-3" />

        <div className="pt-4 border-t border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cold</span>
            <span className="text-muted-foreground">Warm</span>
            <span className="text-muted-foreground">Hot</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0-39</span>
            <span>40-69</span>
            <span>70-100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadScoreMeter;

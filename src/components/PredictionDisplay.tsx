import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PredictionDisplayProps {
  prediction: {
    homeTeam: string;
    awayTeam: string;
    homeWinProb: number;
    drawProb: number;
    awayWinProb: number;
    advice: string;
  };
}

const PredictionDisplay = ({ prediction }: PredictionDisplayProps) => {
  return (
    <Card className="p-4 mt-4 space-y-4">
      <h3 className="font-semibold">
        {prediction.homeTeam} vs {prediction.awayTeam}
      </h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Победа {prediction.homeTeam}</span>
          <span className="text-sm font-medium">{prediction.homeWinProb}%</span>
        </div>
        <Progress value={prediction.homeWinProb} className="h-2" />
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Ничья</span>
          <span className="text-sm font-medium">{prediction.drawProb}%</span>
        </div>
        <Progress value={prediction.drawProb} className="h-2" />
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Победа {prediction.awayTeam}</span>
          <span className="text-sm font-medium">{prediction.awayWinProb}%</span>
        </div>
        <Progress value={prediction.awayWinProb} className="h-2" />
      </div>
      
      <div className="mt-4 p-3 bg-secondary rounded-lg">
        <p className="text-sm">{prediction.advice}</p>
      </div>
    </Card>
  );
};

export default PredictionDisplay;
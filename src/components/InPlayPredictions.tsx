import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { fetchInPlayPredictions } from "@/services/footballApi";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface MatchPrediction {
  match_details: {
    home_team: string;
    away_team: string;
    home_logo: string;
    away_logo: string;
    country: string;
    competition: string;
    status: string;
  };
  match_score: {
    home_score: number;
    away_score: number;
  };
  probability: {
    home_win: string;
    draw: string;
    away_win: string;
  };
  predictions: {
    btts: string;
    over15: string;
    over25: string;
  };
}

const InPlayPredictions = () => {
  const [predictions, setPredictions] = useState<MatchPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchPredictions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInPlayPredictions();
      setPredictions(data);
      setError(null);
    } catch (err) {
      setError("Не удалось получить прогнозы");
      console.error("Error fetching predictions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPredictions();
      const interval = setInterval(fetchPredictions, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const formatPrediction = (prediction: MatchPrediction) => {
    return (
      <Card key={`${prediction.match_details.home_team}-${prediction.match_details.away_team}`} className="p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img 
              src={prediction.match_details.home_logo} 
              alt={prediction.match_details.home_team}
              className="w-8 h-8"
            />
            <span className="font-semibold">{prediction.match_details.home_team}</span>
          </div>
          <div className="text-lg font-bold">
            {prediction.match_score.home_score} - {prediction.match_score.away_score}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{prediction.match_details.away_team}</span>
            <img 
              src={prediction.match_details.away_logo} 
              alt={prediction.match_details.away_team}
              className="w-8 h-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Турнир:</p>
            <p>{prediction.match_details.competition} ({prediction.match_details.country})</p>
          </div>
          <div>
            <p className="text-muted-foreground">Статус матча:</p>
            <p>{prediction.match_details.status}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Победа 1</p>
            <p>{prediction.probability.home_win}%</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Ничья</p>
            <p>{prediction.probability.draw}%</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Победа 2</p>
            <p>{prediction.probability.away_win}%</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Тотал больше 1.5</p>
            <p>{prediction.predictions.over15}%</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Тотал больше 2.5</p>
            <p>{prediction.predictions.over25}%</p>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          Прогнозы в реальном времени
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between">
              <span>Прогнозы в реальном времени</span>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </DialogTitle>
          <DialogDescription>
            Обновление каждые 5 секунд
          </DialogDescription>
        </DialogHeader>
        
        {error ? (
          <div className="text-red-500 p-4">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            {predictions?.map(formatPrediction)}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InPlayPredictions;
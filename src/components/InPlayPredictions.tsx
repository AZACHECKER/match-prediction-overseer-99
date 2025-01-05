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
  id: number;
  date: string;
  status: string;
  home_goals: number;
  away_goals: number;
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  country: string;
  competition: string;
  competition_full: string;
  home_win: string;
  away_win: string;
  draw: string;
  both_teams_to_score: string;
  over15goals: string;
  over25goals: string;
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
      <Card key={prediction.id} className="p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img 
              src={prediction.homeLogo} 
              alt={prediction.homeTeam}
              className="w-8 h-8"
            />
            <span className="font-semibold">{prediction.homeTeam}</span>
          </div>
          <div className="text-lg font-bold">
            {prediction.home_goals} - {prediction.away_goals}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{prediction.awayTeam}</span>
            <img 
              src={prediction.awayLogo} 
              alt={prediction.awayTeam}
              className="w-8 h-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Турнир:</p>
            <p>{prediction.competition} ({prediction.country})</p>
          </div>
          <div>
            <p className="text-muted-foreground">Статус матча:</p>
            <p>{prediction.status}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Победа 1</p>
            <p>{prediction.home_win}%</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Ничья</p>
            <p>{prediction.draw}%</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Победа 2</p>
            <p>{prediction.away_win}%</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Тотал больше 1.5</p>
            <p>{prediction.over15goals}%</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Тотал больше 2.5</p>
            <p>{prediction.over25goals}%</p>
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
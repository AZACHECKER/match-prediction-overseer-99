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
    match_id: number;
    match_date: string;
    match_status: string;
    home_team: string;
    away_team: string;
    home_logo: string;
    away_logo: string;
    competition_name: string;
    country: string;
  };
  match_score: {
    home_goals: number;
    away_goals: number;
    first_half_home_goals: number;
    first_half_away_goals: number;
  };
  probability: {
    home_win: string;
    away_win: string;
    draw: string;
    both_teams_to_score: string;
    over_15_goals: string;
    over_25_goals: string;
  };
  predictions: {
    win_draw_win: string;
    correct_score: string;
    half_time_full_time: string;
  };
  form_data: {
    home_team_form: string;
    away_team_form: string;
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
      <Card key={prediction.match_details.match_id} className="p-4 mb-4">
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
            {prediction.match_score.home_goals} - {prediction.match_score.away_goals}
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
            <p>{prediction.match_details.competition_name} ({prediction.match_details.country})</p>
          </div>
          <div>
            <p className="text-muted-foreground">Статус матча:</p>
            <p>{prediction.match_details.match_status}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Первый тайм:</p>
            <p>{prediction.match_score.first_half_home_goals} - {prediction.match_score.first_half_away_goals}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Прогноз:</p>
            <p>{prediction.predictions.win_draw_win}</p>
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

        <div className="mt-4 text-sm">
          <p className="text-muted-foreground">Форма команд:</p>
          <div className="flex justify-between mt-1">
            <p>Хозяева: {prediction.form_data.home_team_form}</p>
            <p>Гости: {prediction.form_data.away_team_form}</p>
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
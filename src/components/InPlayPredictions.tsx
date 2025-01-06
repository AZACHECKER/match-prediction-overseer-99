import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { fetchInPlayPredictions } from "@/services/footballApi";
import { Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import MatchAnalytics from "./MatchAnalytics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface LiveOdd {
  fixture: {
    id: number;
    date: string;
    status: {
      long: string;
      short: string;
    };
  };
  league: {
    name: string;
    country: string;
  };
  teams: {
    home: {
      name: string;
      logo: string;
    };
    away: {
      name: string;
      logo: string;
    };
  };
  goals: {
    home: number;
    away: number;
  };
  odds: {
    [key: string]: {
      name: string;
      values: Array<{
        value: string;
        odd: string;
      }>;
    }[];
  };
}

const InPlayPredictions = () => {
  const [predictions, setPredictions] = useState<LiveOdd[]>([]);
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
      const interval = setInterval(fetchPredictions, 15000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const formatPrediction = (match: LiveOdd) => {
    const homeOdds = match.odds?.["1"]?.[0]?.values?.[0]?.odd || "N/A";
    const drawOdds = match.odds?.["1"]?.[0]?.values?.[1]?.odd || "N/A";
    const awayOdds = match.odds?.["1"]?.[0]?.values?.[2]?.odd || "N/A";
    const score = `${match.goals.home}-${match.goals.away}`;

    return (
      <Card 
        key={match.fixture.id} 
        className="p-4 mb-4 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-gradient-to-r from-background to-background/50"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img 
              src={match.teams.home.logo} 
              alt={match.teams.home.name}
              className="w-8 h-8 animate-fade-in"
            />
            <span className="font-semibold">{match.teams.home.name}</span>
          </div>
          <div className="text-lg font-bold bg-primary/10 px-3 py-1 rounded-full">
            {score}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{match.teams.away.name}</span>
            <img 
              src={match.teams.away.logo} 
              alt={match.teams.away.name}
              className="w-8 h-8 animate-fade-in"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-muted-foreground">Турнир:</p>
            <p>{match.league.name} ({match.league.country})</p>
          </div>
          <div>
            <p className="text-muted-foreground">Статус матча:</p>
            <p>{match.fixture.status.long}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm p-3 bg-secondary/50 rounded-lg mb-4">
          <div className="text-center">
            <p className="text-muted-foreground">П1</p>
            <p className="font-mono">{homeOdds}</p>
          </div>
          <div className="text-center border-x border-border/30">
            <p className="text-muted-foreground">X</p>
            <p className="font-mono">{drawOdds}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">П2</p>
            <p className="font-mono">{awayOdds}</p>
          </div>
        </div>

        <MatchAnalytics 
          homeTeam={match.teams.home.name}
          awayTeam={match.teams.away.name}
          score={score}
        />
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full group hover:shadow-lg transition-all duration-300">
          <TrendingUp className="w-4 h-4 mr-2 group-hover:animate-bounce" />
          Коэффициенты в реальном времени
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between">
              <span>Коэффициенты в реальном времени</span>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </DialogTitle>
          <DialogDescription>
            Обновление каждые 15 секунд
          </DialogDescription>
        </DialogHeader>
        
        {error ? (
          <div className="text-red-500 p-4 text-center bg-red-500/10 rounded-lg">
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
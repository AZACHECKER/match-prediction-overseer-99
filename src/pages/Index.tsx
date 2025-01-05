import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import MatchList from "@/components/MatchList";
import PredictionDisplay from "@/components/PredictionDisplay";
import InPlayPredictions from "@/components/InPlayPredictions";
import { fetchMatchPrediction } from "@/services/footballApi";

const Index = () => {
  const [matchId, setMatchId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const { toast } = useToast();

  const handleGetPrediction = async (id: string) => {
    if (!id) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите ID матча",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const apiKey = "da0ced249d4c707bab494d05ab71fa25";
      const predictionData = await fetchMatchPrediction(id, apiKey);
      setPrediction(predictionData);
      setMatchId(id);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить прогноз",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Футбольные матчи и прогнозы</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Текущие матчи</h2>
          <MatchList onMatchSelect={handleGetPrediction} />
          <InPlayPredictions />
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Получить прогноз</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Введите ID матча"
              value={matchId}
              onChange={(e) => setMatchId(e.target.value)}
            />
            <Button 
              onClick={() => handleGetPrediction(matchId)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Загрузка
                </>
              ) : (
                "Получить прогноз"
              )}
            </Button>
          </div>
          
          {prediction && <PredictionDisplay prediction={prediction} />}
        </Card>
      </div>
    </div>
  );
};

export default Index;
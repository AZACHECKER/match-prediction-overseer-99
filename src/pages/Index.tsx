import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import MatchList from "@/components/MatchList";
import PredictionDisplay from "@/components/PredictionDisplay";
import { fetchMatchPrediction, fetchInPlayPredictions } from "@/services/footballApi";

const Index = () => {
  const [matchId, setMatchId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInPlay, setIsLoadingInPlay] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [inPlayPredictions, setInPlayPredictions] = useState<any>(null);
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

  const handleGetInPlayPredictions = async () => {
    setIsLoadingInPlay(true);
    try {
      const data = await fetchInPlayPredictions();
      setInPlayPredictions(data);
      toast({
        title: "Успех",
        description: "Прогнозы во время игры получены",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить прогнозы во время игры",
        variant: "destructive",
      });
    } finally {
      setIsLoadingInPlay(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Футбольные матчи и прогнозы</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Текущие матчи</h2>
          <MatchList onMatchSelect={handleGetPrediction} />
          
          <Button 
            onClick={handleGetInPlayPredictions}
            disabled={isLoadingInPlay}
            className="w-full mt-4"
          >
            {isLoadingInPlay ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Загрузка прогнозов
              </>
            ) : (
              "Получить прогнозы во время игры"
            )}
          </Button>

          {inPlayPredictions && (
            <div className="mt-4 p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">Прогнозы во время игры:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(inPlayPredictions, null, 2)}
              </pre>
            </div>
          )}
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
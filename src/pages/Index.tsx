import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Activity, Key } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MatchList from "@/components/MatchList";
import PredictionDisplay from "@/components/PredictionDisplay";
import InPlayPredictions from "@/components/InPlayPredictions";
import { fetchMatchPrediction } from "@/services/footballApi";

const Index = () => {
  const [matchId, setMatchId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
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

  const handleSaveApiKey = () => {
    if (!apiKey) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите API ключ",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("football-api-key", apiKey);
    toast({
      title: "Успешно",
      description: "API ключ сохранен",
    });
    setIsApiKeyDialogOpen(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 bg-gradient-to-br from-background to-background/90">
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setIsApiKeyDialogOpen(true)}
        >
          <Key className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Введите API ключ</DialogTitle>
            <DialogDescription>
              Введите ваш API ключ для доступа к футбольным данным
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Введите API ключ"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              type="password"
            />
            <Button onClick={handleSaveApiKey}>Сохранить</Button>
          </div>
        </DialogContent>
      </Dialog>

      <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground animate-fade-in">
        Футбольные матчи и прогнозы
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
        <Card className="p-6 space-y-4 backdrop-blur-sm bg-gradient-to-br from-card/50 to-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Текущие матчи
          </h2>
          <MatchList onMatchSelect={handleGetPrediction} />
          <InPlayPredictions />
        </Card>

        <Card className="p-6 space-y-4 backdrop-blur-sm bg-gradient-to-br from-card/50 to-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Получить прогноз
          </h2>
          <div className="flex gap-4">
            <Input
              placeholder="Введите ID матча"
              value={matchId}
              onChange={(e) => setMatchId(e.target.value)}
              className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
            />
            <Button 
              onClick={() => handleGetPrediction(matchId)}
              disabled={isLoading}
              className="transition-all duration-300 hover:shadow-lg"
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
          
          {prediction && (
            <div className="animate-fade-in">
              <PredictionDisplay prediction={prediction} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;
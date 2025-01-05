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
} from "@/components/ui/dialog";

const InPlayPredictions = () => {
  const [predictions, setPredictions] = useState<any>(null);
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
      // Обновляем каждые 5 секунд
      const interval = setInterval(fetchPredictions, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const formatPrediction = (prediction: any) => {
    return (
      <Card key={prediction.id} className="p-4 mb-4">
        <h3 className="font-semibold mb-2">
          {prediction.home_team} vs {prediction.away_team}
        </h3>
        <div className="space-y-2 text-sm">
          <p>Счёт: {prediction.score || "0-0"}</p>
          <p>Минута: {prediction.minute || "Н/Д"}</p>
          <p>Рекомендация: {prediction.prediction || "Нет данных"}</p>
          <p>Вероятность: {prediction.probability || "Н/Д"}%</p>
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
      <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between">
              <span>Прогнозы в реальном времени</span>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        {error ? (
          <div className="text-red-500 p-4">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            {predictions?.predictions?.map(formatPrediction)}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InPlayPredictions;
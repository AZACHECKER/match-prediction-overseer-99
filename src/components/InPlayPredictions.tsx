import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { fetchInPlayPredictions } from "@/services/footballApi";
import { Loader2 } from "lucide-react";

const InPlayPredictions = () => {
  const [predictions, setPredictions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    fetchPredictions();
    // Обновляем каждые 30 секунд
    const interval = setInterval(fetchPredictions, 30000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Прогнозы в реальном времени</h3>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>
      <div className="space-y-4">
        {predictions?.predictions?.map(formatPrediction)}
      </div>
    </div>
  );
};

export default InPlayPredictions;
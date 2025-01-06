import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { pipeline } from "@huggingface/transformers";
import { Loader2 } from "lucide-react";

interface MatchAnalyticsProps {
  homeTeam: string;
  awayTeam: string;
  score?: string;
}

const MatchAnalytics = ({ homeTeam, awayTeam, score }: MatchAnalyticsProps) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const analyzeMatch = async () => {
      try {
        const classifier = await pipeline(
          "text-classification",
          "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
        );

        const matchContext = `${homeTeam} vs ${awayTeam} ${score ? `(${score})` : ''}`;
        const result = await classifier(matchContext);
        
        setAnalysis(result[0].label === "POSITIVE" 
          ? "Высокая вероятность результативного матча" 
          : "Возможен осторожный матч с небольшим количеством голов");
      } catch (error) {
        console.error("Error analyzing match:", error);
        setAnalysis("Не удалось выполнить анализ матча");
      } finally {
        setIsLoading(false);
      }
    };

    analyzeMatch();
  }, [homeTeam, awayTeam, score]);

  return (
    <Card className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm animate-fade-in">
      <h3 className="text-lg font-semibold mb-3">AI Анализ</h3>
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{analysis}</p>
      )}
    </Card>
  );
};

export default MatchAnalytics;
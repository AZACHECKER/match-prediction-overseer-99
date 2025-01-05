import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import MatchList from "@/components/MatchList";
import PredictionDisplay from "@/components/PredictionDisplay";

const Index = () => {
  const [matchId, setMatchId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const { toast } = useToast();

  const handleGetPrediction = async () => {
    if (!matchId) {
      toast({
        title: "Error",
        description: "Please enter a match ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulated API call - replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPrediction({
        homeTeam: "Team A",
        awayTeam: "Team B",
        homeWinProb: 45,
        drawProb: 25,
        awayWinProb: 30,
        advice: "Close match expected with slight advantage to home team"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get prediction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Football Matches & Predictions</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Live Matches</h2>
          <MatchList />
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Get Prediction</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Enter match ID"
              value={matchId}
              onChange={(e) => setMatchId(e.target.value)}
            />
            <Button 
              onClick={handleGetPrediction}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </>
              ) : (
                "Get Prediction"
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
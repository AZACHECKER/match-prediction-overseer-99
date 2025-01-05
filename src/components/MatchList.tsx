import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCw } from "lucide-react";

const MatchList = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMatches([
        { id: 1, homeTeam: "Team A", awayTeam: "Team B", date: "2024-02-20", score: "2-1" },
        { id: 2, homeTeam: "Team C", awayTeam: "Team D", date: "2024-02-20", score: "0-0" },
        { id: 3, homeTeam: "Team E", awayTeam: "Team F", date: "2024-02-20", score: "1-3" },
      ]);
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={fetchMatches}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Matches
          </>
        )}
      </Button>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary mb-2 hover:bg-secondary/80 transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium">
                {match.homeTeam} vs {match.awayTeam}
              </p>
              <p className="text-sm text-muted-foreground">ID: {match.id}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">{match.score}</p>
              <p className="text-sm text-muted-foreground">{match.date}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default MatchList;
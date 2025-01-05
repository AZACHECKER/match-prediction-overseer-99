const FOOTBALL_BASE_URL = "https://v3.football.api-sports.io";
const BETMINER_BASE_URL = "https://betminer.p.rapidapi.com";

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  score: string;
}

export const fetchLiveMatches = async (apiKey: string): Promise<Match[]> => {
  const response = await fetch(`${FOOTBALL_BASE_URL}/fixtures?live=all`, {
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "v3.football.api-sports.io"
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch matches');
  }

  const data = await response.json();
  
  return data.response.map((fixture: any) => ({
    id: fixture.fixture.id,
    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,
    date: fixture.fixture.date,
    score: `${fixture.goals.home ?? 0}-${fixture.goals.away ?? 0}`
  }));
};

export const fetchMatchPrediction = async (matchId: string, apiKey: string) => {
  const response = await fetch(`${FOOTBALL_BASE_URL}/predictions?fixture=${matchId}`, {
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "v3.football.api-sports.io"
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch prediction');
  }

  const data = await response.json();
  const prediction = data.response[0];

  return {
    homeTeam: prediction.teams.home.name,
    awayTeam: prediction.teams.away.name,
    homeWinProb: parseInt(prediction.predictions.percent.home),
    drawProb: parseInt(prediction.predictions.percent.draw),
    awayWinProb: parseInt(prediction.predictions.percent.away),
    advice: prediction.predictions.advice
  };
};

export const fetchInPlayPredictions = async () => {
  console.log('Fetching in-play predictions...');
  const response = await fetch('https://betminer.p.rapidapi.com/bm/predictions/inplay', {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '248d6b9851msh9d833e8ddf913efp17c26ejsn5f174b6901f8',
      'x-rapidapi-host': 'betminer.p.rapidapi.com'
    }
  });

  if (!response.ok) {
    console.error('Error fetching predictions:', response.statusText);
    throw new Error('Failed to fetch predictions');
  }

  const data = await response.json();
  console.log('Received predictions data:', data);
  return data;
};
import React from 'react';
import { motion } from 'framer-motion';

interface MatchEvent {
  type: 'goal' | 'shot' | 'foul' | 'corner';
  position: { x: number; y: number };
  team: 'home' | 'away';
  minute: number;
}

interface MatchFieldVisualizationProps {
  events?: MatchEvent[];
  homeTeam: string;
  awayTeam: string;
}

const MatchFieldVisualization = ({ events = [], homeTeam, awayTeam }: MatchFieldVisualizationProps) => {
  return (
    <div className="relative w-full aspect-[1.5] bg-gradient-to-b from-emerald-600 to-emerald-700 rounded-lg overflow-hidden shadow-lg">
      {/* Field lines */}
      <div className="absolute inset-0 border-2 border-white/50 m-4">
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/50 rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full" />
        {/* Center line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/50" />
        
        {/* Penalty areas */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-64 border-2 border-white/50" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-64 border-2 border-white/50" />
        
        {/* Goal areas */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-32 border-2 border-white/50" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-32 border-2 border-white/50" />
      </div>

      {/* Team names */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-4 text-white font-semibold bg-black/20 px-4 py-1 rounded-full">
        <span>{homeTeam}</span>
        <span>vs</span>
        <span>{awayTeam}</span>
      </div>

      {/* Match events visualization */}
      {events.map((event, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute"
          style={{
            left: `${event.position.x}%`,
            top: `${event.position.y}%`,
          }}
        >
          <div className={`w-3 h-3 rounded-full ${
            event.team === 'home' ? 'bg-blue-500' : 'bg-red-500'
          }`} />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white bg-black/50 px-2 py-0.5 rounded whitespace-nowrap">
            {event.type} - {event.minute}'
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MatchFieldVisualization;
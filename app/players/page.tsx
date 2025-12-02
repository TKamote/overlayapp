"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, User, Plus, Trash2 } from "lucide-react";
import PlayerFormModal from "@/components/PlayerFormModal";

// Initial Data
const INITIAL_NAMES = [
  "Adrian", "AJ", "Aldrin", "Aldwin", "Alfie", "AllanC", "Anthony", "Arys", "Boj", "Brandon", 
  "Clarke", "Dave", "Dennis", "Dunn", "Ebet", "Ed", "Erwin", "Gem", "Hans", "Hervin", 
  "Huber", "Ivan", "Jarland", "Joemz", "Joelski", "Johner", "Jonas", "Joey", "JP", "Khristian", 
  "Louie", "Louie S.", "Marlon", "Nikko", "Owen", "Padi", "Patrick", "Renz", "Reymund", "Richard", 
  "Robbie", "Sherwin", "Shierwin", "Siva", "Ted", "Terrel", "Varan", "VJ", "Warren", "Topher", 
  "Dennel", "Jerome", "Emerson", "Tom", "Jun", "Chito"
];

interface Player {
  id: string;
  name: string;
  points: number;
  photoURL: string | null;
}

// Deterministic Initial Roster
const getPoints = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 500 + (Math.abs(hash) % 500);
};

const INITIAL_ROSTER = INITIAL_NAMES.map((name, i) => ({
  id: `p-${i}`,
  name,
  points: getPoints(name),
  photoURL: null as string | null,
})).sort((a, b) => b.points - a.points);

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_ROSTER);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("barako-players");
    if (saved) {
      try {
        setPlayers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load players from storage", e);
      }
    }
  }, []);

  // Save to LocalStorage whenever players change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("barako-players", JSON.stringify(players));
    }
  }, [players, isMounted]);

  if (!isMounted) {
    return null;
  }

  const handleAddPlayer = () => {
    setEditingPlayer(null);
    setIsModalOpen(true);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setIsModalOpen(true);
  };

  const handleSavePlayer = (name: string, points: number, photoURL: string | null) => {
    if (editingPlayer) {
      // Update existing
      setPlayers(prev => prev.map(p => 
        p.id === editingPlayer.id 
          ? { ...p, name, points, photoURL } 
          : p
      ).sort((a, b) => b.points - a.points));
    } else {
      // Create new
      const newPlayer = {
        id: `new-${Date.now()}`,
        name,
        points,
        photoURL,
      };
      setPlayers(prev => [...prev, newPlayer].sort((a, b) => b.points - a.points));
    }
  };

  const handleDeletePlayer = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent triggering row edit
    if (confirm("Are you sure you want to delete this player?")) {
      setPlayers(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 bg-zinc-900 rounded-full shadow hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="text-zinc-400 hover:text-white" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Players Roster</h1>
        </div>
        
        <button 
          onClick={handleAddPlayer}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add Player
        </button>
      </div>

      {/* 3 Column Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[0, 1, 2].map((colIndex) => {
          const colPlayers = players.slice(colIndex * 25, (colIndex + 1) * 25);
          
          return (
            <div key={colIndex} className="bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-zinc-800 flex flex-col h-fit">
              <div className="bg-zinc-950/50 px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="font-bold text-zinc-400 uppercase tracking-wider text-xs">
                  Rank #{colIndex * 25 + 1} - {Math.min((colIndex + 1) * 25, players.length)}
                </h2>
                <Trophy size={16} className="text-yellow-600" />
              </div>
              
              <div className="divide-y divide-zinc-800/50">
                {colPlayers.map((player, idx) => {
                  const rank = colIndex * 25 + idx + 1;
                  return (
                    <div 
                      key={player.id} 
                      onClick={() => handleEditPlayer(player)}
                      className="flex items-center p-3 hover:bg-zinc-800 transition-colors cursor-pointer group relative"
                      title="Click to Edit"
                    >
                      
                      {/* Rank */}
                      <div className="w-8 font-mono text-zinc-600 text-xs font-bold">#{rank}</div>
                      
                      {/* Photo */}
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mr-3 border-2 border-zinc-700 group-hover:border-blue-500/50 transition-colors shrink-0 overflow-hidden">
                        {player.photoURL ? (
                          <img src={player.photoURL} alt={player.name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={20} className="text-zinc-500 group-hover:text-blue-400" />
                        )}
                      </div>
                      
                      {/* Name */}
                      <div className="flex-1 min-w-0 mr-2">
                        <div className="font-bold text-zinc-200 group-hover:text-white truncate">{player.name}</div>
                      </div>

                      {/* Points */}
                      <div className="text-sm font-mono font-bold text-zinc-400 group-hover:text-yellow-500 mr-4">
                        {player.points}
                      </div>

                      {/* Actions */}
                      <button 
                        onClick={(e) => handleDeletePlayer(e, player.id)}
                        className="p-2 text-zinc-600 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-lg"
                        title="Delete Player"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  );
                })}
                {colPlayers.length === 0 && (
                  <div className="p-8 text-center text-zinc-600 text-sm italic">
                    Slot Open
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <PlayerFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSavePlayer}
        initialData={editingPlayer}
      />
    </div>
  );
}

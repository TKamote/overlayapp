import { useState, useEffect } from "react";
import { Search, User, X } from "lucide-react";

interface Player {
  id: string;
  name: string;
  photoURL?: string | null;
  points?: number;
}

interface PlayerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (player: Player) => void;
  title: string;
}

// Default Mock Data (Fallback)
const DEFAULT_NAMES = [
  "Adrian", "AJ", "Aldrin", "Aldwin", "Alfie", "AllanC", "Anthony", "Arys", "Boj", "Brandon", 
  "Clarke", "Dave", "Dennis", "Dunn", "Ebet", "Ed", "Erwin", "Gem", "Hans", "Hervin", 
  "Huber", "Ivan", "Jarland", "Joemz", "Joelski", "Johner", "Jonas", "Joey", "JP", "Khristian", 
  "Louie", "Louie S.", "Marlon", "Nikko", "Owen", "Padi", "Patrick", "Renz", "Reymund", "Richard", 
  "Robbie", "Sherwin", "Shierwin", "Siva", "Ted", "Terrel", "Varan", "VJ", "Warren", "Topher", 
  "Dennel", "Jerome", "Emerson", "Tom", "Jun", "Chito"
];

const DEFAULT_PLAYERS: Player[] = DEFAULT_NAMES.map((name, i) => ({
  id: `def-${i}`,
  name,
  points: 500,
  photoURL: null
})).sort((a, b) => a.name.localeCompare(b.name));

const PlayerSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
  title,
}: PlayerSelectionModalProps) => {
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);

  // Load players from localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      const saved = localStorage.getItem("barako-players");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setPlayers(parsed.sort((a: Player, b: Player) => a.name.localeCompare(b.name)));
        } catch (e) {
          console.error("Failed to load players", e);
          setPlayers(DEFAULT_PLAYERS);
        }
      } else {
        setPlayers(DEFAULT_PLAYERS);
      }
    }
  }, [isOpen]);

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search player name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredPlayers.map((player) => (
            <button
              key={player.id}
              onClick={() => {
                onSelect(player);
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-xl transition-colors group text-left"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:border-yellow-500/50 transition-colors overflow-hidden">
                {player.photoURL ? (
                  <img src={player.photoURL} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-zinc-500 group-hover:text-yellow-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold text-white group-hover:text-yellow-500 transition-colors">{player.name}</div>
                <div className="text-xs text-zinc-500 font-mono">Fargo: {player.points}</div>
              </div>
            </button>
          ))}
          {filteredPlayers.length === 0 && (
            <div className="text-center py-8 text-zinc-500">
              No players found
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PlayerSelectionModal;

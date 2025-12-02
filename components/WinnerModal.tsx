import { Trophy, X, RotateCcw } from "lucide-react";

interface WinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: { name: string; id?: string } | null;
  player1Score: number;
  player2Score: number;
  player3Score?: number;
  player1Name: string;
  player2Name: string;
  player3Name?: string;
}

const WinnerModal = ({
  isOpen,
  onClose,
  winner,
  player1Score,
  player2Score,
  player3Score,
  player1Name,
  player2Name,
  player3Name,
}: WinnerModalProps) => {
  if (!isOpen || !winner) return null;

  const isThreePlayers = !!player3Name;

  const getDefeatedText = () => {
    if (!isThreePlayers) {
      return `Defeated ${winner.name === player1Name ? player2Name : player1Name}`;
    }
    const losers = [];
    if (winner.name !== player1Name) losers.push(player1Name);
    if (winner.name !== player2Name) losers.push(player2Name);
    if (winner.name !== player3Name && player3Name) losers.push(player3Name);
    return `Defeated ${losers.join(" & ")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-yellow-500/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 pattern-grid-lg opacity-20" />
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-lg">
              <Trophy size={40} className="text-white drop-shadow-lg" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-wider drop-shadow-md">
              Winner!
            </h2>
            <p className="text-yellow-100 font-bold text-lg mt-1 opacity-90">
              Match Complete
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-4xl font-black text-white tracking-tight">
              {winner.name}
            </h3>
            <p className="text-zinc-400 font-medium">
              {getDefeatedText()}
            </p>
          </div>

          {/* Score Recap */}
          <div className="flex items-center justify-center gap-4 bg-zinc-950/50 p-4 rounded-xl border border-white/5">
            
            {/* Player 1 */}
            <div className={`text-center ${winner.name === player1Name ? "opacity-100 scale-110" : "opacity-50"}`}>
              <div className="text-xs text-zinc-500 uppercase font-bold mb-1">{player1Name}</div>
              <div className={`font-mono font-bold text-white ${winner.name === player1Name ? "text-3xl text-yellow-500" : "text-2xl"}`}>
                {player1Score}
              </div>
            </div>

            {!isThreePlayers && <div className="text-zinc-600 font-bold text-xl">-</div>}

            {/* Player 2 */}
            <div className={`text-center ${winner.name === player2Name ? "opacity-100 scale-110" : "opacity-50"}`}>
              <div className="text-xs text-zinc-500 uppercase font-bold mb-1">{player2Name}</div>
              <div className={`font-mono font-bold text-white ${winner.name === player2Name ? "text-3xl text-yellow-500" : "text-2xl"}`}>
                {player2Score}
              </div>
            </div>

            {/* Player 3 */}
            {isThreePlayers && (
              <div className={`text-center ${winner.name === player3Name ? "opacity-100 scale-110" : "opacity-50"}`}>
                <div className="text-xs text-zinc-500 uppercase font-bold mb-1">{player3Name}</div>
                <div className={`font-mono font-bold text-white ${winner.name === player3Name ? "text-3xl text-yellow-500" : "text-2xl"}`}>
                  {player3Score}
                </div>
              </div>
            )}

          </div>

          {/* Actions */}
          <div className="grid gap-3 pt-2">
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-yellow-500/20 flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Start New Match
            </button>
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <X size={20} />
              Dismiss
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WinnerModal;

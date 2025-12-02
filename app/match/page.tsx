"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import WinnerModal from "@/components/WinnerModal";
import PlayerSelectionModal from "@/components/PlayerSelectionModal";

const BilliardsBall = ({
  number,
  isMobile = false,
  isPocketed = false,
  onClick,
}: {
  number: number;
  isMobile?: boolean;
  isPocketed?: boolean;
  onClick?: () => void;
}) => (
  <div
    onClick={!isPocketed ? onClick : undefined}
    className={`
      relative flex items-center justify-center transition-all duration-300
      ${isMobile ? "w-10 h-10" : "w-16 h-16"}
      ${isPocketed ? "opacity-20 grayscale cursor-default" : "cursor-pointer hover:scale-110 hover:rotate-12"}
    `}
  >
    <Image
      src={`/ballicons/ball-${number}.png`}
      alt={`Ball ${number}`}
      width={isMobile ? 40 : 64}
      height={isMobile ? 40 : 64}
      className="object-contain drop-shadow-lg"
    />
    {/* Detection indicator could go here later */}
  </div>
);

interface MatchPlayer {
  name: string;
  id: string;
  points: number;
  photoURL?: string | null;
}

const DEFAULT_PLAYER_1: MatchPlayer = { name: "Player 1", id: "p1", points: 0 };
const DEFAULT_PLAYER_2: MatchPlayer = { name: "Player 2", id: "p2", points: 0 };

type GameMode = "9" | "10" | "15";

const LiveMatchPage = () => {
  const [isLive, setIsLive] = useState(false);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [raceTo, setRaceTo] = useState(9);
  const [currentTurn, setCurrentTurn] = useState<"player1" | "player2" | null>("player1");
  const [pocketedBalls, setPocketedBalls] = useState<Set<number>>(new Set());
  const [gameMode, setGameMode] = useState<GameMode>("9");
  
  // Players
  const [player1, setPlayer1] = useState<MatchPlayer>(DEFAULT_PLAYER_1);
  const [player2, setPlayer2] = useState<MatchPlayer>(DEFAULT_PLAYER_2);
  
  const [isMounted, setIsMounted] = useState(false);
  
  // Modals
  const [showP1Modal, setShowP1Modal] = useState(false);
  const [showP2Modal, setShowP2Modal] = useState(false);
  const [winner, setWinner] = useState<{ name: string } | null>(null);

  // Determine balls based on mode
  const getBallNumbers = () => {
    if (gameMode === "9") return Array.from({ length: 9 }, (_, i) => i + 1);
    if (gameMode === "10") return Array.from({ length: 10 }, (_, i) => i + 1);
    if (gameMode === "15") return [];
    return [];
  };

  const ballNumbers = getBallNumbers();

  // Load state from LocalStorage
  useEffect(() => {
    setIsMounted(true);
    const savedMatch = localStorage.getItem("barako-match-state");
    if (savedMatch) {
      try {
        const parsed = JSON.parse(savedMatch);
        setPlayer1(parsed.player1 || DEFAULT_PLAYER_1);
        setPlayer2(parsed.player2 || DEFAULT_PLAYER_2);
        setPlayer1Score(parsed.player1Score || 0);
        setPlayer2Score(parsed.player2Score || 0);
        setRaceTo(parsed.raceTo || 9);
        setGameMode(parsed.gameMode || "9");
      } catch (e) {
        console.error("Failed to load match state", e);
      }
    }
  }, []);

  // Save state to LocalStorage
  useEffect(() => {
    if (isMounted) {
      const state = {
        player1,
        player2,
        player1Score,
        player2Score,
        raceTo,
        gameMode,
      };
      localStorage.setItem("barako-match-state", JSON.stringify(state));
    }
  }, [player1, player2, player1Score, player2Score, raceTo, gameMode, isMounted]);

  // Winner Logic
  useEffect(() => {
    if (player1Score >= raceTo) setWinner(player1);
    else if (player2Score >= raceTo) setWinner(player2);
  }, [player1Score, player2Score, raceTo, player1, player2]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const key = e.key.toLowerCase();
      
      if (key === "q") setPlayer1Score(s => s + 1);
      if (key === "a") setPlayer1Score(s => Math.max(0, s - 1));
      if (key === "e") setPlayer2Score(s => s + 1);
      if (key === "d") setPlayer2Score(s => Math.max(0, s - 1));
      if (key === "z") setCurrentTurn("player1");
      if (key === "c") setCurrentTurn("player2");
      if (key === "x") setCurrentTurn(null);
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (!isMounted) return null;

  const handleLiveToggle = () => setIsLive(!isLive);

  const handleBallClick = (ballNumber: number) => {
    setPocketedBalls((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ballNumber)) newSet.delete(ballNumber);
      else newSet.add(ballNumber);
      return newSet;
    });
  };

  const handleResetBalls = () => setPocketedBalls(new Set());

  return (
    <div className="w-full h-screen bg-black/90 relative flex items-center justify-center overflow-hidden text-white">
      <Link href="/" className="absolute top-4 left-4 p-2 hover:bg-white/10 rounded-full z-50 text-white/50 hover:text-white transition-colors">
        <ArrowLeft size={24} />
      </Link>

      {/* PSGB Logo - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <Image
          src="/PSGB_LogoSQ copy.jpg"
          alt="PSGB Logo"
          width={120}
          height={120}
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="w-full max-w-[1920px] aspect-video bg-transparent relative border border-white/5">
        
        {/* Top Control Bar */}
        <div className="fixed top-[68px] sm:top-[76px] left-0 right-0 z-50 flex flex-col items-center gap-4">
          <button
            onClick={handleLiveToggle}
            className={`px-6 py-2 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border ${
              isLive
                ? "bg-red-600 border-red-500 text-white animate-pulse-live"
                : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {isLive ? "🔴 LIVE" : "GO LIVE"}
          </button>

          {/* Game Mode Selector (Hidden when live) */}
          {!isLive && (
            <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-lg backdrop-blur-sm border border-white/10">
              {(["9", "10", "15"] as GameMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setGameMode(mode)}
                  className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
                    gameMode === mode 
                      ? "bg-yellow-500 text-black" 
                      : "text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {mode}-Ball
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Balls Sidebar */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-4 bg-black/40 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
          {ballNumbers.length > 0 ? (
            <>
              <div className="flex flex-col space-y-2">
                {ballNumbers.map((ballNumber) => (
                  <BilliardsBall
                    key={ballNumber}
                    number={ballNumber}
                    isMobile={true}
                    isPocketed={pocketedBalls.has(ballNumber)}
                    onClick={() => handleBallClick(ballNumber)}
                  />
                ))}
              </div>
              <button onClick={handleResetBalls} className="text-xs uppercase font-bold text-white/10 hover:text-white/50 mt-2 transition-colors">
                Reset
              </button>
            </>
          ) : (
            <div className="text-xs text-gray-500 font-mono py-4 w-10 text-center">
              No balls
            </div>
          )}
        </div>

        {/* Scoreboard Footer */}
        <div className="absolute bottom-5 left-0 right-0 z-40 px-4 md:px-16">
          <div className="bg-gradient-to-r from-purple-950/90 via-purple-900/90 to-purple-950/90 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden">
             <div className="flex items-center justify-between relative h-16">
                
                {/* Player 1 */}
                <button 
                    onClick={() => setShowP1Modal(true)}
                    className={`flex items-center gap-3 flex-1 text-left group pl-6`}
                >
                    <div className={`w-12 h-12 rounded-full bg-gray-700 border-2 flex items-center justify-center text-xl font-bold transition-colors overflow-hidden ${currentTurn === 'player1' ? 'border-yellow-500' : 'border-white/20 group-hover:border-yellow-500'}`}>
                        {player1.photoURL ? (
                            <img src={player1.photoURL} alt={player1.name} className="w-full h-full object-cover" />
                        ) : (
                            player1.name.charAt(0)
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold uppercase tracking-wider text-white group-hover:text-yellow-500 transition-colors leading-none">{player1.name}</h2>
                    </div>
                </button>

                {/* Center Scores */}
                <div className="flex items-center gap-6 px-6 border-x border-white/10 bg-black/20 h-full">
                    <div className="text-5xl font-black tabular-nums leading-none text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                        {player1Score}
                    </div>
                    
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-0.5">Race</div>
                        <button 
                            onClick={() => setRaceTo(r => Math.min(50, r + 1))}
                            onContextMenu={(e) => { e.preventDefault(); setRaceTo(r => Math.max(1, r - 1)); }}
                            className="text-xl font-bold text-white hover:text-yellow-500 transition-colors leading-none"
                            title="Left Click (+), Right Click (-)"
                        >
                            {raceTo}
                        </button>
                    </div>

                    <div className="text-5xl font-black tabular-nums leading-none text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                        {player2Score}
                    </div>
                </div>

                {/* Player 2 */}
                <button 
                    onClick={() => setShowP2Modal(true)}
                    className={`flex items-center gap-3 flex-1 justify-end text-right group pr-6`}
                >
                    <div>
                        <h2 className="text-2xl font-bold uppercase tracking-wider text-white group-hover:text-yellow-500 transition-colors leading-none">{player2.name}</h2>
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-gray-700 border-2 flex items-center justify-center text-xl font-bold transition-colors overflow-hidden ${currentTurn === 'player2' ? 'border-yellow-500' : 'border-white/20 group-hover:border-yellow-500'}`}>
                        {player2.photoURL ? (
                            <img src={player2.photoURL} alt={player2.name} className="w-full h-full object-cover" />
                        ) : (
                            player2.name.charAt(0)
                        )}
                    </div>
                </button>

             </div>
          </div>
        </div>

        {/* Modals */}
        <PlayerSelectionModal 
            isOpen={showP1Modal} 
            onClose={() => setShowP1Modal(false)} 
            title="Select Player 1"
            onSelect={(p) => setPlayer1({ ...p, points: p.points || 0 })}
        />
        <PlayerSelectionModal 
            isOpen={showP2Modal} 
            onClose={() => setShowP2Modal(false)} 
            title="Select Player 2"
            onSelect={(p) => setPlayer2({ ...p, points: p.points || 0 })}
        />
        <WinnerModal
            isOpen={!!winner}
            onClose={() => {
                setWinner(null);
                setPlayer1Score(0);
                setPlayer2Score(0);
            }}
            winner={winner}
            player1Score={player1Score}
            player2Score={player2Score}
            player1Name={player1.name}
            player2Name={player2.name}
        />

      </div>
    </div>
  );
};

export default LiveMatchPage;

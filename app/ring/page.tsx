"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, RotateCw } from "lucide-react";
import WinnerModal from "@/components/WinnerModal";
import PlayerSelectionModal from "@/components/PlayerSelectionModal";
import { db } from "@/src/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

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
const DEFAULT_PLAYER_3: MatchPlayer = { name: "Player 3", id: "p3", points: 0 };

type GameMode = "9" | "10" | "15";

const RingGamePage = () => {
  const [isLive, setIsLive] = useState(false);
  
  // Scores
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [p3Score, setP3Score] = useState(0);
  
  const [raceTo, setRaceTo] = useState(7);
  const [p1Playing, setP1Playing] = useState(false);
  const [p2Playing, setP2Playing] = useState(false);
  const [p3Playing, setP3Playing] = useState(false);
  const [pocketedBalls, setPocketedBalls] = useState<Set<number>>(new Set());
  const [gameMode, setGameMode] = useState<GameMode>("9");
  const [isAutoMode, setIsAutoMode] = useState(false); // Auto detection mode
  const [detectedBalls, setDetectedBalls] = useState<number[]>([]); // Balls detected by AI
  
  // Players
  const [player1, setPlayer1] = useState<MatchPlayer>(DEFAULT_PLAYER_1);
  const [player2, setPlayer2] = useState<MatchPlayer>(DEFAULT_PLAYER_2);
  const [player3, setPlayer3] = useState<MatchPlayer>(DEFAULT_PLAYER_3);
  
  const [isMounted, setIsMounted] = useState(false);
  
  // Modals
  const [modalOpen, setModalOpen] = useState<"p1" | "p2" | "p3" | null>(null);
  const [winner, setWinner] = useState<{ name: string } | null>(null);

  // Determine balls based on mode
  const getBallNumbers = () => {
    if (gameMode === "9") return Array.from({ length: 9 }, (_, i) => i + 1);
    if (gameMode === "10") return Array.from({ length: 10 }, (_, i) => i + 1);
    if (gameMode === "15") return [];
    return [];
  };

  const ballNumbers = getBallNumbers();

  // Load state
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("barako-ring-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPlayer1(parsed.player1 || DEFAULT_PLAYER_1);
        setPlayer2(parsed.player2 || DEFAULT_PLAYER_2);
        setPlayer3(parsed.player3 || DEFAULT_PLAYER_3);
        setP1Score(parsed.p1Score || 0);
        setP2Score(parsed.p2Score || 0);
        setP3Score(parsed.p3Score || 0);
        setRaceTo(parsed.raceTo || 7);
        setGameMode(parsed.gameMode || "9");
        setP1Playing(parsed.p1Playing || false);
        setP2Playing(parsed.p2Playing || false);
        setP3Playing(parsed.p3Playing || false);
      } catch (e) {
        console.error("Failed to load ring state", e);
      }
    }
  }, []);

  // Save state
  useEffect(() => {
    if (isMounted) {
      const state = {
        player1, player2, player3,
        p1Score, p2Score, p3Score,
        raceTo, gameMode,
        p1Playing, p2Playing, p3Playing
      };
      localStorage.setItem("barako-ring-state", JSON.stringify(state));
    }
  }, [player1, player2, player3, p1Score, p2Score, p3Score, raceTo, gameMode, p1Playing, p2Playing, p3Playing, isMounted]);

  // Firestore listener for ball detection
  useEffect(() => {
    if (!isMounted) return;

    const detectionRef = doc(db, 'ball_detections', 'current');
    const unsubscribe = onSnapshot(detectionRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const detected = data.detectedBalls || [];
        setDetectedBalls(detected);
        console.log('🎯 Detection update:', detected);
      }
    }, (error) => {
      console.error('Firestore listener error:', error);
    });

    return () => unsubscribe();
  }, [isMounted]);

  // Merge detection with manual state when in Auto mode
  useEffect(() => {
    if (!isAutoMode || !isMounted) return;

    // In Auto mode: balls NOT detected = pocketed, balls detected = on table
    const allBalls = new Set(ballNumbers);
    const detectedSet = new Set(detectedBalls);
    
    // Balls that are pocketed = all balls minus detected balls
    const autoPocketed = new Set<number>();
    allBalls.forEach(ball => {
      if (!detectedSet.has(ball)) {
        autoPocketed.add(ball);
      }
    });

    setPocketedBalls(autoPocketed);
  }, [detectedBalls, isAutoMode, ballNumbers, isMounted]);

  // Winner Logic
  useEffect(() => {
    if (p1Score >= raceTo) setWinner(player1);
    else if (p2Score >= raceTo) setWinner(player2);
    else if (p3Score >= raceTo) setWinner(player3);
  }, [p1Score, p2Score, p3Score, raceTo, player1, player2, player3]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();

      // Score increments (matching pinoysgbilliards)
      // Player 1: Q (+1), A (-1)
      if (key === "q") {
        setP1Score(s => s + 1);
        return;
      }
      if (key === "a") {
        setP1Score(s => Math.max(0, s - 1));
        return;
      }

      // Player 2: W (+1), S (-1)
      if (key === "w") {
        setP2Score(s => s + 1);
        return;
      }
      if (key === "s") {
        setP2Score(s => Math.max(0, s - 1));
        return;
      }

      // Player 3: E (+1), D (-1)
      if (key === "e") {
        setP3Score(s => s + 1);
        return;
      }
      if (key === "d") {
        setP3Score(s => Math.max(0, s - 1));
        return;
      }

      // Toggle playing status: Z (p1), X (p2), C (p3)
      if (key === "z") {
        e.preventDefault();
        setP1Playing(prev => !prev);
        return;
      }
      if (key === "x") {
        e.preventDefault();
        setP2Playing(prev => !prev);
        return;
      }
      if (key === "c") {
        e.preventDefault();
        setP3Playing(prev => !prev);
        return;
      }

      // Ball toggling: Number keys 0-9 toggle balls
      // 0 = ball 10, 1-9 = balls 1-9
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        const ballNumber = e.key === "0" ? 10 : parseInt(e.key);
        if (ballNumbers.includes(ballNumber)) {
          setPocketedBalls((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(ballNumber)) {
              newSet.delete(ballNumber);
            } else {
              newSet.add(ballNumber);
            }
            return newSet;
          });
        }
        return;
      }

      // Race To: + (increment), - (decrement)
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setRaceTo(r => Math.min(50, r + 1));
        return;
      }
      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        setRaceTo(r => Math.max(1, r - 1));
        return;
      }

      // Reset balls: Delete/Backspace
      if (e.key === "Delete" || (e.key === "Backspace" && !(e.target instanceof HTMLInputElement))) {
        e.preventDefault();
        setPocketedBalls(new Set());
        return;
      }

      // Toggle Auto/Manual mode with 'm' key
      if (key === "m") {
        e.preventDefault();
        setIsAutoMode(prev => !prev);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [ballNumbers]);

  if (!isMounted) return null;

  const getPlayerStatus = (playerId: "p1" | "p2" | "p3") => {
    if (playerId === "p1") return p1Playing;
    if (playerId === "p2") return p2Playing;
    if (playerId === "p3") return p3Playing;
    return false;
  };

  const handleBallClick = (ballNumber: number) => {
    // In Auto mode, clicking a ball switches to Manual mode for that ball
    if (isAutoMode) {
      // Allow manual override even in Auto mode
      setPocketedBalls((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(ballNumber)) newSet.delete(ballNumber);
        else newSet.add(ballNumber);
        return newSet;
      });
    } else {
      // Normal manual toggle
      setPocketedBalls((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(ballNumber)) newSet.delete(ballNumber);
        else newSet.add(ballNumber);
        return newSet;
      });
    }
  };

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
          className="rounded-full shadow-lg"
        />
      </div>

      <div className="w-full max-w-[1920px] aspect-video bg-transparent relative border border-white/5">
        
        {/* Top Control Bar */}
        <div className="fixed top-[68px] sm:top-[76px] left-0 right-0 z-50 flex flex-col items-center gap-4">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-6 py-2 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border ${
              isLive
                ? "bg-red-600 border-red-500 text-white animate-pulse-live"
                : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {isLive ? "🔴 LIVE" : "GO LIVE"}
          </button>

          {!isLive && (
            <div className="flex items-center gap-3">
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
              
              {/* Auto/Manual Toggle */}
              <button
                onClick={() => setIsAutoMode(!isAutoMode)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                  isAutoMode
                    ? "bg-green-600 border-green-500 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
                title="Press 'M' to toggle"
              >
                {isAutoMode ? "🤖 AUTO" : "✋ MANUAL"}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Container - All UI elements synchronized */}
        <div className="absolute bottom-0.5 left-0 right-0 z-40 flex flex-col items-center gap-0.5">
          {/* Race To Pill */}
          <div className="flex items-center justify-center">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-6 py-0.5 flex items-center gap-3">
                <span className="text-sm font-bold text-white/70 uppercase tracking-widest">Ring Game • Race to</span>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setRaceTo(Math.max(1, raceTo - 1))}
                        className="text-white/50 hover:text-white text-lg font-bold px-2"
                    >-</button>
                    <span className="text-2xl font-black text-yellow-500">{raceTo}</span>
                    <button 
                        onClick={() => setRaceTo(Math.min(50, raceTo + 1))}
                        className="text-white/50 hover:text-white text-lg font-bold px-2"
                    >+</button>
                </div>
            </div>
        </div>

        {/* Scoreboard Footer - 3 Players */}
          <div className="w-full px-4 md:px-16">
          <div className="bg-gradient-to-r from-purple-950/90 via-purple-900/90 to-purple-950/90 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden">
             <div className="grid grid-cols-3 h-16">
                
                {/* Player 1 */}
                <div className={`relative flex flex-col items-center justify-center group border-r border-white/30 ${getPlayerStatus("p1") ? 'bg-white/5' : ''}`}>
                    <div className="flex items-center gap-4 w-full px-4">
                        <button 
                            onClick={() => setModalOpen("p1")}
                              className={`w-12 h-12 rounded-full bg-gray-700 border-2 flex items-center justify-center text-lg font-bold transition-colors overflow-hidden shrink-0 p-0 ${getPlayerStatus("p1") ? 'border-yellow-500' : 'border-white/20 hover:border-yellow-500'}`}
                        >
                            {player1.photoURL ? (
                                <img src={player1.photoURL} alt={player1.name} className="w-full h-full object-cover" />
                            ) : (
                                player1.name.charAt(0)
                            )}
                        </button>
                        <div className="flex-1 min-w-0">
                            <h2 className={`text-lg font-bold uppercase tracking-wider truncate leading-none ${getPlayerStatus("p1") ? 'text-white' : 'text-white/40'}`}>{player1.name}</h2>
                            {getPlayerStatus("p1") && (
                                <div className="text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 leading-none inline-block bg-yellow-500 text-black">
                                    PLAYING
                                </div>
                            )}
                        </div>
                        {/* Score */}
                        <div className="flex flex-col items-center shrink-0">
                            <button 
                                onClick={() => setP1Score(s => s + 1)}
                                onContextMenu={(e) => { e.preventDefault(); setP1Score(s => Math.max(0, s - 1)); }}
                                className={`text-4xl font-black leading-none hover:scale-110 transition-transform ${
                                    getPlayerStatus("p1") 
                                        ? "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]" 
                                        : "text-yellow-400/30"
                                }`}
                            >
                                {p1Score}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Player 2 */}
                <div className={`relative flex flex-col items-center justify-center group border-r border-white/30 ${getPlayerStatus("p2") ? 'bg-white/5' : ''}`}>
                    <div className="flex items-center gap-4 w-full px-4">
                        <button 
                            onClick={() => setModalOpen("p2")}
                              className={`w-12 h-12 rounded-full bg-gray-700 border-2 flex items-center justify-center text-lg font-bold transition-colors overflow-hidden shrink-0 p-0 ${getPlayerStatus("p2") ? 'border-yellow-500' : 'border-white/20 hover:border-yellow-500'}`}
                        >
                            {player2.photoURL ? (
                                <img src={player2.photoURL} alt={player2.name} className="w-full h-full object-cover" />
                            ) : (
                                player2.name.charAt(0)
                            )}
                        </button>
                        <div className="flex-1 min-w-0">
                            <h2 className={`text-lg font-bold uppercase tracking-wider truncate leading-none ${getPlayerStatus("p2") ? 'text-white' : 'text-white/40'}`}>{player2.name}</h2>
                            {getPlayerStatus("p2") && (
                                <div className="text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 leading-none inline-block bg-yellow-500 text-black">
                                    PLAYING
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-center shrink-0">
                            <button 
                                onClick={() => setP2Score(s => s + 1)}
                                onContextMenu={(e) => { e.preventDefault(); setP2Score(s => Math.max(0, s - 1)); }}
                                className={`text-4xl font-black leading-none hover:scale-110 transition-transform ${
                                    getPlayerStatus("p2") 
                                        ? "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]" 
                                        : "text-yellow-400/30"
                                }`}
                            >
                                {p2Score}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Player 3 */}
                <div className={`relative flex flex-col items-center justify-center group ${getPlayerStatus("p3") ? 'bg-white/5' : ''}`}>
                    <div className="flex items-center gap-4 w-full px-4">
                        <button 
                            onClick={() => setModalOpen("p3")}
                              className={`w-12 h-12 rounded-full bg-gray-700 border-2 flex items-center justify-center text-lg font-bold transition-colors overflow-hidden shrink-0 p-0 ${getPlayerStatus("p3") ? 'border-yellow-500' : 'border-white/20 hover:border-yellow-500'}`}
                        >
                            {player3.photoURL ? (
                                <img src={player3.photoURL} alt={player3.name} className="w-full h-full object-cover" />
                            ) : (
                                player3.name.charAt(0)
                            )}
                        </button>
                        <div className="flex-1 min-w-0">
                            <h2 className={`text-lg font-bold uppercase tracking-wider truncate leading-none ${getPlayerStatus("p3") ? 'text-white' : 'text-white/40'}`}>{player3.name}</h2>
                            {getPlayerStatus("p3") && (
                                <div className="text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 leading-none inline-block bg-yellow-500 text-black">
                                    PLAYING
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-center shrink-0">
                            <button 
                                onClick={() => setP3Score(s => s + 1)}
                                onContextMenu={(e) => { e.preventDefault(); setP3Score(s => Math.max(0, s - 1)); }}
                                className={`text-4xl font-black leading-none hover:scale-110 transition-transform ${
                                    getPlayerStatus("p3") 
                                        ? "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]" 
                                        : "text-yellow-400/30"
                                }`}
                            >
                                {p3Score}
                            </button>
                        </div>
                    </div>
                </div>

             </div>
            </div>
          </div>

          {/* Balls - Horizontal at Bottom, Below Players UI */}
          <div className="flex flex-col items-center gap-3 bg-black/40 px-4 py-0.5 rounded-2xl backdrop-blur-sm border border-white/10">
            {ballNumbers.length > 0 ? (
              <>
                {/* Detection Status Indicator */}
                {isAutoMode && (
                  <div className="text-[10px] text-green-400 font-bold mb-1">
                    {detectedBalls.length > 0 ? `🎯 ${detectedBalls.length} detected` : "⏳ Waiting..."}
                  </div>
                )}
                <div className="flex flex-row items-center justify-center gap-2 flex-wrap max-w-4xl">
                  {ballNumbers.map((ballNumber) => (
                    <BilliardsBall
                      key={ballNumber}
                      number={ballNumber}
                      isMobile={true}
                      isPocketed={pocketedBalls.has(ballNumber)}
                      onClick={() => handleBallClick(ballNumber)}
                    />
                  ))}
                  <button 
                    onClick={() => setPocketedBalls(new Set())} 
                    className="p-1 text-white/10 hover:text-white/50 transition-colors ml-2 disabled:opacity-50"
                    disabled={isAutoMode}
                    title={isAutoMode ? "Auto Mode" : "Reset"}
                  >
                    <RotateCw size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-xs text-gray-500 font-mono py-4 text-center">
                No balls
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <PlayerSelectionModal 
            isOpen={modalOpen === "p1"} 
            onClose={() => setModalOpen(null)} 
            title="Select Player 1"
            onSelect={(p) => setPlayer1({ ...p, points: p.points || 0 })}
        />
        <PlayerSelectionModal 
            isOpen={modalOpen === "p2"} 
            onClose={() => setModalOpen(null)} 
            title="Select Player 2"
            onSelect={(p) => setPlayer2({ ...p, points: p.points || 0 })}
        />
        <PlayerSelectionModal 
            isOpen={modalOpen === "p3"} 
            onClose={() => setModalOpen(null)} 
            title="Select Player 3"
            onSelect={(p) => setPlayer3({ ...p, points: p.points || 0 })}
        />
        
        <WinnerModal
            isOpen={!!winner}
            onClose={() => {
                setWinner(null);
                setP1Score(0); setP2Score(0); setP3Score(0);
            }}
            winner={winner}
            player1Score={p1Score}
            player2Score={p2Score}
            player3Score={p3Score}
            player1Name={player1.name}
            player2Name={player2.name}
            player3Name={player3.name}
        />

      </div>
    </div>
  );
};

export default RingGamePage;

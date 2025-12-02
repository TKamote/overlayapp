"use client";

import Link from "next/link";
import Image from "next/image";
import { Settings, Info, ArrowRight, Users, Coins } from "lucide-react";

export default function Home() {
  const handlePayPalDonation = (amount: number) => {
    // Opens PayPal.me link - replace YOUR_USERNAME with actual PayPal username
    window.open(`https://paypal.me/YOUR_USERNAME/${amount}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Pinoy SG Billiards</h1>
          <p className="text-zinc-400">Professional Billiards Scoreboard System</p>
        </div>

        <div className="grid gap-3">
          {/* Live Match */}
          <Link 
            href="/match"
            className="group flex items-center gap-4 p-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-yellow-500/50 rounded-xl transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-yellow-500 text-black flex items-center justify-center gap-0.5 shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform overflow-hidden">
              <Image 
                src="/ballicons/ball-9.png" 
                alt="9" 
                width={20} 
                height={20} 
                className="object-contain"
              />
              <Image 
                src="/ballicons/ball-10.png" 
                alt="10" 
                width={20} 
                height={20} 
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg group-hover:text-yellow-500 transition-colors">Live Match</h3>
              <p className="text-sm text-zinc-500">Scoreboard and Overlay</p>
            </div>
            <ArrowRight className="text-zinc-700 group-hover:text-yellow-500 transition-colors" />
          </Link>

          {/* Ring Game */}
          <Link 
            href="/ring"
            className="group flex items-center gap-4 p-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 rounded-xl transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
              <Coins size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg group-hover:text-purple-500 transition-colors">Ring Game</h3>
              <p className="text-sm text-zinc-500">3-Player Game</p>
            </div>
            <ArrowRight className="text-zinc-700 group-hover:text-purple-500 transition-colors" />
          </Link>

          {/* Players */}
          <Link 
            href="/players"
            className="group flex items-center gap-4 p-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 rounded-xl transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg group-hover:text-blue-500 transition-colors">Players</h3>
              <p className="text-sm text-zinc-500">Roster & Rankings</p>
            </div>
            <ArrowRight className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
          </Link>

          {/* Settings (Disabled) */}
          <button className="group flex items-center gap-4 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl opacity-50 cursor-not-allowed">
            <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center">
              <Settings size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-zinc-500">Settings</h3>
              <p className="text-sm text-zinc-600">Coming Soon</p>
            </div>
          </button>

          {/* Credits */}
          <Link
            href="/credits"
            className="group flex items-center gap-4 p-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-green-500/50 rounded-xl transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
              <Info size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg group-hover:text-green-500 transition-colors">Credits</h3>
              <p className="text-sm text-zinc-500">Attributions & Licenses</p>
            </div>
            <ArrowRight className="text-zinc-700 group-hover:text-green-500 transition-colors" />
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-zinc-600 pt-8">
          <Info size={12} />
          <span>v2.0.0 • Clean Build</span>
        </div>
      </div>

      {/* Donation Section - Right Side Vertical (overlay, does not affect layout) */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex">
        <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl px-[5px] py-4 flex flex-col items-stretch gap-3 w-[134px]">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Support Us</h3>
          
          {/* PayPal Donation Buttons - Vertical */}
          <div className="flex flex-col gap-2 w-full items-center">
            <button
              onClick={() => handlePayPalDonation(5)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-[3px] py-2 rounded-lg text-sm font-bold transition-colors w-[80%]"
            >
              PayPal $5
            </button>
            <button
              onClick={() => handlePayPalDonation(10)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-[3px] py-2 rounded-lg text-sm font-bold transition-colors w-[80%]"
            >
              PayPal $10
            </button>
            <button
              onClick={() => handlePayPalDonation(50)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-[3px] py-2 rounded-lg text-sm font-bold transition-colors w-[80%]"
            >
              PayPal $50
            </button>
          </div>

          {/* Social Media Links - Below PayPal */}
          <div className="flex items-center gap-4 pt-2 border-t border-zinc-800">
            <a
              href="https://www.facebook.com/kamote.nga.71"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-blue-500 transition-colors"
              aria-label="Facebook"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://x.com/TKamot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
              aria-label="X (Twitter)"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

    </main>
  );
}

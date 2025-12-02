"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function CreditsPage() {
  const attributions = [
    {
      icon: "Ball One",
      url: "https://www.flaticon.com/free-icons/ball-one",
      title: "ball one icons",
      author: "Boris farias",
      authorUrl: "https://www.flaticon.com/authors/boris-farias",
      image: "/ballicons/ball-1.png",
    },
    {
      icon: "Ball Two",
      url: "https://www.flaticon.com/free-icons/ball-two",
      title: "ball two icons",
      author: "Boris farias",
      authorUrl: "https://www.flaticon.com/authors/boris-farias",
      image: "/ballicons/ball-2.png",
    },
    {
      icon: "Ball Three",
      url: "https://www.flaticon.com/free-icons/ball-three",
      title: "ball three icons",
      author: "Boris farias",
      authorUrl: "https://www.flaticon.com/authors/boris-farias",
      image: "/ballicons/ball-3.png",
    },
    {
      icon: "Ball Four",
      url: "https://www.flaticon.com/free-icons/ball-four",
      title: "ball four icons",
      author: "Boris farias",
      authorUrl: "https://www.flaticon.com/authors/boris-farias",
      image: "/ballicons/ball-4.png",
    },
    {
      icon: "Ball Five",
      url: "https://www.flaticon.com/free-icons/ball-five",
      title: "ball five icons",
      author: "Boris farias",
      authorUrl: "https://www.flaticon.com/authors/boris-farias",
      image: "/ballicons/ball-5.png",
    },
    {
      icon: "Ball Six",
      url: "https://www.flaticon.com/free-icons/ball-six",
      title: "ball six icons",
      author: "Boris farias",
      authorUrl: "https://www.flaticon.com/authors/boris-farias",
      image: "/ballicons/ball-6.png",
    },
    {
      icon: "Ball Seven",
      url: "https://www.flaticon.com/free-icons/ball-seven",
      title: "ball seven icons",
      author: "Boris farias",
      authorUrl: "https://www.flaticon.com/authors/boris-farias",
      image: "/ballicons/ball-7.png",
    },
    {
      icon: "Ball Eight",
      url: "https://www.flaticon.com/free-icons/ball-eight",
      title: "ball eight icons",
      author: "Boris farias",
      authorUrl: "https://www.flaticon.com/authors/boris-farias",
      image: "/ballicons/ball-8.png",
    },
    {
      icon: "Ball Nine",
      url: "https://www.flaticon.com/free-icons/ball-nine",
      title: "ball nine icons",
      author: "Boris farias",
      authorUrl: "https://www.flaticon.com/authors/boris-farias",
      image: "/ballicons/ball-9.png",
    },
    {
      icon: "Ball Ten",
      url: "https://www.flaticon.com/free-icons/ball-ten",
      title: "ball ten icons",
      author: "Boris farias",
      authorUrl: "https://www.flaticon.com/authors/boris-farias",
      image: "/ballicons/ball-10.png",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex items-center gap-4">
        <Link href="/" className="p-2 bg-zinc-900 rounded-full shadow hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="text-zinc-400 hover:text-white" />
        </Link>
        <h1 className="text-3xl font-bold text-white">Credits & Attributions</h1>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl text-blue-200">
          <p>Icons used throughout this application are provided by <a href="https://www.flaticon.com" className="underline hover:text-white">Flaticon</a>.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attributions.map((attr, index) => (
            <div key={index} className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all group">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-zinc-950 flex items-center justify-center mb-4 p-4 shadow-inner border border-zinc-800">
                  <img
                    src={attr.image}
                    alt={attr.icon}
                    className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold text-white">{attr.icon}</h3>
              </div>

              <div className="space-y-3 text-sm text-zinc-400">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span>Author</span>
                  <a 
                    href={attr.authorUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    {attr.author} <ExternalLink size={12} />
                  </a>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span>Source</span>
                  <a 
                    href={attr.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-white flex items-center gap-1"
                  >
                    View on Flaticon <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


import { useState, useRef, useEffect } from "react";
import { X, UserPlus, UserCog, Camera } from "lucide-react";

interface Player {
  id: string;
  name: string;
  points: number;
  photoURL: string | null;
}

interface PlayerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, points: number, photoURL: string | null) => void;
  initialData?: Player | null;
}

const PlayerFormModal = ({ isOpen, onClose, onSave, initialData }: PlayerFormModalProps) => {
  const [name, setName] = useState("");
  const [points, setPoints] = useState("500");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset or Pre-fill form when modal opens/changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setPoints(initialData.points.toString());
        setPhotoPreview(initialData.photoURL);
      } else {
        setName("");
        setPoints("500");
        setPhotoPreview(null);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name, parseInt(points) || 0, photoPreview);
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isEditMode = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {isEditMode ? (
              <>
                <UserCog size={20} className="text-yellow-500" />
                Edit Player
              </>
            ) : (
              <>
                <UserPlus size={20} className="text-blue-500" />
                Add New Player
              </>
            )}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Photo Placeholder */}
          <div className="flex justify-center mb-6">
            <div 
              className="relative w-24 h-24 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-colors cursor-pointer overflow-hidden group"
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <>
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                </>
              ) : (
                <>
                  <Camera size={24} />
                  <span className="text-xs mt-1 font-bold">Add Photo</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Player Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Efren Reyes"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Fargo Rating / Points</label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 font-bold rounded-xl transition-colors shadow-lg ${
                isEditMode 
                  ? "bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/20" 
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
              }`}
            >
              {isEditMode ? "Save Changes" : "Create Player"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default PlayerFormModal;

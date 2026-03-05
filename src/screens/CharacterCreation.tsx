import { motion } from "motion/react";
import { Button } from "../components/Button";
import { useState, FormEvent } from "react";
import { PlayerProfile } from "../types";
import { User, MapPin, ScrollText, ArrowLeft } from "lucide-react";
import { VoiceInput } from "../components/VoiceInput";

interface CharacterCreationProps {
  onComplete: (profile: Omit<PlayerProfile, 'id' | 'photo'>) => void;
  onBack: () => void;
}

export function CharacterCreation({ onComplete, onBack }: CharacterCreationProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [background, setBackground] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name && location && background) {
      onComplete({ name, location, background });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-2xl mx-auto">
      <div className="w-full flex justify-start mb-4">
        <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl backdrop-blur-sm shadow-2xl"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
          Criação de Personagem
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-mono text-zinc-400 uppercase tracking-wider">
              <User className="w-4 h-4 text-cyan-500" />
              Nome do Personagem
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Neo, Arthur, Elena..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-mono text-zinc-400 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-purple-500" />
              Local de Origem
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Neo-Tokyo, Vila de Kakariko, São Paulo..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm font-mono text-zinc-400 uppercase tracking-wider">
                <ScrollText className="w-4 h-4 text-emerald-500" />
                Histórico / Background
              </label>
              <VoiceInput onTranscript={(t) => setBackground(prev => prev + " " + t)} />
            </div>
            <textarea
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="Ex: Um ex-hacker procurado pelo governo... / Um ferreiro humilde que sonha em ser cavaleiro..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all h-32 resize-none"
              required
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button size="lg" disabled={!name || !location || !background}>
              Confirmar Identidade
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

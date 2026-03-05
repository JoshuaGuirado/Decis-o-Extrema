import { motion } from "motion/react";
import { StoryLength } from "../types";
import { Clock, Hourglass, Infinity, ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../components/Button";

interface LengthSelectionProps {
  onSelect: (length: StoryLength) => void;
  onBack: () => void;
}

const lengths: { id: StoryLength; label: string; turns: number; icon: ReactNode; desc: string; color: string }[] = [
  {
    id: "Curta",
    label: "História Curta",
    turns: 5,
    icon: <Clock className="w-8 h-8" />,
    desc: "Uma experiência rápida e intensa. (5 Turnos)",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "Média",
    label: "História Média",
    turns: 10,
    icon: <Hourglass className="w-8 h-8" />,
    desc: "O equilíbrio ideal entre narrativa e estratégia. (10 Turnos)",
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "Longa",
    label: "História Longa",
    turns: 20,
    icon: <Infinity className="w-8 h-8" />,
    desc: "Uma saga épica com profundidade e reviravoltas. (20 Turnos)",
    color: "from-purple-500 to-fuchsia-500",
  },
];

export function LengthSelection({ onSelect, onBack }: LengthSelectionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-5xl mx-auto">
      <div className="w-full flex justify-start mb-4">
        <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
      </div>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-500"
      >
        Duração da Jornada
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {lengths.map((len, index) => (
          <motion.div
            key={len.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(len.id)}
            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 cursor-pointer hover:border-zinc-600 transition-all duration-300 backdrop-blur-sm overflow-hidden flex flex-col items-center text-center"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${len.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            
            <div className={`p-4 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-100 group-hover:text-white group-hover:border-white/20 transition-colors mb-6 relative z-10`}>
              {len.icon}
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-zinc-100 group-hover:text-white transition-colors relative z-10">
              {len.label}
            </h3>
            
            <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 relative z-10">
              {len.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

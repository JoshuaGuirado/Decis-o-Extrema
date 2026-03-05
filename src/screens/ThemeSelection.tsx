import { motion } from "motion/react";
import { Theme } from "../types";
import { 
  Cpu, Sword, Building2, Skull, Landmark, Compass, Rocket, 
  Factory, Mountain, Scroll, Shield, Snowflake, Radio, 
  Zap, Cog, ArrowLeft 
} from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../components/Button";

interface ThemeSelectionProps {
  onSelect: (theme: Theme) => void;
  onBack: () => void;
}

const themes: { id: Theme; label: string; icon: ReactNode; desc: string; color: string }[] = [
  {
    id: "Contemporâneo",
    label: "Hoje em Dia",
    icon: <Building2 className="w-6 h-6" />,
    desc: "O mundo real como conhecemos.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "Medieval",
    label: "Era Medieval",
    icon: <Sword className="w-6 h-6" />,
    desc: "Reinos, guerras e sobrevivência.",
    color: "from-amber-600 to-red-600",
  },
  {
    id: "Cyberpunk",
    label: "Cyberpunk 2077",
    icon: <Cpu className="w-6 h-6" />,
    desc: "Alta tecnologia, baixa qualidade de vida.",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "Apocalíptico",
    label: "Pós-Apocalipse",
    icon: <Skull className="w-6 h-6" />,
    desc: "Sobrevivência em um mundo devastado.",
    color: "from-stone-500 to-zinc-700",
  },
  {
    id: "Roma Antiga",
    label: "Império Romano",
    icon: <Landmark className="w-6 h-6" />,
    desc: "Glória, política e conquistas.",
    color: "from-red-700 to-orange-600",
  },
  {
    id: "Velho Oeste",
    label: "Velho Oeste",
    icon: <Compass className="w-6 h-6" />,
    desc: "A fronteira sem lei.",
    color: "from-orange-700 to-yellow-600",
  },
  {
    id: "Colonização de Marte",
    label: "Marte 2050",
    icon: <Rocket className="w-6 h-6" />,
    desc: "A nova fronteira da humanidade.",
    color: "from-red-500 to-orange-500",
  },
  {
    id: "Era Vitoriana",
    label: "Era Vitoriana",
    icon: <Scroll className="w-6 h-6" />,
    desc: "Elegância e mistério em Londres.",
    color: "from-slate-600 to-slate-800",
  },
  {
    id: "Japão Feudal",
    label: "Japão Feudal",
    icon: <Sword className="w-6 h-6" />,
    desc: "Honra, samurais e shoguns.",
    color: "from-red-500 to-pink-500",
  },
  {
    id: "Pré-História",
    label: "Pré-História",
    icon: <Mountain className="w-6 h-6" />,
    desc: "Sobrevivência primitiva.",
    color: "from-green-700 to-emerald-800",
  },
  {
    id: "Revolução Industrial",
    label: "Rev. Industrial",
    icon: <Factory className="w-6 h-6" />,
    desc: "Máquinas, fumaça e progresso.",
    color: "from-gray-600 to-gray-800",
  },
  {
    id: "Egito Antigo",
    label: "Egito Antigo",
    icon: <Landmark className="w-6 h-6" />,
    desc: "Faraós, pirâmides e deuses.",
    color: "from-yellow-500 to-amber-600",
  },
  {
    id: "Grécia Antiga",
    label: "Grécia Antiga",
    icon: <Landmark className="w-6 h-6" />,
    desc: "Filosofia, democracia e mitos.",
    color: "from-blue-400 to-cyan-600",
  },
  {
    id: "Era Viking",
    label: "Era Viking",
    icon: <Shield className="w-6 h-6" />,
    desc: "Navegação, saques e Valhalla.",
    color: "from-slate-500 to-blue-800",
  },
  {
    id: "Guerra Fria",
    label: "Guerra Fria",
    icon: <Radio className="w-6 h-6" />,
    desc: "Espionagem e tensão nuclear.",
    color: "from-red-600 to-blue-600",
  },
  {
    id: "Futuro Utópico",
    label: "Futuro Utópico",
    icon: <Zap className="w-6 h-6" />,
    desc: "Harmonia, tecnologia e paz.",
    color: "from-cyan-400 to-emerald-400",
  },
  {
    id: "Steampunk",
    label: "Steampunk",
    icon: <Cog className="w-6 h-6" />,
    desc: "Vapor, engrenagens e aventura.",
    color: "from-amber-700 to-orange-800",
  },
];

export function ThemeSelection({ onSelect, onBack }: ThemeSelectionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-7xl mx-auto">
      <div className="w-full flex justify-start mb-4">
        <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-500"
      >
        Escolha sua Era
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {themes.map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(theme.id)}
            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 cursor-pointer hover:border-zinc-600 transition-all duration-300 backdrop-blur-sm overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className={`p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 group-hover:text-white group-hover:border-white/20 transition-colors shrink-0`}>
                {theme.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
                  {theme.label}
                </h3>
                <p className="text-zinc-400 text-xs leading-tight group-hover:text-zinc-300 mt-1">
                  {theme.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

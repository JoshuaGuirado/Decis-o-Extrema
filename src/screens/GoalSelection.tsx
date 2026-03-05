import { motion } from "motion/react";
import { ReactNode } from "react";
import { Goal } from "../types";
import { DollarSign, Star, Shield, Heart, Globe, Cross, Map, Sword, Infinity, Sparkles, Handshake, Flame, Skull, Rocket, ArrowLeft } from "lucide-react";
import { Button } from "../components/Button";

interface GoalSelectionProps {
  onSelect: (goal: Goal) => void;
  onBack: () => void;
}

const goals: { id: Goal; label: string; icon: ReactNode; desc: string; tooltip: string }[] = [
  {
    id: "Milionário",
    label: "Ficar Milionário",
    icon: <DollarSign className="w-6 h-6 text-emerald-400" />,
    desc: "Acumular riqueza extrema a qualquer custo.",
    tooltip: "Foque em negócios, investimentos e poder financeiro. O dinheiro abre portas, mas pode fechar corações.",
  },
  {
    id: "Referência",
    label: "Ser Referência",
    icon: <Star className="w-6 h-6 text-amber-400" />,
    desc: "Tornar-se uma autoridade mundial na sua área.",
    tooltip: "Busque conhecimento, fama e reconhecimento. Seu nome será lembrado por gerações.",
  },
  {
    id: "Estabilidade",
    label: "Ter Estabilidade",
    icon: <Shield className="w-6 h-6 text-blue-400" />,
    desc: "Uma vida segura, confortável e sem riscos.",
    tooltip: "Priorize segurança, saúde e paz de espírito. Uma vida longa e tranquila, longe do caos.",
  },
  {
    id: "Propósito",
    label: "Viver com Propósito",
    icon: <Heart className="w-6 h-6 text-rose-400" />,
    desc: "Impactar o mundo positivamente, acima de tudo.",
    tooltip: "Dedique-se a causas maiores que você. O legado moral é sua verdadeira riqueza.",
  },
  {
    id: "Dominar o Mundo",
    label: "Dominar o Mundo",
    icon: <Globe className="w-6 h-6 text-purple-500" />,
    desc: "Controle absoluto sobre nações e povos.",
    tooltip: "Use estratégia, força e manipulação. O poder supremo exige sacrifícios supremos.",
  },
  {
    id: "Salvar a Humanidade",
    label: "Salvar a Humanidade",
    icon: <Cross className="w-6 h-6 text-cyan-400" />,
    desc: "Evitar a extinção e garantir o futuro da espécie.",
    tooltip: "Enfrente ameaças existenciais e busque soluções impossíveis. Você é a última esperança.",
  },
  {
    id: "Explorar o Desconhecido",
    label: "Explorar o Desconhecido",
    icon: <Map className="w-6 h-6 text-indigo-400" />,
    desc: "Ir aonde ninguém jamais foi.",
    tooltip: "Desbrave fronteiras, descubra segredos e expanda os horizontes do conhecimento humano.",
  },
  {
    id: "Vingança",
    label: "Vingança",
    icon: <Sword className="w-6 h-6 text-red-600" />,
    desc: "Fazer aqueles que te feriram pagarem.",
    tooltip: "Uma jornada sombria de retribuição. A justiça será feita pelas suas próprias mãos.",
  },
  {
    id: "Imortalidade",
    label: "Imortalidade",
    icon: <Infinity className="w-6 h-6 text-teal-400" />,
    desc: "Vencer a morte e viver para sempre.",
    tooltip: "Busque tecnologias proibidas ou segredos místicos. O tempo não será mais seu inimigo.",
  },
  {
    id: "Líder Espiritual",
    label: "Líder Espiritual",
    icon: <Sparkles className="w-6 h-6 text-yellow-200" />,
    desc: "Guiar as almas para a iluminação.",
    tooltip: "Inspire fé, crie dogmas e molde o espírito da humanidade. Sua palavra será lei divina.",
  },
    {
    id: "Paz Mundial",
    label: "Paz Mundial",
    icon: <Handshake className="w-6 h-6 text-green-400" />,
    desc: "Acabar com todos os conflitos e guerras.",
    tooltip: "Una nações através da diplomacia ou da força. A harmonia global é seu único objetivo.",
  },
  {
    id: "Anarquia Total",
    label: "Anarquia Total",
    icon: <Flame className="w-6 h-6 text-orange-500" />,
    desc: "Derrubar todos os governos e sistemas.",
    tooltip: "O caos é a única liberdade verdadeira. Queime as instituições e deixe o mundo arder.",
  },
  {
    id: "Descobrir a Cura da Morte",
    label: "Cura da Morte",
    icon: <Skull className="w-6 h-6 text-gray-400" />,
    desc: "Erradicar a mortalidade biológica.",
    tooltip: "A ciência ou a magia podem vencer o fim. Ninguém mais precisará dizer adeus.",
  },
  {
    id: "Fundar um Império Galáctico",
    label: "Império Galáctico",
    icon: <Rocket className="w-6 h-6 text-fuchsia-500" />,
    desc: "Expandir a civilização para as estrelas.",
    tooltip: "A Terra é pequena demais. O universo inteiro aguarda sua conquista.",
  },
];

export function GoalSelection({ onSelect, onBack }: GoalSelectionProps) {
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
        className="text-3xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-500"
      >
        Escolha seu Objetivo Final
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(goal.id)}
            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 cursor-pointer hover:border-cyan-500/50 hover:bg-zinc-800/50 transition-all duration-300 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 group-hover:border-cyan-500/30 transition-colors shrink-0">
                {goal.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1 text-zinc-100 group-hover:text-cyan-400 transition-colors">
                  {goal.label}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                  {goal.desc}
                </p>
                
                {/* Tooltip-like description that appears on hover/focus */}
                <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <p className="text-xs text-cyan-200/80 italic border-l-2 border-cyan-500/30 pl-2 mt-2">
                        "{goal.tooltip}"
                    </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

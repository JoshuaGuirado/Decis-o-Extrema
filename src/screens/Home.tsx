import { motion } from "motion/react";
import { Button } from "../components/Button";

interface HomeProps {
  onStart: () => void;
}

export function Home({ onStart }: HomeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 glow-text mb-4">
          DECISÃO
          <br />
          EXTREMA
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl font-mono max-w-md mx-auto">
          Simulador Estratégico de Vida
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Button onClick={onStart} size="lg" className="text-lg font-bold">
          Começar Simulação
        </Button>
      </motion.div>

      <div className="absolute bottom-8 text-xs text-zinc-600 font-mono">
        POWERED BY GEMINI AI
      </div>
    </div>
  );
}

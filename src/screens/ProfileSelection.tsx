import { motion } from "motion/react";
import { Button } from "../components/Button";
import { PlayerProfile } from "../types";
import { UserPlus, User, Trash2, Crown, Users, Play } from "lucide-react";

interface ProfileSelectionProps {
  profiles: PlayerProfile[];
  mainProfileId: string | null;
  companionIds: string[];
  onSetMain: (id: string) => void;
  onToggleCompanion: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onStart: () => void;
}

export function ProfileSelection({ 
  profiles, 
  mainProfileId, 
  companionIds, 
  onSetMain, 
  onToggleCompanion, 
  onCreate, 
  onDelete,
  onStart
}: ProfileSelectionProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
            MONTE SUA EQUIPE
          </h2>
          <p className="text-zinc-400 font-mono uppercase tracking-widest">
            ESCOLHA O PROTAGONISTA E SEUS COMPANHEIROS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {profiles.map((profile) => {
            const isMain = profile.id === mainProfileId;
            const isCompanion = companionIds.includes(profile.id);

            return (
              <motion.div
                key={profile.id}
                whileHover={{ scale: 1.02 }}
                className={`bg-zinc-900 border p-6 rounded-2xl flex items-center gap-6 group relative overflow-hidden transition-colors ${
                  isMain ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 
                  isCompanion ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 
                  'border-zinc-800'
                }`}
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${
                  isMain ? 'bg-cyan-500' : 
                  isCompanion ? 'bg-purple-500' : 
                  'bg-zinc-700'
                }`} />
                
                <div className={`w-20 h-20 rounded-full overflow-hidden bg-zinc-800 border-2 flex-shrink-0 ${
                  isMain ? 'border-cyan-500' : 
                  isCompanion ? 'border-purple-500' : 
                  'border-zinc-700'
                }`}>
                  {profile.photo ? (
                    <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-zinc-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white truncate flex items-center gap-2">
                    {profile.name}
                    {isMain && <Crown className="w-4 h-4 text-cyan-400" />}
                    {isCompanion && <Users className="w-4 h-4 text-purple-400" />}
                  </h3>
                  <p className="text-zinc-400 text-sm truncate">{profile.location}</p>
                  <p className="text-zinc-500 text-xs mt-1 line-clamp-1 italic">"{profile.background}"</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => onSetMain(profile.id)}
                    variant={isMain ? "primary" : "outline"}
                    className={isMain ? "bg-cyan-600 hover:bg-cyan-500" : "border-zinc-700 hover:border-cyan-500 hover:text-cyan-400"}
                    title="Definir como Protagonista"
                  >
                    <Crown className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => onToggleCompanion(profile.id)}
                    variant={isCompanion ? "primary" : "outline"}
                    className={isCompanion ? "bg-purple-600 hover:bg-purple-500" : "border-zinc-700 hover:border-purple-500 hover:text-purple-400"}
                    disabled={isMain}
                    title="Adicionar/Remover Companheiro"
                  >
                    <Users className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onDelete(profile.id)}
                    className="border-zinc-800 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50"
                    title="Excluir Personagem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={onCreate}
            className="border-2 border-dashed border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all text-zinc-500 hover:text-cyan-400 min-h-[140px]"
          >
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <span className="font-bold uppercase tracking-wider text-sm">Criar Novo Personagem</span>
          </motion.button>
        </div>

        <div className="flex justify-center border-t border-zinc-800 pt-8">
          <Button 
            size="lg" 
            onClick={onStart}
            disabled={!mainProfileId}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-4 text-lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Iniciar Jornada
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

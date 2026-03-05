import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Button } from "../components/Button";
import { Upload, User, ArrowLeft } from "lucide-react";

interface PhotoUploadProps {
  onComplete: (photoBase64: string | null) => void;
  onBack: () => void;
  characterName: string;
}

export function PhotoUpload({ onComplete, onBack, characterName }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    onComplete(preview);
  };

  const handleSkip = () => {
    onComplete(null);
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
        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm"
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-zinc-100">
          Aparência de {characterName}
        </h2>
        <p className="text-zinc-400 text-center mb-8">
          Envie uma foto de {characterName} para que as imagens da história sejam baseadas nela(e). (Opcional)
        </p>

        <div className="flex flex-col items-center gap-6">
          <div 
            className="w-48 h-48 rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-950 flex items-center justify-center overflow-hidden cursor-pointer hover:border-cyan-500/50 transition-colors relative group"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-medium">Trocar Foto</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-zinc-500 group-hover:text-cyan-400 transition-colors">
                <User className="w-12 h-12 mb-2" />
                <span className="text-sm">Clique para enviar</span>
              </div>
            )}
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />

          <div className="flex gap-4 w-full mt-4">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleSkip}
            >
              {preview ? "Remover Foto" : "Pular"}
            </Button>
            <Button 
              variant="primary" 
              className="flex-1" 
              onClick={handleContinue}
              disabled={!preview}
            >
              Continuar
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

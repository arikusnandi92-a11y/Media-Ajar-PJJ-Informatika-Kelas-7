import { useState, useEffect } from 'react';
import { UserData } from '../types';

export const gamificationSteps = [
  'Beranda', // 0
  'Presensi', // 1
  'Diagnostik', // 2
  'Tujuan', // 3
  'Apersepsi', // 4
  'Materi 1: Pengenalan', // 5
  'Materi 2: Bagian Spreadsheet', // 6
  'Simulasi', // 7
  'Belajar Rumus', // 8
  'Tantangan Level 1', // 9
  'Tantangan Level 2', // 10
  'Game 1: Drag & Drop', // 11
  'Game 2: Teka Teki Silang', // 12
  'Game 3: Puzzle Rumus', // 13
  'Pembelajaran Mendalam', // 14
  'Kuis Akhir', // 15
  'Proyek Mini', // 16
  'Refleksi', // 17
  'Hasil Belajar', // 18
];

interface NavigationProps {
  currentStep: number;
  setStep: (step: number) => void;
  currentUser: UserData | null;
}

export function Navigation({ currentStep, setStep, currentUser }: NavigationProps) {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    setShowNotice(false);
  }, [currentStep]);

  const isQuizUnfinished = currentStep === 15 && currentUser && !currentUser.isQuizFinished;

  const handleNext = () => {
    if (isQuizUnfinished) {
      setShowNotice(true);
      setTimeout(() => setShowNotice(false), 3000);
      return;
    }
    setStep(Math.min(18, currentStep + 1));
  };

  return (
    <>
      {showNotice && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-100 text-amber-800 px-6 py-4 rounded-2xl shadow-2xl border-2 border-amber-300 z-[110] font-bold text-center w-[90%] max-w-sm animate-bounce">
          ⚠️ Mohon selesaikan dan lihat hasil kuis terlebih dahulu sebelum melanjutkan!
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-8 flex justify-between items-center z-[100] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:relative md:bottom-auto md:shadow-none md:border-t-0 md:bg-transparent md:p-0 md:pb-0 mt-8">
        <button
          onClick={() => setStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-6 py-3 rounded-xl font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Kembali
        </button>
        
        <div className="hidden md:flex text-sm text-slate-500 font-medium">
          Langkah {currentStep} dari 18
        </div>
        
        <button
          onClick={handleNext}
          disabled={currentStep === 18 || (!currentUser && currentStep > 0)}
          className={`px-6 py-3 rounded-xl font-medium text-white transition-colors shadow-sm ${
            isQuizUnfinished 
              ? 'bg-slate-400 hover:bg-slate-500' 
              : 'bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {isQuizUnfinished ? '🔒 Terkunci' : 'Lanjut'}
        </button>
      </nav>
    </>
  );
}

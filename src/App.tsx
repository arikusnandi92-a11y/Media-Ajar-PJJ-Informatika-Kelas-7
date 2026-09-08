import { useState, useEffect } from 'react';
import { useStore } from './store';
import { AppMode } from './types';
import { gamificationSteps, Navigation } from './components/Navigation';
import { TeacherDashboard } from './components/TeacherDashboard';
import { Award, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import Steps
import { Home, Presensi, Diagnostik, Tujuan, Apersepsi } from './components/steps/IntroSteps';
import { Materi1, Materi2, Simulasi, Rumus } from './components/steps/MateriSteps';
import { Tantangan1, Tantangan2 } from './components/steps/ChallengeSteps';
import { DeepLearning } from './components/steps/DeepLearning';
import { Kuis } from './components/steps/Kuis';
import { DragDropGame, TekaTekiSilang, PuzzleRumus } from './components/steps/GameSteps';
import { Proyek, Refleksi, Hasil } from './components/steps/OutroSteps';

  export default function App() {
    const { users, currentUser, saveUser, deleteUser, markStepComplete } = useStore();
    const [mode, setMode] = useState<AppMode>('student');
  const [step, setStep] = useState(0);
  
  // Update progress automatically
  useEffect(() => {
    if (currentUser && step > 0) {
      markStepComplete(step);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const renderStep = () => {
    switch(step) {
      case 0: return <Home setStep={setStep} />;
      case 1: return <Presensi setStep={setStep} saveUser={saveUser} users={users} />;
      case 2: return <Diagnostik setStep={setStep} currentUser={currentUser} saveUser={saveUser} />;
      case 3: return <Tujuan setStep={setStep} />;
      case 4: return <Apersepsi setStep={setStep} currentUser={currentUser} saveUser={saveUser} />;
      case 5: return <Materi1 />;
      case 6: return <Materi2 />;
      case 7: return <Simulasi />;
      case 8: return <Rumus />;
      case 9: return <Tantangan1 currentUser={currentUser} saveUser={saveUser} />;
      case 10: return <Tantangan2 currentUser={currentUser} saveUser={saveUser} />;
      case 11: return <DragDropGame currentUser={currentUser} saveUser={saveUser} />;
      case 12: return <TekaTekiSilang currentUser={currentUser} saveUser={saveUser} />;
      case 13: return <PuzzleRumus currentUser={currentUser} saveUser={saveUser} />;
      case 14: return <DeepLearning />;
      case 15: return <Kuis currentUser={currentUser} saveUser={saveUser} />;
      case 16: return <Proyek currentUser={currentUser} saveUser={saveUser} />;
      case 17: return <Refleksi currentUser={currentUser} saveUser={saveUser} setStep={setStep} />;
      case 18: return <Hasil currentUser={currentUser} />;
      default: return <Home setStep={setStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 pb-28 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="https://cdn.phototourl.com/free/2026-06-07-a94dc15a-d9dd-4a9e-8434-63f26157ee0a.png" alt="Logo" className="w-10 h-10 object-contain rounded-lg" referrerPolicy="no-referrer" />
          <div>
            <h1 className="font-bold text-slate-800 leading-tight hidden sm:block">Informatika BDR</h1>
            <h1 className="font-bold text-slate-800 leading-tight sm:hidden">Info BDR</h1>
            <p className="text-xs text-emerald-600 font-medium">SMPN 1 Saketi</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser && mode === 'student' && (
            <div className="flex items-center gap-4 mr-4">
              <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-500 font-medium">Progress</p>
                <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{width: `${currentUser.progress}%`}}></div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full font-bold text-sm border border-amber-200">
                <Award size={16} /> {currentUser.points}
              </div>
            </div>
          )}

          <button 
            onClick={() => setMode(mode === 'student' ? 'teacher' : 'student')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === 'teacher' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LayoutDashboard size={16} />
            <span className="hidden sm:inline">{mode === 'student' ? 'Panel Guru' : 'Kembali ke Siswa'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        <AnimatePresence mode="wait">
          {mode === 'teacher' ? (
            <motion.div key="teacher" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TeacherDashboard users={users} saveUser={saveUser} deleteUser={deleteUser} />
            </motion.div>
          ) : (
            <motion.div key="student" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
              {renderStep()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation (Only in student mode, and not on home page if they haven't started) */}
      {mode === 'student' && (step > 0 || currentUser) && step <= 17 && (
        <Navigation currentStep={step} setStep={setStep} currentUser={currentUser} />
      )}
    </div>
  );
}

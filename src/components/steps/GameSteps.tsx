import React, { useState, useEffect } from 'react';
import { UserData } from '../../types';
import { Gamepad2, MousePointerClick, Type, Puzzle, Trophy, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- GAME 1: MATCHING (DRAG & DROP ALTERNATIVE FOR MOBILE) ---
export function DragDropGame({ currentUser, saveUser }: { currentUser: UserData | null, saveUser: (u: UserData) => void }) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);

  const terms = [
    { id: 't1', text: 'Kolom' },
    { id: 't2', text: 'Baris' },
    { id: 't3', text: 'Range' },
    { id: 't4', text: 'AVERAGE' }
  ];

  const defs = [
    { id: 'd2', text: 'Deretan horizontal (angka)' },
    { id: 'd4', text: 'Mencari nilai rata-rata' },
    { id: 'd1', text: 'Deretan vertikal (huruf)' },
    { id: 'd3', text: 'Kumpulan beberapa sel' }
  ];

  const handleDefClick = (defId: string) => {
    if (!selectedTerm) return;
    
    // Check if correct match (e.g. t1 matches d1)
    const expectedId = 'd' + selectedTerm.replace('t', '');
    if (defId === expectedId) {
      const newMatches = { ...matches, [selectedTerm]: defId };
      setMatches(newMatches);
      setSelectedTerm(null);
      
      if (Object.keys(newMatches).length === terms.length) {
        setCompleted(true);
        if (currentUser && !currentUser.completedSteps.includes(11)) {
          saveUser({ ...currentUser, points: currentUser.points + 30 });
        }
      }
    } else {
      setSelectedTerm(null); // wrong match, reset selection
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-2">
          <MousePointerClick className="text-emerald-500" /> Game 1: Tarik & Pasangkan
        </h2>
        <p className="text-slate-600 mb-6">Cocokkan istilah di sebelah kiri dengan arti yang tepat di sebelah kanan dengan cara mengkliknya secara bergantian.</p>

        {completed ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center">
            <Trophy className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-emerald-800 mb-2">Hebat Sekali!</h3>
            <p className="text-emerald-700">Kamu berhasil mencocokkan semua istilah dengan benar.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-700 text-center mb-4">Istilah</h3>
              {terms.map(term => {
                const isMatched = !!matches[term.id];
                return (
                  <button
                    key={term.id}
                    disabled={isMatched}
                    onClick={() => setSelectedTerm(term.id)}
                    className={`w-full p-4 rounded-xl border-2 font-bold transition-all ${
                      isMatched ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-50' : 
                      selectedTerm === term.id ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                    }`}
                  >
                    {term.text}
                  </button>
                )
              })}
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-slate-700 text-center mb-4">Arti</h3>
              {defs.map(def => {
                const isMatched = Object.values(matches).includes(def.id);
                return (
                  <button
                    key={def.id}
                    disabled={isMatched || !selectedTerm}
                    onClick={() => handleDefClick(def.id)}
                    className={`w-full p-4 rounded-xl border-2 font-medium transition-all text-sm md:text-base ${
                      isMatched ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-50' :
                      selectedTerm && !isMatched ? 'bg-white border-dashed border-emerald-400 hover:bg-emerald-50 cursor-pointer' : 'bg-slate-50 border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    {def.text}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- GAME 2: TEKA TEKI SILANG ---
export function TekaTekiSilang({ currentUser, saveUser }: { currentUser: UserData | null, saveUser: (u: UserData) => void }) {
  // Grid 3x3
  // S U M
  // E . A
  // L . X
  const correctGrid = [
    ['S', 'U', 'M'],
    ['E', '', 'A'],
    ['L', '', 'X']
  ];
  
  const [grid, setGrid] = useState<string[][]>([['', '', ''], ['', '', ''], ['', '', '']]);
  const [completed, setCompleted] = useState(false);

  const handleInput = (r: number, c: number, val: string) => {
    if (completed) return;
    const newGrid = [...grid];
    newGrid[r][c] = val.toUpperCase().slice(-1);
    setGrid(newGrid);

    // Check completion
    let isCorrect = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (correctGrid[i][j] !== '' && newGrid[i][j] !== correctGrid[i][j]) {
          isCorrect = false;
        }
      }
    }
    
    if (isCorrect) {
      setCompleted(true);
      if (currentUser && !currentUser.completedSteps.includes(12)) {
        saveUser({ ...currentUser, points: currentUser.points + 30 });
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-2">
          <Type className="text-blue-500" /> Game 2: Teka Teki Silang
        </h2>
        <p className="text-slate-600 mb-6">Isi kotak-kotak di bawah ini sesuai dengan petunjuk yang diberikan.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-2">Mendatar (Horizontal)</h4>
              <p className="text-sm text-blue-800 mb-1"><strong>1.</strong> Rumus untuk menjumlahkan data.</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <h4 className="font-bold text-amber-900 mb-2">Menurun (Vertikal)</h4>
              <p className="text-sm text-amber-800 mb-1"><strong>1.</strong> Pertemuan antara baris dan kolom.</p>
              <p className="text-sm text-amber-800"><strong>2.</strong> Rumus mencari nilai terbesar.</p>
            </div>
          </div>

          <div className="flex justify-center items-center">
            {completed ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center w-full">
                <Trophy className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-emerald-800 mb-2">TTS Selesai!</h3>
              </motion.div>
            ) : (
              <div className="grid grid-cols-3 gap-2 bg-slate-200 p-2 rounded-xl">
                {correctGrid.map((row, r) => (
                  row.map((cell, c) => (
                    <div key={`${r}-${c}`} className="relative w-12 h-12 md:w-16 md:h-16">
                      {cell !== '' ? (
                        <>
                          {r === 0 && c === 0 && <span className="absolute top-0.5 left-1 text-[10px] font-bold text-slate-500 z-10">1</span>}
                          {r === 0 && c === 2 && <span className="absolute top-0.5 left-1 text-[10px] font-bold text-slate-500 z-10">2</span>}
                          <input 
                            type="text" 
                            maxLength={1}
                            value={grid[r][c]}
                            onChange={(e) => handleInput(r, c, e.target.value)}
                            className="w-full h-full text-center text-xl md:text-2xl font-black uppercase rounded-lg border-2 border-slate-300 focus:border-blue-500 focus:ring-0 focus:outline-none bg-white relative z-0"
                          />
                        </>
                      ) : (
                        <div className="w-full h-full bg-slate-300 rounded-lg"></div>
                      )}
                    </div>
                  ))
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- GAME 3: PUZZLE RUMUS ---
export function PuzzleRumus({ currentUser, saveUser }: { currentUser: UserData | null, saveUser: (u: UserData) => void }) {
  const targetFormula = ['=', 'AVERAGE', '(', 'B1', ':', 'B5', ')'];
  const [pool, setPool] = useState<string[]>([]);
  const [slots, setSlots] = useState<(string | null)[]>(Array(7).fill(null));
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Shuffle pieces on mount
    const pieces = [...targetFormula].sort(() => Math.random() - 0.5);
    setPool(pieces);
  }, []);

  const moveToSlot = (piece: string, poolIndex: number) => {
    if (completed) return;
    const firstEmpty = slots.findIndex(s => s === null);
    if (firstEmpty !== -1) {
      const newSlots = [...slots];
      newSlots[firstEmpty] = piece;
      setSlots(newSlots);
      
      const newPool = [...pool];
      newPool.splice(poolIndex, 1);
      setPool(newPool);

      checkWin(newSlots);
    }
  };

  const returnToPool = (piece: string, slotIndex: number) => {
    if (completed) return;
    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);
    setPool([...pool, piece]);
  };

  const resetPuzzle = () => {
    const pieces = [...targetFormula].sort(() => Math.random() - 0.5);
    setPool(pieces);
    setSlots(Array(7).fill(null));
    setCompleted(false);
  };

  const checkWin = (currentSlots: (string | null)[]) => {
    if (currentSlots.every((s, i) => s === targetFormula[i])) {
      setCompleted(true);
      if (currentUser && !currentUser.completedSteps.includes(13)) {
        saveUser({ ...currentUser, points: currentUser.points + 40 });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Puzzle className="text-amber-500" /> Game 3: Puzzle Rumus
          </h2>
          <button onClick={resetPuzzle} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
            <RotateCcw size={20} />
          </button>
        </div>
        
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mb-8">
          <p className="text-amber-900 font-medium text-center">
            Misi: Susun potongan blok di bawah ini menjadi rumus yang benar untuk mencari rata-rata nilai dari sel B1 sampai B5.
          </p>
        </div>

        {/* Answer Slots */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 min-h-[64px]">
          {slots.map((s, i) => (
            <div 
              key={i} 
              onClick={() => s && returnToPool(s, i)}
              className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center font-bold text-lg sm:text-xl rounded-xl transition-all ${
                s ? 'bg-emerald-600 text-white shadow-lg cursor-pointer transform hover:scale-105' : 'bg-slate-100 border-2 border-dashed border-slate-300'
              } ${completed ? 'bg-emerald-500 border-none' : ''}`}
            >
              {s}
            </div>
          ))}
        </div>

        {/* Pieces Pool */}
        {!completed && (
          <div className="flex flex-wrap justify-center gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-200 min-h-[100px]">
            <AnimatePresence>
              {pool.map((piece, i) => (
                <motion.button
                  key={`${piece}-${i}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => moveToSlot(piece, i)}
                  className="px-4 py-3 bg-white border-2 border-slate-300 text-slate-700 font-bold text-lg rounded-xl shadow-sm hover:border-amber-400 hover:text-amber-600 transition-colors"
                >
                  {piece}
                </motion.button>
              ))}
            </AnimatePresence>
            {pool.length === 0 && <p className="text-slate-400 font-medium text-sm mt-3 w-full text-center">Blok habis. Jika belum benar, klik blok di atas untuk mengembalikannya.</p>}
          </div>
        )}

        {completed && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mt-6 p-4 bg-emerald-100 text-emerald-800 rounded-xl font-bold">
            🎉 Tepat Sekali! Susunan rumus AVERAGE-mu sudah benar.
          </motion.div>
        )}
      </div>
    </div>
  );
}

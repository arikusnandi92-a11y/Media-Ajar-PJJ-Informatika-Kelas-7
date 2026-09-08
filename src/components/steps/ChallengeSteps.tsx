import { useState } from 'react';
import { UserData } from '../../types';
import { Trophy, Target, Star, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

// Step 9
export function Tantangan1({ currentUser, saveUser }: { currentUser: UserData | null, saveUser: (u: UserData) => void }) {
  const [answers, setAnswers] = useState({ max: '', min: '', sum: '', avg: '' });
  const [score, setScore] = useState<number | null>(null);

  const checkAnswers = () => {
    let s = 0;
    if (answers.max === '95') s += 25;
    if (answers.min === '60') s += 25;
    if (answers.sum === '320') s += 25;
    if (answers.avg === '80') s += 25;
    
    setScore(s);
    if (s === 100 && currentUser && !currentUser.badges.includes('Detektif Data')) {
      saveUser({ 
        ...currentUser, 
        points: currentUser.points + 50,
        badges: [...currentUser.badges, 'Detektif Data']
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Target className="text-red-500" /> Tantangan Detektif Data
            </h2>
            <p className="text-slate-600 mt-1">Tanpa menggunakan rumus, gunakan ketelitianmu!</p>
          </div>
          {score === 100 && <span className="px-4 py-2 bg-amber-100 text-amber-700 font-bold rounded-full text-sm">🏅 +50 Poin</span>}
        </div>

        <div className="flex gap-4 justify-center mb-8">
          {[75, 90, 60, 95].map((val, i) => (
            <div key={i} className="w-16 h-16 bg-slate-50 border-2 border-slate-200 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-700 shadow-sm">
              {val}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 block">1. Nilai Terbesar (MAX)</label>
            <input type="number" value={answers.max} onChange={e => setAnswers({...answers, max: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" placeholder="Ketik angka..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 block">2. Nilai Terkecil (MIN)</label>
            <input type="number" value={answers.min} onChange={e => setAnswers({...answers, min: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" placeholder="Ketik angka..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 block">3. Jumlah Seluruh Nilai (SUM)</label>
            <input type="number" value={answers.sum} onChange={e => setAnswers({...answers, sum: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" placeholder="Ketik angka..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 block">4. Nilai Rata-rata (AVERAGE)</label>
            <input type="number" value={answers.avg} onChange={e => setAnswers({...answers, avg: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" placeholder="Ketik angka..." />
          </div>
        </div>

        <button onClick={checkAnswers} className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold text-lg hover:bg-slate-900 transition-colors">
          Periksa Jawaban
        </button>

        {score !== null && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`mt-6 p-6 rounded-2xl text-center border-2 ${score === 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
            <h3 className="text-3xl font-black mb-2">Skor: {score}/100</h3>
            {score === 100 ? (
              <p className="font-medium flex items-center justify-center gap-2">
                <Trophy className="text-amber-500" /> Luar biasa! Kamu berhasil memecahkan kasus ini.
              </p>
            ) : (
              <p className="font-medium">Masih ada yang belum tepat. Coba hitung lagi ya!</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Step 10
export function Tantangan2({ currentUser, saveUser }: { currentUser: UserData | null, saveUser: (u: UserData) => void }) {
  const [tasks, setTasks] = useState([false, false, false, false, false, false]);

  const toggleTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index] = !newTasks[index];
    setTasks(newTasks);
    
    if (newTasks.every(t => t) && currentUser && !currentUser.badges.includes('Master Formula')) {
      saveUser({
        ...currentUser,
        points: currentUser.points + 100,
        badges: [...currentUser.badges, 'Master Formula']
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-6">
          <Star className="text-amber-500 fill-amber-500" /> Misi Pengolah Data
        </h2>
        
        <div className="prose prose-slate mb-8 text-slate-600">
          <p>
            "Kamu adalah petugas yang membantu wali kelas mengolah data nilai siswa."
          </p>
          <p>
            Buka aplikasi Microsoft Excel atau Google Sheets di HP/Laptop kamu, lalu kerjakan misi berikut ini!
            Setelah selesai, centang kotak di bawah ini.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-slate-700 mb-4">Checklist Misi:</h3>
          <div className="space-y-3">
            {[
              "1. Membuat judul dan tabel yang rapi.",
              "2. Memasukkan minimal 5 baris data (bebas).",
              "3. Menggunakan rumus SUM untuk menjumlahkan.",
              "4. Menggunakan rumus AVERAGE untuk rata-rata.",
              "5. Menentukan nilai tertinggi (MAX).",
              "6. Menentukan nilai terendah (MIN)."
            ].map((task, i) => (
              <label key={i} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${tasks[i] ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                <input type="checkbox" checked={tasks[i]} onChange={() => toggleTask(i)} className="w-5 h-5 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500" />
                <span className="font-medium select-none">{task}</span>
              </label>
            ))}
          </div>
        </div>

        {tasks.every(t => t) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center p-4 bg-amber-100 text-amber-800 rounded-xl font-bold">
            🎉 Misi Selesai! Kamu mendapatkan badge Master Formula!
          </motion.div>
        )}
      </div>
    </div>
  );
}

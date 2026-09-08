import { useState } from 'react';
import { UserData } from '../../types';
import { LayoutDashboard, CheckSquare, MessageSquare, Award } from 'lucide-react';
import { motion } from 'motion/react';

// Step 13
export function Proyek({ currentUser, saveUser }: { currentUser: UserData | null, saveUser: (u: UserData) => void }) {
  const [done, setDone] = useState(currentUser?.projectStatus || false);

  const handleDone = () => {
    setDone(true);
    if (currentUser) {
      saveUser({ ...currentUser, projectStatus: true, points: currentUser.points + 100, badges: [...currentUser.badges, 'Spreadsheet Explorer'] });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">📊 PROYEK SAYA: DATA DI SEKITARKU</h2>
        <p className="text-slate-600 mb-8">Pilih salah satu tema di bawah ini, dan buatlah tabelnya di aplikasi spreadsheet milikmu!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            "1. Data uang kas kelas",
            "2. Data nilai latihan",
            "3. Data jadwal belajar",
            "4. Data pengeluaran sederhana",
            "5. Data kegiatan olahraga"
          ].map(tema => (
            <div key={tema} className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700">
              {tema}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-8">
          <h3 className="font-bold text-blue-900 mb-3">Syarat Wajib Tabelmu:</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex gap-2 items-center"><CheckSquare size={18} /> Memiliki Judul tabel</li>
            <li className="flex gap-2 items-center"><CheckSquare size={18} /> Minimal 5 baris data</li>
            <li className="flex gap-2 items-center"><CheckSquare size={18} /> Menggunakan rumus SUM</li>
            <li className="flex gap-2 items-center"><CheckSquare size={18} /> Menggunakan AVERAGE, MAX, atau MIN</li>
          </ul>
        </div>

        <button 
          onClick={handleDone}
          disabled={done}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${done ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'}`}
        >
          {done ? <><CheckSquare /> Proyek Selesai Dicatat</> : <><CheckSquare /> Saya Sudah Menyelesaikan Proyek</>}
        </button>
      </div>
    </div>
  );
}

// Step 14
export function Refleksi({ currentUser, saveUser, setStep }: { currentUser: UserData | null, saveUser: (u: UserData) => void, setStep: (s: number) => void }) {
  const [text, setText] = useState(currentUser?.reflection || '');

  const handleSave = () => {
    if (text.trim() && currentUser) {
      saveUser({ ...currentUser, reflection: text });
      setStep(18);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><MessageSquare size={28} /></div>
          <h2 className="text-2xl font-bold text-slate-800">Refleksi Akhir</h2>
        </div>
        
        <p className="text-slate-600 mb-6 font-medium">Hari ini saya belajar bahwa...</p>

        <div className="space-y-2 mb-6">
          <p className="text-sm text-slate-500 italic">Panduan menulis (pilih salah satu atau tulis sendiri):</p>
          <ul className="text-sm text-slate-600 ml-4 list-disc space-y-1">
            <li>Saya sudah bisa...</li>
            <li>Saya masih perlu belajar...</li>
            <li>Hal yang paling menarik adalah...</li>
            <li>Spreadsheet dapat membantu saya ketika...</li>
          </ul>
        </div>

        <textarea 
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Tuliskan refleksimu di sini..."
          className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none mb-6 text-slate-700 leading-relaxed"
        ></textarea>

        <button 
          onClick={handleSave}
          disabled={!text.trim()}
          className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          Simpan Refleksi & Lihat Hasil
        </button>
      </div>
    </div>
  );
}

// Step 15
export function Hasil({ currentUser }: { currentUser: UserData | null }) {
  if (!currentUser) return null;

  return (
    <div className="max-w-3xl mx-auto mt-8 mb-24">
      <div className="hidden print:block w-full border-b-4 border-slate-900 pb-4 mb-8">
        <div className="flex items-center gap-6">
          <img src="https://cdn.phototourl.com/free/2026-06-07-a94dc15a-d9dd-4a9e-8434-63f26157ee0a.png" alt="Logo Sekolah" className="w-24 h-24 object-contain" />
          <div className="text-center flex-1">
            <h1 className="text-xl font-bold uppercase tracking-wider">PEMERINTAH KABUPATEN PANDEGLANG</h1>
            <h2 className="text-xl font-bold uppercase tracking-wider">DINAS PENDIDIKAN, KEPEMUDAAN DAN OLAHRAGA</h2>
            <h3 className="text-3xl font-black uppercase tracking-wider mt-1 mb-1">SMP NEGERI 1 SAKETI</h3>
            <p className="text-sm">Jl. Raya Saketi - Malingping Km. 01, Saketi, Kabupaten Pandeglang, Banten</p>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-8 print:mb-4">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2 print:text-2xl print:underline print:uppercase">Laporan Hasil Belajar Mandiri (BDR)</h2>
        <p className="text-slate-500 print:text-black print:font-medium">Mata Pelajaran: Informatika (Spreadsheet)</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold mb-1">{currentUser.name}</h3>
            <p className="text-emerald-100">Kelas {currentUser.className} • Absen {currentUser.absentNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black">{currentUser.progress}%</p>
            <p className="text-emerald-100 text-sm">Progress Selesai</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100 pb-6">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Nilai Kuis</p>
              <p className="text-3xl font-black text-slate-800">{currentUser.quizScore} <span className="text-lg text-slate-400 font-medium">/ 100</span></p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Poin</p>
              <p className="text-3xl font-black text-amber-500 flex items-center gap-2"><Award /> {currentUser.points}</p>
            </div>
          </div>

          <div className="border-b border-slate-100 pb-6">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Badge Terkumpul</p>
            <div className="flex flex-wrap gap-2">
              {currentUser.badges.map(b => (
                <span key={b} className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 font-medium rounded-full text-sm flex items-center gap-1">
                  🏅 {b}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Status Aktivitas</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="font-medium text-slate-700">Presensi</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckSquare size={18}/> Selesai</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="font-medium text-slate-700">Diagnostik Awal</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckSquare size={18}/> Selesai</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="font-medium text-slate-700">Proyek Akhir</span>
                {currentUser.projectStatus ? 
                  <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckSquare size={18}/> Selesai</span> :
                  <span className="text-slate-400 font-bold">Belum</span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center print:hidden">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">SELESAI! 🎉</h3>
        <p className="text-slate-600 mb-6 max-w-lg mx-auto">
          Hebat! Kamu sudah menyelesaikan pembelajaran hari ini. Terus berlatih karena kemampuan mengolah data akan sangat berguna di sekolah maupun kehidupan sehari-hari.
        </p>
        <div className="flex flex-col gap-2 items-center justify-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => window.print()} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
              Cetak Hasil
            </button>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors">
              Kembali ke Beranda
            </button>
          </div>
          {window.self !== window.top && (
            <p className="text-xs text-amber-600 font-medium max-w-sm mt-2">
              *Jika tombol cetak gagal, buka aplikasi di Tab Baru (klik ikon ↗ di sudut kanan atas).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

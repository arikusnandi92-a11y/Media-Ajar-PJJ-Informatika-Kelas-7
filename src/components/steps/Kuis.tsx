import { useState, useMemo } from 'react';
import { UserData } from '../../types';
import { Trophy, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

const QUIZ_QUESTIONS = [
  { q: "Apa yang dimaksud dengan spreadsheet?", options: ["Aplikasi pemutar video", "Aplikasi pengolah kata", "Aplikasi pengolah angka/data", "Aplikasi pembuat presentasi"], ans: 2, exp: "Spreadsheet dirancang khusus untuk mengolah angka dan data dalam bentuk tabel." },
  { q: "Pertemuan antara baris dan kolom disebut...", options: ["Cell (Sel)", "Range", "Sheet", "Workbook"], ans: 0, exp: "Cell (sel) adalah kotak tunggal pertemuan baris dan kolom, misal A1." },
  { q: "Baris (Row) pada spreadsheet biasanya ditandai dengan...", options: ["Huruf (A, B, C)", "Angka (1, 2, 3)", "Simbol (@, #, $)", "Warna"], ans: 1, exp: "Baris ditandai dengan angka, sedangkan kolom ditandai dengan huruf." },
  { q: "Kumpulan beberapa sel yang dipilih sekaligus disebut...", options: ["Cell", "Formula", "Range", "Column"], ans: 2, exp: "Range adalah sekumpulan sel yang diblok, contoh: A1:A5." },
  { q: "Setiap rumus (formula) pada spreadsheet harus diawali dengan tanda...", options: ["+", "-", "=", "*"], ans: 2, exp: "Tanda sama dengan (=) memberitahu komputer bahwa kita akan menghitung sesuatu." },
  { q: "Fungsi yang digunakan untuk MENJUMLAHKAN data adalah...", options: ["MAX", "AVERAGE", "SUM", "MIN"], ans: 2, exp: "SUM berasal dari kata summary yang berarti jumlah." },
  { q: "Fungsi AVERAGE digunakan untuk mencari...", options: ["Nilai tertinggi", "Nilai rata-rata", "Nilai terendah", "Jumlah total"], ans: 1, exp: "AVERAGE digunakan untuk menghitung nilai rata-rata dari sebuah range." },
  { q: "Jika ingin mencari nilai TERBESAR dari sekumpulan data, fungsi yang digunakan adalah...", options: ["MAX", "MIN", "SUM", "AVERAGE"], ans: 0, exp: "MAX (Maximum) mencari nilai tertinggi." },
  { q: "Rumus =SUM(A1:A5) artinya...", options: ["Mencari rata-rata A1 sampai A5", "Menjumlahkan isi sel A1 sampai A5", "Mencari nilai A1 dikurang A5", "Menyalin sel A1 ke A5"], ans: 1, exp: "Fungsi SUM menjumlahkan range A1 sampai A5." },
  { q: "Di bawah ini yang merupakan contoh aplikasi spreadsheet adalah...", options: ["Microsoft Word", "Adobe Photoshop", "Google Sheets", "Google Slides"], ans: 2, exp: "Google Sheets adalah aplikasi spreadsheet online dari Google." }
];

export function Kuis({ currentUser, saveUser }: { currentUser: UserData | null, saveUser: (u: UserData) => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  
  const score = useMemo(() => {
    let s = 0;
    Object.keys(answers).forEach(k => {
      if (answers[Number(k)] === QUIZ_QUESTIONS[Number(k)].ans) s += 10;
    });
    return s;
  }, [answers]);

  const handleAnswer = (optIndex: number) => {
    setAnswers({ ...answers, [currentQ]: optIndex });
  };

  const nextQuestion = () => {
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
      if (currentUser) {
        saveUser({ ...currentUser, quizScore: score, points: currentUser.points + score, isQuizFinished: true });
      }
    }
  };

  const getPredicate = (s: number) => {
    if (s >= 90) return { title: "🏆 Master Data", desc: "Luar biasa! Pemahamanmu sangat sempurna.", color: "text-amber-600", bg: "bg-amber-100" };
    if (s >= 80) return { title: "🌟 Hebat", desc: "Bagus sekali! Kamu sudah memahami materi dengan baik.", color: "text-emerald-600", bg: "bg-emerald-100" };
    if (s >= 70) return { title: "👍 Sudah Baik", desc: "Keren! Beberapa hal kecil perlu diingat lagi.", color: "text-blue-600", bg: "bg-blue-100" };
    return { title: "💪 Yuk belajar lagi", desc: "Jangan menyerah. Kesalahan adalah bagian dari belajar.", color: "text-slate-600", bg: "bg-slate-100" };
  };

  if (showResult) {
    const pred = getPredicate(score);
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
          <div className={`inline-block p-4 rounded-2xl ${pred.bg} ${pred.color} mb-6`}>
            <Trophy size={48} />
          </div>
          <h2 className="text-4xl font-black text-slate-800 mb-2">{score} / 100</h2>
          <h3 className={`text-2xl font-bold ${pred.color} mb-2`}>{pred.title}</h3>
          <p className="text-slate-600 mb-8">{pred.desc}</p>
          
          <div className="text-left space-y-4 max-h-[40vh] overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-4 sticky top-0 bg-slate-50 py-2">Pembahasan:</h4>
            {QUIZ_QUESTIONS.map((q, i) => {
              const isCorrect = answers[i] === q.ans;
              return (
                <div key={i} className={`p-4 rounded-xl border ${isCorrect ? 'bg-white border-emerald-200' : 'bg-white border-red-200'}`}>
                  <p className="font-medium text-slate-800 mb-2">{i+1}. {q.q}</p>
                  <p className="text-sm text-slate-600 mb-2">Jawabanmu: <span className={isCorrect ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>{q.options[answers[i]]}</span></p>
                  {!isCorrect && <p className="text-sm text-emerald-600 font-bold mb-2">Benar: {q.options[q.ans]}</p>}
                  <p className="text-sm text-slate-500 bg-slate-100 p-2 rounded italic">{q.exp}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[currentQ];
  const hasAnswered = answers[currentQ] !== undefined;
  const isCorrect = hasAnswered && answers[currentQ] === q.ans;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Kuis Akhir</h2>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">Soal {currentQ + 1} / 10</span>
        </div>
        
        <div className="w-full bg-slate-100 h-2 rounded-full mb-8">
          <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${((currentQ) / 10) * 100}%` }}></div>
        </div>

        <h3 className="text-lg font-medium text-slate-800 mb-6">{q.q}</h3>

        <div className="space-y-3 mb-8">
          {q.options.map((opt, i) => (
            <button
              key={i}
              disabled={hasAnswered}
              onClick={() => handleAnswer(i)}
              className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all ${
                hasAnswered
                  ? i === q.ans 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                    : i === answers[currentQ] 
                      ? 'bg-red-50 border-red-500 text-red-700' 
                      : 'bg-white border-slate-200 opacity-50'
                  : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-700'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {hasAnswered && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            {isCorrect ? (
              <div className="p-4 bg-emerald-100 text-emerald-800 rounded-xl flex gap-3 items-start">
                <CheckCircle className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Mantap! Jawabanmu benar.</p>
                  <p className="text-sm mt-1 opacity-90">{q.exp}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 text-red-800 rounded-xl flex gap-3 items-start">
                <XCircle className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Belum tepat.</p>
                  <p className="text-sm mt-1 opacity-90">{q.exp}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <button 
          disabled={!hasAnswered} 
          onClick={nextQuestion}
          className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentQ === 9 ? 'Lihat Hasil' : 'Soal Selanjutnya'}
        </button>
      </div>
    </div>
  );
}

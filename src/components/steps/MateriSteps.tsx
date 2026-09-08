import { useState } from 'react';
import { UserData } from '../../types';
import { Table, MousePointer2, Calculator } from 'lucide-react';
import { motion } from 'motion/react';

// Step 5
export function Materi1() {
  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Apa itu Spreadsheet?</h2>
        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
          Spreadsheet (lembar sebar) adalah aplikasi komputer yang digunakan untuk mengumpulkan, 
          menyimpan, dan mengolah data dalam bentuk tabel yang terdiri dari baris dan kolom.
        </p>
        
        <h3 className="text-lg font-bold text-slate-700 mb-4 mt-8">Contoh Aplikasi Spreadsheet yang Populer:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
            <div className="w-16 h-16 bg-white rounded-xl mx-auto mb-3 flex items-center justify-center shadow-sm text-emerald-600 font-bold text-xl">X</div>
            <p className="font-medium text-emerald-800">Microsoft Excel</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-center">
            <div className="w-16 h-16 bg-white rounded-xl mx-auto mb-3 flex items-center justify-center shadow-sm text-blue-600 font-bold text-xl">
              <Table size={32} />
            </div>
            <p className="font-medium text-blue-800">Google Sheets</p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-center">
            <div className="w-16 h-16 bg-white rounded-xl mx-auto mb-3 flex items-center justify-center shadow-sm text-amber-600 font-bold text-xl">L</div>
            <p className="font-medium text-amber-800">LibreOffice Calc</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 6
export function Materi2() {
  const [activeInfo, setActiveInfo] = useState<string>('');

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Mengenal Bagian Spreadsheet</h2>
        <p className="text-slate-600 mb-6">Klik bagian tabel di bawah ini untuk melihat penjelasannya!</p>
        
        <div className="border border-slate-300 rounded-lg overflow-hidden font-sans text-sm mb-6 select-none shadow-sm">
          {/* Header Formula */}
          <div className="flex bg-slate-100 border-b border-slate-300 p-2 items-center gap-2" onClick={() => setActiveInfo('Formula Bar')}>
            <div className="font-bold text-slate-500 w-8 text-center cursor-pointer hover:bg-slate-200 rounded">fx</div>
            <div className="bg-white border border-slate-300 px-2 py-1 flex-1 rounded cursor-text"></div>
          </div>
          
          <div className="flex">
            {/* Corner */}
            <div className="w-10 bg-slate-100 border-r border-b border-slate-300 flex-shrink-0" onClick={() => setActiveInfo('Workbook / Worksheet')}></div>
            {/* Columns */}
            {['A', 'B', 'C'].map(col => (
              <div key={col} className="flex-1 bg-slate-100 border-b border-slate-300 text-center font-medium text-slate-600 py-1 cursor-pointer hover:bg-emerald-100 transition-colors" onClick={() => setActiveInfo('Column')}>
                {col}
              </div>
            ))}
          </div>

          {[1, 2, 3].map(row => (
            <div key={row} className="flex">
              {/* Row header */}
              <div className="w-10 bg-slate-100 border-r border-b border-slate-300 text-center font-medium text-slate-600 py-2 cursor-pointer hover:bg-emerald-100 transition-colors flex-shrink-0" onClick={() => setActiveInfo('Row')}>
                {row}
              </div>
              {/* Cells */}
              {['A', 'B', 'C'].map(col => (
                <div 
                  key={col} 
                  className={`flex-1 border-r border-b border-slate-200 p-2 cursor-pointer transition-colors ${activeInfo === 'Cell' || activeInfo === 'Range' ? 'hover:bg-emerald-50' : ''}`}
                  onClick={() => setActiveInfo('Cell')}
                  onDoubleClick={() => setActiveInfo('Range')}
                >
                  <div className="h-4"></div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="min-h-[120px] bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
          {!activeInfo ? (
            <div className="flex items-center justify-center h-full text-emerald-600 gap-2">
              <MousePointer2 size={20} />
              <p className="font-medium">Klik sembarang tempat pada tabel di atas!</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} key={activeInfo}>
              <h3 className="font-bold text-emerald-800 text-lg mb-2">{activeInfo}</h3>
              <p className="text-emerald-700">
                {activeInfo === 'Workbook / Worksheet' && "Workbook adalah file utuh (buku kerja), sedangkan Worksheet adalah lembaran-lembaran kerja di dalamnya."}
                {activeInfo === 'Column' && "Kolom (Column) adalah deretan vertikal yang biasanya ditandai dengan HURUF (A, B, C, dst)."}
                {activeInfo === 'Row' && "Baris (Row) adalah deretan horizontal yang ditandai dengan ANGKA (1, 2, 3, dst)."}
                {activeInfo === 'Cell' && "Sel (Cell) adalah kotak tunggal tempat bertemunya baris dan kolom. Contoh: Sel A1 (Kolom A, Baris 1)."}
                {activeInfo === 'Range' && "Range adalah kumpulan beberapa sel yang dipilih sekaligus. (Tips: Coba block / klik ganda untuk memilih banyak)."}
                {activeInfo === 'Formula Bar' && "Formula Bar adalah tempat kita mengetikkan rumus atau melihat isi asli dari sebuah sel."}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 7
export function Simulasi() {
  const [data, setData] = useState([
    { id: 1, nama: 'Andi', tugas1: 80, tugas2: 85, ulangan: 90 },
    { id: 2, nama: 'Budi', tugas1: 75, tugas2: 80, ulangan: 85 },
    { id: 3, nama: 'Citra', tugas1: 90, tugas2: 88, ulangan: 92 },
    { id: 4, nama: 'Dinda', tugas1: 85, tugas2: 90, ulangan: 88 },
  ]);

  const updateData = (id: number, field: string, value: string) => {
    setData(data.map(item => {
      if (item.id === id) {
        return { ...item, [field]: field === 'nama' ? value : Number(value) || 0 };
      }
      return item;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Simulasi Pengolahan Data</h2>
        
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl mb-6">
          <p className="text-amber-800 font-medium">Instruksi: Cobalah ubah nilai Tugas 1 milik Andi menjadi 95. Perhatikan jumlahnya!</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 mb-6">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 border-r border-slate-200">Nama</th>
                <th className="px-4 py-3 border-r border-slate-200">Tugas 1</th>
                <th className="px-4 py-3 border-r border-slate-200">Tugas 2</th>
                <th className="px-4 py-3 border-r border-slate-200">Ulangan</th>
                <th className="px-4 py-3 bg-emerald-50 text-emerald-800">Total (Otomatis)</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-0 border-r border-slate-100">
                    <input type="text" value={row.nama} onChange={(e) => updateData(row.id, 'nama', e.target.value)} className="w-full p-3 bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500" />
                  </td>
                  <td className="p-0 border-r border-slate-100">
                    <input type="number" value={row.tugas1} onChange={(e) => updateData(row.id, 'tugas1', e.target.value)} className="w-full p-3 bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500" />
                  </td>
                  <td className="p-0 border-r border-slate-100">
                    <input type="number" value={row.tugas2} onChange={(e) => updateData(row.id, 'tugas2', e.target.value)} className="w-full p-3 bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500" />
                  </td>
                  <td className="p-0 border-r border-slate-100">
                    <input type="number" value={row.ulangan} onChange={(e) => updateData(row.id, 'ulangan', e.target.value)} className="w-full p-3 bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500" />
                  </td>
                  <td className="px-4 py-3 bg-emerald-50/50 font-bold text-emerald-700">
                    {row.tugas1 + row.tugas2 + row.ulangan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-slate-500 text-center">Inilah kekuatan spreadsheet! Saat kamu mengubah satu angka, perhitungan total akan berubah secara otomatis tanpa kalkulator.</p>
      </div>
    </div>
  );
}

// Step 8
export function Rumus() {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{isCorrect: boolean, text: string} | null>(null);

  const checkFormula = () => {
    const cleanAnswer = answer.trim().toUpperCase().replace(/\s/g, '');
    if (cleanAnswer === '=SUM(A1:E1)' || cleanAnswer === '=SUM(10,20,30,40,50)' || cleanAnswer === '=10+20+30+40+50') {
      setFeedback({ isCorrect: true, text: '✅ Tepat sekali! Kamu sudah mulai mengerti cara kerja rumus.' });
    } else if (cleanAnswer.includes('SUM') && !cleanAnswer.startsWith('=')) {
      setFeedback({ isCorrect: false, text: '💡 Hampir benar! Jangan lupa setiap rumus HARUS diawali dengan tanda sama dengan (=).' });
    } else {
      setFeedback({ isCorrect: false, text: '💡 Coba lagi. Gunakan fungsi =SUM(...) untuk menjumlahkan.' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Calculator size={28} /></div>
          <h2 className="text-2xl font-bold text-slate-800">Belajar Rumus (Formula)</h2>
        </div>
        
        <p className="text-slate-600 mb-6 text-lg">
          Rumus selalu diawali dengan tanda sama dengan <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded font-bold">=</code>.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-700 mb-2">Fungsi Dasar:</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><code className="text-indigo-600 font-bold">SUM</code> : Menjumlahkan data</li>
              <li><code className="text-indigo-600 font-bold">AVERAGE</code> : Rata-rata</li>
              <li><code className="text-indigo-600 font-bold">MAX</code> : Nilai terbesar</li>
              <li><code className="text-indigo-600 font-bold">MIN</code> : Nilai terkecil</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-700 mb-2">Contoh Penulisan:</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><code className="bg-white px-1 border rounded">=SUM(A1:A5)</code></li>
              <li><code className="bg-white px-1 border rounded">=AVERAGE(B1:B10)</code></li>
              <li><code className="bg-white px-1 border rounded">=MAX(C1:C20)</code></li>
            </ul>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
          <h3 className="font-bold text-indigo-900 mb-4">Mari Mencoba!</h3>
          <p className="text-indigo-800 mb-4">Kamu memiliki deretan data: <strong>10, 20, 30, 40, 50</strong> (berada di sel A1 sampai E1).</p>
          <p className="text-sm text-indigo-700 mb-2">Tuliskan rumus untuk menghitung <strong>JUMLAH</strong> seluruh data tersebut:</p>
          
          <div className="flex gap-3 mb-4">
            <input 
              type="text" 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Contoh: =SUM(A1:A5)"
              className="flex-1 p-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            <button 
              onClick={checkFormula}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
            >
              Cek
            </button>
          </div>
          
          {feedback && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-4 rounded-xl font-medium ${feedback.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              {feedback.text}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

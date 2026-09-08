import { Brain, Lightbulb, PenTool } from 'lucide-react';

// Step 11
export function DeepLearning() {
  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Pembelajaran Mendalam</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">Mari kita cermati kembali apa yang sudah kita pelajari hari ini melalui 3 tahapan berikut.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Brain size={80} />
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
            <Brain size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 relative z-10">1. Memahami</h3>
          <ul className="space-y-3 text-slate-600 relative z-10 text-sm">
            <li>• Spreadsheet adalah lembar kerja digital (baris & kolom).</li>
            <li>• Digunakan untuk menyimpan dan menghitung data otomatis.</li>
            <li>• Menghindari kesalahan hitung manual yang melelahkan.</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <PenTool size={80} />
          </div>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
            <PenTool size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 relative z-10">2. Mengaplikasi</h3>
          <p className="text-slate-600 mb-4 text-sm relative z-10">Dalam kehidupan sehari-hari, kamu bisa menggunakan spreadsheet untuk:</p>
          <div className="flex flex-wrap gap-2 relative z-10">
            {['Data nilai', 'Uang kas kelas', 'Jadwal piket', 'Pengeluaran', 'Kehadiran'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-amber-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Lightbulb size={80} />
          </div>
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
            <Lightbulb size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 relative z-10">3. Merefleksi</h3>
          <ul className="space-y-3 text-slate-600 relative z-10 text-sm font-medium">
            <li>Tanyakan pada dirimu:</li>
            <li className="text-amber-800 bg-amber-50 p-2 rounded-lg">Kapan spreadsheet bisa membantumu?</li>
            <li className="text-amber-800 bg-amber-50 p-2 rounded-lg">Jika kamu pengelola kelas, data apa yang ingin kamu olah?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

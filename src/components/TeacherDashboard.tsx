import { UserData } from '../types';
import { Download, Search, Users, Star, BookOpen, Printer, UserCircle, LayoutGrid, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Props {
  users: UserData[];
}

export function TeacherDashboard({ users }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'semua' | 'kelas' | 'tanggal'>('semua');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['Nama', 'Kelas', 'No. Absen', 'Waktu Presensi', 'Progress (%)', 'Skor Kuis', 'Poin', 'Refleksi'];
    const rows = users.map(u => [
      u.name,
      u.className,
      u.absentNumber,
      u.date,
      u.progress.toString(),
      u.quizScore.toString(),
      u.points.toString(),
      `"${u.reflection.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "laporan_bdr_informatika.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Recap per Kelas
  const recapClass = users.reduce((acc, user) => {
    if (!acc[user.className]) {
      acc[user.className] = { count: 0, progress: 0, score: 0 };
    }
    acc[user.className].count += 1;
    acc[user.className].progress += user.progress;
    acc[user.className].score += user.quizScore;
    return acc;
  }, {} as Record<string, { count: number, progress: number, score: number }>);

  // Recap per Tanggal
  const recapDate = users.reduce((acc, user) => {
    const dateOnly = new Date(user.date).toLocaleDateString('id-ID');
    if (!acc[dateOnly]) {
      acc[dateOnly] = { count: 0, progress: 0, score: 0 };
    }
    acc[dateOnly].count += 1;
    acc[dateOnly].progress += user.progress;
    acc[dateOnly].score += user.quizScore;
    return acc;
  }, {} as Record<string, { count: number, progress: number, score: number }>);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen">
      
      {/* KOP SURAT (Hanya tampil saat print) */}
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
      <div className="hidden print:block mb-8 text-center">
        <h4 className="text-xl font-bold uppercase underline">Laporan Hasil Belajar Dari Rumah (BDR)</h4>
        <p className="font-medium mt-1">Mata Pelajaran: Informatika (Spreadsheet)</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Guru</h1>
          <p className="text-slate-500">Pantau perkembangan belajar siswa secara real-time.</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors shadow-sm"
            >
              <Download size={18} />
              Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Printer size={18} />
              Cetak PDF
            </button>
          </div>
          {window.self !== window.top && (
            <p className="text-xs text-amber-600 font-medium text-right mt-1">
              *Jika cetak gagal, buka aplikasi di Tab Baru (ikon ↗ di sudut kanan atas)
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 print:hidden">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Siswa</p>
            <p className="text-2xl font-bold text-slate-800">{users.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Rata-rata Progress</p>
            <p className="text-2xl font-bold text-slate-800">
              {users.length > 0 ? Math.round(users.reduce((acc, curr) => acc + curr.progress, 0) / users.length) : 0}%
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Star size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Rata-rata Kuis</p>
            <p className="text-2xl font-bold text-slate-800">
              {users.length > 0 ? Math.round(users.reduce((acc, curr) => acc + curr.quizScore, 0) / users.length) : 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none">
        
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 print:hidden">
          <button 
            onClick={() => setActiveTab('semua')} 
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'semua' ? 'text-emerald-700 border-b-2 border-emerald-500 bg-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            <Users size={18} /> Data Lengkap
          </button>
          <button 
            onClick={() => setActiveTab('kelas')} 
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'kelas' ? 'text-emerald-700 border-b-2 border-emerald-500 bg-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            <LayoutGrid size={18} /> Rekap Kelas
          </button>
          <button 
            onClick={() => setActiveTab('tanggal')} 
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'tanggal' ? 'text-emerald-700 border-b-2 border-emerald-500 bg-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            <Calendar size={18} /> Rekap Tanggal
          </button>
        </div>

        {/* Tab Content 1: Semua Data */}
        {activeTab === 'semua' && (
          <div>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white print:hidden">
              <h2 className="font-bold text-slate-800">Daftar Kehadiran & Nilai Siswa</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari siswa atau kelas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                />
              </div>
            </div>
            
            <div className="hidden print:block p-4">
              <h3 className="font-bold text-lg mb-2">Detail Kehadiran Siswa</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 print:text-black print:text-xs">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 print:bg-white print:border-b-2 print:border-black">
                  <tr>
                    <th className="px-6 py-4 print:py-2 print:px-2">Siswa</th>
                    <th className="px-6 py-4 print:py-2 print:px-2">Kelas / No</th>
                    <th className="px-6 py-4 print:py-2 print:px-2">Waktu</th>
                    <th className="px-6 py-4 print:py-2 print:px-2">Progress</th>
                    <th className="px-6 py-4 print:py-2 print:px-2">Skor Kuis</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        Belum ada data siswa.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 print:border-slate-300">
                        <td className="px-6 py-4 print:py-2 print:px-2 font-medium text-slate-800 flex items-center gap-3">
                          {user.photo ? (
                            <img src={user.photo} alt="Selfie" className="w-10 h-10 rounded-full object-cover border border-slate-200 print:w-8 print:h-8" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold print:w-8 print:h-8 print:border print:border-black">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          {user.name}
                        </td>
                        <td className="px-6 py-4 print:py-2 print:px-2">{user.className} / {user.absentNumber}</td>
                        <td className="px-6 py-4 print:py-2 print:px-2">{new Date(user.date).toLocaleString('id-ID', {day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit'})}</td>
                        <td className="px-6 py-4 print:py-2 print:px-2">
                          <div className="flex items-center gap-2 print:hidden">
                            <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${user.progress}%` }}></div>
                            </div>
                            <span className="text-xs">{user.progress}%</span>
                          </div>
                          <span className="hidden print:inline">{user.progress}%</span>
                        </td>
                        <td className="px-6 py-4 print:py-2 print:px-2 font-bold text-amber-600 print:text-black">{user.quizScore}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 2: Rekap Kelas */}
        {activeTab === 'kelas' && (
          <div className="p-6 print:p-0 print:mt-4">
            <h2 className="text-xl font-bold text-slate-800 mb-6 print:mb-2">Rekapitulasi Berdasarkan Kelas</h2>
            <div className="overflow-x-auto border border-slate-200 rounded-xl print:border-black print:rounded-none">
              <table className="w-full text-left text-sm text-slate-600 print:text-black print:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 print:bg-white print:border-b-2 print:border-black">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-700 print:py-2">Nama Kelas</th>
                    <th className="px-6 py-4 font-bold text-slate-700 print:py-2 text-center">Jumlah Siswa Hadir</th>
                    <th className="px-6 py-4 font-bold text-slate-700 print:py-2 text-center">Rata-rata Progress</th>
                    <th className="px-6 py-4 font-bold text-slate-700 print:py-2 text-center">Rata-rata Nilai Kuis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                  {Object.keys(recapClass).sort().map(className => (
                    <tr key={className} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-emerald-700 print:py-2 print:text-black">{className}</td>
                      <td className="px-6 py-4 text-center font-medium print:py-2">{recapClass[className].count} Siswa</td>
                      <td className="px-6 py-4 text-center print:py-2">{Math.round(recapClass[className].progress / recapClass[className].count)}%</td>
                      <td className="px-6 py-4 text-center print:py-2">{Math.round(recapClass[className].score / recapClass[className].count)}</td>
                    </tr>
                  ))}
                  {Object.keys(recapClass).length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Belum ada data.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 3: Rekap Tanggal */}
        {activeTab === 'tanggal' && (
          <div className="p-6 print:p-0 print:mt-4">
            <h2 className="text-xl font-bold text-slate-800 mb-6 print:mb-2">Rekapitulasi Kehadiran Harian</h2>
            <div className="overflow-x-auto border border-slate-200 rounded-xl print:border-black print:rounded-none">
              <table className="w-full text-left text-sm text-slate-600 print:text-black print:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 print:bg-white print:border-b-2 print:border-black">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-700 print:py-2">Tanggal Masuk</th>
                    <th className="px-6 py-4 font-bold text-slate-700 print:py-2 text-center">Total Siswa Hadir</th>
                    <th className="px-6 py-4 font-bold text-slate-700 print:py-2 text-center">Rata-rata Progress</th>
                    <th className="px-6 py-4 font-bold text-slate-700 print:py-2 text-center">Rata-rata Nilai Kuis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                  {Object.keys(recapDate).sort((a,b) => new Date(b).getTime() - new Date(a).getTime()).map(date => (
                    <tr key={date} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-blue-700 print:py-2 print:text-black">{date}</td>
                      <td className="px-6 py-4 text-center font-medium print:py-2">{recapDate[date].count} Siswa</td>
                      <td className="px-6 py-4 text-center print:py-2">{Math.round(recapDate[date].progress / recapDate[date].count)}%</td>
                      <td className="px-6 py-4 text-center print:py-2">{Math.round(recapDate[date].score / recapDate[date].count)}</td>
                    </tr>
                  ))}
                  {Object.keys(recapDate).length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Belum ada data.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
      
      {/* Tanda Tangan Guru (Hanya tampil saat print) */}
      <div className="hidden print:flex justify-end mt-16 mr-8">
        <div className="text-center">
          <p className="mb-20">Mengetahui,<br/>Guru Mata Pelajaran Informatika</p>
          <p className="font-bold underline">_________________________</p>
          <p>NIP. .....................................</p>
        </div>
      </div>

    </div>
  );
}

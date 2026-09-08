import React, { useState, useMemo } from 'react';
import { UserData } from '../../types';
import { BookOpen, CheckCircle, ChevronRight, User, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import studentsData from '../../students.json';

// Step 0
export function Home({ setStep }: { setStep: (s: number) => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col items-center">
        <img src="https://cdn.phototourl.com/free/2026-06-07-a94dc15a-d9dd-4a9e-8434-63f26157ee0a.png" alt="Logo SMPN 1 Saketi" className="w-24 h-24 mb-4 object-contain" referrerPolicy="no-referrer" />
        <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 font-medium text-sm mb-4">
          SMP Negeri 1 Saketi • Kelas VII
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4 leading-tight">
          BELAJAR INFORMATIKA <br className="hidden md:block"/>
          <span className="text-emerald-600">DARI RUMAH</span>
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Belajar Mengolah Data dengan Spreadsheet
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full mb-8">
        <p className="text-slate-700 italic mb-6">
          "Teknologi bukan untuk ditakuti. Teknologi adalah alat yang membantu kita bekerja lebih mudah, cepat, dan kreatif."
        </p>
        <button
          onClick={() => setStep(1)}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          MULAI PEMBELAJARAN <ChevronRight />
        </button>
      </motion.div>
      <p className="text-sm text-slate-400">Guru: Guru Informatika</p>
    </div>
  );
}

// Step 1
export function Presensi({ setStep, saveUser, users }: { setStep: (s: number) => void, saveUser: (u: UserData) => void, users?: UserData[] }) {
  const [className, setClassName] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [existingUserFound, setExistingUserFound] = useState(false);
  const [resumedStep, setResumedStep] = useState(2);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Filter students based on selected class
  const classStudents = useMemo(() => {
    if (!className) return [];
    return studentsData
      .filter(s => s.class === className)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [className]);

  const selectedStudent = useMemo(() => {
    return studentsData.find(s => s.id === selectedStudentId);
  }, [selectedStudentId]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Kamera tidak didukung di browser ini. Silakan gunakan tombol unggah foto di bawah.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.error("Error accessing camera", err);
      setIsCameraActive(false);
      setCameraError(err.message || "Gagal mengakses kamera. Silakan periksa izin kamera atau gunakan tombol unggah foto alternatif.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCameraError(null);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimensions
          const MAX_WIDTH = 480;
          const MAX_HEIGHT = 640;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
            setPhoto(dataUrl);
            stopCamera();
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        setPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !className || !photo) {
      setCameraError("Pastikan semua data terisi dan Anda sudah mengambil foto selfie (atau mengunggah foto)!");
      return;
    }
    
    // Check if user already exists (for resuming from different device)
    // Now we use the official ID for exact matching
    const existingUser = users?.find(u => u.absentNumber === selectedStudent.id);

    if (existingUser) {
      // Update their latest photo and date, but keep progress
      const updatedUser = {
        ...existingUser,
        photo,
        date: new Date().toISOString()
      };
      saveUser(updatedUser);
      setExistingUserFound(true);
      
      // Determine which step to resume from
      const maxCompletedStep = existingUser.completedSteps.length > 0 
        ? Math.max(...existingUser.completedSteps) 
        : 1;
      
      // Resume from the next step after their max completed
      const nextStep = Math.min(18, maxCompletedStep + 1);
      setResumedStep(nextStep);
      setSubmitted(true);
      return;
    }

    const newUser: UserData = {
      id: Date.now().toString(),
      name: selectedStudent.name,
      className: selectedStudent.class,
      absentNumber: selectedStudent.id, // Store their NISN/ID as absentNumber
      date: new Date().toISOString(),
      diagnostic: {},
      quizScore: 0,
      projectStatus: false,
      reflection: '',
      points: 10, // Base points for attending
      badges: ['Pejuang Data'],
      progress: 0,
      completedSteps: [1],
      photo
    };
    
    saveUser(newUser);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          {existingUserFound ? "Sesi Dilanjutkan!" : "Presensi Berhasil!"}
        </h2>
        <p className="text-lg text-slate-600 mb-8 max-w-md">
          {existingUserFound 
            ? `Halo kembali, ${selectedStudent?.name}! Kami telah menemukan data belajarmu sebelumnya. Mari lanjutkan petualanganmu.` 
            : `Tepuk tangan untuk diri sendiri 👏\n Hari ini ${selectedStudent?.name} sudah hadir dan siap belajar!`}
        </p>
        <button onClick={() => setStep(resumedStep)} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold">
          {existingUserFound ? "Lanjutkan Belajar" : "Lanjut ke Diagnostik"}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 pb-8">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><User size={24} /></div>
          <h2 className="text-xl font-bold text-slate-800">Isi Presensi Dulu Yuk!</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Kelas</label>
            <select required value={className} onChange={e => {
              setClassName(e.target.value);
              setSelectedStudentId(''); // Reset student when class changes
            }} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              <option value="">-- Pilih Kelas --</option>
              <option value="VII-A">VII-A</option>
              <option value="VII-B">VII-B</option>
              <option value="VII-C">VII-C</option>
              <option value="VII-D">VII-D</option>
              <option value="VII-E">VII-E</option>
              <option value="VII-F">VII-F</option>
              <option value="VII-G">VII-G</option>
              <option value="VII-H">VII-H</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Nama</label>
            <select required value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} disabled={!className} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400">
              <option value="">-- Pilih Nama Kamu --</option>
              {classStudents.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">Foto Selfie Presensi</label>
            
            {cameraError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium">
                {cameraError}
              </div>
            )}

            {!photo && !isCameraActive && (
              <div className="space-y-3">
                <button 
                  type="button" 
                  onClick={startCamera}
                  className="w-full py-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:bg-slate-50 hover:border-emerald-300 flex flex-col items-center justify-center gap-2 transition-colors"
                >
                  <Camera size={32} className="text-slate-400" />
                  <span className="font-medium">Buka Kamera untuk Selfie</span>
                </button>
                <div className="text-center text-sm text-slate-500 font-medium">ATAU</div>
                <label className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-200 cursor-pointer transition-colors">
                  <span className="font-medium">Pilih dari Galeri / Kamera HP</span>
                  <input type="file" accept="image/*" capture="user" onChange={handleFileUpload} className="hidden" ref={fileInputRef} />
                </label>
              </div>
            )}

            {!photo && isCameraActive && (
              <div className="relative rounded-xl overflow-hidden bg-black aspect-[3/4]">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                <button 
                  type="button"
                  onClick={takePhoto}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-emerald-500 shadow-lg active:scale-95 transition-transform flex items-center justify-center"
                >
                  <div className="w-12 h-12 bg-emerald-500 rounded-full"></div>
                </button>
              </div>
            )}

            {photo && (
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <img src={photo} alt="Selfie Presensi" className="w-full aspect-[3/4] object-cover" />
                <button 
                  type="button"
                  onClick={retakePhoto}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-slate-900/80 text-white rounded-full text-sm font-medium backdrop-blur-sm"
                >
                  Ganti Foto
                </button>
              </div>
            )}
            
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <div className="w-full p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-medium flex items-center gap-2">
              <CheckCircle size={18} /> Hadir
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={!photo || !selectedStudent || !className}
            className="w-full py-4 mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-colors"
          >
            KIRIM PRESENSI
          </button>
        </form>
      </div>
    </div>
  );
}

// Step 2
const diagnosticQuestions = [
  "Pernahkah kamu menggunakan Microsoft Excel atau Google Sheets?",
  "Menurutmu apa fungsi spreadsheet?",
  "Apa yang dimaksud dengan baris dan kolom?",
  "Apakah kamu pernah memasukkan data ke dalam tabel?",
  "Menurutmu bagaimana cara menghitung jumlah data secara otomatis?"
];

export function Diagnostik({ setStep, currentUser, saveUser }: { setStep: (s: number) => void, currentUser: UserData | null, saveUser: (u: UserData) => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = () => {
    if (Object.keys(answers).length < 5) {
      setErrorMsg("Yuk, lengkapi semua jawaban dulu sebelum lanjut!");
      return;
    }
    setErrorMsg(null);
    if (currentUser) {
      saveUser({ ...currentUser, diagnostic: answers, points: currentUser.points + 20 });
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Terima Kasih!</h2>
        <p className="text-lg text-slate-600 mb-8">
          Kamu tidak harus sudah bisa. Hari ini kita akan belajar dari dasar. Mari kita mulai petualangannya!
        </p>
        <button onClick={() => setStep(3)} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold">Lihat Tujuan Pembelajaran</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Cek Pengetahuan Awal</h2>
        <p className="text-slate-600">Jawab sejujurnya ya! Tidak ada jawaban yang salah, ini hanya untuk melihat sejauh mana kamu tahu.</p>
      </div>
      
      <div className="space-y-6 mb-6">
        {diagnosticQuestions.map((q, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <p className="font-medium text-slate-800 mb-4">{i + 1}. {q}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              {['Sudah bisa', 'Pernah mencoba', 'Belum tahu'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setAnswers({...answers, [i]: opt})}
                  className={`flex-1 py-2 px-4 rounded-xl border text-sm font-medium transition-all ${answers[i] === opt ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center font-medium">
          {errorMsg}
        </div>
      )}

      <button onClick={handleSubmit} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors">
        Selesai Menjawab
      </button>
    </div>
  );
}

// Step 3
export function Tujuan({ setStep }: { setStep: (s: number) => void }) {
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><BookOpen size={28} /></div>
          <h2 className="text-2xl font-bold text-slate-800">Tujuan Pembelajaran Kita</h2>
        </div>
        
        <p className="text-slate-600 mb-6 text-lg">Setelah pembelajaran hari ini, kamu diharapkan mampu:</p>
        
        <ul className="space-y-4 mb-8">
          {[
            "Menjelaskan pengertian spreadsheet.",
            "Mengenali fungsi baris, kolom, sel, dan range.",
            "Memasukkan dan mengedit data sederhana.",
            "Menggunakan format sederhana pada tabel.",
            "Menggunakan rumus sederhana.",
            "Menggunakan fungsi SUM, AVERAGE, MAX, dan MIN.",
            "Mengolah data sederhana menjadi informasi.",
            "Membuat tabel data sederhana secara mandiri."
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle className="text-emerald-500 mt-1 shrink-0" size={20} />
              <span className="text-slate-700">{item}</span>
            </li>
          ))}
        </ul>

        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
          <p className="text-amber-800 font-medium italic">
            "Jika kamu dapat membuat tabel dan menggunakan rumus sederhana dengan benar, berarti kamu sudah berhasil mencapai tujuan pembelajaran."
          </p>
        </div>
      </div>
    </div>
  );
}

// Step 4
export function Apersepsi({ setStep, currentUser, saveUser }: { setStep: (s: number) => void, currentUser: UserData | null, saveUser: (u: UserData) => void }) {
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState('');

  const handleAnswer = (ans: string) => {
    setSelected(ans);
    setAnswered(true);
    if (ans === 'B' && currentUser && !currentUser.completedSteps.includes(4)) {
      saveUser({ ...currentUser, points: currentUser.points + 10 });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Bayangkan Ini...</h2>
        <div className="prose prose-slate mb-8 text-lg text-slate-600 leading-relaxed">
          <p>
            Kamu menjadi bendahara kelas. Kamu memiliki data uang kas selama beberapa minggu dari 30 teman sekelasmu. 
            Jika dihitung satu per satu menggunakan kalkulator, tentu cukup melelahkan dan rawan salah hitung.
          </p>
          <p>
            Bagaimana jika komputer dapat membantu menghitungnya secara otomatis setiap kali ada yang membayar?
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl">
          <p className="font-bold text-slate-800 mb-4 text-center">Menurutmu, alat apa yang dapat membantu kita mengolah data tersebut?</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'A', label: 'Paint', icon: '🎨' },
              { id: 'B', label: 'Spreadsheet', icon: '📊' },
              { id: 'C', label: 'Pemutar Musik', icon: '🎵' },
              { id: 'D', label: 'Kamera', icon: '📷' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleAnswer(opt.id)}
                className={`p-4 rounded-xl border-2 text-left font-medium flex items-center gap-3 transition-all cursor-pointer ${
                  selected === opt.id 
                    ? opt.id === 'B' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-red-500 bg-red-50 text-red-700 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                } ${answered && opt.id !== selected && opt.id !== 'B' ? 'opacity-50' : ''} ${answered && opt.id === 'B' && selected !== 'B' ? 'border-emerald-500 bg-emerald-50' : ''}`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {answered && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 p-5 rounded-2xl ${selected === 'B' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {selected === 'B' ? (
              <p className="font-medium">✅ Tepat sekali! Spreadsheet dirancang khusus untuk menyimpan dan mengolah data seperti uang kas dengan sangat cepat.</p>
            ) : (
              <p className="font-medium">💡 Kurang tepat. Coba pilih lagi! Aplikasi ini jagonya berhitung dan mengelola data tabel.</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

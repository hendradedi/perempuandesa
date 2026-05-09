export const learningModules = [
  {
    id: 1,
    title: "Literasi Digital",
    description: "Kuasai teknologi untuk masa depan yang lebih cerah dan aman di dunia digital",
    icon: "📱",
    color: "primary",
    lessons: [
      {
        id: 1,
        title: "Penggunaan Perangkat & Aplikasi Dasar",
        duration: "15 menit",
        completed: false,
        content: "Di era digital, smartphone bukan sekadar alat komunikasi, tapi jendela dunia. Mengenal fitur dasar seperti pengaturan keamanan, pengelolaan memori, dan penggunaan aplikasi produktif adalah langkah awal menjadi warga digital yang cerdas.",
        keyPoints: [
          "Pengaturan privasi dan keamanan kunci layar",
          "Cara membersihkan memori HP agar tidak lambat",
          "Menggunakan aplikasi kalender dan catatan untuk pengingat",
          "Pencarian informasi yang benar di Google"
        ],
        tips: "Jangan pernah memberikan kode OTP (One Time Password) kepada siapapun, termasuk orang yang mengaku dari bank atau penyedia layanan.",
        game: {
          type: "truefalse",
          title: "Aman di Digital: Benar atau Salah?",
          questions: [
            { statement: "Memasang antivirus di HP itu membuang-buang memori.", answer: false, explanation: "Antivirus atau sistem keamanan bawaan sangat penting untuk melindungi data pribadi Anda." },
            { statement: "Aplikasi catatan bisa digunakan untuk daftar belanja.", answer: true, explanation: "Benar! Digitalisasi catatan kecil membantu Anda lebih terorganisir." },
            { statement: "OTP boleh dibagikan jika penelepon terdengar sangat sopan.", answer: false, explanation: "TIDAK BOLEH. OTP adalah rahasia pribadi yang tidak boleh dibagikan kepada siapapun." }
          ]
        }
      },
      {
        id: 2,
        title: "Pemanfaatan Internet & Medsos Sehat",
        duration: "20 menit",
        completed: false,
        content: "Media sosial bisa menjadi tempat belajar dan berbisnis yang luar biasa. Namun, kita harus waspada terhadap berita bohong (hoax) dan menjaga etika berkomunikasi digital (netiquette) agar tidak terjerat masalah hukum.",
        keyPoints: [
          "Cara cek kebenaran berita sebelum share",
          "Menjaga data pribadi di profil media sosial",
          "Etika berkomentar yang santun di ruang publik",
          "Mengatur waktu penggunaan gadget agar produktif"
        ],
        tips: "Saring sebelum sharing! Jika sebuah informasi terdengar terlalu bombastis, kemungkinan besar itu adalah hoax.",
        game: {
          type: "matching",
          title: "Saring Informasi Hoax",
          pairs: [
            { term: "Judul Bombastis", def: "Ciri khas berita hoax" },
            { term: "Cek Fakta", def: "Langkah sebelum membagikan berita" },
            { term: "Sumber Resmi", def: "Referensi informasi terpercaya" },
            { term: "Etika Digital", def: "Cara berkomentar yang baik" }
          ]
        }
      }
    ]
  },
  {
    id: 2,
    title: "Life Skill & Kesejahteraan Keluarga",
    description: "Tingkatkan keterampilan hidup untuk keluarga yang lebih harmonis dan sejahtera",
    icon: "🌱",
    color: "teal",
    lessons: [
      {
        id: 1,
        title: "Pengelolaan Keuangan Keluarga",
        duration: "15 menit",
        completed: false,
        content: "Mengelola keuangan keluarga adalah seni mengatur prioritas. Memisahkan kebutuhan dan keinginan, serta memiliki tabungan darurat, akan memberikan ketenangan pikiran bagi seluruh anggota keluarga.",
        keyPoints: [
          "Metode 50-30-20 (Kebutuhan-Ingin-Tabung)",
          "Mencatat pengeluaran harian sekecil apapun",
          "Menyiapkan dana pendidikan anak sejak dini",
          "Hindari pinjaman online yang tidak terdaftar OJK"
        ],
        tips: "Selalu prioritaskan kebutuhan pokok (makan, listrik, sekolah) sebelum memenuhi keinginan yang bersifat gaya hidup.",
        game: {
          type: "calculator",
          title: "Simulasi Tabungan Pendidikan",
          scenario: "Jika Anda menabung Rp5.000 setiap hari secara konsisten selama 1 tahun (365 hari).",
          question: "Berapa total tabungan yang terkumpul untuk biaya sekolah anak?",
          calculation: { daily: 5000, days: 365 },
          answer: 1825000,
          hint: "Kalikan tabungan harian dengan jumlah hari dalam setahun"
        }
      },
      {
        id: 2,
        title: "Komunikasi Interpersonal & Parenting",
        duration: "20 menit",
        completed: false,
        content: "Komunikasi yang sehat adalah fondasi hubungan harmonis. Mendengarkan secara aktif dan menggunakan bahasa yang non-konfrontatif (I-message) membantu menyelesaikan konflik keluarga tanpa kekerasan.",
        keyPoints: [
          "Teknik mendengarkan aktif tanpa memotong pembicaraan",
          "Cara menyampaikan perasaan tanpa menyalahkan (I-Message)",
          "Parenting positif: mendidik anak tanpa bentakan",
          "Menjaga keseimbangan peran suami dan istri di rumah"
        ],
        tips: "Ucapkan 'Terima kasih', 'Maaf', dan 'Tolong' secara rutin kepada anggota keluarga. Kata-kata sederhana ini memiliki kekuatan besar.",
        game: {
          type: "ordering",
          title: "Urutan Komunikasi Sehat",
          items: ["Menyalahkan Pasangan", "Mendengarkan Dulu", "Saling Maaf", "Bicara Tenang"],
          correctOrder: ["Mendengarkan Dulu", "Bicara Tenang", "Saling Maaf", "Bicara Tenang"]
        }
      }
    ]
  },
  {
    id: 3,
    title: "Ekonomi & Kewirausahaan Mandiri",
    description: "Ubah potensi lokal menjadi penghasilan tambahan bagi keluarga",
    icon: "💼",
    color: "coral",
    lessons: [
      {
        id: 1,
        title: "Kewirausahaan Perempuan Desa",
        duration: "20 menit",
        completed: false,
        content: "Setiap desa memiliki potensi unik. Dari hasil pertanian, kerajinan tangan, hingga kuliner khas. Mengolah bahan mentah menjadi produk bernilai tambah adalah kunci sukses wirausaha mandiri.",
        keyPoints: [
          "Petakan potensi bahan baku di sekitar Anda",
          "Inovasi produk tradisional ke kemasan modern",
          "Menghitung Harga Pokok Produksi (HPP) yang tepat",
          "Legalitas usaha kecil (NIB/P-IRT)"
        ],
        tips: "Mulai dari apa yang Anda bisa lakukan dengan baik hari ini. Modal tidak harus besar, yang penting konsisten.",
        game: {
          type: "matching",
          title: "Potensi Menjadi Produk",
          pairs: [
            { term: "Singkong Mentah", def: "Keripik Singkong Level" },
            { term: "Limbah Kain", def: "Kerajinan Tas/Dompet" },
            { term: "Susu Sapi Segar", def: "Yoghurt Rumahan" },
            { term: "Tanaman Obat", def: "Jamu Instan Serbuk" }
          ]
        }
      },
      {
        id: 2,
        title: "Pemasaran Digital & UMKM",
        duration: "25 menit",
        completed: false,
        content: "Gunakan smartphone Anda sebagai toko global. Melalui WhatsApp Business, Facebook, dan TikTok, produk desa bisa menjangkau pembeli di kota-kota besar bahkan luar negeri.",
        keyPoints: [
          "Cara memotret produk agar terlihat menarik (estetik)",
          "Menulis caption cerita produk (storytelling)",
          "Mengatur katalog di WhatsApp Business",
          "Membangun kepercayaan melalui testimoni pelanggan"
        ],
        tips: "Foto produk paling bagus diambil di dekat jendela pada pagi hari untuk mendapatkan cahaya alami.",
        game: {
          type: "truefalse",
          title: "Toko Digital: Benar atau Salah?",
          questions: [
            { statement: "Foto produk harus pakai kamera profesional.", answer: false, explanation: "Kamera smartphone saat ini sudah cukup untuk menghasilkan foto produk yang menjual." },
            { statement: "WhatsApp Business punya fitur katalog gratis.", answer: true, explanation: "Benar! Fitur ini memudahkan pembeli melihat semua produk Anda." },
            { statement: "Testimoni pembeli tidak penting.", answer: false, explanation: "Salah! Testimoni adalah bukti bahwa produk Anda terpercaya." }
          ]
        }
      }
    ]
  },
  {
    id: 4,
    title: "Kesetaraan & Responsif Gender",
    description: "Pahami kesetaraan hak untuk membangun masyarakat yang lebih adil",
    icon: "⚖️",
    color: "indigo",
    lessons: [
      {
        id: 1,
        title: "Konsep Gender & Keadilan Sosial",
        duration: "20 menit",
        completed: false,
        content: "Gender berbeda dengan jenis kelamin. Gender adalah peran sosial yang bisa berubah, sedangkan jenis kelamin adalah kodrat biologis. Memahami ini membantu kita berbagi peran secara adil dalam keluarga.",
        keyPoints: [
          "Perbedaan Sex (Biologis) dan Gender (Sosial)",
          "Menghapus stereotip 'Pekerjaan Perempuan vs Laki-laki'",
          "Pentingnya dukungan suami dalam pengasuhan anak",
          "Hak perempuan atas pendidikan dan pengembangan diri"
        ],
        tips: "Mendidik anak laki-laki dan perempuan dengan tanggung jawab yang sama di rumah adalah langkah awal kesetaraan.",
        game: {
          type: "matching",
          title: "Kodrat vs Peran Sosial",
          pairs: [
            { term: "Melahirkan", def: "Kodrat Biologis (Sex)" },
            { term: "Memasak", def: "Peran Sosial (Gender)" },
            { term: "Menyusui", def: "Kodrat Biologis (Sex)" },
            { term: "Mencuci Baju", def: "Peran Sosial (Gender)" }
          ]
        }
      }
    ]
  },
  {
    id: 5,
    title: "Pengarusutamaan Gender (PUG)",
    description: "Mendorong partisipasi perempuan dalam setiap kebijakan dan pembangunan desa",
    icon: "🤝",
    color: "teal",
    lessons: [
      {
        id: 1,
        title: "Perempuan dalam Pembangunan Desa",
        duration: "20 menit",
        completed: false,
        content: "Suara perempuan sangat penting dalam Musyawarah Desa (Musrenbangdes). Kebutuhan perempuan akan kesehatan, pendidikan anak, dan ekonomi harus masuk dalam prioritas anggaran desa.",
        keyPoints: [
          "Cara menyampaikan pendapat di forum desa",
          "Mengenal anggaran desa yang responsif gender",
          "Pentingnya keterwakilan perempuan di organisasi desa",
          "Menganalisis kebutuhan khusus perempuan di wilayah desa"
        ],
        tips: "Jangan ragu untuk hadir di Musrenbangdes. Suara Anda menentukan masa depan anak cucu Anda di desa.",
        game: {
          type: "truefalse",
          title: "Partisipasi: Benar atau Salah?",
          questions: [
            { statement: "Pembangunan desa hanya urusan bapak-bapak.", answer: false, explanation: "Setiap warga desa, termasuk perempuan, berhak menentukan arah pembangunan desa." },
            { statement: "Musrenbangdes adalah tempat usul kebutuhan warga.", answer: true, explanation: "Benar! Gunakan forum ini untuk mengusulkan program pemberdayaan perempuan." },
            { statement: "Perempuan boleh menjadi pengurus BPD atau LKD.", answer: true, explanation: "Benar! Keterlibatan perempuan di struktur desa sangat dianjurkan." }
          ]
        }
      }
    ]
  },
  {
    id: 6,
    title: "Penguatan Sosial & Kepemimpinan",
    description: "Bangun kepercayaan diri untuk menjadi pemimpin di komunitas Anda",
    icon: "👑",
    color: "rose",
    lessons: [
      {
        id: 1,
        title: "Membangun Kepercayaan Diri & Kepemimpinan",
        duration: "15 menit",
        completed: false,
        content: "Kepemimpinan dimulai dari kemampuan memimpin diri sendiri. Dengan kepercayaan diri yang kuat, perempuan desa bisa menjadi agen perubahan (agent of change) yang menginspirasi sesama.",
        keyPoints: [
          "Teknik berbicara di depan umum (public speaking)",
          "Mengenali potensi dan kelebihan diri sendiri",
          "Membangun jejaring sosial di tingkat desa",
          "Solidaritas antar perempuan desa"
        ],
        tips: "Fokus pada apa yang Anda kuasai. Keberanian muncul saat kita merasa kompeten.",
        game: {
          type: "matching",
          title: "Sifat Pemimpin Hebat",
          pairs: [
            { term: "Amanah", def: "Dapat dipercaya memegang janji" },
            { term: "Empati", def: "Peduli pada perasaan orang lain" },
            { term: "Berani", def: "Mau mencoba hal baru demi kebaikan" },
            { term: "Solutif", def: "Fokus pada solusi, bukan masalah" }
          ]
        }
      }
    ]
  },
  {
    id: 7,
    title: "Komunitas & Pendampingan",
    description: "Belajar bersama dan saling menguatkan dalam jaringan komunitas digital",
    icon: "👥",
    color: "amber",
    lessons: [
      {
        id: 1,
        title: "Belajar Berbasis Komunitas",
        duration: "15 menit",
        completed: false,
        content: "Belajar sendiri memang bagus, tapi belajar bersama jauh lebih cepat. Melalui forum SELARAS, Anda bisa bertanya, berbagi tips, dan mendapatkan pendampingan dari fasilitator ahli.",
        keyPoints: [
          "Manfaat berkelompok dalam usaha dan belajar",
          "Cara berdiskusi yang sehat di forum online",
          "Saling mendukung kesuksesan sesama perempuan",
          "Mencari mentor untuk pengembangan diri"
        ],
        tips: "Satu perempuan yang sukses bisa menginspirasi banyak orang. Mari sukses bersama!",
        game: {
          type: "truefalse",
          title: "Kolaborasi: Benar atau Salah?",
          questions: [
            { statement: "Kompetisi lebih baik daripada kolaborasi.", answer: false, explanation: "Dalam pemberdayaan, kolaborasi dan saling dukung justru mempercepat kemajuan bersama." },
            { statement: "Forum diskusi SELARAS tempat bertanya materi.", answer: true, explanation: "Benar! Jangan ragu bertanya jika ada materi yang kurang dipahami." },
            { statement: "Menyimpan ilmu sendiri bikin kita lebih hebat.", answer: false, explanation: "Salah! Berbagi ilmu justru akan mempertajam pemahaman kita sendiri." }
          ]
        }
      }
    ]
  }
];

export const quizData = {
  module1: [
    {
      id: 1,
      question: "Apa singkatan dari kode rahasia yang tidak boleh dibagikan kepada siapapun saat menggunakan aplikasi digital?",
      options: ["PIN", "KTP", "OTP", "URL"],
      correctAnswer: 2,
      explanation: "OTP (One Time Password) adalah kode rahasia yang hanya dikirimkan kepada Anda dan tidak boleh diketahui orang lain, termasuk pihak bank sekalipun."
    },
    {
      id: 2,
      question: "Apa langkah utama sebelum membagikan informasi dari media sosial agar tidak menyebar berita hoax?",
      options: ["Langsung bagikan agar cepat tahu", "Cek kebenaran berita melalui sumber resmi", "Ubah judulnya jadi lebih seru", "Biarkan saja orang lain yang cek"],
      correctAnswer: 1,
      explanation: "Saring sebelum sharing. Verifikasi melalui situs resmi atau portal berita terpercaya sangat penting untuk memutus rantai hoax."
    }
  ],
  module2: [
    {
      id: 1,
      question: "Dalam metode pengelolaan keuangan 50-30-20, porsi 50% sebaiknya digunakan untuk apa?",
      options: ["Tabungan masa depan", "Keinginan dan hiburan", "Kebutuhan pokok keluarga", "Cicilan barang elektronik"],
      correctAnswer: 2,
      explanation: "Idealnya 50% pendapatan digunakan untuk kebutuhan wajib yang tidak bisa ditunda seperti makan, listrik, dan biaya sekolah."
    },
    {
      id: 2,
      question: "Apa yang dimaksud dengan 'I-Message' dalam komunikasi keluarga?",
      options: ["Mengirim pesan lewat iPhone", "Bicara dengan menyalahkan pasangan", "Menyampaikan perasaan diri sendiri tanpa menghakimi", "Bicara dengan nada suara tinggi"],
      correctAnswer: 2,
      explanation: "I-Message fokus pada perasaan kita (Contoh: 'Saya merasa sedih saat rumah berantakan') bukan menyerang (Contoh: 'Kamu malas sekali')."
    }
  ],
  module3: [
    {
      id: 1,
      question: "Manakah yang merupakan langkah awal dalam menemukan ide usaha di desa?",
      options: ["Meminjam uang ke bank sebanyak mungkin", "Meniru usaha tetangga secara persis", "Memetakan potensi bahan baku di sekitar desa", "Menunggu ada investor dari luar datang"],
      correctAnswer: 2,
      explanation: "Memanfaatkan potensi lokal (bahan baku yang melimpah dan murah) adalah strategi terbaik bagi UMKM desa agar punya keunggulan harga."
    },
    {
      id: 2,
      question: "Fitur katalog produk secara GRATIS dapat ditemukan pada aplikasi apa?",
      options: ["WhatsApp Business", "Instagram Pribadi", "TikTok Biasa", "Facebook Group"],
      correctAnswer: 0,
      explanation: "WhatsApp Business menyediakan fitur Katalog yang memudahkan pembeli melihat semua daftar produk beserta harga secara rapi."
    }
  ],
  module4: [
    {
      id: 1,
      question: "Apa perbedaan mendasar antara 'Sex' dan 'Gender'?",
      options: ["Sama saja tidak ada beda", "Sex bersifat biologis (kodrat), Gender bersifat peran sosial", "Sex adalah peran sosial, Gender adalah biologis", "Sex hanya untuk laki-laki, Gender untuk perempuan"],
      correctAnswer: 1,
      explanation: "Sex ditentukan oleh Tuhan (biologis), sedangkan Gender dibentuk oleh budaya dan masyarakat mengenai peran laki-laki dan perempuan."
    }
  ],
  module5: [
    {
      id: 1,
      question: "Dimanakah forum terbaik bagi perempuan desa untuk mengusulkan program pembangunan yang responsif gender?",
      options: ["Arisan RT", "Musrenbangdes (Musyawarah Desa)", "Pasar Desa", "Grup WhatsApp Keluarga"],
      correctAnswer: 1,
      explanation: "Musrenbangdes adalah forum resmi di mana rencana pembangunan dan anggaran desa ditentukan secara partisipatif."
    }
  ],
  module6: [
    {
      id: 1,
      question: "Apa kunci utama membangun kepercayaan diri saat harus berbicara di depan umum?",
      options: ["Bicara secepat mungkin agar selesai", "Mengenali potensi diri dan menguasai materi", "Melihat ke bawah terus", "Tidak perlu persiapan sama sekali"],
      correctAnswer: 1,
      explanation: "Persiapan yang baik dan pemahaman terhadap kelebihan diri sendiri adalah fondasi rasa percaya diri."
    }
  ],
  module7: [
    {
      id: 1,
      question: "Apa manfaat utama bergabung dalam komunitas belajar seperti SELARAS?",
      options: ["Bisa mengobrol hal yang tidak penting", "Saling mendukung, berbagi pengalaman, dan maju bersama", "Hanya untuk pamer sertifikat", "Supaya terlihat sibuk saja"],
      correctAnswer: 1,
      explanation: "Dalam komunitas, kita mendapatkan dukungan sosial dan percepatan ilmu melalui pengalaman anggota lain."
    }
  ]
};
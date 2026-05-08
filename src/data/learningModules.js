export const learningModules = [
  {
    id: 1,
    title: "Kesehatan Reproduksi",
    description: "Memahami pentingnya kesehatan reproduksi sejak dini",
    icon: "🩺",
    color: "primary",
    lessons: [
      {
        id: 1,
        title: "Pengenalan Sistem Reproduksi",
        duration: "15 menit",
        completed: false,
        content: "Pelajaran dasar tentang anatomi dan fungsi sistem reproduksi pada wanita"
      },
      {
        id: 2,
        title: "Menstruasi dan Siklus Haid",
        duration: "20 menit",
        completed: false,
        content: "Memahami siklus menstruasi, perubahan hormonal, dan cara menjaga kesehatan selama haid"
      },
      {
        id: 3,
        title: "Pencegahan Infeksi Menular Seksual",
        duration: "25 menit",
        completed: false,
        content: "Informasi tentang penyakit menular seksual dan cara pencegahannya"
      }
    ]
  },
  {
    id: 2,
    title: "Kewirausahaan dan Ekonomi Kreatif",
    description: "Keterampilan berusaha dan mengelola keuangan untuk perempuan desa",
    icon: "💼",
    color: "coral",
    lessons: [
      {
        id: 1,
        title: "Dasar-Dasar Kewirausahaan",
        duration: "20 menit",
        completed: false,
        content: "Konsep dasar berusaha, identifikasi peluang usaha, dan perencanaan bisnis sederhana"
      },
      {
        id: 2,
        title: "Manajemen Keuangan Pribadi",
        duration: "15 menit",
        completed: false,
        content: "Teknik pengelolaan keuangan, tabungan, dan investasi untuk pemula"
      },
      {
        id: 3,
        title: "Pemasaran dan Penjualan Produk Lokal",
        duration: "25 menit",
        completed: false,
        content: "Strategi pemasaran produk hasil rumah tangga dan produk lokal melalui media sosial dan pasar tradisional"
      }
    ]
  }
];

export const quizData = {
  module1: [
    {
      id: 1,
      question: "Apa fungsi utama dari sistem reproduksi pada wanita?",
      options: [
        "Mencernakan makanan",
        "Menghasilkan hormon pertumbuhan",
        "Melakukan reproduksi dan melahirkan",
        "Mengatur suhu tubuh"
      ],
      correctAnswer: 2,
      explanation: "Sistem reproduksi pada wanita bertanggung jawab untuk proses reproduksi, termasuk produksi sel telur, pembuahan, dan kehamilan hingga melahirkan."
    },
    {
      id: 2,
      question: "Berapa lama rata-rata siklus menstruasi pada wanita dewasa?",
      options: [
        "14 hari",
        "21 hari", 
        "28 hari",
        "35 hari"
      ],
      correctAnswer: 2,
      explanation: "Siklus menstruasi normal berkisar antara 21-35 hari dengan rata-rata 28 hari, dihari pertama haid hingga hari pertama haid berikutnya."
    },
    {
      id: 3,
      question: "Yang berikut ini bukan merupakan cara pencegahan infeksi menular seksual?",
      options: [
        "Menggunakan kondom saat berhubungan seks",
        "Melakukan pemeriksaan kesehatan reproduksi secara rutin",
        "Mengonsumsi jamu tradisional sebagai obat",
        "Bertanya riwayat seks pasangan sebelum berhubungan"
      ],
      correctAnswer: 2,
      explanation: "Jamu tradisional tidak terbukti efektif sebagai pencegahan infeksi menular seksual. Penggunaan kondom dan pemeriksaan rutin adalah metode pencegahan yang terbukti."
    }
  ],
  module2: [
    {
      id: 1,
      question: "Apa yang dimaksud dengan modal usaha?",
      options: [
        "Uang untuk belanja kebutuhan keluarga",
        "Uang yang digunakan untuk memulai dan menjalankan usaha",
        "Tabungan untuk masa pensiun",
        "Uang untuk pembelian harta tetap seperti rumah"
      ],
      correctAnswer: 1,
      explanation: "Modal usaha adalah sumber dana yang digunakan untuk memulai usaha, membeli persediaan, menyewa tempat, dan membiayai operasional bisnis."
    },
    {
      id: 2,
      question: "Manakah contoh yang tepat dari pemisauan keuangan pribadi dan usaha?",
      options: [
        "Menggunakan dompet sama untuk belanja keluarga dan pembelian bahan usaha",
        "Membuka rekening bank terpisah untuk usaha dan pribadi",
        "Mencatat semua pemasukan dan pengeluaran dalam satu buku",
        "Mengambil uang dari kasus usaha untuk keperluan pribadi kapan saja"
      ],
      correctAnswer: 1,
      explanation: "Membuka rekening bank terpisah membantu memantau keuangan usaha dengan jelas, memudahkan pencatatan pajak, dan menghindari campur aduk keuangan pribadi dan usaha."
    },
    {
      id: 3,
      question: "Strategi pemasaran yang efektif untuk produk hasil rumah tangga di desa adalah?",
      options: [
        "Hanya mengandalkan pasar tradisional tanpa promosi",
        "Menggunakan media sosial untuk menunjukkan proses pembuatan dan testimoni pembeli",
        "Menjual dengan harga jauh di bawah modal untuk mencari pembeli",
        "Tidak perlu branding karena produk sudah bagus"
      ],
      correctAnswer: 1,
      explanation: "Media sosial seperti Facebook, Instagram, atau WhatsApp bisa digunakan untuk menunjukkan proses pembuatan, testimoni pembeli, dan menjangkau pasar yang lebih luas dengan biaya relatif rendah."
    }
  ]
};
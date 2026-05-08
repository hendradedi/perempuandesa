const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || process.env.OPENAI_MODEL || 'openai/gpt-4o-mini';
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1/chat/completions';

const buildPrompt = ({ moduleTitle, score, totalQuestions, percentage, passed, answers, userQuestion }) => {
  const answerSummary = (answers || [])
    .map((item) => {
      const status = item.isCorrect ? 'Benar' : 'Salah';
      return `${item.number}. ${status}\nPertanyaan: ${item.question}\nJawaban user: ${item.userAnswer}\nJawaban benar: ${item.correctAnswer}\nPenjelasan: ${item.explanation}`;
    })
    .join('\n\n');

  return `Anda adalah tutor belajar untuk perempuan desa Indonesia. Gunakan bahasa Indonesia yang sederhana, ramah, tidak menghakimi, dan berbasis aksi.

Data hasil kuis:
- Modul: ${moduleTitle}
- Skor: ${score}/${totalQuestions}
- Persentase: ${percentage}%
- Status lulus: ${passed ? 'Ya' : 'Tidak'}

Ringkasan jawaban:
${answerSummary}

Pertanyaan pengguna:
${userQuestion}

Instruksi jawaban:
1) Jelaskan penyebab kesalahan secara mudah dipahami.
2) Beri saran belajar praktis yang bisa dilakukan di rumah.
3) Jika diminta, berikan rencana belajar mingguan ringkas.
4) Maksimal 180 kata kecuali user meminta detail panjang.`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan.' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY belum dikonfigurasi di server.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const {
      userQuestion,
      moduleTitle,
      score,
      totalQuestions,
      percentage,
      passed,
      answers,
      chatHistory = []
    } = body || {};

    if (!userQuestion || !moduleTitle) {
      return res.status(400).json({ error: 'Data kuis atau pertanyaan belum lengkap.' });
    }

    const prompt = buildPrompt({
      moduleTitle,
      score,
      totalQuestions,
      percentage,
      passed,
      answers,
      userQuestion
    });

    const messages = [
      {
        role: 'system',
        content: 'Anda mentor belajar yang menulis jawaban praktis, sopan, dan mudah dimengerti.'
      },
      ...chatHistory
        .filter((item) => item && (item.role === 'user' || item.role === 'assistant') && item.content)
        .slice(-6),
      {
        role: 'user',
        content: prompt
      }
    ];

    const aiResponse = await fetch(OPENROUTER_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'https://perempuandesa.vercel.app',
        'X-Title': process.env.OPENROUTER_APP_NAME || 'Perempuan Desa App'
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages,
        temperature: 0.4
      })
    });

    const aiData = await aiResponse.json();

    if (!aiResponse.ok) {
      const upstreamError = aiData?.error?.message || 'Layanan AI gagal merespons.';
      return res.status(500).json({ error: upstreamError });
    }

    const reply = aiData?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(500).json({ error: 'Respons AI kosong. Coba lagi.' });
    }

    return res.status(200).json({ reply });
  } catch {
    return res.status(500).json({ error: 'Terjadi kesalahan saat memproses AI.' });
  }
}

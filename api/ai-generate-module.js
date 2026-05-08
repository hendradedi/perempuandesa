const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1/chat/completions';

const buildPrompt = ({ topic, targetLevel, learningGoal, lessonCount }) => `Anda adalah instructional designer untuk pembelajaran perempuan desa Indonesia.
Buatkan draft modul yang praktis, ramah pemula, dan bisa dipakai di aplikasi belajar.

Topik modul: ${topic}
Level peserta: ${targetLevel}
Tujuan belajar: ${learningGoal}
Jumlah pelajaran: ${lessonCount}

Balas HANYA JSON valid dengan bentuk:
{
  "title": "...",
  "description": "...",
  "icon": "📘",
  "color": "primary|teal|coral",
  "lessons": [
    {"title":"...","duration":"15 menit","content":"..."}
  ],
  "quizQuestions": [
    {
      "question": "...",
      "options": ["...","...","...","..."],
      "correctAnswer": 0,
      "explanation": "..."
    }
  ],
  "improvementNotes": ["...", "..."]
}

Aturan:
- lessons minimal ${lessonCount} item.
- quizQuestions tepat 3 item.
- correctAnswer harus index valid 0-3.
- Bahasa Indonesia sederhana, aksi praktis, tanpa istilah rumit.`;

const safeJsonParse = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');

    if (start >= 0 && end > start) {
      return JSON.parse(text.slice(start, end + 1));
    }

    throw new Error('Format JSON dari AI tidak valid.');
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan.' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY belum dikonfigurasi.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const topic = body?.topic?.trim();
    const targetLevel = body?.targetLevel?.trim() || 'Pemula';
    const learningGoal = body?.learningGoal?.trim() || 'Peserta paham dasar topik dan bisa praktik';
    const lessonCount = Math.max(3, Math.min(7, Number(body?.lessonCount) || 3));

    if (!topic) {
      return res.status(400).json({ error: 'Topik modul wajib diisi.' });
    }

    const messages = [
      {
        role: 'system',
        content: 'Anda pembuat kurikulum pembelajaran yang menulis JSON valid sesuai format.'
      },
      {
        role: 'user',
        content: buildPrompt({ topic, targetLevel, learningGoal, lessonCount })
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
      return res.status(500).json({ error: aiData?.error?.message || 'AI gagal membuat draft modul.' });
    }

    const rawContent = aiData?.choices?.[0]?.message?.content?.trim();

    if (!rawContent) {
      return res.status(500).json({ error: 'Respons AI kosong.' });
    }

    const moduleDraft = safeJsonParse(rawContent);

    return res.status(200).json({ moduleDraft });
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Terjadi kesalahan saat generate modul.' });
  }
}

// Vercel Serverless Function for Live Presence Heartbeat and Online Students
// Handles POST /api/presence and GET /api/presence

interface OnlineRecord {
  id: string;
  name: string;
  heroType: 'boy' | 'girl';
  avatar: string;
  subject: string;
  currentActivity: string;
  stars: number;
  lastSeen: number;
}

// Global cache (persists across warm serverless invocations)
declare global {
  var __globalActiveStudents: Map<string, OnlineRecord> | undefined;
}

if (!globalThis.__globalActiveStudents) {
  globalThis.__globalActiveStudents = new Map<string, OnlineRecord>();
}

const activeMap = globalThis.__globalActiveStudents;

function cleanOld() {
  const cutoff = Date.now() - 45000; // 45 seconds
  for (const [id, rec] of activeMap.entries()) {
    if (rec.lastSeen < cutoff) {
      activeMap.delete(id);
    }
  }
}

export default function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  cleanOld();

  if (req.method === 'POST') {
    const body = req.body || {};
    const id = body.id || body.studentId;
    const name = body.name;
    const isGirl = body.isGirl === true || body.heroType === 'girl';
    const avatar = body.avatar || (isGirl ? '👧' : '👦');
    const subject = body.subject || 'الرِّيَاضِيَّاتُ';
    const currentActivity = body.currentActivity || 'يَتَعَلَّمُ الآنَ';
    const stars = Number(body.stars) || 0;

    if (id && name) {
      activeMap.set(id, {
        id,
        name: String(name).slice(0, 35),
        heroType: isGirl ? 'girl' : 'boy',
        avatar,
        subject,
        currentActivity,
        stars,
        lastSeen: Date.now()
      });
    }

    const students = Array.from(activeMap.values());
    return res.status(200).json({
      success: true,
      onlineCount: students.length,
      students
    });
  }

  // GET request - return online students
  const students = Array.from(activeMap.values());
  return res.status(200).json({
    count: students.length,
    students
  });
}

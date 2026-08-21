import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { category = '', sector = '', urgency = '', notes = '', providers = [] } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    // Roman Urdu & Synonym Mapping Dictionary
    const keywordMap = {
      painter: ['paint', 'rang', 'painter', 'safaid', 'deewar', 'color'],
      plumber: ['plumber', 'nal', 'pipe', 'leak', 'geyser', 'tank', 'tap', 'pani'],
      electrician: ['electrician', 'bijli', 'wire', 'light', 'ups', 'breaker', 'fan', 'socket'],
      'ac-repair': ['ac', 'fridge', 'cooling', 'gas', 'servicing', 'inverter', 'chiller'],
      carpenter: ['carpenter', 'lakri', 'wood', 'door', 'darwaza', 'lock', 'khat', 'bed', 'table'],
      tutor: ['tutor', 'teacher', 'padhana', 'math', 'study', 'parhai', 'school', 'sir']
    };

    // Smart Fallback Matcher
    const runFallbackFilter = () => {
      const userQuery = `${category} ${notes}`.toLowerCase().trim();
      if (!userQuery) return [];

      return providers.filter((p) => {
        const pCat = (p.category || '').toLowerCase();
        const pBio = (p.bio || '').toLowerCase();
        const pName = (p.name || p.fullName || '').toLowerCase();

        // Direct Text Match
        const directMatch = pCat && userQuery.includes(pCat);

        // Roman Urdu Mapping Match
        let dictionaryMatch = false;
        for (const [catKey, keywords] of Object.entries(keywordMap)) {
          if (pCat.includes(catKey)) {
            dictionaryMatch = keywords.some((kw) => userQuery.includes(kw));
            if (dictionaryMatch) break;
          }
        }

        return directMatch || dictionaryMatch;
      });
    };

    // 1. If GROQ_API_KEY is not present, use Smart Local Fallback
    if (!apiKey) {
      console.warn('GROQ_API_KEY missing. Running Local Smart Roman-Urdu Matcher.');
      return NextResponse.json({ result: runFallbackFilter().slice(0, 3) });
    }

    // 2. Groq AI Engine Call
    const systemPrompt = `You are an expert AI service matcher for Islamabad/Rawalpindi.
Analyze the user query (which might be in Roman Urdu, Urdu, or English) and return strictly matching provider IDs.

User Query: "${notes || category}"
Location: "${sector}"

Providers Available:
${JSON.stringify(providers.map((p) => ({ id: p.id, name: p.name || p.fullName, category: p.category, bio: p.bio })))}

Rules:
1. "ghr paint krwana hai", "rang krna hai" -> Must match PAINTER.
2. "nal kharab hai", "geyser" -> Must match PLUMBER.
3. NEVER return Tutors for home maintenance requests.
4. Return strictly valid JSON format: {"recommendedIds": ["id1", "id2"]}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: systemPrompt }],
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      const parsed = JSON.parse(data.choices[0].message.content);
      const recommended = providers.filter((p) => parsed.recommendedIds?.includes(p.id));

      if (recommended.length > 0) {
        return NextResponse.json({ result: recommended });
      }
    }

    // Fallback if AI gives 0 matches
    return NextResponse.json({ result: runFallbackFilter().slice(0, 3) });

  } catch (err) {
    console.error('API Match Route Error:', err);
    return NextResponse.json({ error: 'Failed to process match' }, { status: 500 });
  }
}
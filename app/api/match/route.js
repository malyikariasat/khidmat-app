import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { category, sector, urgency, budgetMin, budgetMax, notes, providers } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;

    // Direct Smart Fallback Matcher (Agar AI Key fail ho ya empty ho)
    const runFallbackFilter = () => {
      return providers.filter((p) => {
        const pCategory = (p.category || '').toLowerCase();
        const pSector = (p.sector || '').toLowerCase();
        const pBio = (p.bio || '').toLowerCase();
        
        const qCategory = (category || '').toLowerCase();
        const qSector = (sector || '').toLowerCase().split(',')[0]; // e.g., "G-9" from "G-9, Islamabad"
        const qNotes = (notes || '').toLowerCase();

        const matchCategory = !qCategory || pCategory.includes(qCategory) || qNotes.includes(pCategory);
        const matchSector = !qSector || pSector.includes(qSector);
        
        return matchCategory || matchSector;
      });
    };

    if (!apiKey) {
      const fallbackResults = runFallbackFilter();
      return NextResponse.json({ result: fallbackResults.slice(0, 3) });
    }

    const systemPrompt = `You are a local service matcher for Islamabad and Rawalpindi.
Select maximum 3 best provider IDs from this list based on user query:
${JSON.stringify(providers.map((p) => ({ id: p.id, name: p.name, category: p.category, sector: p.sector, rate: p.rateMin || p.hourlyRate, bio: p.bio })))}

User Query Parameters:
- Selected Category: "${category}"
- Selected Sector: "${sector}"
- Urgency Level: "${urgency}"
- Budget Range: PKR ${budgetMin} to ${budgetMax}
- Notes/Description: "${notes}"

Rules:
1. Prioritize category and sector matches first.
2. If notes mention another service (e.g., "tutor"), include matching categories.
3. Return ONLY a valid JSON object strictly formatted as: {"recommendedIds": ["id1", "id2"]}`;

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

    // AI Fallback execution if AI returns zero matched array
    const fallbackResults = runFallbackFilter();
    return NextResponse.json({ result: fallbackResults.slice(0, 3) });

  } catch (err) {
    console.error('API Match Route Error:', err);
    return NextResponse.json({ error: 'Failed to process match' }, { status: 500 });
  }
}
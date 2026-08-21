import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt, providers } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Free AI API (Groq/Gemini/OpenAI compatible call)
    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback simple keyword match agar API key na ho
      const matched = providers.filter(
        (p) =>
          p.category.toLowerCase().includes(prompt.toLowerCase()) ||
          p.sector.toLowerCase().includes(prompt.toLowerCase()) ||
          p.bio?.toLowerCase().includes(prompt.toLowerCase())
      );
      return NextResponse.json({ result: matched.slice(0, 3), fallback: true });
    }

    const systemPrompt = `You are an AI assistant for 'Khidmat' app in Islamabad/Rawalpindi.
Analyze the user's issue and return ONLY a JSON array of provider IDs that best match their problem from this list:
${JSON.stringify(providers.map((p) => ({ id: p.id, name: p.name, category: p.category, sector: p.sector, bio: p.bio })))}

User Issue: "${prompt}"

Respond ONLY with JSON format like: {"recommendedIds": ["id1", "id2"]}`;

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
    const parsed = JSON.parse(data.choices[0].message.content);
    const recommended = providers.filter((p) => parsed.recommendedIds.includes(p.id));

    return NextResponse.json({ result: recommended });
  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}
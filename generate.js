export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { source, context } = req.body || {};

  if (!source || source.trim().length < 40) {
    return res.status(400).json({ error: 'Source content is too short.' });
  }

  const systemPrompt = `You repurpose long-form content into platform-native posts for solo creators. You will be given source content and optionally an audience/niche.
Return ONLY valid JSON, no markdown fences, no commentary, matching exactly this shape:
{
  "thread": ["tweet 1 text", "tweet 2 text", "tweet 3 text", "tweet 4 text"],
  "linkedin": "single linkedin post as one string, 3-5 short paragraphs, no hashtags spam",
  "instagram": "single instagram caption as one string, casual tone, 2-4 short lines plus up to 5 relevant hashtags at the end",
  "newsletter": "single short newsletter blurb, 2-3 sentences, written to intro the full piece and drive a click"
}
Rules:
- thread: 4 to 6 tweets, each under 240 characters, first tweet is a hook, do not number them yourself.
- Keep everything grounded in the actual source content, do not invent facts.
- Match tone to the audience if one is given.
- Output nothing but the JSON object.`;

  const userMsg = `Audience/niche: ${context || 'general audience, infer from content'}

Source content:
${source}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMsg }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || 'The AI provider returned an error.',
      });
    }

    const textBlock = (data.content || []).map((b) => b.text || '').join('');
    const cleaned = textBlock.replace(/```json|```/g, '').trim();

    let outputs;
    try {
      outputs = JSON.parse(cleaned);
    } catch (e) {
      return res.status(500).json({ error: 'Could not read the generated result. Try again.' });
    }

    return res.status(200).json({ outputs });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unexpected server error.' });
  }
}

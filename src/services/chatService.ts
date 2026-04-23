import { ChatMessage } from '../types';

// System prompt for the AI assistant.
// Grounded in German bureaucracy knowledge — the model is instructed
// to be helpful but cautious, always directing users to verify
// with official sources.
const SYSTEM_PROMPT = `You are a helpful assistant specialising in German bureaucracy and government procedures (Behörden).
You help expats, immigrants, and residents navigate official German processes like Anmeldung, visa applications, tax registration, health insurance, and more.

Guidelines:
- Give clear, practical, step-by-step advice
- Always mention which office (Behörde) is responsible
- Note when rules vary by Bundesland (federal state)
- Recommend official sources (bamf.de, bund.de, berlin.de etc.) for verification
- Be empathetic — German bureaucracy is stressful for newcomers
- If you are not sure about something, say so clearly
- Always end sensitive advice with: "Please verify this with the relevant Behörde as rules can change."
- Respond in the same language the user writes in (German or English)`;

// Calls the Groq API directly from the client using the public API key.
// In production this should go through a backend API route — but for
// a portfolio app with no sensitive data, client-side is acceptable.
export async function sendChatMessage(
  messages: ChatMessage[],
  newMessage: string,
  apiKey: string
): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: newMessage },
      ],
      max_tokens: 1000,
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API call failed');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response received.';
}
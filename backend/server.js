import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));

function buildPrompt(objective) {
  // RETO 1: mejorar el prompt y justificar el cambio con evidencia.
  return `Crea un plan de tareas para: ${objective}. Devuelve solamente JSON válido con la propiedad "tasks", un arreglo de objetos con "title", "description", "priority" (high, medium o low) y "estimatedMinutes" (número).`;
}

app.post('/api/generate-tasks', async (req, res) => {
  const objective = typeof req.body?.objective === 'string' ? req.body.objective.trim() : '';
  if (!objective || objective.length > 1200) return res.status(400).json({ error: 'Objetivo inválido (1 a 1200 caracteres).' });
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'Configura GEMINI_API_KEY en backend/.env' });

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: buildPrompt(objective) }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
      }),
      signal: AbortSignal.timeout(30000),
    });
    const payload = await response.json();
    if (!response.ok) return res.status(502).json({ error: `Gemini rechazó la solicitud (${response.status}).`, detail: payload.error?.message });
    const rawText = payload.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('') || '';
    if (!rawText) return res.status(502).json({ error: 'Gemini no devolvió contenido de texto.' });
    // RETO 2: implementar validación estricta de esquema antes de responder.
    // RETO 3: diseñar casos de prueba y un registro de evaluación de resultados.
    return res.json({ rawText });
  } catch (error) {
    return res.status(502).json({ error: error.name === 'TimeoutError' ? 'Gemini tardó demasiado.' : 'No se pudo contactar a Gemini.' });
  }
});

app.listen(Number(process.env.PORT || 3001), () => console.log('API ESPOL lista en http://localhost:3001'));

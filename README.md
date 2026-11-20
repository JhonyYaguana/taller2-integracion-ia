# Coding Bootcamp ESPOL — Laboratorio de Integración de IA

Proyecto base de aprendizaje: React + Vite + Node.js + Gemini. Identidad tipográfica educativa de Coding Bootcamp ESPOL (no contiene el logotipo institucional oficial).

## Requisitos
- Node.js 20 o superior
- Clave de Gemini API con acceso al modelo configurado

## 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env y configurar GEMINI_API_KEY
npm run dev
```
En Windows PowerShell, usar `Copy-Item .env.example .env`.

## 2. Frontend (segunda terminal)
```bash
cd frontend
npm install
npm run dev
```
Abrir http://localhost:5173. Vite reenvía `/api` a `http://localhost:3001` en desarrollo.

## Retos del taller
1. **Prompt engineering:** mejorar `buildPrompt()` en `backend/server.js`, comparar al menos 2 variantes y documentar resultados.
2. **Respuesta estructurada:** validar de forma estricta el JSON generado, comprobar título, descripción, prioridad y duración, y manejar resultados inválidos sin bloquear React.
3. **Evaluación de IA:** ejecutar al menos 5 escenarios, registrar calidad/relevancia y demostrar manejo de errores.

## Consideraciones
- El backend inicial solicita JSON a Gemini, pero **todavía no valida su esquema**: esto es parte del reto 2.
- La interfaz inicial utiliza `JSON.parse()` directamente; los estudiantes deben robustecer el flujo.
- No publicar `backend/.env` ni exponer la API key en React.
- Desplegar solamente `frontend/dist` en S3 o Amplify **no despliega el backend**; para uso público se requiere un backend accesible por HTTPS y configurar la URL de API/CORS.
- El modelo Gemini disponible puede variar por cuenta y fecha; si falla, revisar `GEMINI_MODEL`.

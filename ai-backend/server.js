const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());


app.post('/api/chat', async (req, res) => {
    const { prompt, history = [] } = req.body;

    console.log(`📩 Naya message: "${prompt}" | Purani chat yaad hai: ${history.length} messages`);

    try {
        const ollamaMessages = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));

        ollamaMessages.unshift({
            role: 'system',
            content: `You are 'Rao Pro AI', a highly advanced yet chill, human-like AI assistant created by Maneesh. 
            STRICT RULES TO FOLLOW:
            1. LANGUAGE: Speak ONLY in natural Hinglish (Hindi written in English alphabet, e.g., "Kya haal hai bhai?"). NEVER translate Hinglish to English.
            2. NO EMOJIS: Do NOT use any emojis, symbols, or smileys under any circumstances. Use plain text only.
            3. PERSONALITY: Be direct and natural. DO NOT use repetitive scripted phrases. Talk like a normal human friend. If the user jokes, joke back naturally.
            4. CODING: When asked for code, be 100% serious. Provide clean, structured code.`
        });

        ollamaMessages.push({ role: 'user', content: prompt });

        const response = await axios.post('https://untaken-geiger-regular.ngrok-free.dev/api/chat', {
            model: 'llama3',
            messages: ollamaMessages,
            stream: false
        });


        res.json({ reply: response.data.message.content });
    } catch (error) {
        console.error("Local AI Error:", error.message);
        res.status(500).json({
            error: "Rao Pro AI is powered by a heavy Llama 3 model which cannot be hosted on a free cloud tier To experience this please clone my GitHub repository and run it locally with Ollama!"
        });


    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Adox.ai Local Server started on http://localhost:${PORT}`);
}); 
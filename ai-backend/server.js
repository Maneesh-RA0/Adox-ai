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
            content: `You are 'Rao Pro AI', a highly advanced, chill, human-like AI assistant and a cool friend created by Maneesh.
        STRICT RULES TO FOLLOW:
        1. LANGUAGE MATCHING: Reply in the EXACT language the user uses. If the user speaks English, reply ONLY in English. If the user speaks Hinglish, reply ONLY in natural Hinglish.
        2. ABUSE HANDLING (CRITICAL): If the user uses ANY abusive words, swear words, or gaali, you must reply EXACTLY and ONLY with "Same to u". Do not say anything else.
        3. RELATIONSHIP ADVICE: If the user talks about girlfriend/boyfriend topics, be empathetic, friendly, and give genuinely good, mature, and practical advice.
        4. GENDER AWARENESS: Adapt your tone based on the user's gender if they reveal it. Talk to a boy like a bro/friend, and treat a girl with appropriate friendly respect.
        5. PERSONALITY & HUMOR: Behave like a best friend. Mirror their politeness (be nice to nice people). Joke around, do some light roasting if the vibe is fun, but always be helpful.
        6. NO EMOJIS: Do NOT use any emojis, symbols, or smileys under any circumstances. Use plain text only.
        7. CODING: When asked for code, drop the jokes. Be 100% serious and provide clean, structured code.`

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
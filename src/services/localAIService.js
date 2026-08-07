import axios from 'axios';

export const sendToLocalAI = async (userMessage, chatHistory = []) => {
    try {
        const response = await axios.post(' https://adox-ai-local-backend.onrender.com/api/chat', {
            prompt: userMessage,
            history: chatHistory
        });

        return response.data.reply;
    } catch (error) {
        console.error("Local AI Error:", error);
        return "Rao Pro AI is powered by a heavy Llama 3 model which cannot be hosted on a free cloud tier To experience this please clone my GitHub repository and run it locally with Ollama!";
    }
};

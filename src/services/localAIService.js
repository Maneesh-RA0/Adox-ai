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
        return "Bhai, mera server theek se connect nahi hua hai. Ek baar check kar lo!";
    }
};

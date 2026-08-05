import { db } from './firebaseConfig';
import {
    collection,
    doc,
    setDoc,
    getDocs,
    getDoc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';

export const saveChatToDB = async (userId, chatId, aiModel, messages, chatTitle = "New Chat") => {
    try {
        if (!userId || !chatId) throw new Error("⚠ Security Alert: Missing UserId or ChatId");

        const chatRef = doc(db, "users", userId, "chats", chatId);

        await setDoc(chatRef, {
            chatId: chatId,
            aiModel: aiModel,
            title: chatTitle,
            messages: messages,
            updatedAt: serverTimestamp(),
        }, { merge: true });

        return { success: true };
    } catch (error) {
        console.error("❌ Error saving chat:", error);
        throw error;
    }
};

export const getUserChatHistory = async (userId) => {
    try {
        if (!userId) throw new Error("⚠ Security Alert: Missing UserId");

        const chatsRef = collection(db, "users", userId, "chats");

        const q = query(chatsRef, orderBy("updatedAt", "desc"));
        const snapshot = await getDocs(q);

        const chatList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return chatList;
    } catch (error) {
        console.error("❌ Error fetching chat history:", error);
        return [];
    }
};

export const getSpecificChat = async (userId, chatId) => {
    try {
        if (!userId || !chatId) throw new Error("⚠ Security Alert: Missing UserId or ChatId");

        const chatRef = doc(db, "users", userId, "chats", chatId);
        const docSnap = await getDoc(chatRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("⚠ Chat nahi mili database mein!");
            return null;
        }
    } catch (error) {
        console.error("❌ Error fetching specific chat:", error);
        throw error;
    }
};

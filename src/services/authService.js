import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const authService = {

  registerUser: async (name, username, password) => {
    try {
      const cleanUsername = username.toLowerCase().trim();
      const hiddenEmail = `${cleanUsername}@raopro.ai`;

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', cleanUsername));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return { success: false, error: 'Yeh username pehle se kisi ke paas hai. Kripya naya username try karein!' };
      }

      const result = await createUserWithEmailAndPassword(auth, hiddenEmail, password);
      const user = result.user;

      await updateProfile(user, { displayName: name });

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: name,
        username: cleanUsername,
        email: hiddenEmail,
        createdAt: new Date(),
        role: 'user',
        plan: 'free',
        tokens: 0
      });

      const token = await user.getIdToken();
      localStorage.setItem('authToken', token);

      return { success: true, user };
    } catch (error) {
      console.error('Registration Error:', error);
      if (error.code === 'auth/weak-password') {
        return { success: false, error: 'Password kam se kam 6 characters ka hona chahiye.' };
      }
      return { success: false, error: 'Account create nahi ho paya. Server check karein.' };
    }
  },

  loginWithUsername: async (username, password) => {
    try {
      const cleanUsername = username.toLowerCase().trim();
      const hiddenEmail = `${cleanUsername}@raopro.ai`;

      const result = await signInWithEmailAndPassword(auth, hiddenEmail, password);

      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);

      return { success: true, user: result.user };
    } catch (error) {
      console.error('Login Error:', error);
      return { success: false, error: 'Username ya Password galat hai. Kripya theek se check karein.' };
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
      return { success: true };
    } catch (error) {
      console.error('Sign-Out Error:', error);
      return { success: false, error: error.message };
    }
  },

  getCurrentUser: () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }
};

export default authService;

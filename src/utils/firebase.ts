import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import { LoveStory } from '../types';

// Firebase configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyAj0q3EHP2Hk8dgZRvYmgbD7Yn1gBY5H9U",
  authDomain: "amorrrrr-b0018.firebaseapp.com",
  projectId: "amorrrrr-b0018",
  storageBucket: "amorrrrr-b0018.firebasestorage.app",
  messagingSenderId: "338316686696",
  appId: "1:338316686696:web:5c0ea92b8f3ce51abe12dd",
  measurementId: "G-XNH4ZGQLLB"
};

// Initialize Firebase safely (avoid re-initialization)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics initialized safely in browser environment
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics unsupported in some browser modes
  });
}

/**
 * Upload an image or video file to Firebase Storage and get a permanent download URL
 */
export async function uploadMediaToFirebase(
  file: File,
  folder: 'months' | 'future' | 'general' = 'general',
  onProgress?: (percent: number) => void
): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storageRef = ref(storage, `${folder}/${timestamp}_${safeName}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (onProgress && snapshot.totalBytes > 0) {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(Math.round(progress));
        }
      },
      (error) => {
        console.warn('Firebase Storage upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Save story to Firebase Firestore in the cloud
 */
export async function saveStoryToCloud(
  story: LoveStory,
  docId: string = 'main_story'
): Promise<boolean> {
  try {
    const docRef = doc(db, 'love_stories', docId);
    // Sanitize to clean JSON (removes undefined fields which Firestore rejects)
    const sanitizedStory = JSON.parse(JSON.stringify(story));
    await setDoc(docRef, {
      ...sanitizedStory,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Could not save story to Firestore:', error);
    return false;
  }
}

/**
 * Load story from Firebase Firestore
 */
export async function loadStoryFromCloud(
  docId: string = 'main_story'
): Promise<LoveStory | null> {
  try {
    const docRef = doc(db, 'love_stories', docId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as LoveStory;
      return data;
    }
    return null;
  } catch (error) {
    console.warn('Could not load story from Firestore:', error);
    return null;
  }
}

/**
 * Subscribe to real-time changes in Firestore
 */
export function subscribeToStoryInCloud(
  docId: string = 'main_story',
  onUpdate: (story: LoveStory) => void
): () => void {
  try {
    const docRef = doc(db, 'love_stories', docId);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as LoveStory;
        onUpdate(data);
      }
    }, (err) => {
      console.warn('Firestore subscription warning:', err);
    });
  } catch (err) {
    console.warn('Error setting up Firestore listener:', err);
    return () => {};
  }
}

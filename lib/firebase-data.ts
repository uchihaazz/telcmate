import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  setDoc
} from 'firebase/firestore';

// Collection references
const exercisesCollection = collection(db, 'exercises');
const usersCollection = collection(db, 'users');
const settingsCollection = collection(db, 'settings');

// Exercise operations
export async function getAllExercises() {
  const snapshot = await getDocs(exercisesCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getExercisesByType(type: string) {
  const q = query(exercisesCollection, where('type', '==', type));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getExercisesByTypeAndPart(type: string, part: string) {
  const q = query(
    exercisesCollection,
    where('type', '==', type),
    where('part', '==', part)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getExerciseById(id: string) {
  const docRef = doc(exercisesCollection, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function addExercise(exercise: any) {
  const docRef = await addDoc(exercisesCollection, exercise);
  return { id: docRef.id, ...exercise };
}

export async function updateExercise(id: string, updatedExercise: any) {
  const docRef = doc(exercisesCollection, id);
  await updateDoc(docRef, updatedExercise);
  return { id, ...updatedExercise };
}

export async function deleteExercise(id: string) {
  const docRef = doc(exercisesCollection, id);
  await deleteDoc(docRef);
  return true;
}

// User operations
export async function initializeUsers() {
  const snapshot = await getDocs(usersCollection);
  if (snapshot.empty) {
    const defaultUsers = [
      {
        name: "Admin User",
        code: "admin123",
        isAdmin: true,
        isModerator: false,
        isDemo: false,
        role: "Admin",
      },
      {
        name: "Moderator User",
        code: "mod123",
        isAdmin: false,
        isModerator: true,
        isDemo: false,
        role: "Moderator",
      },
      {
        name: "Test User",
        code: "user123",
        isAdmin: false,
        isModerator: false,
        isDemo: false,
        role: "Student",
      },
      {
        name: "Demo User",
        code: "demo123",
        isAdmin: false,
        isModerator: false,
        isDemo: true,
        role: "Student",
      },
    ];

    for (const user of defaultUsers) {
      await addDoc(usersCollection, user);
    }
  }
}

export async function getUserByCode(code: string) {
  const q = query(usersCollection, where('code', '==', code));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
  return null;
}

// Settings operations
export async function initializeSettings() {
  const snapshot = await getDocs(settingsCollection);
  if (snapshot.empty) {
    const defaultSettings = {
      siteTitle: "Telc Mate",
      allowRegistration: false,
      maintenanceMode: false,
      defaultTimeLimit: {
        reading: 20,
        listening: 15,
        grammar: 15,
        writing: 30,
      },
      language: "en",
      showCorrectAnswers: true,
      allowTestRetake: true,
      demoAccessLevel: "limited",
    };

    await setDoc(doc(settingsCollection, 'system'), defaultSettings);
  }
}

export async function getSystemSettings() {
  const docRef = doc(settingsCollection, 'system');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
} 
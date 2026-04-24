import { getApp, getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();

function getSecondaryFirebaseApp() {
  const appName = "palugada-secondary-auth";
  return getApps().some((app) => app.name === appName) ? getApp(appName) : initializeApp(firebaseConfig, appName);
}

export async function registerResellerAuth({ name, email, password }) {
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  if (name) {
    await updateProfile(credential.user, { displayName: name });
  }
  return credential.user;
}

export async function loginResellerAuth(email, password) {
  const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return credential.user;
}

export async function loginWithGooglePopup() {
  const credential = await signInWithPopup(firebaseAuth, googleProvider);
  return credential.user;
}

export async function getResellerProfileByUid(uid) {
  const snapshot = await getDoc(doc(firestore, "resellers", uid));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function saveResellerProfile(uid, data) {
  const payload = {
    ...data,
    authUid: uid,
    updatedAt: serverTimestamp(),
  };

  await setDoc(
    doc(firestore, "resellers", uid),
    {
      ...payload,
      createdAt: data.createdAt || serverTimestamp(),
    },
    { merge: true }
  );

  const snapshot = await getDoc(doc(firestore, "resellers", uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function getResellerOrders(uid) {
  const snapshot = await getDocs(query(collection(firestore, "orders"), where("resellerId", "==", uid)));

  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

export async function createResellerAuthByAdmin({ name, email, password }) {
  const secondaryApp = getSecondaryFirebaseApp();
  const secondaryAuth = getAuth(secondaryApp);
  const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password);

  if (name) {
    await updateProfile(credential.user, { displayName: name });
  }

  await signOut(secondaryAuth);

  return credential.user;
}

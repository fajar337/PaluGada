import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

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
export const firebaseStorage = getStorage(firebaseApp);

export async function uploadPaymentProof(orderId, file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `payment-proofs/${orderId}/${Date.now()}-${safeName}`;
  const proofRef = ref(firebaseStorage, path);
  const snapshot = await uploadBytes(proofRef, file, {
    contentType: file.type || "application/octet-stream",
  });
  const downloadUrl = await getDownloadURL(snapshot.ref);

  return {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    storagePath: path,
    downloadUrl,
    uploadedAt: new Date().toISOString(),
  };
}

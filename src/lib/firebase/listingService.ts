import { db } from "./config";
import { collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";

export async function getActiveListings() {
  const now = Timestamp.now();
  const listingsRef = collection(db, "listings");

  // Query: Status must be active AND expiryDate must be in the future
  const q = query(
    listingsRef,
    where("status", "==", "active"),
    where("expiryDate", ">", now),
    orderBy("expiryDate", "asc"), // Sort by expiry
    orderBy("isPremium", "desc")  // But keep Premium on top
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
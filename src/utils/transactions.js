// import { getFirestore } from 'firebase/firestore';
// cloud storage
// import { getStorage } from "firebase/storage";



import { initializeApp } from 'firebase/app';
import { getFirestore, arrayUnion, collection, doc, addDoc, getDocs, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { firebaseKey } from '../config'

const firebaseConfig = {
  apiKey: firebaseKey.apiKey,
  authDomain: firebaseKey.authDomain,
  projectId: firebaseKey.projectId,
  storageBucket: firebaseKey.storageBucket,
  messagingSenderId: firebaseKey.messagingSenderId,
  appId: firebaseKey.appId,
  measurementId: firebaseKey.measurementId
};


// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });
// const auth = initializeAuth(app,);
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const createTransaction = async (user, transaction) => {
  if (user) {
    const usersRef = doc(firestore, 'users', user.uid);
    const transactionsRef = collection(usersRef, 'transactions');

    // Add the transaction and get its ID
    const docRef = await addDoc(transactionsRef, transaction);

    // Update the corresponding category's transactionID array
    const categoryRef = doc(firestore, `users/${user.uid}/categories/${transaction.categoryID}`);
    await updateDoc(categoryRef, {
      transactionID: arrayUnion(docRef.id)
    });
  }
};

const readTransactions = (user, setTransactions, setCategories ) => {
  if (user) {
    // console.log('user:', user)
    const usersRef = doc(firestore, 'users', user.id);
    const transactionsRef = collection(usersRef, 'transactions');
    const categoriesRef = collection(usersRef, 'categories');
    // console.log('transactionsRef:', transactionsRef)
    // Fetch categories first
    getDocs(categoriesRef).then((categorySnapshot) => {
      const categories = {};
      categorySnapshot.forEach((doc) => {
        categories[doc.id] = doc.data().name;
      });

      // Fetch transactions and add categoryName field
      onSnapshot(transactionsRef, (querySnapshot) => {
        const transactions = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          transactions.push({
            ...data,
            id: doc.id,
            categoryName: categories[data.categoryID] || 'Unknown'
          });
        });
        console.log('transactions:', transactions);
        console.log('categories:', categories);
        setTransactions(transactions);
        setCategories(categories);

      });
    }
  );
  }
};

// Create a Category
const createCategory = async (user, category) => {
  if (user) {
    const usersRef = doc(firestore, 'users', user.uid);
    const categoriesRef = collection(usersRef, 'categories');
    await addDoc(categoriesRef, category);
  }
};

// Read Categories
const readCategories = (user, setCategories) => {
  if (user) {
    const usersRef = doc(firestore, 'users', user.uid);
    const categoriesRef = collection(usersRef, 'categories');
    onSnapshot(categoriesRef, (querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push({ ...doc.data(), id: doc.id });
      });
      setCategories(categories);
    });
  }
};

// Update a Category
const updateCategory = async (user, categoryId, updatedCategory) => {
  if (user) {
    const categoryRef = doc(firestore, `users/${user.uid}/categories/${categoryId}`);
    await updateDoc(categoryRef, updatedCategory);
  }
};

// Delete a Category
const deleteCategory = async (user, categoryId) => {
  if (user) {
    const categoryRef = doc(firestore, `users/${user.uid}/categories/${categoryId}`);
    await deleteDoc(categoryRef);
  }
};

export { createTransaction, readTransactions, createCategory, readCategories, updateCategory, deleteCategory };

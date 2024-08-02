// src/utils/transactions.js

// import { getFirestore } from 'firebase/firestore';
// cloud storage
// import { getStorage } from "firebase/storage";
// import { useContext } from 'react'
// import { UserDataContext } from '../context/UserDataContext'
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  arrayUnion,
  collection,
  doc,
  addDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
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

const createTransaction = async (user, transaction, setTransactions, setCategories) => {
  if (user) {
    const usersRef = doc(firestore, 'users', user.id);
    const transactionsRef = collection(usersRef, 'transactions');

    // Add the transaction and get its ID
    const docRef = await addDoc(transactionsRef, transaction);

    // Update the corresponding category's transactionID array
    const categoryRef = doc(firestore, `users/${user.id}/categories/${transaction.categoryID}`);
    await updateDoc(categoryRef, {
      transactionID: arrayUnion(docRef.id)
    });
    // Refresh data
    await readTransactions(user, setTransactions, setCategories);
  }
};


const readTransactions = async (user, setTransactions, setCategories) => {
  // const { userData } = useContext(UserDataContext)
  if (user) {

    const usersRef = doc(firestore, 'users', user.id);
    const tempTransactions = [];
    const tempCategories = [];
    console.log('==1==');
    const categoriesRef = collection(usersRef, 'categories');
    const transactionsRef = collection(usersRef, 'transactions');

    getDocs(categoriesRef).then((categorySnapshot) => {
      categorySnapshot.forEach((doc) => {
        let transactionID = doc.data().transactionID;
        tempCategories.push({
          ...doc.data(),
          id: doc.id,
          transactions: Array.isArray(transactionID) ? transactionID.length : 0
        });
      });

      // Fetch transactions and add categoryName field
      onSnapshot(transactionsRef, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const matchedCategory = tempCategories.find(category => category.id === data.categoryID);
          const categoryName = matchedCategory.name ? matchedCategory.name : 'Unknown';
          tempTransactions.push({
            ...data,
            id: doc.id,
            categoryName: categoryName
          });
        });
        console.log('transactions:', tempTransactions);
        console.log('categories:', tempCategories);
        setTransactions(tempTransactions);
        setCategories(tempCategories);
        console.log('Database read performed!');
      });

    });

  }
};

// Create a Category
const createCategory = async (user, category, setTransactions, setCategories) => {
  if (user) {
    const usersRef = doc(firestore, 'users', user.id);
    const categoriesRef = collection(usersRef, 'categories');
    await addDoc(categoriesRef, category);
    await readTransactions(user, setTransactions, setCategories);
  }
};

// Read Categories
const readCategories = async (user, setCategories) => {
  if (user) {
    console.log('user:', user);
    const usersRef = doc(firestore, 'users', user.id);
    const categories = [];

    const categoriesRef = collection(usersRef, 'categories');
    getDocs(categoriesRef).then((categorySnapshot) => {

      categorySnapshot.forEach((doc) => {

        let transactionID = doc.data().transactionID;
        console.log('transactionID:', transactionID);
        categories.push({
          ...doc.data(),
          id: doc.id,
          transactions: Array.isArray(transactionID) ? transactionID.length : 0
        });
      });
    });
    setCategories(categories);
  }
};

// Update a Category
const updateCategory = async (user, categoryId, name, setTransactions, setCategories) => {
  if (user) {
    const categoryRef = doc(firestore, `users/${user.id}/categories/${categoryId}`);
    await updateDoc(categoryRef, { name: name });
    await readTransactions(user, setTransactions, setCategories);
  }
};

// Delete a Category
const deleteCategory = async (user, categoryId, setTransactions, setCategories) => {
  if (user) {
    const categoryRefDel = doc(firestore, `users/${user.id}/categories/${categoryId}`);
    await deleteDoc(categoryRefDel);
    // await readCategories(user, setCategories);
    // await readTransactions(user, setTransactions, setCategories);
    await readTransactions(user, setTransactions, setCategories);
  }
};

const updateTransaction = async (user, transactionId, updatedTransaction, setTransactions, setCategories) => {
  if (user) {
    const transactionRef = doc(firestore, `users/${user.id}/transactions/${transactionId}`);
    await updateDoc(transactionRef, updatedTransaction);

    // Refresh data
    await readTransactions(user, setTransactions, setCategories);
  }
};

export {
  createTransaction,
  readTransactions,
  createCategory,
  readCategories,
  updateCategory,
  deleteCategory,
  updateTransaction
};

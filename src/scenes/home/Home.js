import React, { useEffect, useState, useContext, useLayoutEffect } from 'react'
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import IconButton from '../../components/IconButton'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { firestore } from '../../firebase/config'
import { doc, onSnapshot } from 'firebase/firestore';
import { colors, fontSize } from '../../theme'
import { UserDataContext } from '../../context/UserDataContext'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { sendNotification } from '../../utils/SendNotification'
import { useAtom } from 'jotai'
import { transactionsAtom } from '../../utils/atom'
import { format, isSameMonth, addMonths } from 'date-fns';


export default function Home() {
  const navigation = useNavigation()
  const [token, setToken] = useState('')
  const { userData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark? styles.darkContent : styles.lightContent,
    text: isDark? colors.white : colors.primaryText
  }
  const [transactions] = useAtom(transactionsAtom)



  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="plus"
          color={colors.lightPurple}
          size={24}
          onPress={() => headerButtonPress()}
          containerStyle={{paddingRight: 15}}
        />
      ),
    });
  }, [navigation]);

  const headerButtonPress = () => {
    navigation.navigate('ModalStacks', {
      screen: 'addTransaction',
      // screen: 'Post',
      params: {
        data: userData,
        from: 'Home screen'
      }
    })
  }

  useEffect(() => {
    const tokensRef = doc(firestore, 'tokens', userData.id);
    const tokenListner = onSnapshot(tokensRef, (querySnapshot) => {
      if (querySnapshot.exists) {
        const data = querySnapshot.data()
        setToken(data)
      } else {
        console.log("No such document!");
      }
    })
    return () => tokenListner()
  }, [])

  const onNotificationPress = async() => {
    const res = await sendNotification({
      title: 'Hello',
      body: 'This is some something 👋',
      data: 'something data',
      token: token.token
    })
    console.log(res)
  }


  // Functions for Home page display

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState([]);
  const [summary, setSummary] = useState({ expense: 0, income: 0, balance: 0 });
  const [categorySummary, setCategorySummary] = useState([]);

  useEffect(() => {
    loadCurrentMonthTransactions(selectedDate);
  }, [selectedDate, transactions]);

  const handlePreviousMonth = () => {
    setSelectedDate(addMonths(selectedDate, -1));
  };

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const convertFirestoreTimestampToDate = (timestamp) => {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  };

  const loadCurrentMonthTransactions = (date) => {
    const filteredTransactions = transactions.filter(transaction =>
      isSameMonth(convertFirestoreTimestampToDate(transaction.date), date)
    );
    setCurrentMonthTransactions(filteredTransactions);
    setSummary(calculateSummary(filteredTransactions));
    setCategorySummary(getCategorySummary(filteredTransactions));
  };

  const calculateSummary = (transactions) => {
    const summary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.amount < 0) {
          acc.expense += Math.abs(transaction.amount);
        } else {
          acc.income += transaction.amount;
        }
        return acc;
      },
      { expense: 0, income: 0 }
    );
    summary.balance = summary.income - summary.expense;
    return summary;
  };

  const getCategorySummary = (transactions) => {
    const categoryMap = transactions.reduce((acc, transaction) => {
      if (transaction.amount < 0) {
        if (!acc[transaction.categoryName]) {
          acc[transaction.categoryName] = 0;
        }
        acc[transaction.categoryName] += Math.abs(transaction.amount);
      }
      return acc;
    }, {});

    const totalExpense = Object.values(categoryMap).reduce((acc, amount) => acc + amount, 0);

    return Object.entries(categoryMap).map(([categoryName, amount]) => ({
      categoryName,
      percentage: ((amount / totalExpense) * 100).toFixed(2) + '%',
      amount: `$${amount.toFixed(2)}`
    }));
  };

  const isCurrentMonth = isSameMonth(selectedDate, new Date());

  return (
    <ScreenTemplate>
    {/* <ScrollView style={styles.main}> */}
    {/* {transactions.map((transaction) => (
      <View key={transaction.id} style={styles.transactionItem}>
        <Text>Date: {new Date(transaction.date.seconds * 1000).toLocaleDateString()}</Text>
        <Text>Amount: {transaction.amount}</Text>
        <Text>Category: {transaction.categoryName}</Text>
        <Text>Note: {transaction.note}</Text>
      </View>
    ))} */}
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePreviousMonth}>
          <Text style={styles.arrow}>&#9664;</Text>
        </TouchableOpacity>
        <Text style={styles.month}>{format(selectedDate, 'MMMM, yyyy')}</Text>
        <TouchableOpacity onPress={handleNextMonth} disabled={isCurrentMonth}>
          <Text style={[styles.arrow, isCurrentMonth && styles.disabled]}>&#9654;</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Expense</Text>
          <Text style={styles.summaryValue}>${summary.expense.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Balance</Text>
          <Text style={styles.summaryValue}>${summary.balance.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={styles.summaryValue}>${summary.income.toFixed(2)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => headerButtonPress()}>
        <Text style={styles.addButtonText}>+ Add transaction</Text>
      </TouchableOpacity>
      {currentMonthTransactions.length === 0 ? (
        <Text style={styles.noTransactionsText}>No transactions found</Text>
      ) : null}
      <View style={styles.categoryList}>
        <FlatList
          data={categorySummary}
          keyExtractor={(item) => item.categoryName}
          ListHeaderComponent={() => (
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryHeaderText}>Category</Text>
              <Text style={styles.categoryHeaderText}>Percentage</Text>
              <Text style={styles.categoryHeaderText}>Amount</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.categoryItem}>
              <Text style={styles.categoryText}>{item.categoryName}</Text>
              <Text style={styles.categoryText}>{item.percentage}</Text>
              <Text style={styles.categoryText}>{item.amount}</Text>
            </View>
          )}
        />
      </View>
    </View>
    {/* </ScrollView> */}
  </ScreenTemplate>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  arrow: {
    fontSize: 24,
    color: '#4a5568',
  },
  disabled: {
    color: '#cbd5e0',
  },
  month: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#4a5568',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#f56565',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  noTransactionsText: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#4a5568',
    fontSize: 16,
  },
  categoryList: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 8,
    marginBottom: 8,
  },
  categoryHeaderText: {
    flex: 1,
    fontWeight: 'bold',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
  },
});

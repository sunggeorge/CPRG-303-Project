import React, { useEffect, useState, useContext, useLayoutEffect } from 'react'
import { Text, View, ScrollView, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import IconButton from '../../components/IconButton'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { firestore } from '../../firebase/config'
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { colors, fontSize } from '../../theme'
import { UserDataContext } from '../../context/UserDataContext'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { sendNotification } from '../../utils/SendNotification'
import { getKilobyteSize } from '../../utils/functions'
import { useAtom } from 'jotai'
import { transactionsAtom } from '../../utils/atom'
import { format, addMonths, isSameMonth } from 'date-fns'
import { TouchableOpacity } from 'react-native-gesture-handler'


export default function History() {
  const [transactions] = useAtom(transactionsAtom)
  const navigation = useNavigation()
  const [token, setToken] = useState('')
  const { userData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark? styles.darkContent : styles.lightContent,
    text: isDark? colors.white : colors.primaryText
  }

  // ***Month selector
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState([])


  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <IconButton
  //         icon="align-right"
  //         color={colors.lightPurple}
  //         size={24}
  //         onPress={() => headerButtonPress()}
  //         containerStyle={{paddingRight: 15}}
  //       />
  //     ),
  //   });
  // }, [navigation]);

  // const headerButtonPress = () => {
  //   alert('Tapped header button')
  // }

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

  // ***Month selector
  useEffect(() => {
    loadCurrentMonthTransactions(selectedDate)
  }, [selectedDate, transactions])

  const handlePreviousMonth = () => {
    setSelectedDate(addMonths(selectedDate, -1))
  }

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1))
  }

  const convertFirestoreTimestampToDate = (timestamp) => {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
  } 

  const loadCurrentMonthTransactions = (date) => {
    const filteredTransactions = transactions.filter(transaction =>
      isSameMonth(convertFirestoreTimestampToDate(transaction.date), date)
     )
     setCurrentMonthTransactions(filteredTransactions)
  }

// Assuming transactions is an array of transaction objects
const sortedTransactions = transactions.sort((a, b) => b.date.seconds - a.date.seconds);

// *****
const isCurrentMonth = isSameMonth(selectedDate, new Date())

  return (
    <ScreenTemplate>
      {/* *** */}
      <View style={styles.monthSelector}>
      <TouchableOpacity onPress={handlePreviousMonth}>
        <Text style={styles.arrow}>&#9664;</Text>
      </TouchableOpacity>
      <Text style={styles.month}>{format(selectedDate, 'MMMM, yyyy')}</Text>
      <TouchableOpacity onPress={handleNextMonth} disabled={isCurrentMonth}>
        <Text style={[styles.arrow, isCurrentMonth && styles.disabled]}>&#9654;</Text>
      </TouchableOpacity>
    </View>
      
      <ScrollView style={styles.main}>
      {sortedTransactions.map((transaction) => (
        <View key={transaction.id} style={styles.transactionItem}>
          <Text>Date: {new Date(transaction.date.seconds * 1000).toLocaleDateString()}</Text>
          <Text>Amount: {transaction.amount}</Text>
          <Text>Category: {transaction.categoryName}</Text>
          <Text>Note: {transaction.note}</Text>
        </View>
      ))}

      </ScrollView>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  lightContent: {
    backgroundColor: colors.lightyellow,
    padding: 20,
    borderRadius: 5,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  darkContent: {
    backgroundColor: colors.gray,
    padding: 20,
    borderRadius: 5,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  main: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: fontSize.xxxLarge,
    marginBottom: 20,
    textAlign: 'center'
  },
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
  transactionItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.lightPurple,
    borderRadius: 5,
    marginBottom: 10,
  },
  // ***
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10
  },
  arrow: {
    fontSize: 20,
    color: colors.primary
  },
  month: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  disabled: {
    color: '#ccc'
  }

})

import React, { useEffect, useState, useContext, useLayoutEffect } from 'react'
import { Text, View, ScrollView, StyleSheet } from 'react-native'
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
import { getKilobyteSize } from '../../utils/functions'
import { useAtom } from 'jotai'
import { transactionsAtom } from '../../utils/atom'


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

// Assuming transactions is an array of transaction objects
const sortedTransactions = transactions.sort((a, b) => b.date.seconds - a.date.seconds);


  return (
    <ScreenTemplate>
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
  }
})

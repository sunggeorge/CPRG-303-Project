import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconButton from '../../components/IconButton';
import ScreenTemplate from '../../components/ScreenTemplate';
import Button from '../../components/Button';
import { firestore } from '../../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { colors, fontSize } from '../../theme';
import { UserDataContext } from '../../context/UserDataContext';
import { ColorSchemeContext } from '../../context/ColorSchemeContext';
import { sendNotification } from '../../utils/SendNotification';
import { useAtom } from 'jotai';
import { categoriesAtom } from '../../utils/atom';

export default function ManageCategory() {
  const navigation = useNavigation();
  const [token, setToken] = useState('');
  const { userData } = useContext(UserDataContext);
  const { scheme } = useContext(ColorSchemeContext);
  const isDark = scheme === 'dark';
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText,
  };
  const [categories] = useAtom(categoriesAtom);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="edit"
          color={colors.lightPurple}
          size={24}
          onPress={() => headerButtonPress()}
          containerStyle={{ paddingRight: 15 }}
        />
      ),
    });
  }, [navigation]);

  const headerButtonPress = () => {
    navigation.navigate('ModalStacks2', {
      screen: 'addCategory',
      params: {
        data: userData,
        from: 'Manage Category screen',
      },
    });
  };

  useEffect(() => {
    const tokensRef = doc(firestore, 'tokens', userData.id);
    const tokenListener = onSnapshot(tokensRef, (querySnapshot) => {
      if (querySnapshot.exists) {
        const data = querySnapshot.data();
        setToken(data);
      } else {
        console.log('No such document!');
      }
    });
    return () => tokenListener();
  }, []);

  const onNotificationPress = async () => {
    const res = await sendNotification({
      title: 'Hello',
      body: 'This is some something 👋',
      data: 'something data',
      token: token.token,
    });
    console.log(res);
  };

  return (
    <ScreenTemplate>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {categories.map((category) => (
          <View key={category.id} style={styles.transactionItem}>
            <Text>Name: {category.name}</Text>
            <Text>Transactions: {category.transactions}</Text>
          </View>
        ))}
      </ScrollView>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 50, // Ensure space for keyboard
    backgroundColor: '#fff',
    flexGrow: 1,
  },
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
  transactionItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.lightPurple,
    borderRadius: 5,
    marginBottom: 10,
  },
});

import React, { useState, useEffect, useContext } from 'react'
import { UserDataContext } from '../../context/UserDataContext'
import { Text, View, StyleSheet, TextInput, TouchableOpacity  } from 'react-native'
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native'
import { colors, fontSize } from 'theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { HomeTitleContext } from '../../context/HomeTitleContext'
import {useAtom} from 'jotai'
import { categoriesAtom } from '../../utils/atom';
import { createTransaction } from '../../utils/transactions'
// import { storage } from '../../utils/Storage'
// import moment from 'moment'

export default function AddTransaction() {
  const route = useRoute()
  // const { data, from } = route.params
  const { scheme } = useContext(ColorSchemeContext)
  // const [date, setDate] = useState('')
  const { setTitle } = useContext(HomeTitleContext)
  const { userData } = useContext(UserDataContext)
  const navigation = useNavigation()
  const [categories] = useAtom(categoriesAtom)
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark? styles.darkContent:styles.lightContent,
    text: isDark? colors.white : colors.primaryText
  }

  useEffect(() => {
    console.log('Add transaction screen')
    // loadStorage()
  }, [])

  useFocusEffect(() => {
    // setTitle(data.fullName)
    setTitle('Add Transaction')
  });

  const [categoryID, setCategoryID] = useState(categories[0].id);
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('expenses');
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');
  const [show, setShow] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false); // Hide the picker after selecting a date
    setDate(currentDate);
  };

  const handleSubmit = async () => {
    if (userData && amount > 0) {
      const transaction = {
        categoryID: categoryID,
        date: date,
        amount: type == 'expenses'? -1 * parseFloat(amount): parseFloat(amount),
        note: note
      };
      await createTransaction(userData, transaction);
      navigation.goBack();
    }
  };

  // const testFunction = async () => {
    // let tempTransaction = {
    //   categoryID: 'jJPPS0unA7WR3H6s7DAG', //transportation
    //   date: new Date(),
    //   amount: 100,
    //   note: 'test'
    // }
    // createTransaction(userData, tempTransaction)

  // };

  console.log('categories:', categories)
  console.log('categoryID:', categoryID)

  return (
    <ScreenTemplate>
      <View style={[styles.container, colorScheme.content]}>
        <Text style={[styles.field, {color: colorScheme.text}]}>Add New Transaction</Text>

        <Text style={[styles.field, {color: colorScheme.text}]}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoryID}
            style={styles.picker}
            onValueChange={(itemValue) => setCategoryID(itemValue)}
          >
            {categories.map((category) => (
              <Picker.Item key={category.id} label={category.name} value={category.id} />
            ))}
          </Picker>
        </View>

        <Text style={[styles.field, { color: colorScheme.text }]}>Date</Text>
        <TouchableOpacity onPress={() => setShow(true)} style={styles.dateButton}>
          <Text style={styles.dateText}>{date.toDateString()}</Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <Text style={[styles.field, {color: colorScheme.text}]}>Type</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity style={styles.radioOption} onPress={() => setType('expenses')}>
            <View style={[styles.radioButton, type === 'expenses' && styles.radioButtonSelected]} />
            <Text style={[styles.radioLabel, {color: colorScheme.text}]}>Expenses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioOption} onPress={() => setType('credit')}>
            <View style={[styles.radioButton, type === 'credit' && styles.radioButtonSelected]} />
            <Text style={[styles.radioLabel, {color: colorScheme.text}]}>Credit</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.field, {color: colorScheme.text}]}>Amount</Text>
        <TextInput
          style={[styles.input, {color: colorScheme.text, borderColor: colorScheme.border}]}
          keyboardType="numeric"
          placeholder="Enter amount"
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />

        <Text style={[styles.field, {color: colorScheme.text}]}>Note</Text>
        <TextInput
          style={[styles.input, {color: colorScheme.text, borderColor: colorScheme.border}]}
          placeholder="Enter note"
          value={note}
          onChangeText={(text) => setNote(text)}
        />

        <View style={{ width: '100%' }}>
          <Button
            label="Submit"
            color={colors.primary}
            onPress={handleSubmit}
          />
          <Button
            label="Cancel"
            color={colors.secondary}
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  field: {
    marginBottom: 10,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#000',
  },
  radioLabel: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

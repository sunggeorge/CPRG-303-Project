import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ScreenTemplate from '../../components/ScreenTemplate';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { colors, fontSize } from 'theme';
import { ColorSchemeContext } from '../../context/ColorSchemeContext';
import { HomeTitleContext } from '../../context/HomeTitleContext';
import { useAtom } from 'jotai';
import { categoriesAtom, transactionsAtom } from '../../utils/atom';
import { createCategory, updateTransaction, deleteCategory } from '../../utils/transactions';
import { UserDataContext } from '../../context/UserDataContext';

export default function AddCategory() {
  const navigation = useNavigation();
  const { scheme } = useContext(ColorSchemeContext);
  const { setTitle } = useContext(HomeTitleContext);
  const { userData } = useContext(UserDataContext);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [transactions, setTransactions] = useAtom(transactionsAtom);

  const isDark = scheme === 'dark';
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText,
  };

  // State for managing category actions
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [updatedAmount, setUpdatedAmount] = useState('');
  const [updatedNote, setUpdatedNote] = useState('');

  useEffect(() => {
    setTitle('Manage Categories');
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a valid category name.');
      return;
    }

    const newCategory = {
      name: newCategoryName,
      transactionID: [],
    };

    try {
      await createCategory(userData, newCategory, setTransactions, setCategories);
      setNewCategoryName('');
      Alert.alert('Success', 'Category created successfully.');
    } catch (error) {
      console.error('Error creating category:', error);
      Alert.alert('Error', 'Failed to create category.');
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category to delete.');
      return;
    }

    try {
      await deleteCategory(userData, selectedCategory, setTransactions, setCategories);
      setSelectedCategory('');
      Alert.alert('Success', 'Category deleted successfully.');
    } catch (error) {
      console.error('Error deleting category:', error);
      Alert.alert('Error', 'Failed to delete category.');
    }
  };

  const handleUpdateTransaction = async () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category to update.');
      return;
    }

    if (!selectedTransaction) {
      Alert.alert('Error', 'Please select a transaction to update.');
      return;
    }

    if (!updatedAmount.trim() || isNaN(updatedAmount)) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    try {
      const updatedTransaction = {
        amount: parseFloat(updatedAmount),
        note: updatedNote,
      };

      await updateTransaction(userData, selectedTransaction, updatedTransaction, setTransactions);
      setUpdatedAmount('');
      setUpdatedNote('');
      Alert.alert('Success', 'Transaction updated successfully.');
    } catch (error) {
      console.error('Error updating transaction:', error);
      Alert.alert('Error', 'Failed to update transaction.');
    }
  };

  const getTransactionsForCategory = () => {
    return transactions.filter((transaction) => transaction.categoryID === selectedCategory);
  };

  return (
    <ScreenTemplate>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.container, colorScheme.content]}>
          {/* Create New Category */}
          <Text style={[styles.title, { color: colorScheme.text }]}>Create New Category</Text>
          <TextInput
            style={[styles.input, { color: colorScheme.text }]}
            placeholder="Enter new category name"
            placeholderTextColor={colors.grayLight}
            value={newCategoryName}
            onChangeText={setNewCategoryName}
          />
          <Button label="Create Category" color={colors.primary} onPress={handleCreateCategory} />

          {/* Delete Existing Category */}
          <Text style={[styles.title, { color: colorScheme.text }]}>Delete Existing Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            >
              {categories.map((category) => (
                <Picker.Item key={category.id} label={category.name} value={category.id} />
              ))}
            </Picker>
          </View>
          <Button label="Delete Category" color={colors.secondary} onPress={handleDeleteCategory} />

          {/* Update Existing Transaction in Category */}
          <Text style={[styles.title, { color: colorScheme.text }]}>Update Transaction in Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setSelectedCategory(itemValue);
                setSelectedTransaction('');
              }}
            >
              {categories.map((category) => (
                <Picker.Item key={category.id} label={category.name} value={category.id} />
              ))}
            </Picker>
          </View>

          <Text style={[styles.title, { color: colorScheme.text }]}>Select Transaction</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedTransaction}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedTransaction(itemValue)}
            >
              {getTransactionsForCategory().map((transaction) => (
                <Picker.Item
                  key={transaction.id}
                  label={`Amount: ${transaction.amount}, Note: ${transaction.note}`}
                  value={transaction.id}
                />
              ))}
            </Picker>
          </View>

          <TextInput
            style={[styles.input, { color: colorScheme.text }]}
            placeholder="Enter updated amount"
            placeholderTextColor={colors.grayLight}
            value={updatedAmount}
            keyboardType="numeric"
            onChangeText={setUpdatedAmount}
          />
          <TextInput
            style={[styles.input, { color: colorScheme.text }]}
            placeholder="Enter updated note"
            placeholderTextColor={colors.grayLight}
            value={updatedNote}
            onChangeText={setUpdatedNote}
          />
          <Button label="Update Transaction" color={colors.tertiary} onPress={handleUpdateTransaction} />
        </View>
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
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: fontSize.large,
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f7f7f7',
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
  darkContent: {
    backgroundColor: colors.darkInput,
  },
  lightContent: {
    backgroundColor: colors.white,
  },
});

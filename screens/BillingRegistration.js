// screens/BillingRegistration.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Picker, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const BillingRegistration = () => {
  const [amount, setAmount] = useState('');
  const [clientName, setClientName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 10 }, (_, index) => new Date().getFullYear() - index);

  const handleRegisterBilling = async () => {
    if (!amount || !clientName || !selectedMonth || !selectedYear) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert("Erro", "Valor do faturamento deve ser um número positivo.");
      return;
    }

    try {
      const date = new Date(`${selectedYear}-${months.indexOf(selectedMonth) + 1}-01`).toISOString();
      const billingEntry = {
        clientName,
        amount: parseFloat(amount).toFixed(2),
        date,
      };

      const existingData = await AsyncStorage.getItem('billings');
      const billings = existingData ? JSON.parse(existingData) : [];
      billings.push(billingEntry);
      await AsyncStorage.setItem('billings', JSON.stringify(billings));

      console.log(`Faturamento registrado: R$ ${amount} para ${clientName} na data ${date}`);
      setAmount('');
      setClientName('');
      setSelectedMonth('');
      setSelectedYear('');
      Alert.alert("Sucesso", "Faturamento registrado com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar faturamento", error);
      Alert.alert("Erro", "Houve um problema ao registrar o faturamento.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Faturamento</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Cliente"
        value={clientName}
        onChangeText={setClientName}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor do Faturamento"
        value={amount}
        keyboardType="numeric"
        onChangeText={text => setAmount(text.replace(/,/g, '.'))}
      />
      <Text style={styles.label}>Mês:</Text>
      <Picker
        selectedValue={selectedMonth}
        onValueChange={(itemValue) => setSelectedMonth(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione um mês" value="" />
        {months.map((month, index) => (
          <Picker.Item label={month} value={month} key={index} />
        ))}
      </Picker>
      <Text style={styles.label}>Ano:</Text>
      <Picker
        selectedValue={selectedYear}
        onValueChange={(itemValue) => setSelectedYear(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione um ano" value="" />
        {years.map((year) => (
          <Picker.Item label={year.toString()} value={year.toString()} key={year} />
        ))}
      </Picker>
      <Button title="Registrar Faturamento" onPress={handleRegisterBilling} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    paddingLeft: 10,
    backgroundColor: '#FFFFFF',
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    color: '#333',
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
});

export default BillingRegistration;
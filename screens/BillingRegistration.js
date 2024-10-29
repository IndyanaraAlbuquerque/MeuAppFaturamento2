// screens/BillingRegistration.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Picker } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const billingEntry = {
        clientName,
        amount: parseFloat(amount).toFixed(2), // Formata o valor como número com duas casas decimais
        date: new Date(`${selectedYear}-${months.indexOf(selectedMonth) + 1}-01`).toISOString(), // Armazena a data no formato ISO
      };

      const existingData = await AsyncStorage.getItem('billings');
      const billings = existingData ? JSON.parse(existingData) : [];

      billings.push(billingEntry);
      await AsyncStorage.setItem('billings', JSON.stringify(billings));

      console.log(`Faturamento registrado: R$ ${amount} para ${clientName}`);
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
        onChangeText={text => setAmount(text.replace(/,/g, '.'))} // Substitui vírgulas por pontos
      />
      <Text>Selecionar Mês:</Text>
      <Picker
        selectedValue={selectedMonth}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedMonth(itemValue)}
      >
        <Picker.Item label="Selecione um mês" value="" />
        {months.map((month, index) => (
          <Picker.Item key={index} label={month} value={month} />
        ))}
      </Picker>

      <Text>Selecionar Ano:</Text>
      <Picker
        selectedValue={selectedYear}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedYear(itemValue)}
      >
        <Picker.Item label="Selecione um ano" value="" />
        {years.map((year) => (
          <Picker.Item key={year} label={year.toString()} value={year.toString()} />
        ))}
      </Picker>

      <Button title="Registrar Faturamento" onPress={handleRegisterBilling} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
});

export default BillingRegistration;
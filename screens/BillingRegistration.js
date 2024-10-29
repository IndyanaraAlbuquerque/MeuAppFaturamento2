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

  // Gera anos para os próximos 10 anos (ou ajuste como necessário)
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
      // Formate a data corretamente
      const date = new Date(`${selectedYear}-${months.indexOf(selectedMonth) + 1}-01`).toISOString();

      const billingEntry = {
        clientName,
        amount: parseFloat(amount).toFixed(2), // Formata o valor como número com duas casas decimais
        date, // Armazena a data no formato ISO
      };

      // Verifica se há dados existentes no AsyncStorage
      const existingData = await AsyncStorage.getItem('billings');
      const billings = existingData ? JSON.parse(existingData) : [];

      billings.push(billingEntry);

      // Armazena os dados no AsyncStorage
      await AsyncStorage.setItem('billings', JSON.stringify(billings));

      console.log(`Faturamento registrado: R$ ${amount} para ${clientName} na data ${date}`);
      
      // Limpa os campos de entrada
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
        onChangeText={text => setAmount(text.replace(/,/g, '.'))}
      />
      {/* Picker para mês */}
      <Picker
        selectedValue={selectedMonth}
        onValueChange={(itemValue) => setSelectedMonth(itemValue)}
      >
        <Picker.Item label="Selecione um mês" value="" />
        {months.map((month, index) => (
          <Picker.Item label={month} value={month} key={index} />
        ))}
      </Picker>
      {/* Picker para ano */}
      <Picker
        selectedValue={selectedYear}
        onValueChange={(itemValue) => setSelectedYear(itemValue)}
      >
        <Picker.Item label="Selecione um ano" value="" />
        {years.map((year) => (
          <Picker.Item label={year.toString()} value={year.toString()} key={year} />
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
});

export default BillingRegistration;
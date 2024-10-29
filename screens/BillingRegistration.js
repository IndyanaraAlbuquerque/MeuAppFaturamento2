// screens/BillingRegistration.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BillingRegistration = () => {
  const [amount, setAmount] = useState('');
  const [clientName, setClientName] = useState('');

  const handleRegisterBilling = async () => {
    if (!amount || !clientName) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const billingEntry = {
        clientName,
        amount,
        date: new Date().toISOString(), // Adiciona a data de registro
      };

      // Armazena a entrada de faturamento
      const existingData = await AsyncStorage.getItem('billings');
      const billings = existingData ? JSON.parse(existingData) : [];

      billings.push(billingEntry);
      await AsyncStorage.setItem('billings', JSON.stringify(billings));

      console.log(`Faturamento registrado: R$ ${amount} para ${clientName}`);
      
      // Limpa os campos após o registro
      setAmount('');
      setClientName('');
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
        onChangeText={setAmount}
      />
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
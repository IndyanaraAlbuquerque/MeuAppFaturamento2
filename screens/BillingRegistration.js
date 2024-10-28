// screens/BillingRegistration.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const BillingRegistration = () => {
  const [amount, setAmount] = useState('');
  const [clientName, setClientName] = useState('');

  const handleRegisterBilling = () => {
    // Aqui você adicionaria a lógica de armazenar o faturamento
    console.log(`Faturamento registrado: R$ ${amount} para ${clientName}`);
    setAmount('');
    setClientName('');
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
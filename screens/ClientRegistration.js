// screens/ClientRegistration.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const ClientRegistration = ({ navigation }) => {
  const [clientName, setClientName] = useState('');

  const handleRegisterClient = () => {
    // Aqui você pode adicionar a lógica para armazenar o cliente, caso você decida implementar
    console.log(`Cliente registrado: ${clientName}`);
    setClientName(''); // Limpa o campo após o registro
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome do Cliente"
        value={clientName}
        onChangeText={setClientName}
      />
      <Button title="Registrar Cliente" onPress={handleRegisterClient} />
      <Button title="Registrar Faturamento" onPress={() => navigation.navigate('Registro de Faturamento')} />
      <Button title="Ver Resumo de Faturamento" onPress={() => navigation.navigate('Resumo de Faturamento')} />
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

export default ClientRegistration;
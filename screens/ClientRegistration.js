// screens/ClientRegistration.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClientRegistration = ({ navigation }) => {
  const [clientName, setClientName] = useState('');

  const handleRegisterClient = async () => {
    if (!clientName) {
      Alert.alert("Erro", "Por favor, insira o nome do cliente.");
      return;
    }

    try {
      const clientEntry = {
        name: clientName,
        dateRegistered: new Date().toISOString(), // Adiciona a data de registro
      };

      // Armazenar o cliente
      const existingClients = await AsyncStorage.getItem('clients');
      const clients = existingClients ? JSON.parse(existingClients) : [];

      clients.push(clientEntry);
      await AsyncStorage.setItem('clients', JSON.stringify(clients));

      console.log(`Cliente registrado: ${clientName}`);
      
      // Limpa o campo após o registro
      setClientName('');
      Alert.alert("Sucesso", "Cliente registrado com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar cliente", error);
      Alert.alert("Erro", "Houve um problema ao registrar o cliente.");
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
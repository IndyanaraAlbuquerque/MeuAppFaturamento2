// screens/ClientRegistration.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClientRegistration = ({ navigation }) => {
  const [clientName, setClientName] = useState('');

  const handleRegisterClient = async () => {
    if (!clientName) {
      Alert.alert("Erro", "Por favor, insira o nome do cliente.");
      return;
    }

    try {
      const existingClientsData = await AsyncStorage.getItem('clients');
      const existingClients = existingClientsData ? JSON.parse(existingClientsData) : [];

      if (existingClients.find(client => client.name.toLowerCase() === clientName.toLowerCase())) {
        Alert.alert("Erro", "Esse cliente já está registrado.");
        return;
      }

      const clientEntry = {
        name: clientName,
        dateRegistered: new Date().toISOString(),
      };

      existingClients.push(clientEntry);
      await AsyncStorage.setItem('clients', JSON.stringify(existingClients));

      console.log(`Cliente registrado: ${clientName}`);
      setClientName('');
      Alert.alert("Sucesso", "Cliente registrado com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar cliente", error);
      Alert.alert("Erro", "Houve um problema ao registrar o cliente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Cliente</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Cliente"
        value={clientName}
        onChangeText={setClientName}
      />
      <Button title="Registrar Cliente" onPress={handleRegisterClient} color="#4CAF50" />
      <View style={styles.buttonContainer}>
        <Button title="Registrar Faturamento" onPress={() => navigation.navigate('Registro de Faturamento')} color="#2196F3" />
        <Button title="Ver Resumo de Faturamento" onPress={() => navigation.navigate('Resumo de Faturamento')} color="#2196F3" />
      </View>
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
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default ClientRegistration;
// screens/BillingSummary.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Picker, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BillingSummary = () => {
  const [billings, setBillings] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filteredBillings, setFilteredBillings] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchBillings = async () => {
      try {
        const existingData = await AsyncStorage.getItem('billings');
        const parsedData = existingData ? JSON.parse(existingData) : [];
        setBillings(parsedData);
        
        const uniqueClients = [...new Set(parsedData.map(billing => billing.clientName))];
        setClients(uniqueClients);

        const total = parsedData.reduce((acc, billing) => acc + parseFloat(billing.amount), 0);
        setTotalRevenue(total);
      } catch (error) {
        console.error("Erro ao carregar dados de faturamento:", error);
      }
    };

    fetchBillings();
  }, []);

  const handleFilter = () => {
    const filtered = billings.filter(billing => {
      const billingDate = new Date(billing.date);
      const billingMonth = billingDate.toLocaleString('default', { month: 'long' });
      const billingYear = billingDate.getFullYear().toString();

      const matchesClient = selectedClient ? billing.clientName === selectedClient : true;
      const matchesMonth = selectedMonth ? billingMonth === selectedMonth : true;
      const matchesYear = selectedYear ? billingYear === selectedYear : true;

      return matchesClient && matchesMonth && matchesYear;
    });

    setFilteredBillings(filtered);
  };

  const years = Array.from(new Set(billings.map(billing => new Date(billing.date).getFullYear())));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo de Faturamento</Text>
      <Text style={styles.totalRevenue}>Faturamento Total: R$ {totalRevenue.toFixed(2)}</Text>

      {/* Filtros */}
      <Text>Filtrar por Cliente:</Text>
      <Picker
        selectedValue={selectedClient}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedClient(itemValue)}
      >
        <Picker.Item label="Todos os Clientes" value="" />
        {clients.map((client, index) => (
          <Picker.Item key={index} label={client} value={client} />
        ))}
      </Picker>

      <Text>Filtrar por Mês:</Text>
      <Picker
        selectedValue={selectedMonth}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedMonth(itemValue)}
      >
        <Picker.Item label="Todos os Meses" value="" />
        {Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' }))
          .map((month, index) => (
            <Picker.Item key={index} label={month} value={month} />
          ))}
      </Picker>

      <Text>Filtrar por Ano:</Text>
      <Picker
        selectedValue={selectedYear}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedYear(itemValue)}
      >
        <Picker.Item label="Todos os Anos" value="" />
        {years.map((year) => (
          <Picker.Item key={year} label={year.toString()} value={year.toString()} />
        ))}
      </Picker>

      <Button title="Aplicar Filtros" onPress={handleFilter} />

      <FlatList
        data={(filteredBillings.length > 0 ? filteredBillings : billings) || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.billingItem}>
            <Text style={styles.billingText}>Cliente: {item.clientName}</Text>
            <Text style={styles.billingText}>Valor: R$ {parseFloat(item.amount).toFixed(2)}</Text>
            <Text style={styles.billingText}>Data: {new Date(item.date).toLocaleDateString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum faturamento registrado.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  totalRevenue: {
    fontSize: 18,
    marginBottom: 16,
  },
  billingItem: {
    padding: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  billingText: {
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 12,
  },
});

export default BillingSummary;
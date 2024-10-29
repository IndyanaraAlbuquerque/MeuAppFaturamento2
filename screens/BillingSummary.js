// screens/BillingSummary.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Picker, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BillingSummary = () => {
  const [billings, setBillings] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filteredBillings, setFilteredBillings] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(''); // Mês selecionado
  const [selectedYear, setSelectedYear] = useState('');   // Ano selecionado
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchBillings = async () => {
      try {
        const existingData = await AsyncStorage.getItem('billings');
        const parsedData = existingData ? JSON.parse(existingData) : [];
        setBillings(parsedData);
        
        // Coletar clientes únicos
        const uniqueClients = [...new Set(parsedData.map(billing => billing.clientName))];
        setClients(uniqueClients);

        // Calcular faturamento total
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
        <Picker.Item label="Janeiro" value="January" />
        <Picker.Item label="Fevereiro" value="February" />
        <Picker.Item label="Março" value="March" />
        <Picker.Item label="Abril" value="April" />
        <Picker.Item label="Maio" value="May" />
        <Picker.Item label="Junho" value="June" />
        <Picker.Item label="Julho" value="July" />
        <Picker.Item label="Agosto" value="August" />
        <Picker.Item label="Setembro" value="September" />
        <Picker.Item label="Outubro" value="October" />
        <Picker.Item label="Novembro" value="November" />
        <Picker.Item label="Dezembro" value="December" />
      </Picker>

      <Text>Filtrar por Ano:</Text>
      <Picker
        selectedValue={selectedYear}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedYear(itemValue)}
      >
        <Picker.Item label="Todos os Anos" value="" />
        {years.map((year, index) => (
          <Picker.Item key={index} label={year.toString()} value={year.toString()} />
        ))}
      </Picker>

      <Button title="Aplicar Filtros" onPress={handleFilter} />

      <FlatList
        data={filteredBillings.length > 0 ? filteredBillings : billings}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.billingItem}>
            <Text>Cliente: {item.clientName}</Text>
            <Text>Valor: R$ {parseFloat(item.amount).toFixed(2)}</Text>
            <Text>Data: {new Date(item.date).toLocaleDateString()}</Text>
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
    justifyContent: 'flex-start',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  totalRevenue: {
    fontSize: 18,
    marginBottom: 16,
  },
  billingItem: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 12,
  },
});

export default BillingSummary;
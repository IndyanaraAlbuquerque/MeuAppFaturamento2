import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Picker, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para formatar valores em reais
const formatCurrency = amount => `R$ ${parseFloat(amount).toFixed(2).replace('.', ',')}`;

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

        // Extraindo clientes únicos
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
    calculateTotalRevenue(filtered);
  };

  // Utiliza useMemo para calcular o total de forma otimizada
  const calculateTotalRevenue = (filtered) => {
    const total = filtered.reduce((acc, billing) => acc + parseFloat(billing.amount), 0);
    setTotalRevenue(total);
  };

  const years = useMemo(() => {
    return Array.from(new Set(billings.map(billing => new Date(billing.date).getFullYear())));
  }, [billings]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo de Faturamento</Text>
      <Text style={styles.totalRevenue}>Faturamento Total: {formatCurrency(totalRevenue)}</Text>

      <Text style={styles.label}>Filtrar por Cliente:</Text>
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

      <Text style={styles.label}>Filtrar por Mês:</Text>
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

      <Text style={styles.label}>Filtrar por Ano:</Text>
      <Picker
        selectedValue={selectedYear}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedYear(itemValue)}
      >
        <Picker.Item label="Todos os Anos" value="" />
        {years.map(year => (
          <Picker.Item key={year} label={year.toString()} value={year.toString()} />
        ))}
      </Picker>

      <Button title="Aplicar Filtros" onPress={handleFilter} color="#4CAF50" />

      <FlatList
        data={(filteredBillings.length > 0 ? filteredBillings : billings) || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.billingItem}>
            <Text style={styles.billingText}>Cliente: {item.clientName}</Text>
            <Text style={styles.billingText}>Valor: {formatCurrency(item.amount)}</Text>
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
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  totalRevenue: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  billingItem: {
    padding: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  billingText: {
    fontSize: 16,
    color: '#333',
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

export default BillingSummary;
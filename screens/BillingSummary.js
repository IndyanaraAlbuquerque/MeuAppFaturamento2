// screens/BillingSummary.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BillingSummary = () => {
  return (
    <View style={styles.container}>
      <Text>Resumo de Faturamento</Text>
      {/* Aqui você pode mapear e exibir os dados de faturamento */}
      <Text>Faturamento Total: R$ 0,00</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});

export default BillingSummary;
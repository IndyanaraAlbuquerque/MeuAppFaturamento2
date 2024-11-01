import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './screens/Login';
import ClientRegistration from './screens/ClientRegistration';
import BillingRegistration from './screens/BillingRegistration';
import BillingSummary from './screens/BillingSummary';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ClientRegistration" component={ClientRegistration} />
        <Stack.Screen name="Registro de Faturamento" component={BillingRegistration} />
        <Stack.Screen name="Resumo de Faturamento" component={BillingSummary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
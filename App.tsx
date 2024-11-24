import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import InspectionScreen from './src/screens/InspectionScreen';
import ChecklistScreen from './src/screens/ChecklistScreen';
import ObservationsScreen from './src/screens/ObservationsScreen';

// Interfaces para los tipos de datos
interface MachineFormData {
  client: string;
  reviewedBy: string;
  matricula: string;
  brand: string;
  serialNumber: string;
  model: string;
}

interface ChecklistItem {
  status: 'ok' | 'nook';
  comment?: string;
  photo?: string;
}

interface ChecklistData {
  [key: string]: ChecklistItem;
}

export type RootStackParamList = {
  Home: undefined;
  Inspection: undefined;
  Checklist: {
    formData: {
      client: string;
      reviewedBy: string;
      matricula: string;
      brand: string;
      serialNumber: string;
      model: string;
    };
  };
  Observations: {
    formData: {
      client: string;
      reviewedBy: string;
      matricula: string;
      brand: string;
      serialNumber: string;
      model: string;
    };
    checklistData: {
      [key: string]: {
        status: 'ok' | 'nook' | 'np';
        comment?: string;
        photo?: string;
      };
    };
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Tema personalizado de Inval.m
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#003087', // Azul oscuro
    secondary: '#FF8C00', // Naranja
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: '#f5f5f5',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerTitleAlign: 'center',
              contentStyle: {
                backgroundColor: theme.colors.surfaceVariant,
              },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ 
                title: 'Inval.m - Inspecciones',
              }}
            />
            <Stack.Screen 
              name="Inspection" 
              component={InspectionScreen}
              options={{ 
                title: 'Datos de la Máquina',
              }}
            />
            <Stack.Screen 
              name="Checklist" 
              component={ChecklistScreen}
              options={{ 
                title: 'Inspección',
              }}
            />
            <Stack.Screen 
              name="Observations" 
              component={ObservationsScreen}
              options={{ 
                title: 'Observaciones',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
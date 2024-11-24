import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Inspection'>;

interface FormData {
  client: string;
  reviewedBy: string;
  matricula: string;
  brand: string;
  serialNumber: string;
  model: string;
}

export default function InspectionScreen({ navigation }: Props) {
  const [formData, setFormData] = useState<FormData>({
    client: '',
    reviewedBy: '',
    matricula: '',
    brand: '',
    serialNumber: '',
    model: '',
  });

  const validateForm = () => {
    if (!formData.client.trim()) {
      Alert.alert('Error', 'El campo Cliente es obligatorio');
      return false;
    }
    if (!formData.reviewedBy.trim()) {
      Alert.alert('Error', 'El campo Revisado por es obligatorio');
      return false;
    }
    if (!formData.matricula.trim()) {
      Alert.alert('Error', 'El campo Matrícula es obligatorio');
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateForm()) {
      navigation.navigate('Checklist', { formData });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.card}>
        <Text style={styles.title}>Información de la Inspección</Text>
        <Text style={styles.subtitle}>
          Los campos marcados con * son obligatorios
        </Text>

        <TextInput
          mode="outlined"
          label="Cliente *"
          value={formData.client}
          onChangeText={text => setFormData(prev => ({ ...prev, client: text }))}
          style={styles.input}
          placeholder="Nombre del cliente"
          autoCapitalize="words"
        />

        <TextInput
          mode="outlined"
          label="Revisado por *"
          value={formData.reviewedBy}
          onChangeText={text => setFormData(prev => ({ ...prev, reviewedBy: text }))}
          style={styles.input}
          placeholder="Nombre del inspector"
          autoCapitalize="words"
        />

        <TextInput
          mode="outlined"
          label="Matrícula *"
          value={formData.matricula}
          onChangeText={text => setFormData(prev => ({ ...prev, matricula: text }))}
          style={styles.input}
          placeholder="Matrícula del vehículo"
          autoCapitalize="characters"
        />

        <TextInput
          mode="outlined"
          label="Marca"
          value={formData.brand}
          onChangeText={text => setFormData(prev => ({ ...prev, brand: text }))}
          style={styles.input}
          placeholder="Marca del vehículo"
          autoCapitalize="words"
        />

        <TextInput
          mode="outlined"
          label="Número de Serie"
          value={formData.serialNumber}
          onChangeText={text => setFormData(prev => ({ ...prev, serialNumber: text }))}
          style={styles.input}
          placeholder="Número de serie (opcional)"
        />

        <TextInput
          mode="outlined"
          label="Modelo"
          value={formData.model}
          onChangeText={text => setFormData(prev => ({ ...prev, model: text }))}
          style={styles.input}
          placeholder="Modelo (opcional)"
        />

        <Button
          mode="contained"
          onPress={handleContinue}
          style={styles.button}
          icon="arrow-right"
        >
          Continuar
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    padding: 16,
    elevation: 4,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#003087',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: '#003087',
  },
});
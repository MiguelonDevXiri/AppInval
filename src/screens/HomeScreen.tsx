import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Image
          source={require('../../assets/invalm-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Surface>

      <Text style={styles.title}>Seleccione tipo de máquina</Text>

      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Inspection')}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Autocompactador
        </Button>

        <Button
          mode="contained"
          onPress={() => {/* TODO: Implementar compactadora estática */}}
          style={[styles.button, styles.secondaryButton]}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Compactadora Estática
        </Button>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Maquinas Reciclaje - Contenedores/Carrocerias{'\n'}
          Cerramientos Industriales - Equipos Hidraulicos{'\n'}
          Mantenimientos - Reparaciones{'\n'}
          Filtros
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    elevation: 4,
    alignItems: 'center',
  },
  logo: {
    width: Dimensions.get('window').width * 0.8,
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#003087', // Azul oscuro
    marginTop: 40,
    marginBottom: 30,
  },
  buttonsContainer: {
    padding: 20,
    gap: 20,
  },
  button: {
    backgroundColor: '#FF8C00', // Naranja
    borderRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: '#003087', // Azul oscuro
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  footerText: {
    textAlign: 'center',
    color: '#003087', // Azul oscuro
    fontSize: 14,
    lineHeight: 20,
  },
});
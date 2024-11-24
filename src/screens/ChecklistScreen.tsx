import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import ChecklistItem from '../components/ChecklistItem';

type Props = NativeStackScreenProps<RootStackParamList, 'Checklist'>;

interface ChecklistData {
  [key: string]: {
    status: 'ok' | 'nook' | 'np';
    comment?: string;
    photo?: string;
  };
}

export default function ChecklistScreen({ route, navigation }: Props) {
  const { formData } = route.params;
  const [checklistData, setChecklistData] = useState<ChecklistData>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const checklistSections = {
    general: [
      "Estado fijaciones ganchos carga-descarga",
      "Tiene barandilla",
      "El recurso dispone de guías en el suelo",
      "La zona de trabajo está iluminada adecuadamente (Mín. 100 lux)",
      "La máquina debe ser estable",
      "Estado de soportes y ruedas",
      "Estado del trinquete de la puerta de descarga",
      "Estado de la junta de estanqueidad",
      "Estado de la cadena de sujeción"
    ],
    electricidad: [
      "Dispone de dispositivo contra arranques intempestivos",
      "Limpieza y estanqueidad del armario eléctrico",
      "Instalación eléctrica protegida",
      "Funcionamiento de presostatos y sensores",
      "Órganos de accionamiento señalizados",
      "Funcionamiento de botoneras auxiliares",
      "Cartel de advertencia 'riesgo eléctrico'",
      "Dispone de línea tierra",
      "Paros de emergencia señalizados"
    ],
    hidraulica: [
      "Estado mangueras hidráulicas",
      "Nivel de aceite correcto",
      "Revisión estado aceite hidráulico",
      "Cambio filtros si procede",
      "Estanqueidad del circuito hidráulico",
      "Comprobación de presiones"
    ]
  };

  const sections = Object.keys(checklistSections);

  const isAllSectionsCompleted = () => {
    return Object.entries(checklistSections).every(([_, items]) => {
      return items.every(item => checklistData[item]?.status);
    });
  };

  const handleNext = () => {
    if (currentSectionIndex === sections.length - 1) {
      if (!isAllSectionsCompleted()) {
        Alert.alert(
          'Checklist Incompleto',
          'Por favor complete todos los items de todas las secciones antes de continuar.'
        );
        return;
      }
      navigation.navigate('Observations', { formData, checklistData });
    } else {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {sections[currentSectionIndex].charAt(0).toUpperCase() + 
          sections[currentSectionIndex].slice(1)} - Sección {currentSectionIndex + 1} de {sections.length}
        </Text>
        <View style={styles.progressBarContainer}>
          {sections.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressSegment,
                {
                  backgroundColor: index <= currentSectionIndex ? '#FF8C00' : '#E0E0E0',
                  flex: 1,
                  marginRight: index === sections.length - 1 ? 0 : 4
                }
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <Surface style={styles.card}>
          {checklistSections[sections[currentSectionIndex] as keyof typeof checklistSections]
            .map((item) => (
              <ChecklistItem
                key={item}
                item={item}
                onChange={(status, comment, photo) => 
                  setChecklistData(prev => ({
                    ...prev,
                    [item]: { status, comment, photo }
                  }))
                }
                initialData={checklistData[item]}
              />
            ))
          }
        </Surface>
      </ScrollView>

      <Surface style={styles.bottomBar}>
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={handlePrevious}
            disabled={currentSectionIndex === 0}
            style={[styles.button, styles.previousButton]}
          >
            Anterior
          </Button>
          <Button
            mode="contained"
            onPress={handleNext}
            style={[styles.button, styles.nextButton]}
          >
            {currentSectionIndex === sections.length - 1 ? 'Finalizar' : 'Siguiente'}
          </Button>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 8,
    marginTop: 8,
  },
  progressSegment: {
    height: '100%',
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    elevation: 4,
    borderRadius: 8,
    marginBottom: 16,
  },
  bottomBar: {
    padding: 16,
    elevation: 8,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  button: {
    flex: 1,
  },
  previousButton: {
    borderColor: '#003087',
  },
  nextButton: {
    backgroundColor: '#FF8C00',
  },
});
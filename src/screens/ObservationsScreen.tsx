import React, { useState } from 'react';
import { Platform, View, ScrollView, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { googleDriveService } from '../services/googleService';

type Props = NativeStackScreenProps<RootStackParamList, 'Observations'>;

interface AdditionalPhoto {
  uri: string;
  description: string;
}

const logoBase64 = 'data:image/png;base64,TU_LOGO_EN_BASE64';

export default function ObservationsScreen({ route, navigation }: Props) {
  const { formData, checklistData } = route.params;
  const [observations, setObservations] = useState('');
  const [additionalPhotos, setAdditionalPhotos] = useState<AdditionalPhoto[]>([]);
  const [photoDescription, setPhotoDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const takePhoto = async () => {
    if (!photoDescription.trim()) {
      Alert.alert('Error', 'Por favor, añade una descripción para la foto');
      return;
    }

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesita permiso para acceder a la cámara');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false
      });

      if (!result.canceled && result.assets[0]) {
        let imageUri = result.assets[0].uri;
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        setAdditionalPhotos(prev => [...prev, {
          uri: `data:image/jpeg;base64,${base64}`,
          description: photoDescription
        }]);
        setPhotoDescription('');
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };
  const generateHTML = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
  
    const headerTemplate = (showLogo = false) => `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        ${showLogo ? `
          <div style="flex: 1;">
            <img src="${logoBase64}" style="height: 60px; width: auto;" />
          </div>
        ` : ''}
        <div style="text-align: right; font-size: 12px; color: #666;">
          <p style="margin: 0;">Fecha: ${currentDate}</p>
          <p style="margin: 0;">Hora: ${currentTime}</p>
        </div>
      </div>
    `;
  
    const generateHeader = (title: string, isFirstPage = false) => `
      <div class="section-header">
        ${headerTemplate(isFirstPage)}
        <h2 style="color: #003087; border-bottom: 2px solid #FF8C00; padding-bottom: 10px; margin-top: 20px;">
          ${title}
        </h2>
      </div>
    `;
  
    const generalItems = [
      "Estado fijaciones ganchos carga-descarga",
      "Tiene barandilla",
      "El recurso dispone de guías en el suelo",
      "La zona de trabajo está iluminada adecuadamente (Mín. 100 lux)",
      "La máquina debe ser estable",
      "Estado de soportes y ruedas",
      "Estado del trinquete de la puerta de descarga",
      "Estado de la junta de estanqueidad",
      "Estado de la cadena de sujeción"
    ];
  
    const electricItems = [
      "Paros de emergencia señalizados",
      "Dispone de línea tierra",
      "Cartel de advertencia 'riesgo eléctrico'",
      "Funcionamiento de botoneras auxiliares",
      "Funcionamiento de presostatos y sensores",
      "Instalación eléctrica protegida",
      "Limpieza y estanqueidad del armario eléctrico",
      "Dispone de dispositivo contra arranques intempestivos",
      "Órganos de accionamiento señalizados"
    ];
  
    const hydraulicItems = [
      "Estado mangueras hidráulicas",
      "Nivel de aceite correcto",
      "Revisión estado aceite hidráulico",
      "Cambio filtros si procede",
      "Estanqueidad del circuito hidráulico",
      "Comprobación de presiones"
    ];
  
    const generateChecklistSection = (items: string[]) => {
      return items.map(item => {
        const data = checklistData[item];
        if (!data) return '';
        
        return `
          <div class="checklist-item">
            <strong>${item}</strong><br>
            <span class="status status-${data.status}">
              ${data.status === 'ok' ? 'OK' : data.status === 'nook' ? 'NO OK' : 'NO PROCEDE'}
            </span>
            ${data.comment ? `
              <div class="comment">
                ${data.comment}
              </div>
            ` : ''}
            ${data.photo ? `
              <div class="photo-container">
                <img src="${data.photo}" alt="Foto de ${item}" class="photo"/>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    };
  
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @page {
              margin: 40px;
              size: A4;
            }
            body { 
              font-family: Arial, sans-serif;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .page-break {
              page-break-before: always;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-header {
              margin-bottom: 30px;
            }
            .machine-info {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .checklist-item {
              background-color: #fff;
              padding: 15px;
              margin-bottom: 15px;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              break-inside: avoid;
            }
            .photo-container {
              text-align: center;
              margin: 10px 0;
            }
            .status {
              display: inline-block;
              padding: 5px 10px;
              border-radius: 4px;
              font-weight: bold;
              margin: 5px 0;
            }
            .status-ok {
              background-color: #d4edda;
              color: #28a745;
            }
            .status-nook {
              background-color: #f8d7da;
              color: #dc3545;
            }
            .status-np {
              background-color: #fff3cd;
              color: #FF8C00;
            }
            .comment {
              margin-top: 10px;
              font-style: italic;
              color: #666;
              background-color: #f8f9fa;
              padding: 10px;
              border-radius: 4px;
            }
            .photo {
              max-width: 300px;
              width: 100%;
              height: auto;
              border-radius: 8px;
              margin: 5px auto;
            }
          </style>
        </head>
        <body>
          ${generateHeader('INFORME DE INSPECCIÓN', true)}
          <div class="machine-info">
            <h3 style="color: #003087; margin-bottom: 15px;">Información de la Máquina</h3>
            <p><strong>Cliente:</strong> ${formData.client}</p>
            <p><strong>Revisado por:</strong> ${formData.reviewedBy}</p>
            <p><strong>Matrícula:</strong> ${formData.matricula}</p>
            <p><strong>Marca:</strong> ${formData.brand || 'N/A'}</p>
            <p><strong>Número de Serie:</strong> ${formData.serialNumber || 'N/A'}</p>
            <p><strong>Modelo:</strong> ${formData.model || 'N/A'}</p>
          </div>
  
          <div class="page-break">
            ${generateHeader('INSPECCIÓN GENERAL')}
            ${generateChecklistSection(generalItems)}
          </div>
  
          <div class="page-break">
            ${generateHeader('SISTEMA ELÉCTRICO')}
            ${generateChecklistSection(electricItems)}
          </div>
  
          <div class="page-break">
            ${generateHeader('SISTEMA HIDRÁULICO')}
            ${generateChecklistSection(hydraulicItems)}
          </div>
  
          ${(observations || additionalPhotos.length > 0) ? `
            <div class="page-break">
              ${generateHeader('OBSERVACIONES ADICIONALES')}
              ${observations ? `
                <div class="checklist-item">
                  ${observations}
                </div>
              ` : ''}
              ${additionalPhotos.map(photo => `
                <div class="checklist-item">
                  <div class="photo-container">
                    <img src="${photo.uri}" alt="Foto adicional" class="photo"/>
                  </div>
                  <div class="comment">
                    ${photo.description}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </body>
      </html>
    `;
  };
 
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      console.log('Starting PDF generation process...');
      const html = generateHTML();
      console.log('HTML generated, length:', html.length);
  
      console.log('Calling printToFileAsync...');
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
        width: 612, // A4 width in points
        height: 792, // A4 height in points
      }).catch((error: Error) => {
        console.error('Error in printToFileAsync:', error);
        throw error;
      });
      
      console.log('PDF generated at:', uri);
  
      const date = new Date().toISOString().split('T')[0];
      const fileName = `Informe_${formData.client}_${formData.matricula}_${date}.pdf`;
      const newFileName = `${FileSystem.documentDirectory}${fileName}`;
      
      console.log('Moving file from', uri, 'to', newFileName);
      
      try {
        await FileSystem.moveAsync({
          from: uri,
          to: newFileName
        });
  
        console.log('File moved successfully');
        const fileInfo = await FileSystem.getInfoAsync(newFileName);
        console.log('New file info:', fileInfo);
  
        try {
          console.log('Starting upload to local storage...');
          const savedUri = await googleDriveService.uploadFile(newFileName, fileName);
          console.log('File saved at:', savedUri);
  
          setIsLoading(false);
          Alert.alert(
            'Éxito',
            'El informe se ha generado y guardado correctamente',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Home')
              }
            ]
          );
        } catch (error: unknown) {
          const uploadError = error instanceof Error ? error : new Error('Error desconocido al subir el archivo');
          console.error('Upload error details:', uploadError);
          setIsLoading(false);
          Alert.alert('Error', 'No se pudo guardar el archivo: ' + uploadError.message);
        }
  
      } catch (error: unknown) {
        const moveError = error instanceof Error ? error : new Error('Error desconocido al mover el archivo');
        console.error('Move error details:', moveError);
        setIsLoading(false);
        Alert.alert('Error', 'No se pudo mover el archivo temporal: ' + moveError.message);
      }
  
    } catch (error: unknown) {
      const pdfError = error instanceof Error ? error : new Error('Error desconocido al generar el PDF');
      console.error('PDF generation error details:', pdfError);
      setIsLoading(false);
      Alert.alert('Error', 'No se pudo generar el informe: ' + pdfError.message);
    }
  };


  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.card}>
          <Text style={styles.title}>Observaciones Adicionales</Text>
          
          <TextInput
            mode="outlined"
            label="Observaciones generales"
            value={observations}
            onChangeText={setObservations}
            multiline
            numberOfLines={4}
            style={styles.input}
            placeholder="Añada aquí cualquier observación adicional..."
          />

          <View style={styles.photoSection}>
            <Text style={styles.subtitle}>Añadir Fotos</Text>
            <TextInput
              mode="outlined"
              label="Descripción de la foto"
              value={photoDescription}
              onChangeText={setPhotoDescription}
              style={styles.input}
              placeholder="Describa la foto antes de tomarla..."
            />

            <Button 
              mode="contained" 
              onPress={takePhoto}
              icon="camera"
              style={styles.button}
              disabled={!photoDescription.trim()}
            >
              Tomar Foto
            </Button>

            {additionalPhotos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
                <Text style={styles.photoDescription}>{photo.description}</Text>
                <Button 
                  icon="delete" 
                  mode="outlined" 
                  onPress={() => {
                    setAdditionalPhotos(prev => prev.filter((_, i) => i !== index));
                  }}
                  style={styles.deleteButton}
                >
                  Eliminar
                </Button>
              </View>
            ))}
          </View>
        </Surface>
      </ScrollView>

      <Surface style={styles.bottomBar}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={isLoading}
          icon="email-send"
          style={styles.submitButton}
        >
          {isLoading ? 'Generando informe...' : 'Enviar Informe'}
        </Button>
      </Surface>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF8C00" />
          <Text style={styles.loadingText}>Generando informe...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#003087',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#003087',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  photoSection: {
    marginTop: 16,
  },
  button: {
    marginBottom: 16,
    backgroundColor: '#003087',
  },
  photoContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  photoDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  deleteButton: {
    marginTop: 8,
    borderColor: '#dc3545',
  },
  bottomBar: {
    padding: 16,
    elevation: 8,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, RadioButton, TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

interface ChecklistItemProps {
  item: string;
  onChange: (status: 'ok' | 'nook' | 'np', comment?: string, photo?: string) => void;
  initialData?: {
    status: 'ok' | 'nook' | 'np';
    comment?: string;
    photo?: string;
  };
}

export default function ChecklistItem({ item, onChange, initialData }: ChecklistItemProps) {
  const [status, setStatus] = useState<'ok' | 'nook' | 'np' | null>(initialData?.status || null);
  const [comment, setComment] = useState(initialData?.comment || '');
  const [photo, setPhoto] = useState<string | null>(initialData?.photo || null);

  const takePhoto = async () => {
    try {
      const { status: permissionStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionStatus !== 'granted') {
        alert('Se necesita permiso para acceder a la cámara');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
        allowsMultipleSelection: false
      });

      if (!result.canceled && result.assets[0]) {
        let imageUri = result.assets[0].uri;
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const photoUri = `data:image/jpeg;base64,${base64}`;
        setPhoto(photoUri);
        onChange(status || 'nook', comment, photoUri);
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      alert('No se pudo tomar la foto');
    }
  };

  const handleStatusChange = (newStatus: 'ok' | 'nook' | 'np') => {
    setStatus(newStatus);
    if (newStatus === 'ok' || newStatus === 'np') {
      setComment('');
      setPhoto(null);
      onChange(newStatus, undefined, undefined);
    } else {
      onChange(newStatus, comment, photo || undefined);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.itemText}>{item}</Text>
      
      <View style={styles.radioContainer}>
        <View style={styles.radioOption}>
          <RadioButton
            value="ok"
            status={status === 'ok' ? 'checked' : 'unchecked'}
            onPress={() => handleStatusChange('ok')}
            color="#4CAF50"
          />
          <Text style={styles.radioLabel}>OK</Text>
        </View>
        <View style={styles.radioOption}>
          <RadioButton
            value="nook"
            status={status === 'nook' ? 'checked' : 'unchecked'}
            onPress={() => handleStatusChange('nook')}
            color="#f44336"
          />
          <Text style={styles.radioLabel}>No OK</Text>
        </View>
        <View style={styles.radioOption}>
          <RadioButton
            value="np"
            status={status === 'np' ? 'checked' : 'unchecked'}
            onPress={() => handleStatusChange('np')}
            color="#FF8C00"
          />
          <Text style={styles.radioLabel}>No Procede</Text>
        </View>
      </View>

      {status === 'nook' && (
        <View style={styles.noOkContainer}>
          <TextInput
            mode="outlined"
            label="Comentario"
            value={comment}
            onChangeText={(text) => {
              setComment(text);
              onChange('nook', text, photo || undefined);
            }}
            multiline
            numberOfLines={2}
            style={styles.commentInput}
          />

          <Button 
            mode="contained"
            onPress={takePhoto}
            icon="camera"
            style={styles.photoButton}
          >
            {photo ? 'Cambiar Foto' : 'Tomar Foto'}
          </Button>

          {photo && (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photo }} style={styles.photoPreview} />
              <Button 
                mode="outlined"
                onPress={() => {
                  setPhoto(null);
                  onChange('nook', comment, undefined);
                }}
                icon="delete"
                style={styles.deleteButton}
                textColor="#f44336"
              >
                Eliminar Foto
              </Button>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
    fontWeight: '500',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  radioLabel: {
    marginLeft: 4,
    fontSize: 14,
  },
  noOkContainer: {
    marginTop: 8,
  },
  commentInput: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  photoButton: {
    marginBottom: 12,
    backgroundColor: '#003087',
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  deleteButton: {
    marginTop: 8,
    borderColor: '#f44336',
  },
});
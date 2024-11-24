import * as FileSystem from 'expo-file-system';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';
import { ResponseType } from 'expo-auth-session';

const CONFIG = {
  webClientId: "528064247072-mt2k3l49hdkkj6863o6u854at50cpbf3.apps.googleusercontent.com",
  androidClientId: "528064247072-06jr3r1vol3ld93j90acdorersblf1o0.apps.googleusercontent.com",
  iosClientId: "528064247072-u6seu1kvqulanf6b87fug19iuu0vted4.apps.googleusercontent.com",
};

class GoogleDriveService {
  private accessToken: string | null = null;

  async getAccessToken(): Promise<string> {
    try {
      if (this.accessToken) {
        return this.accessToken;
      }

      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'com.inspecciones.maquinaria'
      });

      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token'
      };

      const clientId = Platform.select({
        ios: CONFIG.iosClientId,
        android: CONFIG.androidClientId,
        default: CONFIG.webClientId,
      }) || '';

      const request = new AuthSession.AuthRequest({
        clientId,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
        responseType: ResponseType.Token,
        redirectUri
      });

      const result = await request.promptAsync(discovery);

      if (result.type === 'success') {
        const token = result.params.access_token;
        if (!token) {
          throw new Error('No access token received');
        }
        this.accessToken = token;
        return token;
      }

      throw new Error('Authentication failed');
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to authenticate with Google');
    }
  }

  async uploadFile(filePath: string, fileName: string): Promise<string> {
    try {
      console.log('Starting Google Drive upload process...');

      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      console.log('Got access token');

      // Verificar que el archivo existe
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      // Leer el contenido del archivo
      const fileContent = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.Base64
      });

      // Crear el metadata
      const metadata = JSON.stringify({
        name: fileName,
        mimeType: 'application/pdf'
      });

      // Crear el body de la petición
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        metadata +
        delimiter +
        'Content-Type: application/pdf\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        fileContent +
        close_delim;

      // Subir a Drive
      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
            'Content-Length': String(multipartRequestBody.length)
          },
          body: multipartRequestBody
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('File uploaded successfully to Drive');
      
      return result.id;
    } catch (error) {
      console.error('Error in upload process:', error);
      throw error instanceof Error ? error : new Error('Unknown error during upload');
    }
  }

  isAuthenticated = () => Boolean(this.accessToken);
}

export const googleDriveService = new GoogleDriveService();
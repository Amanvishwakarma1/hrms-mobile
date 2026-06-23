import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/API';

export default function ExpenseCreateScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('Fuel');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to handle notifications across Web and Native platforms smoothly
  const notify = (title: string, message: string, onPressAction?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
      if (onPressAction) onPressAction();
    } else {
      Alert.alert(title, message, onPressAction ? [{ text: 'OK', onPress: onPressAction }] : undefined);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      notify('Permission Denied', 'Gallery access is required to attach slips.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!category.trim() || !amount) {
      notify('Validation Error', 'Category and Amount fields are required.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      notify('Validation Error', 'Please enter a valid numeric amount greater than 0.');
      return;
    }

    const formData = new FormData();
    formData.append('category', category.trim());
    formData.append('amount', String(parsedAmount));
    formData.append('description', description.trim());

    // Fix handling for image payload processing securely on Web vs Mobile
    if (imageUri) {
      if (Platform.OS === 'web') {
        try {
          // Fetch the local blob representation required by standard web browsers
          const response = await fetch(imageUri);
          const blob = await response.blob();
          formData.append('file', blob, 'invoice.jpg');
        } catch (blobError) {
          console.error("Web file resolution failed: ", blobError);
          notify('File Error', 'Failed to resolve chosen image object on web.');
          return;
        }
      } else {
        const filename = imageUri.split('/').pop() || 'invoice.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        
        formData.append('file', {
          uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
          name: filename,
          type,
        } as any);
      }
    } else {
      notify('Validation Error', 'Please attach an invoice slip image before submitting.');
      return;
    }

    try {
      setIsLoading(true);
      console.log("Submitting payload to base endpoint: ", `${API_BASE_URL}/expenses`);
      
      await axios.post(`${API_BASE_URL}/expenses`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        },
        withCredentials: true
      });

      notify('Success', 'Expense claims securely synchronized directly to the database!', () => {
        router.back();
      });
    } catch (err: any) {
      console.error("Network upload exception recorded: ", err?.response?.data || err.message);
      notify('Submission Error', `Failed to connect to the HRMS Backend API: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category *</Text>
          <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Travel, Meals, Client Care" />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount ($) *</Text>
          <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="numeric" />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Optional memo..." multiline numberOfLines={3} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Invoice Documentation *</Text>
          {imageUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removeBadge} onPress={() => setImageUri(null)}>
                <Text style={styles.removeText}>✕ Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>Upload Invoice Slip From Gallery</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={[styles.submitButton, isLoading && styles.disabledButton]} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.submitButtonText}>Submit Expense</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20, backgroundColor: '#ffffff', flexGrow: 1 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, backgroundColor: '#f9fafb' },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  uploadButton: { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 16, alignItems: 'center' },
  uploadButtonText: { fontSize: 14, fontWeight: '600', color: '#1a73e8' },
  previewContainer: { position: 'relative', borderRadius: 8, overflow: 'hidden' },
  previewImage: { width: '100%', height: 180, resizeMode: 'cover' },
  removeBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  removeText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  submitButton: { backgroundColor: '#1a73e8', borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  disabledButton: { backgroundColor: '#93c5fd' },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' }
});
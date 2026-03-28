import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { 
  Camera, 
  Edit3, 
  Mail, 
  Phone, 
  Linkedin, 
  User,
  LogOut,
  Save,
  QrCode,
  Share
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCodeGenerator from '@/components/QRCodeGenerator';

export default function ProfileScreen() {
  const { user, updateProfile, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    linkedInProfile: user?.linkedInProfile || '',
    photoUrl: user?.photoUrl || '',
    businessCardQR: user?.businessCardQR || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        console.log('Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({
          ...prev,
          photoUrl: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        console.log('Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({
          ...prev,
          photoUrl: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        linkedInProfile: formData.linkedInProfile,
        photoUrl: formData.photoUrl,
        businessCardQR: formData.businessCardQR,
      });
      setIsEditing(false);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderPhotoSection = () => (
    <View style={styles.photoSection}>
      <View style={styles.photoContainer}>
        {formData.photoUrl ? (
          <Image source={{ uri: formData.photoUrl }} style={styles.profilePhoto} />
        ) : (
          <View style={styles.placeholderPhoto}>
            <User size={48} color={Colors.light.tabIconDefault} />
          </View>
        )}
        {isEditing && (
          <View style={styles.photoActions}>
            <TouchableOpacity
              style={styles.photoActionButton}
              onPress={handleImagePicker}
            >
              <Edit3 size={16} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoActionButton}
              onPress={handleCameraCapture}
            >
              <Camera size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text style={styles.photoHint}>
        {isEditing ? 'Tap to change photo' : user?.name || 'User'}
      </Text>
    </View>
  );

  const generateBusinessCardData = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${formData.name}
EMAIL:${formData.email}
TEL:${formData.phoneNumber}
URL:${formData.linkedInProfile}
END:VCARD`;
    return vCard;
  };

  const handleGenerateQR = () => {
    const businessCardData = generateBusinessCardData();
    setFormData(prev => ({ ...prev, businessCardQR: businessCardData }));
  };

  const handleClearQR = () => {
    setFormData(prev => ({ ...prev, businessCardQR: '' }));
  };

  const renderQRCodeSection = () => (
    <View style={styles.qrSection}>
      <Text style={styles.fieldLabel}>Virtual Business Card QR Code</Text>
      
      {formData.businessCardQR ? (
        <View style={styles.qrContainer}>
          <QRCodeGenerator 
            value={formData.businessCardQR} 
            size={180}
            backgroundColor="white"
            color="black"
          />
          <View style={styles.qrActions}>
            {isEditing && (
              <TouchableOpacity
                style={styles.qrActionButton}
                onPress={handleClearQR}
              >
                <Text style={styles.qrActionText}>Clear QR Code</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.qrActionButton, styles.primaryButton]}
              onPress={() => {
                // Share functionality could be added here
                console.log('Share QR Code');
              }}
            >
              <Share size={16} color="white" />
              <Text style={styles.qrActionTextWhite}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.qrPlaceholder}>
          <QrCode size={48} color={Colors.light.tabIconDefault} />
          <Text style={styles.qrPlaceholderText}>
            Generate a QR code for your virtual business card
          </Text>
          {isEditing && (
            <TouchableOpacity
              style={[styles.qrActionButton, styles.primaryButton]}
              onPress={handleGenerateQR}
            >
              <Text style={styles.qrActionTextWhite}>Generate QR Code</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  const renderField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    icon: React.ReactNode,
    placeholder: string,
    keyboardType: 'default' | 'email-address' | 'phone-pad' | 'url' = 'default'
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputIcon}>{icon}</View>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.light.tabIconDefault}
          editable={isEditing}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{ 
          title: 'Profile',
          headerRight: () => (
            <TouchableOpacity
              onPress={isEditing ? handleSave : () => setIsEditing(true)}
              disabled={isLoading}
              style={styles.headerButton}
            >
              {isEditing ? (
                <Save size={24} color={Colors.light.tint} />
              ) : (
                <Edit3 size={24} color={Colors.light.tint} />
              )}
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderPhotoSection()}

        <View style={styles.formSection}>
          {renderField(
            'Full Name',
            formData.name,
            (text) => setFormData(prev => ({ ...prev, name: text })),
            <User size={20} color={Colors.light.tabIconDefault} />,
            'Enter your full name'
          )}

          {renderField(
            'Email Address',
            formData.email,
            () => {}, // Email is not editable
            <Mail size={20} color={Colors.light.tabIconDefault} />,
            'Email address',
            'email-address'
          )}

          {renderField(
            'Phone Number',
            formData.phoneNumber,
            (text) => setFormData(prev => ({ ...prev, phoneNumber: text })),
            <Phone size={20} color={Colors.light.tabIconDefault} />,
            'Enter your phone number',
            'phone-pad'
          )}

          {renderField(
            'LinkedIn Profile',
            formData.linkedInProfile,
            (text) => setFormData(prev => ({ ...prev, linkedInProfile: text })),
            <Linkedin size={20} color={Colors.light.tabIconDefault} />,
            'LinkedIn profile URL',
            'url'
          )}

          {renderQRCodeSection()}
        </View>

        <View style={styles.providerSection}>
          <Text style={styles.providerLabel}>Signed in with</Text>
          <View style={styles.providerBadge}>
            <Text style={styles.providerText}>
              {user?.provider ? user.provider.charAt(0).toUpperCase() + user.provider.slice(1) : 'Unknown'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <LogOut size={20} color="#FF3B30" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.background,
  },
  placeholderPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
  },
  photoActions: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    gap: 8,
  },
  photoActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.tint,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  photoHint: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
  },
  formSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
  disabledInput: {
    color: Colors.light.tabIconDefault,
  },
  providerSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  providerLabel: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: 8,
  },
  providerBadge: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  providerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  qrSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  qrActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  qrActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: 'white',
    gap: 6,
  },
  primaryButton: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  qrActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  qrActionTextWhite: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  qrPlaceholder: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
    marginTop: 16,
  },
  qrPlaceholderText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    marginVertical: 12,
    lineHeight: 20,
  },
});
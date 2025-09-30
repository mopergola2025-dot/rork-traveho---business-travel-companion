import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Eye, EyeOff, Plane } from 'lucide-react-native';
import * as Crypto from 'expo-crypto';
import { useAuth, User } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AuthScreenProps {
  onAuthComplete: () => void;
}

export default function AuthScreen({ onAuthComplete }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();

  const showError = (message: string) => {
    if (Platform.OS === 'web') {
      console.error(message);
    } else {
      // For native platforms, you could use a toast or modal
      console.error(message);
    }
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      showError('Please fill in all fields');
      return;
    }

    if (!isLogin && !name.trim()) {
      showError('Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      const user: User = {
        id: Crypto.randomUUID(),
        email: email.trim(),
        name: isLogin ? email.split('@')[0] : name.trim(),
        provider: 'email',
      };

      await signIn(user);
      onAuthComplete();
    } catch (error) {
      console.error('Email auth error:', error);
      showError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      // Simulate Google auth for demo purposes
      const user: User = {
        id: Crypto.randomUUID(),
        email: 'demo@gmail.com',
        name: 'Google User',
        provider: 'google',
      };

      await signIn(user);
      onAuthComplete();
    } catch (error) {
      console.error('Google auth error:', error);
      showError('Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setIsLoading(true);
    try {
      if (Platform.OS === 'web') {
        showError('Apple Sign-In is not available on web. Please use email or Google.');
        setIsLoading(false);
        return;
      }

      // Simulate Apple auth for demo purposes
      const user: User = {
        id: Crypto.randomUUID(),
        email: 'demo@icloud.com',
        name: 'Apple User',
        provider: 'apple',
      };

      await signIn(user);
      onAuthComplete();
    } catch (error) {
      console.error('Apple auth error:', error);
      showError('Apple authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[Colors.light.tint, '#4A90E2']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Plane size={48} color="white" />
                <Text style={styles.logoText}>Traveho</Text>
              </View>
              <Text style={styles.subtitle}>
                Your business travel companion
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleButton, isLogin && styles.activeToggle]}
                  onPress={() => setIsLogin(true)}
                >
                  <Text style={[styles.toggleText, isLogin && styles.activeToggleText]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, !isLogin && styles.activeToggle]}
                  onPress={() => setIsLogin(false)}
                >
                  <Text style={[styles.toggleText, !isLogin && styles.activeToggleText]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              {!isLogin && (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    placeholderTextColor={Colors.light.tabIconDefault}
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <Mail size={20} color={Colors.light.tabIconDefault} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={Colors.light.tabIconDefault}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={Colors.light.tabIconDefault}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.light.tabIconDefault} />
                  ) : (
                    <Eye size={20} color={Colors.light.tabIconDefault} />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, isLoading && styles.disabledButton]}
                onPress={handleEmailAuth}
                disabled={isLoading}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity
                  style={[styles.socialButton, isLoading && styles.disabledButton]}
                  onPress={handleGoogleAuth}
                  disabled={isLoading}
                >
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, isLoading && styles.disabledButton]}
                  onPress={handleAppleAuth}
                  disabled={isLoading}
                >
                  <Text style={styles.socialButtonText}>Apple</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: Colors.light.tint,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.tabIconDefault,
  },
  activeToggleText: {
    color: 'white',
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: Colors.light.background,
  },
  inputWithIcon: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
    paddingLeft: 48,
    fontSize: 16,
    backgroundColor: Colors.light.background,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  primaryButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: Colors.light.tabIconDefault,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
});
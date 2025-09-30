import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  backgroundColor?: string;
  color?: string;
}

export default function QRCodeGenerator({ 
  value, 
  size = 200, 
  backgroundColor = 'white',
  color = 'black' 
}: QRCodeGeneratorProps) {
  if (Platform.OS === 'web') {
    // For web, we'll use a simple fallback or could integrate with a web QR library
    return (
      <View style={[styles.container, { width: size, height: size, backgroundColor }]}>
        <View style={styles.webFallback}>
          {/* This is a simple placeholder for web - in production you might want to use a web-specific QR library */}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <QRCode
        value={value}
        size={size}
        color={color}
        backgroundColor={backgroundColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  webFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
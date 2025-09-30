import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Linking, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import { MapPin, Navigation } from 'lucide-react-native';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface MapsProps {
  height?: number;
  showCurrentLocation?: boolean;
  markers?: {
    latitude: number;
    longitude: number;
    title: string;
    description?: string;
  }[];
}

export default function Maps({ height = 300, showCurrentLocation = true, markers = [] }: MapsProps) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (showCurrentLocation) {
      getCurrentLocation();
    }
  }, [showCurrentLocation]);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      // Get address from coordinates
      try {
        const addressResponse = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        
        const address = addressResponse[0];
        const formattedAddress = address 
          ? `${address.street || ''} ${address.city || ''} ${address.region || ''} ${address.country || ''}`.trim()
          : 'Unknown location';

        setLocation({
          latitude,
          longitude,
          address: formattedAddress,
        });
      } catch {
        setLocation({
          latitude,
          longitude,
          address: 'Address unavailable',
        });
      }
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Failed to get current location');
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = (lat: number, lng: number, label?: string) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
      web: 'https://www.google.com/maps/search/?api=1&query=',
    });
    
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label || 'Location'}@${latLng}`,
      android: `${scheme}${latLng}(${label || 'Location'})`,
      web: `${scheme}${latLng}`,
    });

    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url!).catch(() => {
        Alert.alert('Error', 'Unable to open maps application');
      });
    }
  };

  const renderWebMap = () => {
    if (!location && markers.length === 0) {
      return (
        <View style={[styles.mapContainer, { height }]}>
          <Text style={styles.noLocationText}>No location data available</Text>
        </View>
      );
    }

    const centerLat = location?.latitude || markers[0]?.latitude || 0;
    const centerLng = location?.longitude || markers[0]?.longitude || 0;
    
    // Create markers string for Google Maps embed
    let markersParam = '';
    if (location) {
      markersParam += `&markers=color:blue%7Clabel:You%7C${location.latitude},${location.longitude}`;
    }
    markers.forEach((marker, index) => {
      markersParam += `&markers=color:red%7Clabel:${index + 1}%7C${marker.latitude},${marker.longitude}`;
    });

    const mapUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgHz-TK7VFC&center=${centerLat},${centerLng}&zoom=15${markersParam}`;

    return (
      <View style={[styles.mapContainer, { height }]}>
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          src={mapUrl}
          allowFullScreen
        />
      </View>
    );
  };

  const renderMobileMap = () => {
    return (
      <View style={[styles.mapContainer, { height }]}>
        <View style={styles.mapPlaceholder}>
          <MapPin size={48} color="#007AFF" />
          <Text style={styles.mapTitle}>Interactive Map</Text>
          
          {loading && (
            <Text style={styles.loadingText}>Getting your location...</Text>
          )}
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          {location && (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>Current Location:</Text>
              <Text style={styles.addressText}>{location.address}</Text>
              <Text style={styles.coordsText}>
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Text>
            </View>
          )}

          {markers.length > 0 && (
            <View style={styles.markersInfo}>
              <Text style={styles.markersTitle}>Points of Interest:</Text>
              {markers.map((marker, index) => (
                <Text key={index} style={styles.markerText}>
                  • {marker.title}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.buttonContainer}>
            {location && (
              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => openInMaps(location.latitude, location.longitude, 'Current Location')}
              >
                <Navigation size={20} color="#fff" />
                <Text style={styles.buttonText}>Open in Maps</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.mapButton, styles.refreshButton]}
              onPress={getCurrentLocation}
              disabled={loading}
            >
              <MapPin size={20} color="#fff" />
              <Text style={styles.buttonText}>
                {loading ? 'Locating...' : 'Refresh Location'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return Platform.OS === 'web' ? renderWebMap() : renderMobileMap();
}

const styles = StyleSheet.create({
  mapContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#ff4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  locationInfo: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  coordsText: {
    fontSize: 12,
    color: '#999',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  markersInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  markersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  markerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  refreshButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  noLocationText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
});
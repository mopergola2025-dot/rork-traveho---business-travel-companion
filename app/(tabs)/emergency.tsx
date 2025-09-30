import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  Shield,
  Phone,
  MapPin,
  Plus,
  Heart,
  Pill,
  Ambulance,
  AlertTriangle,
} from 'lucide-react-native';

import Colors from '@/constants/colors';

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: 'insurance' | 'personal' | 'local';
}

interface EmergencyService {
  id: string;
  name: string;
  type: 'hospital' | 'pharmacy' | 'ambulance' | 'police';
  address: string;
  phone: string;
  distance: string;
  isOpen: boolean;
}

export default function EmergencyScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Travel Insurance',
      number: '+1-800-555-0123',
      type: 'insurance',
    },
    {
      id: '2',
      name: 'Emergency Contact - John',
      number: '+1-555-0199',
      type: 'personal',
    },
  ]);

  const [services] = useState<EmergencyService[]>([
    {
      id: '1',
      name: 'City General Hospital',
      type: 'hospital',
      address: '123 Medical Center Dr',
      phone: '+1-555-0100',
      distance: '1.2 km',
      isOpen: true,
    },
    {
      id: '2',
      name: '24/7 Pharmacy Plus',
      type: 'pharmacy',
      address: '456 Main Street',
      phone: '+1-555-0200',
      distance: '0.8 km',
      isOpen: true,
    },
    {
      id: '3',
      name: 'Emergency Medical Services',
      type: 'ambulance',
      address: 'Emergency Response Unit',
      phone: '911',
      distance: 'On-demand',
      isOpen: true,
    },
  ]);

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleAddContact = () => {
    console.log('Add emergency contact');
  };

  const getServiceIcon = (type: EmergencyService['type']) => {
    switch (type) {
      case 'hospital':
        return Heart;
      case 'pharmacy':
        return Pill;
      case 'ambulance':
        return Ambulance;
      case 'police':
        return Shield;
      default:
        return AlertTriangle;
    }
  };

  const getServiceColor = (type: EmergencyService['type']) => {
    switch (type) {
      case 'hospital':
        return Colors.light.danger;
      case 'pharmacy':
        return Colors.light.success;
      case 'ambulance':
        return Colors.light.accent;
      case 'police':
        return Colors.light.primary;
      default:
        return Colors.light.gray;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Shield size={32} color={Colors.light.danger} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Emergency</Text>
            <Text style={styles.subtitle}>Quick access to emergency services</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.emergencyAlert}>
          <AlertTriangle size={24} color={Colors.light.danger} />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Emergency Hotline</Text>
            <Text style={styles.alertSubtitle}>
              Tap to call local emergency services
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={() => handleCall('911')}
          >
            <Text style={styles.emergencyButtonText}>911</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Emergency Contacts</Text>
            <TouchableOpacity onPress={handleAddContact}>
              <Plus size={24} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>
          
          {contacts.map((contact) => (
            <TouchableOpacity 
              key={contact.id} 
              style={styles.contactCard}
              onPress={() => handleCall(contact.number)}
            >
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </View>
              <View style={styles.contactActions}>
                <TouchableOpacity 
                  style={styles.callButton}
                  onPress={() => handleCall(contact.number)}
                >
                  <Phone size={16} color={Colors.light.background} />
                  <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Emergency Services</Text>
          
          {services.map((service) => {
            const IconComponent = getServiceIcon(service.type);
            const iconColor = getServiceColor(service.type);
            
            return (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceLeft}>
                  <View style={[styles.serviceIcon, { backgroundColor: `${iconColor}20` }]}>
                    <IconComponent size={24} color={iconColor} />
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <View style={styles.serviceDetails}>
                      <MapPin size={14} color={Colors.light.gray} />
                      <Text style={styles.serviceAddress}>{service.address}</Text>
                    </View>
                    <Text style={styles.serviceDistance}>{service.distance}</Text>
                  </View>
                </View>
                
                <View style={styles.serviceActions}>
                  <TouchableOpacity 
                    style={styles.serviceCallButton}
                    onPress={() => handleCall(service.phone)}
                  >
                    <Phone size={16} color={Colors.light.primary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Information</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Medical Information</Text>
            <Text style={styles.infoText}>
              Keep your medical information, allergies, and current medications 
              updated in your profile for emergency situations.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Travel Insurance</Text>
            <Text style={styles.infoText}>
              Always carry your travel insurance policy number and emergency 
              contact information when traveling.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  header: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emergencyAlert: {
    backgroundColor: Colors.light.danger,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  alertContent: {
    flex: 1,
    marginLeft: 16,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.background,
    marginBottom: 4,
  },
  alertSubtitle: {
    fontSize: 14,
    color: Colors.light.background,
    opacity: 0.9,
  },
  emergencyButton: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emergencyButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.danger,
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
  },
  contactCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  contactActions: {
    flexDirection: 'row',
  },
  callButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.background,
  },
  serviceCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  serviceAddress: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  serviceDistance: {
    fontSize: 12,
    color: Colors.light.gray,
  },
  serviceActions: {
    flexDirection: 'row',
  },
  serviceCallButton: {
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 12,
    borderRadius: 8,
  },
  infoCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import {
  Plane,
  Calendar,
  MapPin,
  Plus,
  Hotel,
  Car,
  Coffee,
  Bell,
  AlertTriangle,
  Clock,
  Users,
  Zap,
  X,
} from 'lucide-react-native';

import Colors from '@/constants/colors';

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'current' | 'completed';
  flightNumber?: string;
  hotel?: string;
  purpose: string;
  imageUrl: string;
  hasNotifications?: boolean;
  meetings?: Meeting[];
  itinerary?: ItineraryItem[];
}

interface Meeting {
  id: string;
  title: string;
  time: string;
  attendees: number;
}

interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  type: 'flight' | 'meeting' | 'hotel' | 'transport' | 'meal';
  location?: string;
}

const tripStatuses = [
  { key: 'current' as const, label: 'Current', count: 1 },
  { key: 'upcoming' as const, label: 'Upcoming', count: 2 },
];

export default function TripsScreen() {
  const [selectedStatus, setSelectedStatus] = useState<Trip['status']>('current');
  const [showAddTripModal, setShowAddTripModal] = useState<boolean>(false);
  const [newTrip, setNewTrip] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    purpose: '',
    flightNumber: '',
    hotel: '',
  });
  
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      destination: 'New York, NY',
      startDate: '2025-10-15',
      endDate: '2025-10-18',
      status: 'upcoming',
      flightNumber: 'AA 1234',
      hotel: 'Manhattan Business Hotel',
      purpose: 'Client Meeting',
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=200&fit=crop',
      hasNotifications: false,
      meetings: [
        { id: '1', title: 'Client Presentation', time: '10:00 AM', attendees: 5 },
        { id: '2', title: 'Strategy Discussion', time: '2:00 PM', attendees: 3 },
      ],
      itinerary: [
        { id: '1', time: '8:00 AM', title: 'Flight Departure', type: 'flight', location: 'LAX Airport' },
        { id: '2', time: '4:00 PM', title: 'Hotel Check-in', type: 'hotel', location: 'Manhattan Business Hotel' },
        { id: '3', time: '7:00 PM', title: 'Welcome Dinner', type: 'meal', location: 'The Plaza Restaurant' },
      ],
    },
    {
      id: '2',
      destination: 'San Francisco, CA',
      startDate: '2025-10-02',
      endDate: '2025-10-05',
      status: 'current',
      flightNumber: 'UA 5678',
      hotel: 'Tech Hub Hotel',
      purpose: 'Conference',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
      hasNotifications: true,
      meetings: [
        { id: '1', title: 'Keynote Speech', time: '9:00 AM', attendees: 200 },
        { id: '2', title: 'Panel Discussion', time: '2:00 PM', attendees: 50 },
      ],
      itinerary: [
        { id: '1', time: '9:00 AM', title: 'Conference Opening', type: 'meeting', location: 'Main Hall' },
        { id: '2', time: '12:00 PM', title: 'Networking Lunch', type: 'meal', location: 'Conference Center' },
        { id: '3', time: '6:00 PM', title: 'Return Flight', type: 'flight', location: 'SFO Airport' },
      ],
    },
  ]);

  useEffect(() => {
    const updateTripStatuses = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      setTrips(prevTrips => {
        return prevTrips
          .map(trip => {
            const startDate = new Date(trip.startDate);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(trip.endDate);
            endDate.setHours(23, 59, 59, 999);

            let newStatus: Trip['status'] = trip.status;

            if (today >= startDate && today <= endDate) {
              newStatus = 'current';
            } else if (today < startDate) {
              newStatus = 'upcoming';
            } else {
              newStatus = 'completed';
            }

            return { ...trip, status: newStatus };
          })
          .filter(trip => trip.status !== 'completed');
      });
    };

    updateTripStatuses();
    const interval = setInterval(updateTripStatuses, 60000 * 60);

    return () => clearInterval(interval);
  }, []);

  const filteredTrips = trips.filter(trip => trip.status === selectedStatus);
  const currentTrip = trips.find(trip => trip.status === 'current');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const tripDate = new Date(dateString);
    const diffTime = tripDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAddTrip = () => {
    if (!newTrip.destination || !newTrip.startDate || !newTrip.endDate || !newTrip.purpose) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(newTrip.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(newTrip.endDate);
    endDate.setHours(23, 59, 59, 999);

    let status: Trip['status'] = 'upcoming';
    if (today >= startDate && today <= endDate) {
      status = 'current';
    } else if (today < startDate) {
      status = 'upcoming';
    } else {
      status = 'completed';
    }

    if (status === 'completed') {
      Alert.alert('Error', 'Cannot add a trip that has already ended');
      return;
    }

    const trip: Trip = {
      id: Date.now().toString(),
      destination: newTrip.destination,
      startDate: newTrip.startDate,
      endDate: newTrip.endDate,
      status: status,
      purpose: newTrip.purpose,
      flightNumber: newTrip.flightNumber || undefined,
      hotel: newTrip.hotel || undefined,
      imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=200&fit=crop',
      hasNotifications: false,
    };

    setTrips(prevTrips => [...prevTrips, trip]);
    setNewTrip({
      destination: '',
      startDate: '',
      endDate: '',
      purpose: '',
      flightNumber: '',
      hotel: '',
    });
    setShowAddTripModal(false);
    Alert.alert('Success', 'Trip added successfully!');
  };

  const resetForm = () => {
    setNewTrip({
      destination: '',
      startDate: '',
      endDate: '',
      purpose: '',
      flightNumber: '',
      hotel: '',
    });
  };

  const handleFlightBooking = async () => {
    try {
      const url = 'https://www.trip.com/flights/';
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open Trip.com. Please check if you have a web browser installed.');
      }
    } catch (error) {
      console.error('Error opening Trip.com:', error);
      Alert.alert('Error', 'Failed to open Trip.com');
    }
  };

  const handleHotelBooking = async () => {
    try {
      const url = 'https://www.booking.com/';
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open Booking.com. Please check if you have a web browser installed.');
      }
    } catch (error) {
      console.error('Error opening Booking.com:', error);
      Alert.alert('Error', 'Failed to open Booking.com');
    }
  };

  const handleTaxiBooking = async () => {
    try {
      const url = 'https://www.uber.com/';
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open Uber.com. Please check if you have a web browser installed.');
      }
    } catch (error) {
      console.error('Error opening Uber.com:', error);
      Alert.alert('Error', 'Failed to open Uber.com');
    }
  };

  const handleLoungeBooking = async () => {
    try {
      const url = 'https://www.loungepass.com/';
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open LoungePass.com. Please check if you have a web browser installed.');
      }
    } catch (error) {
      console.error('Error opening LoungePass.com:', error);
      Alert.alert('Error', 'Failed to open LoungePass.com');
    }
  };

  const handleCancelTrip = (tripId: string, destination: string) => {
    Alert.alert(
      'Cancel Trip',
      `Are you sure you want to cancel your trip to ${destination}?`,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
            Alert.alert('Success', 'Trip cancelled successfully');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Traveho</Text>
            <Text style={styles.subtitle}>Your business travel companion</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>

        {currentTrip && (
          <View style={styles.currentTripCard}>
            <View style={styles.currentTripHeader}>
              <Text style={styles.currentTripTitle}>Current Trip</Text>
              <View style={styles.headerActions}>
                {currentTrip.hasNotifications && (
                  <View style={styles.notificationBadge}>
                    <AlertTriangle size={16} color={Colors.light.danger} />
                    <Text style={styles.notificationText}>Flight Alert</Text>
                  </View>
                )}
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>Live</Text>
                </View>
              </View>
            </View>
            <Text style={styles.currentTripDestination}>{currentTrip.destination}</Text>
            <Text style={styles.currentTripDates}>
              {formatDate(currentTrip.startDate)} - {formatDate(currentTrip.endDate)}
            </Text>
            
            {currentTrip.itinerary && currentTrip.itinerary.length > 0 && (
              <View style={styles.nextActivity}>
                <Clock size={16} color={Colors.light.background} />
                <Text style={styles.nextActivityText}>
                  Next: {currentTrip.itinerary[0].title} at {currentTrip.itinerary[0].time}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.statusTabs}>
        {tripStatuses.map((status) => (
          <TouchableOpacity
            key={status.key}
            style={[
              styles.statusTab,
              selectedStatus === status.key && styles.statusTabActive
            ]}
            onPress={() => setSelectedStatus(status.key)}
          >
            <Text style={[
              styles.statusTabText,
              selectedStatus === status.key && styles.statusTabTextActive
            ]}>
              {status.label}
            </Text>
            <View style={[
              styles.statusBadge,
              selectedStatus === status.key && styles.statusBadgeActive
            ]}>
              <Text style={[
                styles.statusBadgeText,
                selectedStatus === status.key && styles.statusBadgeTextActive
              ]}>
                {status.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedStatus === 'upcoming' && (
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Book</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionCard} onPress={handleFlightBooking}>
                <Plane size={24} color={Colors.light.primary} />
                <Text style={styles.actionText}>Flight</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={handleHotelBooking}>
                <Hotel size={24} color={Colors.light.accent} />
                <Text style={styles.actionText}>Hotel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={handleTaxiBooking}>
                <Car size={24} color={Colors.light.success} />
                <Text style={styles.actionText}>Taxi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={handleLoungeBooking}>
                <Coffee size={24} color={Colors.light.danger} />
                <Text style={styles.actionText}>Lounge</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.aiSection}>
              <View style={styles.aiHeader}>
                <Zap size={20} color={Colors.light.accent} />
                <Text style={styles.aiTitle}>AI Assistant</Text>
              </View>
              <Text style={styles.aiDescription}>
                Get smart recommendations for your trip based on weather, traffic, and local events.
              </Text>
              <TouchableOpacity style={styles.aiButton}>
                <Text style={styles.aiButtonText}>Get AI Suggestions</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.tripsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {tripStatuses.find(s => s.key === selectedStatus)?.label} Trips
            </Text>
            <TouchableOpacity 
              onPress={() => setShowAddTripModal(true)}
              style={styles.addButton}
            >
              <Plus size={24} color={Colors.light.background} />
            </TouchableOpacity>
          </View>

          {filteredTrips.map((trip) => (
            <View key={trip.id} style={styles.tripCard}>
              <Image source={{ uri: trip.imageUrl }} style={styles.tripImage} />
              <View style={styles.tripContent}>
                <View style={styles.tripHeader}>
                  <Text style={styles.tripDestination}>{trip.destination}</Text>
                  <View style={styles.tripHeaderRight}>
                    {trip.hasNotifications && (
                      <View style={styles.alertBadge}>
                        <AlertTriangle size={12} color={Colors.light.danger} />
                      </View>
                    )}
                    {trip.status === 'upcoming' && (
                      <Text style={styles.tripCountdown}>
                        {getDaysUntil(trip.startDate)} days
                      </Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.tripDetails}>
                  <View style={styles.tripDetail}>
                    <Calendar size={16} color={Colors.light.gray} />
                    <Text style={styles.tripDetailText}>
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </Text>
                  </View>
                  
                  {trip.flightNumber && (
                    <View style={styles.tripDetail}>
                      <Plane size={16} color={Colors.light.gray} />
                      <Text style={styles.tripDetailText}>{trip.flightNumber}</Text>
                    </View>
                  )}
                  
                  <View style={styles.tripDetail}>
                    <MapPin size={16} color={Colors.light.gray} />
                    <Text style={styles.tripDetailText}>{trip.purpose}</Text>
                  </View>
                  
                  {trip.meetings && trip.meetings.length > 0 && (
                    <View style={styles.tripDetail}>
                      <Users size={16} color={Colors.light.gray} />
                      <Text style={styles.tripDetailText}>
                        {trip.meetings.length} meetings scheduled
                      </Text>
                    </View>
                  )}
                </View>
                
                {trip.status === 'current' && trip.itinerary && (
                  <View style={styles.itineraryPreview}>
                    <Text style={styles.itineraryTitle}>Today's Schedule</Text>
                    {trip.itinerary.slice(0, 2).map((item) => (
                      <View key={item.id} style={styles.itineraryItem}>
                        <Text style={styles.itineraryTime}>{item.time}</Text>
                        <Text style={styles.itineraryItemTitle}>{item.title}</Text>
                      </View>
                    ))}
                  </View>
                )}
                
                {trip.status === 'upcoming' && (
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => handleCancelTrip(trip.id, trip.destination)}
                  >
                    <X size={16} color={Colors.light.danger} />
                    <Text style={styles.cancelButtonText}>Cancel Trip</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showAddTripModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          resetForm();
          setShowAddTripModal(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Trip</Text>
            <TouchableOpacity 
              onPress={() => {
                resetForm();
                setShowAddTripModal(false);
              }}
              style={styles.closeButton}
            >
              <X size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Destination *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., New York, NY"
                value={newTrip.destination}
                onChangeText={(text) => setNewTrip(prev => ({ ...prev, destination: text }))}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.formLabel}>Start Date *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  value={newTrip.startDate}
                  onChangeText={(text) => setNewTrip(prev => ({ ...prev, startDate: text }))}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.formLabel}>End Date *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  value={newTrip.endDate}
                  onChangeText={(text) => setNewTrip(prev => ({ ...prev, endDate: text }))}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Purpose *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Client Meeting, Conference, Training"
                value={newTrip.purpose}
                onChangeText={(text) => setNewTrip(prev => ({ ...prev, purpose: text }))}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Flight Number</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., AA 1234"
                value={newTrip.flightNumber}
                onChangeText={(text) => setNewTrip(prev => ({ ...prev, flightNumber: text }))}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Hotel</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Manhattan Business Hotel"
                value={newTrip.hotel}
                onChangeText={(text) => setNewTrip(prev => ({ ...prev, hotel: text }))}
              />
            </View>

            <TouchableOpacity 
              style={styles.addTripButton}
              onPress={handleAddTrip}
            >
              <Plus size={20} color={Colors.light.background} />
              <Text style={styles.addTripButtonText}>Add Trip</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentTripCard: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    padding: 20,
  },
  currentTripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  notificationText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.danger,
  },
  currentTripTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.background,
    opacity: 0.9,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.success,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.primary,
  },
  currentTripDestination: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.background,
    marginBottom: 4,
  },
  currentTripDates: {
    fontSize: 14,
    color: Colors.light.background,
    opacity: 0.9,
    marginBottom: 12,
  },
  nextActivity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  nextActivityText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.background,
  },
  statusTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statusTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundSecondary,
    gap: 8,
  },
  statusTabActive: {
    backgroundColor: Colors.light.primary,
  },
  statusTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  statusTabTextActive: {
    color: Colors.light.background,
  },
  statusBadge: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  statusBadgeActive: {
    backgroundColor: Colors.light.background,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
  },
  statusBadgeTextActive: {
    color: Colors.light.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  quickActions: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  aiSection: {
    marginTop: 24,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  aiDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  aiButton: {
    backgroundColor: Colors.light.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  aiButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.background,
  },
  tripsSection: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tripCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  tripImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  tripContent: {
    padding: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertBadge: {
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 4,
    borderRadius: 12,
  },
  tripDestination: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  tripCountdown: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.accent,
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tripDetails: {
    gap: 8,
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripDetailText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  itineraryPreview: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  itineraryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  itineraryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itineraryTime: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.primary,
    width: 60,
  },
  itineraryItemTitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  addTripButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
    gap: 8,
  },
  addTripButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.background,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.danger,
    gap: 6,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.danger,
  },
});

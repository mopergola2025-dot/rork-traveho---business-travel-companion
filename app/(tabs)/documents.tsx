import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {
  FileText,
  CreditCard,
  Shield,
  Plane,
  Plus,
  Camera,
  Mic,
  Users,
  Play,
  Square,
  Send,
  CheckSquare,
  Square as SquareIcon,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  MapPin,
  X,
  UserPlus,
  Check,
} from 'lucide-react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';

import Colors from '@/constants/colors';
import { useTravelFriends } from '@/contexts/TravelFriendsContext';

interface Document {
  id: string;
  name: string;
  type: 'flight' | 'hotel' | 'passport' | 'visa' | 'boarding' | 'insurance' | 'vaccination' | 'other';
  uploadDate: string;
}

const documentTypes = [
  { type: 'flight' as const, label: 'Flight Tickets', icon: Plane },
  { type: 'hotel' as const, label: 'Hotel Bookings', icon: FileText },
  { type: 'passport' as const, label: 'Passport Copy', icon: FileText },
  { type: 'visa' as const, label: 'Visa Documents', icon: FileText },
  { type: 'boarding' as const, label: 'Boarding Pass', icon: Plane },
  { type: 'insurance' as const, label: 'Travel Insurance', icon: Shield },
  { type: 'vaccination' as const, label: 'Vaccination Card', icon: CreditCard },
  { type: 'other' as const, label: 'Other Documents', icon: FileText },
];

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  location?: string;
  attendees: string[];
  friendAttendees: string[]; // IDs of travel friends
  description?: string;
  hasRecording?: boolean;
  hasSummary?: boolean;
}

interface BusinessCard {
  id: string;
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  scannedDate: string;
}

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdDate: string;
  category: 'meeting' | 'document' | 'travel' | 'general';
}

export default function DocumentsScreen() {
  const { connectedFriends, getFriendsByIds } = useTravelFriends();
  const [activeTab, setActiveTab] = useState<'documents' | 'meetings' | 'cards' | 'todos'>('documents');
  const [meetingView, setMeetingView] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showAddMeeting, setShowAddMeeting] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showAddTodo, setShowAddTodo] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [newTodoDescription, setNewTodoDescription] = useState<string>('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTodoCategory, setNewTodoCategory] = useState<'meeting' | 'document' | 'travel' | 'general'>('general');
  const [newTodoDueDate, setNewTodoDueDate] = useState<string>('');
  
  // New meeting form state
  const [newMeetingTitle, setNewMeetingTitle] = useState<string>('');
  const [newMeetingDate, setNewMeetingDate] = useState<string>(selectedDate);
  const [newMeetingTime, setNewMeetingTime] = useState<string>('09:00');
  const [newMeetingDuration, setNewMeetingDuration] = useState<string>('30 min');
  const [newMeetingLocation, setNewMeetingLocation] = useState<string>('');
  const [newMeetingDescription, setNewMeetingDescription] = useState<string>('');
  const [newMeetingAttendees, setNewMeetingAttendees] = useState<string>('');
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [showFriendSelector, setShowFriendSelector] = useState<boolean>(false);
  
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Passport - John Doe',
      type: 'passport',
      uploadDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Travel Insurance Policy',
      type: 'insurance',
      uploadDate: '2024-01-14',
    },
  ]);
  
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Client Strategy Meeting',
      date: '2024-01-20',
      time: '14:00',
      duration: '45 min',
      location: 'Conference Room A',
      attendees: ['John Smith'],
      friendAttendees: ['1', '2'], // Sarah Johnson, Mike Chen
      description: 'Quarterly strategy review and planning session',
      hasRecording: true,
      hasSummary: true,
    },
    {
      id: '2',
      title: 'Project Kickoff',
      date: '2024-01-18',
      time: '10:30',
      duration: '30 min',
      location: 'Virtual - Zoom',
      attendees: ['David Brown'],
      friendAttendees: ['3'], // Emma Wilson
      description: 'Initial project planning and team introduction',
      hasRecording: false,
      hasSummary: false,
    },
    {
      id: '3',
      title: 'Weekly Team Sync',
      date: '2024-01-22',
      time: '09:00',
      duration: '60 min',
      location: 'Meeting Room B',
      attendees: ['Alice Cooper', 'Bob Johnson', 'Carol Smith'],
      friendAttendees: [],
      description: 'Weekly progress update and planning',
      hasRecording: false,
      hasSummary: false,
    },
  ]);
  
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: '1',
      title: 'Upload passport copy',
      description: 'Scan and upload passport for upcoming business trip',
      completed: false,
      priority: 'high',
      dueDate: '2024-01-25',
      createdDate: '2024-01-20',
      category: 'document',
    },
    {
      id: '2',
      title: 'Prepare meeting agenda',
      description: 'Create agenda for client strategy meeting',
      completed: true,
      priority: 'medium',
      createdDate: '2024-01-18',
      category: 'meeting',
    },
    {
      id: '3',
      title: 'Book hotel for conference',
      description: 'Find and book accommodation near conference venue',
      completed: false,
      priority: 'high',
      dueDate: '2024-01-22',
      createdDate: '2024-01-19',
      category: 'travel',
    },
  ]);
  
  const [businessCards] = useState<BusinessCard[]>([
    {
      id: '1',
      name: 'Alex Thompson',
      company: 'TechCorp Inc.',
      position: 'Senior Developer',
      email: 'alex@techcorp.com',
      phone: '+1-555-0123',
      scannedDate: '2024-01-19',
    },
    {
      id: '2',
      name: 'Maria Garcia',
      company: 'Design Studio',
      position: 'Creative Director',
      email: 'maria@designstudio.com',
      phone: '+1-555-0456',
      scannedDate: '2024-01-17',
    },
  ]);

  const handleUpload = async (type: Document['type']) => {
    try {
      console.log(`Opening document picker for ${type}`);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      
      console.log('Document picker result:', result);
      
      if (result.canceled) {
        console.log('Document picker was cancelled');
        return;
      }
      
      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log('Selected file:', file);
        
        const newDocument: Document = {
          id: Date.now().toString(),
          name: file.name,
          type: type,
          uploadDate: new Date().toISOString().split('T')[0],
        };
        
        setDocuments([newDocument, ...documents]);
        
        Alert.alert(
          'Success',
          `${file.name} has been uploaded successfully!`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert(
        'Error',
        'Failed to upload document. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };
  
  const handleStartRecording = () => {
    setIsRecording(true);
    console.log('Start recording meeting');
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
    console.log('Stop recording meeting');
  };
  
  const handleScanBusinessCard = () => {
    console.log('Scan business card');
  };
  
  const handleViewDocument = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      Alert.alert(
        'View Document',
        `Opening ${doc.name}`,
        [{ text: 'OK' }]
      );
      console.log('View document:', doc);
    }
  };
  
  const handleDeleteDocument = (docId: string) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDocuments(documents.filter(doc => doc.id !== docId));
            Alert.alert('Success', 'Document deleted successfully!');
          }
        }
      ]
    );
  };
  
  const handleSendSummary = (meetingId: string) => {
    console.log(`Send summary for meeting ${meetingId}`);
  };
  
  const handleAddMeeting = () => {
    if (newMeetingTitle.trim()) {
      const newMeeting: Meeting = {
        id: Date.now().toString(),
        title: newMeetingTitle.trim(),
        date: newMeetingDate,
        time: newMeetingTime,
        duration: newMeetingDuration,
        location: newMeetingLocation.trim() || undefined,
        description: newMeetingDescription.trim() || undefined,
        attendees: newMeetingAttendees.split(',').map(a => a.trim()).filter(a => a.length > 0),
        friendAttendees: selectedFriendIds,
        hasRecording: false,
        hasSummary: false,
      };
      setMeetings([...meetings, newMeeting]);
      
      // Reset form
      setNewMeetingTitle('');
      setNewMeetingDate(selectedDate);
      setNewMeetingTime('09:00');
      setNewMeetingDuration('30 min');
      setNewMeetingLocation('');
      setNewMeetingDescription('');
      setNewMeetingAttendees('');
      setSelectedFriendIds([]);
      setShowFriendSelector(false);
      setShowAddMeeting(false);
      
      Alert.alert('Success', 'Meeting added successfully!');
    } else {
      Alert.alert('Error', 'Please enter a meeting title.');
    }
  };
  
  const getMeetingsForDate = (date: string) => {
    return meetings.filter(meeting => meeting.date === date);
  };
  
  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};
    
    meetings.forEach(meeting => {
      marked[meeting.date] = {
        marked: true,
        dotColor: Colors.light.primary,
      };
    });
    
    // Highlight selected date
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: Colors.light.primary,
    };
    
    return marked;
  };
  
  const handleAddTodo = () => {
    if (newTodoTitle.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        title: newTodoTitle.trim(),
        description: newTodoDescription.trim() || undefined,
        completed: false,
        priority: newTodoPriority,
        dueDate: newTodoDueDate || undefined,
        createdDate: new Date().toISOString().split('T')[0],
        category: newTodoCategory,
      };
      setTodos([newTodo, ...todos]);
      setNewTodoTitle('');
      setNewTodoDescription('');
      setNewTodoPriority('medium');
      setNewTodoCategory('general');
      setNewTodoDueDate('');
      setShowAddTodo(false);
    }
  };
  
  const handleToggleTodo = (todoId: string) => {
    setTodos(todos.map(todo => 
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const handleDeleteTodo = (todoId: string) => {
    setTodos(todos.filter(todo => todo.id !== todoId));
  };
  
  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return Colors.light.danger;
      case 'medium': return Colors.light.warning;
      case 'low': return Colors.light.success;
      default: return Colors.light.gray;
    }
  };
  
  const getCategoryIcon = (category: 'meeting' | 'document' | 'travel' | 'general') => {
    switch (category) {
      case 'meeting': return Users;
      case 'document': return FileText;
      case 'travel': return Plane;
      case 'general': return SquareIcon;
      default: return SquareIcon;
    }
  };

  const handleToggleFriend = (friendId: string) => {
    setSelectedFriendIds(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const getAllAttendees = (meeting: Meeting) => {
    const friendAttendees = getFriendsByIds(meeting.friendAttendees);
    return [
      ...meeting.attendees,
      ...friendAttendees.map(friend => friend.name)
    ];
  };

  const getSelectedFriendsText = () => {
    if (selectedFriendIds.length === 0) return 'No travel friends selected';
    const selectedFriends = getFriendsByIds(selectedFriendIds);
    if (selectedFriends.length <= 2) {
      return selectedFriends.map(f => f.name).join(', ');
    }
    return `${selectedFriends.slice(0, 2).map(f => f.name).join(', ')} +${selectedFriends.length - 2} more`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Documents & Meetings</Text>
        <Text style={styles.subtitle}>Manage documents, meetings, and business cards</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'documents' && styles.tabActive]}
            onPress={() => setActiveTab('documents')}
          >
            <Text style={[styles.tabText, activeTab === 'documents' && styles.tabTextActive]}>
              Documents
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'meetings' && styles.tabActive]}
            onPress={() => setActiveTab('meetings')}
          >
            <Text style={[styles.tabText, activeTab === 'meetings' && styles.tabTextActive]}>
              Meetings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'cards' && styles.tabActive]}
            onPress={() => setActiveTab('cards')}
          >
            <Text style={[styles.tabText, activeTab === 'cards' && styles.tabTextActive]}>
              Cards
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'todos' && styles.tabActive]}
            onPress={() => setActiveTab('todos')}
          >
            <Text style={[styles.tabText, activeTab === 'todos' && styles.tabTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'documents' && (
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Upload</Text>
              <View style={styles.uploadGrid}>
                {documentTypes.map((docType) => {
                  const IconComponent = docType.icon;
                  return (
                    <TouchableOpacity
                      key={docType.type}
                      style={styles.uploadCard}
                      onPress={() => handleUpload(docType.type)}
                    >
                      <View style={styles.uploadIconContainer}>
                        <IconComponent size={24} color={Colors.light.primary} />
                      </View>
                      <Text style={styles.uploadLabel}>{docType.label}</Text>
                      <Plus size={16} color={Colors.light.gray} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Documents</Text>
              {documents.map((doc) => {
                const docType = documentTypes.find((dt) => dt.type === doc.type);
                const IconComponent = docType?.icon || FileText;
                
                return (
                  <TouchableOpacity key={doc.id} style={styles.documentCard}>
                    <View style={styles.documentIcon}>
                      <IconComponent size={20} color={Colors.light.primary} />
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName}>{doc.name}</Text>
                      <Text style={styles.documentDate}>
                        Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.documentActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleViewDocument(doc.id)}
                      >
                        <Text style={styles.actionText}>View</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleDeleteDocument(doc.id)}
                      >
                        <Trash2 size={16} color={Colors.light.danger} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
        
        {activeTab === 'meetings' && (
          <View>
            <View style={styles.section}>
              <View style={styles.meetingHeader}>
                <Text style={styles.sectionTitle}>Meetings & Calendar</Text>
                <View style={styles.meetingViewToggle}>
                  <TouchableOpacity
                    style={[styles.viewToggleButton, meetingView === 'list' && styles.viewToggleButtonActive]}
                    onPress={() => setMeetingView('list')}
                  >
                    <Text style={[styles.viewToggleText, meetingView === 'list' && styles.viewToggleTextActive]}>List</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.viewToggleButton, meetingView === 'calendar' && styles.viewToggleButtonActive]}
                    onPress={() => setMeetingView('calendar')}
                  >
                    <Calendar size={16} color={meetingView === 'calendar' ? Colors.light.background : Colors.light.textSecondary} />
                    <Text style={[styles.viewToggleText, meetingView === 'calendar' && styles.viewToggleTextActive]}>Calendar</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.addMeetingButton}
                onPress={() => setShowAddMeeting(!showAddMeeting)}
              >
                <Plus size={20} color={Colors.light.background} />
                <Text style={styles.addMeetingButtonText}>Add Meeting</Text>
              </TouchableOpacity>
            </View>
            
            {showAddMeeting && (
              <View style={styles.section}>
                <View style={styles.addMeetingForm}>
                  <View style={styles.formHeader}>
                    <Text style={styles.formTitle}>New Meeting</Text>
                    <TouchableOpacity 
                      style={styles.closeButton}
                      onPress={() => setShowAddMeeting(false)}
                    >
                      <X size={20} color={Colors.light.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Title *</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={newMeetingTitle}
                      onChangeText={setNewMeetingTitle}
                      placeholder="Enter meeting title"
                      placeholderTextColor={Colors.light.textSecondary}
                    />
                  </View>
                  
                  <View style={styles.inputRow}>
                    <View style={styles.inputGroupHalf}>
                      <Text style={styles.inputLabel}>Date</Text>
                      <TextInput
                        style={styles.textInputField}
                        value={newMeetingDate}
                        onChangeText={setNewMeetingDate}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={Colors.light.textSecondary}
                      />
                    </View>
                    <View style={styles.inputGroupHalf}>
                      <Text style={styles.inputLabel}>Time</Text>
                      <TextInput
                        style={styles.textInputField}
                        value={newMeetingTime}
                        onChangeText={setNewMeetingTime}
                        placeholder="HH:MM"
                        placeholderTextColor={Colors.light.textSecondary}
                      />
                    </View>
                  </View>
                  
                  <View style={styles.inputRow}>
                    <View style={styles.inputGroupHalf}>
                      <Text style={styles.inputLabel}>Duration</Text>
                      <View style={styles.durationSelector}>
                        {['30 min', '45 min', '60 min', '90 min'].map((duration) => (
                          <TouchableOpacity
                            key={duration}
                            style={[
                              styles.durationOption,
                              newMeetingDuration === duration && styles.durationOptionActive
                            ]}
                            onPress={() => setNewMeetingDuration(duration)}
                          >
                            <Text style={[
                              styles.durationOptionText,
                              newMeetingDuration === duration && styles.durationOptionTextActive
                            ]}>
                              {duration}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    <View style={styles.inputGroupHalf}>
                      <Text style={styles.inputLabel}>Location</Text>
                      <TextInput
                        style={styles.textInputField}
                        value={newMeetingLocation}
                        onChangeText={setNewMeetingLocation}
                        placeholder="Meeting location"
                        placeholderTextColor={Colors.light.textSecondary}
                      />
                    </View>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Attendees</Text>
                    <TextInput
                      style={styles.textInputField}
                      value={newMeetingAttendees}
                      onChangeText={setNewMeetingAttendees}
                      placeholder="Enter attendees separated by commas"
                      placeholderTextColor={Colors.light.textSecondary}
                      multiline
                    />
                    
                    <View style={styles.friendsSection}>
                      <View style={styles.friendsSectionHeader}>
                        <Text style={styles.friendsSectionTitle}>Travel Friends</Text>
                        <TouchableOpacity 
                          style={styles.addFriendsButton}
                          onPress={() => setShowFriendSelector(!showFriendSelector)}
                        >
                          <UserPlus size={16} color={Colors.light.primary} />
                          <Text style={styles.addFriendsButtonText}>Add Friends</Text>
                        </TouchableOpacity>
                      </View>
                      
                      <Text style={styles.selectedFriendsText}>{getSelectedFriendsText()}</Text>
                      
                      {showFriendSelector && (
                        <View style={styles.friendSelector}>
                          <Text style={styles.friendSelectorTitle}>Select Travel Friends</Text>
                          <ScrollView style={styles.friendsList} showsVerticalScrollIndicator={false}>
                            {connectedFriends.map((friend) => {
                              const isSelected = selectedFriendIds.includes(friend.id);
                              return (
                                <TouchableOpacity
                                  key={friend.id}
                                  style={[
                                    styles.friendItem,
                                    isSelected && styles.friendItemSelected
                                  ]}
                                  onPress={() => handleToggleFriend(friend.id)}
                                >
                                  <View style={styles.friendInfo}>
                                    <View style={styles.friendAvatarContainer}>
                                      <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                                      {friend.isOnline && <View style={styles.onlineIndicator} />}
                                    </View>
                                    <View style={styles.friendDetails}>
                                      <Text style={styles.friendName}>{friend.name}</Text>
                                      <View style={styles.friendLocation}>
                                        <MapPin size={12} color={Colors.light.textSecondary} />
                                        <Text style={styles.friendLocationText}>{friend.location}</Text>
                                      </View>
                                    </View>
                                  </View>
                                  <View style={[
                                    styles.friendCheckbox,
                                    isSelected && styles.friendCheckboxSelected
                                  ]}>
                                    {isSelected && <Check size={16} color={Colors.light.background} />}
                                  </View>
                                </TouchableOpacity>
                              );
                            })}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput
                      style={[styles.textInputField, styles.textInputMultiline]}
                      value={newMeetingDescription}
                      onChangeText={setNewMeetingDescription}
                      placeholder="Meeting description or agenda"
                      placeholderTextColor={Colors.light.textSecondary}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                  
                  <View style={styles.formActions}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => setShowAddMeeting(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.saveButton}
                      onPress={handleAddMeeting}
                    >
                      <Text style={styles.saveButtonText}>Add Meeting</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            
            {meetingView === 'calendar' ? (
              <View style={styles.section}>
                <View style={styles.calendarContainer}>
                  <RNCalendar
                    current={selectedDate}
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                    markedDates={getMarkedDates()}
                    theme={{
                      backgroundColor: Colors.light.background,
                      calendarBackground: Colors.light.background,
                      textSectionTitleColor: Colors.light.textSecondary,
                      selectedDayBackgroundColor: Colors.light.primary,
                      selectedDayTextColor: Colors.light.background,
                      todayTextColor: Colors.light.primary,
                      dayTextColor: Colors.light.text,
                      textDisabledColor: Colors.light.gray,
                      dotColor: Colors.light.primary,
                      selectedDotColor: Colors.light.background,
                      arrowColor: Colors.light.primary,
                      monthTextColor: Colors.light.text,
                      indicatorColor: Colors.light.primary,
                      textDayFontWeight: '500',
                      textMonthFontWeight: '600',
                      textDayHeaderFontWeight: '500',
                    }}
                  />
                </View>
                
                <View style={styles.selectedDateSection}>
                  <Text style={styles.selectedDateTitle}>
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                  
                  {getMeetingsForDate(selectedDate).length === 0 ? (
                    <View style={styles.noMeetingsContainer}>
                      <Calendar size={32} color={Colors.light.gray} />
                      <Text style={styles.noMeetingsText}>No meetings scheduled</Text>
                    </View>
                  ) : (
                    getMeetingsForDate(selectedDate).map((meeting) => (
                      <View key={meeting.id} style={styles.calendarMeetingCard}>
                        <View style={styles.meetingTimeContainer}>
                          <Text style={styles.meetingTime}>{meeting.time}</Text>
                          <Text style={styles.meetingDuration}>{meeting.duration}</Text>
                        </View>
                        <View style={styles.meetingDetails}>
                          <Text style={styles.meetingTitle}>{meeting.title}</Text>
                          {meeting.location && (
                            <View style={styles.meetingLocationContainer}>
                              <MapPin size={14} color={Colors.light.textSecondary} />
                              <Text style={styles.meetingLocation}>{meeting.location}</Text>
                            </View>
                          )}
                          {getAllAttendees(meeting).length > 0 && (
                            <View style={styles.meetingAttendeesContainer}>
                              <Users size={14} color={Colors.light.textSecondary} />
                              <Text style={styles.meetingAttendees}>
                                {getAllAttendees(meeting).slice(0, 2).join(', ')}
                                {getAllAttendees(meeting).length > 2 && ` +${getAllAttendees(meeting).length - 2} more`}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </View>
            ) : (
              <View>
                <View style={styles.section}>
                  <View style={styles.recordingSection}>
                    <View style={styles.recordingHeader}>
                      <Mic size={24} color={isRecording ? Colors.light.danger : Colors.light.primary} />
                      <Text style={styles.recordingTitle}>
                        {isRecording ? 'Recording in progress...' : 'Meeting Recorder'}
                      </Text>
                    </View>
                    <Text style={styles.recordingSubtitle}>
                      Record meetings and get AI-powered summaries
                    </Text>
                    <TouchableOpacity 
                      style={[
                        styles.recordButton,
                        isRecording && styles.recordButtonActive
                      ]}
                      onPress={isRecording ? handleStopRecording : handleStartRecording}
                    >
                      {isRecording ? (
                        <Square size={20} color={Colors.light.background} />
                      ) : (
                        <Play size={20} color={Colors.light.background} />
                      )}
                      <Text style={styles.recordButtonText}>
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>All Meetings</Text>
                  {meetings.map((meeting) => (
                    <View key={meeting.id} style={styles.meetingCard}>
                      <View style={styles.meetingHeader}>
                        <View style={styles.meetingInfo}>
                          <Text style={styles.meetingTitle}>{meeting.title}</Text>
                          <Text style={styles.meetingDate}>
                            {new Date(meeting.date).toLocaleDateString()} at {meeting.time} • {meeting.duration}
                          </Text>
                          {meeting.location && (
                            <View style={styles.meetingLocationContainer}>
                              <MapPin size={14} color={Colors.light.textSecondary} />
                              <Text style={styles.meetingLocation}>{meeting.location}</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.meetingBadges}>
                          {meeting.hasRecording && (
                            <View style={styles.badge}>
                              <Play size={12} color={Colors.light.success} />
                            </View>
                          )}
                          {meeting.hasSummary && (
                            <View style={styles.badge}>
                              <FileText size={12} color={Colors.light.primary} />
                            </View>
                          )}
                        </View>
                      </View>
                      
                      {meeting.description && (
                        <Text style={styles.meetingDescription}>{meeting.description}</Text>
                      )}
                      
                      <View style={styles.attendeesSection}>
                        <Users size={16} color={Colors.light.gray} />
                        <Text style={styles.attendeesText}>
                          {getAllAttendees(meeting).join(', ')}
                        </Text>
                      </View>
                      
                      <View style={styles.meetingActions}>
                        {meeting.hasRecording && (
                          <TouchableOpacity style={styles.meetingActionButton}>
                            <Play size={16} color={Colors.light.primary} />
                            <Text style={styles.meetingActionText}>Play</Text>
                          </TouchableOpacity>
                        )}
                        {meeting.hasSummary && (
                          <TouchableOpacity 
                            style={styles.meetingActionButton}
                            onPress={() => handleSendSummary(meeting.id)}
                          >
                            <Send size={16} color={Colors.light.accent} />
                            <Text style={styles.meetingActionText}>Send Summary</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
        
        {activeTab === 'cards' && (
          <View>
            <View style={styles.section}>
              <TouchableOpacity 
                style={styles.scannerCard}
                onPress={handleScanBusinessCard}
              >
                <View style={styles.scannerIcon}>
                  <Camera size={24} color={Colors.light.accent} />
                </View>
                <View style={styles.scannerInfo}>
                  <Text style={styles.scannerTitle}>Scan Business Card</Text>
                  <Text style={styles.scannerSubtitle}>
                    Use camera to scan and save business cards
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Saved Business Cards</Text>
              {businessCards.map((card) => (
                <View key={card.id} style={styles.businessCardItem}>
                  <View style={styles.businessCardInfo}>
                    <Text style={styles.businessCardName}>{card.name}</Text>
                    <Text style={styles.businessCardCompany}>
                      {card.position} at {card.company}
                    </Text>
                    <Text style={styles.businessCardContact}>
                      {card.email} • {card.phone}
                    </Text>
                    <Text style={styles.businessCardDate}>
                      Scanned {new Date(card.scannedDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.businessCardActions}>
                    <TouchableOpacity style={styles.contactButton}>
                      <Text style={styles.contactButtonText}>Contact</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {activeTab === 'todos' && (
          <View>
            <View style={styles.section}>
              <View style={styles.todoHeader}>
                <Text style={styles.sectionTitle}>Todo List</Text>
                <TouchableOpacity 
                  style={styles.addTodoButton}
                  onPress={() => setShowAddTodo(!showAddTodo)}
                >
                  <Plus size={20} color={Colors.light.background} />
                  <Text style={styles.addTodoButtonText}>Add Todo</Text>
                </TouchableOpacity>
              </View>
              
              {showAddTodo && (
                <View style={styles.addTodoForm}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Title *</Text>
                    <View style={styles.textInput}>
                      <Text 
                        style={styles.textInputText}
                        onPress={() => console.log('Open text input for title')}
                      >
                        {newTodoTitle || 'Enter todo title...'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Description</Text>
                    <View style={[styles.textInput, styles.textInputMultiline]}>
                      <Text 
                        style={styles.textInputText}
                        onPress={() => console.log('Open text input for description')}
                      >
                        {newTodoDescription || 'Enter description...'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.inputRow}>
                    <View style={styles.inputGroupHalf}>
                      <Text style={styles.inputLabel}>Priority</Text>
                      <View style={styles.prioritySelector}>
                        {(['low', 'medium', 'high'] as const).map((priority) => (
                          <TouchableOpacity
                            key={priority}
                            style={[
                              styles.priorityOption,
                              newTodoPriority === priority && styles.priorityOptionActive,
                              { borderColor: getPriorityColor(priority) }
                            ]}
                            onPress={() => setNewTodoPriority(priority)}
                          >
                            <Text style={[
                              styles.priorityOptionText,
                              newTodoPriority === priority && { color: getPriorityColor(priority) }
                            ]}>
                              {priority.charAt(0).toUpperCase() + priority.slice(1)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    
                    <View style={styles.inputGroupHalf}>
                      <Text style={styles.inputLabel}>Category</Text>
                      <View style={styles.categorySelector}>
                        {(['general', 'meeting', 'document', 'travel'] as const).map((category) => (
                          <TouchableOpacity
                            key={category}
                            style={[
                              styles.categoryOption,
                              newTodoCategory === category && styles.categoryOptionActive
                            ]}
                            onPress={() => setNewTodoCategory(category)}
                          >
                            <Text style={[
                              styles.categoryOptionText,
                              newTodoCategory === category && styles.categoryOptionTextActive
                            ]}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.formActions}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => {
                        setShowAddTodo(false);
                        setNewTodoTitle('');
                        setNewTodoDescription('');
                        setNewTodoPriority('medium');
                        setNewTodoCategory('general');
                        setNewTodoDueDate('');
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.saveButton}
                      onPress={handleAddTodo}
                    >
                      <Text style={styles.saveButtonText}>Add Todo</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
            
            <View style={styles.section}>
              <View style={styles.todoStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{todos.filter(t => !t.completed).length}</Text>
                  <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{todos.filter(t => t.completed).length}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{todos.filter(t => t.priority === 'high' && !t.completed).length}</Text>
                  <Text style={styles.statLabel}>High Priority</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>All Todos</Text>
              {todos.length === 0 ? (
                <View style={styles.emptyState}>
                  <CheckSquare size={48} color={Colors.light.gray} />
                  <Text style={styles.emptyStateTitle}>No todos yet</Text>
                  <Text style={styles.emptyStateSubtitle}>Add your first todo to get started</Text>
                </View>
              ) : (
                todos.map((todo) => {
                  const CategoryIcon = getCategoryIcon(todo.category);
                  return (
                    <View key={todo.id} style={[
                      styles.todoItem,
                      todo.completed && styles.todoItemCompleted
                    ]}>
                      <TouchableOpacity 
                        style={styles.todoCheckbox}
                        onPress={() => handleToggleTodo(todo.id)}
                      >
                        {todo.completed ? (
                          <CheckSquare size={24} color={Colors.light.success} />
                        ) : (
                          <SquareIcon size={24} color={Colors.light.gray} />
                        )}
                      </TouchableOpacity>
                      
                      <View style={styles.todoContent}>
                        <View style={styles.todoHeader}>
                          <Text style={[
                            styles.todoTitle,
                            todo.completed && styles.todoTitleCompleted
                          ]}>
                            {todo.title}
                          </Text>
                          <View style={styles.todoMeta}>
                            <View style={[
                              styles.priorityBadge,
                              { backgroundColor: getPriorityColor(todo.priority) + '20' }
                            ]}>
                              <Text style={[
                                styles.priorityBadgeText,
                                { color: getPriorityColor(todo.priority) }
                              ]}>
                                {todo.priority.toUpperCase()}
                              </Text>
                            </View>
                            <View style={styles.categoryBadge}>
                              <CategoryIcon size={12} color={Colors.light.textSecondary} />
                              <Text style={styles.categoryBadgeText}>{todo.category}</Text>
                            </View>
                          </View>
                        </View>
                        
                        {todo.description && (
                          <Text style={[
                            styles.todoDescription,
                            todo.completed && styles.todoDescriptionCompleted
                          ]}>
                            {todo.description}
                          </Text>
                        )}
                        
                        <View style={styles.todoFooter}>
                          <View style={styles.todoDateInfo}>
                            <Calendar size={14} color={Colors.light.textSecondary} />
                            <Text style={styles.todoDate}>
                              Created {new Date(todo.createdDate).toLocaleDateString()}
                            </Text>
                            {todo.dueDate && (
                              <>
                                <Clock size={14} color={Colors.light.warning} />
                                <Text style={[
                                  styles.todoDueDate,
                                  new Date(todo.dueDate) < new Date() && !todo.completed && styles.todoOverdue
                                ]}>
                                  Due {new Date(todo.dueDate).toLocaleDateString()}
                                </Text>
                              </>
                            )}
                          </View>
                          
                          <View style={styles.todoActions}>
                            <TouchableOpacity 
                              style={styles.todoActionButton}
                              onPress={() => console.log('Edit todo', todo.id)}
                            >
                              <Edit3 size={16} color={Colors.light.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={styles.todoActionButton}
                              onPress={() => handleDeleteTodo(todo.id)}
                            >
                              <Trash2 size={16} color={Colors.light.danger} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        )}
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.light.background,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    color: Colors.light.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  uploadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  uploadCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  uploadIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  documentCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  documentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.background,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  scannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scannerInfo: {
    flex: 1,
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  scannerSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  recordingSection: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  recordingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  recordingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  recordingSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 16,
  },
  recordButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  recordButtonActive: {
    backgroundColor: Colors.light.danger,
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.background,
  },
  meetingCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  meetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  meetingInfo: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  meetingDate: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  meetingBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 6,
    borderRadius: 12,
  },
  attendeesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  attendeesText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  meetingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  meetingActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  meetingActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  businessCardItem: {
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
  businessCardInfo: {
    flex: 1,
  },
  businessCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  businessCardCompany: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  businessCardContact: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  businessCardDate: {
    fontSize: 12,
    color: Colors.light.gray,
  },
  businessCardActions: {
    flexDirection: 'row',
  },
  contactButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.background,
  },
  // Todo styles
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addTodoButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addTodoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.background,
  },
  addTodoForm: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minHeight: 44,
  },
  textInputMultiline: {
    minHeight: 80,
  },
  textInputText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputGroupHalf: {
    flex: 1,
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityOptionActive: {
    backgroundColor: Colors.light.backgroundSecondary,
  },
  priorityOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryOptionActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  categoryOptionTextActive: {
    color: Colors.light.background,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.background,
  },
  todoStats: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  emptyState: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  todoItem: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  todoItemCompleted: {
    opacity: 0.7,
  },
  todoCheckbox: {
    marginRight: 12,
    paddingTop: 2,
  },
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  todoTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.light.textSecondary,
  },
  todoMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  todoDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  todoDescriptionCompleted: {
    textDecorationLine: 'line-through',
  },
  todoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoDateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  todoDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginRight: 8,
  },
  todoDueDate: {
    fontSize: 12,
    color: Colors.light.warning,
  },
  todoOverdue: {
    color: Colors.light.danger,
    fontWeight: '600',
  },
  todoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  todoActionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  // Meeting and Calendar styles
  meetingViewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 8,
    padding: 2,
  },
  viewToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  viewToggleButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  viewToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  viewToggleTextActive: {
    color: Colors.light.background,
  },
  addMeetingButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  addMeetingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.background,
  },
  addMeetingForm: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
  },
  closeButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  textInputField: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    fontSize: 16,
    color: Colors.light.text,
    minHeight: 44,
  },
  durationSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  durationOptionActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  durationOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  durationOptionTextActive: {
    color: Colors.light.background,
  },
  calendarContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  selectedDateSection: {
    marginTop: 20,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  noMeetingsContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  noMeetingsText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginTop: 12,
  },
  calendarMeetingCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  meetingTimeContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  meetingTime: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  meetingDuration: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  meetingDetails: {
    flex: 1,
  },
  meetingLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  meetingLocation: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  meetingAttendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  meetingAttendees: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  meetingDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  // Travel Friends Selection Styles
  friendsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  friendsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  friendsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  addFriendsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 8,
    gap: 6,
  },
  addFriendsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.primary,
  },
  selectedFriendsText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  friendSelector: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  friendSelectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  friendsList: {
    maxHeight: 200,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  friendItemSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '10',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.success,
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  friendLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  friendLocationText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  friendCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
  },
  friendCheckboxSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
});
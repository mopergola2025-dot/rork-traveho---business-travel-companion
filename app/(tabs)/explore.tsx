import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Maps from '@/components/Maps';
import {
  MapPin,
  Search,
  Star,
  Utensils,
  Camera,
  Car,
  Phone,
  Train,
  Dumbbell,
  Languages,
  Wifi,
  Mic,
  Volume2,
  Copy,
  RotateCcw,
  Map,
  List,

} from 'lucide-react-native';

import Colors from '@/constants/colors';

interface Place {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance: string;
  description: string;
  isOpen: boolean;
  latitude: number;
  longitude: number;
  address?: string;
}





const categories = [
  { key: 'restaurants', label: 'Restaurants', icon: Utensils },
  { key: 'attractions', label: 'Attractions', icon: Camera },
  { key: 'transport', label: 'Transport', icon: Train },
  { key: 'services', label: 'Services', icon: Wifi },
  { key: 'fitness', label: 'Fitness', icon: Dumbbell },
  { key: 'emergency', label: 'Emergency', icon: Phone },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('restaurants');
  const [showTranslator, setShowTranslator] = useState<boolean>(false);
  const [sourceText, setSourceText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [sourceLang, setSourceLang] = useState<string>('en');
  const [targetLang, setTargetLang] = useState<string>('es');
  const [showSourceLangPicker, setShowSourceLangPicker] = useState<boolean>(false);
  const [showTargetLangPicker, setShowTargetLangPicker] = useState<boolean>(false);
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'tr', name: 'Turkish' },
  ];
  
  const [places] = useState<Place[]>([
    {
      id: '1',
      name: 'The Local Bistro',
      category: 'restaurants',
      rating: 4.5,
      distance: '0.3 km',
      description: 'Authentic local cuisine with great atmosphere',
      isOpen: true,
      latitude: 37.7849,
      longitude: -122.4094,
      address: '123 Main St, San Francisco, CA',
    },
    {
      id: '2',
      name: 'City Museum',
      category: 'attractions',
      rating: 4.8,
      distance: '1.2 km',
      description: 'Historical artifacts and modern art exhibitions',
      isOpen: true,
      latitude: 37.7849,
      longitude: -122.4074,
      address: '456 Museum Ave, San Francisco, CA',
    },
    {
      id: '3',
      name: 'Central Metro Station',
      category: 'transport',
      rating: 4.2,
      distance: '0.5 km',
      description: 'Main transportation hub with multiple lines',
      isOpen: true,
      latitude: 37.7839,
      longitude: -122.4084,
      address: '789 Transit Blvd, San Francisco, CA',
    },
    {
      id: '4',
      name: 'FitZone Gym',
      category: 'fitness',
      rating: 4.3,
      distance: '0.8 km',
      description: '24/7 fitness center with modern equipment',
      isOpen: true,
      latitude: 37.7859,
      longitude: -122.4104,
      address: '321 Fitness St, San Francisco, CA',
    },
    {
      id: '5',
      name: 'Grand Hotel Downtown',
      category: 'restaurants',
      rating: 4.6,
      distance: '0.7 km',
      description: 'Fine dining restaurant with city views',
      isOpen: true,
      latitude: 37.7869,
      longitude: -122.4114,
      address: '555 Hotel Plaza, San Francisco, CA',
    },
    {
      id: '6',
      name: 'Golden Gate Park',
      category: 'attractions',
      rating: 4.9,
      distance: '2.1 km',
      description: 'Beautiful park with gardens and recreational activities',
      isOpen: true,
      latitude: 37.7694,
      longitude: -122.4862,
      address: 'Golden Gate Park, San Francisco, CA',
    },
  ]);

  const filteredPlaces = places.filter(place => 
    place.category === selectedCategory &&
    place.name.toLowerCase().includes(searchQuery.toLowerCase())
  );








  
  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    
    try {
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: sourceText,
          source: sourceLang,
          target: targetLang,
          format: 'text',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Translation failed');
      }
      
      const data = await response.json();
      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      Alert.alert('Translation Error', 'Failed to translate text. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };
  
  const handleVoiceInput = () => {
    console.log('Start voice input');
  };
  
  const handlePlayTranslation = () => {
    console.log('Play translated text');
  };
  
  const handleCopyTranslation = () => {
    console.log('Copy translated text');
  };
  
  const handleSwapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    
    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Discover what is around you</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.light.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search places..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.gray}
          />
        </View>
      </View>

      <View style={styles.viewModeContainer}>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'map' && styles.viewModeButtonActive
          ]}
          onPress={() => setViewMode('map')}
        >
          <Map size={20} color={viewMode === 'map' ? Colors.light.background : Colors.light.primary} />
          <Text style={[
            styles.viewModeText,
            viewMode === 'map' && styles.viewModeTextActive
          ]}>Map</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'list' && styles.viewModeButtonActive
          ]}
          onPress={() => setViewMode('list')}
        >
          <List size={20} color={viewMode === 'list' ? Colors.light.background : Colors.light.primary} />
          <Text style={[
            styles.viewModeText,
            viewMode === 'list' && styles.viewModeTextActive
          ]}>List</Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'map' ? (
        <View style={styles.mapContainer}>
          <Maps 
            height={400} 
            showCurrentLocation={true}
            markers={filteredPlaces.map(place => ({
              latitude: place.latitude,
              longitude: place.longitude,
              title: place.name,
              description: place.description,
            }))}
          />
          
          <View style={styles.mapOverlay}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScrollMap}
            >
              {categories.map((category) => {
                const IconComponent = category.icon;
                const isSelected = selectedCategory === category.key;
                
                return (
                  <TouchableOpacity
                    key={category.key}
                    style={[
                      styles.categoryCardMap,
                      isSelected && styles.categoryCardMapSelected
                    ]}
                    onPress={() => setSelectedCategory(category.key)}
                  >
                    <View style={[
                      styles.categoryIconMap,
                      isSelected && styles.categoryIconMapSelected
                    ]}>
                      <IconComponent 
                        size={16} 
                        color={isSelected ? Colors.light.background : Colors.light.primary} 
                      />
                    </View>
                    <Text style={[
                      styles.categoryLabelMap,
                      isSelected && styles.categoryLabelMapSelected
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.key;
              
              return (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryCard,
                    isSelected && styles.categoryCardSelected
                  ]}
                  onPress={() => setSelectedCategory(category.key)}
                >
                  <View style={[
                    styles.categoryIcon,
                    isSelected && styles.categoryIconSelected
                  ]}>
                    <IconComponent 
                      size={20} 
                      color={isSelected ? Colors.light.background : Colors.light.primary} 
                    />
                  </View>
                  <Text style={[
                    styles.categoryLabel,
                    isSelected && styles.categoryLabelSelected
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {categories.find(cat => cat.key === selectedCategory)?.label || 'Places'}
          </Text>
          
          {filteredPlaces.map((place) => (
            <TouchableOpacity key={place.id} style={styles.placeCard}>
              <View style={styles.placeHeader}>
                <View style={styles.placeInfo}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeDescription}>{place.description}</Text>
                </View>
                <View style={styles.placeStatus}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: place.isOpen ? Colors.light.success : Colors.light.danger }
                  ]} />
                  <Text style={styles.statusText}>
                    {place.isOpen ? 'Open' : 'Closed'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.placeFooter}>
                <View style={styles.ratingContainer}>
                  <Star size={16} color={Colors.light.accent} fill={Colors.light.accent} />
                  <Text style={styles.rating}>{place.rating}</Text>
                </View>
                
                <View style={styles.distanceContainer}>
                  <MapPin size={16} color={Colors.light.gray} />
                  <Text style={styles.distance}>{place.distance}</Text>
                </View>
                
                <TouchableOpacity style={styles.directionsButton}>
                  <Text style={styles.directionsText}>Directions</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Services</Text>
          
          <TouchableOpacity 
            style={styles.serviceCard}
            onPress={() => setShowTranslator(!showTranslator)}
          >
            <View style={styles.serviceIcon}>
              <Languages size={24} color={Colors.light.primary} />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>AI Language Translator</Text>
              <Text style={styles.serviceSubtitle}>
                Translate text and speech in real-time
              </Text>
            </View>
          </TouchableOpacity>
          
          {showTranslator && (
            <View style={styles.translatorCard}>
              <View style={styles.translatorHeader}>
                <Text style={styles.translatorTitle}>AI Translator</Text>
                <View style={styles.languageSelector}>
                  <TouchableOpacity 
                    style={styles.languageButton}
                    onPress={() => setShowSourceLangPicker(true)}
                  >
                    <Text style={styles.languageText}>{sourceLang.toUpperCase()}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSwapLanguages}>
                    <RotateCcw size={20} color={Colors.light.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.languageButton}
                    onPress={() => setShowTargetLangPicker(true)}
                  >
                    <Text style={styles.languageText}>{targetLang.toUpperCase()}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.inputSection}>
                <View style={styles.textInputContainer}>
                  <TextInput
                    style={styles.translatorInput}
                    placeholder="Enter text to translate..."
                    value={sourceText}
                    onChangeText={setSourceText}
                    multiline
                    placeholderTextColor={Colors.light.gray}
                  />
                  <TouchableOpacity 
                    style={styles.voiceButton}
                    onPress={handleVoiceInput}
                  >
                    <Mic size={20} color={Colors.light.primary} />
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.translateButton,
                    isTranslating && styles.translateButtonLoading
                  ]}
                  onPress={handleTranslate}
                  disabled={isTranslating || !sourceText.trim()}
                >
                  <Text style={styles.translateButtonText}>
                    {isTranslating ? 'Translating...' : 'Translate'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {translatedText && (
                <View style={styles.outputSection}>
                  <View style={styles.translatedTextContainer}>
                    <Text style={styles.translatedText}>{translatedText}</Text>
                    <View style={styles.translationActions}>
                      <TouchableOpacity 
                        style={styles.translationAction}
                        onPress={handlePlayTranslation}
                      >
                        <Volume2 size={18} color={Colors.light.accent} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.translationAction}
                        onPress={handleCopyTranslation}
                      >
                        <Copy size={18} color={Colors.light.success} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.serviceCard}>
            <View style={styles.serviceIcon}>
              <Car size={24} color={Colors.light.accent} />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>Car Rental</Text>
              <Text style={styles.serviceSubtitle}>
                Find and book rental cars nearby
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceCard}>
            <View style={styles.serviceIcon}>
              <Wifi size={24} color={Colors.light.success} />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>SIM Card & Data</Text>
              <Text style={styles.serviceSubtitle}>
                Local SIM cards and data packages
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        </ScrollView>
      )}
      
      <Modal
        visible={showSourceLangPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSourceLangPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Source Language</Text>
              <TouchableOpacity onPress={() => setShowSourceLangPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.languageList}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageItem,
                    sourceLang === lang.code && styles.languageItemSelected
                  ]}
                  onPress={() => {
                    setSourceLang(lang.code);
                    setShowSourceLangPicker(false);
                  }}
                >
                  <Text style={[
                    styles.languageItemText,
                    sourceLang === lang.code && styles.languageItemTextSelected
                  ]}>
                    {lang.name}
                  </Text>
                  {sourceLang === lang.code && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      <Modal
        visible={showTargetLangPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTargetLangPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Target Language</Text>
              <TouchableOpacity onPress={() => setShowTargetLangPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.languageList}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageItem,
                    targetLang === lang.code && styles.languageItemSelected
                  ]}
                  onPress={() => {
                    setTargetLang(lang.code);
                    setShowTargetLangPicker(false);
                  }}
                >
                  <Text style={[
                    styles.languageItemText,
                    targetLang === lang.code && styles.languageItemTextSelected
                  ]}>
                    {lang.name}
                  </Text>
                  {targetLang === lang.code && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.backgroundSecondary,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  viewModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  viewModeButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.primary,
  },
  viewModeTextActive: {
    color: Colors.light.background,
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  categoriesScrollMap: {
    paddingHorizontal: 16,
  },
  categoryCardMap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  categoryCardMapSelected: {
    backgroundColor: Colors.light.primary,
  },
  categoryIconMap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryIconMapSelected: {
    backgroundColor: Colors.light.background,
  },
  categoryLabelMap: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.text,
  },
  categoryLabelMapSelected: {
    color: Colors.light.background,
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
  categoriesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minWidth: 80,
  },
  categoryCardSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryIconSelected: {
    backgroundColor: Colors.light.background,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.text,
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: Colors.light.background,
  },
  placeCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  placeInfo: {
    flex: 1,
    marginRight: 12,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  placeDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  placeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  placeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  directionsButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  directionsText: {
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  translatorCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  translatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  translatorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  inputSection: {
    marginBottom: 20,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  translatorInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  voiceButton: {
    backgroundColor: Colors.light.background,
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  translateButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  translateButtonLoading: {
    backgroundColor: Colors.light.gray,
  },
  translateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.background,
  },
  outputSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 16,
  },
  translatedTextContainer: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
  },
  translatedText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  translationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  translationAction: {
    backgroundColor: Colors.light.background,
    padding: 8,
    borderRadius: 8,
  },
  languageButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  modalClose: {
    fontSize: 24,
    color: Colors.light.textSecondary,
  },
  languageList: {
    padding: 20,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  languageItemSelected: {
    backgroundColor: Colors.light.primary,
  },
  languageItemText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  languageItemTextSelected: {
    color: Colors.light.background,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 20,
    color: Colors.light.background,
    fontWeight: '600',
  },
});
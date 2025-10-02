import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  Receipt,
  Plus,
  Camera,
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  X,
  CheckSquare,
  Square,
} from 'lucide-react-native';

import Colors from '@/constants/colors';

interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: 'transport' | 'food' | 'accommodation' | 'entertainment' | 'other';
  date: string;
  hasReceipt: boolean;
}

interface ScannedReceipt {
  id: string;
  date: string;
  imageUri?: string;
}

const categories = [
  { key: 'transport' as const, label: 'Transport', color: Colors.light.primary },
  { key: 'food' as const, label: 'Food & Dining', color: Colors.light.accent },
  { key: 'accommodation' as const, label: 'Hotels', color: Colors.light.success },
  { key: 'entertainment' as const, label: 'Entertainment', color: Colors.light.danger },
  { key: 'other' as const, label: 'Other', color: Colors.light.gray },
];

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      title: 'Airport Taxi',
      amount: 45.50,
      currency: 'USD',
      category: 'transport',
      date: '2024-01-15',
      hasReceipt: true,
    },
    {
      id: '2',
      title: 'Business Lunch',
      amount: 85.00,
      currency: 'USD',
      category: 'food',
      date: '2024-01-15',
      hasReceipt: true,
    },
    {
      id: '3',
      title: 'Hotel Stay',
      amount: 250.00,
      currency: 'USD',
      category: 'accommodation',
      date: '2024-01-14',
      hasReceipt: false,
    },
  ]);
  const [scannedReceipts, setScannedReceipts] = useState<ScannedReceipt[]>([
    {
      id: '1',
      date: '2024-01-15',
    },
    {
      id: '2',
      date: '2024-01-15',
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'transport' as Expense['category'],
    hasReceipt: false,
    noReceiptAvailable: false,
  });
  const [currencyConverter, setCurrencyConverter] = useState({
    amount: '',
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    result: null as number | null,
    loading: false,
  });

  const popularCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  ];

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleAddExpense = () => {
    setShowAddModal(true);
  };

  const handleSaveExpense = () => {
    if (!newExpense.title.trim()) {
      Alert.alert('Error', 'Please enter expense title');
      return;
    }
    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      Alert.alert('Error', 'Please enter valid amount');
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      title: newExpense.title,
      amount: parseFloat(newExpense.amount),
      currency: 'USD',
      category: newExpense.category,
      date: new Date().toISOString().split('T')[0],
      hasReceipt: newExpense.hasReceipt,
    };

    setExpenses([expense, ...expenses]);
    setShowAddModal(false);
    setNewExpense({ title: '', amount: '', category: 'transport', hasReceipt: false, noReceiptAvailable: false });
  };

  const handleScanReceiptFromModal = async () => {
    if (!cameraPermission) {
      return;
    }

    if (!cameraPermission.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera permission is required to scan receipts');
        return;
      }
    }

    setShowCamera(true);
  };

  const handleCaptureReceipt = () => {
    const newReceipt: ScannedReceipt = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };
    setScannedReceipts([newReceipt, ...scannedReceipts]);
    setShowCamera(false);
    setNewExpense({ ...newExpense, hasReceipt: true, noReceiptAvailable: false });
    Alert.alert('Receipt Captured', 'Receipt has been scanned successfully');
  };

  const getCategoryColor = (category: Expense['category']) => {
    return categories.find(cat => cat.key === category)?.color || Colors.light.gray;
  };

  const handleCurrencyConvert = async () => {
    if (!currencyConverter.amount || parseFloat(currencyConverter.amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setCurrencyConverter({ ...currencyConverter, loading: true, result: null });

    try {
      console.log('Starting currency conversion...');
      console.log('From:', currencyConverter.fromCurrency, 'To:', currencyConverter.toCurrency, 'Amount:', currencyConverter.amount);
      
      const url = `https://api.frankfurter.app/latest?from=${currencyConverter.fromCurrency}&to=${currencyConverter.toCurrency}`;
      console.log('Fetching from:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
      
      if (data.rates && data.rates[currencyConverter.toCurrency]) {
        const rate = data.rates[currencyConverter.toCurrency];
        const result = parseFloat(currencyConverter.amount) * rate;
        console.log('Conversion successful:', result);
        setCurrencyConverter({ ...currencyConverter, result, loading: false });
      } else {
        console.error('No rate found in response');
        Alert.alert('Error', 'Unable to fetch exchange rate');
        setCurrencyConverter({ ...currencyConverter, loading: false });
      }
    } catch (error) {
      console.error('Currency conversion error:', error);
      Alert.alert('Error', `Failed to convert currency: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setCurrencyConverter({ ...currencyConverter, loading: false });
    }
  };

  const handleOpenCurrencyConverter = () => {
    setShowCurrencyModal(true);
  };

  const swapCurrencies = () => {
    setCurrencyConverter({
      ...currencyConverter,
      fromCurrency: currencyConverter.toCurrency,
      toCurrency: currencyConverter.fromCurrency,
      result: null,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expenses</Text>
        <Text style={styles.subtitle}>Track your business travel expenses</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Current Trip Total</Text>
            <TrendingUp size={20} color={Colors.light.success} />
          </View>
          <Text style={styles.summaryAmount}>${totalExpenses.toFixed(2)}</Text>
          <Text style={styles.summarySubtext}>
            {expenses.length} expenses recorded
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleAddExpense}>
            <Plus size={20} color={Colors.light.background} />
            <Text style={styles.primaryButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          {expenses.map((expense) => (
            <TouchableOpacity key={expense.id} style={styles.expenseCard}>
              <View style={styles.expenseLeft}>
                <View 
                  style={[
                    styles.categoryIndicator, 
                    { backgroundColor: getCategoryColor(expense.category) }
                  ]} 
                />
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseTitle}>{expense.title}</Text>
                  <Text style={styles.expenseDate}>
                    {new Date(expense.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.expenseRight}>
                <Text style={styles.expenseAmount}>
                  ${expense.amount.toFixed(2)}
                </Text>
                {expense.hasReceipt && (
                  <View style={styles.receiptBadge}>
                    <Receipt size={12} color={Colors.light.success} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scanned Receipts</Text>
          {scannedReceipts.length === 0 ? (
            <View style={styles.emptyState}>
              <Receipt size={48} color={Colors.light.textSecondary} />
              <Text style={styles.emptyStateText}>No scanned receipts yet</Text>
              <Text style={styles.emptyStateSubtext}>Tap "Scan Receipt" to add one</Text>
            </View>
          ) : (
            scannedReceipts.map((receipt) => (
              <TouchableOpacity key={receipt.id} style={styles.receiptCard}>
                <View style={styles.receiptIcon}>
                  <Receipt size={24} color={Colors.light.primary} />
                </View>
                <View style={styles.receiptInfo}>
                  <Text style={styles.receiptTitle}>Receipt #{receipt.id.slice(-4)}</Text>
                  <Text style={styles.receiptDate}>
                    Scanned on {new Date(receipt.date).toLocaleDateString()}
                  </Text>
                </View>
                <ArrowUpRight size={20} color={Colors.light.gray} />
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={handleOpenCurrencyConverter}>
            <View style={styles.actionIcon}>
              <DollarSign size={24} color={Colors.light.accent} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Currency Converter</Text>
              <Text style={styles.actionSubtitle}>
                Convert between currencies
              </Text>
            </View>
            <ArrowUpRight size={20} color={Colors.light.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Calendar size={24} color={Colors.light.primary} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Expense Report</Text>
              <Text style={styles.actionSubtitle}>
                Generate complete trip report
              </Text>
            </View>
            <ArrowDownRight size={20} color={Colors.light.gray} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Expense</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Airport Taxi"
                value={newExpense.title}
                onChangeText={(text) => setNewExpense({ ...newExpense, title: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount (USD)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={newExpense.amount}
                onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.categoryChip,
                      newExpense.category === cat.key && {
                        backgroundColor: cat.color,
                      },
                    ]}
                    onPress={() => setNewExpense({ ...newExpense, category: cat.key })}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        newExpense.category === cat.key && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Receipt</Text>
              
              <TouchableOpacity 
                style={styles.scanReceiptButton} 
                onPress={handleScanReceiptFromModal}
                disabled={newExpense.noReceiptAvailable}
              >
                <Camera size={20} color={newExpense.noReceiptAvailable ? Colors.light.textSecondary : Colors.light.primary} />
                <Text style={[
                  styles.scanReceiptButtonText,
                  newExpense.noReceiptAvailable && styles.scanReceiptButtonTextDisabled
                ]}>
                  {newExpense.hasReceipt ? 'Receipt Scanned ✓' : 'Scan Receipt'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setNewExpense({ 
                  ...newExpense, 
                  noReceiptAvailable: !newExpense.noReceiptAvailable,
                  hasReceipt: newExpense.noReceiptAvailable ? newExpense.hasReceipt : false
                })}
              >
                {newExpense.noReceiptAvailable ? (
                  <CheckSquare size={20} color={Colors.light.primary} />
                ) : (
                  <Square size={20} color={Colors.light.textSecondary} />
                )}
                <Text style={styles.checkboxLabel}>No receipt available</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveExpense}>
              <Text style={styles.saveButtonText}>Save Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCurrencyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Currency Converter</Text>
              <TouchableOpacity onPress={() => setShowCurrencyModal(false)}>
                <X size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="decimal-pad"
                value={currencyConverter.amount}
                onChangeText={(text) => setCurrencyConverter({ ...currencyConverter, amount: text, result: null })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>From Currency</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyScroll}>
                <View style={styles.currencyGrid}>
                  {popularCurrencies.map((currency) => (
                    <TouchableOpacity
                      key={currency.code}
                      style={[
                        styles.currencyChip,
                        currencyConverter.fromCurrency === currency.code && styles.currencyChipActive,
                      ]}
                      onPress={() => setCurrencyConverter({ ...currencyConverter, fromCurrency: currency.code, result: null })}
                    >
                      <Text
                        style={[
                          styles.currencyChipText,
                          currencyConverter.fromCurrency === currency.code && styles.currencyChipTextActive,
                        ]}
                      >
                        {currency.symbol} {currency.code}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
              <ArrowDownRight size={20} color={Colors.light.primary} />
              <ArrowUpRight size={20} color={Colors.light.primary} style={{ marginLeft: -8 }} />
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>To Currency</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyScroll}>
                <View style={styles.currencyGrid}>
                  {popularCurrencies.map((currency) => (
                    <TouchableOpacity
                      key={currency.code}
                      style={[
                        styles.currencyChip,
                        currencyConverter.toCurrency === currency.code && styles.currencyChipActive,
                      ]}
                      onPress={() => setCurrencyConverter({ ...currencyConverter, toCurrency: currency.code, result: null })}
                    >
                      <Text
                        style={[
                          styles.currencyChipText,
                          currencyConverter.toCurrency === currency.code && styles.currencyChipTextActive,
                        ]}
                      >
                        {currency.symbol} {currency.code}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {currencyConverter.result !== null && (
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Converted Amount</Text>
                <Text style={styles.resultAmount}>
                  {popularCurrencies.find(c => c.code === currencyConverter.toCurrency)?.symbol || ''}
                  {currencyConverter.result.toFixed(2)} {currencyConverter.toCurrency}
                </Text>
                <Text style={styles.resultSubtext}>
                  {currencyConverter.amount} {currencyConverter.fromCurrency} = {currencyConverter.result.toFixed(2)} {currencyConverter.toCurrency}
                </Text>
              </View>
            )}

            <TouchableOpacity 
              style={[styles.saveButton, currencyConverter.loading && styles.saveButtonDisabled]} 
              onPress={handleCurrencyConvert}
              disabled={currencyConverter.loading}
            >
              {currencyConverter.loading ? (
                <ActivityIndicator color={Colors.light.background} />
              ) : (
                <Text style={styles.saveButtonText}>Convert</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCamera}
        animationType="slide"
        onRequestClose={() => setShowCamera(false)}
      >
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing="back">
            <View style={styles.cameraOverlay}>
              <View style={styles.cameraHeader}>
                <TouchableOpacity
                  style={styles.cameraCloseButton}
                  onPress={() => setShowCamera(false)}
                >
                  <X size={24} color={Colors.light.background} />
                </TouchableOpacity>
              </View>

              <View style={styles.cameraFooter}>
                <Text style={styles.cameraInstructions}>
                  Position receipt within frame
                </Text>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={handleCaptureReceipt}
                >
                  <Camera size={32} color={Colors.light.background} />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.background,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  expenseCard: {
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
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  receiptBadge: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 4,
  },
  actionCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  categoryChipTextActive: {
    color: Colors.light.background,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.background,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  currencyScroll: {
    marginHorizontal: -4,
  },
  currencyGrid: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  currencyChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  currencyChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  currencyChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  currencyChipTextActive: {
    color: Colors.light.background,
  },
  swapButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 24,
    padding: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  resultCard: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  resultAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  resultSubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: Colors.light.text,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  cameraCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  cameraInstructions: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.background,
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.light.background,
  },
  emptyState: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  receiptCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  receiptIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  receiptInfo: {
    flex: 1,
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  receiptDate: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  scanReceiptButton: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 12,
  },
  scanReceiptButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.primary,
  },
  scanReceiptButtonTextDisabled: {
    color: Colors.light.textSecondary,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    color: Colors.light.text,
  },
});

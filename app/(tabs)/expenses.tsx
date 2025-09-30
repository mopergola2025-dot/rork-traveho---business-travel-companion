import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Receipt,
  Plus,
  Camera,
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
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

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleAddExpense = () => {
    console.log('Add new expense');
  };

  const handleScanReceipt = () => {
    console.log('Scan receipt');
  };

  const getCategoryColor = (category: Expense['category']) => {
    return categories.find(cat => cat.key === category)?.color || Colors.light.gray;
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
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleScanReceipt}>
            <Camera size={20} color={Colors.light.primary} />
            <Text style={styles.secondaryButtonText}>Scan Receipt</Text>
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
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionCard}>
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
});
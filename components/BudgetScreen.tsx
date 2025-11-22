import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { useFinance } from '../store/financeStore';
import { COLORS } from '../constants/colors';
import { CATEGORIES } from '../constants/categories';
import type { Category } from '../types';

interface BudgetCategory extends Category {
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
}

const BudgetScreen: React.FC = () => {
  const { budgets, setBudget, deleteBudget, getCategoryExpenses } = useFinance();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [budgetAmount, setBudgetAmount] = useState<string>('');

  const categoryExpenses = getCategoryExpenses();

  const handleSaveBudget = async (): Promise<void> => {
    if (!selectedCategory || !budgetAmount) {
      Alert.alert('Error', 'Please select a category and enter an amount');
      return;
    }

    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    await setBudget(selectedCategory, amount);
    setShowAddModal(false);
    setSelectedCategory(null);
    setBudgetAmount('');
  };

  const handleDeleteBudget = (category: string): void => {
    Alert.alert(
      'Delete Budget',
      `Are you sure you want to delete the budget for ${category}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteBudget(category),
        },
      ]
    );
  };

  const getCategoryInfo = (categoryId: string): Category => {
    return CATEGORIES.expense.find(c => c.id === categoryId) || { 
      id: categoryId,
      name: categoryId, 
      icon: '💰' 
    };
  };

  const budgetCategories: BudgetCategory[] = Object.entries(budgets).map(([categoryId, budget]) => {
    const spent = categoryExpenses[categoryId] || 0;
    const remaining = budget - spent;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    const categoryInfo = getCategoryInfo(categoryId);

    return {
      ...categoryInfo,
      budget,
      spent,
      remaining,
      percentage,
      isOverBudget: spent > budget,
    };
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Monthly Budgets</Text>
          <Text style={styles.headerSubtitle}>
            Set spending limits for each category
          </Text>
        </View>

        <View style={styles.section}>
          {budgetCategories.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={styles.emptyTitle}>No budgets set</Text>
              <Text style={styles.emptyText}>
                Tap the button below to create your first budget
              </Text>
            </View>
          ) : (
            budgetCategories.map(category => (
              <View key={category.id} style={styles.budgetCard}>
                <View style={styles.budgetHeader}>
                  <View style={styles.budgetLeft}>
                    <Text style={styles.budgetIcon}>{category.icon}</Text>
                    <View>
                      <Text style={styles.budgetName}>{category.name}</Text>
                      <Text style={styles.budgetSubtext}>
                        ${category.spent.toFixed(2)} of ${category.budget.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteBudget(category.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(category.percentage, 100)}%`,
                          backgroundColor: category.isOverBudget
                            ? COLORS.expense
                            : category.percentage > 80
                            ? COLORS.warning
                            : COLORS.success,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.progressText,
                      category.isOverBudget && styles.overBudgetText,
                    ]}
                  >
                    {category.percentage.toFixed(0)}%
                  </Text>
                </View>

                <View style={styles.budgetFooter}>
                  {category.isOverBudget ? (
                    <Text style={styles.statusTextDanger}>
                      ⚠️ Over budget by ${Math.abs(category.remaining).toFixed(2)}
                    </Text>
                  ) : category.percentage > 80 ? (
                    <Text style={styles.statusTextWarning}>
                      ⚡ ${category.remaining.toFixed(2)} remaining
                    </Text>
                  ) : (
                    <Text style={styles.statusTextSuccess}>
                      ✓ ${category.remaining.toFixed(2)} remaining
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Budget</Text>

            <Text style={styles.label}>Select Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {CATEGORIES.expense.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat.id && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Text style={styles.categoryChipIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === cat.id && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Monthly Budget Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={budgetAmount}
              onChangeText={setBudgetAmount}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddModal(false);
                  setSelectedCategory(null);
                  setBudgetAmount('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveBudget}
              >
                <Text style={styles.saveButtonText}>Save Budget</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  section: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  budgetCard: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  budgetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  budgetIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  budgetName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  budgetSubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: COLORS.expense,
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: COLORS.background,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    minWidth: 45,
    textAlign: 'right',
  },
  overBudgetText: {
    color: COLORS.expense,
  },
  budgetFooter: {
    marginTop: 4,
  },
  statusTextSuccess: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: '500',
  },
  statusTextWarning: {
    color: COLORS.warning,
    fontSize: 14,
    fontWeight: '500',
  },
  statusTextDanger: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabText: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  categoryChip: {
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    minWidth: 100,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryChipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.background,
    color: COLORS.text,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    flex: 2,
    padding: 18,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default BudgetScreen;

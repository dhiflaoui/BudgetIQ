import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import { CATEGORIES } from '../constants/categories';
import type { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === 'income';
  const date = new Date(transaction.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Get category info
  const allCategories = [...CATEGORIES.income, ...CATEGORIES.expense];
  const categoryInfo = allCategories.find(c => c.id === transaction.category) || {
    icon: '💰',
    name: transaction.category,
  };

  const handleDelete = (): void => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(transaction.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={[styles.icon, isIncome ? styles.incomeIcon : styles.expenseIcon]}>
          <Text style={styles.iconText}>{categoryInfo.icon}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.category}>{categoryInfo.name}</Text>
          <Text style={styles.date}>{formattedDate} • {formattedTime}</Text>
          {transaction.note && (
            <Text style={styles.note} numberOfLines={1}>
              {transaction.note}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, isIncome ? styles.incomeAmount : styles.expenseAmount]}>
          {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
        </Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomeIcon: {
    backgroundColor: `${COLORS.income}20`,
  },
  expenseIcon: {
    backgroundColor: `${COLORS.expense}20`,
  },
  iconText: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  category: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  note: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  incomeAmount: {
    color: COLORS.income,
  },
  expenseAmount: {
    color: COLORS.expense,
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteText: {
    color: COLORS.expense,
    fontSize: 11,
    fontWeight: '500',
  },
});

export default TransactionItem;
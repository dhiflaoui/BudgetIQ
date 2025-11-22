import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFinanceStore } from '../store/financeStore';
import { COLORS } from '../constants/colors';

const BalanceCard: React.FC = () => {
  // Using Zustand selectors
  const getBalance = useFinanceStore((state) => state.getBalance);
  const getIncomeTotal = useFinanceStore((state) => state.getIncomeTotal);
  const getExpenseTotal = useFinanceStore((state) => state.getExpenseTotal);
  
  const balance = getBalance();
  const income = getIncomeTotal();
  const expense = getExpenseTotal();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Total Balance</Text>
      <Text style={[styles.amount, balance < 0 && styles.negativeBalance]}>
        ${balance.toFixed(2)}
      </Text>
      <View style={styles.row}>
        <View style={styles.item}>
          <View style={[styles.indicator, styles.incomeIndicator]} />
          <View>
            <Text style={styles.subLabel}>Income</Text>
            <Text style={styles.incomeText}>+${income.toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.item}>
          <View style={[styles.indicator, styles.expenseIndicator]} />
          <View>
            <Text style={styles.subLabel}>Expenses</Text>
            <Text style={styles.expenseText}>-${expense.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    margin: 20,
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  amount: {
    color: COLORS.text,
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  negativeBalance: {
    color: COLORS.expense,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  indicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  incomeIndicator: {
    backgroundColor: COLORS.income,
  },
  expenseIndicator: {
    backgroundColor: COLORS.expense,
  },
  subLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  incomeText: {
    color: COLORS.income,
    fontWeight: '700',
    fontSize: 16,
  },
  expenseText: {
    color: COLORS.expense,
    fontWeight: '700',
    fontSize: 16,
  },
});

export default BalanceCard;
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useFinance } from '../store/financeStore';
import { COLORS } from '../constants/colors';
import { CATEGORIES } from '../constants/categories';
import type { Category } from '../types';

type Period = 'week' | 'month' | 'year';

const StatisticsScreen: React.FC = () => {
  const {
    getCategoryExpenses,
    budgets,
    getIncomeTotal,
    getExpenseTotal,
    transactions,
  } = useFinance();

  const [period, setPeriod] = useState<Period>('month');

  const getDateRange = (): { startDate: Date; endDate: Date } => {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return { startDate, endDate: now };
  };

  const { startDate, endDate } = getDateRange();
  const categoryExpenses = getCategoryExpenses(startDate, endDate);
  const totalIncome = getIncomeTotal(startDate, endDate);
  const totalExpenses = getExpenseTotal(startDate, endDate);

  const getCategoryDetails = (categoryId: string): Category => {
    const allCategories = [...CATEGORIES.income, ...CATEGORIES.expense];
    return allCategories.find(c => c.id === categoryId) || { 
      id: categoryId,
      name: categoryId, 
      icon: '💰' 
    };
  };

  const sortedCategories = Object.entries(categoryExpenses)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 10);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.periodSelector}>
          {(['week', 'month', 'year'] as Period[]).map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.periodButton, period === p && styles.periodButtonActive]}
              onPress={() => setPeriod(p)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  period === p && styles.periodButtonTextActive,
                ]}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.incomeCard]}>
            <Text style={styles.summaryLabel}>Total Income</Text>
            <Text style={styles.summaryAmount}>
              ${totalIncome.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.expenseCard]}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={styles.summaryAmount}>
              ${totalExpenses.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.netCard}>
          <Text style={styles.netLabel}>Net Savings</Text>
          <Text
            style={[
              styles.netAmount,
              totalIncome - totalExpenses < 0 && styles.negativeNet,
            ]}
          >
            ${(totalIncome - totalExpenses).toFixed(2)}
          </Text>
          <Text style={styles.netSubtext}>
            {totalIncome > 0
              ? `${(((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)}% savings rate`
              : 'No income recorded'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expenses by Category</Text>

          {sortedCategories.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyText}>
                No expenses in this period
              </Text>
            </View>
          ) : (
            sortedCategories.map(([categoryId, amount]) => {
              const categoryInfo = getCategoryDetails(categoryId);
              const percentage =
                totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
              const budget = budgets[categoryId] || 0;
              const isOverBudget = budget > 0 && amount > budget;

              return (
                <View key={categoryId} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryLeft}>
                      <Text style={styles.categoryIcon}>{categoryInfo.icon}</Text>
                      <Text style={styles.categoryName}>{categoryInfo.name}</Text>
                    </View>
                    <Text
                      style={[
                        styles.categoryAmount,
                        isOverBudget && styles.overBudgetText,
                      ]}
                    >
                      ${amount.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(percentage, 100)}%` },
                        isOverBudget && styles.progressOverBudget,
                      ]}
                    />
                  </View>

                  <View style={styles.categoryFooter}>
                    <Text style={styles.percentageText}>
                      {percentage.toFixed(1)}% of total
                    </Text>
                    {budget > 0 && (
                      <Text
                        style={[
                          styles.budgetText,
                          isOverBudget && styles.overBudgetText,
                        ]}
                      >
                        Budget: ${budget.toFixed(2)}
                        {isOverBudget && ' ⚠️'}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.statsFooter}>
          <Text style={styles.statsFooterText}>
            {transactions.length} total transactions
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodButtonText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  periodButtonTextActive: {
    color: COLORS.text,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
  },
  summaryCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  incomeCard: {
    backgroundColor: `${COLORS.income}15`,
    borderColor: `${COLORS.income}30`,
  },
  expenseCard: {
    backgroundColor: `${COLORS.expense}15`,
    borderColor: `${COLORS.expense}30`,
  },
  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  summaryAmount: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  netCard: {
    margin: 20,
    padding: 25,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  netLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  netAmount: {
    color: COLORS.success,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  negativeNet: {
    color: COLORS.expense,
  },
  netSubtext: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  categoryItem: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  categoryAmount: {
    color: COLORS.expense,
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressOverBudget: {
    backgroundColor: COLORS.expense,
  },
  categoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentageText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  budgetText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  overBudgetText: {
    color: COLORS.expense,
  },
  statsFooter: {
    padding: 20,
    alignItems: 'center',
  },
  statsFooterText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  bottomPadding: {
    height: 40,
  },
});

export default StatisticsScreen;
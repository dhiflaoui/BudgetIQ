import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { useFinance } from '../store/financeStore';
import { COLORS } from '../constants/colors';

const SettingsScreen: React.FC = () => {
  const { clearAllData, transactions, budgets } = useFinance();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  const handleClearData = (): void => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all transactions and budgets? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            clearAllData();
            Alert.alert('Success', 'All data has been cleared');

          },
        },
      ]
    );
  };

  const handleExportData = (): void => {
    Alert.alert(
      'Export Data',
      'Export functionality will be available in a future update. Your data will be exported as CSV.'
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <View style={styles.appInfo}>
            <Text style={styles.appIcon}>💰</Text>
            <Text style={styles.appName}>Finance Tracker</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Transactions</Text>
              <Text style={styles.statValue}>{transactions.length}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Active Budgets</Text>
              <Text style={styles.statValue}>{Object.keys(budgets).length}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>Currency</Text>
                <Text style={styles.settingSubtext}>USD ($)</Text>
              </View>
              <Text style={styles.settingValue}>→</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>Budget Notifications</Text>
                <Text style={styles.settingSubtext}>Get alerts when over budget</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.text}
              />
            </View>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>First Day of Week</Text>
                <Text style={styles.settingSubtext}>Monday</Text>
              </View>
              <Text style={styles.settingValue}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={handleExportData}>
              <View>
                <Text style={styles.settingLabel}>Export Data</Text>
                <Text style={styles.settingSubtext}>Download as CSV</Text>
              </View>
              <Text style={styles.settingValue}>📤</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>Import Data</Text>
                <Text style={styles.settingSubtext}>Import from CSV</Text>
              </View>
              <Text style={styles.settingValue}>📥</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>Backup & Restore</Text>
                <Text style={styles.settingSubtext}>Cloud backup</Text>
              </View>
              <Text style={styles.settingValue}>☁️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <Text style={styles.settingValue}>→</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow}>
              <Text style={styles.settingLabel}>Terms of Service</Text>
              <Text style={styles.settingValue}>→</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow}>
              <Text style={styles.settingLabel}>Rate This App</Text>
              <Text style={styles.settingValue}>⭐</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow}>
              <Text style={styles.settingLabel}>Share With Friends</Text>
              <Text style={styles.settingValue}>📱</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearData}
          >
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for better financial health
          </Text>
          <Text style={styles.footerSubtext}>
            © 2024 Finance Tracker. All rights reserved.
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
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  appIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  appName: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  settingLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingSubtext: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  settingValue: {
    color: COLORS.textSecondary,
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 20,
  },
  dangerButton: {
    backgroundColor: `${COLORS.expense}15`,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${COLORS.expense}30`,
  },
  dangerButtonText: {
    color: COLORS.expense,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  footerSubtext: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  bottomPadding: {
    height: 40,
  },
});

export default SettingsScreen;
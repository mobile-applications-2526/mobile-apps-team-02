import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { moderateScale } from '../utils/scaling';

export default function Stat({ label, value }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '700',
    fontSize: moderateScale(16),
  },
  statLabel: {
    fontSize: moderateScale(11),
    color: '#666',
  },
});


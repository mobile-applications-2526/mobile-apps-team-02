import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, moderateScale, verticalScale } from '../utils/scaling';

export default function EmptyState({ icon, title, subtitle }) {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name={icon} size={moderateScale(80)} color="#ccc" />
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: scale(20),
    alignItems: 'center',
    paddingVertical: verticalScale(40),
  },
  emptyTitle: {
    fontSize: moderateScale(18),
    color: '#666',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
});


import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale, moderateScale } from '../utils/scaling';

export default function UserStats({ followers, following, recipes, reputation }) {
  return (
    <View style={styles.stats}>
      {reputation !== undefined && <Stat label="Reputation" value={reputation} />}
      {recipes !== undefined && <Stat label="Recipes" value={recipes} />}
      <Stat label="Followers" value={followers} />
      <Stat label="Following" value={following} />
    </View>
  );
}

const Stat = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: scale(12),
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '700',
    fontSize: 16,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
  },
});


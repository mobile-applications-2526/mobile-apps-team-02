import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { scale, moderateScale } from '../utils/scaling';

export default function EditProfileScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setEmail(user.email);

    const { data } = await supabase
      .from('userinfo')
      .select('username')
      .eq('id', user.id)
      .single();

    if (data) setUsername(data.username);
    setLoading(false);
  };

  const saveChanges = async () => {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    /** Update username (userinfo table) */
    const { error: usernameError } = await supabase
      .from('userinfo')
      .update({ username })
      .eq('id', user.id);

    if (usernameError) {
      Alert.alert('Error', usernameError.message);
      setSaving(false);
      return;
    }

    /** Update email (Supabase Auth) */
    if (email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email,
      });

      if (emailError) {
        Alert.alert('Email Update Failed', emailError.message);
        setSaving(false);
        return;
      } else {
        Alert.alert(
          'Confirm Email',
          'Check your email to confirm the new address.'
        );
      }
    }

    Alert.alert('Success', 'Profile updated');
    navigation.goBack();
    setSaving(false);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#7CC57E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholder="Username"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={saveChanges}
        disabled={saving}
      >
        <Text style={styles.saveText}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(16),
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    marginBottom: scale(24),
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: scale(12),
    marginBottom: scale(16),
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#7CC57E',
    paddingVertical: scale(14),
    borderRadius: 12,
    alignItems: 'center',
    marginTop: scale(12),
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

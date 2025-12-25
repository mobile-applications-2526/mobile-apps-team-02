import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import { scale, moderateScale } from '../utils/scaling';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function EditProfileScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);

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
      .select('username, avatar_url')
      .eq('id', user.id)
      .single();

    if (data) {
      setUsername(data.username);
      setAvatar(data.avatar_url);
    }

    setLoading(false);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow photo access');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const uploadAvatar = async (uri, userId) => {
    const fileExt = uri.split('.').pop() || 'jpg';
    const filePath = `${uuidv4()}.${fileExt}`;

    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();

    const { error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, arrayBuffer, { upsert: false, contentType: 'image/*' });

    if (error) throw error;

    const { data } = supabase.storage.from('profile-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const saveChanges = async () => {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    let avatarUrl = avatar;

    // Upload avatar if changed
    if (avatar && avatar.startsWith('file://')) {
      try {
        avatarUrl = await uploadAvatar(avatar, user.id);
      } catch (error) {
        Alert.alert('Upload Error', error.message);
        setSaving(false);
        return;
      }
    }

    // Update profile table
    const { error } = await supabase
      .from('userinfo')
      .update({ username, avatar_url: avatarUrl })
      .eq('id', user.id);

    if (error) {
      Alert.alert('Error', error.message);
      setSaving(false);
      return;
    }

    // Update email if changed
    if (email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email });
      if (emailError) {
        Alert.alert('Email Update Failed', emailError.message);
        setSaving(false);
        return;
      }
    }

    Alert.alert('Success', 'Profile updated');
    navigation.navigate('Profile', { newAvatar: avatarUrl });
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

      {/* Avatar */}
      <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
        <Image
          source={avatar ? { uri: avatar } : require('../assets/pfp.jpg')}
          style={styles.avatar}
        />
        <Text style={styles.changeAvatar}>Change Photo</Text>
      </TouchableOpacity>

      {/* Username */}
      <Text style={styles.label}>Username</Text>
      <TextInput value={username} onChangeText={setUsername} style={styles.input} />

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={saveChanges}
        disabled={saving}
      >
        <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: scale(16), backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: moderateScale(20), fontWeight: '700', marginBottom: scale(24) },
  label: { fontSize: 12, color: '#666', marginBottom: 6 },
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
  saveText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  avatarWrapper: { alignItems: 'center', marginBottom: scale(24) },
  avatar: { width: scale(90), height: scale(90), borderRadius: scale(45), backgroundColor: '#ddd' },
  changeAvatar: { fontSize: 12, color: '#7CC57E', marginTop: 8, fontWeight: '600' },
});

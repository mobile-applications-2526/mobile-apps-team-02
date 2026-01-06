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
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { scale, moderateScale } from '../utils/scaling';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;

      setEmail(user.email);

      const profile = await userService.getProfile(user.id);
      if (profile) {
        setUsername(profile.username);
        setAvatar(profile.avatar_url);
        setBio(profile.bio || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow photo access');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const saveChanges = async () => {
    setSaving(true);

    try {
      const user = await authService.getCurrentUser();
      if (!user) return;

      let avatarUrl = avatar;

      if (avatar && avatar.startsWith('file://')) {
        try {
          avatarUrl = await userService.uploadAvatar(avatar, user.id);
        } catch (error) {
          Alert.alert('Upload Error', error.message);
          setSaving(false);
          return;
        }
      }

      await userService.updateProfile(user.id, {
        username,
        avatar_url: avatarUrl,
        bio
      });

      if (email !== user.email) {
        try {
          await authService.updateEmail(email);
        } catch (emailError) {
          Alert.alert('Email Update Failed', emailError.message);
          setSaving(false);
          return;
        }
      }

      Alert.alert('Success', 'Profile updated');
      navigation.navigate('Profile', { newAvatar: avatarUrl });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
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
      <View style={{ flexDirection: "row", gap: moderateScale(10)}}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={moderateScale(28)} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>Edit Profile</Text>
      </View>

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

      {/* Bio */}
      <Text style={styles.label}>Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        style={styles.bioInput}
        multiline={true}
        numberOfLines={4}
        placeholder="Tell us something about yourself..."
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
  bioInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: scale(12),
    marginBottom: scale(16),
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: scale(80),
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

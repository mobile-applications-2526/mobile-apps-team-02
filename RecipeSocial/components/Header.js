import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { moderateScale, scale, verticalScale } from "../utils/scaling";
import { supabase } from '../lib/supabase';
import { useState } from 'react';

export default function Header({ searchQuery = '', setSearchQuery = () => { }, navigation }) {
    const [showMenu, setShowMenu] = useState(false);

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        const { error } = await supabase.auth.signOut();
                        if (error) {
                            Alert.alert('Error', error.message);
                        } else {
                            if (navigation) {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Start' }],
                                });
                            }
                        }
                    },
                },
            ]
        );
    };

    return (
        <View className="flex-row items-center justify-between" style={styles.header}>
            <View className="flex-1">
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={moderateScale(20)} color="#666" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search Recipes..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchInput}
                        placeholderTextColor="#999"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={moderateScale(20)} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View style={styles.profile}>
                <View style={{ gap: scale(1), alignItems: 'center', flexDirection: 'row', }}>
                    <Text>1</Text>
                    <Ionicons name="flame-outline" size={scale(25)} color="black" />
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')  /* !setShowMenu(prev => !prev) */} activeOpacity={0.7}>
                    <Image
                        source={require('../assets/pfp.jpg')}
                        style={{ width: scale(55), height: verticalScale(55), borderRadius: scale(100) }}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            </View>
            {showMenu && (
                <View style={styles.menu}>
                   <Text></Text>
                </View>
            )}

        </View>
    )
}
const styles = StyleSheet.create({
    header: {
        height: verticalScale(75),
        padding: moderateScale(10),

    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: moderateScale(20),
        height: verticalScale(40),
        width: moderateScale(270),
        paddingHorizontal: moderateScale(12),
    },
    searchIcon: {
        marginRight: moderateScale(8),
    },
    searchInput: {
        flex: 1,
        fontSize: moderateScale(16),
        color: '#000',
        padding: 0,
    },
    clearButton: {
        padding: moderateScale(4),
    },
    profile: {
        width: scale(96),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: scale(1),
        flexShrink: 0,
    }

})


import { use, useState } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { SearchBar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { moderateScale, scale, verticalScale } from "../utils/scaling";
import { space } from "postcss/lib/list";

export default function Header({ searchQuery = '', setSearchQuery = () => {} }) {
    return (
        <View className="flex-row items-center justify-between" style={styles.header}>
            <View className="flex-1">
                <SearchBar
                    placeholder="Search Recipes..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    round={true}
                    lightTheme
                    containerStyle={{ backgroundColor: 'transparent', borderTopWidth: 0, borderBottomWidth: 0, padding: 0, width: moderateScale(270) }}
                    inputContainerStyle={{ backgroundColor: 'transparent', borderColor: 'gray', borderWidth: 1, borderBottomWidth: 1, height: verticalScale(40) }}
                    inputStyle={{ fontSize: moderateScale(16)}}
                />
            </View>
            <View style={styles.profile}>
                <View style={{gap: scale(1) , alignItems: 'center', flexDirection: 'row', }}>
                    <Text>1</Text>
                    <Ionicons name="flame-outline" size={scale(25)} color="black" />
                </View>
                <Image
                    source={require('../assets/pfp.jpg')}
                    style={{ width: scale(55), height: verticalScale(55), borderRadius: scale(100) }}
                    resizeMode="cover"
                />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    header: {
        height: verticalScale(75),
        padding: moderateScale(10),
        
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


import { use, useState } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { SearchBar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { moderateScale, scale, verticalScale } from "../utils/scaling";
import { space } from "postcss/lib/list";

export default function Header() {
    const [search, setSearch] = useState('');

    // const updateSearch = (value) => {
    //     setSearch(value);
    // };
    return (
        <View className="flex-row items-center justify-between" style={styles.header}>
            <View className="flex-1">
                <SearchBar
                    placeholder="Type Here..."
                    onChangeText={setSearch}
                    value={search}
                    round={true}
                    lightTheme
                    containerStyle={{ backgroundColor: 'transparent', borderTopWidth: 0, borderBottomWidth: 0, padding: 0, width: moderateScale(270) }}
                    inputContainerStyle={{ backgroundColor: 'transparent', borderColor: 'gray', borderWidth: 1, borderBottomWidth: 1, height: verticalScale(40) }}
                />
            </View>
            <View style={styles.profile}>
                <View style={{gap: scale(1) , alignItems: 'center', flexDirection: 'row', }}>
                    <Text>1</Text>
                    <Ionicons name="flame-outline" size={scale(25)} color="black" />
                </View>
                <Image
                    source={require('../assets/logo.png')}
                    style={{ width: scale(55), height: verticalScale(55), borderRadius: scale(20) }}
                    resizeMode="contain"
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


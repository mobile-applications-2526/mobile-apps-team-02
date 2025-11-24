import { use, useState } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { SearchBar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export default function Header() {
    const [search, setSearch] = useState('');

    // const updateSearch = (value) => {
    //     setSearch(value);
    // };
    return (
        <View style={styles.header}>
            <SearchBar
                placeholder="Type Here..."
                onChangeText={setSearch}
                value={search}
                round={true}
                lightTheme
                containerStyle={{ backgroundColor: 'transparent', borderTopWidth: 0, borderBottomWidth: 0 }}
                inputContainerStyle={{ backgroundColor: 'transparent', borderColor: 'gray', borderWidth: 1, borderBottomWidth: 1 }}
            />
            <Text>1</Text>
            <Ionicons name="flame-outline" size={24} color="black" />
            <Image
                source={require('../assets/logo.png')}
                className="w-20 h-20 rounded-2xl"
                resizeMode="contain"
            />
        </View>
    )
}
const styles = StyleSheet.create({
    header: {
        flexShrink: 0,
        justifyContent: "flex-end",
        justifyContent: "space-between",
        flexDirection: 'row',
    },
})


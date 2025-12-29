import { View, TouchableOpacity, StyleSheet } from 'react-native';
import {verticalScale, moderateScale } from '../utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
export default function AuthHeader() {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Start')} style={styles.backIcon}>
                <Ionicons name="arrow-back" size={moderateScale(28)} color="#000" />
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: verticalScale(12),
    },
})
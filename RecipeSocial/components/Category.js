import { View, Text, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from '../utils/scaling';

export default function Category() {
    return (
        <View style={{ flexDirection: 'row' }}>
            <Text style={styles.categoryButton}>fHHKJHJ</Text>
            <Text style={styles.categoryButton}>fHHKJH</Text>
            <Text style={styles.categoryButton}>fHHKJH</Text>
            <Text style={styles.categoryButton}>fHHKJH</Text>
            <Text style={styles.categoryButton}>fHHKJH</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    categoryButton: {
        backgroundColor: '#7CC57E',
        textAlign: 'center',
        margin: scale(5),
        borderRadius: scale(7),
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(7),
    },

});
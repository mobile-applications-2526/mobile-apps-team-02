import { View, Text, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from '../utils/scaling';

export default function Category({ CategoriesAndRecipes = [] }) {
    return (
        <View style={{ flexDirection: 'row' }}>
            {CategoriesAndRecipes.map((Category) => (
                <Text key={Category.id} style={styles.categoryButton}>{Category.name}</Text>
            ))}
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
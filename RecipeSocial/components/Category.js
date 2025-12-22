import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { scale, verticalScale, moderateScale } from '../utils/scaling';

export default function Category({ CategoriesAndRecipes = [], selectedCategory = null, onCategorySelect = () => {} }) {
    return (
        <View style={{ flexDirection: 'row' }}>
            {CategoriesAndRecipes.map((Category) => {
                const isSelected = selectedCategory === Category.id;
                return (
                    <TouchableOpacity
                        key={Category.id}
                        onPress={() => onCategorySelect(Category.id)}
                    >
                        <Text style={[
                            styles.categoryButton,
                            isSelected && styles.categoryButtonSelected
                        ]}>
                            {Category.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
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
    categoryButtonSelected: {
        backgroundColor: '#5AA55C',
        borderWidth: 2,
        borderColor: '#3D8B3F',
    },

});
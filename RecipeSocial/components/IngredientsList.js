import { View, Text } from "react-native";
import { moderateScale } from "../utils/scaling";

export default function IngredientsList({ ingredients }) {
    return (
        <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: moderateScale(10) }}>Ingredients</Text>
            {ingredients.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <Text style={{ width: 18, lineHeight: 20 }}>•</Text>
                    <Text style={{ flex: 2 }}>{item.ingredient}</Text>
                    <Text style={{ marginRight: 8 }}>
                        {item.quantity}
                    </Text>
                </View>
            ))}
        </View>
    )
}
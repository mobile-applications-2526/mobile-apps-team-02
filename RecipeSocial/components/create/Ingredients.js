import { Alert, Button, Image, Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function Ingredients() {
    return (
        <View>
            <Text>Add Ingredients</Text>
            <View>
                <View>

                    <TouchableOpacity><Text>Remove</Text></TouchableOpacity>
                </View>
                <TouchableOpacity
                    className="w-full py-3 rounded-2xl mb-4"
                    onPress={() => navigation.navigate('Register')} style={styles.button}
                >
                    <Text className="text-black text-center text-lg font-semibold">
                        Add Ingredient
                    </Text>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 12 }} />
                <Text>Add Instructions</Text>
                <TextInput></TextInput>
                <Text>size</Text>
                <TextInput></TextInput>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
    },
});
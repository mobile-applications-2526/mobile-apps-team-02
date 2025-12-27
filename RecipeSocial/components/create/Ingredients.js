import { Alert, Button, Image, Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { moderateScale, scale } from '../../utils/scaling';

export default function Ingredients({ ingredients,
    setIngredients, onNext }) {
    const [newIngredient, setNewIngredient] = useState({
        ingredient: "",
        size: "",
    });
    const addIngredient = () => {
        if (!newIngredient.ingredient || !newIngredient.size) return;

        setIngredients((prev) => [...prev, newIngredient]);
        setNewIngredient({ ingredient: "", size: "" });
    };
    const canNext =
        ingredients.length > 0;

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
            <Text style={styles.title}>Add Ingredients</Text>
            <View style={styles.container}>
                <ScrollView style={styles.list}>
                    {ingredients.map((item, index) => (
                        <View key={index} style={styles.row}>
                            <View style={[styles.readonlyBox, { flex: 2 }]}>
                                <Text numberOfLines={1}>{item.ingredient}</Text>
                            </View>

                            <View style={[styles.readonlyBox, { flex: 1 }]}>
                                <Text numberOfLines={1}>{item.size}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.removeBtn}
                                onPress={() => setIngredients((prev) => prev.filter((_, i) => i !== index))}
                            >
                                <Text style={styles.removeText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.addingContainer}>
                    <View style={styles.divider} />

                    <Text style={styles.label}>Ingredient</Text>
                    <TextInput
                        style={styles.input}
                        value={newIngredient.ingredient}
                        onChangeText={(text) =>
                            setNewIngredient((prev) => ({ ...prev, ingredient: text }))
                        }
                    />
                    <Text style={styles.label}>size</Text>
                    <TextInput
                        style={styles.input}
                        value={newIngredient.size}
                        onChangeText={(text) =>
                            setNewIngredient((prev) => ({ ...prev, size: text }))
                        }
                    />
                    <TouchableOpacity style={styles.addBtn} onPress={addIngredient}>
                        <Text style={styles.addText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={[styles.NextBtn, !canNext && styles.NextBtnDisabled]}
                onPress={onNext} disabled={!canNext}>
                <Text style={[styles.addText, !canNext && styles.addTextDisabled]}>Next</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F3FFF4",
        borderRadius: scale(10),
        padding: scale(10),
        width: scale(373),
        height: moderateScale(543),
    },
    list: {
        flex: 1,
    },
    addingContainer: {
        justifyContent: "flex-end",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    input: {
        borderColor: "#000000ff",
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        marginBottom: scale(10),
    },
    removeBtn: {
        backgroundColor: "#8c8c8c",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 8,
    },
    removeText: {
        color: "black",
        fontSize: 12,
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
        marginBottom: scale(15),
    },
    label: {
        fontSize: 22,
        marginBottom: 4,
    },

    addBtn: {
        backgroundColor: "#6e6e6e",
        paddingVertical: 12,
        borderRadius: 10,
        height: moderateScale(50),
        width: scale(137),
        alignSelf: "flex-end"
    },
    NextBtn: {
        backgroundColor: "#6e6e6e",
        margin: moderateScale(10),
        paddingVertical: 12,
        borderRadius: 10,
        height: moderateScale(50),
        width: scale(137),
        alignSelf: "flex-end"
    },
    addText: {
        textAlign: "center",
        color: "black",
        fontWeight: "600",
        fontSize: 16,
    },
    NextBtnDisabled: {
        opacity: 0.5,
    },
    addTextDisabled: {
        opacity: 0.7,
    },

});
import { Alert, Button, Image, Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, isChecked,
    KeyboardAvoidingView, Platform
 } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useState, useEffect } from 'react';
import { moderateScale, scale } from '../../utils/scaling';
import { Picker } from '@react-native-picker/picker';


export default function Details({ categories, setCategories, selected, setSelected, difficulty, setDifficulty, prepTime, setPrepTime, onShare, onBack }) {

    const getCategories = async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*');
        if (error) {
            Alert.alert('Error', error.message);
        } else {
            setCategories(data);
        }
    }
    useEffect(() => {
        getCategories();
    }, []);
    const toggleItem = (id) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    const canShare = selected.length > 0 && difficulty && prepTime;

    return (
        <View style={{ flex: 1, paddingVertical: moderateScale(20), }}>
            <Text style={styles.title}>Add Details</Text>
            <View style={styles.container}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 105 : 105}
                >
                    <ScrollView>
                        {categories.map((cat) => {
                            const isChecked = selected.includes(cat.id);

                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={styles.row}
                                    onPress={() => toggleItem(cat.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.checkbox, isChecked && styles.checked]}>
                                        {isChecked && <Text style={styles.check}>✓</Text>}
                                    </View>

                                    <Text style={styles.label}>{cat.name}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                    <View style={styles.Container2}>
                        <View style={styles.divider} />

                        <Text style={styles.label}>Difficulty</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={difficulty}
                                onValueChange={(value) => setDifficulty(value)}
                            >
                                <Picker.Item label="Select difficulty" value="" />
                                <Picker.Item label="Very Easy" value="very_easy" />
                                <Picker.Item label="Easy" value="easy" />
                                <Picker.Item label="Medium" value="medium" />
                                <Picker.Item label="Hard" value="hard" />
                                <Picker.Item label="Very Hard" value="very_hard" />
                                <Picker.Item label="Extreme" value="extreme" />
                            </Picker>
                        </View>
                        <Text style={styles.label}>PrepTime</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="number-pad"
                            inputMode="numeric"
                            value={prepTime}
                            onChangeText={(text) => {
                                const numeric = text.replace(/[^0-9]/g, '');
                                setPrepTime(numeric);
                            }}
                            placeholder="e.g. 30"
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <TouchableOpacity style={[styles.NextBtn]}
                    onPress={onBack}>
                    <Text style={[styles.addText]}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.shareBtn, !canShare && styles.shareBtnDisabled]}
                    onPress={() => onShare()} disabled={!canShare}>
                    <Text style={[styles.addText, !canShare && styles.addTextDisabled]}>Share</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        alignSelf: 'center',
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 12,
    },
    container: {
        alignSelf: "center",
        backgroundColor: "#F3FFF4",
        borderRadius: scale(10),
        padding: scale(10),
        width: scale(373),
        height: moderateScale(543),
    },
    Container2: {
        justifyContent: "flex-end",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderWidth: 2,
        borderColor: "#333",
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    checked: {
        backgroundColor: "#333",
    },
    check: {
        color: "white",
        fontWeight: "bold",
    },
    label: {
        fontSize: 16,
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
        marginBottom: scale(15),
    },
    input: {
        borderColor: "#000000ff",
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        marginBottom: scale(10),
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 8,
        marginBottom: scale(10),
        overflow: "hidden",
    },
    shareBtn: {
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
    shareBtnDisabled: {
        opacity: 0.5,
    },
    addTextDisabled: {
        opacity: 0.7,
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
})
import { Alert, Button, Image, Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { moderateScale, scale } from '../../utils/scaling';
export default function TextRecept({ title,
    setTitle,
    description,
    setDescription, onShare }) {

    const canShare =
        title.trim().length > 0 && description.trim().length > 0;

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Add Text</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={(title) => setTitle(title)}
            />
            <TextInput
                style={styles.Description}
                placeholder="Description"
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={(text) => setDescription(text)}
            />
            <TouchableOpacity
                style={[styles.NextBtn, !canShare && styles.NextBtnDisabled]}
                onPress={() => {
                    onShare();
                }}
                disabled={!canShare}
            >
                <Text style={[styles.addText, !canShare && styles.addTextDisabled]}>
                    Share
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        paddingHorizontal: 10,
    },
    title: {
        alignSelf: 'center',
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 12,
    },
    input: {
        width: "100%",
        borderColor: "#000000ff",
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        marginBottom: scale(10),

    },
    Description: {
        borderColor: "#000000ff",
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        height: moderateScale(456),
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
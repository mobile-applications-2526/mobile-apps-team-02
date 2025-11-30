import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '../utils/scaling';

export default function Recipes() {
    return (
        <View>
            <View>
                <Text style={{ paddingHorizontal: scale(10) }} className="text-2xl font-bold mt-4">Home Screen</Text>
                <ScrollView horizontal={true} style={{ height: scale(134) }} contentContainerStyle={styles.cardrow}  >
                    <View style={styles.card}>
                        <Image
                            source={require('../assets/testRecipe.jpg')}
                            style={{ width: scale(126), height: scale(126), resizeMode: 'fit' }}
                        />
                        <Text style={styles.cardText}>Name</Text>
                        <TouchableOpacity style={styles.cardIcon}><Ionicons name="heart-outline" size={moderateScale(28)} color="white" /></TouchableOpacity>
                    </View>
                    <View style={styles.card}>
                        <Image
                            source={require('../assets/testRecipe.jpg')}
                            style={{ width: scale(126), height: scale(126), resizeMode: 'fit' }}
                        />
                        <Text style={styles.cardText}>Name</Text>
                        <TouchableOpacity style={styles.cardIcon}><Ionicons name="heart-outline" size={moderateScale(28)} color="white" /></TouchableOpacity>
                    </View>
                </ScrollView >
            </View>
            <View>
                <Text style={{ paddingHorizontal: scale(10) }} className="text-2xl font-bold mt-4">Home Screen</Text>
                <ScrollView horizontal={true} style={{ height: scale(134) }} contentContainerStyle={styles.cardrow}  >
                    <View style={styles.card}>
                        <Image
                            source={require('../assets/testRecipe.jpg')}
                            style={{ width: scale(126), height: scale(126), resizeMode: 'fit' }}
                        />
                        <Text style={styles.cardText}>Name</Text>
                        <TouchableOpacity style={styles.cardIcon}><Ionicons name="heart-outline" size={moderateScale(28)} color="white" /></TouchableOpacity>
                    </View>
                    <View style={styles.card}>
                        <Image
                            source={require('../assets/testRecipe.jpg')}
                            style={{ width: scale(126), height: scale(126), resizeMode: 'fit' }}
                        />
                        <Text style={styles.cardText}>Name</Text>
                        <TouchableOpacity style={styles.cardIcon}><Ionicons name="heart-outline" size={moderateScale(28)} color="white" /></TouchableOpacity>
                    </View>
                </ScrollView >
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    cardrow: {
        paddingHorizontal: scale(10),
        gap: scale(10),
    },
    card: {
        position: 'relative',
        textAlign: 'center',
    },
    cardText: {
        position: 'absolute',
        bottom: 10,
        left: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',

        borderRadius: 5,
        padding: 4,
        color: 'white',
    },
    cardIcon: {
        position: 'absolute',
        top: 5,
        right: 4,
        borderColor: 'black',
        padding: 0,
        color: 'white',
    }

});
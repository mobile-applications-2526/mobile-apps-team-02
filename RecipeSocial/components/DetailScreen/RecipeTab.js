import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from '../../utils/scaling';

export default function RecipeTab({ activeTab, setActiveTab, comments }) {
    return (
        <View style={styles.tabsContainer}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'recipe' && styles.activeTab]}
                onPress={() => setActiveTab('recipe')}
            >
                <Text style={[styles.tabText, activeTab === 'recipe' && styles.activeTabText]}>
                    Recipe
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'comments' && styles.activeTab]}
                onPress={() => setActiveTab('comments')}
            >
                <Text style={[styles.tabText, activeTab === 'comments' && styles.activeTabText]}>
                    {comments.length} Comments
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#DAFFDB',
        borderTopRightRadius: moderateScale(15),
        borderTopLeftRadius: moderateScale(15),
        marginTop: -moderateScale(20),
    },
    tab: {
        flex: 1,
        paddingVertical: verticalScale(12),
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#7CC57E',
    },
    tabText: {
        fontSize: moderateScale(16),
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#7CC57E',
        fontWeight: '600',
    },
});

import React from 'react';
import {StyleSheet, Button, View, Text, Alert} from 'react-native';

export default function StartScreen(){
    return(
        <View>
            <Text>RecipeSocial</Text>
            <Button
                title="Register"
                onPress={() => Alert.alert('Simple Button pressed')}
            />
            <Button
                title="Log in"
                onPress={() => Alert.alert('Log in pressed')}
            />
        </View>
    )
}
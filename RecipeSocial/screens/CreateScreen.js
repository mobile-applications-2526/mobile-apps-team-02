import { useState, useEffect } from 'react';
import { Alert, Button, Image, Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Navbar from "../components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import Ingredients from '../components/create/Ingredients';

export default function CreateScreen() {
    const [image, setImage] = useState(null);
    const [step, setStep] = useState(0);
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library.
        // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
        // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
        // so the app users aren't surprised by a system dialog after picking a video.
        // See "Invoke permissions for videos" sub section for more details.
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
    useEffect(() => {
        pickImage();
    }, []);
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View style={styles.container}>
                {image && (
                    <View>
                        {image && step === 0 && (
                            <Ingredients onNext={() => setStep(1)} />
                        )}

                        {image && step === 1 && (
                            <NextComponent onBack={() => setStep(0)} />
                        )}
                    </View>)}
            </View>
            <Navbar />
        </SafeAreaView>

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
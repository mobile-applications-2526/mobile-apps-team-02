import { useState, useEffect } from 'react';
import { Alert, Button, Image, Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Navbar from "../components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import Ingredients from '../components/create/Ingredients';
import TextRecept from '../components/create/TextRecept';
import 'react-native-get-random-values';
import Details from '../components/create/Details';
import { createRecipe } from '../services/recipes.service';

export default function CreateScreen({ navigation }) {
    const [image, setImage] = useState(null);
    const [step, setStep] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState([]);
    const [difficulty, setDifficulty] = useState('');
    const [prepTime, setPrepTime] = useState('');

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (result.canceled || !result.assets || result.assets.length === 0) {
            navigation.goBack();
            return;
        }

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
    const handleSubmit = async () => {
        try {
            await createRecipe({
                title,
                description,
                difficulty,
                prepTime,
                image,
                categories: selected,
                ingredients,
            });
            Alert.alert('Success', 'Recipe saved!');
            navigation.navigate('Home');
        } catch (err) {
            console.error(err);
            Alert.alert('Error', err.message || 'Could not save recipe');
        }
    };
    useEffect(() => {
        const isE2E =
            typeof window !== 'undefined' &&
            window.Cypress;

        if (isE2E || process.env.NODE_ENV === 'test') {
            // Fake image for Cypress
            setImage('https://test-image.local/fake.jpg');
        } else {
            pickImage();
        }
    }, []);
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View style={styles.container}>
                {image && (
                    <View style={{ flex: 1, }}>
                        {image && step === 0 && (
                            <Ingredients ingredients={ingredients} setIngredients={setIngredients} onNext={() => setStep(1)} />
                        )}

                        {image && step === 1 && (
                            <TextRecept title={title} setTitle={setTitle} description={description} setDescription={setDescription} onNext={() => setStep(2)} onBack={() => setStep(0)} />
                        )}
                        {image && step === 2 && (
                            <Details categories={categories} setCategories={setCategories} selected={selected} setSelected={setSelected} difficulty={difficulty} setDifficulty={setDifficulty} prepTime={prepTime} setPrepTime={setPrepTime} onBack={() => setStep(1)} onShare={handleSubmit} />
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
    },
    image: {
        width: 200,
        height: 200,
    },
});
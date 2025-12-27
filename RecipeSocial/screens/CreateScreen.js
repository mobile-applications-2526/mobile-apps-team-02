import { useState, useEffect } from 'react';
import { Alert, Button, Image, Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Navbar from "../components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import Ingredients from '../components/create/Ingredients';
import TextRecept from '../components/create/TextRecept';
import { supabase } from '../lib/supabase';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
export default function CreateScreen() {
    const [image, setImage] = useState(null);
    const [step, setStep] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState([]);
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


    const handleSubmit = async () => {
        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                throw new Error("User not authenticated");
            }

            let imageUrl = image;

            // Upload only if it's a local file
            if (image && image.startsWith("file://")) {
                imageUrl = await uploadRecipeImage(image);
            }
            const recipeData = {
                title,
                description,
                ingredients,
                image,
            }
            const { data: recipe, error: recipeError } = await supabase
                .from('recipes')
                .insert({
                    user_id: user.id,
                    title,
                    description,
                    image_url: imageUrl,
                })
                .select()
                .single();
            if (recipeError) throw recipeError;
            const ingredientRows = ingredients.map((i) => ({
                recipe_id: recipe.id,
                ingredient: i.ingredient,
                quantity: i.size,
            }));
            const { error: ingredientError } = await supabase
                .from("recipe_ingredients")
                .insert(ingredientRows);

            if (ingredientError) throw ingredientError;
            Alert.alert("Success", "Recipe saved!");
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Could not save recipe");
        }
    };

    const uploadRecipeImage = async (uri) => {
        const fileExt = uri.split('.').pop() || 'jpg';
        const filePath = `${uuidv4()}.${fileExt}`;

        const response = await fetch(uri);
        const arrayBuffer = await response.arrayBuffer();

        const { error } = await supabase.storage
            .from('recipe-images')
            .upload(filePath, arrayBuffer, { upsert: false, contentType: 'image/*' });

        if (error) throw error;

        const { data } = supabase.storage.from('recipe-images').getPublicUrl(filePath);
        return data.publicUrl;
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
                            <Ingredients ingredients={ingredients} setIngredients={setIngredients} onNext={() => setStep(1)} />
                        )}

                        {image && step === 1 && (
                            <TextRecept title={title} setTitle={setTitle} description={description} setDescription={setDescription} onShare={handleSubmit} />
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
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
    },
});
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { useRouter } from 'expo-router';

const FileOrCamera = () => {
    const [image, setImage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
            }
        })();
    }, []);

    const handleImageSelection = async (imageUri: string) => {
        try {
            // Prepare the image file to send to the Flask API
            const formData = new FormData();
            formData.append('file', {
                uri: imageUri,
                name: 'image.jpg', // Provide a name for the file
                type: 'image/jpeg', // Specify the file type
            });
    
            // Send the image to the Flask API
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data', // Ensure the correct content type
                },
            });
    
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
    
            const result = await response.json();
            console.log('Prediction result:', result);
    
            // Navigate to disposal advice screen with the image URI and predicted material type
            const materialType = result.prediction; // Assuming the API returns { prediction: "materialType" }
            router.push({
                pathname: '/(main)/camera/disposal-advice',
                params: {
                    imageUri: encodeURIComponent(imageUri),
                    materialType: encodeURIComponent(materialType),
                },
            });
        } catch (error) {
            console.error('Error handling image selection:', error);
            Alert.alert('Error', 'Failed to classify the image. Please try again.');
        }
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                setImage(imageUri);
                handleImageSelection(imageUri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const takePhoto = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                setImage(imageUri);
                handleImageSelection(imageUri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Upload a Photo</Text>
            <Text style={styles.subtitle}>Choose an option to upload your photo</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Ionicons name="images-outline" size={30} color="white" />
                    <Text style={styles.buttonText}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={takePhoto}>
                    <Ionicons name="camera-outline" size={30} color="white" />
                    <Text style={styles.buttonText}>Camera</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FileOrCamera;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#F0F0F0',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#3A86FF',
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
});

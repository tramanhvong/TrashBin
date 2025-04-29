import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

const recycle1 = require('../assets/images/recycle1.avif');
const classify = require('../assets/images/classify.webp');

const SummaryCard = () => {
    return (
        <View style={styles.container}>
            <View style={styles.text}>
                <Text style={styles.description}>You have correctly classified a total of</Text>
                <Text style={styles.title}>234</Text>
            </View>
            <Image source={classify} style={styles.image} />
        </View>
    );
};

export default SummaryCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',          // Horizontal layout
        alignItems: 'center',          // Vertically align items
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#146E53',
        borderRadius: 10,
    },
    text: {
        flex: 1,
        paddingRight: 15,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 4,
        color: 'white',
        zIndex: 99
    },
    description: {
        fontSize: 16,
        color: 'white',
        zIndex: 99
    },
    image: {
        width: 100,
        height: 150,
        zIndex: 1,
    },
});

import { Link } from "expo-router"
import React from "react"
import {SafeAreaView, Text, StyleSheet, View, TouchableOpacity } from "react-native"

export default function ChooseScreen(){


    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Splan</Text>
            <Text style={styles.text}>Your a Teacher</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
    },

    heading:{
        fontSize: 30,
        color: "#fff",
        marginBottom: 50,
    },

    text: {
        fontSize: 20,
        color: "#fff",
    },


})
import { useRouter } from "expo-router";
import React from "react"
import {SafeAreaView, Text, StyleSheet, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Account(){

    const router = useRouter()

    const goBack = async() => {
        AsyncStorage.setItem("isLogin", "null")
        router.replace("/")
    }

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Account</Text>
            <Text style={styles.text}>Your a Student</Text>
            <TouchableOpacity onPress={goBack}>
                <Text style={styles.text}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#000",
            alignItems: "center",
            padding: 16,
        },

        heading: {
            fontSize: 30,
            color: "#006400",
            marginTop: 20,
            marginBottom: 10,
        },

        text: {
            color: "#006400",
            marginTop: 20,
            marginBottom: 10,
        },
});
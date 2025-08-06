import {Link, useRouter} from "expo-router"
import React from "react"
import {SafeAreaView, Text, StyleSheet, View, TouchableOpacity } from "react-native"

export default function ChooseScreen(){

    const router = useRouter()

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Splan</Text>
            <Text style={styles.text}>Choose your role</Text>
            <View style={styles.chooseRow}>
                <TouchableOpacity style={styles.button} onPress={() => router.replace("/student/home")}>
                    <Text style={styles.buText}>Student</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => router.replace("/teacher/home")}>
                    <Text style={styles.buText}>Teacher</Text>
                </TouchableOpacity>
            </View>
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

    chooseRow: {
        flexDirection: "row",
    },

    button: {
        padding: 10,
        backgroundColor: "#006400",
        borderRadius: 15,
        marginTop: 20,
        marginHorizontal: 10,
    },

    buText: {
        fontSize: 20,
        color: "#000",
    },

})



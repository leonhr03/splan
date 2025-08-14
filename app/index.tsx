import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChooseScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const run = async () => {
            const isLogin = await AsyncStorage.getItem("isLogin");
            console.log("AsyncStorage isLogin:", isLogin);

            if (isLogin === "student") {
                router.replace("/student/home");
            } else if (isLogin === "teacher") {
                router.replace("/teacher/home");
            } else {
                setIsLoading(false); // Kein Login → zeige Auswahl
            }
        };

        run();
    }, []);

    const handleLogin = async (role: "student" | "teacher") => {
        await AsyncStorage.setItem("isLogin", role);
        router.replace(`/${role}/home`);
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={{ color: "#fff", marginTop: 20 }}>Lade...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Splan</Text>
            <Text style={styles.text}>Choose your role</Text>
            <View style={styles.chooseRow}>
                <TouchableOpacity style={styles.button} onPress={() => handleLogin("student")}>
                    <Text style={styles.buText}>Student</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleLogin("teacher")}>
                    <Text style={styles.buText}>Teacher</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
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



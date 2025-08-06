import React, { useState } from "react";
import {
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function AddSubject() {
    const [input, setInput] = useState("");
    const [scratch, setScratch] = useState([]);
    const router = useRouter();



    const save = async (array: any) => {
        await AsyncStorage.setItem("subjectsArray", JSON.stringify(array));
    };

    const addItem = async () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        const currentData = await AsyncStorage.getItem("subjectsArray");
        const currentList = currentData ? JSON.parse(currentData) : [];

        const newList: any = [...currentList, { title: trimmed }];
        setScratch(newList);
        await save(newList);
        setInput("");
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Splan</Text>
            <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder={"subject"}
            />
            <TouchableOpacity style={styles.button} onPress={addItem}>
                <Text style={styles.buText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.replace("/student/home")}>
                <Text style={styles.buText}>back</Text>
            </TouchableOpacity>
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
    heading: {
        fontSize: 30,
        color: "#fff",
        marginTop: 20,
        marginBottom: 10,
    },
    button: {
        padding: 10,
        backgroundColor: "#006400",
        borderRadius: 15,
        marginTop: 20,
        marginHorizontal: 10,
        marginBottom: 30,
    },
    buText: {
        fontSize: 20,
        color: "#000",
    },
    input: {
        padding: 10,
        paddingHorizontal: 60,
        backgroundColor: "#006400",
        borderRadius: 15,
        marginTop: 20,
        marginHorizontal: 10,
        marginBottom: 10,
        color: "#fff",
    },
});

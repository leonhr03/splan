import React, {useState} from "react"
import {SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import {useRouter} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NewGrade() {

    const router = useRouter()
    const [exam, setExam] = useState("")
    const [grade, setGrade] = useState("")
    const [examList, setExamList] = useState([])

    const save = async (array: any) => {
        await AsyncStorage.setItem("examsArray", JSON.stringify(array));
    };

    const addItem = async () => {
        const trimmedExam = exam.trim();
        const trimmedGrade = grade.trim();
        if (!trimmedExam&&!trimmedGrade) return;

        const currentData = await AsyncStorage.getItem("examsArray");
        const currentList = currentData ? JSON.parse(currentData) : [];

        const newList: any = [...currentList, { title: trimmedExam, grade: trimmedGrade }];
        setExamList(newList);
        await save(newList);
        setExam("");
    };

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Splan</Text>
            <TextInput
                style={styles.input}
                value={exam}
                onChangeText={setExam}
                placeholder={"Exam"}
            />
            <TextInput
                style={styles.input}
                value={grade}
                onChangeText={setGrade}
                placeholder={"grade"}
            />
            <TouchableOpacity style={styles.button} onPress={addItem}>
                <Text style={styles.buText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.replace("/student/grade")}>
                <Text style={styles.buText}>back</Text>
            </TouchableOpacity>
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
})
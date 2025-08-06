import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Exam = {
    title: string;
    grade: number;
    subject: string;
};

export default function Grade() {
    const { subject } = useLocalSearchParams();
    const [exams, setExams] = useState<Exam[]>([]);
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            const json = await AsyncStorage.getItem("examsArray");
            if (json) {
                const parsed: Exam[] = JSON.parse(json);
                setExams(parsed);
            }
        };
        load();
    }, []);

    const filteredExams = exams.filter((exam) => exam.subject === subject);

    const calculateAverage = () => {
        const validGrades = filteredExams
            .filter((exam) => exam.grade !== undefined && !isNaN(Number(exam.grade)))
            .map((exam) => Number(exam.grade));

        if (validGrades.length === 0) return null;

        const sum = validGrades.reduce((acc, grade) => acc + grade, 0);
        return (sum / validGrades.length).toFixed(2);
    };

    const renderItem = ({ item, index }: { item: Exam; index: number }) => {
        return (
            <View style={styles.item}>
                <View style={styles.itemLeft}>
                    <Text style={styles.text}>{item.title}</Text>
                </View>
                <TouchableOpacity
                    style={styles.itemRight}
                    onPress={() => router.replace(`/student/grade?subject=${encodeURIComponent(item.title)}`)}
                >
                    <Text style={styles.buText}>{item.grade}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>{subject}</Text>
            <Text style={styles.average}>{calculateAverage() ?? "N/A"}</Text>
            <FlatList data={exams} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.replace(`/student/newGrade?subject=${encodeURIComponent(subject as string)}`)}
            >
                <Text style={styles.buText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.replace(`/student/home`)}
            >
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

    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 16,
        marginVertical: 10,
    },

    itemLeft: {
        flex: 1,
        backgroundColor: "#006400",
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 20,
    },

    itemRight: {
        marginLeft: 10,
        backgroundColor: "#006400",
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    text: {
        fontSize: 20,
        marginHorizontal: 10,
        color: "#fff",
    },

    average: {
        padding: 10,
        backgroundColor: "#006400",
        borderRadius: 15,
        marginBottom: 20,
    },
})
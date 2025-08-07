import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Exam = {
    title: string;
    grade: number | string;
    subject: string;
};

export default function Grade() {
    const { subject } = useLocalSearchParams();
    const [exams, setExams] = useState<Exam[]>([]);
    const [average, setAverage] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            const json = await AsyncStorage.getItem(`examsArray${subject}`);
            if (json) {
                const parsed: Exam[] = JSON.parse(json);
                setExams(parsed);
                calculateAverage(parsed);
            } else {
                setExams([]);
                setAverage(null);
            }
        };

        loadData();
    }, [subject]);


    const calculateAverage = async (examList: Exam[]) => {
        const grades = examList
            .map((exam) => Number(exam.grade))
            .filter((grade) => !isNaN(grade));

        if (grades.length > 0) {
            const sum = grades.reduce((acc, curr) => acc + curr, 0);
            const avg = sum / grades.length;
            setAverage(avg);

        } else {
            setAverage(null);
        }
    };

    const deleteItem = async (index: number) => {
        Alert.alert(
            "Delete Exam",
            "Do your really want to delete this Exam",
            [
                {
                    text: "cancel",
                    style: "cancel",
                },
                {
                    text: "delete",
                    style: "destructive",
                    onPress: async () => {
                        const list = await AsyncStorage.getItem(`examsArray${subject}`);
                        if (list) {
                            const listParsed: Exam[] = JSON.parse(list);
                            listParsed.splice(index, 1);
                            await AsyncStorage.setItem(`examsArray${subject}`, JSON.stringify(listParsed));
                            setExams(listParsed);
                            calculateAverage(listParsed); // 👉 Durchschnitt neu berechnen
                        }
                    }
                }
            ]
        );
    };



    // @ts-ignore
    const renderItem = ({ item, index }: { item: Exam }) => {
        return (
            <TouchableOpacity style={styles.item} onLongPress={() => deleteItem(index)} onPress={() => router.replace(`/student/newGrade?subject=${encodeURIComponent(item.title)}`)}>
                <View style={styles.itemLeft}>
                    <Text style={styles.text}>{item.title}</Text>
                </View>
                <TouchableOpacity
                    style={styles.itemRight}
                    onPress={() =>
                        router.replace(
                            `/student/grade?subject=${encodeURIComponent(item.title)}`
                        )
                    }
                >
                    <Text style={styles.buText}>{item.grade}</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>{subject}</Text>

            {average !== null ? (
                <Text style={styles.heading}>Ø {average.toFixed(2)}</Text>
            ) : (
                <Text style={styles.heading}>Keine Noten</Text>
            )}

            <FlatList
                data={exams}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    router.replace(
                        `/student/newGrade?subject=${encodeURIComponent(subject as string)}`
                    )
                }
            >
                <Text style={styles.buText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.replace(`/student/home`)}
            >
                <Text style={styles.buText}>Back</Text>
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
});

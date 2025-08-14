import React, { useEffect, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal
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
    const [alertVisible, setAlertVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
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

            const storedData = await AsyncStorage.getItem("subjectsAverage");
            let subjectsArray = storedData ? JSON.parse(storedData) : [];

            const index = subjectsArray.findIndex(
                (item: { subject: string }) => item.subject === subject
            );

            if (index !== -1) {
                subjectsArray[index] = { subject: subject, average: avg };
            } else {
                subjectsArray.push({ subject: subject, average: avg });
            }

            await AsyncStorage.setItem(
                "subjectsAverage",
                JSON.stringify(subjectsArray)
            );
        } else {
            setAverage(null);
        }
    };

    const deleteItemConfirmed = async () => {
        if (selectedIndex === null) return;

        const list = await AsyncStorage.getItem(`examsArray${subject}`);
        if (list) {
            const listParsed: Exam[] = JSON.parse(list);
            listParsed.splice(selectedIndex, 1);
            await AsyncStorage.setItem(
                `examsArray${subject}`,
                JSON.stringify(listParsed)
            );
            setExams(listParsed);
            calculateAverage(listParsed);
        }
        setAlertVisible(false);
    };

    const deleteItem = (index: number) => {
        setSelectedIndex(index);
        setAlertVisible(true);
    };

    // @ts-ignore
    const renderItem = ({ item, index }: { item: Exam }) => {
        return (
            <TouchableOpacity
                style={styles.item}
                onLongPress={() => deleteItem(index)}
            >
                <View style={styles.itemLeft}>
                    <Text style={styles.text}>{item.title}</Text>
                </View>
                <TouchableOpacity
                    style={styles.itemRight}
                    onPress={() =>
                        router.replace(
                            `/pagesstudent/grade?subject=${encodeURIComponent(item.title)}`
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
                keyExtractor={(_, index) => index.toString()}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    router.replace(
                        `/pagesstudent/newGrade?subject=${encodeURIComponent(
                            subject as string
                        )}`
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

            {/* Custom Styled Alert */}
            <Modal transparent animationType="fade" visible={alertVisible}>
                <View style={styles.alertOverlay}>
                    <View style={styles.alertBox}>
                        <Text style={styles.alertTitle}>Delete Exam</Text>
                        <Text style={styles.alertMessage}>
                            Do you really want to delete this exam?
                        </Text>
                        <View style={styles.alertButtons}>
                            <TouchableOpacity
                                style={[styles.alertButton, styles.cancelButton]}
                                onPress={() => setAlertVisible(false)}
                            >
                                <Text style={styles.alertButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.alertButton, styles.deleteButton]}
                                onPress={deleteItemConfirmed}
                            >
                                <Text style={styles.alertButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        borderRadius: 20,
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
    // Alert styles
    alertOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    alertBox: {
        width: 300,
        backgroundColor: "#111",
        borderRadius: 12,
        padding: 20,
        borderWidth: 2,
        borderColor: "#006400",
    },
    alertTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#006400",
        marginBottom: 10,
        textAlign: "center",
    },
    alertMessage: {
        fontSize: 16,
        color: "#ccc",
        marginBottom: 20,
        textAlign: "center",
    },
    alertButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    alertButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#444",
    },
    deleteButton: {
        backgroundColor: "#8B0000",
    },
    alertButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});

import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    Text,
    StyleSheet,
    FlatList,
    View,
    TouchableOpacity,
    ListRenderItemInfo,
    Modal
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Subject = {
    title: string;
};

type Average = {
    subject: string;
    average?: number;
    avg?: number;
    value?: number;
};

export default function Home() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [averages, setAverages] = useState<Average[]>([]);
    const [overallAverage, setOverallAverage] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [alertVisible, setAlertVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const subjectsJson = await AsyncStorage.getItem("subjectsArray");
                const averagesJson = await AsyncStorage.getItem("subjectsAverage");

                const subjectsParsed: Subject[] = subjectsJson ? JSON.parse(subjectsJson) : [];
                const averagesParsed: Average[] = averagesJson ? JSON.parse(averagesJson) : [];

                setSubjects(subjectsParsed);
                setAverages(averagesParsed);

                const validNumbers = averagesParsed
                    .map(a => Number(a.avg ?? a.average ?? a.value))
                    .filter(num => !isNaN(num));

                if (validNumbers.length > 0) {
                    const sum = validNumbers.reduce((acc, curr) => acc + curr, 0);
                    setOverallAverage(sum / validNumbers.length);
                } else {
                    setOverallAverage(null);
                }
            } catch (error) {
                console.error("Fehler beim Laden:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const deleteItemConfirmed = async () => {
        if (selectedIndex === null) return;

        const list = await AsyncStorage.getItem("subjectsArray");
        if (list) {
            const listParsed: Subject[] = JSON.parse(list);
            listParsed.splice(selectedIndex, 1);
            await AsyncStorage.setItem("subjectsArray", JSON.stringify(listParsed));
            setSubjects(listParsed);
        }
        setAlertVisible(false);
    };

    const deleteItem = (index: number) => {
        setSelectedIndex(index);
        setAlertVisible(true);
    };

    const renderItem = ({ item, index }: ListRenderItemInfo<Subject>) => {
        const avgObj = averages.find(a => a.subject === item.title);

        let avgText = "—";
        if (avgObj) {
            const value = Number(avgObj.avg ?? avgObj.average ?? avgObj.value);
            if (!isNaN(value)) {
                avgText = value.toFixed(2);
            }
        }

        return (
            <TouchableOpacity
                onLongPress={() => deleteItem(index)}
                onPress={() =>
                    router.replace(`/pagesstudent/grade?subject=${encodeURIComponent(item.title)}`)
                }
            >
                <View style={styles.item}>
                    <View style={styles.itemLeft}>
                        <Text style={styles.text}>{item.title}</Text>
                    </View>
                    <View style={styles.itemRight}>
                        <Text style={styles.buText}>{avgText}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <Text style={{ color: "#fff" }}>Lade Daten…</Text>
            ) : (
                <>
                    <Text style={styles.heading}>Splan for Students</Text>

                    {overallAverage !== null ? (
                        <Text style={styles.heading}>Ø {overallAverage.toFixed(2)}</Text>
                    ) : (
                        <Text style={styles.heading}>Kein Gesamtdurchschnitt</Text>
                    )}

                    <FlatList
                        data={subjects}
                        renderItem={renderItem}
                        keyExtractor={(_, index) => index.toString()}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.replace("/pagesstudent/newSubject")}
                    >
                        <Text style={styles.buText}>Add</Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Custom Alert */}
            <Modal transparent animationType="fade" visible={alertVisible}>
                <View style={styles.alertOverlay}>
                    <View style={styles.alertBox}>
                        <Text style={styles.alertTitle}>Delete Subject</Text>
                        <Text style={styles.alertMessage}>
                            Do you really want to delete this subject?
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
        color: "#006400",
        marginTop: 20,
        marginBottom: 10,
    },
    text: {
        fontSize: 20,
        marginHorizontal: 10,
        color: "#fff",
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
    button: {
        padding: 10,
        backgroundColor: "#006400",
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 100,
    },
    buText: {
        fontSize: 20,
        color: "#000",
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

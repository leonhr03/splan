import React, {useEffect, useState} from "react"
import {FlatList, SafeAreaView, Text, TouchableOpacity, StyleSheet, View, Modal, TextInput} from "react-native";
import {useLocalSearchParams} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ClassStudent() {
    const {headingClass} = useLocalSearchParams()
    const [alertVisible, setAlertVisible] = useState(false)
    const [addStudentAlert, setAddStudentAlert] = useState(false)
    const [newStudent, setNewStudent] = useState("")
    const [students, setStudents] = useState([
        {title: "max mustermann"},
        {title: "Herbert Herrmann"},
        {title: "Jacky Daniela"}
    ])

    useEffect(() => {
        const load = async()=> {
            const storedClasses = await AsyncStorage.getItem(`${headingClass}/students`);
            setStudents(storedClasses ? JSON.parse(storedClasses) : []);
        }
        load()
    }, [])

    const save = async (array: any) => {
        const storedNewList = await AsyncStorage.setItem(`${headingClass}/students`, JSON.stringify(array) )
        const storedClasses = await AsyncStorage.getItem(`${headingClass}/students`);
        setStudents(storedClasses ? JSON.parse(storedClasses) : []);
    }

    const addStudent = async () => {
        const trimmed = newStudent.trim()
        if(!trimmed) return;

        const storedStudent = await AsyncStorage.getItem(`${headingClass}/students`)
        const parsedStudent = storedStudent ? JSON.parse(storedStudent): [];

        const newStudentList = [...parsedStudent, {title: trimmed}]
        await save(newStudentList)
        setNewStudent("")
        setAddStudentAlert(false)
    };

    const renderItem = ({ item, index }: any) => {

        return (
            <TouchableOpacity
                onPress={() => setAlertVisible(true)}
            >
                <View style={styles.item}>
                    <View style={styles.itemLeft}>
                        <Text style={styles.text}>{item.title}</Text>
                    </View>
                    <View style={styles.itemRight}>
                        <Text style={styles.buText}>{"->"}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>{headingClass}</Text>
            <FlatList
                data={students}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
            />

            <TouchableOpacity style={styles.button} onPress={() => setAddStudentAlert(true)}>
                <Text style={styles.buText}>Add</Text>
            </TouchableOpacity>


            <Modal transparent animationType="fade" visible={alertVisible}>
                <View style={styles.alertOverlay}>
                    <View style={styles.alertContainer}>
                        <Text style={styles.alertHeading}>Comming soon...</Text>
                        <Text style={styles.alertText}>This function will comming soon :)</Text>
                        <TouchableOpacity style={[styles.alertButton, styles.alertButtonBorder]} onPress={() => setAlertVisible(false)}>
                            <Text style={styles.alertText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>

            <Modal transparent animationType="fade" visible={addStudentAlert}>
                <View style={styles.alertOverlay}>
                    <View style={styles.alertContainer}>
                        <Text style={styles.alertHeading}>Add Class</Text>
                        <TextInput
                            style={styles.input}
                            value={newStudent}
                            onChangeText={setNewStudent}
                            placeholder={"class"}
                        />
                        <View style={styles.alertButtons}>
                            <TouchableOpacity
                                style={[styles.alertButton, styles.alertButtonBorder]}
                                onPress={() => setAddStudentAlert(false)}
                            >
                                <Text style={styles.alertText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.alertButton, styles.alertButtonBorder]}
                                onPress={addStudent}
                            >
                                <Text style={styles.alertText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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

    alertContainer: {
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#006400",
        backgroundColor: "#111",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },

    alertHeading: {
        fontSize: 22,
        color: "#006400",
    },

    alertText: {
        fontSize: 20,
        color: "#fff"
    },


    alertOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    input: {
        padding: 10,
        paddingHorizontal: 60,
        backgroundColor: "#006400",
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 20,
        color: "#fff",
    },

    alertButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    alertButton: {
        backgroundColor: "#444",
    },

    alertButtonBorder: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: "center",
    },


})
import React, {useEffect, useState} from "react"
import {FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native"
import {useLocalSearchParams} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Student() {

    const [subject, setSubject]  = useState([])
    const [newSubject, setNewSubject] = useState("")
    const {student} = useLocalSearchParams()
    const [addSubjectAlert, setAddSubjectAlert] = useState(false)

    useEffect(() => {
        const load = async()=> {
            const storedClasses = await AsyncStorage.getItem(`${student}/subjects`);
            setSubject(storedClasses ? JSON.parse(storedClasses) : []);
        }
        load()
    }, [])

    const save = async (array: any) => {
        const storedNewList = await AsyncStorage.setItem(`${student}/subjects`, JSON.stringify(array) )
        const storedClasses = await AsyncStorage.getItem(`${student}/subjects`);
        setSubject(storedClasses ? JSON.parse(storedClasses) : []);
    }

    const addStudent = async () => {
        const trimmed = newSubject.trim()
        if(!trimmed) return;

        const storedStudent = await AsyncStorage.getItem(`${student}/subjects`)
        const parsedStudent = storedStudent ? JSON.parse(storedStudent): [];

        const newStudentList = [...parsedStudent, {title: trimmed}]
        await save(newStudentList)
        setNewSubject("")
        setAddSubjectAlert(false)
    };


    const renderItem = ({ item, index }: any) => {
        return (
            <TouchableOpacity>
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
            <Text style={styles.heading}>{student}</Text>
            <FlatList
                data={subject}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
            >
            </FlatList>
            <TouchableOpacity style={styles.button} onPress={() => setAddSubjectAlert(true)}>
                <Text style={styles.buText}>Add</Text>
            </TouchableOpacity>

            <Modal transparent animationType="fade" visible={addSubjectAlert}>
                <View style={styles.alertOverlay}>
                    <View style={styles.alertContainer}>
                        <Text style={styles.alertHeading}>Add Student</Text>
                        <TextInput
                            style={styles.input}
                            value={newSubject}
                            onChangeText={setNewSubject}
                            placeholder={"Student Name"}
                        />
                        <View style={styles.alertButtons}>
                            <TouchableOpacity
                                style={[styles.alertButton, styles.alertButtonBorder]}
                                onPress={() => setAddSubjectAlert(false)}
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
        fontSize: 22,
        color: "#006400",
        marginTop: 20,
        marginBottom: 10,
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

    buText: {
        fontSize: 20,
        color: "#000",
    },

    text: {
        fontSize: 20,
        marginHorizontal: 10,
        color: "#fff",
    },

    button: {
        padding: 10,
        backgroundColor: "#006400",
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 30,
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
import React, { useState } from "react";
import {SafeAreaView, Text, StyleSheet, FlatList, View, TouchableOpacity, TextInput} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function ChooseScreen() {
    const [subject, setSubject] = useState("")
    const [rating, setRating] = useState("1")
    const [scratch, setScratch] = useState([
        { title: "Enter Your Subjects", note: "" },
    ]);

    const write = () => {
        setScratch(prev => [...prev, { title: subject, note: rating }]);
        setSubject("");
        setRating("");
    };

    const deleteItem = (indexToDelete: number) => {
        setScratch(prev => prev.filter((_, index) => index !== indexToDelete));
    };


    // @ts-ignore
    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.item}>
                <Text style={styles.text}>{item.title}</Text>
                <Text style={styles.text}>{item.note}</Text>
                <TouchableOpacity onPress={() => deleteItem(index)}>
                    <Text style={[styles.text, { color: 'red', marginLeft: 10 }]}>X</Text>
                </TouchableOpacity>
            </View>
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Splan</Text>
            <Text style={styles.note}>Note</Text>
            <FlatList
                data={scratch}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <TextInput  style={styles.input} value={subject} onChangeText={setSubject} placeholder={"subject"}/>
            <Picker
                selectedValue={rating}
                onValueChange={(itemValue) => setRating(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
                <Picker.Item label="5" value="5" />
                <Picker.Item label="6" value="6" />
            </Picker>
            <TouchableOpacity style={styles.button} onPress={write}>
                <Text style={styles.buText}>Add</Text>
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
    text: {
        fontSize: 20,
        marginHorizontal: 10,
        color: "#fff",
    },
    item: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        padding: 12,
        marginVertical: 10,
        backgroundColor: "#006400",
    },
    button: {
        padding: 10,
        backgroundColor: "#006400",
        borderRadius: 15,
        marginTop: 20,
        marginHorizontal: 10,
        marginBottom: 30,
    },

    note: {
        padding: 10,
        backgroundColor: "#006400",
        borderRadius: 15,
        marginTop: 10,
        marginHorizontal: 10,
        marginBottom: 10,
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
    },

    picker: {
        width: "100%",
        color: "#fff",
        backgroundColor: "#006400",
        marginVertical: 10,
        marginRight: 800,
        marginLeft: 800,
        padding: 5,
    },
});

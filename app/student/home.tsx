import React, {useEffect, useState} from "react";
import {SafeAreaView, Text, StyleSheet, FlatList, View, TouchableOpacity } from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from 'react-native';

export default function Home() {
    const [scratch, setScratch] = useState([]);
    const router = useRouter()

    useEffect(() => {
        const load = async () => {
            const json = await AsyncStorage.getItem("subjectsArray");
            if (json) {
                const parsed = JSON.parse(json); // <-- das ist wichtig!
                setScratch(parsed);
            }
        };
        load();
    },);



    const deleteItem = async (index: number) => {
        Alert.alert(
            "Delete Subject",
            "Do you really want to delete this subject",
            [
                {
                    text: "cancel",
                    style: "cancel",
                },
                {
                    text: "delete",
                    style: "destructive",
                    onPress: async () => {
                        const list = await AsyncStorage.getItem("subjectsArray");

                        if (list) {
                            const listParsed = JSON.parse(list);
                            listParsed.splice(index, 1);
                            await AsyncStorage.setItem("subjectsArray", JSON.stringify(listParsed));
                            setScratch(listParsed);
                        }
                    }
                }
            ]
        );
    };



    // @ts-ignore
    const renderItem = ({ item, index }) => {

        return (
            <TouchableOpacity onLongPress={() => deleteItem(index)} onPress={() => router.replace(`/student/grade?subject=${encodeURIComponent(item.title)}`)}>
                <View style={styles.item}>
                    <View style={styles.itemLeft}>
                        <Text style={styles.text}>{item.title}</Text>
                    </View>
                    <View style={styles.itemRight}
                    >
                        <Text style={styles.buText}>{"->"}</Text>
                    </View>
                </View>
            </TouchableOpacity>

        );
    };


    // @ts-ignore
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Splan</Text>
            <FlatList
                data={scratch}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity style={styles.button} onPress={() => router.replace("/student/newSubject")}>
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

    linkText: {
        fontSize: 20,
        color: "#006400",
        marginBottom: 30,
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
});

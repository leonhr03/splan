import { Tabs } from 'expo-router';
import {Ionicons} from "@expo/vector-icons";

export default function StudentLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#006400',
                tabBarInactiveTintColor: '#006400',
                tabBarStyle: {
                    borderRadius: 15,
                    backgroundColor: '#000',
                    marginBottom: 25,
                    marginLeft: 10,
                    marginRight: 10,
                    padding: 20,
                    position: 'absolute',
                    borderWidth: 1,
                    borderColor: '#006400',
                },
                tabBarLabelStyle: {
                    color: '#006400',
                },
            }}>
            <Tabs.Screen name="home"
                         options={{
                             tabBarLabel: 'Home',
                             tabBarIcon: ({ color, size, focused }) => (
                                 <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
                             ),
                         }}/>
            <Tabs.Screen name="account"
                         options={{
                             tabBarLabel: 'Konto',
                             tabBarIcon: ({ color, size, focused }) => (
                                 <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
                             ),
                         }}/>
        </Tabs>
    );
}

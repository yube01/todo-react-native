import { Tabs } from "expo-router";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
export default function Layout() {
    return (
        <Tabs>
            <Tabs.Screen name="home" options={{
                tabBarLabel: "Home", tabBarLabelStyle: { color: "#7CB9E8" }, headerShown: false, tabBarIcon: ({ focused }) =>
                    focused ? (<FontAwesome5 name="tasks" size={24} color="#7CB9E8" />) : (<FontAwesome5 name="tasks" size={24} color="black" />)

            }} />

            <Tabs.Screen name="calendar" options={{
                tabBarLabel: "Calendar", tabBarLabelStyle: { color: "#7CB9E8" }, headerShown: false, tabBarIcon: ({ focused }) =>
                    focused ? (<FontAwesome5 name="calendar" size={24} color="#7CB9E8"
                         />) : (<FontAwesome5 name="calendar" size={24} color="black" />)

            }} />

            <Tabs.Screen name="profile" options={{
                tabBarLabel: "Profile", tabBarLabelStyle: { color: "#7CB9E8" }, headerShown: false, tabBarIcon: ({ focused }) =>
                    focused ? (<MaterialIcons name="account-circle" size={24} color="#7CB9E8" />) : (<MaterialIcons name="account-circle" size={24} color="black" />)

            }} />
        </Tabs>
    )

}
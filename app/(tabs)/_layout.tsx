import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ headerShown: true, title: "NerdWordle" }}
      />
      <Tabs.Screen
        name="friends"
        options={{ headerShown: true, title: "Friends" }}
      />
    </Tabs>
  );
}

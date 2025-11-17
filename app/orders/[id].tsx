import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";


export default function OrderDetails() {
const { id } = useLocalSearchParams<{id: string}>();
const router = useRouter();


function edit() {
Alert.alert("Edit", "Implement edit flow");
}


function del() {
Alert.alert("Delete", "Implement delete flow");
}


return (
<View className="flex-1 bg-gray-100 p-5">
<Text className="text-2xl font-bold text-gray-800 mb-4">Order #{id}</Text>


<View className="bg-white p-4 rounded-xl shadow">
<Text className="text-lg font-semibold">Customer: John Doe</Text>
<Text className="text-gray-600">Event Date: 2025-11-20</Text>


<Text className="font-semibold mt-4">Materials:</Text>
<Text className="text-gray-600">- Flowers
- Drapes
- Lights</Text>


<Text className="font-semibold mt-4">Total Cost:</Text>
<Text className="text-xl mt-1">Rs. 15,000</Text>


<View className="flex-row mt-4 space-x-3">
<TouchableOpacity onPress={edit} className="flex-1 bg-yellow-400 p-3 rounded-xl">
<Text className="text-center font-semibold">Edit</Text>
</TouchableOpacity>


<TouchableOpacity onPress={del} className="flex-1 bg-red-500 p-3 rounded-xl">
<Text className="text-center text-white font-semibold">Delete</Text>
</TouchableOpacity>
</View>
</View>
</View>
);
}
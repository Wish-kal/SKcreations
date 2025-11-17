import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";


export default function CreateOrder() {
const router = useRouter();
const [name, setName] = useState("");
const [date, setDate] = useState("");
const [materials, setMaterials] = useState("");
const [cost, setCost] = useState("");


function save() {
// placeholder: save to local DB & sync
Alert.alert("Saved", "Order saved locally (placeholder)");
router.push("/orders");
}


return (
<View className="flex-1 bg-gray-100 p-5">
<Text className="text-2xl font-bold text-gray-800 mb-4">Create New Order</Text>


<Text className="text-gray-700 mb-1">Customer Name</Text>
<TextInput value={name} onChangeText={setName} className="bg-white p-3 rounded-xl mb-4" />


<Text className="text-gray-700 mb-1">Event Date</Text>
<TextInput value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" className="bg-white p-3 rounded-xl mb-4" />


<Text className="text-gray-700 mb-1">Materials Required</Text>
<TextInput value={materials} onChangeText={setMaterials} multiline className="bg-white p-3 rounded-xl mb-4 h-32" />


<Text className="text-gray-700 mb-1">Total Cost (LKR)</Text>
<TextInput value={cost} onChangeText={setCost} keyboardType="numeric" className="bg-white p-3 rounded-xl mb-6" />


<TouchableOpacity onPress={save} className="bg-blue-600 p-4 rounded-xl">
<Text className="text-center text-white font-semibold text-lg">Save Order</Text>
</TouchableOpacity>
</View>
);
}
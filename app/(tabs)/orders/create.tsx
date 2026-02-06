"use client";

import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { router, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {db} from "../../../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import AntDesign from '@expo/vector-icons/AntDesign';

//Added the quantitiy attribute
type Material ={
    name: string;
    quantity: string;
    price: string;
};

export default function CreateOrder() {
const router = useRouter();
const [name, setName] = useState("");
const [date, setDate] = useState("");
const [materials, setMaterials] = useState<Material[]>([]);
const [total, setTotal] = useState(0);

const addMaterial = () => setMaterials([...materials, {name: "", quantity: "", price: ""}]);

const updateMaterial = (index: number, field: keyof Material, value: string) => {
    const newMaterials=[...materials];
    newMaterials[index][field] = value;

    const newTotal = newMaterials.reduce((sum, m)=> sum + ((parseFloat(m.price)*parseFloat(m.quantity)) || 0), 0);
    setTotal(newTotal);
    setMaterials(newMaterials);
};

const removeMaterial = (index: number) => {
    const newMaterials = materials.filter((_,i)=> i!==index);
    const newTotal = newMaterials.reduce((sum, m) => sum + ((parseFloat(m.price) * parseFloat(m.quantity))||0),0);
    setMaterials(newMaterials);
    setTotal(newTotal);
}

    async function save() {
      if (!name || !date || materials.length === 0) {
    Alert.alert("Error", "Please fill all fields and add at least one material");
    return;
  }
  try{
    const docRef = await addDoc(collection(db, "orders"),{
        customer: name,
        event_date: date,
        materials,
        total,
        status: "Pending",
        created_at: Timestamp.now()
    });
    Alert.alert("Saved", "Order saved in Firebase!");
    router.push("/orders")
  }catch(error){
    console.error("Error saving order: ", error);
    Alert.alert("Error", "Failed to save order.");
  }
};


return (
<ScrollView className="flex-1 bg-gray-100 p-5">
        <TouchableOpacity onPress={() => router.push("/(tabs)")}
        className="mb-4 flex-row items-center">
           <AntDesign name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
<Text className="text-2xl font-bold text-gray-800 mb-4">Create New Order</Text>


<Text className="text-gray-700 mb-1">Customer Name</Text>
<TextInput value={name} onChangeText={setName} className="bg-white p-3 rounded-xl mb-4" />


<Text className="text-gray-700 mb-1">Event Date</Text>
<TextInput value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" className="bg-white p-3 rounded-xl mb-4" />


<Text className="text-gray-700 mb-1">Materials Required</Text>

{materials.map((m, i) => (
    <View key={i} className="bg-white p-3 rounded-xl mb-3 shadow">
        <View className="flex-1 mr-2">
        <TextInput placeholder="Material Name" value={m.name} onChangeText={(text) => updateMaterial(i, "name", text)} className="border border-gray-300 rounded p-2 mb-2"/>
        <TextInput placeholder="Price"
            value={m.price}
            onChangeText={(text) => updateMaterial(i, "price", text)}
            keyboardType="numeric"
            className="border border-gray-300 rounded p-2" />
        <TextInput placeholder="Quantity" value={m.quantity} 
            onChangeText={(text)=> updateMaterial(i,"quantity", text)} 
            className="border border-gray-300 rounded p-2 mt-2"
            keyboardType="numeric"/>
        </View>
        <TouchableOpacity onPress={()=> removeMaterial(i)} className="bg-red-500 px-3 py-2 rounded-xl mt-2">
            <Text className="text-white font-semibold">Remove</Text>
        </TouchableOpacity>
    </View>
))}


<TouchableOpacity onPress={addMaterial} className="bg-blue-600 py-3 px-6 rounded-xl mb-4">
        <Text className="text-white text-center font-semibold">Add Material</Text>
      </TouchableOpacity>

      <Text className="text-lg font-bold mb-6">Estimated Total: Rs. {total.toFixed(2)}</Text>

      <TouchableOpacity onPress={save} className="bg-green-600 py-4 px-6 rounded-xl mb-10">
        <Text className="text-white text-center font-semibold text-lg">Save Order</Text>
      </TouchableOpacity>
</ScrollView>
);
}
"use client";

import { db } from "@/firebase";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";


type Material = {
    name: string;
    quantity: string;
    price: string;
}

type Order = {
  id: string;
  customer: string;
  event_date: string;
  total: number;
  materials: Material[];
  status: string;
};

export default function EditOrder() {
    const {id} = useLocalSearchParams<{id: string}>();

    const [name, setName]= useState("");
    const [date, setDate] = useState("");
    const [materials, setMaterials] = useState<Material[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<Order | null>(null);
    


    useEffect(()=>{
        const fetchOrder = async () => {
            try {
                const docRef = doc(db, "orders", id!);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as Order;
                    const materialsArray = Array.isArray(data.materials) ? data.materials : [];

                    setOrder({ ...data, id: docSnap.id, materials: materialsArray });
                    
                    setName(data.customer);
                    setDate(data.event_date);
                    setMaterials(materialsArray);
                    const totalCost = materialsArray.reduce(
                        (sum, m) => sum + (parseFloat(m.price) * parseFloat(m.quantity)), 0
                     );

                     setTotal(totalCost)
                }else {
                    Alert.alert("Error", "Order not found");
                    router.back();
                }
            }catch (error) {
                console.error("Error loading order:", error);
            }finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const addMaterial = () =>
        setMaterials([...materials, {name:"", quantity:"", price:""}]);
    
    const updateMaterial = (index: number, field: keyof Material, value: string | number) => {
        const newMaterials = [...materials];
        newMaterials[index][field] = field === "price" || field === "quantity" ? parseFloat(value): value;

        const newTotal = newMaterials.reduce(
            (sum, m) => sum + ((parseFloat(m.price) * parseFloat(m.quantity)) || 0), 0
        );

        setMaterials(newMaterials);
        setTotal(newTotal);
    };

    const removeMaterial = (index: number) => {
        const updated = materials.filter((_, i)=>1 !== index);
        const newTotal = updated.reduce(
            (sum, m) =>
                sum + ((parseFloat(m.price) * parseFloat(m.quantity)) || 0),0
        );

        setMaterials(updated);
        setTotal(newTotal);
    };

    const saveChanges = async () => {
        if (!name || !date || materials.length === 0) {
            Alert.alert("Error", "Please fill all fields and add atleast one material");
            return;
        }

        try{
            const docRef = doc(db, "orders", id!);

            await updateDoc(docRef, {
                customer: name,
                event_date: date,
                materials,
                total,
                updated_at: Timestamp.now(),
            });

            Alert.alert("Updated", "Order updated successfully!");
            router.back();
        }catch (error) {
            console.error("Error updating order:", error);
            Alert.alert("Error", "Failed to update order");
        }
    };

    if (loading) return <Text className="p-5"> Loading...</Text>;

    return (
        <ScrollView className="flex-1 bg-gray-100 p-5">
            <TouchableOpacity onPress={()=> router.back()} className="mb-4 flex-row items-center">
                <AntDesign name="arrow-left" size={20} color="black"/>
            </TouchableOpacity>

            <Text className="text-2xl font-bold text-gray-800 mb-4">Edit Order</Text>

      {/* Customer Name */}
      <Text className="text-gray-700 mb-1">Customer Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        className="bg-white p-3 rounded-xl mb-4"
      />

      {/* Event Date */}
      <Text className="text-gray-700 mb-1">Event Date</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
        className="bg-white p-3 rounded-xl mb-4"
      />

      <Text className="text-gray-700 mb-1">Email Address</Text>

      {/* Materials */}
      <Text className="text-gray-700 mb-1">Materials Required</Text>

      {materials.map((m, i) => (
        <View key={i} className="bg-white p-3 rounded-xl mb-3 shadow">
          <TextInput
            placeholder="Material Name"
            value={m.name}
            onChangeText={(text) => updateMaterial(i, "name", text)}
            className="border border-gray-300 rounded p-2 mb-2"
          />

          <TextInput
            placeholder="Price"
            value={m.price.toString()}
            onChangeText={(text) => updateMaterial(i, "price", text)}
            keyboardType="numeric"
            className="border border-gray-300 rounded p-2"
          />

          <TextInput
            placeholder="Quantity"
            value={m.quantity.toString()}
            onChangeText={(text) => updateMaterial(i, "quantity", text)}
            keyboardType="numeric"
            className="border border-gray-300 rounded p-2 mt-2"
          />

          <TouchableOpacity
            onPress={() => removeMaterial(i)}
            className="bg-red-500 px-3 py-2 rounded-xl mt-2"
          >
            <Text className="text-white font-semibold">Remove</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Add Material */}
      <TouchableOpacity
        onPress={addMaterial}
        className="bg-blue-600 py-3 px-6 rounded-xl mb-4"
      >
        <Text className="text-white text-center font-semibold">
          Add Material
        </Text>
      </TouchableOpacity>

      {/* Total */}
      <Text className="text-lg font-bold mb-6">
        Estimated Total: Rs. {total.toFixed(2)}
      </Text>

      {/* Save */}
      <TouchableOpacity
        onPress={saveChanges}
        className="bg-green-600 py-4 px-6 rounded-xl mb-10"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Save Changes
        </Text>
      </TouchableOpacity>
        </ScrollView>
    );
}
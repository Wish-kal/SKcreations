"use client";
import OrderCard from "@/components/OrderCard";
import { Link, router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {db} from "../../../firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import AntDesign from "@expo/vector-icons/AntDesign";

type Material ={
    name:string;
    price: string;
}

type Order = {
  id: string;
  customer: string;
  event_date: string;
  total: number;
  status: string;
  materials: Material[];
};

export default function OrderList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const q= query(collection(db, "orders"), orderBy("created_at", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot)=>{
            const fetchedOrders: Order[] = snapshot.docs.map((doc)=>({
                id: doc.id,
                customer: doc.data().customer,
                event_date: doc.data().event_date,
                total: doc.data().total,
                status:doc.data().status,
                materials: doc.data().material || [],
            }));
            setOrders(fetchedOrders);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if(loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading orders...</Text>
            </View>
        );
    }

    if(orders.length==0){
        return(
            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-500">No orders found.</Text>
                <Link href="/orders/create" asChild>
                    <TouchableOpacity className="mt-4 bg-blue-600 p-3 rounded-xl">
                        <Text className="text-white font-semibold">Create First Order</Text>
                     </TouchableOpacity>
                </Link>
            </View>
        );
    }

    return(
        <ScrollView className="flex-1 bg-gray-100 p-4">
                    <TouchableOpacity onPress={() => router.push("/(tabs)")}
                        className="mb-4 flex-row items-center">
                            <AntDesign name="arrow-left" size={20} color="black" />
                     </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-800 mb-4">Orders</Text>
            {orders.map((o)=>(
                <OrderCard key={o.id} order={o} />
            ))}
        </ScrollView>
    )
}
"use client";
import { Link } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {db} from "../../firebase";
import { collection, orderBy, limit, query, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import OrderCard from "@/components/OrderCard";
import * as Animatable from 'react-native-animatable';
import { AntDesign } from "@expo/vector-icons";

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
}

export default function HomeScreen() {

  const [latestOrders, setLatestOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("created_at", "desc"), limit(3));

    const unsubscribe = onSnapshot(q, (snapshot)=>{
      const fetchedOrders: Order[] = snapshot.docs.map((doc)=>{
        const data = doc.data();
        return{
          id: data.id,
          customer: data.customer,
          event_date: data.event_date,
          total: data.total,
          status: data.status,
          materials: data.materials || [],
      };
    })
    setLatestOrders(fetchedOrders);
    setLoading(false);
    });
    return () => unsubscribe()
  }, []);
    
  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Text className="text-3xl text-slate-900 font-bold mb-6 text-center">
        SK creations
      </Text>
      <View className="flex-col justify-center gap-1 pb-2  items-center">
      <Animatable.View animation='bounceIn' iterationCount="infinite" direction="alternate">
        <AntDesign name='smile' size={24} color='black'/>
      </Animatable.View>
      <Animatable.Text animation="fadeInUp" delay={500} className="text-lg font-bold text-slate-600">
        Welcome, Siva!
      </Animatable.Text>
      </View>
    <View className="space-y-4 items-center">
      <Link href="/orders/create" asChild>
        <TouchableOpacity className="bg-blue-600 py-4 px-8 rounded-xl mb-4 w-72 shadow">
          <Text className="text-white text-center font-semibold text-lg">Create New Order</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/orders" asChild>
      <TouchableOpacity className="bg-white py-4 px-8 rounded-xl shadow w-72">
        <Text className="text-center text-gray-800 font-semibold text-lg">View All Orders</Text>
      </TouchableOpacity>
      </Link>
    </View>
    <View className="mt-5 border-b pb-2 border-gray-300 ml-2">
      <Text className="text-sm font-semibold">Recent Orders</Text>
    </View>
    <ScrollView className="rounded-xl  p-2 space-y-4 mt-2" scrollEnabled>
      {latestOrders.map(order => (
        <OrderCard key={order.id} order = {order} />
      ))}
    </ScrollView>
    </View>
  );
}

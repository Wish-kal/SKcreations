import OrderCard from "@/components/OrderCard";
import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";

    const orders = [
        { id: 1, customer: "John Doe", date: "2025-11-20", price: 15000, status: "Pending" },
        { id: 2, customer: "Saman", date: "2025-11-23", price: 8500, status: "Paid" },
    ];

export default function OrderList() {

    return(
        <ScrollView className="flex-1 bg-gray-100 p-4">
            <Text className="text-2xl font-bold text-gray-800 mb-4">Orders</Text>
            {orders.map((o)=>(
                <OrderCard key={o.id} order={o} />
            ))}
        </ScrollView>
    )
}
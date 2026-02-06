import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useEffect } from "react";

type Material ={
    name:string;
    price: string;
}

type Order ={
    id: string;
    customer: string;
    event_date: string;
    total: number;
    status: string;
    materials: Material[];
};

type Props = {
    order: Order;

};

export default function OrderCard({order}: Props) {

    return (
        <Link
            href={{
                pathname: "/orders/[id]",
                params: {id: order.id},
            }}
            asChild
        >
            <TouchableOpacity className="bg-white p-4 rounded-xl shadow mb-3">
                <Text className="text-lg font-semibold">{order.customer}</Text>
                <Text className="text-gray-500">Due Date: {order.event_date}</Text>
                <Text className="font-semibold mt-2">Rs. {order.total}</Text>
                <Text
                    className={`mt-2 text-sm ${
                        order.status === "Paid" ? "text-green-600" : "text-red-500"
                    }`}
                >
                    {order.status}
                </Text>
            </TouchableOpacity>
        </Link>
    )
}
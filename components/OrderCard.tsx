import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

type Order ={
    id: number;
    customer: string;
    date: string;
    price: number;
    status: string;
};

type Props = {
    order: Order;
};

export default function OrderCard({order}: Props) {
    return (
        <Link
            href={{
                pathname: "/orders/[id]",
                params: {id: order.id.toString()},
            }}
            asChild
        >
            <TouchableOpacity className="bg-white p-4 rounded-xl shadow mb-3">
                <Text className="text-lg font-semibold">{order.customer}</Text>
                <Text className="text-gray-500">Due Date: {order.date}</Text>
                <Text className="font-semibold mt-2">Rs. {order.price}</Text>
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
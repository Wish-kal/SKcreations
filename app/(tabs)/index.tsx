import { Link } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Text className="text-3xl text-gray-800 font-bold mb-6 text-center">
        SK creations
      </Text>
    <View className="space-y-4 items-center">
      <Link href="/orders/create" asChild>
        <TouchableOpacity className="bg-blue-600 py-4 px-8 rounded-xl mb-4 w-72">
          <Text className="text-white text-center font-semibold text-lg">Create New Order</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/orders" asChild>
      <TouchableOpacity className="bg-white py-4 px-8 rounded-xl shadow w-72">
        <Text className="text-center text-gray-800 font-semibold text-lg">View All Orders</Text>
      </TouchableOpacity>
      </Link>
    </View>
    </View>
  );
}

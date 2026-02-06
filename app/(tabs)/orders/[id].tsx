"use client";
import { View, Text, FlatList, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase"; // make sure this points to your Firebase config
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import AntDesign from "@expo/vector-icons/AntDesign";

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system/legacy';

type Material = {
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  customer: string;
  event_date: string;
  total: number;
  materials: Material[];
  status: string;
};

export default function OrderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db!, "orders", id!);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) setOrder({...docSnap.data(), id: docSnap.id} as Order);
        else console.log("No such order!");
      
      } catch (error) {
        console.error("Error fetching order: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleDelete = () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete",[
      {text: "Cancel", style: "cancel"},
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteOrder();
        }
      }
    ]);
  };

  const deleteOrder = async () => {
    if (!id) return;

    try {
    await deleteDoc(doc(db, "orders", id));
    Alert.alert("Deleted", "Order deleted successfully.", [
      { text: "OK", onPress: () => router.replace("/(tabs)/orders") }
    ]);
  } catch (error) {
    console.error("Error deleting order:", error);
    Alert.alert("Error", "Failed to delete order.");
  }
  }

  const generateInvoicePdf = async () => {
    if (!order) return;

    const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"/>
        <style>
          body {font-family: 'Segoue UI', Roboto, Arial, Helvetica, Arial, sans-serif; padding: 40px; color: #333; background: #f9fafb}
          .invoice-container {
            max-width: 800px;
            margin: auto;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: #2563eb;
            color: #fff;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            letter-spacing: 1px;
          }
          .header p {
            margin: 5px 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .details {
            padding: 25px;
            border-bottom: 1px solid #eee;
          }
          .details p {
            margin: 6px 0;
            font-size: 16px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          table th {
            background: #f3f4f6;
            text-align: left;
            padding: 12px;
            font-size: 14px;
            border-bottom: 2px solid #e5e7eb;
          }
          table td {
            padding: 12px;
            font-size: 14px;
            border-bottom: 1px solid #f1f5f9;
          }
          .total {
            text-align: right;
            padding: 20px;
            font-size: 18px;
            font-weight: bold;
            color: #111827;
          }
          .footer {
            background: #f9fafb;
            text-align: center;
            padding: 20px;
            font-size: 13px;
            color: #6b7280;
          }
          .status{
            margin-top: 12px;
            padding: 10px 15px;
            border-radius: 8px;
            display: inline-block;
            font-weight: bold;
            font-size: 15px;
          }
          .status-paid {
            background: #dcfce7;
            color: #166534;
          }
          .status-pending {
            background: #fee2e2;
            color: #991b1b;
          }

        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1>SkCreations - Invoice</h1>
            <p>Order ID: ${order.id}</p>
          </div>

          <div class="details">
            <p><strong>Customer:</strong> ${order.customer}</p>
            <p><strong>Date:</strong> ${order.event_date}</p>
            <div class="status ${order.status === "Paid" ? "status-paid" : "status-pending"}">
              Status: ${order.status}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.materials.map(m => `
                <tr>
                  <td>${m.name}</td>
                  <td>${m.quantity}</td>
                  <td>Rs. ${m.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            Total Amount: Rs. ${order.total}
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </body>
    </html>
    `;

    const {uri} = await Print.printToFileAsync({html});
    return uri;
  }

  const handleShare = async () => {
    if (!order) return;
    try {
      const uri = await generateInvoicePdf();
      if (!uri) return;
      await Sharing.shareAsync(uri, {UTI: '.pdf', mimeType:'application/pdf'});
    } catch (error) {
      Alert.alert("Error", "Failed to share invoice");
    }
  }

  const handleDownload = async () => {
    if (!order) return;
    try {
      const uri = await generateInvoicePdf();
      if (!uri) return;

      if (Platform.OS === "android"){
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, {encoding: FileSystem.EncodingType.Base64});
          const fileName = `Invoice_${order.id}.pdf`;

          await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, 'application/pdf').then(async (safUri) => {
            await FileSystem.writeAsStringAsync(safUri, base64, {encoding: FileSystem.EncodingType.Base64})
            Alert.alert("Success", "Invoice saved to the selected folder!")
          })
        }
      }else {
        await Sharing.shareAsync(uri);
      }
    }catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to download invoice")
    }
  }

  const handleUpdateStatus = async (newStatus: string) =>{
    if(!id) return;
    try{
      const docRef = doc(db, "orders", id);
      await updateDoc(docRef, {status: newStatus});
      setOrder(prev => prev? {...prev, status: newStatus} : prev);
      Alert.alert("Success", `Order Marked as ${newStatus}`);
    }catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Failed to update status")
    }
  }

  if (loading) return <Text className="p-5">Loading...</Text>;
  if (!order) return <Text className="p-5">Order not found.</Text>;

  return (
    <ScrollView className="flex-1 bg-gray-100 p-5">
      <TouchableOpacity onPress={() => router.push("/(tabs)")}
        className="mb-4 flex-row items-center">
            <AntDesign name="arrow-left" size={20} color="black" />
      </TouchableOpacity>
      <Text className="text-2xl font-bold mb-4">Order #{order.id}</Text>
      <Text className="text-lg font-semibold">Customer: {order.customer}</Text>
      <Text className="text-gray-600">Event Date: {order.event_date}</Text>

      <Text className="font-semibold mt-4">Materials:</Text>
      {order.materials.map((m, i) => (
        <Text key={i} className="text-gray-600">- {m.name}: Rs. {m.price}</Text>
      ))}

      <Text className="font-semibold mt-4">Total Cost:</Text>
      <Text className="text-xl mt-1">Rs. {order.total}</Text>

      <Text className="font-semibold mt-4">Status:</Text>
      <Text className={`text-lg mt-1 ${order.status === "Paid" ? "text-green-600" : "text-red-600"}`}>
          {order.status}
      </Text>

      <View className="flex-row gap-2">
      <TouchableOpacity
        className="bg-green-600 px-4 py-2 rounded-xl"
        onPress={() => handleUpdateStatus("Paid")}
      >
        <Text className="text-white font-semibold">Mark Paid</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-red-500 px-4 py-2 rounded-xl"
        onPress={() => handleUpdateStatus("Pending")}
      >
        <Text className="text-white font-semibold">Mark Pending</Text>
      </TouchableOpacity>
      </View>
      
      <View className="flex-row gap-2">
      <TouchableOpacity className="mt-5 border h-12 w-20 items-center p-3 rounded-xl flex-row gap-2" onPress={()=>router.push({pathname: "/orders/edit/[id]", params: {id: order.id}})}>
        <AntDesign name="edit" />
        <Text className="text-md font-semibold">Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-5 border h-12 w-22 text-center p-3 flex-row rounded-xl items-center gap-2"
      onPress={handleDelete}>
        <AntDesign name="delete"/>
        <Text className="text-md font-semibold text-red-600">Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-5 border h-12  items-center p-2 rounded-xl flex-row text-center gap-2" onPress={handleShare}>
        <AntDesign name="share-alt"/>
        <Text className="text-md font-semibold text-green-600">Share</Text>
      </TouchableOpacity>
      <TouchableOpacity className=" mt-5 border h-12 px-4 items-center rounded-xl flex-row gap-2" onPress={handleDownload}>
        <AntDesign name="download" size={16} color="blue"/>
        <Text className="font-semibold text-blue-600">Save</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

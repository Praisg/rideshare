import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { FC, useState, useEffect, useRef } from "react";
import CustomText from "./CustomText";
import { Colors } from "@/utils/Constants";
import { Ionicons } from "@expo/vector-icons";
import { commonStyles } from "@/styles/commonStyles";
import { useWS } from "@/service/WSProvider";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  timestamp: Date;
}

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
  rideId: string;
  recipientName: string;
  recipientRole: "rider" | "customer";
}

const QUICK_REPLIES = [
  "I'm on my way",
  "Running 5 mins late",
  "Where are you?",
  "I'm here",
  "Thank you!",
];

const ChatModal: FC<ChatModalProps> = ({
  visible,
  onClose,
  rideId,
  recipientName,
  recipientRole,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const { emit, on, off } = useWS();

  useEffect(() => {
    if (visible && rideId) {
      const handleChatMessage = (data: any) => {
        if (data.rideId === rideId && data.senderId) {
          const isMyMessage = data.senderRole === (recipientRole === "rider" ? "customer" : "rider");
          
          setMessages((prev) => {
            const exists = prev.some(msg => 
              msg.id === `${data.senderId}-${data.timestamp}`
            );
            
            if (exists) return prev;
            
            return [
              ...prev,
              {
                id: `${data.senderId}-${data.timestamp}`,
                text: data.message,
                sender: isMyMessage ? "me" : "other",
                timestamp: new Date(data.timestamp),
              },
            ];
          });
        }
      };

      const handleChatHistory = (data: any) => {
        if (data.rideId === rideId) {
          setMessages(data.messages || []);
        }
      };

      on("chatMessage", handleChatMessage);
      on("chatHistory", handleChatHistory);

      emit("getChatHistory", rideId);
    }

    return () => {
      off("chatMessage");
      off("chatHistory");
    };
  }, [visible, rideId, recipientRole]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "me",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    emit("sendChatMessage", {
      rideId,
      message: text.trim(),
      recipientRole,
    });

    setInputText("");
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === "me";
    return (
      <View
        style={{
          alignSelf: isMe ? "flex-end" : "flex-start",
          backgroundColor: isMe ? Colors.primary : "#F0F0F0",
          borderRadius: 16,
          padding: 12,
          marginVertical: 4,
          maxWidth: "75%",
          marginHorizontal: 12,
        }}
      >
        <CustomText
          fontSize={14}
          style={{ color: isMe ? Colors.white : "#333" }}
        >
          {item.text}
        </CustomText>
        <CustomText
          fontSize={9}
          style={{
            color: isMe ? "rgba(255,255,255,0.7)" : "#999",
            marginTop: 4,
          }}
        >
          {item.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </CustomText>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: Colors.white }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View
          style={{
            padding: 16,
            paddingTop: 50,
            backgroundColor: Colors.primary,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={commonStyles.flexRow}>
            <TouchableOpacity onPress={onClose} style={{ marginRight: 16 }}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <View>
              <CustomText
                fontFamily="SemiBold"
                fontSize={18}
                style={{ color: Colors.white }}
              >
                {recipientName}
              </CustomText>
              <CustomText fontSize={12} style={{ color: "rgba(255,255,255,0.8)" }}>
                {recipientRole === "rider" ? "Driver" : "Passenger"}
              </CustomText>
            </View>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 100 }}>
              <Ionicons name="chatbubbles-outline" size={64} color="#CCC" />
              <CustomText fontSize={14} style={{ color: "#999", marginTop: 16 }}>
                No messages yet. Start the conversation!
              </CustomText>
            </View>
          }
        />

        <View style={{ padding: 12, backgroundColor: "#F5F5F5" }}>
          <View style={{ marginBottom: 8 }}>
            <FlatList
              horizontal
              data={QUICK_REPLIES}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => sendMessage(item)}
                  style={{
                    backgroundColor: Colors.white,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8,
                    borderWidth: 1,
                    borderColor: "#E0E0E0",
                  }}
                >
                  <CustomText fontSize={12}>{item}</CustomText>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View>

          <View
            style={[
              commonStyles.flexRow,
              {
                backgroundColor: Colors.white,
                borderRadius: 25,
                paddingHorizontal: 16,
                paddingVertical: 8,
                alignItems: "center",
              },
            ]}
          >
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              style={{
                flex: 1,
                fontSize: 14,
                fontFamily: "Regular",
                paddingVertical: 8,
              }}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim()}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: inputText.trim() ? Colors.primary : "#CCC",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 8,
              }}
            >
              <Ionicons name="send" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ChatModal;


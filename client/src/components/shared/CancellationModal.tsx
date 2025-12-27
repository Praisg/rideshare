import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { FC, useState } from "react";
import CustomText from "./CustomText";
import { Colors } from "@/utils/Constants";
import { Ionicons } from "@expo/vector-icons";
import { commonStyles } from "@/styles/commonStyles";

interface CancellationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  userRole: "rider" | "customer";
}

const CUSTOMER_REASONS = [
  "Driver is taking too long",
  "Wrong pickup location",
  "Changed my mind",
  "Found another ride",
  "Driver asked me to cancel",
  "Price is too high",
  "Other",
];

const RIDER_REASONS = [
  "Passenger not responding",
  "Pickup location is too far",
  "Passenger requested cancellation",
  "Vehicle issue",
  "Traffic/road conditions",
  "Wrong passenger information",
  "Other",
];

const CancellationModal: FC<CancellationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  userRole,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  
  const reasons = userRole === "customer" ? CUSTOMER_REASONS : RIDER_REASONS;

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm(selectedReason);
      setSelectedReason("");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: Colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 20,
            maxHeight: "70%",
          }}
        >
          <View
            style={[
              commonStyles.flexRowBetween,
              { paddingHorizontal: 20, marginBottom: 20 },
            ]}
          >
            <CustomText fontFamily="Bold" fontSize={18}>
              Cancel Ride
            </CustomText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
            <CustomText fontSize={14} style={{ color: "#666" }}>
              Please select a reason for cancellation:
            </CustomText>
          </View>

          <ScrollView
            style={{ maxHeight: 400 }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {reasons.map((reason) => (
              <TouchableOpacity
                key={reason}
                onPress={() => setSelectedReason(reason)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  backgroundColor:
                    selectedReason === reason ? "#FFF3E0" : Colors.white,
                  borderWidth: 1,
                  borderColor:
                    selectedReason === reason ? Colors.primary : "#E5E5E5",
                  borderRadius: 12,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor:
                      selectedReason === reason ? Colors.primary : "#CCC",
                    marginRight: 12,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {selectedReason === reason && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: Colors.primary,
                      }}
                    />
                  )}
                </View>
                <CustomText
                  fontFamily={selectedReason === reason ? "Medium" : "Regular"}
                  fontSize={14}
                >
                  {reason}
                </CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedReason && (
            <View
              style={{
                padding: 16,
                backgroundColor: "#FFF3CD",
                marginHorizontal: 20,
                marginTop: 12,
                borderRadius: 8,
              }}
            >
              <CustomText fontSize={12} style={{ color: "#856404" }}>
                ⚠️ Frequent cancellations may affect your account rating
              </CustomText>
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              padding: 20,
              gap: 12,
              borderTopWidth: 1,
              borderTopColor: "#E5E5E5",
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                padding: 16,
                borderRadius: 12,
                backgroundColor: "#F0F0F0",
                alignItems: "center",
              }}
            >
              <CustomText fontFamily="SemiBold" fontSize={14}>
                Keep Ride
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={!selectedReason}
              style={{
                flex: 1,
                padding: 16,
                borderRadius: 12,
                backgroundColor: selectedReason ? "#D32F2F" : "#CCC",
                alignItems: "center",
              }}
            >
              <CustomText
                fontFamily="SemiBold"
                fontSize={14}
                style={{ color: Colors.white }}
              >
                Confirm Cancel
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CancellationModal;


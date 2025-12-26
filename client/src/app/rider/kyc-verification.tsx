import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import CustomText from "@/components/shared/CustomText";
import { Colors } from "@/utils/Constants";
import { submitKYC, getKYCStatus } from "@/service/kycService";
import { resetAndNavigate } from "@/utils/Helpers";
import * as ImagePicker from "expo-image-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const KYCVerification = () => {
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [currentStatus, setCurrentStatus] = useState("pending");
  const [idType, setIdType] = useState("national_id");
  const [showIdTypePicker, setShowIdTypePicker] = useState(false);
  const [idNumber, setIdNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [idFrontImage, setIdFrontImage] = useState("");
  const [idBackImage, setIdBackImage] = useState("");

  const idTypes = [
    { label: "National ID", value: "national_id" },
    { label: "Passport", value: "passport" },
    { label: "Driver's License", value: "drivers_license" },
  ];

  const getIdTypeLabel = () => {
    return idTypes.find((type) => type.value === idType)?.label || "Select ID Type";
  };

  const pickImage = async (type: "front" | "back") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      if (type === "front") {
        setIdFrontImage(base64Image);
      } else {
        setIdBackImage(base64Image);
      }
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      const result = await getKYCStatus();
      if (result.success) {
        const status = result.data.kyc?.status || "pending";
        setCurrentStatus(status);
        
        if (status === "submitted") {
          Alert.alert(
            "KYC Already Submitted",
            "Your verification documents are under review. You'll be notified once approved.",
            [
              {
                text: "Go to Home",
                onPress: () => resetAndNavigate("/rider/home"),
              },
            ]
          );
        } else if (status === "approved") {
          Alert.alert(
            "KYC Already Approved",
            "Your identity is already verified.",
            [
              {
                text: "Go to Home",
                onPress: () => resetAndNavigate("/rider/home"),
              },
            ]
          );
        }
      }
      setCheckingStatus(false);
    };
    
    checkStatus();
  }, []);

  const handleSubmit = async () => {
    if (currentStatus === "submitted") {
      Alert.alert(
        "Already Submitted",
        "Your KYC is already under review. Please wait for approval."
      );
      return;
    }

    if (currentStatus === "approved") {
      Alert.alert("Already Approved", "Your KYC is already approved.");
      return;
    }

    if (!idNumber || !fullName || !dateOfBirth || !address || !idFrontImage) {
      Alert.alert("Required Fields", "Please fill all required fields and upload ID front image");
      return;
    }

    setLoading(true);
    const result = await submitKYC({
      idType,
      idNumber,
      fullName,
      dateOfBirth,
      address,
      idFrontImage,
      idBackImage,
    });

    setLoading(false);

    if (result.success) {
      Alert.alert(
        "KYC Submitted",
        "Your verification documents have been submitted successfully. You'll be notified once verified.",
        [
          {
            text: "OK",
            onPress: () => resetAndNavigate("/rider/home"),
          },
        ]
      );
    }
  };

  if (checkingStatus) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <CustomText fontSize={16} style={{ marginTop: 16 }}>
            Checking verification status...
          </CustomText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <CustomText fontSize={24} fontWeight="bold" style={styles.headerText}>
            Identity Verification
          </CustomText>
          <CustomText fontSize={14} style={styles.subHeaderText}>
            Complete KYC to start accepting rides
          </CustomText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <CustomText fontSize={14} fontWeight="600" style={styles.label}>
              ID Type *
            </CustomText>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowIdTypePicker(true)}
            >
              <CustomText fontSize={16} style={styles.pickerButtonText}>
                {getIdTypeLabel()}
              </CustomText>
              <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <CustomText fontSize={14} fontWeight="600" style={styles.label}>
              ID Number *
            </CustomText>
            <TextInput
              style={styles.input}
              value={idNumber}
              onChangeText={setIdNumber}
              placeholder="Enter ID number"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <CustomText fontSize={14} fontWeight="600" style={styles.label}>
              Full Name *
            </CustomText>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name as on ID"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <CustomText fontSize={14} fontWeight="600" style={styles.label}>
              Date of Birth * (YYYY-MM-DD)
            </CustomText>
            <TextInput
              style={styles.input}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="1990-01-31"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <CustomText fontSize={14} fontWeight="600" style={styles.label}>
              Address *
            </CustomText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your full address"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <CustomText fontSize={14} fontWeight="600" style={styles.label}>
              ID Front Image *
            </CustomText>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => pickImage("front")}
            >
              {idFrontImage ? (
                <Image source={{ uri: idFrontImage }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <CustomText fontSize={14} style={{ color: Colors.primary }}>
                    Tap to upload front side
                  </CustomText>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <CustomText fontSize={14} fontWeight="600" style={styles.label}>
              ID Back Image (Optional)
            </CustomText>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => pickImage("back")}
            >
              {idBackImage ? (
                <Image source={{ uri: idBackImage }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <CustomText fontSize={14} style={{ color: Colors.primary }}>
                    Tap to upload back side
                  </CustomText>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <CustomText fontSize={16} fontWeight="600" style={styles.submitButtonText}>
                Submit for Verification
              </CustomText>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showIdTypePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowIdTypePicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowIdTypePicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <CustomText fontSize={18} fontWeight="600">
                Select ID Type
              </CustomText>
              <TouchableOpacity onPress={() => setShowIdTypePicker(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {idTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.modalOption,
                  idType === type.value && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setIdType(type.value);
                  setShowIdTypePicker(false);
                }}
              >
                <CustomText
                  fontSize={16}
                  style={[
                    styles.modalOptionText,
                    idType === type.value && styles.modalOptionTextSelected,
                  ]}
                >
                  {type.label}
                </CustomText>
                {idType === type.value && (
                  <MaterialIcons name="check" size={24} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  headerText: {
    color: Colors.primary,
    marginBottom: 8,
  },
  subHeaderText: {
    color: "#666",
    textAlign: "center",
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  pickerButtonText: {
    color: "#333",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalOptionSelected: {
    backgroundColor: "#f0f8ff",
  },
  modalOptionText: {
    color: "#333",
    flex: 1,
  },
  modalOptionTextSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
  imageButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  imagePlaceholder: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
  },
});

export default KYCVerification;


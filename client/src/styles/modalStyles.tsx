import { Colors } from "@/utils/Constants";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.white
    },
    footerContainer: {
        backgroundColor: Colors.white,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowColor: Colors.glass_shadow,
        elevation: 8,
        padding: 15
    },
    addressText: {
        fontSize: RFValue(12),
    },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.glass_shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonContainer: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        marginVertical:10,
        borderTopWidth: 1,
        borderColor: "#ccc"
    },
    buttonText: {
        color: Colors.white,
        fontSize: RFValue(13),
        fontWeight: "700"
    },
    centerText: {
        textAlign: 'center',
        fontWeight: "600",
        marginTop: 15,
        fontSize: RFValue(13),
        textTransform: 'capitalize'
    },
    cancelButton: {
        color: Colors.primary,
        fontSize: RFValue(13),
        position: "absolute",
        top: -18,
        zIndex: 99,
        right: 14
    },
    searchContainer: {
        backgroundColor: Colors.secondary_light,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        margin: 15,
        justifyContent: "space-between",
        borderRadius: 15,
        shadowColor: Colors.glass_shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    input: {
        backgroundColor: Colors.secondary_light,
        width: '92%',
        height: 42
    }
})
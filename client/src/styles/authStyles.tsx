import { Colors, screenWidth } from "@/utils/Constants";
import { Platform, StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
    logo: {
        width: 70,
        height: 70,
        resizeMode: 'contain'
    },
    container: {
        padding: 12,
        flex: 1,
        backgroundColor: Colors.background
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '40%',
    },
    flexRowGap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    footerContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'android' ? 20 : 30,
        width: screenWidth,
        padding: 10,
        justifyContent: 'center',
        alignItems: "center"
    },
    glassCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        marginTop: 30,
        shadowColor: Colors.glass_shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    }
})
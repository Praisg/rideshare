import { screenHeight, screenWidth, Colors } from "@/utils/Constants";
import { Platform, StyleSheet } from "react-native";

export const rideStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    backButton: {
        position: "absolute",
        top: Platform.OS === 'android' ? 20 : 60,
        left: 10,
        backgroundColor: Colors.white,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowColor: Colors.glass_shadow,
        elevation: 8,
        height: 40,
        width: 40
    },
    couponContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        width: "50%",
        left: -10,
        paddingHorizontal: 10,
        marginVertical: 10
    },
    icon: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    bookingContainer: {
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowColor: Colors.glass_shadow,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: Colors.white,
        position: "absolute",
        bottom: 0,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        width: '100%'
    },
    rideSelectionContainer: {
        borderTopLeftRadius: 25,
        height: screenHeight * 0.55,
        borderTopRightRadius: 25,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowColor: Colors.glass_shadow,
        elevation: 8,
        width: screenWidth,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rideIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    scrollContainer: {
        paddingBottom: 160,
        width: screenWidth,
        borderColor: '#777',
        paddingHorizontal: 10,
    },
    rideOption: {
        width: '100%',
        padding: 15,
        borderRadius: 15,
        marginVertical: 5,
        backgroundColor: Colors.white,
        borderWidth: 2,
        borderColor: Colors.secondary,
        shadowColor: Colors.glass_shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    rideDetails: {
        width: "70%"
    },
    priceContainer: {
        alignItems: 'flex-end'
    },
    fastestLabel: {
        color: Colors.primary,
        fontSize: 10,
        marginLeft: 5
    },
    discountedPrice: {
        textDecorationLine: 'line-through',
        color: '#888',
        fontSize: 12
    },
    offerText: {
        textAlign: 'center',
    },
    offerContainer: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        width: '100%',
        borderColor: '#ccc',
        marginBottom: 10
    },
    headerContainer: {
        borderBottomWidth: 2,
        borderColor: "#ddd",
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    pinIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    bottomButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    cancelButton: {
        flex: 1,
        marginRight: 10,
        backgroundColor: Colors.secondary_light,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.secondary,
    },
    cancelButtonText: {
        color: Colors.error,
    },
    backButton2: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: Colors.glass_shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    backButtonText: {
        color: Colors.white,
    },
    swipeableContaniner: {
        position: 'absolute',
        width: '100%',
        padding: 10,
        backgroundColor: Colors.white,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        bottom: 0,
        paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        shadowColor: Colors.glass_shadow,
        elevation: 8,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    swipeableContaninerRider: {
        width: '100%',
        padding: 10,
        backgroundColor: Colors.white,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        shadowColor: Colors.glass_shadow,
        elevation: 8,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    swipeButtonContainer: {
        borderRadius: 2,
        height: 50,
        borderWidth: 0,
    },
    railStyles: {
        backgroundColor: 'rgba(255,255,255,0.6)',
        height: 50,
        borderRadius: 0,
        borderWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleStyles: {
        fontWeight: '700',
    },
    thumbIconStyles: {
        borderRadius: 5,
        height: 50,
        backgroundColor: Colors.primary,
    },
})
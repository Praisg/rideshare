import { Colors, screenWidth } from "@/utils/Constants";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const uiStyles = StyleSheet.create({
    absoluteTop: {
        zIndex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0
    },
    container: {
        flexDirection: 'row',
        alignItems: "center",
        paddingHorizontal: 15,
        overflow: "hidden",
        paddingVertical: 10,
        justifyContent: 'space-between'
    },
    btn: {
        backgroundColor: Colors.white,
        borderRadius: 100,
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowColor: Colors.glass_shadow,
        elevation: 8,
        alignItems: 'center',
        padding: 10
    },
    dot: {
        width: 6,
        height: 6,
        backgroundColor: Colors.primary,
        borderRadius: 100,
        marginHorizontal: 10
    },
    locationBar: {
        width: '88%',
        backgroundColor: Colors.white,
        borderRadius: 15,
        height: 42,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowColor: Colors.glass_shadow,
        elevation: 8,
        gap: 1,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 12,
    },
    locationText: {
        width: '86%',
        fontSize: RFValue(10),
        fontFamily: 'Regular',
        color: Colors.text,
        opacity: 0.8
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderRadius: 15,
        marginBottom: 20,
        padding: 12,
        backgroundColor: Colors.white,
        shadowColor: Colors.glass_shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cubeContainer: {
        width: '22.8%',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cubeIcon: {
        width: '100%',
        height: 45,
        aspectRatio: 1 / 1,
        resizeMode: "contain",
    },
    cubeIconContainer: {
        width: '100%',
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        height: 60,
        marginBottom: 10,
        backgroundColor: Colors.secondary_light,
        shadowColor: Colors.glass_shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    cubes: {
        flexDirection: 'row',
        height: 100,
        marginVertical: 20,
        alignItems: 'baseline',
        justifyContent: 'space-between',
    },
    adImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover'
    },
    adSection: {
        width: '100%',
        backgroundColor: '#E5E7EA',
        marginVertical: 10,
        height: 100
    },
    banner: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',

    },
    bannerContainer: {
        width: '100%',
        height: 200,
        marginBottom: 20
    },
    locationInputs: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    suggestionText: {
        marginTop: 6,
        color: '#666',
        textTransform: 'capitalize'
    },
    mapPinIcon: {
        width: 20,
        marginRight: 10,
        height: 20,
        resizeMode: 'contain'
    }
})
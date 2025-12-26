import { Dimensions } from "react-native";

export const screenHeight = Dimensions.get('screen').height
export const screenWidth = Dimensions.get('screen').width

export enum Colors {
    primary = '#10B981',
    primaryDark = '#059669',
    primaryLight = '#34D399',
    background = '#F9FAFB',
    backgroundDark = '#111827',
    text = '#1F2937',
    textLight = '#6B7280',
    white = '#FFFFFF',
    theme = '#10B981',
    secondary = '#E0F2F1',
    tertiary = '#00695C',
    secondary_light='#F0FDF4',
    iosColor='#10B981',
    
    glass_bg = 'rgba(255, 255, 255, 0.25)',
    glass_border = 'rgba(255, 255, 255, 0.4)',
    glass_shadow = 'rgba(0, 0, 0, 0.1)',
    
    gradient_start = '#10B981',
    gradient_middle = '#34D399',
    gradient_end = '#6EE7B7',
    
    success = '#10B981',
    error = '#EF4444',
    warning = '#F59E0B',
    info = '#3B82F6'
}


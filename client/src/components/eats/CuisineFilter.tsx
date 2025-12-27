import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from '../shared/CustomText';
import { Colors } from '@/utils/Constants';

interface CuisineFilterProps {
  cuisines: string[];
  selectedCuisine: string;
  onSelect: (cuisine: string) => void;
}

const CuisineFilter: React.FC<CuisineFilterProps> = ({
  cuisines,
  selectedCuisine,
  onSelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {cuisines.map((cuisine) => {
        const isSelected = cuisine === selectedCuisine;
        return (
          <TouchableOpacity
            key={cuisine}
            style={[styles.chip, isSelected && styles.selectedChip]}
            onPress={() => onSelect(cuisine)}
            activeOpacity={0.8}
          >
            <CustomText
              fontFamily={isSelected ? 'SemiBold' : 'Regular'}
              fontSize={13}
              style={[styles.chipText, isSelected && styles.selectedChipText]}
            >
              {cuisine}
            </CustomText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: Colors.text,
  },
  chipText: {
    color: Colors.textLight,
  },
  selectedChipText: {
    color: Colors.white,
  },
});

export default CuisineFilter;


import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from './CustomText';
import { Colors, screenWidth } from '@/utils/Constants';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
  title?: string;
  subtitle?: string;
}

const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  onSubmit,
  title = 'Rate your experience',
  subtitle = 'How was it?',
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, feedback);
    setRating(0);
    setFeedback('');
  };

  const renderStar = (index: number) => {
    const filled = index <= rating;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => setRating(index)}
        style={styles.starButton}
      >
        <Ionicons
          name={filled ? 'star' : 'star-outline'}
          size={RFValue(32)}
          color={filled ? '#FFC107' : Colors.textLight}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={RFValue(22)} color={Colors.text} />
            </TouchableOpacity>

          <View style={styles.content}>
            <CustomText fontFamily="SemiBold" fontSize={20} style={styles.title}>
              {title}
                </CustomText>
            <CustomText fontFamily="Regular" fontSize={14} style={styles.subtitle}>
              {subtitle}
              </CustomText>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map(renderStar)}
            </View>

            {rating > 0 && (
              <CustomText fontFamily="Medium" fontSize={14} style={styles.ratingText}>
                {rating === 1
                  ? 'Poor'
                  : rating === 2
                  ? 'Fair'
                  : rating === 3
                  ? 'Good'
                  : rating === 4
                  ? 'Very Good'
                  : 'Excellent'}
                </CustomText>
            )}

                <TextInput
              style={styles.feedbackInput}
              placeholder="Add a comment (optional)"
              placeholderTextColor={Colors.textLight}
                  value={feedback}
                  onChangeText={setFeedback}
                  multiline
                  numberOfLines={3}
            />

              <TouchableOpacity
              style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={rating === 0}
              >
              <CustomText fontFamily="SemiBold" fontSize={16} style={styles.submitButtonText}>
                Submit Rating
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: screenWidth - 40,
    maxWidth: 400,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    color: Colors.primary,
    marginBottom: 20,
  },
  feedbackInput: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: Colors.text,
    textAlignVertical: 'top',
    minHeight: 80,
    marginBottom: 20,
  },
  submitButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: Colors.white,
  },
});

export default RatingModal;

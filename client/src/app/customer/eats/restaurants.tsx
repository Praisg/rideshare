import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@/components/shared/CustomText';
import RestaurantCard from '@/components/eats/RestaurantCard';
import CuisineFilter from '@/components/eats/CuisineFilter';
import { Colors, screenWidth } from '@/utils/Constants';
import { getRestaurants, getCuisines } from '@/service/eatsService';
import { useEatsStore } from '@/store/eatsStore';

const RestaurantsScreen = () => {
  const {
    restaurants,
    cuisines,
    filters,
    isLoading,
    setRestaurants,
    setCuisines,
    setFilters,
    setLoading,
  } = useEatsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    const result = await getRestaurants({
      cuisine: filters.cuisine !== 'All' ? filters.cuisine : undefined,
      search: searchQuery || undefined,
    });
    if (result.success) {
      setRestaurants(result.restaurants);
    }
    setLoading(false);
  }, [filters.cuisine, searchQuery]);

  const fetchCuisines = useCallback(async () => {
    const result = await getCuisines();
    if (result.success) {
      setCuisines(result.cuisines);
    }
  }, []);

  useEffect(() => {
    fetchCuisines();
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [filters.cuisine]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRestaurants();
    setRefreshing(false);
  };

  const handleSearch = () => {
    fetchRestaurants();
  };

  const handleRestaurantPress = (restaurantId: string) => {
    router.push(`/customer/eats/${restaurantId}`);
  };

  const featuredRestaurants = restaurants.filter((r) => r.featured);
  const allRestaurants = restaurants;

  const renderHeader = () => (
    <View>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={RFValue(18)} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => { setSearchQuery(''); fetchRestaurants(); }}>
              <Ionicons name="close-circle" size={RFValue(18)} color={Colors.textLight} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <CuisineFilter
        cuisines={cuisines}
        selectedCuisine={filters.cuisine}
        onSelect={(cuisine) => setFilters({ cuisine })}
      />

      {featuredRestaurants.length > 0 && (
        <View style={styles.section}>
          <CustomText fontFamily="SemiBold" fontSize={18} style={styles.sectionTitle}>
            Featured
          </CustomText>
          <FlatList
            horizontal
            data={featuredRestaurants}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.featuredCard}
                onPress={() => handleRestaurantPress(item._id)}
              >
                <View style={styles.featuredImageContainer}>
                  {item.imageUrl ? (
                    <View style={[styles.featuredImage, { backgroundColor: '#F3F4F6' }]}>
                      <Ionicons name="restaurant" size={40} color={Colors.textLight} />
                    </View>
                  ) : (
                    <View style={[styles.featuredImage, { backgroundColor: '#F3F4F6' }]}>
                      <Ionicons name="restaurant" size={40} color={Colors.textLight} />
                    </View>
                  )}
                </View>
                <View style={styles.featuredContent}>
                  <CustomText fontFamily="SemiBold" fontSize={14} numberOfLines={1}>
                    {item.name}
                  </CustomText>
                  <View style={styles.featuredInfo}>
                    <Ionicons name="star" size={RFValue(12)} color="#FFC107" />
                    <CustomText fontFamily="Regular" fontSize={12} style={styles.featuredRating}>
                      {item.rating.toFixed(1)}
                    </CustomText>
                    <CustomText fontFamily="Regular" fontSize={12} style={styles.featuredDot}>
                      {' '} {item.preparationTime || 25}-{(item.preparationTime || 25) + 15} min
                    </CustomText>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <View style={styles.section}>
        <CustomText fontFamily="SemiBold" fontSize={18} style={styles.sectionTitle}>
          All Restaurants
        </CustomText>
      </View>
    </View>
  );

  const renderRestaurant = ({ item, index }: { item: any; index: number }) => (
    <View style={[styles.cardWrapper, index % 2 === 0 ? { marginRight: 8 } : { marginLeft: 8 }]}>
      <RestaurantCard
        restaurant={item}
        onPress={() => handleRestaurantPress(item._id)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.white} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={RFValue(20)} color={Colors.text} />
        </TouchableOpacity>
        <CustomText fontFamily="SemiBold" fontSize={18}>
          Restaurants
        </CustomText>
        <View style={styles.backButton} />
      </View>

      <FlatList
        data={allRestaurants}
        keyExtractor={(item) => item._id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        renderItem={renderRestaurant}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={60} color={Colors.textLight} />
            <CustomText fontFamily="Medium" fontSize={16} style={styles.emptyText}>
              No restaurants found
            </CustomText>
            <CustomText fontFamily="Regular" fontSize={14} style={styles.emptySubtext}>
              Try adjusting your filters
            </CustomText>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 12,
    color: Colors.text,
  },
  featuredList: {
    paddingHorizontal: 20,
  },
  featuredCard: {
    width: screenWidth * 0.6,
    marginRight: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredImageContainer: {
    height: 120,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredContent: {
    padding: 12,
  },
  featuredInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  featuredRating: {
    marginLeft: 4,
    color: Colors.text,
  },
  featuredDot: {
    color: Colors.textLight,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  cardWrapper: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    color: Colors.textLight,
    marginTop: 4,
  },
});

export default RestaurantsScreen;


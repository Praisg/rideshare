import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import {
  mockRestaurants,
  mockMenuItems,
  getRestaurantById as getMockRestaurantById,
  getMenuByRestaurantId as getMockMenuByRestaurantId,
  searchRestaurants as searchMockRestaurants,
  filterRestaurants as filterMockRestaurants,
} from '../utils/mockEatsData.js';

const USE_MOCK_DATA = true;

export const getRestaurants = async (req, res) => {
  try {
    const { cuisine, isOpen, featured, minRating, priceRange, search } = req.query;

    if (USE_MOCK_DATA) {
      let results;
      
      if (search) {
        results = searchMockRestaurants(search);
      } else {
        results = filterMockRestaurants({
          cuisine,
          isOpen: isOpen === 'true' ? true : isOpen === 'false' ? false : undefined,
          featured: featured === 'true',
          minRating: minRating ? parseFloat(minRating) : undefined,
          priceRange,
        });
      }

      return res.status(200).json({
        success: true,
        count: results.length,
        restaurants: results,
      });
    }

    const query = { status: 'active' };

    if (cuisine && cuisine !== 'All') {
      query.cuisine = { $in: [cuisine] };
    }

    if (isOpen !== undefined) {
      query.isOpen = isOpen === 'true';
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (priceRange) {
      query.priceRange = priceRange;
    }

    const restaurants = await Restaurant.find(query).sort({ featured: -1, rating: -1 });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to fetch restaurants',
      error: error.message,
    });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (USE_MOCK_DATA) {
      const restaurant = getMockRestaurantById(id);
      
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          msg: 'Restaurant not found',
        });
      }

      return res.status(200).json({
        success: true,
        restaurant,
      });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        msg: 'Restaurant not found',
      });
    }

    res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to fetch restaurant',
      error: error.message,
    });
  }
};

export const getRestaurantMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.query;

    if (USE_MOCK_DATA) {
      let menuItems = getMockMenuByRestaurantId(id);

      if (category) {
        menuItems = menuItems.filter(
          (item) => item.category.toLowerCase() === category.toLowerCase()
        );
      }

      const categories = [...new Set(getMockMenuByRestaurantId(id).map((item) => item.category))];

      return res.status(200).json({
        success: true,
        count: menuItems.length,
        categories,
        menuItems,
      });
    }

    const query = { restaurantId: id, isAvailable: true };

    if (category) {
      query.category = category;
    }

    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });

    const categories = await MenuItem.distinct('category', { restaurantId: id });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      categories,
      menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to fetch menu',
      error: error.message,
    });
  }
};

export const searchRestaurants = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        msg: 'Search query is required',
      });
    }

    if (USE_MOCK_DATA) {
      const results = searchMockRestaurants(q);
      return res.status(200).json({
        success: true,
        count: results.length,
        restaurants: results,
      });
    }

    const restaurants = await Restaurant.find(
      { $text: { $search: q }, status: 'active' },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Search failed',
      error: error.message,
    });
  }
};

export const createRestaurant = async (req, res) => {
  try {
    const restaurantData = req.body;

    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();

    res.status(201).json({
      success: true,
      msg: 'Restaurant created successfully',
      restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to create restaurant',
      error: error.message,
    });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        msg: 'Restaurant not found',
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Restaurant updated successfully',
      restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to update restaurant',
      error: error.message,
    });
  }
};

export const toggleRestaurantStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (USE_MOCK_DATA) {
      const restaurant = getMockRestaurantById(id);
      if (restaurant) {
        restaurant.isOpen = !restaurant.isOpen;
        return res.status(200).json({
          success: true,
          msg: `Restaurant is now ${restaurant.isOpen ? 'open' : 'closed'}`,
          isOpen: restaurant.isOpen,
        });
      }
      return res.status(404).json({
        success: false,
        msg: 'Restaurant not found',
      });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        msg: 'Restaurant not found',
      });
    }

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    res.status(200).json({
      success: true,
      msg: `Restaurant is now ${restaurant.isOpen ? 'open' : 'closed'}`,
      isOpen: restaurant.isOpen,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to toggle restaurant status',
      error: error.message,
    });
  }
};

export const addMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItemData = { ...req.body, restaurantId: id };

    const menuItem = new MenuItem(menuItemData);
    await menuItem.save();

    res.status(201).json({
      success: true,
      msg: 'Menu item added successfully',
      menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to add menu item',
      error: error.message,
    });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const updates = req.body;

    const menuItem = await MenuItem.findOneAndUpdate(
      { _id: itemId, restaurantId: id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        msg: 'Menu item not found',
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Menu item updated successfully',
      menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to update menu item',
      error: error.message,
    });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;

    const menuItem = await MenuItem.findOneAndDelete({
      _id: itemId,
      restaurantId: id,
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        msg: 'Menu item not found',
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Menu item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to delete menu item',
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    if (USE_MOCK_DATA) {
      const categories = [...new Set(mockMenuItems.map((item) => item.category))];
      return res.status(200).json({
        success: true,
        categories,
      });
    }

    const categories = await MenuItem.distinct('category');

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to fetch categories',
      error: error.message,
    });
  }
};

export const getCuisines = async (req, res) => {
  try {
    if (USE_MOCK_DATA) {
      const cuisines = [...new Set(mockRestaurants.flatMap((r) => r.cuisine))];
      return res.status(200).json({
        success: true,
        cuisines: ['All', ...cuisines],
      });
    }

    const cuisines = await Restaurant.distinct('cuisine');

    res.status(200).json({
      success: true,
      cuisines: ['All', ...cuisines],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to fetch cuisines',
      error: error.message,
    });
  }
};


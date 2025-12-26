import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";
import {
  reverseGeocode,
  getPlacesSuggestions,
  getPlaceDetails,
} from "../utils/mapUtils.js";

export const reverseGeocodeLocation = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    throw new BadRequestError("Latitude and longitude are required");
  }

  try {
    const address = await reverseGeocode(
      parseFloat(latitude),
      parseFloat(longitude)
    );

    if (!address) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Address not found",
        address: "",
      });
    }

    res.status(StatusCodes.OK).json({
      message: "Address retrieved successfully",
      address,
    });
  } catch (error) {
    console.error("Reverse geocode error:", error);
    throw new BadRequestError("Failed to retrieve address");
  }
};

export const getAutocompleteSuggestions = async (req, res) => {
  const { query, latitude, longitude } = req.query;

  if (!query) {
    throw new BadRequestError("Query is required");
  }

  try {
    const location =
      latitude && longitude
        ? { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
        : null;

    const suggestions = await getPlacesSuggestions(query, location);

    res.status(StatusCodes.OK).json({
      message: "Suggestions retrieved successfully",
      suggestions,
    });
  } catch (error) {
    console.error("Autocomplete error:", error);
    throw new BadRequestError("Failed to retrieve suggestions");
  }
};

export const getLocationDetails = async (req, res) => {
  const { placeId } = req.query;

  if (!placeId) {
    throw new BadRequestError("Place ID is required");
  }

  try {
    const details = await getPlaceDetails(placeId);

    if (!details) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Place details not found",
      });
    }

    res.status(StatusCodes.OK).json({
      message: "Place details retrieved successfully",
      details,
    });
  } catch (error) {
    console.error("Place details error:", error);
    throw new BadRequestError("Failed to retrieve place details");
  }
};


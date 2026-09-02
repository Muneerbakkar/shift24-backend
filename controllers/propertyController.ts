import { Request, Response } from 'express';
import { Property } from '../models/Property.js';
import cloudinary from '../config/cloudinary.js';

const getImagesFromRequest = (req: Request) => {
  let images: string[] = [];
  
  if (req.body.existingImages) {
    if (Array.isArray(req.body.existingImages)) {
      images = [...req.body.existingImages];
    } else {
      images.push(req.body.existingImages);
    }
  }

  if (req.files && Array.isArray(req.files)) {
    images = [...images, ...req.files.map((file: any) => file.path)];
  }
  
  return images;
};

const extractPublicId = (url: string) => {
  const parts = url.split('/');
  const uploadIndex = parts.findIndex(p => p === 'upload');
  if (uploadIndex === -1) return null;
  
  let startIndex = uploadIndex + 1;
  if (parts[startIndex].match(/^v\d+$/)) {
    startIndex++;
  }
  const publicIdWithExt = parts.slice(startIndex).join('/');
  const lastDotIndex = publicIdWithExt.lastIndexOf('.');
  return lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;
};

export const getProperties = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const createProperty = async (req: Request, res: Response) => {
  try {
    const propertyData = { ...req.body };
    propertyData.images = getImagesFromRequest(req);
    
    if (!propertyData.images.length && !propertyData.images_are_empty) {
        // Just in case, default image if none provided
        propertyData.images = ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"];
    }

    // Clean empty strings for numeric and date fields to prevent CastErrors
    const fieldsToClean = ['bhk', 'area', 'deposit', 'bathrooms', 'floorNumber', 'totalFloors', 'leaseDuration', 'lockInPeriod', 'roadWidth', 'availableFrom'];
    fieldsToClean.forEach(field => {
      if (propertyData[field] === '') {
        propertyData[field] = null;
      }
    });

    const property = new Property(propertyData);
    const savedProperty = await property.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(400).json({ message: "Error creating property", error });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const propertyData = { ...req.body };
    const images = getImagesFromRequest(req);
    if (images.length > 0 || propertyData.images_cleared === 'true') {
        propertyData.images = images;
    }

    // Clean empty strings for numeric and date fields to prevent CastErrors
    const fieldsToClean = ['bhk', 'area', 'deposit', 'bathrooms', 'floorNumber', 'totalFloors', 'leaseDuration', 'lockInPeriod', 'roadWidth', 'availableFrom'];
    fieldsToClean.forEach(field => {
      if (propertyData[field] === '') {
        propertyData[field] = null;
      }
    });

    const property = await Property.findByIdAndUpdate(req.params.id, propertyData, { new: true });
    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }
    res.json(property);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(400).json({ message: "Error updating property", error });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }
    
    // Delete images from Cloudinary
    if (property.images && Array.isArray(property.images)) {
        for (const url of property.images) {
            const publicId = extractPublicId(url);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (e) {
                    console.error("Error deleting image from Cloudinary:", e);
                }
            }
        }
    }

    res.json({ message: "Property deleted" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(400).json({ message: "Error deleting property", error });
  }
};

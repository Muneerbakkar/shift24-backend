import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  googleMapUrl: { type: String, required: false },
  price: { type: Number, required: true },
  priceLabel: { type: String, required: false },
  bhk: { type: Number, required: false },
  area: { type: Number, required: false },
  category: { type: String, enum: ['Rental', 'Sale', 'Lease', 'Room Sharing'], required: true, default: 'Rental' },
  type: { type: String, required: true }, // Sub-category
  description: { type: String, required: true },
  agentName: { type: String, required: true },
  agentPhone: { type: String, required: true },
  
  // New specific fields
  furnishing: { type: String, enum: ['Unfurnished', 'Semi-Furnished', 'Fully-Furnished'], required: false },
  preferredTenants: { type: String, required: false },
  suitableFor: { type: String, required: false },
  availableFrom: { type: Date, required: false },
  deposit: { type: Number, required: false }, // Numeric value
  depositLabel: { type: String, required: false }, // Formatted text e.g. ₹1,98,75,000
  extraCharges: { type: String, required: false }, // e.g. Water Charge, Electricity Bill
  
  // Location & Amenities
  nearestBusStop: { type: String, required: false },
  nearestMetro: { type: String, required: false },
  includedFacilities: { type: String, required: false }, // Store as text, comma separated or list
  
  // Additional Info
  propertyTags: { type: String, required: false },
  ownerNote: { type: String, required: false },
  
  ageOfProperty: { type: String, enum: ['Under Construction', 'New', '1-5 years', '5-10 years', '10+ years'], required: false },
  ownership: { type: String, enum: ['Freehold', 'Leasehold', 'Power of Attorney', 'Co-operative Society'], required: false },
  
  leaseDuration: { type: Number, required: false }, // In months
  lockInPeriod: { type: Number, required: false }, // In months
  
  bathrooms: { type: Number, required: false },
  parking: { type: String, required: false }, // Changed from Number to String for 'Bike Parking'
  floorNumber: { type: String, required: false }, // String to support 'Ground', 'First', etc. for Room Sharing
  totalFloors: { type: Number, required: false },
  
  boundaryWall: { type: Boolean, required: false },
  facing: { type: String, enum: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'], required: false },
  roadWidth: { type: Number, required: false },

  // Room Sharing specific fields
  roomType: { type: String, enum: ['Single', 'Shared'], required: false }, // Room Sharing
  lookingFor: { type: String, enum: ['Boys', 'Girls', 'Couple', 'Family'], required: false }, // Room Sharing
  occupancyCount: { type: Number, required: false }, // Number of people allowed
  occupied: { type: String, required: false }, // e.g. "1 person is currently living in the property"
  occupationPreference: { type: String, required: false }, // e.g. "Working Professional"
  ownerStaying: { type: Boolean, required: false, default: false }, // Room Sharing
  additionalInfo: { type: String, required: false }, // Room Sharing extra details

  status: { type: String, default: 'available' },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  images: [{ type: String }]
}, { timestamps: true });

propertySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

export const Property = mongoose.model('Property', propertySchema);

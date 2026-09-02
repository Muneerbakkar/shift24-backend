import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  propertyId: { type: String, required: true },
  propertyName: { type: String, required: true },
  propertyLocation: { type: String, required: true },
  tokenAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  bookedAt: { type: Date, default: Date.now },
    fullName: { type: String },
  whatsappNumber: { type: String },
  lookingFor: { type: String },
  companyName: { type: String },
  preferredDate: { type: String },
  preferredTime: { type: String },
  email: { type: String },
  phone: { type: String },
}, { timestamps: true });

enquirySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

export const Enquiry = mongoose.model('Enquiry', enquirySchema);

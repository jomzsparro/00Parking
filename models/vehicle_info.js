const mongoose = require('mongoose');
const moment = require('moment-timezone');

const vehicleInfoSchema = new mongoose.Schema({
  
  parking_number: {
    type: String,
    required: true
  },
  vehicle_category: {
    type: String,
    required: true,
  },
  registration_number: {
    type: String,
    required: true
  },
  intime: {
    type: Date,
    required: true,
    default: () => moment().tz('Asia/Manila').toDate()
},
  payment: {
    type: Number,
    required: true,
    default: 30
  },
  outime: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default:"parked"
  },
});


vehicleInfoSchema.pre('save', function(next) {
  if (this.isModified('intime') || this.isModified('outime')) {
      const intime = new Date(this.intime);
      const outime = this.outime ? new Date(this.outime) : new Date();
      const hoursParked = Math.ceil(Math.abs(outime - intime) / (1000 * 60 * 60)); // Round up to the nearest hour
      let rate = 0;

      // Determine rate based on vehicle category
      switch (this.vehicle_category) {
          case 'SP':
              rate = 20;
              break;
          case 'MP':
              rate = 60;
              break;
          case 'LP':
              rate = 100;
              break;
          default:
              rate = 0; // Default rate if category not specified
      }

      // Check if the vehicle left and returned within one hour
      const oneHourDifference = Math.abs(outime - intime) <= (1000 * 60 * 60);

      // Calculate payment
      let payment = 0;

      // If the vehicle left and returned within one hour, apply continuous rate
      if (oneHourDifference) {
          payment = rate;
      } else {
          // Calculate payment for full 24-hour chunks
          const fullChunks = Math.floor(hoursParked / 24);
          payment += fullChunks * 5000;

          // Calculate payment for remaining hours
          const remainingHours = hoursParked % 24;
          if (remainingHours <= 3) {
              payment += 40; // Flat rate for first 3 hours
          } else {
              payment += 40; // Flat rate for first 3 hours
              payment += (remainingHours - 3) * rate; // Additional rate for remaining hours
          }
      }

      // Update payment field
      this.payment = payment;
  }
  next();
});





const Vehicle_InfoDB = mongoose.model('vehicle_infodb', vehicleInfoSchema);
module.exports = Vehicle_InfoDB;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const reservationSchema = new mongoose_1.Schema({
    businessId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Hotel',
    },
    businessType: {
        type: String,
        enum: ['hotel', 'restaurant', 'salon'],
    },
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    customerInfo: {
        name: { type: String, },
        email: { type: String, },
        phone: { type: String, }
    },
    roomId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Room'
    },
    checkIn: Date,
    checkOut: Date,
    guests: Number,
    tableId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Table'
    },
    partySize: Number,
    serviceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Service'
    },
    staffId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Staff'
    },
    date: { type: Date, },
    time: String,
    duration: Number,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
        default: 'pending'
    },
    totalAmount: Number,
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    notes: String,
    specialRequests: String,
    reminderSent: {
        type: Boolean,
        default: false
    },
    source: {
        type: String,
        enum: ['website', 'phone', 'walk-in', 'admin'],
        default: 'website'
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Reservation', reservationSchema);
//# sourceMappingURL=ReservationModel.js.map
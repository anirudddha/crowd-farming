const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for an individual image within an update
const TimelineImageSchema = new Schema({
    url: { type: String, required: true },
    public_id: { type: String, required: true }
});

// Schema for a single update event (e.g., "Planted 500 trees")
const TimelineUpdateSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    images: [TimelineImageSchema]
}, { timestamps: true });

// The main schema for the "Timelines" collection
// Each document in this collection belongs to ONE campaign.
const TimelineSchema = new Schema({
    // **Crucial Link**: A unique reference to the parent Campaign.
    // This ensures one timeline document per campaign.
    campaign: {
        type: Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true,
        unique: true, // This is the key! It enforces only one timeline per campaignId.
        index: true
    },
    // The array containing all update events for that campaign
    updates: [TimelineUpdateSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Timeline', TimelineSchema);
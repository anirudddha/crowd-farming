const Campaign = require('../models/Campaign');
const Timeline = require('../models/timelineUpdateModel'); // Import the new model
const cloudinary = require('../config/cloudinary');

// Helper function to upload images (no changes needed here)
const uploadImagesToCloudinary = async (files) => {
    const uploadPromises = files.map(file => {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "timeline_updates" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve({ url: result.secure_url, public_id: result.public_id });
                }
            );
            uploadStream.end(file.buffer);
        });
    });
    return Promise.all(uploadPromises);
};

// This helper function is key. It finds the timeline doc or creates a new one.
const findOrCreateTimeline = async (campaignId) => {
    let timelineDoc = await Timeline.findOne({ campaign: campaignId });

    if (!timelineDoc) {
        // If it doesn't exist, create it and link it to the campaign
        timelineDoc = new Timeline({ campaign: campaignId, updates: [] });
        await timelineDoc.save();

        // Also save the reference to the campaign document
        await Campaign.findByIdAndUpdate(campaignId, { timeline: timelineDoc._id });
    }

    return timelineDoc;
};


// Add this new function to your timelineController.js

// @desc    Get all timeline updates for a specific campaign
// @route   GET /api/campaigns/:id/timeline
exports.getTimeline = async (req, res) => {
    try {
        const campaignId = req.params.id;

        // Find the single timeline document that belongs to this campaign.
        const timelineDoc = await Timeline.findOne({ campaign: campaignId });

        // If no timeline document exists yet, it's not an error.
        // It just means no updates have been added. Return an empty array.
        if (!timelineDoc) {
            return res.status(200).json([]);
        }

        // Sort the updates by date in descending order (newest first)
        const sortedUpdates = timelineDoc.updates.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        res.status(200).json(sortedUpdates);

    } catch (error) {
        console.error('Error fetching timeline:', error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

// @desc    Add a new timeline update
// @route   POST /api/campaigns/:id/timeline-update
exports.addTimelineUpdate = async (req, res) => {
    try {
        const campaignId = req.params.id;

        // 1. Find the timeline document for this campaign, or create one if it doesn't exist.
        const timelineDoc = await findOrCreateTimeline(campaignId);

        let uploadedImages = [];
        if (req.files && req.files.length > 0) {
            uploadedImages = await uploadImagesToCloudinary(req.files);
        }

        // 2. Create the new update object
        const newUpdate = {
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            images: uploadedImages
        };

        // 3. Add the new update to the beginning of the 'updates' array
        timelineDoc.updates.unshift(newUpdate);

        // 4. Save the timeline document
        await timelineDoc.save();

        res.status(201).json(timelineDoc.updates[0]); // Return the newly added update

    } catch (error) {
        console.error('Error adding timeline update:', error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

// @desc    Delete a timeline update
// @route   DELETE /api/campaigns/:campaignId/timeline-update/:updateId
exports.deleteTimelineUpdate = async (req, res) => {
    try {
        const { campaignId, updateId } = req.params;

        // 1. Find the parent timeline document
        const timelineDoc = await Timeline.findOne({ campaign: campaignId });

        if (!timelineDoc) {
            return res.status(404).json({ msg: 'Timeline not found for this campaign.' });
        }

        // 2. Find the sub-document to get its details (like image IDs)
        const updateToDelete = timelineDoc.updates.id(updateId);

        if (!updateToDelete) {
            return res.status(404).json({ msg: 'Specific update not found.' });
        }

        // 3. Delete images from Cloudinary (this part is still correct)
        if (updateToDelete.images && updateToDelete.images.length > 0) {
            const publicIds = updateToDelete.images.map(img => img.public_id);
            await cloudinary.api.delete_resources(publicIds);
        }

        // 4. --- THE FIX ---
        // Instead of calling .remove() on the sub-document,
        // call .pull() on the parent array to remove the item.
        timelineDoc.updates.pull(updateId);

        // 5. Save the parent document to persist the change.
        await timelineDoc.save();

        res.json({ msg: 'Timeline update removed successfully' });

    } catch (error) {
        console.error('Error deleting timeline update:', error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

// REPLACE your old updateTimelineUpdate function with this corrected one.

// @desc    Update an existing timeline update
// @route   PUT /api/campaigns/:campaignId/timeline-update/:updateId
exports.updateTimelineUpdate = async (req, res) => {
    try {
        const { campaignId, updateId } = req.params;
        const { title, description, date } = req.body;

        // 1. Find the parent timeline document first.
        const timelineDoc = await Timeline.findOne({ campaign: campaignId });

        if (!timelineDoc) {
            return res.status(404).json({ msg: 'Timeline not found for this campaign.' });
        }

        // 2. Find the specific sub-document (the update) within the 'updates' array.
        const updateToModify = timelineDoc.updates.id(updateId);

        if (!updateToModify) {
            return res.status(404).json({ msg: 'Specific update not found.' });
        }

        // 3. Modify the fields of the sub-document.
        if (title) updateToModify.title = title;
        if (description) updateToModify.description = description;
        if (date) updateToModify.date = date;

        // 4. Save the parent document. This will persist the changes to the sub-document.
        await timelineDoc.save();

        // 5. Return the modified update object.
        res.json(updateToModify);

    } catch (error) {
        console.error('Error updating timeline update:', error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};
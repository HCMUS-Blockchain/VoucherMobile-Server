const Notification = require('../models/notification');
exports.addNotification = async (req, res) => {
    try {
        const userID = req.user._id;
        if (!userID) return res.status(400).send({success: false, message: 'User not found'});
        const {image, message} = req.body;
        const newNotification = new Notification({userID, image, message, date: new Date(), seen: false});
        await newNotification.save();
        res.status(201).send({success: true, message: 'Notification added successfully'});
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
        throw new Error(e.message);
    }
}

exports.getNotificationByUser = async (req, res) => {
    try {
        const userID = req.user._id;
        if (!userID) return res.status(400).send({success: false, message: 'User not found'});
        const notifications = await Notification.find({userID}).sort({date: -1});
        notifications.map((notification) => {
            notification.seen = true;
            notification.save();
        })
        res.status(200).send({success: true, message: 'Get all notifications successfully', notifications});
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
        throw new Error(e.message);
    }
}

exports.getNumberUnSeenByUser = async (req, res) => {
    try {
        const userID = req.user._id;
        if (!userID) return res.status(400).send({success: false, message: 'User not found'});
        const notifications = await Notification.find({userID, seen: false}).sort({date: -1});
        const number = notifications.length;
        res.status(200).send({success: true, message: 'Get all notifications successfully', number});
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
        throw new Error(e.message);
    }
}

exports.getNumberUnSeenByListUser = async (req, res) => {
    try {
        const userID = req.user._id;
        if (!userID) return res.status(400).send({success: false, message: 'User not found'});
        const notifications = await Notification.find({userID, seen: false}).sort({date: -1});
        const listID = notifications.map((notification) => {
            return notification._id;
        })
        res.status(200).send({success: true, message: 'Get all notifications successfully', listID});
    } catch (e) {
        res.status(400).send({success: false, message: e.message});
        throw new Error(e.message);
    }
}

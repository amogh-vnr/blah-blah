const Review = require('../models/Review');
const Ride = require('../models/Ride');

exports.createReview = async (req, res, next) => {
  try {
    const { rideId, revieweeId, rating, tags, comment } = req.body;
    const reviewerId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    if (reviewerId === revieweeId) {
      return res.status(400).json({ success: false, message: 'You cannot review yourself' });
    }

    // Check if user already reviewed for this ride
    const existing = await Review.findOne({
      ride: rideId,
      reviewer: reviewerId,
      reviewee: revieweeId
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this trip' });
    }

    const review = await Review.create({
      ride: rideId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      rating: Number(rating),
      tags: tags || [],
      comment: comment || ''
    });

    const populated = await Review.findById(review._id)
      .populate('reviewer', 'name picture')
      .populate('reviewee', 'name picture');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.getUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ reviewee: userId })
      .populate('reviewer', 'name picture')
      .populate('ride', 'from to date')
      .sort({ createdAt: -1 });

    const totalRatings = reviews.length;
    const averageRating = totalRatings > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalRatings).toFixed(1)
      : '5.0';

    res.status(200).json({
      success: true,
      count: totalRatings,
      averageRating: Number(averageRating),
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

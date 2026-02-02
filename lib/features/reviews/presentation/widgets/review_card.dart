import 'package:flutter/material.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../../../../core/models/models.dart';

class ReviewCard extends StatelessWidget {
  final Review review;

  const ReviewCard({super.key, required this.review});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Reviewer info
            Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundImage: review.reviewer.profileImage != null
                      ? NetworkImage(review.reviewer.profileImage!)
                      : null,
                  child: review.reviewer.profileImage == null
                      ? Text(
                          review.reviewer.firstName[0].toUpperCase(),
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        )
                      : null,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            '${review.reviewer.firstName} ${review.reviewer.lastName}',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          if (review.reviewer.isVerified) ...[
                            const SizedBox(width: 4),
                            const Icon(
                              Icons.verified,
                              size: 16,
                              color: Colors.blue,
                            ),
                          ],
                        ],
                      ),
                      Text(
                        timeago.format(review.createdAt),
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                // Overall rating
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getRatingColor(review.rating),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.star,
                        size: 16,
                        color: Colors.white,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        review.rating.toStringAsFixed(1),
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            
            // Review comment
            Text(
              review.comment,
              style: const TextStyle(fontSize: 15),
            ),
            
            // Sub-ratings
            if (_hasSubRatings()) ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _buildSubRatings(),
              ),
            ],
          ],
        ),
      ),
    );
  }

  bool _hasSubRatings() {
    return review.cleanliness != null ||
        review.communication != null ||
        review.accuracy != null ||
        review.location != null ||
        review.valueForMoney != null;
  }

  List<Widget> _buildSubRatings() {
    final List<Widget> chips = [];
    
    if (review.cleanliness != null) {
      chips.add(_buildSubRatingChip('Cleanliness', review.cleanliness!));
    }
    if (review.communication != null) {
      chips.add(_buildSubRatingChip('Communication', review.communication!));
    }
    if (review.accuracy != null) {
      chips.add(_buildSubRatingChip('Accuracy', review.accuracy!));
    }
    if (review.location != null) {
      chips.add(_buildSubRatingChip('Location', review.location!));
    }
    if (review.valueForMoney != null) {
      chips.add(_buildSubRatingChip('Value', review.valueForMoney!));
    }
    
    return chips;
  }

  Widget _buildSubRatingChip(String label, double rating) {
    return Chip(
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 12),
          ),
          const SizedBox(width: 4),
          Text(
            rating.toStringAsFixed(1),
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
    );
  }

  Color _getRatingColor(double rating) {
    if (rating >= 4.5) return Colors.green;
    if (rating >= 3.5) return Colors.lightGreen;
    if (rating >= 2.5) return Colors.orange;
    return Colors.red;
  }
}

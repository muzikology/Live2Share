import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/api_service.dart';

class ReviewFormPage extends ConsumerStatefulWidget {
  final int accommodationId;
  final String accommodationName;

  const ReviewFormPage({
    super.key,
    required this.accommodationId,
    required this.accommodationName,
  });

  @override
  ConsumerState<ReviewFormPage> createState() => _ReviewFormPageState();
}

class _ReviewFormPageState extends ConsumerState<ReviewFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _commentController = TextEditingController();
  
  double _overallRating = 4.0;
  double _cleanliness = 4.0;
  double _communication = 4.0;
  double _accuracy = 4.0;
  double _location = 4.0;
  double _valueForMoney = 4.0;
  
  bool _isSubmitting = false;

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _submitReview() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      final apiService = ref.read(apiServiceProvider);
      await apiService.post(
        '/api/reviews/accommodations/${widget.accommodationId}',
        data: {
          'rating': _overallRating,
          'comment': _commentController.text.trim(),
          'cleanliness': _cleanliness,
          'communication': _communication,
          'accuracy': _accuracy,
          'location': _location,
          'valueForMoney': _valueForMoney,
        },
      );

      if (!mounted) return;
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Review submitted successfully!'),
          backgroundColor: Colors.green,
        ),
      );
      
      Navigator.of(context).pop(true); // Return true to indicate success
    } catch (e) {
      if (!mounted) return;
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to submit review: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Write a Review'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Property name
            Text(
              widget.accommodationName,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),

            // Overall Rating
            const Text(
              'Overall Rating',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            _buildRatingSlider(
              value: _overallRating,
              onChanged: (value) => setState(() => _overallRating = value),
              icon: Icons.star,
            ),
            const SizedBox(height: 24),

            // Cleanliness
            const Text(
              'Cleanliness',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 4),
            _buildRatingSlider(
              value: _cleanliness,
              onChanged: (value) => setState(() => _cleanliness = value),
              icon: Icons.cleaning_services,
            ),
            const SizedBox(height: 16),

            // Communication
            const Text(
              'Communication',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 4),
            _buildRatingSlider(
              value: _communication,
              onChanged: (value) => setState(() => _communication = value),
              icon: Icons.chat_bubble_outline,
            ),
            const SizedBox(height: 16),

            // Accuracy
            const Text(
              'Accuracy',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 4),
            _buildRatingSlider(
              value: _accuracy,
              onChanged: (value) => setState(() => _accuracy = value),
              icon: Icons.check_circle_outline,
            ),
            const SizedBox(height: 16),

            // Location
            const Text(
              'Location',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 4),
            _buildRatingSlider(
              value: _location,
              onChanged: (value) => setState(() => _location = value),
              icon: Icons.location_on_outlined,
            ),
            const SizedBox(height: 16),

            // Value for Money
            const Text(
              'Value for Money',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 4),
            _buildRatingSlider(
              value: _valueForMoney,
              onChanged: (value) => setState(() => _valueForMoney = value),
              icon: Icons.attach_money,
            ),
            const SizedBox(height: 24),

            // Comment
            const Text(
              'Your Review',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _commentController,
              maxLines: 6,
              maxLength: 1000,
              decoration: const InputDecoration(
                hintText: 'Share your experience with this accommodation...',
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please write a review';
                }
                if (value.trim().length < 10) {
                  return 'Review must be at least 10 characters';
                }
                return null;
              },
            ),
            const SizedBox(height: 24),

            // Submit button
            ElevatedButton(
              onPressed: _isSubmitting ? null : _submitReview,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
              ),
              child: _isSubmitting
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : const Text(
                      'Submit Review',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRatingSlider({
    required double value,
    required ValueChanged<double> onChanged,
    required IconData icon,
  }) {
    return Row(
      children: [
        Icon(icon, color: Colors.amber, size: 24),
        const SizedBox(width: 8),
        Expanded(
          child: Slider(
            value: value,
            min: 1,
            max: 5,
            divisions: 8,
            label: value.toStringAsFixed(1),
            onChanged: onChanged,
          ),
        ),
        Container(
          width: 48,
          alignment: Alignment.center,
          child: Text(
            value.toStringAsFixed(1),
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ],
    );
  }
}

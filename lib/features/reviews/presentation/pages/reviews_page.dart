import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/models/models.dart';
import '../../../../core/services/api_service.dart';
import '../widgets/review_card.dart';
import '../widgets/review_summary.dart';
import 'review_form_page.dart';

class ReviewsPage extends ConsumerStatefulWidget {
  final int accommodationId;
  final String accommodationName;

  const ReviewsPage({
    super.key,
    required this.accommodationId,
    required this.accommodationName,
  });

  @override
  ConsumerState<ReviewsPage> createState() => _ReviewsPageState();
}

class _ReviewsPageState extends ConsumerState<ReviewsPage> {
  List<Review> _reviews = [];
  ReviewSummaryData? _summary;
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadReviews();
  }

  Future<void> _loadReviews() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final apiService = ref.read(apiServiceProvider);
      final response = await apiService.get(
        '/api/reviews/accommodations/${widget.accommodationId}',
      );

      if (!mounted) return;

      setState(() {
        _reviews = (response.data['reviews'] as List)
            .map((json) => Review.fromJson(json))
            .toList();
        _summary = ReviewSummaryData.fromJson(response.data['summary']);
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _addReview() async {
    final result = await Navigator.push<bool>(
      context,
      MaterialPageRoute(
        builder: (context) => ReviewFormPage(
          accommodationId: widget.accommodationId,
          accommodationName: widget.accommodationName,
        ),
      ),
    );

    if (result == true) {
      _loadReviews(); // Reload reviews after adding a new one
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reviews'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_comment),
            onPressed: _addReview,
            tooltip: 'Write a review',
          ),
        ],
      ),
      body: _buildBody(),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _addReview,
        icon: const Icon(Icons.rate_review),
        label: const Text('Write Review'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              'Failed to load reviews',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _error!,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[500],
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _loadReviews,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (_reviews.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.rate_review_outlined, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              'No reviews yet',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Be the first to review this property!',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[500],
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadReviews,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Summary card
          if (_summary != null)
            ReviewSummary(
              averageRating: _summary!.averageRating,
              totalReviews: _summary!.totalReviews,
            ),
          const SizedBox(height: 24),

          // Reviews title
          Text(
            'Reviews (${_reviews.length})',
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),

          // Reviews list
          ..._reviews.map((review) => ReviewCard(review: review)),
          
          // Space for FAB
          const SizedBox(height: 80),
        ],
      ),
    );
  }
}

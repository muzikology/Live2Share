import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:student_share/core/models/models.dart';
import 'package:student_share/core/services/api_service.dart';
import 'package:cached_network_image/cached_network_image.dart';

class PropertyDetailsPage extends ConsumerStatefulWidget {
  final int accommodationId;

  const PropertyDetailsPage({
    super.key,
    required this.accommodationId,
  });

  @override
  ConsumerState<PropertyDetailsPage> createState() => _PropertyDetailsPageState();
}

class _PropertyDetailsPageState extends ConsumerState<PropertyDetailsPage> {
  Accommodation? _accommodation;
  bool _isLoading = true;
  bool _isFavorite = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadAccommodation();
  }

  Future<void> _loadAccommodation() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final apiService = ref.read(apiServiceProvider);
      final response = await apiService.dio.get('/accommodations/${widget.accommodationId}');
      
      setState(() {
        _accommodation = Accommodation.fromJson(response.data);
        _isFavorite = _accommodation?.isFavorite ?? false;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _toggleFavorite() async {
    try {
      final apiService = ref.read(apiServiceProvider);
      final response = await apiService.dio.post(
        '/accommodations/${widget.accommodationId}/favorite',
      );
      
      setState(() {
        _isFavorite = response.data['isFavorite'];
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(_isFavorite ? 'Added to favorites' : 'Removed from favorites'),
            duration: const Duration(seconds: 2),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _contactLandlord() {
    if (_accommodation?.landlord != null) {
      context.push('/messages/conversation/${_accommodation!.landlord!.id}');
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_errorMessage != null) {
      return Scaffold(
        appBar: AppBar(),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              Text(_errorMessage!),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _loadAccommodation,
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    if (_accommodation == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Accommodation not found')),
      );
    }

    final accommodation = _accommodation!;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Image Gallery
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: accommodation.images != null && accommodation.images!.isNotEmpty
                  ? PageView.builder(
                      itemCount: accommodation.images!.length,
                      itemBuilder: (context, index) {
                        return CachedNetworkImage(
                          imageUrl: accommodation.images![index],
                          fit: BoxFit.cover,
                          placeholder: (context, url) => Container(
                            color: Colors.grey[300],
                            child: const Center(child: CircularProgressIndicator()),
                          ),
                          errorWidget: (context, url, error) => Container(
                            color: Colors.grey[300],
                            child: const Icon(Icons.image, size: 64),
                          ),
                        );
                      },
                    )
                  : Container(
                      color: Colors.grey[300],
                      child: const Icon(Icons.home, size: 64),
                    ),
            ),
            actions: [
              IconButton(
                onPressed: _toggleFavorite,
                icon: Icon(
                  _isFavorite ? Icons.favorite : Icons.favorite_border,
                  color: _isFavorite ? Colors.red : null,
                ),
              ),
              IconButton(
                onPressed: () {
                  // Share functionality
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Share feature coming soon')),
                  );
                },
                icon: const Icon(Icons.share),
              ),
            ],
          ),

          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title and Price
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Text(
                          accommodation.title,
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Theme.of(context).primaryColor,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          accommodation.priceDisplay,
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Location
                  Row(
                    children: [
                      const Icon(Icons.location_on, size: 20, color: Colors.grey),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          accommodation.locationDisplay,
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                color: Colors.grey[700],
                              ),
                        ),
                      ),
                      if (accommodation.distance != null) ...[
                        const SizedBox(width: 8),
                        Chip(
                          label: Text('${accommodation.distance} km away'),
                          backgroundColor: Colors.blue[50],
                          labelStyle: const TextStyle(fontSize: 12),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Quick Info Cards
                  Row(
                    children: [
                      _buildInfoCard(
                        context,
                        Icons.bed,
                        '${accommodation.availableRooms}',
                        'Rooms',
                      ),
                      const SizedBox(width: 12),
                      _buildInfoCard(
                        context,
                        Icons.bathroom,
                        '${accommodation.bathrooms}',
                        'Baths',
                      ),
                      const SizedBox(width: 12),
                      _buildInfoCard(
                        context,
                        Icons.home,
                        accommodation.accommodationType,
                        'Type',
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Description
                  Text(
                    'Description',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    accommodation.description,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 24),

                  // Amenities
                  if (accommodation.amenities != null && accommodation.amenities!.isNotEmpty) ...[
                    Text(
                      'Amenities',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        if (accommodation.hasWifi) _buildAmenityChip('WiFi', Icons.wifi),
                        if (accommodation.hasParking) _buildAmenityChip('Parking', Icons.local_parking),
                        if (accommodation.hasLaundry) _buildAmenityChip('Laundry', Icons.local_laundry_service),
                        if (accommodation.hasSecurity) _buildAmenityChip('Security', Icons.security),
                        if (accommodation.furnished) _buildAmenityChip('Furnished', Icons.chair),
                        if (accommodation.petsAllowed) _buildAmenityChip('Pets Allowed', Icons.pets),
                        ...accommodation.amenities!.map((amenity) => _buildAmenityChip(amenity, Icons.check_circle)),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Nearby Universities
                  if (accommodation.nearbyUniversities != null && accommodation.nearbyUniversities!.isNotEmpty) ...[
                    Text(
                      'Nearby Universities',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 12),
                    ...accommodation.nearbyUniversities!.map((uni) => Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Row(
                            children: [
                              const Icon(Icons.school, size: 20, color: Colors.blue),
                              const SizedBox(width: 8),
                              Expanded(child: Text(uni)),
                            ],
                          ),
                        )),
                    const SizedBox(height: 24),
                  ],

                  // Landlord Info
                  if (accommodation.landlord != null) ...[
                    Text(
                      'Listed By',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 12),
                    Card(
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundImage: accommodation.landlord!.profileImage != null
                              ? CachedNetworkImageProvider(accommodation.landlord!.profileImage!)
                              : null,
                          child: accommodation.landlord!.profileImage == null
                              ? Text(accommodation.landlord!.firstName[0])
                              : null,
                        ),
                        title: Row(
                          children: [
                            Text(accommodation.landlord!.fullName),
                            if (accommodation.landlord!.isVerified) ...[
                              const SizedBox(width: 4),
                              const Icon(Icons.verified, size: 16, color: Colors.blue),
                            ],
                          ],
                        ),
                        subtitle: Text(accommodation.landlord!.email),
                        trailing: IconButton(
                          icon: const Icon(Icons.message),
                          onPressed: _contactLandlord,
                        ),
                      ),
                    ),
                    const SizedBox(height: 80),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: _contactLandlord,
                  icon: const Icon(Icons.message),
                  label: const Text('Message'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    // Apply functionality
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Application feature coming soon')),
                    );
                  },
                  icon: const Icon(Icons.send),
                  label: const Text('Apply'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoCard(BuildContext context, IconData icon, String value, String label) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Icon(icon, size: 32, color: Theme.of(context).primaryColor),
              const SizedBox(height: 8),
              Text(
                value,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              Text(
                label,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Colors.grey[600],
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAmenityChip(String label, IconData icon) {
    return Chip(
      avatar: Icon(icon, size: 16),
      label: Text(label),
      backgroundColor: Colors.green[50],
    );
  }
}

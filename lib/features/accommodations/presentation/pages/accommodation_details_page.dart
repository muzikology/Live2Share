import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:student_share/core/models/accommodation.dart';
import 'package:student_share/core/models/student_user.dart';
import 'package:student_share/core/services/api_service.dart';
import 'package:student_share/features/accommodations/presentation/widgets/roommate_profiles_widget.dart';
import 'package:student_share/features/accommodations/presentation/widgets/application_form_widget.dart';
import 'package:student_share/features/accommodations/presentation/widgets/rent_calculator_widget.dart';
import 'package:cached_network_image/cached_network_image.dart';

final accommodationProvider = FutureProvider.family<Accommodation, int>((ref, id) async {
  return ApiService.getAccommodation(id);
});

final roommatesProvider = FutureProvider.family<List<StudentUser>, int>((ref, accommodationId) async {
  return ApiService.getRoommates(accommodationId);
});

class AccommodationDetailsPage extends ConsumerWidget {
  final int accommodationId;

  const AccommodationDetailsPage({
    super.key,
    required this.accommodationId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final accommodationAsync = ref.watch(accommodationProvider(accommodationId));
    final roommatesAsync = ref.watch(roommatesProvider(accommodationId));

    return Scaffold(
      body: accommodationAsync.when(
        data: (accommodation) => _buildContent(context, ref, accommodation, roommatesAsync),
        loading: () => const Scaffold(
          body: Center(child: CircularProgressIndicator()),
        ),
        error: (error, stack) => Scaffold(
          appBar: AppBar(
            title: const Text('Error'),
          ),
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 64, color: Colors.red),
                const SizedBox(height: 16),
                Text(
                  'Failed to load accommodation',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                const SizedBox(height: 8),
                Text(
                  error.toString(),
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => context.go('/accommodations'),
                  child: const Text('Back to Search'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildContent(
    BuildContext context,
    WidgetRef ref,
    Accommodation accommodation,
    AsyncValue<List<StudentUser>> roommatesAsync,
  ) {
    return CustomScrollView(
      slivers: [
        // App Bar with Image
        SliverAppBar(
          expandedHeight: 300,
          pinned: true,
          flexibleSpace: FlexibleSpaceBar(
            background: accommodation.images.isNotEmpty
                ? CachedNetworkImage(
                    imageUrl: accommodation.images.first,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      color: Colors.grey[300],
                      child: const Center(child: CircularProgressIndicator()),
                    ),
                    errorWidget: (context, url, error) => Container(
                      color: Colors.grey[300],
                      child: const Center(
                        child: Icon(Icons.image_not_supported, size: 64),
                      ),
                    ),
                  )
                : Container(
                    color: Colors.grey[300],
                    child: const Center(
                      child: Icon(Icons.home, size: 64, color: Colors.grey),
                    ),
                  ),
          ),
          actions: [
            IconButton(
              onPressed: () {
                // TODO: Add to favorites
              },
              icon: const Icon(Icons.favorite_border),
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
                // Title and Location
                Text(
                  accommodation.title,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.location_on, size: 20, color: Colors.grey),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        '${accommodation.address}, ${accommodation.area}, ${accommodation.city}',
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Tags and Info
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _buildInfoChip(accommodation.accommodationType.displayName),
                    _buildInfoChip('${accommodation.availableRooms}/${accommodation.totalRooms} rooms available'),
                    _buildInfoChip('${accommodation.bathrooms} bathroom${accommodation.bathrooms > 1 ? 's' : ''}'),
                  ],
                ),
                const SizedBox(height: 24),

                // Price Section
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'R${accommodation.monthlyRent.toStringAsFixed(0)}',
                                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                    fontWeight: FontWeight.bold,
                                    color: Theme.of(context).colorScheme.primary,
                                  ),
                                ),
                                Text(
                                  'per month',
                                  style: TextStyle(color: Colors.grey[600]),
                                ),
                                if (accommodation.deposit != null) ...[
                                  const SizedBox(height: 4),
                                  Text(
                                    'Deposit: R${accommodation.deposit!.toStringAsFixed(0)}',
                                    style: TextStyle(
                                      color: Colors.grey[600],
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                            ElevatedButton(
                              onPressed: () {
                                _showApplicationDialog(context, ref, accommodation);
                              },
                              child: const Text('Apply Now'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Description
                Text(
                  'Description',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  accommodation.description,
                  style: const TextStyle(height: 1.5),
                ),
                const SizedBox(height: 24),

                // Amenities
                Text(
                  'Amenities & Features',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                _buildAmenitiesSection(accommodation),
                const SizedBox(height: 24),

                // Universities
                if (accommodation.nearbyUniversities.isNotEmpty) ...[
                  Text(
                    'Nearby Universities',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...accommodation.nearbyUniversities.map((uni) => Padding(
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

                // Transport Links
                if (accommodation.transportLinks.isNotEmpty) ...[
                  Text(
                    'Transport Links',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...accommodation.transportLinks.map((transport) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          children: [
                            const Icon(Icons.directions_bus, size: 20, color: Colors.green),
                            const SizedBox(width: 8),
                            Expanded(child: Text(transport)),
                          ],
                        ),
                      )),
                  const SizedBox(height: 24),
                ],

                // House Rules
                if (accommodation.houseRules.isNotEmpty) ...[
                  Text(
                    'House Rules',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...accommodation.houseRules.map((rule) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('• ', style: TextStyle(fontSize: 16)),
                            Expanded(child: Text(rule)),
                          ],
                        ),
                      )),
                  const SizedBox(height: 24),
                ],

                // Rent Calculator
                RentCalculatorWidget(
                  totalRent: accommodation.monthlyRent,
                  totalRooms: accommodation.totalRooms,
                  occupiedRooms: accommodation.totalRooms - accommodation.availableRooms,
                ),
                const SizedBox(height: 24),

                // Current Roommates
                roommatesAsync.when(
                  data: (roommates) {
                    if (roommates.isNotEmpty) {
                      return RoommateProfilesWidget(roommates: roommates);
                    }
                    return const SizedBox.shrink();
                  },
                  loading: () => const Center(child: CircularProgressIndicator()),
                  error: (error, stack) => const SizedBox.shrink(),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoChip(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(16),
      ),
      child: Text(
        label,
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _buildAmenitiesSection(Accommodation accommodation) {
    final amenities = <Widget>[];

    if (accommodation.hasWifi) {
      amenities.add(_buildAmenityItem(Icons.wifi, 'WiFi Included'));
    }
    if (accommodation.hasParking) {
      amenities.add(_buildAmenityItem(Icons.local_parking, 'Parking Available'));
    }
    if (accommodation.petsAllowed) {
      amenities.add(_buildAmenityItem(Icons.pets, 'Pets Allowed'));
    }

    for (final amenity in accommodation.amenities) {
      amenities.add(_buildAmenityItem(Icons.check_circle, amenity));
    }

    return Column(children: amenities);
  }

  Widget _buildAmenityItem(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.green),
          const SizedBox(width: 8),
          Expanded(child: Text(text)),
        ],
      ),
    );
  }

  void _showApplicationDialog(BuildContext context, WidgetRef ref, Accommodation accommodation) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.9,
        maxChildSize: 0.9,
        minChildSize: 0.5,
        builder: (context, scrollController) => Container(
          padding: const EdgeInsets.all(16),
          child: ApplicationFormWidget(
            accommodationId: accommodation.id,
            scrollController: scrollController,
            onSuccess: () {
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Application submitted successfully!'),
                  backgroundColor: Colors.green,
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
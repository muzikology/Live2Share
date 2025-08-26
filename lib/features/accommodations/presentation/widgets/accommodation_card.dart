import 'package:flutter/material.dart';
import 'package:student_share/core/models/accommodation.dart';
import 'package:cached_network_image/cached_network_image.dart';

class AccommodationCard extends StatelessWidget {
  final Accommodation accommodation;
  final VoidCallback onTap;

  const AccommodationCard({
    super.key,
    required this.accommodation,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final rentPerRoom = accommodation.rentPerRoom;

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            Container(
              height: 200,
              width: double.infinity,
              color: Colors.grey[200],
              child: accommodation.images.isNotEmpty
                  ? CachedNetworkImage(
                      imageUrl: accommodation.images.first,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Container(
                        color: Colors.grey[200],
                        child: const Center(
                          child: CircularProgressIndicator(),
                        ),
                      ),
                      errorWidget: (context, url, error) => Container(
                        color: Colors.grey[200],
                        child: const Center(
                          child: Icon(
                            Icons.image_not_supported,
                            size: 48,
                            color: Colors.grey,
                          ),
                        ),
                      ),
                    )
                  : Container(
                      color: Colors.grey[200],
                      child: const Center(
                        child: Icon(
                          Icons.home,
                          size: 48,
                          color: Colors.grey,
                        ),
                      ),
                    ),
            ),

            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title and Location
                  Text(
                    accommodation.title,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on,
                        size: 16,
                        color: Colors.grey,
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          '${accommodation.area}, ${accommodation.city}',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: Colors.grey[600],
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Tags
                  Row(
                    children: [
                      _buildTag(accommodation.accommodationType.displayName),
                      const SizedBox(width: 8),
                      _buildTag('${accommodation.availableRooms}/${accommodation.totalRooms} available'),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Description
                  Text(
                    accommodation.description,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: Colors.grey[700],
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),

                  // Amenities
                  Row(
                    children: [
                      if (accommodation.hasWifi) ...[
                        const Icon(Icons.wifi, size: 16, color: Colors.green),
                        const SizedBox(width: 4),
                        const Text('WiFi', style: TextStyle(fontSize: 12)),
                        const SizedBox(width: 12),
                      ],
                      if (accommodation.hasParking) ...[
                        const Icon(Icons.local_parking, size: 16, color: Colors.blue),
                        const SizedBox(width: 4),
                        const Text('Parking', style: TextStyle(fontSize: 12)),
                        const SizedBox(width: 12),
                      ],
                      if (accommodation.petsAllowed) ...[
                        const Icon(Icons.pets, size: 16, color: Colors.orange),
                        const SizedBox(width: 4),
                        const Text('Pets OK', style: TextStyle(fontSize: 12)),
                      ],
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Universities
                  if (accommodation.nearbyUniversities.isNotEmpty) ...[
                    Text(
                      'Near:',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: Colors.grey[600],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Wrap(
                      spacing: 4,
                      children: accommodation.nearbyUniversities
                          .take(2)
                          .map((uni) => _buildUniversityTag(uni))
                          .toList(),
                    ),
                    const SizedBox(height: 12),
                  ],

                  // Price
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'R${accommodation.monthlyRent.toStringAsFixed(0)}',
                            style: theme.textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: theme.colorScheme.primary,
                            ),
                          ),
                          Text(
                            'per month',
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: Colors.grey[600],
                            ),
                          ),
                          if (rentPerRoom > 0) ...[
                            const SizedBox(height: 2),
                            Text(
                              '~R${rentPerRoom.toStringAsFixed(0)}/room',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: Colors.grey[500],
                              ),
                            ),
                          ],
                        ],
                      ),
                      ElevatedButton(
                        onPressed: onTap,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        ),
                        child: const Text('View Details'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTag(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _buildUniversityTag(String university) {
    final shortName = university
        .replaceAll('University of the ', '')
        .replaceAll('University of ', '')
        .replaceAll('University', 'Uni');

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.blue[300]!),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        shortName,
        style: TextStyle(
          fontSize: 10,
          color: Colors.blue[700],
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:student_share/core/models/accommodation.dart';
import 'package:student_share/core/services/api_service.dart';
import 'package:student_share/features/accommodations/presentation/widgets/accommodation_card.dart';
import 'package:student_share/features/accommodations/presentation/widgets/search_filters.dart';

final accommodationsProvider = FutureProvider.family<List<Accommodation>, SearchFilters?>((ref, filters) async {
  return ApiService.getAccommodations(
    city: filters?.location,
    accommodationType: filters?.accommodationType,
    minRent: filters?.minRent,
    maxRent: filters?.maxRent,
    availableRooms: filters?.availableRooms,
    university: filters?.university,
  );
});

class AccommodationsPage extends ConsumerStatefulWidget {
  const AccommodationsPage({super.key});

  @override
  ConsumerState<AccommodationsPage> createState() => _AccommodationsPageState();
}

class _AccommodationsPageState extends ConsumerState<AccommodationsPage> {
  SearchFilters? _currentFilters;

  @override
  Widget build(BuildContext context) {
    final accommodationsAsync = ref.watch(accommodationsProvider(_currentFilters));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Student Accommodation'),
        actions: [
          IconButton(
            onPressed: () => context.go('/list-accommodation'),
            icon: const Icon(Icons.add),
          ),
        ],
      ),
      body: Column(
        children: [
          SearchFiltersWidget(
            onFiltersChanged: (filters) {
              setState(() {
                _currentFilters = filters;
              });
            },
          ),
          Expanded(
            child: accommodationsAsync.when(
              data: (accommodations) {
                if (accommodations.isEmpty) {
                  return const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.search_off,
                          size: 64,
                          color: Colors.grey,
                        ),
                        SizedBox(height: 16),
                        Text(
                          'No accommodations found',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey,
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Try adjusting your search filters',
                          style: TextStyle(
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  );
                }

                return RefreshIndicator(
                  onRefresh: () async {
                    ref.invalidate(accommodationsProvider(_currentFilters));
                  },
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: accommodations.length,
                    itemBuilder: (context, index) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: AccommodationCard(
                          accommodation: accommodations[index],
                          onTap: () => context.go('/accommodation/${accommodations[index].id}'),
                        ),
                      );
                    },
                  ),
                );
              },
              loading: () => const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 16),
                    Text('Loading accommodations...'),
                  ],
                ),
              ),
              error: (error, stack) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      size: 64,
                      color: Colors.red,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Error loading accommodations',
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
                      onPressed: () => ref.invalidate(accommodationsProvider(_currentFilters)),
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class SearchFilters {
  final String? location;
  final String? accommodationType;
  final double? minRent;
  final double? maxRent;
  final int? availableRooms;
  final String? university;

  const SearchFilters({
    this.location,
    this.accommodationType,
    this.minRent,
    this.maxRent,
    this.availableRooms,
    this.university,
  });
}
import 'package:flutter/material.dart';
import 'package:student_share/features/accommodations/presentation/pages/accommodations_page.dart';

class SearchFiltersWidget extends StatefulWidget {
  final Function(SearchFilters?) onFiltersChanged;

  const SearchFiltersWidget({
    super.key,
    required this.onFiltersChanged,
  });

  @override
  State<SearchFiltersWidget> createState() => _SearchFiltersWidgetState();
}

class _SearchFiltersWidgetState extends State<SearchFiltersWidget> {
  final _locationController = TextEditingController();
  String? _selectedAccommodationType;
  String? _selectedUniversity;
  double? _minRent;
  double? _maxRent;
  int? _availableRooms;
  bool _isExpanded = false;

  final List<String> _accommodationTypes = [
    'house',
    'apartment',
    'commune',
    'backyard_room',
  ];

  final List<String> _universities = [
    'University of Cape Town',
    'University of the Witwatersrand',
    'University of KwaZulu-Natal',
    'Stellenbosch University',
    'University of Pretoria',
    'University of Johannesburg',
  ];

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.search, color: Colors.blue),
                const SizedBox(width: 8),
                Text(
                  'Find Your Perfect Student Accommodation',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const Spacer(),
                IconButton(
                  onPressed: () {
                    setState(() {
                      _isExpanded = !_isExpanded;
                    });
                  },
                  icon: Icon(
                    _isExpanded ? Icons.expand_less : Icons.expand_more,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Location Search (Always Visible)
            TextFormField(
              controller: _locationController,
              decoration: const InputDecoration(
                labelText: 'Location (City/Area)',
                hintText: 'e.g., Cape Town, Rosebank',
                prefixIcon: Icon(Icons.location_on),
              ),
              onChanged: (value) => _updateFilters(),
            ),

            if (_isExpanded) ...[
              const SizedBox(height: 16),

              // University Dropdown
              DropdownButtonFormField<String>(
                value: _selectedUniversity,
                decoration: const InputDecoration(
                  labelText: 'Near University',
                  prefixIcon: Icon(Icons.school),
                ),
                items: [
                  const DropdownMenuItem<String>(
                    value: null,
                    child: Text('Any University'),
                  ),
                  ..._universities.map((uni) => DropdownMenuItem<String>(
                        value: uni,
                        child: Text(_getShortUniversityName(uni)),
                      )),
                ],
                onChanged: (value) {
                  setState(() {
                    _selectedUniversity = value;
                  });
                  _updateFilters();
                },
              ),
              const SizedBox(height: 16),

              // Accommodation Type
              DropdownButtonFormField<String>(
                value: _selectedAccommodationType,
                decoration: const InputDecoration(
                  labelText: 'Accommodation Type',
                  prefixIcon: Icon(Icons.home),
                ),
                items: [
                  const DropdownMenuItem<String>(
                    value: null,
                    child: Text('Any Type'),
                  ),
                  ..._accommodationTypes.map((type) => DropdownMenuItem<String>(
                        value: type,
                        child: Text(_getAccommodationTypeName(type)),
                      )),
                ],
                onChanged: (value) {
                  setState(() {
                    _selectedAccommodationType = value;
                  });
                  _updateFilters();
                },
              ),
              const SizedBox(height: 16),

              // Price Range
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      decoration: const InputDecoration(
                        labelText: 'Min Rent',
                        hintText: '5000',
                        prefixIcon: Icon(Icons.attach_money),
                      ),
                      keyboardType: TextInputType.number,
                      onChanged: (value) {
                        _minRent = double.tryParse(value);
                        _updateFilters();
                      },
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      decoration: const InputDecoration(
                        labelText: 'Max Rent',
                        hintText: '20000',
                        prefixIcon: Icon(Icons.attach_money),
                      ),
                      keyboardType: TextInputType.number,
                      onChanged: (value) {
                        _maxRent = double.tryParse(value);
                        _updateFilters();
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Available Rooms
              DropdownButtonFormField<int>(
                value: _availableRooms,
                decoration: const InputDecoration(
                  labelText: 'Available Rooms',
                  prefixIcon: Icon(Icons.bed),
                ),
                items: [
                  const DropdownMenuItem<int>(
                    value: null,
                    child: Text('Any'),
                  ),
                  for (int i = 1; i <= 5; i++)
                    DropdownMenuItem<int>(
                      value: i,
                      child: Text('$i+'),
                    ),
                ],
                onChanged: (value) {
                  setState(() {
                    _availableRooms = value;
                  });
                  _updateFilters();
                },
              ),
            ],

            const SizedBox(height: 16),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _updateFilters,
                    icon: const Icon(Icons.search),
                    label: const Text('Search'),
                  ),
                ),
                const SizedBox(width: 12),
                OutlinedButton(
                  onPressed: _clearFilters,
                  child: const Text('Clear'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _updateFilters() {
    final filters = SearchFilters(
      location: _locationController.text.isNotEmpty ? _locationController.text : null,
      accommodationType: _selectedAccommodationType,
      minRent: _minRent,
      maxRent: _maxRent,
      availableRooms: _availableRooms,
      university: _selectedUniversity,
    );

    widget.onFiltersChanged(filters);
  }

  void _clearFilters() {
    setState(() {
      _locationController.clear();
      _selectedAccommodationType = null;
      _selectedUniversity = null;
      _minRent = null;
      _maxRent = null;
      _availableRooms = null;
    });
    widget.onFiltersChanged(null);
  }

  String _getShortUniversityName(String fullName) {
    return fullName
        .replaceAll('University of the ', '')
        .replaceAll('University of ', '')
        .replaceAll('University', 'Uni');
  }

  String _getAccommodationTypeName(String type) {
    switch (type) {
      case 'house':
        return 'House';
      case 'apartment':
        return 'Apartment/Flat';
      case 'commune':
        return 'Student Commune';
      case 'backyard_room':
        return 'Backyard Room';
      default:
        return type;
    }
  }

  @override
  void dispose() {
    _locationController.dispose();
    super.dispose();
  }
}
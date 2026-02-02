import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/models/models.dart';
import '../../../../core/services/api_service.dart';
import 'roommate_profile_page.dart';

class RoommateMatch {
  final User user;
  final double compatibilityScore;

  RoommateMatch({
    required this.user,
    required this.compatibilityScore,
  });

  factory RoommateMatch.fromJson(Map<String, dynamic> json) {
    return RoommateMatch(
      user: User.fromJson(json),
      compatibilityScore: double.parse(json['compatibilityScore']?.toString() ?? '0'),
    );
  }
}

class RoommateMatchesPage extends ConsumerStatefulWidget {
  const RoommateMatchesPage({super.key});

  @override
  ConsumerState<RoommateMatchesPage> createState() => _RoommateMatchesPageState();
}

class _RoommateMatchesPageState extends ConsumerState<RoommateMatchesPage> {
  List<RoommateMatch> _matches = [];
  bool _isLoading = true;
  String? _error;
  String? _universityFilter;
  String? _genderFilter;
  double _minCompatibility = 50;

  @override
  void initState() {
    super.initState();
    _loadMatches();
  }

  Future<void> _loadMatches() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final apiService = ref.read(apiServiceProvider);
      final queryParams = <String, dynamic>{
        'minCompatibility': _minCompatibility,
        if (_universityFilter != null) 'university': _universityFilter,
        if (_genderFilter != null) 'gender': _genderFilter,
      };

      final response = await apiService.get(
        '/api/roommates/potential',
        queryParameters: queryParams,
      );

      if (!mounted) return;

      setState(() {
        _matches = (response.data as List)
            .map((json) => RoommateMatch.fromJson(json))
            .toList();
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

  void _showFilters() {
    showModalBottomSheet(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Filters',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 24),
              
              // Minimum Compatibility
              Text(
                'Minimum Compatibility: ${_minCompatibility.toInt()}%',
                style: const TextStyle(fontSize: 16),
              ),
              Slider(
                value: _minCompatibility,
                min: 0,
                max: 100,
                divisions: 10,
                label: '${_minCompatibility.toInt()}%',
                onChanged: (value) {
                  setModalState(() => _minCompatibility = value);
                },
              ),
              const SizedBox(height: 16),
              
              // Gender Filter
              DropdownButtonFormField<String?>(
                value: _genderFilter,
                decoration: const InputDecoration(
                  labelText: 'Gender Preference',
                  border: OutlineInputBorder(),
                ),
                items: const [
                  DropdownMenuItem(value: null, child: Text('Any')),
                  DropdownMenuItem(value: 'male', child: Text('Male')),
                  DropdownMenuItem(value: 'female', child: Text('Female')),
                  DropdownMenuItem(value: 'other', child: Text('Other')),
                ],
                onChanged: (value) {
                  setModalState(() => _genderFilter = value);
                },
              ),
              const SizedBox(height: 24),
              
              // Apply button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    setState(() {});
                    _loadMatches();
                  },
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text('Apply Filters'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Find Roommates'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilters,
          ),
        ],
      ),
      body: _buildBody(),
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
              'Failed to load matches',
              style: TextStyle(fontSize: 18, color: Colors.grey[600]),
            ),
            const SizedBox(height: 8),
            Text(
              _error!,
              style: TextStyle(fontSize: 14, color: Colors.grey[500]),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _loadMatches,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (_matches.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.people_outline, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              'No matches found',
              style: TextStyle(fontSize: 18, color: Colors.grey[600]),
            ),
            const SizedBox(height: 8),
            Text(
              'Try adjusting your filters',
              style: TextStyle(fontSize: 14, color: Colors.grey[500]),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _showFilters,
              icon: const Icon(Icons.filter_list),
              label: const Text('Adjust Filters'),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadMatches,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _matches.length,
        itemBuilder: (context, index) {
          final match = _matches[index];
          return _buildMatchCard(match);
        },
      ),
    );
  }

  Widget _buildMatchCard(RoommateMatch match) {
    final compatibilityColor = _getCompatibilityColor(match.compatibilityScore);
    
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => RoommateProfilePage(
                userId: match.user.id,
                compatibilityScore: match.compatibilityScore,
              ),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Row(
                children: [
                  // Profile Image
                  Stack(
                    children: [
                      CircleAvatar(
                        radius: 36,
                        backgroundImage: match.user.profileImage != null
                            ? CachedNetworkImageProvider(match.user.profileImage!)
                            : null,
                        child: match.user.profileImage == null
                            ? Text(
                                match.user.firstName[0].toUpperCase(),
                                style: const TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                ),
                              )
                            : null,
                      ),
                      if (match.user.isVerified)
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: Container(
                            padding: const EdgeInsets.all(2),
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.verified,
                              size: 18,
                              color: Colors.blue,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(width: 16),
                  
                  // User Info
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          match.user.fullName,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        if (match.user.university != null)
                          Row(
                            children: [
                              const Icon(Icons.school, size: 14, color: Colors.grey),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  match.user.university!,
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey[700],
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        if (match.user.studyField != null)
                          Text(
                            match.user.studyField!,
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.grey[600],
                            ),
                          ),
                      ],
                    ),
                  ),
                  
                  // Compatibility Score
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: compatibilityColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: compatibilityColor,
                        width: 2,
                      ),
                    ),
                    child: Column(
                      children: [
                        Text(
                          '${match.compatibilityScore.toInt()}%',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: compatibilityColor,
                          ),
                        ),
                        Text(
                          'Match',
                          style: TextStyle(
                            fontSize: 11,
                            color: compatibilityColor,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              
              // Bio preview
              if (match.user.bio != null) ...[
                const SizedBox(height: 12),
                Text(
                  match.user.bio!,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[700],
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
              
              // Tags
              const SizedBox(height: 12),
              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: [
                  if (match.user.cleanlinessLevel != null)
                    _buildTag('Cleanliness: ${match.user.cleanlinessLevel}/5'),
                  if (match.user.noiseLevel != null)
                    _buildTag('Noise: ${match.user.noiseLevel}/5'),
                  if (match.user.lifestyle != null && match.user.lifestyle!.isNotEmpty)
                    ...match.user.lifestyle!.take(2).map((item) => _buildTag(item)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTag(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.blue[50],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 12,
          color: Colors.blue[700],
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Color _getCompatibilityColor(double score) {
    if (score >= 80) return Colors.green;
    if (score >= 60) return Colors.lightGreen;
    if (score >= 40) return Colors.orange;
    return Colors.red;
  }
}

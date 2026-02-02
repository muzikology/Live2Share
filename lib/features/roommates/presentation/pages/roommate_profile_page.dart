import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/models/models.dart';
import '../../../../core/services/api_service.dart';

class CompatibilityBreakdown {
  final double lifestyleScore;
  final double cleanlinessScore;
  final double noiseLevelScore;
  final double sleepScheduleScore;
  final double dietaryScore;
  final double hobbiesScore;
  final double preferencesScore;

  CompatibilityBreakdown({
    required this.lifestyleScore,
    required this.cleanlinessScore,
    required this.noiseLevelScore,
    required this.sleepScheduleScore,
    required this.dietaryScore,
    required this.hobbiesScore,
    required this.preferencesScore,
  });

  factory CompatibilityBreakdown.fromJson(Map<String, dynamic> json) {
    return CompatibilityBreakdown(
      lifestyleScore: double.parse(json['lifestyleScore']?.toString() ?? '0'),
      cleanlinessScore: double.parse(json['cleanlinessScore']?.toString() ?? '0'),
      noiseLevelScore: double.parse(json['noiseLevelScore']?.toString() ?? '0'),
      sleepScheduleScore: double.parse(json['sleepScheduleScore']?.toString() ?? '0'),
      dietaryScore: double.parse(json['dietaryScore']?.toString() ?? '0'),
      hobbiesScore: double.parse(json['hobbiesScore']?.toString() ?? '0'),
      preferencesScore: double.parse(json['preferencesScore']?.toString() ?? '0'),
    );
  }
}

class RoommateProfilePage extends ConsumerStatefulWidget {
  final int userId;
  final double compatibilityScore;

  const RoommateProfilePage({
    super.key,
    required this.userId,
    required this.compatibilityScore,
  });

  @override
  ConsumerState<RoommateProfilePage> createState() => _RoommateProfilePageState();
}

class _RoommateProfilePageState extends ConsumerState<RoommateProfilePage> {
  User? _user;
  CompatibilityBreakdown? _breakdown;
  bool _isLoading = true;
  String? _error;
  bool _isSendingRequest = false;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final apiService = ref.read(apiServiceProvider);
      
      // Load user profile
      final userResponse = await apiService.get('/api/users/${widget.userId}');
      
      // Load compatibility breakdown
      final compatResponse = await apiService.get(
        '/api/roommates/compatibility/${widget.userId}',
      );

      if (!mounted) return;

      setState(() {
        _user = User.fromJson(userResponse.data);
        _breakdown = CompatibilityBreakdown.fromJson(
          compatResponse.data['breakdown'],
        );
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

  Future<void> _sendRoommateRequest() async {
    setState(() => _isSendingRequest = true);

    try {
      final apiService = ref.read(apiServiceProvider);
      await apiService.post(
        '/api/roommates/requests',
        data: {
          'receiverId': widget.userId,
          'message': 'Hi! I think we\'d be great roommates. Let\'s connect!',
        },
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Roommate request sent successfully!'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      if (!mounted) return;
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to send request: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _isSendingRequest = false);
      }
    }
  }

  void _sendMessage() {
    context.push('/messages/conversation/${widget.userId}');
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_error != null || _user == null) {
      return Scaffold(
        appBar: AppBar(),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              Text(_error ?? 'Failed to load profile'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _loadProfile,
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // App bar with profile image
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.blue.shade400,
                      Colors.blue.shade600,
                    ],
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 40),
                    Stack(
                      children: [
                        CircleAvatar(
                          radius: 50,
                          backgroundImage: _user!.profileImage != null
                              ? CachedNetworkImageProvider(_user!.profileImage!)
                              : null,
                          child: _user!.profileImage == null
                              ? Text(
                                  _user!.firstName[0].toUpperCase(),
                                  style: const TextStyle(
                                    fontSize: 36,
                                    fontWeight: FontWeight.bold,
                                  ),
                                )
                              : null,
                        ),
                        if (_user!.isVerified)
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.verified,
                                size: 24,
                                color: Colors.blue,
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      _user!.fullName,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          
          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Compatibility Score
                  Card(
                    color: _getCompatibilityColor(widget.compatibilityScore)
                        .withOpacity(0.1),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Container(
                            width: 80,
                            height: 80,
                            decoration: BoxDecoration(
                              color: _getCompatibilityColor(widget.compatibilityScore),
                              shape: BoxShape.circle,
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  '${widget.compatibilityScore.toInt()}%',
                                  style: const TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                const Text(
                                  'Match',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.white,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Compatibility Score',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  _getCompatibilityMessage(widget.compatibilityScore),
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey[700],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Compatibility Breakdown
                  if (_breakdown != null) ...[
                    const Text(
                      'Compatibility Breakdown',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    _buildBreakdownItem('Lifestyle', _breakdown!.lifestyleScore, 25),
                    _buildBreakdownItem('Cleanliness', _breakdown!.cleanlinessScore, 20),
                    _buildBreakdownItem('Noise Level', _breakdown!.noiseLevelScore, 15),
                    _buildBreakdownItem('Sleep Schedule', _breakdown!.sleepScheduleScore, 15),
                    _buildBreakdownItem('Dietary', _breakdown!.dietaryScore, 10),
                    _buildBreakdownItem('Hobbies', _breakdown!.hobbiesScore, 10),
                    _buildBreakdownItem('Preferences', _breakdown!.preferencesScore, 5),
                    const SizedBox(height: 24),
                  ],

                  // Bio
                  if (_user!.bio != null) ...[
                    const Text(
                      'About',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _user!.bio!,
                      style: TextStyle(
                        fontSize: 15,
                        color: Colors.grey[800],
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Student Info
                  const Text(
                    'Student Information',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  if (_user!.university != null)
                    _buildInfoRow(Icons.school, 'University', _user!.university!),
                  if (_user!.studyField != null)
                    _buildInfoRow(Icons.book, 'Field of Study', _user!.studyField!),
                  if (_user!.yearOfStudy != null)
                    _buildInfoRow(Icons.calendar_today, 'Year', 'Year ${_user!.yearOfStudy}'),
                  const SizedBox(height: 24),

                  // Lifestyle
                  if (_user!.lifestyle != null && _user!.lifestyle!.isNotEmpty) ...[
                    const Text(
                      'Lifestyle',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _user!.lifestyle!
                          .map((item) => Chip(label: Text(item)))
                          .toList(),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Hobbies
                  if (_user!.hobbies != null && _user!.hobbies!.isNotEmpty) ...[
                    const Text(
                      'Hobbies & Interests',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _user!.hobbies!
                          .map((item) => Chip(
                                label: Text(item),
                                backgroundColor: Colors.purple[50],
                              ))
                          .toList(),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Preferences
                  const Text(
                    'Living Preferences',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  if (_user!.cleanlinessLevel != null)
                    _buildPreferenceSlider(
                      'Cleanliness Level',
                      _user!.cleanlinessLevel!.toDouble(),
                      Icons.cleaning_services,
                    ),
                  if (_user!.noiseLevel != null)
                    _buildPreferenceSlider(
                      'Noise Tolerance',
                      _user!.noiseLevel!.toDouble(),
                      Icons.volume_up,
                    ),
                  if (_user!.sleepSchedule != null)
                    _buildInfoRow(Icons.bedtime, 'Sleep Schedule', _user!.sleepSchedule!),
                  if (_user!.guestPolicy != null)
                    _buildInfoRow(Icons.people, 'Guest Policy', _user!.guestPolicy!),
                  
                  const SizedBox(height: 80),
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
                  onPressed: _sendMessage,
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
                  onPressed: _isSendingRequest ? null : _sendRoommateRequest,
                  icon: _isSendingRequest
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Icon(Icons.person_add),
                  label: const Text('Send Request'),
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

  Widget _buildBreakdownItem(String label, double score, double weight) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
              Text(
                '${score.toInt()}% (weight: ${weight.toInt()}%)',
                style: TextStyle(
                  fontSize: 13,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          LinearProgressIndicator(
            value: score / 100,
            backgroundColor: Colors.grey[200],
            valueColor: AlwaysStoppedAnimation<Color>(
              _getCompatibilityColor(score),
            ),
            minHeight: 8,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.grey[600]),
          const SizedBox(width: 12),
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
              fontWeight: FontWeight.w500,
            ),
          ),
          const Spacer(),
          Text(
            value,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPreferenceSlider(String label, double value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 18, color: Colors.grey[700]),
              const SizedBox(width: 8),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const Spacer(),
              Text(
                '${value.toInt()}/5',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          LinearProgressIndicator(
            value: value / 5,
            backgroundColor: Colors.grey[200],
            minHeight: 8,
          ),
        ],
      ),
    );
  }

  Color _getCompatibilityColor(double score) {
    if (score >= 80) return Colors.green;
    if (score >= 60) return Colors.lightGreen;
    if (score >= 40) return Colors.orange;
    return Colors.red;
  }

  String _getCompatibilityMessage(double score) {
    if (score >= 80) return 'Excellent match! You have a lot in common.';
    if (score >= 60) return 'Good match! You share many preferences.';
    if (score >= 40) return 'Moderate match. Some differences to consider.';
    return 'Low match. Significant lifestyle differences.';
  }
}

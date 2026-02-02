import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:student_share/core/models/models.dart';
import 'package:student_share/core/services/dio_api_service.dart';
import 'package:student_share/core/services/auth_service.dart';
import 'package:cached_network_image/cached_network_image.dart';

class ProfilePage extends ConsumerStatefulWidget {
  const ProfilePage({super.key});

  @override
  ConsumerState<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends ConsumerState<ProfilePage> {
  User? _user;
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final apiService = ref.read(apiServiceProvider);
      final authService = AuthService(apiService.dio);
      
      final userData = await authService.getCurrentUserFromApi();
      
      setState(() {
        _user = User.fromJson(userData);
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _logout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Logout'),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      final apiService = ref.read(apiServiceProvider);
      final authService = AuthService(apiService.dio);
      await authService.logout();
      
      if (mounted) {
        context.go('/login');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Profile')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_errorMessage != null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Profile')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              Text(_errorMessage!),
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

    if (_user == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Profile')),
        body: const Center(child: Text('User not found')),
      );
    }

    return Scaffold(
      body: CustomScrollView(
        slivers: [
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
                      Theme.of(context).primaryColor,
                      Theme.of(context).primaryColor.withOpacity(0.7),
                    ],
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 40),
                    CircleAvatar(
                      radius: 50,
                      backgroundImage: _user!.profileImage != null
                          ? CachedNetworkImageProvider(_user!.profileImage!)
                          : null,
                      child: _user!.profileImage == null
                          ? Text(
                              _user!.firstName[0],
                              style: const TextStyle(fontSize: 40),
                            )
                          : null,
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          _user!.fullName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        if (_user!.isVerified) ...[
                          const SizedBox(width: 8),
                          const Icon(Icons.verified, color: Colors.white),
                        ],
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      _user!.userType == 'landlord' ? 'Landlord' : 'Tenant',
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.edit),
                onPressed: () {
                  // Navigate to edit profile
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Edit profile feature coming soon')),
                  );
                },
              ),
            ],
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Contact Information
                  _buildSectionTitle('Contact Information'),
                  Card(
                    child: Column(
                      children: [
                        ListTile(
                          leading: const Icon(Icons.email),
                          title: const Text('Email'),
                          subtitle: Text(_user!.email),
                          trailing: _user!.isEmailVerified
                              ? const Icon(Icons.verified, color: Colors.green)
                              : const Chip(label: Text('Not Verified')),
                        ),
                        if (_user!.phone != null)
                          ListTile(
                            leading: const Icon(Icons.phone),
                            title: const Text('Phone'),
                            subtitle: Text(_user!.phone!),
                            trailing: _user!.isPhoneVerified
                                ? const Icon(Icons.verified, color: Colors.green)
                                : const Chip(label: Text('Not Verified')),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Student Information (if tenant)
                  if (_user!.userType == 'tenant') ...[
                    _buildSectionTitle('Student Information'),
                    Card(
                      child: Column(
                        children: [
                          if (_user!.university != null)
                            ListTile(
                              leading: const Icon(Icons.school),
                              title: const Text('University'),
                              subtitle: Text(_user!.university!),
                            ),
                          if (_user!.studyField != null)
                            ListTile(
                              leading: const Icon(Icons.menu_book),
                              title: const Text('Field of Study'),
                              subtitle: Text(_user!.studyField!),
                            ),
                          if (_user!.yearOfStudy != null)
                            ListTile(
                              leading: const Icon(Icons.calendar_today),
                              title: const Text('Year of Study'),
                              subtitle: Text('Year ${_user!.yearOfStudy}'),
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // About
                  if (_user!.bio != null) ...[
                    _buildSectionTitle('About'),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Text(_user!.bio!),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Lifestyle (if tenant)
                  if (_user!.userType == 'tenant' && _user!.lifestyle != null && _user!.lifestyle!.isNotEmpty) ...[
                    _buildSectionTitle('Lifestyle'),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: _user!.lifestyle!.map((trait) {
                            return Chip(
                              label: Text(trait),
                              backgroundColor: Colors.blue[50],
                            );
                          }).toList(),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Hobbies
                  if (_user!.hobbies != null && _user!.hobbies!.isNotEmpty) ...[
                    _buildSectionTitle('Hobbies & Interests'),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: _user!.hobbies!.map((hobby) {
                            return Chip(
                              label: Text(hobby),
                              backgroundColor: Colors.green[50],
                            );
                          }).toList(),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Preferences
                  if (_user!.preferences != null && _user!.preferences!.isNotEmpty) ...[
                    _buildSectionTitle('Preferences'),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: _user!.preferences!.map((pref) {
                            return Chip(
                              label: Text(pref),
                              backgroundColor: Colors.purple[50],
                            );
                          }).toList(),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Compatibility Scores (if tenant)
                  if (_user!.userType == 'tenant') ...[
                    _buildSectionTitle('My Scores'),
                    Card(
                      child: Column(
                        children: [
                          if (_user!.cleanlinessLevel != null)
                            _buildScoreSlider(
                              'Cleanliness Level',
                              _user!.cleanlinessLevel!,
                              Icons.cleaning_services,
                            ),
                          if (_user!.noiseLevel != null)
                            _buildScoreSlider(
                              'Noise Level',
                              _user!.noiseLevel!,
                              Icons.volume_up,
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Account Actions
                  _buildSectionTitle('Account'),
                  Card(
                    child: Column(
                      children: [
                        ListTile(
                          leading: const Icon(Icons.settings),
                          title: const Text('Settings'),
                          trailing: const Icon(Icons.chevron_right),
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Settings feature coming soon')),
                            );
                          },
                        ),
                        ListTile(
                          leading: const Icon(Icons.help),
                          title: const Text('Help & Support'),
                          trailing: const Icon(Icons.chevron_right),
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Support feature coming soon')),
                            );
                          },
                        ),
                        ListTile(
                          leading: const Icon(Icons.logout, color: Colors.red),
                          title: const Text('Logout', style: TextStyle(color: Colors.red)),
                          onTap: _logout,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildScoreSlider(String label, int value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 20),
              const SizedBox(width: 8),
              Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: Slider(
                  value: value.toDouble(),
                  min: 1,
                  max: 10,
                  divisions: 9,
                  label: value.toString(),
                  onChanged: null, // Read-only
                ),
              ),
              Text(
                '$value/10',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

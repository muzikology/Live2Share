import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Hero Section
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFF2563EB), Color(0xFF7C3AED)],
                ),
              ),
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    children: [
                      // Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(
                                Icons.home,
                                color: Colors.white,
                                size: 28,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'StudentShare',
                                style: theme.textTheme.headlineSmall?.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          IconButton(
                            onPressed: () {},
                            icon: const Icon(
                              Icons.person_outline,
                              color: Colors.white,
                              size: 28,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 40),
                      
                      // Hero Content
                      Text(
                        'Find Your Perfect Student Accommodation',
                        style: theme.textTheme.headlineMedium?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          height: 1.2,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Connect with fellow South African students, share costs, and find amazing places to live near your university.',
                        style: theme.textTheme.bodyLarge?.copyWith(
                          color: Colors.white70,
                          height: 1.5,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 32),
                      
                      // Action Buttons
                      Column(
                        children: [
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: () => context.go('/accommodations'),
                              icon: const Icon(Icons.search),
                              label: const Text('Find Accommodation'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white,
                                foregroundColor: const Color(0xFF2563EB),
                                padding: const EdgeInsets.symmetric(vertical: 16),
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                          SizedBox(
                            width: double.infinity,
                            child: OutlinedButton.icon(
                              onPressed: () => context.go('/list-accommodation'),
                              icon: const Icon(Icons.add_home),
                              label: const Text('List Your Place'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.white,
                                side: const BorderSide(color: Colors.white),
                                padding: const EdgeInsets.symmetric(vertical: 16),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
            
            // Features Section
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  Text(
                    'Why Choose StudentShare?',
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Built specifically for South African students seeking shared accommodation',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: Colors.grey[600],
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 32),
                  
                  GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: 2,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 1.1,
                    children: [
                      _buildFeatureCard(
                        icon: Icons.search,
                        title: 'Find Perfect Match',
                        description: 'Search accommodation near your university with compatible roommates.',
                        color: Colors.blue,
                      ),
                      _buildFeatureCard(
                        icon: Icons.people,
                        title: 'Student Profiles',
                        description: 'View detailed profiles to find roommates with similar lifestyles.',
                        color: Colors.green,
                      ),
                      _buildFeatureCard(
                        icon: Icons.favorite,
                        title: 'Split Costs',
                        description: 'Calculate rent splits and share expenses with roommates.',
                        color: Colors.red,
                      ),
                      _buildFeatureCard(
                        icon: Icons.home,
                        title: 'List Your Place',
                        description: 'Property owners can list accommodation and reach students.',
                        color: Colors.purple,
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            // Accommodation Types
            Container(
              color: Colors.grey[50],
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  Text(
                    'Accommodation Types',
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'From shared houses to private rooms, find what suits your lifestyle',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: Colors.grey[600],
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  
                  Column(
                    children: [
                      _buildAccommodationTypeCard(
                        'Student Houses',
                        'Shared houses perfect for group living',
                        '50+ available',
                        Colors.blue,
                      ),
                      const SizedBox(height: 12),
                      _buildAccommodationTypeCard(
                        'Communes',
                        'Community-focused shared living spaces',
                        '25+ available',
                        Colors.green,
                      ),
                      const SizedBox(height: 12),
                      _buildAccommodationTypeCard(
                        'Apartments',
                        'Modern flats for students near universities',
                        '40+ available',
                        Colors.purple,
                      ),
                      const SizedBox(height: 12),
                      _buildAccommodationTypeCard(
                        'Backyard Rooms',
                        'Affordable private rooms with shared facilities',
                        '30+ available',
                        Colors.orange,
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            // Universities Section
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  Text(
                    'Near Top South African Universities',
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Find accommodation close to your campus',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: Colors.grey[600],
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  
                  Column(
                    children: [
                      'University of Cape Town',
                      'University of the Witwatersrand',
                      'University of KwaZulu-Natal',
                      'Stellenbosch University',
                      'University of Pretoria',
                      'University of Johannesburg',
                    ].map((uni) => Padding(
                      padding: const EdgeInsets.only(bottom: 8.0),
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.grey.withOpacity(0.1),
                              spreadRadius: 1,
                              blurRadius: 3,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.school,
                              color: Color(0xFF2563EB),
                              size: 24,
                            ),
                            const SizedBox(width: 12),
                            Text(
                              uni,
                              style: theme.textTheme.bodyMedium?.copyWith(
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    )).toList(),
                  ),
                ],
              ),
            ),
            
            // CTA Section
            Container(
              color: Colors.grey[100],
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  Text(
                    'Ready to Find Your New Home?',
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Join thousands of South African students who\'ve found their perfect accommodation match',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: Colors.grey[600],
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => context.go('/accommodations'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: const Text('Start Your Search'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureCard({
    required IconData icon,
    required String title,
    required String description,
    required Color color,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: color,
              size: 32,
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              description,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
                height: 1.3,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAccommodationTypeCard(
    String title,
    String description,
    String count,
    Color color,
  ) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Text(
                count,
                style: TextStyle(
                  color: color,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
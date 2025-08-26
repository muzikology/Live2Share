import 'package:flutter/material.dart';
import 'package:student_share/core/models/student_user.dart';

class RoommateProfilesWidget extends StatelessWidget {
  final List<StudentUser> roommates;

  const RoommateProfilesWidget({
    super.key,
    required this.roommates,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Current Roommates (${roommates.length})',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 16),
        
        ...roommates.map((roommate) => _buildRoommateCard(context, roommate)),
      ],
    );
  }

  Widget _buildRoommateCard(BuildContext context, StudentUser roommate) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Profile Image
            CircleAvatar(
              radius: 30,
              backgroundColor: Colors.grey[300],
              backgroundImage: roommate.profileImage != null
                  ? NetworkImage(roommate.profileImage!)
                  : null,
              child: roommate.profileImage == null
                  ? const Icon(Icons.person, size: 30, color: Colors.grey)
                  : null,
            ),
            const SizedBox(width: 16),
            
            // Profile Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        roommate.fullName,
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(width: 8),
                      if (roommate.university != "N/A - Landlord")
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.blue[300]!),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            'Year ${roommate.yearOfStudy}',
                            style: TextStyle(
                              fontSize: 10,
                              color: Colors.blue[700],
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  
                  // University Info
                  if (roommate.university != "N/A - Landlord") ...[
                    Row(
                      children: [
                        const Icon(Icons.school, size: 16, color: Colors.grey),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            '${roommate.studyField} at ${roommate.shortUniversity}',
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                  ],
                  
                  // Bio
                  if (roommate.bio != null && roommate.bio!.isNotEmpty) ...[
                    Text(
                      roommate.bio!,
                      style: TextStyle(
                        color: Colors.grey[700],
                        fontSize: 14,
                        height: 1.3,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 8),
                  ],
                  
                  // Lifestyle tags
                  if (roommate.lifestyle.isNotEmpty) ...[
                    Wrap(
                      spacing: 4,
                      runSpacing: 4,
                      children: roommate.lifestyle.take(3).map((trait) => Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.purple[50],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          trait.replaceAll('_', ' '),
                          style: TextStyle(
                            fontSize: 11,
                            color: Colors.purple[700],
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      )).toList(),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
class StudentUser {
  final int id;
  final String username;
  final String email;
  final String firstName;
  final String lastName;
  final String phone;
  final String university;
  final String studyField;
  final int yearOfStudy;
  final String? bio;
  final String? profileImage;
  final List<String> lifestyle;
  final List<String> preferences;
  final DateTime createdAt;

  const StudentUser({
    required this.id,
    required this.username,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.phone,
    required this.university,
    required this.studyField,
    required this.yearOfStudy,
    this.bio,
    this.profileImage,
    required this.lifestyle,
    required this.preferences,
    required this.createdAt,
  });

  factory StudentUser.fromJson(Map<String, dynamic> json) {
    return StudentUser(
      id: json['id'] as int,
      username: json['username'] as String,
      email: json['email'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      phone: json['phone'] as String,
      university: json['university'] as String,
      studyField: json['studyField'] as String,
      yearOfStudy: json['yearOfStudy'] as int,
      bio: json['bio'] as String?,
      profileImage: json['profileImage'] as String?,
      lifestyle: List<String>.from(json['lifestyle'] ?? []),
      preferences: List<String>.from(json['preferences'] ?? []),
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'phone': phone,
      'university': university,
      'studyField': studyField,
      'yearOfStudy': yearOfStudy,
      'bio': bio,
      'profileImage': profileImage,
      'lifestyle': lifestyle,
      'preferences': preferences,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  String get fullName => '$firstName $lastName';
  String get shortUniversity => university
      .replaceAll('University of the ', '')
      .replaceAll('University of ', '')
      .replaceAll('University', 'Uni');
}
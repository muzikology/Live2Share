import 'package:student_share/core/models/student_user.dart';

class Application {
  final int id;
  final int accommodationId;
  final int applicantId;
  final String message;
  final DateTime preferredMoveInDate;
  final String budgetRange;
  final ApplicationStatus status;
  final DateTime createdAt;
  final StudentUser? applicant;

  const Application({
    required this.id,
    required this.accommodationId,
    required this.applicantId,
    required this.message,
    required this.preferredMoveInDate,
    required this.budgetRange,
    required this.status,
    required this.createdAt,
    this.applicant,
  });

  factory Application.fromJson(Map<String, dynamic> json) {
    return Application(
      id: json['id'] as int,
      accommodationId: json['accommodationId'] as int,
      applicantId: json['applicantId'] as int,
      message: json['message'] as String,
      preferredMoveInDate: DateTime.parse(json['preferredMoveInDate'] as String),
      budgetRange: json['budgetRange'] as String,
      status: ApplicationStatus.fromString(json['status'] as String),
      createdAt: DateTime.parse(json['createdAt'] as String),
      applicant: json['applicant'] != null
          ? StudentUser.fromJson(json['applicant'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'accommodationId': accommodationId,
      'applicantId': applicantId,
      'message': message,
      'preferredMoveInDate': preferredMoveInDate.toIso8601String(),
      'budgetRange': budgetRange,
      'status': status.value,
      'createdAt': createdAt.toIso8601String(),
      'applicant': applicant?.toJson(),
    };
  }
}

enum ApplicationStatus {
  pending('pending', 'Pending'),
  approved('approved', 'Approved'),
  rejected('rejected', 'Rejected');

  const ApplicationStatus(this.value, this.displayName);

  final String value;
  final String displayName;

  static ApplicationStatus fromString(String value) {
    return ApplicationStatus.values.firstWhere(
      (status) => status.value == value,
      orElse: () => ApplicationStatus.pending,
    );
  }
}
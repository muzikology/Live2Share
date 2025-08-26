import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:student_share/core/models/accommodation.dart';
import 'package:student_share/core/models/application.dart';
import 'package:student_share/core/models/student_user.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:5000/api';

  static Future<List<Accommodation>> getAccommodations({
    String? city,
    String? province,
    String? area,
    String? accommodationType,
    double? minRent,
    double? maxRent,
    int? availableRooms,
    String? university,
  }) async {
    final uri = Uri.parse('$baseUrl/accommodations');
    final queryParams = <String, String>{};

    if (city != null && city.isNotEmpty) queryParams['city'] = city;
    if (province != null && province.isNotEmpty) queryParams['province'] = province;
    if (area != null && area.isNotEmpty) queryParams['area'] = area;
    if (accommodationType != null && accommodationType.isNotEmpty) {
      queryParams['accommodationType'] = accommodationType;
    }
    if (minRent != null) queryParams['minRent'] = minRent.toString();
    if (maxRent != null) queryParams['maxRent'] = maxRent.toString();
    if (availableRooms != null) queryParams['availableRooms'] = availableRooms.toString();
    if (university != null && university.isNotEmpty) queryParams['university'] = university;

    final finalUri = uri.replace(queryParameters: queryParams.isNotEmpty ? queryParams : null);

    try {
      final response = await http.get(finalUri);

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Accommodation.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load accommodations: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to load accommodations: $e');
    }
  }

  static Future<Accommodation> getAccommodation(int id) async {
    final uri = Uri.parse('$baseUrl/accommodations/$id');

    try {
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return Accommodation.fromJson(data);
      } else if (response.statusCode == 404) {
        throw Exception('Accommodation not found');
      } else {
        throw Exception('Failed to load accommodation: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to load accommodation: $e');
    }
  }

  static Future<List<StudentUser>> getRoommates(int accommodationId) async {
    final uri = Uri.parse('$baseUrl/accommodations/$accommodationId/roommates');

    try {
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => StudentUser.fromJson(json['user'])).toList();
      } else {
        throw Exception('Failed to load roommates: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to load roommates: $e');
    }
  }

  static Future<Application> createApplication({
    required int accommodationId,
    required int applicantId,
    required String message,
    required DateTime preferredMoveInDate,
    required String budgetRange,
  }) async {
    final uri = Uri.parse('$baseUrl/applications');

    final body = json.encode({
      'accommodationId': accommodationId,
      'applicantId': applicantId,
      'message': message,
      'preferredMoveInDate': preferredMoveInDate.toIso8601String(),
      'budgetRange': budgetRange,
      'status': 'pending',
    });

    try {
      final response = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: body,
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        return Application.fromJson(data);
      } else {
        throw Exception('Failed to create application: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to create application: $e');
    }
  }

  static Future<List<Application>> getApplicationsForAccommodation(int accommodationId) async {
    final uri = Uri.parse('$baseUrl/accommodations/$accommodationId/applications');

    try {
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Application.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load applications: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to load applications: $e');
    }
  }

  static Future<Accommodation> createAccommodation(Map<String, dynamic> accommodationData) async {
    final uri = Uri.parse('$baseUrl/accommodations');

    try {
      final response = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: json.encode(accommodationData),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        return Accommodation.fromJson(data);
      } else {
        throw Exception('Failed to create accommodation: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to create accommodation: $e');
    }
  }
}
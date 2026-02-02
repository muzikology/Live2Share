import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class AuthService {
  final Dio _dio;
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';
  
  AuthService(this._dio);

  Future<Map<String, dynamic>> register({
    required String username,
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String userType,
    String? phone,
    String? university,
    String? studyField,
    int? yearOfStudy,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/register',
        data: {
          'username': username,
          'email': email,
          'password': password,
          'firstName': firstName,
          'lastName': lastName,
          'userType': userType,
          'phone': phone,
          'university': university,
          'studyField': studyField,
          'yearOfStudy': yearOfStudy,
        },
      );

      final token = response.data['token'];
      final user = response.data['user'];

      await _saveAuthData(token, user);
      
      return user;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> login({
    required String identifier,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {
          'identifier': identifier,
          'password': password,
        },
      );

      final token = response.data['token'];
      final user = response.data['user'];

      await _saveAuthData(token, user);
      
      return user;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  Future<Map<String, dynamic>?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userJson = prefs.getString(_userKey);
    if (userJson != null) {
      return json.decode(userJson);
    }
    return null;
  }

  Future<bool> isAuthenticated() async {
    final token = await getToken();
    return token != null;
  }

  Future<Map<String, dynamic>> getCurrentUserFromApi() async {
    try {
      final response = await _dio.get('/auth/me');
      final user = response.data;
      
      // Update stored user data
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_userKey, json.encode(user));
      
      return user;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> _saveAuthData(String token, Map<String, dynamic> user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    await prefs.setString(_userKey, json.encode(user));
    
    // Set token in Dio headers for future requests
    _dio.options.headers['Authorization'] = 'Bearer $token';
  }

  String _handleError(DioException e) {
    if (e.response != null) {
      final message = e.response?.data['message'];
      return message ?? 'An error occurred';
    } else {
      return 'Network error. Please check your connection.';
    }
  }
}

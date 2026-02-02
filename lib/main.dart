import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:student_share/core/theme/app_theme.dart';
import 'package:student_share/features/accommodations/presentation/pages/accommodations_page.dart';
import 'package:student_share/features/accommodations/presentation/pages/accommodation_details_page.dart';
import 'package:student_share/features/accommodations/presentation/pages/list_accommodation_page.dart';
import 'package:student_share/features/home/presentation/pages/home_page.dart';
import 'package:student_share/features/applications/presentation/pages/applications_page.dart';
import 'package:student_share/features/authentication/presentation/pages/login_page.dart';
import 'package:student_share/features/authentication/presentation/pages/signup_page.dart';
import 'package:student_share/features/accommodations/presentation/pages/property_details_page.dart';
import 'package:student_share/features/messages/presentation/pages/messages_page.dart';
import 'package:student_share/features/messages/presentation/pages/chat_page.dart';
import 'package:student_share/features/profile/presentation/pages/profile_page.dart';
import 'package:student_share/features/roommates/presentation/pages/roommate_matches_page.dart';
import 'package:student_share/features/roommates/presentation/pages/roommate_requests_page.dart';

void main() {
  runApp(const ProviderScope(child: StudentShareApp()));
}

class StudentShareApp extends StatelessWidget {
  const StudentShareApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Live2Share',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      routerConfig: _router,
      debugShowCheckedModeBanner: false,
    );
  }
}

final _router = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(
      path: '/',
      name: 'home',
      builder: (context, state) => const HomePage(),
    ),
    GoRoute(
      path: '/login',
      name: 'login',
      builder: (context, state) => const LoginPage(),
    ),
    GoRoute(
      path: '/signup',
      name: 'signup',
      builder: (context, state) => const SignupPage(),
    ),
    GoRoute(
      path: '/accommodations',
      name: 'accommodations',
      builder: (context, state) => const AccommodationsPage(),
    ),
    GoRoute(
      path: '/accommodation/:id',
      name: 'accommodation-details',
      builder: (context, state) => PropertyDetailsPage(
        accommodationId: int.parse(state.pathParameters['id']!),
      ),
    ),
    GoRoute(
      path: '/messages',
      name: 'messages',
      builder: (context, state) => const MessagesPage(),
    ),
    GoRoute(
      path: '/messages/conversation/:userId',
      name: 'chat',
      builder: (context, state) => ChatPage(
        otherUserId: int.parse(state.pathParameters['userId']!),
      ),
    ),
    GoRoute(
      path: '/profile',
      name: 'profile',
      builder: (context, state) => const ProfilePage(),
    ),
    GoRoute(
      path: '/list-accommodation',
      name: 'list-accommodation',
      builder: (context, state) => const ListAccommodationPage(),
    ),
    GoRoute(
      path: '/applications',
      name: 'applications',
      builder: (context, state) => const ApplicationsPage(),
    ),
    GoRoute(
      path: '/roommates',
      name: 'roommates',
      builder: (context, state) => const RoommateMatchesPage(),
    ),
    GoRoute(
      path: '/roommate-requests',
      name: 'roommate-requests',
      builder: (context, state) => const RoommateRequestsPage(),
    ),
  ],
);
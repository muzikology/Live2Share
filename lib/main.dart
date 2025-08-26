import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:student_share/core/theme/app_theme.dart';
import 'package:student_share/features/accommodations/presentation/pages/accommodations_page.dart';
import 'package:student_share/features/accommodations/presentation/pages/accommodation_details_page.dart';
import 'package:student_share/features/accommodations/presentation/pages/list_accommodation_page.dart';
import 'package:student_share/features/home/presentation/pages/home_page.dart';
import 'package:student_share/features/applications/presentation/pages/applications_page.dart';

void main() {
  runApp(const ProviderScope(child: StudentShareApp()));
}

class StudentShareApp extends StatelessWidget {
  const StudentShareApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'StudentShare',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      routerConfig: _router,
      debugShowCheckedModeBanner: false,
    );
  }
}

final _router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      name: 'home',
      builder: (context, state) => const HomePage(),
    ),
    GoRoute(
      path: '/accommodations',
      name: 'accommodations',
      builder: (context, state) => const AccommodationsPage(),
    ),
    GoRoute(
      path: '/accommodation/:id',
      name: 'accommodation-details',
      builder: (context, state) => AccommodationDetailsPage(
        accommodationId: int.parse(state.pathParameters['id']!),
      ),
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
  ],
);
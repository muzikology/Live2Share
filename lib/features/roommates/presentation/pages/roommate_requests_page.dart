import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../../../../core/models/models.dart';
import '../../../../core/services/api_service.dart';
import 'roommate_profile_page.dart';

class RoommateRequest {
  final int id;
  final int senderId;
  final int receiverId;
  final String status;
  final String? message;
  final User sender;
  final User receiver;
  final DateTime createdAt;

  RoommateRequest({
    required this.id,
    required this.senderId,
    required this.receiverId,
    required this.status,
    this.message,
    required this.sender,
    required this.receiver,
    required this.createdAt,
  });

  factory RoommateRequest.fromJson(Map<String, dynamic> json) {
    return RoommateRequest(
      id: json['id'],
      senderId: json['senderId'],
      receiverId: json['receiverId'],
      status: json['status'],
      message: json['message'],
      sender: User.fromJson(json['sender']),
      receiver: User.fromJson(json['receiver']),
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

class RoommateRequestsPage extends ConsumerStatefulWidget {
  const RoommateRequestsPage({super.key});

  @override
  ConsumerState<RoommateRequestsPage> createState() => _RoommateRequestsPageState();
}

class _RoommateRequestsPageState extends ConsumerState<RoommateRequestsPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<RoommateRequest> _sentRequests = [];
  List<RoommateRequest> _receivedRequests = [];
  bool _isLoadingSent = true;
  bool _isLoadingReceived = true;
  String? _errorSent;
  String? _errorReceived;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadRequests();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadRequests() async {
    _loadSentRequests();
    _loadReceivedRequests();
  }

  Future<void> _loadSentRequests() async {
    setState(() {
      _isLoadingSent = true;
      _errorSent = null;
    });

    try {
      final apiService = ref.read(apiServiceProvider);
      final response = await apiService.get('/api/roommates/requests/sent');

      if (!mounted) return;

      setState(() {
        _sentRequests = (response.data as List)
            .map((json) => RoommateRequest.fromJson(json))
            .toList();
        _isLoadingSent = false;
      });
    } catch (e) {
      if (!mounted) return;
      
      setState(() {
        _errorSent = e.toString();
        _isLoadingSent = false;
      });
    }
  }

  Future<void> _loadReceivedRequests() async {
    setState(() {
      _isLoadingReceived = true;
      _errorReceived = null;
    });

    try {
      final apiService = ref.read(apiServiceProvider);
      final response = await apiService.get('/api/roommates/requests/received');

      if (!mounted) return;

      setState(() {
        _receivedRequests = (response.data as List)
            .map((json) => RoommateRequest.fromJson(json))
            .toList();
        _isLoadingReceived = false;
      });
    } catch (e) {
      if (!mounted) return;
      
      setState(() {
        _errorReceived = e.toString();
        _isLoadingReceived = false;
      });
    }
  }

  Future<void> _respondToRequest(int requestId, String action) async {
    try {
      final apiService = ref.read(apiServiceProvider);
      await apiService.put(
        '/api/roommates/requests/$requestId/$action',
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            action == 'accept'
                ? 'Request accepted!'
                : 'Request declined',
          ),
          backgroundColor: action == 'accept' ? Colors.green : Colors.orange,
        ),
      );

      _loadReceivedRequests(); // Reload to update the list
    } catch (e) {
      if (!mounted) return;
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _cancelRequest(int requestId) async {
    try {
      final apiService = ref.read(apiServiceProvider);
      await apiService.delete('/api/roommates/requests/$requestId');

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Request cancelled'),
          backgroundColor: Colors.orange,
        ),
      );

      _loadSentRequests(); // Reload to update the list
    } catch (e) {
      if (!mounted) return;
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Roommate Requests'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Received'),
            Tab(text: 'Sent'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildReceivedTab(),
          _buildSentTab(),
        ],
      ),
    );
  }

  Widget _buildReceivedTab() {
    if (_isLoadingReceived) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_errorReceived != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text('Failed to load requests', style: TextStyle(color: Colors.grey[600])),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _loadReceivedRequests,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (_receivedRequests.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.inbox_outlined, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              'No pending requests',
              style: TextStyle(fontSize: 18, color: Colors.grey[600]),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadReceivedRequests,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _receivedRequests.length,
        itemBuilder: (context, index) {
          final request = _receivedRequests[index];
          return _buildReceivedRequestCard(request);
        },
      ),
    );
  }

  Widget _buildSentTab() {
    if (_isLoadingSent) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_errorSent != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text('Failed to load requests', style: TextStyle(color: Colors.grey[600])),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _loadSentRequests,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (_sentRequests.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.send_outlined, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              'No sent requests',
              style: TextStyle(fontSize: 18, color: Colors.grey[600]),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadSentRequests,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _sentRequests.length,
        itemBuilder: (context, index) {
          final request = _sentRequests[index];
          return _buildSentRequestCard(request);
        },
      ),
    );
  }

  Widget _buildReceivedRequestCard(RoommateRequest request) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => RoommateProfilePage(
                          userId: request.sender.id,
                          compatibilityScore: 0, // Load in profile page
                        ),
                      ),
                    );
                  },
                  child: CircleAvatar(
                    radius: 28,
                    backgroundImage: request.sender.profileImage != null
                        ? CachedNetworkImageProvider(request.sender.profileImage!)
                        : null,
                    child: request.sender.profileImage == null
                        ? Text(
                            request.sender.firstName[0].toUpperCase(),
                            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                          )
                        : null,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            request.sender.fullName,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          if (request.sender.isVerified) ...[
                            const SizedBox(width: 4),
                            const Icon(Icons.verified, size: 16, color: Colors.blue),
                          ],
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        timeago.format(request.createdAt),
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
                _buildStatusBadge(request.status),
              ],
            ),
            
            if (request.message != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  request.message!,
                  style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                ),
              ),
            ],
            
            if (request.status == 'pending') ...[
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => _respondToRequest(request.id, 'decline'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.red,
                        side: const BorderSide(color: Colors.red),
                      ),
                      child: const Text('Decline'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _respondToRequest(request.id, 'accept'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                      ),
                      child: const Text('Accept'),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildSentRequestCard(RoommateRequest request) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundImage: request.receiver.profileImage != null
                      ? CachedNetworkImageProvider(request.receiver.profileImage!)
                      : null,
                  child: request.receiver.profileImage == null
                      ? Text(
                          request.receiver.firstName[0].toUpperCase(),
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                        )
                      : null,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            request.receiver.fullName,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          if (request.receiver.isVerified) ...[
                            const SizedBox(width: 4),
                            const Icon(Icons.verified, size: 16, color: Colors.blue),
                          ],
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Sent ${timeago.format(request.createdAt)}',
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
                _buildStatusBadge(request.status),
              ],
            ),
            
            if (request.status == 'pending') ...[
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () => _cancelRequest(request.id),
                  icon: const Icon(Icons.close),
                  label: const Text('Cancel Request'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.red,
                    side: const BorderSide(color: Colors.red),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    IconData icon;
    
    switch (status) {
      case 'accepted':
        color = Colors.green;
        icon = Icons.check_circle;
        break;
      case 'declined':
        color = Colors.red;
        icon = Icons.cancel;
        break;
      default:
        color = Colors.orange;
        icon = Icons.pending;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 4),
          Text(
            status.toUpperCase(),
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}

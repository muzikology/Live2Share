import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:student_share/core/services/api_service.dart';
import 'package:intl/intl.dart';

class ApplicationFormWidget extends ConsumerStatefulWidget {
  final int accommodationId;
  final ScrollController scrollController;
  final VoidCallback onSuccess;

  const ApplicationFormWidget({
    super.key,
    required this.accommodationId,
    required this.scrollController,
    required this.onSuccess,
  });

  @override
  ConsumerState<ApplicationFormWidget> createState() => _ApplicationFormWidgetState();
}

class _ApplicationFormWidgetState extends ConsumerState<ApplicationFormWidget> {
  final _formKey = GlobalKey<FormState>();
  final _messageController = TextEditingController();
  DateTime? _selectedMoveInDate;
  String? _selectedBudgetRange;
  bool _isSubmitting = false;

  final List<String> _budgetRanges = [
    'R2000-R4000',
    'R4000-R6000',
    'R6000-R8000',
    'R8000-R10000',
    'R10000+',
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Handle
        Container(
          width: 40,
          height: 4,
          margin: const EdgeInsets.only(bottom: 20),
          decoration: BoxDecoration(
            color: Colors.grey[300],
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        
        Text(
          'Apply for this Accommodation',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 24),
        
        Expanded(
          child: Form(
            key: _formKey,
            child: ListView(
              controller: widget.scrollController,
              padding: const EdgeInsets.only(bottom: 100),
              children: [
                // Move-in Date
                TextFormField(
                  readOnly: true,
                  decoration: const InputDecoration(
                    labelText: 'Preferred Move-in Date',
                    prefixIcon: Icon(Icons.calendar_today),
                    suffixIcon: Icon(Icons.arrow_drop_down),
                  ),
                  controller: TextEditingController(
                    text: _selectedMoveInDate != null
                        ? DateFormat('yyyy-MM-dd').format(_selectedMoveInDate!)
                        : '',
                  ),
                  onTap: () async {
                    final date = await showDatePicker(
                      context: context,
                      initialDate: DateTime.now().add(const Duration(days: 30)),
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (date != null) {
                      setState(() {
                        _selectedMoveInDate = date;
                      });
                    }
                  },
                  validator: (value) {
                    if (_selectedMoveInDate == null) {
                      return 'Please select a move-in date';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                
                // Budget Range
                DropdownButtonFormField<String>(
                  value: _selectedBudgetRange,
                  decoration: const InputDecoration(
                    labelText: 'Monthly Budget Range',
                    prefixIcon: Icon(Icons.attach_money),
                  ),
                  items: _budgetRanges.map((range) => DropdownMenuItem(
                    value: range,
                    child: Text(range),
                  )).toList(),
                  onChanged: (value) {
                    setState(() {
                      _selectedBudgetRange = value;
                    });
                  },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please select your budget range';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                
                // Message
                TextFormField(
                  controller: _messageController,
                  decoration: const InputDecoration(
                    labelText: 'Message to Landlord',
                    hintText: 'Tell the landlord about yourself, your study habits, lifestyle, and why you\'d be a great roommate...',
                    prefixIcon: Icon(Icons.message),
                    alignLabelWithHint: true,
                  ),
                  maxLines: 6,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please write a message to the landlord';
                    }
                    if (value.trim().length < 50) {
                      return 'Please provide a more detailed message (at least 50 characters)';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 24),
                
                // Tips Card
                Card(
                  color: Colors.blue[50],
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.lightbulb, color: Colors.blue[700], size: 20),
                            const SizedBox(width: 8),
                            Text(
                              'Application Tips',
                              style: TextStyle(
                                fontWeight: FontWeight.w600,
                                color: Colors.blue[700],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '• Mention your university and field of study\n'
                          '• Describe your lifestyle and study habits\n'
                          '• Explain why you\'d be a good roommate\n'
                          '• Include any relevant experience with shared living',
                          style: TextStyle(
                            color: Colors.blue[700],
                            fontSize: 14,
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSubmitButton() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.2),
            spreadRadius: 1,
            blurRadius: 5,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _isSubmitting ? null : _submitApplication,
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
            child: _isSubmitting
                ? const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      ),
                      SizedBox(width: 12),
                      Text('Submitting...'),
                    ],
                  )
                : const Text('Submit Application'),
          ),
        ),
      ),
    );
  }

  Future<void> _submitApplication() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    try {
      await ApiService.createApplication(
        accommodationId: widget.accommodationId,
        applicantId: 1, // TODO: Use actual logged-in user ID
        message: _messageController.text.trim(),
        preferredMoveInDate: _selectedMoveInDate!,
        budgetRange: _selectedBudgetRange!,
      );

      widget.onSuccess();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to submit application: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }
}
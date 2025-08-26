import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class RentCalculatorWidget extends StatefulWidget {
  final double totalRent;
  final int totalRooms;
  final int occupiedRooms;

  const RentCalculatorWidget({
    super.key,
    required this.totalRent,
    required this.totalRooms,
    required this.occupiedRooms,
  });

  @override
  State<RentCalculatorWidget> createState() => _RentCalculatorWidgetState();
}

class _RentCalculatorWidgetState extends State<RentCalculatorWidget> {
  late TextEditingController _rentController;
  late TextEditingController _roomsController;
  
  double get customRent => double.tryParse(_rentController.text) ?? widget.totalRent;
  int get customRooms => int.tryParse(_roomsController.text) ?? widget.totalRooms;
  
  double get equalSplit => customRent / customRooms;
  double get yourShare => equalSplit;
  double get currentOccupiedShare => equalSplit * widget.occupiedRooms;
  double get availableRoomsShare => equalSplit * (widget.totalRooms - widget.occupiedRooms);

  @override
  void initState() {
    super.initState();
    _rentController = TextEditingController(text: widget.totalRent.toStringAsFixed(0));
    _roomsController = TextEditingController(text: widget.totalRooms.toString());
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.calculate, color: Colors.blue),
                const SizedBox(width: 8),
                Text(
                  'Rent Split Calculator',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            // Input Fields
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _rentController,
                    decoration: const InputDecoration(
                      labelText: 'Total Monthly Rent',
                      prefixText: 'R',
                      isDense: true,
                    ),
                    keyboardType: TextInputType.number,
                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    onChanged: (value) => setState(() {}),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: TextFormField(
                    controller: _roomsController,
                    decoration: const InputDecoration(
                      labelText: 'Total Rooms',
                      isDense: true,
                    ),
                    keyboardType: TextInputType.number,
                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    onChanged: (value) => setState(() {}),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            
            // Results
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey[200]!),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Equal Split Breakdown',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 12),
                  
                  _buildResultRow(
                    'Per room:',
                    'R${equalSplit.toStringAsFixed(0)}',
                  ),
                  
                  _buildResultRow(
                    'Current occupied (${widget.occupiedRooms} rooms):',
                    'R${currentOccupiedShare.toStringAsFixed(0)}',
                  ),
                  
                  if (widget.totalRooms > widget.occupiedRooms)
                    _buildResultRow(
                      'Available (${widget.totalRooms - widget.occupiedRooms} rooms):',
                      'R${availableRoomsShare.toStringAsFixed(0)}',
                    ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            
            // Your Share Highlight
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: theme.colorScheme.primary.withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Your Monthly Share',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'R${yourShare.toStringAsFixed(0)}',
                    style: theme.textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Based on equal split among all rooms',
                    style: TextStyle(
                      fontSize: 12,
                      color: theme.colorScheme.primary.withOpacity(0.8),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            
            // Note
            Text(
              'Note: This calculation assumes equal rent sharing. Actual arrangements may vary based on room size, amenities, and house agreements.',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: Colors.grey[600],
              fontSize: 14,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _rentController.dispose();
    _roomsController.dispose();
    super.dispose();
  }
}
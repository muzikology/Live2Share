class Accommodation {
  final int id;
  final String title;
  final String description;
  final String address;
  final String area;
  final String city;
  final String province;
  final String postalCode;
  final double monthlyRent;
  final double? deposit;
  final AccommodationType accommodationType;
  final int totalRooms;
  final int availableRooms;
  final int bathrooms;
  final bool hasWifi;
  final bool hasParking;
  final bool petsAllowed;
  final List<String> images;
  final List<String> amenities;
  final List<String> nearbyUniversities;
  final List<String> transportLinks;
  final List<String> houseRules;
  final int landlordId;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Accommodation({
    required this.id,
    required this.title,
    required this.description,
    required this.address,
    required this.area,
    required this.city,
    required this.province,
    required this.postalCode,
    required this.monthlyRent,
    this.deposit,
    required this.accommodationType,
    required this.totalRooms,
    required this.availableRooms,
    required this.bathrooms,
    required this.hasWifi,
    required this.hasParking,
    required this.petsAllowed,
    required this.images,
    required this.amenities,
    required this.nearbyUniversities,
    required this.transportLinks,
    required this.houseRules,
    required this.landlordId,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Accommodation.fromJson(Map<String, dynamic> json) {
    return Accommodation(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String,
      address: json['address'] as String,
      area: json['area'] as String,
      city: json['city'] as String,
      province: json['province'] as String,
      postalCode: json['postalCode'] as String,
      monthlyRent: double.parse(json['monthlyRent'].toString()),
      deposit: json['deposit'] != null ? double.parse(json['deposit'].toString()) : null,
      accommodationType: AccommodationType.fromString(json['accommodationType'] as String),
      totalRooms: json['totalRooms'] as int,
      availableRooms: json['availableRooms'] as int,
      bathrooms: json['bathrooms'] as int,
      hasWifi: json['hasWifi'] as bool,
      hasParking: json['hasParking'] as bool,
      petsAllowed: json['petsAllowed'] as bool,
      images: List<String>.from(json['images'] ?? []),
      amenities: List<String>.from(json['amenities'] ?? []),
      nearbyUniversities: List<String>.from(json['nearbyUniversities'] ?? []),
      transportLinks: List<String>.from(json['transportLinks'] ?? []),
      houseRules: List<String>.from(json['houseRules'] ?? []),
      landlordId: json['landlordId'] as int,
      isActive: json['isActive'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'address': address,
      'area': area,
      'city': city,
      'province': province,
      'postalCode': postalCode,
      'monthlyRent': monthlyRent,
      'deposit': deposit,
      'accommodationType': accommodationType.value,
      'totalRooms': totalRooms,
      'availableRooms': availableRooms,
      'bathrooms': bathrooms,
      'hasWifi': hasWifi,
      'hasParking': hasParking,
      'petsAllowed': petsAllowed,
      'images': images,
      'amenities': amenities,
      'nearbyUniversities': nearbyUniversities,
      'transportLinks': transportLinks,
      'houseRules': houseRules,
      'landlordId': landlordId,
      'isActive': isActive,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  double get rentPerRoom => totalRooms > 0 ? monthlyRent / totalRooms : 0.0;
}

enum AccommodationType {
  house('house', 'House'),
  apartment('apartment', 'Apartment'),
  commune('commune', 'Student Commune'),
  backyardRoom('backyard_room', 'Backyard Room');

  const AccommodationType(this.value, this.displayName);

  final String value;
  final String displayName;

  static AccommodationType fromString(String value) {
    return AccommodationType.values.firstWhere(
      (type) => type.value == value,
      orElse: () => AccommodationType.house,
    );
  }
}
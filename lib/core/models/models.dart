class User {
  final int id;
  final String username;
  final String email;
  final String firstName;
  final String lastName;
  final String? phone;
  final String userType;
  final String? university;
  final String? studyField;
  final int? yearOfStudy;
  final String? profileImage;
  final String? bio;
  final String? dateOfBirth;
  final String? gender;
  final String? nationality;
  final List<String>? lifestyle;
  final List<String>? preferences;
  final List<String>? hobbies;
  final List<String>? dietaryRestrictions;
  final String? sleepSchedule;
  final int? cleanlinessLevel;
  final int? noiseLevel;
  final String? guestPolicy;
  final bool isVerified;
  final bool isEmailVerified;
  final bool isPhoneVerified;
  final DateTime createdAt;

  User({
    required this.id,
    required this.username,
    required this.email,
    required this.firstName,
    required this.lastName,
    this.phone,
    required this.userType,
    this.university,
    this.studyField,
    this.yearOfStudy,
    this.profileImage,
    this.bio,
    this.dateOfBirth,
    this.gender,
    this.nationality,
    this.lifestyle,
    this.preferences,
    this.hobbies,
    this.dietaryRestrictions,
    this.sleepSchedule,
    this.cleanlinessLevel,
    this.noiseLevel,
    this.guestPolicy,
    required this.isVerified,
    required this.isEmailVerified,
    required this.isPhoneVerified,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      username: json['username'],
      email: json['email'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      phone: json['phone'],
      userType: json['userType'],
      university: json['university'],
      studyField: json['studyField'],
      yearOfStudy: json['yearOfStudy'],
      profileImage: json['profileImage'],
      bio: json['bio'],
      dateOfBirth: json['dateOfBirth'],
      gender: json['gender'],
      nationality: json['nationality'],
      lifestyle: json['lifestyle'] != null ? List<String>.from(json['lifestyle']) : null,
      preferences: json['preferences'] != null ? List<String>.from(json['preferences']) : null,
      hobbies: json['hobbies'] != null ? List<String>.from(json['hobbies']) : null,
      dietaryRestrictions: json['dietaryRestrictions'] != null ? List<String>.from(json['dietaryRestrictions']) : null,
      sleepSchedule: json['sleepSchedule'],
      cleanlinessLevel: json['cleanlinessLevel'],
      noiseLevel: json['noiseLevel'],
      guestPolicy: json['guestPolicy'],
      isVerified: json['isVerified'] ?? false,
      isEmailVerified: json['isEmailVerified'] ?? false,
      isPhoneVerified: json['isPhoneVerified'] ?? false,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  String get fullName => '$firstName $lastName';
}

class Accommodation {
  final int id;
  final String title;
  final String description;
  final String address;
  final String area;
  final String city;
  final String province;
  final String postalCode;
  final double? latitude;
  final double? longitude;
  final double monthlyRent;
  final double? deposit;
  final bool utilitiesIncluded;
  final double? utilitiesCost;
  final String accommodationType;
  final int totalRooms;
  final int availableRooms;
  final int bathrooms;
  final bool furnished;
  final bool hasWifi;
  final bool hasParking;
  final bool petsAllowed;
  final bool hasLaundry;
  final bool hasKitchen;
  final bool hasSecurity;
  final List<String>? images;
  final List<String>? amenities;
  final List<String>? nearbyUniversities;
  final Map<String, dynamic>? distanceToUniversities;
  final List<String>? transportLinks;
  final List<String>? houseRules;
  final int minimumStayMonths;
  final String? genderPreference;
  final bool isShared;
  final bool rentSplitEnabled;
  final double? rentPerPerson;
  final int landlordId;
  final User? landlord;
  final bool isActive;
  final int viewCount;
  final DateTime createdAt;
  final DateTime updatedAt;
  final double? distance;
  final bool? isFavorite;

  Accommodation({
    required this.id,
    required this.title,
    required this.description,
    required this.address,
    required this.area,
    required this.city,
    required this.province,
    required this.postalCode,
    this.latitude,
    this.longitude,
    required this.monthlyRent,
    this.deposit,
    required this.utilitiesIncluded,
    this.utilitiesCost,
    required this.accommodationType,
    required this.totalRooms,
    required this.availableRooms,
    required this.bathrooms,
    required this.furnished,
    required this.hasWifi,
    required this.hasParking,
    required this.petsAllowed,
    required this.hasLaundry,
    required this.hasKitchen,
    required this.hasSecurity,
    this.images,
    this.amenities,
    this.nearbyUniversities,
    this.distanceToUniversities,
    this.transportLinks,
    this.houseRules,
    required this.minimumStayMonths,
    this.genderPreference,
    required this.isShared,
    required this.rentSplitEnabled,
    this.rentPerPerson,
    required this.landlordId,
    this.landlord,
    required this.isActive,
    required this.viewCount,
    required this.createdAt,
    required this.updatedAt,
    this.distance,
    this.isFavorite,
  });

  factory Accommodation.fromJson(Map<String, dynamic> json) {
    return Accommodation(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      address: json['address'],
      area: json['area'],
      city: json['city'],
      province: json['province'],
      postalCode: json['postalCode'] ?? json['postal_code'] ?? '',
      latitude: json['latitude'] != null ? double.tryParse(json['latitude'].toString()) : null,
      longitude: json['longitude'] != null ? double.tryParse(json['longitude'].toString()) : null,
      monthlyRent: double.parse(json['monthlyRent']?.toString() ?? json['monthly_rent']?.toString() ?? '0'),
      deposit: json['deposit'] != null ? double.parse(json['deposit'].toString()) : null,
      utilitiesIncluded: json['utilitiesIncluded'] ?? json['utilities_included'] ?? false,
      utilitiesCost: json['utilitiesCost'] != null ? double.parse(json['utilitiesCost'].toString()) : null,
      accommodationType: json['accommodationType'] ?? json['accommodation_type'] ?? '',
      totalRooms: json['totalRooms'] ?? json['total_rooms'] ?? 0,
      availableRooms: json['availableRooms'] ?? json['available_rooms'] ?? 0,
      bathrooms: json['bathrooms'] ?? 0,
      furnished: json['furnished'] ?? false,
      hasWifi: json['hasWifi'] ?? json['has_wifi'] ?? false,
      hasParking: json['hasParking'] ?? json['has_parking'] ?? false,
      petsAllowed: json['petsAllowed'] ?? json['pets_allowed'] ?? false,
      hasLaundry: json['hasLaundry'] ?? json['has_laundry'] ?? false,
      hasKitchen: json['hasKitchen'] ?? json['has_kitchen'] ?? false,
      hasSecurity: json['hasSecurity'] ?? json['has_security'] ?? false,
      images: json['images'] != null ? List<String>.from(json['images']) : null,
      amenities: json['amenities'] != null ? List<String>.from(json['amenities']) : null,
      nearbyUniversities: json['nearbyUniversities'] != null ? List<String>.from(json['nearbyUniversities']) : null,
      distanceToUniversities: json['distanceToUniversities'],
      transportLinks: json['transportLinks'] != null ? List<String>.from(json['transportLinks']) : null,
      houseRules: json['houseRules'] != null ? List<String>.from(json['houseRules']) : null,
      minimumStayMonths: json['minimumStayMonths'] ?? json['minimum_stay_months'] ?? 6,
      genderPreference: json['genderPreference'] ?? json['gender_preference'],
      isShared: json['isShared'] ?? json['is_shared'] ?? false,
      rentSplitEnabled: json['rentSplitEnabled'] ?? json['rent_split_enabled'] ?? false,
      rentPerPerson: json['rentPerPerson'] != null ? double.parse(json['rentPerPerson'].toString()) : null,
      landlordId: json['landlordId'] ?? json['landlord_id'] ?? 0,
      landlord: json['landlord'] != null ? User.fromJson(json['landlord']) : null,
      isActive: json['isActive'] ?? json['is_active'] ?? true,
      viewCount: json['viewCount'] ?? json['view_count'] ?? 0,
      createdAt: DateTime.parse(json['createdAt'] ?? json['created_at']),
      updatedAt: DateTime.parse(json['updatedAt'] ?? json['updated_at']),
      distance: json['distance'] != null ? double.tryParse(json['distance'].toString()) : null,
      isFavorite: json['isFavorite'],
    );
  }

  String get priceDisplay => 'R${monthlyRent.toStringAsFixed(0)}/month';
  String get locationDisplay => '$area, $city';
}

class Message {
  final int id;
  final int senderId;
  final int receiverId;
  final String content;
  final int? accommodationId;
  final bool isRead;
  final DateTime createdAt;

  Message({
    required this.id,
    required this.senderId,
    required this.receiverId,
    required this.content,
    this.accommodationId,
    required this.isRead,
    required this.createdAt,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'],
      senderId: json['senderId'],
      receiverId: json['receiverId'],
      content: json['content'],
      accommodationId: json['accommodationId'],
      isRead: json['isRead'] ?? false,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

class Conversation {
  final int partnerId;
  final User partner;
  final Message lastMessage;
  final int unreadCount;

  Conversation({
    required this.partnerId,
    required this.partner,
    required this.lastMessage,
    required this.unreadCount,
  });

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      partnerId: json['partnerId'],
      partner: User.fromJson(json['partner']),
      lastMessage: Message.fromJson(json['lastMessage']),
      unreadCount: json['unreadCount'] ?? 0,
    );
  }
}

class Review {
  final int id;
  final int userId;
  final int accommodationId;
  final double rating;
  final String comment;
  final double? cleanliness;
  final double? communication;
  final double? accuracy;
  final double? location;
  final double? valueForMoney;
  final User reviewer;
  final DateTime createdAt;

  Review({
    required this.id,
    required this.userId,
    required this.accommodationId,
    required this.rating,
    required this.comment,
    this.cleanliness,
    this.communication,
    this.accuracy,
    this.location,
    this.valueForMoney,
    required this.reviewer,
    required this.createdAt,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['id'],
      userId: json['userId'],
      accommodationId: json['accommodationId'],
      rating: double.parse(json['rating'].toString()),
      comment: json['comment'],
      cleanliness: json['cleanliness'] != null ? double.parse(json['cleanliness'].toString()) : null,
      communication: json['communication'] != null ? double.parse(json['communication'].toString()) : null,
      accuracy: json['accuracy'] != null ? double.parse(json['accuracy'].toString()) : null,
      location: json['location'] != null ? double.parse(json['location'].toString()) : null,
      valueForMoney: json['valueForMoney'] != null ? double.parse(json['valueForMoney'].toString()) : null,
      reviewer: User.fromJson(json['reviewer']),
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

class ReviewSummaryData {
  final double averageRating;
  final int totalReviews;

  ReviewSummaryData({
    required this.averageRating,
    required this.totalReviews,
  });

  factory ReviewSummaryData.fromJson(Map<String, dynamic> json) {
    return ReviewSummaryData(
      averageRating: double.parse(json['averageRating']?.toString() ?? '0'),
      totalReviews: json['totalReviews'] ?? 0,
    );
  }
}

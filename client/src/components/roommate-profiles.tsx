import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, User } from "lucide-react";

interface RoommateProfilesProps {
  roommates: Array<{
    id: number;
    monthlyShare: string;
    moveInDate: string;
    user: {
      id: number;
      firstName: string;
      lastName: string;
      university: string;
      studyField: string;
      yearOfStudy: number;
      bio?: string;
      lifestyle?: string[];
      preferences?: string[];
      profileImage?: string;
    };
  }>;
}

export default function RoommateProfiles({ roommates }: RoommateProfilesProps) {
  if (!roommates || roommates.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Current Roommates ({roommates.length})
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roommates.map((roommate) => (
          <Card key={roommate.id} className="p-4">
            <div className="flex items-start space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={roommate.user.profileImage} />
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {roommate.user.firstName} {roommate.user.lastName}
                  </h3>
                  {roommate.user.university !== "N/A - Landlord" && (
                    <Badge variant="outline" className="text-xs">
                      Year {roommate.user.yearOfStudy}
                    </Badge>
                  )}
                </div>
                
                {roommate.user.university !== "N/A - Landlord" && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <GraduationCap className="w-4 h-4 mr-1" />
                    <span>{roommate.user.studyField} at {roommate.user.university.replace("University of the ", "").replace("University of ", "").replace("University", "Uni")}</span>
                  </div>
                )}
                
                {roommate.user.bio && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                    {roommate.user.bio}
                  </p>
                )}
                
                {roommate.user.lifestyle && roommate.user.lifestyle.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Lifestyle:</p>
                    <div className="flex flex-wrap gap-1">
                      {roommate.user.lifestyle.slice(0, 3).map((trait, index) => (
                        <Badge key={index} variant="secondary" className="text-xs capitalize">
                          {trait.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Pays: R{parseFloat(roommate.monthlyShare).toLocaleString()}/month
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Since: {new Date(roommate.moveInDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
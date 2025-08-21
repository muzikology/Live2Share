import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

interface RentSplitCalculatorProps {
  totalRent: number;
  totalRooms: number;
  occupiedRooms: number;
}

export default function RentSplitCalculator({ 
  totalRent, 
  totalRooms, 
  occupiedRooms 
}: RentSplitCalculatorProps) {
  const [customRent, setCustomRent] = useState(totalRent);
  const [customRooms, setCustomRooms] = useState(totalRooms);
  const [splitMethod, setSplitMethod] = useState<"equal" | "custom">("equal");

  useEffect(() => {
    setCustomRent(totalRent);
    setCustomRooms(totalRooms);
  }, [totalRent, totalRooms]);

  const equalSplit = customRent / customRooms;
  const yourShare = equalSplit;
  const currentOccupiedShare = equalSplit * occupiedRooms;
  const availableRoomsShare = equalSplit * (totalRooms - occupiedRooms);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          Rent Split Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Monthly Rent
            </label>
            <Input
              type="number"
              value={customRent}
              onChange={(e) => setCustomRent(parseFloat(e.target.value) || 0)}
              placeholder="15000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Rooms
            </label>
            <Input
              type="number"
              value={customRooms}
              onChange={(e) => setCustomRooms(parseInt(e.target.value) || 1)}
              min="1"
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Equal Split Breakdown
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Per room:</span>
              <span className="font-medium">R{equalSplit.toFixed(0)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Current occupied ({occupiedRooms} rooms):
              </span>
              <span className="font-medium">R{currentOccupiedShare.toFixed(0)}</span>
            </div>
            
            {totalRooms > occupiedRooms && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Available ({totalRooms - occupiedRooms} rooms):
                </span>
                <span className="font-medium">R{availableRoomsShare.toFixed(0)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
            Your Monthly Share
          </h5>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            R{yourShare.toFixed(0)}
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Based on equal split among all rooms
          </p>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>
            <strong>Note:</strong> This calculation assumes equal rent sharing. 
            Actual arrangements may vary based on room size, amenities, and house agreements.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
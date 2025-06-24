import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { calculateMonthlyPayment } from "@/lib/calculations";

interface MortgageCalculatorProps {
  propertyPrice?: number;
}

export default function MortgageCalculator({ propertyPrice }: MortgageCalculatorProps) {
  const [inputs, setInputs] = useState({
    homePrice: propertyPrice?.toString() || "",
    downPayment: "",
    loanTerm: "30",
    interestRate: "6.5",
  });
  
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const handleCalculate = () => {
    const homePrice = parseFloat(inputs.homePrice);
    const downPayment = parseFloat(inputs.downPayment) || 0;
    const loanTerm = parseInt(inputs.loanTerm);
    const interestRate = parseFloat(inputs.interestRate);

    if (homePrice > 0 && loanTerm > 0 && interestRate > 0) {
      const payment = calculateMonthlyPayment(
        homePrice - downPayment,
        interestRate,
        loanTerm
      );
      setMonthlyPayment(payment);
    }
  };

  const updateInput = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          Mortgage Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="homePrice">Home Price</Label>
          <Input
            id="homePrice"
            type="number"
            placeholder="Enter home price"
            value={inputs.homePrice}
            onChange={(e) => updateInput("homePrice", e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="downPayment">Down Payment</Label>
          <Input
            id="downPayment"
            type="number"
            placeholder="Enter down payment"
            value={inputs.downPayment}
            onChange={(e) => updateInput("downPayment", e.target.value)}
          />
        </div>
        
        <div>
          <Label>Loan Term</Label>
          <Select value={inputs.loanTerm} onValueChange={(value) => updateInput("loanTerm", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 years</SelectItem>
              <SelectItem value="30">30 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input
            id="interestRate"
            type="number"
            step="0.01"
            placeholder="6.5"
            value={inputs.interestRate}
            onChange={(e) => updateInput("interestRate", e.target.value)}
          />
        </div>
        
        <Button onClick={handleCalculate} className="w-full">
          Calculate Payment
        </Button>
        
        {monthlyPayment !== null && (
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <div className="text-sm text-gray-600">Monthly Payment</div>
            <div className="text-2xl font-bold text-primary">
              ${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

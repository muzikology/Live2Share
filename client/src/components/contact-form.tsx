import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { InsertInquiry } from "@shared/schema";

interface ContactFormProps {
  propertyId: number;
  propertyTitle?: string;
}

export default function ContactForm({ propertyId, propertyTitle }: ContactFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    inquiryType: "general",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitInquiry = useMutation({
    mutationFn: async (data: InsertInquiry) => {
      return await apiRequest("POST", "/api/inquiries", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you soon.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        inquiryType: "general",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}/inquiries`] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const inquiryData: InsertInquiry = {
      propertyId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || null,
      message: formData.message,
      inquiryType: formData.inquiryType,
    };

    submitInquiry.mutate(inquiryData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Agent</CardTitle>
        {propertyTitle && (
          <p className="text-sm text-muted-foreground">
            Inquiring about: {propertyTitle}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>
          
          <div>
            <Label>I'm interested in</Label>
            <Select value={formData.inquiryType} onValueChange={(value) => updateField("inquiryType", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewing">Scheduling a viewing</SelectItem>
                <SelectItem value="purchase">Purchasing this property</SelectItem>
                <SelectItem value="rental">Renting this property</SelectItem>
                <SelectItem value="general">General inquiry</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              rows={4}
              placeholder="Tell us about your property needs..."
              value={formData.message}
              onChange={(e) => updateField("message", e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={submitInquiry.isPending}
          >
            {submitInquiry.isPending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertApplicationSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const formSchema = insertApplicationSchema.extend({
  preferredMoveInDate: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface ApplicationFormProps {
  accommodationId: number;
}

export default function ApplicationForm({ accommodationId }: ApplicationFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accommodationId,
      applicantId: 1,
      message: "",
      preferredMoveInDate: "",
      budgetRange: "",
      status: "pending",
    },
  });

  const createApplication = useMutation({
    mutationFn: async (data: FormData) => {
      const applicationData = {
        ...data,
        preferredMoveInDate: new Date(data.preferredMoveInDate),
      };
      
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit application");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/accommodations/${accommodationId}/applications`] });
      toast({
        title: "Application Submitted!",
        description: "Your application has been sent to the landlord. They will contact you soon.",
      });
      setIsSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createApplication.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-4">
        <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
          Application Submitted!
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          The landlord will review your application and contact you soon.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Apply for this Accommodation
        </h3>
        
        <FormField
          control={form.control}
          name="preferredMoveInDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Move-in Date</FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budgetRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Budget Range</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your budget" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="R2000-R4000">R2,000 - R4,000</SelectItem>
                  <SelectItem value="R4000-R6000">R4,000 - R6,000</SelectItem>
                  <SelectItem value="R6000-R8000">R6,000 - R8,000</SelectItem>
                  <SelectItem value="R8000-R10000">R8,000 - R10,000</SelectItem>
                  <SelectItem value="R10000+">R10,000+</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message to Landlord</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell the landlord about yourself, your study habits, lifestyle, and why you'd be a great roommate..."
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={createApplication.isPending}
        >
          {createApplication.isPending ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  );
}
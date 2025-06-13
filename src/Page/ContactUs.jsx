import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import React from "react";
import { Button } from "@/components/ui/button";

const Support = () => {
  return (
    <div className="w-full max-w-2xl mx-auto  ">
      <div className="bg-white dark:bg-muted  rounded-2xl p-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground ">Contact Support </h2>
          <p className="mt-2 text-muted-foreground text-sm">
            We're here to help. Please fill out the form and our team will get back to you soon.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullname" className="text-sm font-medium text-muted-foreground">
              Full Name
            </Label>
            <Input
              id="firstName"
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" required className="text-sm font-medium text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-sm font-medium text-muted-foreground">
              Feedback
            </Label>
            <Textarea
              id="feedback"
              placeholder="Write your feedback..."
              className="w-full min-h-[120px] rounded-lg border border-input bg-background px-4 py-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/50 transition resize-none"
            />
          </div>

          {/* Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full text-white  uppercase bg-green-500 hover:bg-green-600 rounded-lg px-6 py-3 text-sm font-semibold shadow-md transition"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default Support;
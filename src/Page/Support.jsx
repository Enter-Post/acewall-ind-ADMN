import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/AxiosInstance";

const Support = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    feedback: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axiosInstance.post("/support/send", formData);
      setMessage(res.data.message);
      setFormData({ fullName: "", email: "", feedback: "" });
      console.log(res.data.message);
      
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-muted rounded-2xl p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground">Contact Support</h2>
          <p className="mt-2 text-muted-foreground text-sm">
            We're here to help. Please fill out the form and our team will get back to you soon.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea name="feedback" value={formData.feedback} onChange={handleChange} required />
          </div>

          {message && <p className="text-sm text-center">{message}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Support;
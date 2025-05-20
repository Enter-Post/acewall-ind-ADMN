import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { toast } from "sonner";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!captchaValue) {
      toast.error("Please verify that you are not a robot");
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      alert("Form submitted successfully!");
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setCaptchaValue(null);
    }, 1000);
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto shadow-lg">
      {/* Left sidebar */}
      <div className="bg-green-700 text-white p-8 md:w-2/5">
        <h1 className="text-3xl font-bold mb-6">Please Contact Us:</h1>

        <div className="mb-6">
          <p className="font-semibold">Address:</p>
          <p>Acewall Scholars</p>
          <p>P.O. Box 445</p>
          <p>Powhatan, VA 23139</p>
        </div>

        <div className="mb-6">
          <p className="font-semibold">Phone Number:</p>
          <a href="tel:8044647926" className="text-green-300 hover:underline">
            (804) 464-7926
          </a>
        </div>

        <div>
          <p className="font-semibold mb-3">Follow Us</p>
          <div className="flex space-x-2">
            <a
              href="#"
              className="bg-green-600 p-2 rounded-full hover:bg-green-500 transition-colors"
            >
              <Mail size={20} />
              <span className="sr-only ">Email</span>
            </a>
            <a
              href="#"
              className="bg-green-600 p-2 rounded-full hover:bg-green-500 transition-colors"
            >
              <Facebook size={20} />
              <span className="sr-only">Facebook</span>
            </a>
            <a
              href="#"
              className="bg-green-600 p-2 rounded-full hover:bg-green-500 transition-colors"
            >
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="#"
              className="bg-green-600 p-2 rounded-full hover:bg-green-500 transition-colors"
            >
              <Instagram size={20} />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="#"
              className="bg-green-600 p-2 rounded-full hover:bg-green-500 transition-colors"
            >
              <Youtube size={20} />
              <span className="sr-only">YouTube</span>
            </a>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="p-8 md:w-3/5 bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John doe"
              required
              className="border-gray-300 focus:border-green-500 placeholder:text-white-100 "
            />
          </div>

          <div>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="johndoe001@gmail.com"
              required
              className="border-gray-300 focus:border-green-500 placeholder:text-white-100"
            />
          </div>

          <div>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel"
              placeholder="(123) 456-7890"
              className="border-gray-300 focus:border-green-500 placeholder:text-white-100"
            />
          </div>

          <div>
            <Input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Chemistry"
              required
              className="border-gray-300 focus:border-green-500 placeholder:text-white-100"
            />
          </div>

          <div>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message*"
              required
              className="min-h-[120px] border-gray-300 focus:border-green-500 placeholder:text-white-100"
            />
          </div>
{/* 
          <div className="text-sm text-gray-700 whitespace-nowrap overflow-x-auto">
            <p className="inline">
              By clicking submit, I agree to the{" "}
              <span className="inline cursor-pointer underline text-green-600">
                <TermsModal style="text-green-600" />
              </span>{" "}
              and{" "}
              <span className="inline cursor-pointer underline text-green-600">
                <PrivacyPolicy style="text-green-600" />
              </span>{" "}
              provided by the company. By providing my phone number and email, I
              agree to receive text messages and emails from Acewall Scholars.
              Data rates may apply.
            </p>
          </div> */}
{/* 
          <div className="py-2">
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // This is Google's test key
              onChange={handleCaptchaChange}
            />
          </div> */}

          <div>
            <Button
              type="submit"
              // disabled={isSubmitting || !captchaValue}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3"
            >
              {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

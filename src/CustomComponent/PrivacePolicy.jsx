import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PrivacyPolicy({ style }) {
  // const [open, setOpen] = useState(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className={`${style}`} >
          Privacy Policy
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            Privacy Policy
          </DialogTitle>
          <DialogDescription>
            Last updated {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh]">
          <div className="text-sm leading-6 pr-4">
            <p className="mb-4">
              This Privacy Notice for Acewall Scholars ("we," "us," or "our")
              describes how and why we might access, collect, store, use, and
              share ("process") your personal information when you use our
              services ("Services"), including when you:
            </p>
            <ul className="list-disc list-inside mb-6">
              <li>
                Visit our website at{" "}
                <a
                  href="https://www.acewallscholars.org"
                  className="text-blue-500"
                >
                  acewallscholars.org
                </a>
                .
              </li>
              <li>
                Engage with us in other related ways, including any sales,
                marketing, or events.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">
              Summary of Key Points
            </h2>
            <p className="mb-4">
              What personal information do we process? When you visit, use, or
              navigate our Services, we may process personal information
              depending on how you interact with us, the choices you make, and
              the products and features you use.
            </p>
            <p className="mb-4">
              Do we process any sensitive personal information? No, we do not
              process sensitive personal information.
            </p>
            <p className="mb-4">
              Do we collect any information from third parties? We may collect
              information from public databases, marketing partners, social
              media platforms, and other sources.
            </p>
            <p className="mb-4">
              How do we process your information? We process your information to
              provide, improve, and administer our Services, communicate with
              you, ensure security, and comply with the law.
            </p>
            <p className="mb-4">
              In what situations and with whom do we share personal information?
              We share information in specific situations with certain third
              parties.
            </p>
            <p className="mb-4">
              What are your rights? Depending on your location, you may have
              specific rights regarding your personal information.
            </p>
            <p className="mb-4">
              How do you exercise your rights? The easiest way is by submitting
              a data subject access request or contacting us directly.
            </p>
            <p className="mb-6">
              For more details, please refer to the full Privacy Notice below.
            </p>

            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <ol className="list-decimal list-inside mb-6">
              <li>What information do we collect?</li>
              <li>How do we process your information?</li>
              <li>
                What legal bases do we rely on to process your personal
                information?
              </li>
              <li>When and with whom do we share your personal information?</li>
              <li>Do we use cookies and other tracking technologies?</li>
              <li>How do we handle your social logins?</li>
              <li>Is your information transferred internationally?</li>
              <li>How long do we keep your information?</li>
              <li>Do we collect information from minors?</li>
              <li>What are your privacy rights?</li>
              <li>Controls for do-not-track features.</li>
              <li>Do United States residents have specific privacy rights?</li>
              <li>Do we make updates to this notice?</li>
              <li>How can you contact us about this notice?</li>
              <li>
                How can you review, update, or delete the data we collect from
                you?
              </li>
            </ol>

            <h2 className="text-xl font-semibold mb-4">
              What Information Do We Collect?
            </h2>
            <p className="mb-4">
              We collect personal information you disclose to us when you:
            </p>
            <ul className="list-disc list-inside mb-6">
              <li>Register on the Services</li>
              <li>
                Express interest in obtaining information about our products or
                Services
              </li>
              <li>Participate in activities on the Services</li>
              <li>Contact us directly</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">
              How Do We Process Your Information?
            </h2>
            <p className="mb-6">
              We process your information to facilitate account creation and
              authentication, improve and personalize our Services, understand
              how users interact with our Services, ensure security, and comply
              with legal obligations.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              Legal Bases for Processing
            </h2>
            <ul className="list-disc list-inside mb-6">
              <li>Names</li>
              <li>Phone numbers</li>
              <li>Email addresses</li>
              <li>Mailing addresses</li>
              <li>Billing addresses</li>
              <li>Contact preferences</li>
              <li>Information automatically collected</li>
            </ul>
            <p className="mb-4">
              Certain information is collected automatically when you visit our
              Services, including:
            </p>
            <ul className="list-disc list-inside mb-6">
              <li>IP address</li>
              <li>Browser and device characteristics</li>
              <li>Operating system</li>
              <li>Language preferences</li>
              <li>Referring URLs</li>
              <li>Location and other technical information</li>
            </ul>
            <p className="mb-6">
              Like many businesses, we collect this information through cookies
              and similar technologies.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              Sharing Your Information
            </h2>
            <ul className="list-disc list-inside mb-6">
              <li>Service Providers</li>
              <li>Business Transfers</li>
              <li>Legal Compliance</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">
              Use of Cookies and Tracking Technologies
            </h2>
            <p className="mb-6">
              We use cookies and similar technologies to enhance user
              experience, analyze traffic, and improve our Services. You can
              manage your cookie preferences through browser settings.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              Handling Social Logins
            </h2>
            <p className="mb-6">
              If you log in through social media, we receive profile information
              like your name, email address, and profile picture for
              authentication and account management.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              International Data Transfers
            </h2>
            <p className="mb-6">
              We may transfer, store, and process your information in countries
              outside your residence. If you are in the EEA, we ensure your data
              is protected according to applicable regulations.
            </p>

            <h2 className="text-xl font-semibold mb-4">Retention Period</h2>
            <p className="mb-6">
              We retain your personal information as long as necessary to
              fulfill the purposes outlined in this Privacy Policy or as
              required by law.
            </p>

            <h2 className="text-xl font-semibold mb-4">Data from Minors</h2>
            <p className="mb-6">
              Our Services are not intended for children under 18. We do not
              knowingly collect data from minors.
            </p>

            <h2 className="text-xl font-semibold mb-4">Your Privacy Rights</h2>
            <ul className="list-disc list-inside mb-6">
              <li>Access & Data Portability</li>
              <li>Correction</li>
              <li>Deletion</li>
              <li>Restriction</li>
              <li>Objection</li>
              <li>Withdraw Consent</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p>
              Acewall Scholars
              <br />
              1072 Timber Trace Road, Powhatan, VA 23139, United States
              <br />
              Email:{" "}
              <a
                href="mailto:contact@acewallscholars.org"
                className="text-blue-500"
              >
                contact@acewallscholars.org
              </a>
              <br />
              Phone: (+1) 804-615-1845
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

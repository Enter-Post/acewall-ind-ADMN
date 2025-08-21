"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TermsModal({ style }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className={`${style}`} variant="outline">
          Terms of Service
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            Terms and Conditions
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
            <strong>AGREEMENT TO OUR LEGAL TERMS</strong>
            <br />
            We are Acewall Scholars ("Company," "we," "us," "our"). We operate
            the website{" "}
            <a
              href="https://www.acewallscholars.org"
              className="text-blue-600 underline"
            >
              https://www.acewallscholars.org
            </a>{" "}
            (the "Site"), as well as any other related products and services
            that refer or link to these legal terms (the "Legal Terms")
            (collectively, the "Services").
            <br />
            <br />
            You can contact us by phone at (804) 464-7926., email at{" "}
            <a
              href="mailto:contact@acewallscholars.org"
              className="text-blue-600 underline"
            >
              contact@acewallscholars.org
            </a>
            , or by mail to 1072 Timber Trace Road, Powhatan, VA 23139, United
            States.
            <br />
            <br />
            These Legal Terms constitute a legally binding agreement made
            between you, whether personally or on behalf of an entity ("you"),
            and Acewall Scholars, concerning your access to and use of the
            Services. By accessing the Services, you agree to be bound by these
            Legal Terms. If you do not agree, you must discontinue use
            immediately.
            <br />
            <br />
            We reserve the right to modify these Legal Terms at any time.
            Changes will be indicated by an updated "Last updated" date. Your
            continued use of the Services after such modifications means you
            accept the changes.
            <br />
            <br />
            The Services are intended for users who are at least 18 years old.
            Persons under the age of 18 are not permitted to use or register for
            the Services.
            <br />
            <br />
            It is recommended that you print a copy of these Legal Terms for
            your records.
            <br />
            <br />
            <strong>TABLE OF CONTENTS</strong>
            <ul className="list-disc pl-8 mt-2">
              <li>OUR SERVICES</li>
              <li>INTELLECTUAL PROPERTY RIGHTS</li>
              <li>USER REPRESENTATIONS</li>
              <li>USER REGISTRATION</li>
              <li>PURCHASES AND PAYMENT</li>
              <li>SUBSCRIPTIONS</li>
              <li>POLICY</li>
              <li>PROHIBITED ACTIVITIES</li>
              <li>USER GENERATED CONTRIBUTIONS</li>
              <li>CONTRIBUTION LICENSE</li>
              <li>GUIDELINES FOR REVIEWS</li>
              <li>THIRD-PARTY WEBSITES AND CONTENT</li>
              <li>SERVICES MANAGEMENT</li>
              <li>PRIVACY POLICY</li>
              <li>TERM AND TERMINATION</li>
              <li>MODIFICATIONS AND INTERRUPTIONS</li>
              <li>GOVERNING LAW</li>
              <li>DISPUTE RESOLUTION</li>
              <li>CORRECTIONS</li>
              <li>DISCLAIMER</li>
              <li>LIMITATIONS OF LIABILITY</li>
              <li>INDEMNIFICATION</li>
              <li>USER DATA</li>
              <li>ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</li>
              <li>SMS TEXT MESSAGING</li>
              <li>CALIFORNIA USERS AND RESIDENTS</li>
              <li>MISCELLANEOUS</li>
              <li>CONTACT US</li>
            </ul>
            <br />
            <strong>1. OUR SERVICES</strong>
            <br />
            The information provided in the Services is not intended for
            distribution or use in any jurisdiction or country where such
            distribution or use would violate local laws. Users accessing the
            Services from other locations do so at their own risk.
            <br />
            <br />
            The Services are not designed to comply with industry-specific
            regulations such as HIPAA or FISMA. If your interactions would be
            subject to such laws, you may not use the Services.
            <br />
            <br />
            <strong>2. INTELLECTUAL PROPERTY RIGHTS</strong>
            <br />
            We own or hold licenses for all intellectual property rights related
            to our Services, including code, databases, software, website
            designs, text, images, and trademarks.
            <br />
            <br />
            Our content is protected by copyright and trademark laws. The
            materials in the Services are provided "AS IS" for personal,
            non-commercial use only.
            <br />
            <br />
            Users may not copy, reproduce, distribute, or exploit any content
            without prior written permission.
            <br />
            <br />
            If you wish to use our Services, Content, or Marks beyond the
            permitted use, contact us at{" "}
            <a
              href="mailto:contact@acewallscholars.org"
              className="text-blue-600 underline"
            >
              contact@acewallscholars.org
            </a>
            .
            <br />
            <br />
            Any breach of our intellectual property rights will result in
            immediate termination of access to the Services.
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

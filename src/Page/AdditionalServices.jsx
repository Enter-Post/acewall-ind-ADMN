import { LandingPageCard } from "@/CustomComponent/Card";
import React from "react";

const cardData = [
  {
    name: "Academic Tutoring",
    description:
      "Acewall Scholars offers one-on-one tutoring services to support students in their academic journey. Our experienced tutors provide personalized instruction and guidance to help students succeed.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/AdobeStock_357701907-1920w.jpeg",
    buttonUrl: "https://www.acewallscholars.org/academic-tutoring ",
  },

  {
    name: "Mentoring and Mental Health Support - a 360° approach",
    description:
      "Acewall Scholars offers a 360° approach to mentoring and mental health support. Our experienced mentors and mental health professionals provide personalized support and guidance to help students succeed.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/AdobeStock_355386233-834697fd-1920w.jpeg",
    buttonUrl: "https://www.acewallscholars.org/mentoring",
  },
  {
    name: "Parent Aide",
    description:
      "Acewall Scholars offers The Holistic Parent Aid program. This program falls within our mentoring department. Our Parenting progam offers Acewall Scholars will assist students with finding summer programs, internships, and/or apprenticeships, ",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/shutterstock_2329065089-1920w.jpg",
    buttonUrl: "https://www.acewallscholars.org/parent-aide",
  },
  {
    name: "Test Prep",
    description:
      "Acewall Scholars offers test preparation services to support students in their academic journey. Our experienced tutors provide personalized instruction and guidance to help students succeed.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/row-students-doing-exam-1920w.jpg",
    buttonUrl: "https://www.acewallscholars.org/test-prep",
  },
  {
    name: "Internship Support/Placement",
    description:
      "Acewall Scholars offers internship support and placement services to support students in their academic journey. Our experienced mentors and career counselors provide personalized support and guidance to help students succeed.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/internship+support-placement-1920w.jpg",
    buttonUrl: "https://www.acewallscholars.org/internship-support/placement",
  },

  {
    name: "College Counseling",
    description:
      "Our college counseling service assists and empowers both students and parents by providing the necessary guidance and information to assist in navigating the college process. necessary guidance and information to assist in navigating the college process. ",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/college+counseling-1920w.jpg",
    buttonUrl: "https://www.acewallscholars.org/college-counseling",
  },
];

const AdditionalServices = () => {
  return (
    <section className="flex justify-center flex-col items-center ">
     <div className=" w-[90%] text-center ">
          <p className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg">Additional Services</p>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-between gap-2 p-3 w-[80%]">
        
        {cardData.map((card, index) => (
          <LandingPageCard
            key={index}
            name={card.name}
            description={card.description}
            imageUrl={card.imageUrl}
            buttonUrl={card.buttonUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default AdditionalServices;

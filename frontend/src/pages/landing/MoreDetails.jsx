import { useEffect, useState } from "react";
import CourseSection from "./CourseSection";
import SuccessStories from "./SuccessStories";
import HiringPartner from "./HiringPartner";
import WorkingProfessional from "./WorkingProfessional";
import EnquiryForm from "./EnquiryForm";
import FutureLearning from "./FutureLearning";
import About from "./About";
import courseService from "../../services/courseService";
import AwardSection from "./AwardSection";
import TechMastery from "./TechMastery";
import TechOrbit from "./TechOrbit";
import ImpactRoadmap from "./ImpactRoadmap";
import XynapseSection from "./XynapseSection";

const MoreDetails = () => {
  const [topCourses, setTopCourses] = useState([]);
  const [topCoursesLoading, setTopCoursesLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadTopCourses() {
      setTopCoursesLoading(true);
      try {
        const data = await courseService.getAllCourses();
        console.log(data);
        if (mounted) setTopCourses(data.data || []);
      } catch (err) {
        console.warn("Failed to load top courses", err);
        if (mounted) setTopCourses([]);
      } finally {
        if (mounted) setTopCoursesLoading(false);
      }
    }

    loadTopCourses();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div>
      <XynapseSection/>
      <TechMastery/>
      <br />
      <br />
      <TechOrbit/>
      <ImpactRoadmap/>
      <CourseSection
        topCoursesLoading={topCoursesLoading}
        topCourses={topCourses}
      />

      <SuccessStories />

      <HiringPartner />

      <WorkingProfessional />

      <EnquiryForm />

      <FutureLearning />

      <AwardSection />

      <About />
    </div>
  );
};

export default MoreDetails;

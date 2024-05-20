"use client";

import { useAssessments } from "@/stores/useAssessments";

export const ViewButton = ({ assessmentId }: { assessmentId: number }) => {
  const { setViewModalOpen, getAssessment } = useAssessments();

  const handleOnClick = async () => {
    console.log("assessmentId", assessmentId);
    await getAssessment(assessmentId);
    setViewModalOpen(true);
  };

  return <button onClick={() => handleOnClick()}>View</button>;
};

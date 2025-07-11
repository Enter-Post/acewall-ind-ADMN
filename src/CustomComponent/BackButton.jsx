// src/components/BackButton.jsx

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button"; // Adjust path if needed

const BackButton = ({ label = "Back", className = "" }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft size={16} />
      {label}
    </Button>
  );
};

export default BackButton;

import { useResumeStore } from "../../store/ResumeStore";
import MinimalTemplate from "../Templates/MinimalTemplate";
import CorporateTemplate from "../Templates/CorporateTemplate";
import ModernTemplate from "../Templates/ModernTemplate";
import ATSTemplate from "../Templates/ATSTemplate";

const TEMPLATES = {
  minimal: MinimalTemplate,
  corporate: CorporateTemplate,
  modern: ModernTemplate,
  ats: ATSTemplate,
};

export default function ResumePreview() {
  const { resume, activeTemplate } = useResumeStore();
  const Template = TEMPLATES[activeTemplate] || MinimalTemplate;
  return <Template resume={resume} />;
}
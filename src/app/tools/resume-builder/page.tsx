"use client";

import { useState, useRef } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("resume-builder")!;

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export default function ResumeBuilderPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([
    { id: "1", title: "", company: "", period: "", description: "" },
  ]);
  const [education, setEducation] = useState<Education[]>([
    { id: "1", degree: "", school: "", year: "" },
  ]);
  const [template, setTemplate] = useState<"clean" | "modern" | "bold">("clean");
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now().toString(), title: "", company: "", period: "", description: "" }]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const removeExperience = (id: string) => {
    if (experiences.length === 1) return;
    setExperiences(experiences.filter((e) => e.id !== id));
  };

  const addEducation = () => {
    setEducation([...education, { id: Date.now().toString(), degree: "", school: "", year: "" }]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const removeEducation = (id: string) => {
    if (education.length === 1) return;
    setEducation(education.filter((e) => e.id !== id));
  };

  const handlePrint = () => {
    setShowPreview(true);
    setTimeout(() => window.print(), 300);
  };

  const inputClass = "w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";

  const templateStyles = {
    clean: { accent: "#2563eb", font: "'Segoe UI', sans-serif" },
    modern: { accent: "#059669", font: "'Helvetica Neue', sans-serif" },
    bold: { accent: "#dc2626", font: "Georgia, serif" },
  };

  const style = templateStyles[template];

  return (
    <ToolPageLayout tool={tool}>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #resume-preview, #resume-preview * { visibility: visible; }
          #resume-preview { position: absolute; left: 0; top: 0; width: 100%; padding: 40px; }
          header, footer, nav { display: none !important; }
        }
      `}</style>

      <div className="space-y-6">
        {/* Template Selector */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Choose Template</h3>
          <div className="grid grid-cols-3 gap-3">
            {([
              { id: "clean" as const, label: "Clean", color: "blue" },
              { id: "modern" as const, label: "Modern", color: "green" },
              { id: "bold" as const, label: "Bold", color: "red" },
            ]).map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`rounded-xl border-2 p-4 text-center transition-all ${
                  template === t.id
                    ? `border-${t.color}-500 bg-${t.color}-50`
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`h-2 w-12 mx-auto rounded-full mb-2`} style={{ backgroundColor: templateStyles[t.id].accent }} />
                <span className="text-sm font-medium text-gray-700">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Personal Info */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 890" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="New York, NY" className={inputClass} />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelClass}>Professional Summary</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief overview of your experience and goals..." rows={3} className={inputClass + " resize-none"} />
          </div>
        </div>

        {/* Experience */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Work Experience</h3>
          <div className="space-y-6">
            {experiences.map((exp, i) => (
              <div key={exp.id} className="rounded-xl border border-gray-200 p-4 relative">
                {experiences.length > 1 && (
                  <button onClick={() => removeExperience(exp.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Job Title</label>
                    <input type="text" value={exp.title} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} placeholder="Software Engineer" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Company</label>
                    <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} placeholder="Google" className={inputClass} />
                  </div>
                </div>
                <div className="mt-3">
                  <label className={labelClass}>Period</label>
                  <input type="text" value={exp.period} onChange={(e) => updateExperience(exp.id, "period", e.target.value)} placeholder="Jan 2022 — Present" className={inputClass} />
                </div>
                <div className="mt-3">
                  <label className={labelClass}>Description</label>
                  <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} placeholder="Key responsibilities and achievements..." rows={3} className={inputClass + " resize-none"} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={addExperience} className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Experience
          </button>
        </div>

        {/* Education */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Education</h3>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="rounded-xl border border-gray-200 p-4 relative">
                {education.length > 1 && (
                  <button onClick={() => removeEducation(edu.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Degree</label>
                    <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} placeholder="B.Sc. Computer Science" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>School</label>
                    <input type="text" value={edu.school} onChange={(e) => updateEducation(edu.id, "school", e.target.value)} placeholder="MIT" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Year</label>
                    <input type="text" value={edu.year} onChange={(e) => updateEducation(edu.id, "year", e.target.value)} placeholder="2018 — 2022" className={inputClass} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addEducation} className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Education
          </button>
        </div>

        {/* Skills */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Skills</h3>
          <textarea value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="JavaScript, React, Node.js, Python, SQL, Project Management..." rows={2} className={inputClass + " resize-none"} />
          <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={handlePrint} className="btn-primary flex-1 py-4 text-base">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download as PDF
          </button>
          <button onClick={() => setShowPreview(!showPreview)} className="btn-secondary py-4 px-6">
            {showPreview ? "Hide Preview" : "Preview"}
          </button>
        </div>

        {/* Preview */}
        {showPreview && (
          <div id="resume-preview" ref={previewRef} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div style={{ fontFamily: style.font, padding: "48px", maxWidth: "800px", margin: "0 auto" }}>
              {/* Header */}
              <div style={{ borderBottom: `3px solid ${style.accent}`, paddingBottom: "16px", marginBottom: "24px" }}>
                <h1 style={{ fontSize: "28pt", fontWeight: 700, color: "#111", margin: 0 }}>
                  {name || "Your Name"}
                </h1>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "8px", fontSize: "10pt", color: "#666" }}>
                  {email && <span>{email}</span>}
                  {phone && <span>{phone}</span>}
                  {location && <span>{location}</span>}
                </div>
              </div>

              {/* Summary */}
              {summary && (
                <div style={{ marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "12pt", fontWeight: 700, color: style.accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                    Professional Summary
                  </h2>
                  <p style={{ fontSize: "10pt", color: "#444", lineHeight: 1.6 }}>{summary}</p>
                </div>
              )}

              {/* Experience */}
              {experiences.some((e) => e.title || e.company) && (
                <div style={{ marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "12pt", fontWeight: 700, color: style.accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                    Work Experience
                  </h2>
                  {experiences.filter((e) => e.title || e.company).map((exp) => (
                    <div key={exp.id} style={{ marginBottom: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <h3 style={{ fontSize: "11pt", fontWeight: 600, color: "#222", margin: 0 }}>
                          {exp.title}{exp.company ? ` — ${exp.company}` : ""}
                        </h3>
                        {exp.period && <span style={{ fontSize: "9pt", color: "#888" }}>{exp.period}</span>}
                      </div>
                      {exp.description && (
                        <p style={{ fontSize: "10pt", color: "#555", marginTop: "4px", lineHeight: 1.5 }}>{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {education.some((e) => e.degree || e.school) && (
                <div style={{ marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "12pt", fontWeight: 700, color: style.accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                    Education
                  </h2>
                  {education.filter((e) => e.degree || e.school).map((edu) => (
                    <div key={edu.id} style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ fontSize: "11pt", fontWeight: 600, color: "#222" }}>{edu.degree}</span>
                        {edu.school && <span style={{ fontSize: "10pt", color: "#555" }}> — {edu.school}</span>}
                      </div>
                      {edu.year && <span style={{ fontSize: "9pt", color: "#888" }}>{edu.year}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {skills && (
                <div>
                  <h2 style={{ fontSize: "12pt", fontWeight: 700, color: style.accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                    Skills
                  </h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {skills.split(",").map((skill, i) => (
                      <span key={i} style={{
                        fontSize: "9pt",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        backgroundColor: `${style.accent}15`,
                        color: style.accent,
                        fontWeight: 500,
                      }}>
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: "32px", textAlign: "center", fontSize: "8pt", color: "#ccc" }}>
                Built with ToolsePulse.com
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}

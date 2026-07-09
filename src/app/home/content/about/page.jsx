"use client";

import AboutBeneficiariesSectionForm from "@/components/content/about/about-beneficiaries-section-form";
import AboutHeroSectionForm from "@/components/content/about/about-hero-section-form";
import AboutStorySectionForm from "@/components/content/about/about-story-section-form";
import AboutValuesSectionForm from "@/components/content/about/about-values-section-form";
import AboutVisionMissionSectionForm from "@/components/content/about/about-vision-mission-section-form";
import Header from "@/components/home/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, HeartHandshake, LayoutTemplate, Telescope, Users } from "lucide-react";
import { useState } from "react";

const ABOUT_CONTENT_TABS = [
  {
    value: "hero",
    label: "القسم الرئيسي",
    icon: LayoutTemplate,
  },
  {
    value: "story",
    label: "قصتنا",
    icon: BarChart3,
  },
  {
    value: "vision-mission",
    label: "الرؤية والرسالة",
    icon: Telescope,
  },
  {
    value: "beneficiaries",
    label: "المستفيدون",
    icon: Users,
  },
  {
    value: "values",
    label: "قيم عقدي",
    icon: HeartHandshake,
  },
];

export default function ContentAboutPage() {
  const [activeTab, setActiveTab] = useState(ABOUT_CONTENT_TABS[0].value);

  return (
    <div className="flex min-h-screen flex-col gap-6 p-6" dir="rtl">
      <Header
        page="welcome"
        title="إدارة محتوى صفحة من نحن"
        isMain={false}
        first="الرئيــسية"
        firstURL="/"
        second="محتوى صفحة من نحن"
        secondURL="/home/content/about"
      />

      <div>
        <Tabs
          dir="rtl"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6 h-auto flex-wrap justify-start gap-3 bg-transparent p-0">
            {ABOUT_CONTENT_TABS.map((tab) => {
              const Icon = tab.icon;

              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="h-12 rounded-full bg-[#F3F3F3] px-5 text-sm font-bold text-[#616161] transition-all data-[state=active]:bg-brand-hover data-[state=active]:text-white data-[state=active]:shadow-none"
                >
                  <Icon className="ml-2 h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {ABOUT_CONTENT_TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              {tab.value === "hero" ? (
                <AboutHeroSectionForm />
              ) : tab.value === "story" ? (
                <AboutStorySectionForm />
              ) : tab.value === "vision-mission" ? (
                <AboutVisionMissionSectionForm />
              ) : tab.value === "beneficiaries" ? (
                <AboutBeneficiariesSectionForm />
              ) : tab.value === "values" ? (
                <AboutValuesSectionForm />
              ) : null}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

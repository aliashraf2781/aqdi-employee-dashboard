"use client";

import { useState } from "react";
import Header from "@/components/home/Header";
import PopupContractsTab from "@/components/contract-settings/popup-contracts/popup-contracts-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Settings2 } from "lucide-react";

const CONTRACT_SETTINGS_TABS = [
  {
    value: "popup-contracts",
    label: "محتوى إرشادي للعقود",
    icon: FileText,
  },
  {
    value: "general",
    label: "إعدادات عامة",
    icon: Settings2,
  },
];

export default function ContractSettingsPage() {
  const [activeTab, setActiveTab] = useState(CONTRACT_SETTINGS_TABS[0].value);

  return (
    <div className="flex min-h-screen flex-col gap-6" dir="rtl">
      <Header
        page="welcome"
        title="إعدادات العقود"
        isMain={false}
        first="الرئيــسية"
        firstURL="/"
        second="إعدادات العقود"
        secondURL="/home/contract-settings"
      />

      <Tabs dir="rtl" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 h-auto flex-wrap justify-start gap-3 bg-transparent p-0">
          {CONTRACT_SETTINGS_TABS.map((tab) => {
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

        <TabsContent value="popup-contracts" className="mt-0">
          <PopupContractsTab />
        </TabsContent>

        <TabsContent value="general" className="mt-0">
          <div className="rounded-[24px] border border-[#EEEEEE] bg-[#FCFCFC] p-6">
            <h2 className="text-lg font-bold text-black">إعدادات عامة</h2>
            <p className="mt-2 text-sm leading-7 text-[#707070]">
              سيتم إضافة محتوى هذا التبويب قريباً.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

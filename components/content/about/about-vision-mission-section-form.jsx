"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUp, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const DEFAULT_VALUES = {
  sectionTitle: "كل ما تريد معرفته",
  sectionDescription:
    'يمكنك استخدام منصة "عقدي" لتوثيق عقودك السكنية والتجارية بسهولة ويسر.',
  mission: {
    badgeText: "الرسالة",
    title: "رسالتنا",
    description:
      "نقدم حلولًا عقارية موثوقة تركز على الكفاءة والفعالية لتشغيل أعمالنا وحماية الوقت، لنكون عنصرًا أساسيًا في نجاح شركائنا وموظفينا.",
    image: null,
  },
  vision: {
    badgeText: "الرؤية",
    title: "رؤيتنا..",
    description:
      "أن تكون إيجار الأولى في قطاع المنشآت العقارية ومرافق مستهدفات رؤية 2030.",
    image: null,
  },
};

function VisionMissionItem({
  form,
  sectionKey,
  title,
  preview,
  setPreview,
  uploadLabel,
}) {
  const updatePreview = (file) => {
    if (!file) {
      setPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-[24px] border border-[#EAEAEA] bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-black">{title}</h4>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name={`${sectionKey}.badgeText`}
          rules={{ required: "نص الشارة مطلوب" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-bold text-black">الشارة</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-[48px] rounded-[14px] border-[#EEEEEE] bg-white px-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${sectionKey}.title`}
          rules={{ required: "العنوان مطلوب" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-bold text-black">العنوان</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-[48px] rounded-[14px] border-[#EEEEEE] bg-white px-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${sectionKey}.description`}
          rules={{ required: "الوصف مطلوب" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-bold text-black">الوصف</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[110px] rounded-[16px] border-[#EEEEEE] bg-white px-4 py-3 text-sm leading-6 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${sectionKey}.image`}
          rules={{
            validate: (value) => {
              if (!value) return true;
              if (!value.type?.startsWith("image/")) {
                return "يجب اختيار ملف صورة فقط";
              }
              return true;
            },
          }}
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-bold text-black">صورة الجزء</FormLabel>
              <FormControl>
                <div className="rounded-[20px] border border-dashed border-[#D9D9D9] bg-[#FCFCFC] p-3">
                  {preview ? (
                    <div className="space-y-3">
                      <div className="relative h-[220px] w-full overflow-hidden rounded-[18px] border border-[#EEEEEE] bg-white">
                        <Image
                          src={preview}
                          alt={title}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="flex items-center gap-2 max-md:flex-col max-md:items-stretch">
                        <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#D9D9D9] bg-white px-4 text-sm font-bold text-[#4D4D4D] transition-all hover:bg-[#FAFAFA]">
                          <ImageUp className="size-4" />
                          تغيير
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;
                              onChange(file);
                              updatePreview(file);
                              e.target.value = "";
                            }}
                            {...field}
                          />
                        </label>

                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            form.setValue(`${sectionKey}.image`, null, {
                              shouldValidate: true,
                            });
                            setPreview(null);
                          }}
                          className="rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex min-h-[130px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[16px] bg-white px-4 py-6 text-center transition-all hover:bg-[#FAFAFA]">
                      <ImageUp className="size-5 text-brand-hover" />
                      <div>
                        <p className="text-sm font-bold text-black">{uploadLabel}</p>
                        <p className="mt-1 text-xs text-[#8A8A8A]">PNG, JPG, WEBP</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          onChange(file);
                          updatePreview(file);
                          e.target.value = "";
                        }}
                        {...field}
                      />
                    </label>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default function AboutVisionMissionSectionForm() {
  const form = useForm({
    defaultValues: DEFAULT_VALUES,
  });
  const [missionPreview, setMissionPreview] = useState(null);
  const [visionPreview, setVisionPreview] = useState(null);

  const onSubmit = (values) => {
    const payload = {
      sectionTitle: values.sectionTitle.trim(),
      sectionDescription: values.sectionDescription.trim(),
      mission: {
        badgeText: values.mission.badgeText.trim(),
        title: values.mission.title.trim(),
        description: values.mission.description.trim(),
        imageName: values.mission.image?.name || null,
      },
      vision: {
        badgeText: values.vision.badgeText.trim(),
        title: values.vision.title.trim(),
        description: values.vision.description.trim(),
        imageName: values.vision.image?.name || null,
      },
    };

    console.log("About vision and mission payload:", payload);
    toast.success("تم تجهيز بيانات قسم الرؤية والرسالة");
  };

  return (
    <div className="rounded-[24px] border border-[#EEEEEE] bg-[#FCFCFC] p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-black">قسم الرؤية والرسالة</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#707070]">
          عدل محتوى جزئي الرسالة والرؤية، مع صورة مستقلة لكل جزء.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="sectionTitle"
              rules={{ required: "عنوان القسم مطلوب" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-bold text-black">
                    عنوان القسم
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="مثال: كل ما تريد معرفته"
                      className="h-[52px] rounded-[16px] border-[#EEEEEE] bg-white px-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sectionDescription"
              rules={{ required: "وصف القسم مطلوب" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-bold text-black">
                    وصف القسم
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='مثال: يمكنك استخدام منصة "عقدي" لتوثيق عقودك السكنية والتجارية بسهولة ويسر.'
                      className="min-h-[110px] rounded-[20px] border-[#EEEEEE] bg-white px-4 py-3 leading-7 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <VisionMissionItem
              form={form}
              sectionKey="mission"
              title="الرسالة"
              preview={missionPreview}
              setPreview={setMissionPreview}
              uploadLabel="ارفع صورة الرسالة"
            />

            <VisionMissionItem
              form={form}
              sectionKey="vision"
              title="الرؤية"
              preview={visionPreview}
              setPreview={setVisionPreview}
              uploadLabel="ارفع صورة الرؤية"
            />
          </div>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-12 rounded-full bg-brand-hover px-8 text-sm font-bold text-white hover:bg-brand-hover/90"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              "حفظ قسم الرؤية والرسالة"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, ImageUp, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const DEFAULT_VALUES = {
  badgeText: "جهات موثوقة ومعتمدة",
  mainTitle: "مرخصون من الجهات الرسمية",
  description: "نعمل وفق أنظمة معتمدة لضمان موثوقية وأمان جميع التعاملات.",
  cards: [
    {
      title: "شبكة إيجار",
      description: "منصة موثقة ومعتمدة رسميًا.",
      image: null,
      license: null,
    },
    {
      title: "الهيئة العامة للعقار",
      description: "ترخيص رسمي من الجهة المنظمة.",
      image: null,
      license: null,
    },
    {
      title: "المركز السعودي للأعمال",
      description: "سجل تجاري معتمد ومسجل.",
      image: null,
      license: null,
    },
  ],
};

const EMPTY_ASSET = {
  previewUrl: null,
  name: "",
  isPdf: false,
};

function createEmptyAssets() {
  return Array.from({ length: 3 }, () => ({
    image: { ...EMPTY_ASSET },
    license: { ...EMPTY_ASSET },
  }));
}

function revokeIfBlob(url) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export default function OfficialAuthoritiesForm() {
  const form = useForm({
    defaultValues: DEFAULT_VALUES,
  });
  const [cardAssets, setCardAssets] = useState(createEmptyAssets);
  const cards = form.watch("cards");

  useEffect(() => {
    return () => {
      cardAssets.forEach((card) => {
        revokeIfBlob(card.image.previewUrl);
        revokeIfBlob(card.license.previewUrl);
      });
    };
  }, [cardAssets]);

  const updateCardAsset = (cardIndex, type, file) => {
    setCardAssets((current) => {
      const next = [...current];
      const previousAsset = next[cardIndex][type];
      revokeIfBlob(previousAsset.previewUrl);

      next[cardIndex] = {
        ...next[cardIndex],
        [type]: file
          ? {
              previewUrl: URL.createObjectURL(file),
              name: file.name,
              isPdf:
                file.type === "application/pdf" ||
                file.name.toLowerCase().endsWith(".pdf"),
            }
          : { ...EMPTY_ASSET },
      };

      return next;
    });
  };

  const removeCardAsset = (cardIndex, type) => {
    form.setValue(`cards.${cardIndex}.${type}`, null, { shouldValidate: true });
    updateCardAsset(cardIndex, type, null);
  };

  const onSubmit = (values) => {
    const payload = {
      badgeText: values.badgeText.trim(),
      mainTitle: values.mainTitle.trim(),
      description: values.description.trim(),
      cards: values.cards.map((card) => ({
        title: card.title.trim(),
        description: card.description.trim(),
        imageName: card.image?.name || null,
        licenseName: card.license?.name || null,
      })),
    };

    console.log("Official authorities payload:", payload);
    toast.success("تم تجهيز بيانات قسم الجهات الرسمية");
  };

  return (
    <div className="rounded-[24px] border border-[#EEEEEE] bg-[#FCFCFC] p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-black">قسم الجهات الرسمية</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#707070]">
          عدل بيانات القسم العامة، ثم حدّث محتوى البطاقات الثابتة دون تغيير عددها أو
          ترتيبها.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="badgeText"
              rules={{ required: "نص الشارة مطلوب" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-bold text-black">الشارة</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="مثال: جهات موثوقة ومعتمدة"
                      className="h-[52px] rounded-[16px] border-[#EEEEEE] bg-white px-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mainTitle"
              rules={{ required: "العنوان الرئيسي مطلوب" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-bold text-black">
                    العنوان الرئيسي
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="مثال: مرخصون من الجهات الرسمية"
                      className="h-[52px] rounded-[16px] border-[#EEEEEE] bg-white px-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              rules={{ required: "الوصف مطلوب" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-bold text-black">الوصف</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="أدخل الوصف الخاص بالقسم"
                      className="min-h-[120px] rounded-[20px] border-[#EEEEEE] bg-white px-4 py-3 leading-7 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-t border-[#ECECEC] pt-6">
              <h3 className="text-base font-bold text-black">محتوى البطاقات </h3>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {DEFAULT_VALUES.cards.map((defaultCard, cardIndex) => {
                const imageAsset = cardAssets[cardIndex].image;
                const licenseAsset = cardAssets[cardIndex].license;
                const cardTitle =
                  cards?.[cardIndex]?.title?.trim() || defaultCard.title;

                return (
                  <div
                    key={cardIndex}
                    className="rounded-[24px] border border-[#EAEAEA] bg-white p-5 shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-sm font-bold text-black">{cardTitle}</h4>
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`cards.${cardIndex}.title`}
                        rules={{ required: "عنوان البطاقة مطلوب" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[13px] font-bold text-black">
                              العنوان
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={defaultCard.title}
                                className="h-[48px] rounded-[14px] border-[#EEEEEE] bg-white px-4"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`cards.${cardIndex}.description`}
                        rules={{ required: "وصف البطاقة مطلوب" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[13px] font-bold text-black">
                              الوصف
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder={defaultCard.description}
                                className="min-h-[96px] rounded-[16px] border-[#EEEEEE] bg-white px-4 py-3 text-sm leading-6 resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`cards.${cardIndex}.image`}
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
                            <FormLabel className="text-[13px] font-bold text-black">
                              صورة البطاقة
                            </FormLabel>
                            <FormControl>
                              <div className="rounded-[20px] border border-dashed border-[#D9D9D9] bg-[#FCFCFC] p-3">
                                {imageAsset.previewUrl ? (
                                  <div className="space-y-3">
                                    <div className="overflow-hidden rounded-[18px] border border-[#EEEEEE] bg-white">
                                      <img
                                        src={imageAsset.previewUrl}
                                        alt={`صورة البطاقة ${cardIndex + 1}`}
                                        className="h-40 w-full object-contain"
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
                                            updateCardAsset(cardIndex, "image", file);
                                            e.target.value = "";
                                          }}
                                          {...field}
                                        />
                                      </label>

                                      <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => removeCardAsset(cardIndex, "image")}
                                        className="rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                                      >
                                        <Trash2 className="size-4" />
                                        حذف
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[16px] bg-white px-4 py-6 text-center transition-all hover:bg-[#FAFAFA]">
                                    <ImageUp className="size-5 text-brand-hover" />
                                    <div>
                                      <p className="text-sm font-bold text-black">ارفع صورة البطاقة</p>
                                      <p className="mt-1 text-xs text-[#8A8A8A]">PNG, JPG, WEBP</p>
                                    </div>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null;
                                        onChange(file);
                                        updateCardAsset(cardIndex, "image", file);
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

                      <FormField
                        control={form.control}
                        name={`cards.${cardIndex}.license`}
                        rules={{
                          validate: (value) => {
                            if (!value) return true;
                            const isImage = value.type?.startsWith("image/");
                            const isPdf =
                              value.type === "application/pdf" ||
                              value.name?.toLowerCase().endsWith(".pdf");
                            if (!isImage && !isPdf) {
                              return "الترخيص يجب أن يكون صورة أو PDF";
                            }
                            return true;
                          },
                        }}
                        render={({ field: { onChange, value, ...field } }) => (
                          <FormItem>
                            <FormLabel className="text-[13px] font-bold text-black">
                              ملف الترخيص
                            </FormLabel>
                            <FormControl>
                              <div className="rounded-[20px] border border-dashed border-[#D9D9D9] bg-[#FCFCFC] p-3">
                                {licenseAsset.previewUrl ? (
                                  <div className="space-y-3">
                                    <div className="rounded-[18px] border border-[#EEEEEE] bg-white p-4">
                                      {licenseAsset.isPdf ? (
                                        <div className="flex items-center gap-3">
                                          <div className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                                            <FileText className="size-5" />
                                          </div>
                                          <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-black">
                                              {licenseAsset.name}
                                            </p>
                                            <p className="text-xs text-[#8A8A8A]">PDF</p>
                                          </div>
                                        </div>
                                      ) : (
                                        <img
                                          src={licenseAsset.previewUrl}
                                          alt={`ترخيص البطاقة ${cardIndex + 1}`}
                                          className="h-40 w-full rounded-[12px] object-contain"
                                        />
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2 max-md:flex-col max-md:items-stretch">
                                      <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#D9D9D9] bg-white px-4 text-sm font-bold text-[#4D4D4D] transition-all hover:bg-[#FAFAFA]">
                                        <ImageUp className="size-4" />
                                        تغيير
                                        <input
                                          type="file"
                                          accept="image/*,application/pdf"
                                          className="hidden"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            onChange(file);
                                            updateCardAsset(cardIndex, "license", file);
                                            e.target.value = "";
                                          }}
                                          {...field}
                                        />
                                      </label>

                                      <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => removeCardAsset(cardIndex, "license")}
                                        className="rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                                      >
                                        <Trash2 className="size-4" />
                                        حذف
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[16px] bg-white px-4 py-6 text-center transition-all hover:bg-[#FAFAFA]">
                                    <FileText className="size-5 text-brand-hover" />
                                    <div>
                                      <p className="text-sm font-bold text-black">ارفع ملف الترخيص</p>
                                      <p className="mt-1 text-xs text-[#8A8A8A]">
                                        صورة أو PDF
                                      </p>
                                    </div>
                                    <input
                                      type="file"
                                      accept="image/*,application/pdf"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null;
                                        onChange(file);
                                        updateCardAsset(cardIndex, "license", file);
                                        e.target.value = "";
                                      }}
                                      {...field}
                                    />
                                  </label>
                                )}
                              </div>
                            </FormControl>
                            <FormDescription className="text-[#8A8A8A]">
                              يمكنك رفع صورة للترخيص أو ملف PDF.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
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
              "حفظ قسم الجهات الرسمية"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

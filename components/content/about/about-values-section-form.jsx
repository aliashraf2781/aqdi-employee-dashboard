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
import { ImageUp, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

const DEFAULT_VALUES = {
  badgeText: "قيمنا",
  mainTitle: "قيم عقدي",
  description:
    "يهدف (إيجار) إلى تنظيم قطاع الإيجار العقاري في المملكة العربية السعودية بصورة متوازنة تحفظ حقوق أطراف العملية الإيجارية.",
  cards: [
    {
      title: "نحو إدارة واضحة ومسؤولة",
      description:
        "نوفر معلومات واضحة ومحدثة بشكل كامل للجمهور بشفافية لتعزيز قيم المواطنين.",
      image: null,
    },
    {
      title: "أساس علاقتنا مع المواطن",
      description:
        "يمكنكم تستند إلى مبادئ شفافة ومعلومات دقيقة لخدمتكم بكفاءة.",
      image: null,
    },
    {
      title: "خدمة فعالة ورؤية واضحة",
      description:
        "نوفر معلومات واضحة ومحدثة بشكل كامل للجمهور بشفافية لتعزيز قيم المواطنين.",
      image: null,
    },
  ],
};

const EMPTY_ASSET = {
  previewUrl: null,
  name: "",
};

const INITIAL_CARDS_COUNT = DEFAULT_VALUES.cards.length;

function createEmptyAssets() {
  return Array.from({ length: INITIAL_CARDS_COUNT }, () => ({
    image: { ...EMPTY_ASSET },
  }));
}

function revokeIfBlob(url) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export default function AboutValuesSectionForm() {
  const form = useForm({
    defaultValues: DEFAULT_VALUES,
  });
  const [cardAssets, setCardAssets] = useState(createEmptyAssets);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cards",
  });
  const cards = form.watch("cards");

  useEffect(() => {
    return () => {
      cardAssets.forEach((card) => revokeIfBlob(card.image.previewUrl));
    };
  }, [cardAssets]);

  const updateCardImage = (cardIndex, file) => {
    setCardAssets((current) => {
      const next = [...current];
      revokeIfBlob(next[cardIndex].image.previewUrl);
      next[cardIndex] = {
        image: file
          ? {
              previewUrl: URL.createObjectURL(file),
              name: file.name,
            }
          : { ...EMPTY_ASSET },
      };
      return next;
    });
  };

  const removeCardImage = (cardIndex) => {
    form.setValue(`cards.${cardIndex}.image`, null, { shouldValidate: true });
    updateCardImage(cardIndex, null);
  };

  const addCard = () => {
    append({
      title: "",
      description: "",
      image: null,
    });
    setCardAssets((current) => [...current, { image: { ...EMPTY_ASSET } }]);
  };

  const removeCard = (cardIndex) => {
    revokeIfBlob(cardAssets[cardIndex]?.image?.previewUrl);
    remove(cardIndex);
    setCardAssets((current) => current.filter((_, index) => index !== cardIndex));
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
      })),
    };

    console.log("About values payload:", payload);
    toast.success("تم تجهيز بيانات قسم قيم عقدي");
  };

  return (
    <div className="rounded-[24px] border border-[#EEEEEE] bg-[#FCFCFC] p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-black">قسم قيم عقدي</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#707070]">
          عدل الشارة والعنوان والوصف، ثم حدّث البطاقات الثلاث الأساسية مع إمكانية
          إضافة بطاقات جديدة.
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
                      placeholder="مثال: قيمنا"
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
                      placeholder="مثال: قيم عقدي"
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
                      placeholder="أدخل وصف القسم"
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
              <h3 className="text-base font-bold text-black">محتوى البطاقات</h3>
              <Button
                type="button"
                variant="outline"
                onClick={addCard}
                className="rounded-full"
              >
                <Plus className="size-4" />
                إضافة بطاقة
              </Button>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              {fields.map((fieldItem, cardIndex) => {
                const defaultCard = DEFAULT_VALUES.cards[cardIndex] || {
                  title: "",
                  description: "",
                };
                const imageAsset = cardAssets[cardIndex].image;
                const cardTitle =
                  cards?.[cardIndex]?.title?.trim() ||
                  defaultCard.title ||
                  `بطاقة ${cardIndex + 1}`;

                return (
                  <div
                    key={fieldItem.id}
                    className="rounded-[24px] border border-[#EAEAEA] bg-white p-5 shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-sm font-bold text-black">{cardTitle}</h4>
                      {cardIndex >= INITIAL_CARDS_COUNT ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCard(cardIndex)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      ) : null}
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
                                placeholder={defaultCard.title || "أدخل عنوان البطاقة"}
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
                                placeholder={defaultCard.description || "أدخل وصف البطاقة"}
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
                              أيقونة أو صورة البطاقة
                            </FormLabel>
                            <FormControl>
                              <div className="rounded-[20px] border border-dashed border-[#D9D9D9] bg-[#FCFCFC] p-3">
                                {imageAsset.previewUrl ? (
                                  <div className="space-y-3">
                                    <div className="relative h-[180px] w-full overflow-hidden rounded-[18px] border border-[#EEEEEE] bg-white">
                                      <Image
                                        src={imageAsset.previewUrl}
                                        alt={cardTitle}
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
                                            updateCardImage(cardIndex, file);
                                            e.target.value = "";
                                          }}
                                          {...field}
                                        />
                                      </label>

                                      <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => removeCardImage(cardIndex)}
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
                                        updateCardImage(cardIndex, file);
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
              "حفظ قسم قيم عقدي"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

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
import {
  ImageUp,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

const DEFAULT_VALUES = {
  badgeText: "الأسعار",
  mainTitle: "وثّق عقدك",
  description: "اختر نوع العقد المناسب لك وابدأ التوثيق فورًا.",
  cards: [
    {
      title: "عقد سكني",
      subtitle: "مناسبة للإيجار، عقد فردي، عقد عائلي ...",
      price: "249",
      durationLabel: "/ السنة الواحدة",
      image: null,
      features: [
        { text: "خلال دقائق ينجز عقدك" },
        { text: "مناسب لحساب المواطن" },
        { text: "مناسب للضمان المطور" },
        { text: "سند تنفيذي" },
        { text: "يطلبه للإيجار أو الاستثمار" },
      ],
    },
    {
      title: "عقد تجاري",
      subtitle: "مناسبة لمحلات تجارية، مكتب، مصنع ...",
      price: "349",
      durationLabel: "/ السنة الواحدة",
      image: null,
      features: [
        { text: "خلال دقائق ينجز عقدك" },
        { text: "متوافق مع وزارة التجارة" },
        { text: "توثيق عقد تجاري" },
        { text: "متوافق مع المركز السعودي للأعمال" },
        { text: "يطلبه للإيجار أو الاستثمار" },
      ],
    },
  ],
};

const EMPTY_ASSET = {
  previewUrl: null,
  name: "",
};

function createEmptyAssets() {
  return Array.from({ length: 2 }, () => ({ image: { ...EMPTY_ASSET } }));
}

function revokeIfBlob(url) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function PricingFeaturesFields({ control, cardIndex }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `cards.${cardIndex}.features`,
  });

  return (
    <div className="space-y-3 rounded-[18px] border border-[#EEEEEE] bg-[#FCFCFC] p-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-bold text-black">مميزات الباقة</h5>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ text: "" })}
          className="rounded-full"
        >
          <Plus className="size-4" />
          إضافة ميزة
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((fieldItem, featureIndex) => (
          <div key={fieldItem.id} className="flex items-start gap-2">
            <div className="flex-1">
              <FormField
                control={control}
                name={`cards.${cardIndex}.features.${featureIndex}.text`}
                rules={{ required: "نص الميزة مطلوب" }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={`الميزة ${featureIndex + 1}`}
                        className="h-[44px] rounded-[14px] border-[#EEEEEE] bg-white px-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(featureIndex)}
              className="mt-1 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PricingSectionForm() {
  const form = useForm({
    defaultValues: DEFAULT_VALUES,
  });
  const [cardAssets, setCardAssets] = useState(createEmptyAssets);
  const cards = form.watch("cards");

  useEffect(() => {
    return () => {
      cardAssets.forEach((card) => {
        revokeIfBlob(card.image.previewUrl);
      });
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

  const onSubmit = (values) => {
    const payload = {
      badgeText: values.badgeText.trim(),
      mainTitle: values.mainTitle.trim(),
      description: values.description.trim(),
      cards: values.cards.map((card) => ({
        title: card.title.trim(),
        subtitle: card.subtitle.trim(),
        price: card.price.trim(),
        durationLabel: card.durationLabel.trim(),
        imageName: card.image?.name || null,
        features: card.features.map((feature) => feature.text.trim()),
      })),
    };

    console.log("Pricing section payload:", payload);
    toast.success("تم تجهيز بيانات قسم الأسعار");
  };

  return (
    <div className="rounded-[24px] border border-[#EEEEEE] bg-[#FCFCFC] p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-black">قسم الأسعار</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#707070]">
          عدل بيانات القسم العامة ثم حدّث البطاقتين الثابتتين، مع إمكانية إضافة
          مميزات جديدة داخل كل بطاقة.
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
                      placeholder="مثال: الأسعار"
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
                      placeholder="مثال: وثّق عقدك"
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
              <h3 className="text-base font-bold text-black">محتوى البطاقات</h3>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {DEFAULT_VALUES.cards.map((defaultCard, cardIndex) => {
                const imageAsset = cardAssets[cardIndex].image;
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
                        name={`cards.${cardIndex}.subtitle`}
                        rules={{ required: "الوصف المختصر مطلوب" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[13px] font-bold text-black">
                              الوصف المختصر
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={defaultCard.subtitle}
                                className="h-[48px] rounded-[14px] border-[#EEEEEE] bg-white px-4"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`cards.${cardIndex}.price`}
                          rules={{ required: "السعر مطلوب" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-bold text-black">
                                السعر
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={defaultCard.price}
                                  className="h-[48px] rounded-[14px] border-[#EEEEEE] bg-white px-4"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`cards.${cardIndex}.durationLabel`}
                          rules={{ required: "مدة السعر مطلوبة" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-bold text-black">
                                وصف المدة
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={defaultCard.durationLabel}
                                  className="h-[48px] rounded-[14px] border-[#EEEEEE] bg-white px-4"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

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

                      <PricingFeaturesFields
                        control={form.control}
                        cardIndex={cardIndex}
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
              "حفظ قسم الأسعار"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

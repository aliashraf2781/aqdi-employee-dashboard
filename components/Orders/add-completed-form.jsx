"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { axiosInstance } from "@/src/utils/axios";
import { toast } from "sonner";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  mobile_number: z.string().min(10),
  addition_date: z.string(),
  contract_type: z.enum(["housing", "commercial"]),

  without: z.boolean().optional(),
  derived_from_bank: z.boolean().optional(),
  waqf: z.boolean().optional(),
  paper_deed: z.boolean().optional(),
  paper_deed_2: z.boolean().optional(),

  is_documented: z.enum(["1", "0"]),

  contract_duration: z.string().optional(),
  amount_paid_by_client: z.string().optional(),
  rental_fees: z.string().optional(),
  notes: z.string().optional(),
});

export default function CompletedOrderForm({ setOpen }) {
  const [loading, setLoading] = useState(false);
  const [typePeriod, setTypePeriod] = useState("commercial");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile_number: "",
      addition_date: "",
      contract_type: "commercial",

      without: false,
      derived_from_bank: false,
      waqf: false,
      paper_deed: false,
      paper_deed_2: false,

      is_documented: "1",

      contract_duration: "",
      amount_paid_by_client: "",
      rental_fees: "",
      notes: "",
    },
  });

  function onSubmit(values) {
    const payload = {
      ...values,
      without: values.without ? 1 : 0,
      derived_from_bank: values.derived_from_bank ? 1 : 0,
      waqf: values.waqf ? 1 : 0,
      paper_deed: values.paper_deed ? 1 : 0,
      paper_deed_2: values.paper_deed_2 ? 1 : 0,
    };
    setLoading(true);

    axiosInstance
      .post("/admin/contract-whatsapp/complete", payload)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res?.data?.message || "تم إضافة العقد بنجاح");
          form.reset();
          setOpen(false);
        }
      })
      .catch(() => {
        toast.error("حدث خطأ");
      })
      .finally(() => setLoading(false));
  }

  function formatDate(date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("ar-EG");
  }

  // Fetch contract durations
  const { data: typePeriodData } = useQuery({
    queryKey: ["type-period", typePeriod],
    queryFn: () =>
      axiosInstance
        .get(`/admin/contract-periods?contract_type=${typePeriod}`)
        .then((res) => res.data.data.data || []),
    enabled: !!typePeriod,
  });

  const typePeriodOptions = typePeriodData ?? [];

  return (
    <Form {...form}>
      <form
        dir="rtl"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full p-6 text-right"
      >
        {/* Phone + Date */}
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="mobile_number"
            render={({ field }) => (
              <FormItem className="text-right">
                <FormLabel>
                  رقم الجوال <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="010xxxxxxxx" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addition_date"
            render={({ field }) => {
              const selectedDate = field.value ? new Date(field.value) : undefined;
              return (
                <FormItem className="text-right">
                  <FormLabel>
                    تاريخ الإضافة <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[280px] justify-start text-right font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {field.value
                            ? formatDate(field.value)
                            : "اختر تاريخ الإضافة"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          dir="ltr"
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) =>
                            field.onChange(date ? date.toISOString() : "")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              );
            }}
          />
        </div>

        {/* Contract Type */}
        <FormField
          control={form.control}
          name="contract_type"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>
                نوع العقد <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(val) => {
                    field.onChange(val);
                    setTypePeriod(val); // Update duration type when contract type changes
                  }}
                  value={field.value}
                  className="flex flex-row-reverse gap-6"
                >
                  <div className="flex flex-row-reverse items-center gap-2">
                    <RadioGroupItem value="housing" />
                    <span>سكني</span>
                  </div>
                  <div className="flex flex-row-reverse items-center gap-2">
                    <RadioGroupItem value="commercial"  />
                    <span>تجاري</span>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Classification */}
        <div className="space-y-2 text-right">
          <p className="text-sm font-medium">
            تصنيف العقد <span className="text-red-500">*</span>
          </p>

          <div className="flex flex-wrap gap-4">
            {[
              { name: "without", label: "بدون" },
              { name: "derived_from_bank", label: "بتفويض من البنك" },
              { name: "waqf", label: "وقف" },
              { name: "paper_deed", label: "صك ورقي" },
              { name: "paper_deed_2", label: "ورثة" },
            ].map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem className="flex flex-row-reverse items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <span>{item.label}</span>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        {/* Documented */}
        <FormField
          control={form.control}
          name="is_documented"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>
                هل تم توثيق العقد <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row-reverse gap-6"
                >
                  <div className="flex flex-row-reverse items-center gap-2">
                    <RadioGroupItem value="1" />
                    <span>نعم</span>
                  </div>
                  <div className="flex flex-row-reverse items-center gap-2">
                    <RadioGroupItem value="0" />
                    <span>لا</span>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Inputs */}
        <div className="grid md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="contract_duration"
            render={({ field }) => (
              <FormItem className="text-right">
                <FormLabel>مدة العقد</FormLabel>
                <FormControl>
                  <Select
                    dir="rtl"
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر مدة العقد" />
                    </SelectTrigger>
                    <SelectContent>
                      {typePeriodOptions.map((option) => (
                        <SelectItem key={option.value} value={String(option.id)}>
                          {option.period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount_paid_by_client"
            render={({ field }) => (
              <FormItem className="text-right">
                <FormLabel>المبلغ</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ادخل المبلغ" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rental_fees"
            render={({ field }) => (
              <FormItem className="text-right">
                <FormLabel>رسوم الإيجار</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ادخل رسوم الإيجار" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>ملاحظات</FormLabel>
              <FormControl>
                <Textarea className="min-h-[120px]" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "حفظ"}
        </Button>
      </form>
    </Form>
  );
}
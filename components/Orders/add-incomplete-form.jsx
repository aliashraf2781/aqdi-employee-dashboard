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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { axiosInstance } from "@/src/utils/axios";

const formSchema = z.object({
  mobile_number: z
    .string()
    .min(10, "رقم الجوال يجب أن يكون 10 أرقام على الأقل"),
  notes: z.string().optional(),
  time: z.string().optional(),
  date: z.string(),
});

export default function InCompleteOrderForm({ setOpen }) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile_number: "",
      notes: "",
      time: "",
      date: "",
    },
  });

  function onSubmit(values) {
    setLoading(true);
    axiosInstance
      .post("/admin/contract-whatsapp/incomplete", values)
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

  return (
    <Form {...form}>
      <form
        dir="rtl"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-6 w-full text-right"
      >
        {/* Mobile Number */}
        <FormField
          control={form.control}
          name="mobile_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                رقم الجوال <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="010xxxxxxxx"
                  className="text-right"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ملاحظات</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[100px] text-right"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">


        {/* Time */}
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوقت</FormLabel>
              <FormControl>
                <Input type="time" {...field} className="text-right" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => {
            const selectedDate = field.value
              ? new Date(field.value)
              : undefined;
            return (
              <FormItem>
                <FormLabel>
                  التاريخ <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start font-normal text-right",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {field.value ? formatDate(field.value) : "اختر التاريخ"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto origin-top-right right-0">
                      <Calendar
                        dir="rtl"
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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "حفظ"}
        </Button>
      </form>
    </Form>
  );
}
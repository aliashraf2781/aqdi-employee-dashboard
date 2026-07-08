import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import InCompleteOrderForm from "./add-incomplete-form";

export default function AddInCompleteOrder() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button className="bg-[#E20062] hover:bg-[#E20062]/80 h-12 rounded-full font-bold px-6 whitespace-nowrap">
          + إضافة عقــد واتســـاب غير مكتمـل
        </Button>
      </DialogTrigger>
      <DialogContent closeButton={false} dir="rtl" className="max-w-2xl">
        <DialogHeader dir="rtl" >
          <div className="no-scrollbar max-h-[90vh] overflow-y-auto" >
            <div className="flex items-center justify-between w-full pb-4 border-b ">
              <h1 className=" font-bold">إضــافة عقد واتســـاب غير مكتمل</h1>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <InCompleteOrderForm setOpen={setOpen} />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
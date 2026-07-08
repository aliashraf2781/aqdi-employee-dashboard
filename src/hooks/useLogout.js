
import { useUserStore } from "../stores/user-store";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/src/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
export const useLogout = () => {
  const { logout: clearStore } = useUserStore();
  const router = useRouter();

  const { mutate: logout, isPending: logoutLoading } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/admin/employees/logout");
    },
    onMutate: () => {
      toast.loading("جاري تسجيل الخروج...");
    },
    onSuccess: async () => {
      await clearStore();
      toast.dismiss();
      toast.success("تم تسجيل الخروج بنجاح");
      router.push("/login");
    },
    onError: async (error) => {
      await clearStore();
      toast.dismiss();
      toast.error(error.response?.data?.message || "حدث خطأ أثناء تسجيل الخروج");
      router.push("/login");
    },
  });

return {logout,logoutLoading};
};
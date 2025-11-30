import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const formatDateFunc = (dateString: string | Date) => {
    try {
        return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
        return "";
    }
};
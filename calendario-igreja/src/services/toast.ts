import { toast } from "react-toastify";

// Mensagem de sucesso
export const toastSucesso = (mensagem:string) => {
  toast.success(mensagem);
}

// Mensagem de erro
export const toastErro = (mensagem:string) => {
  toast.error(mensagem);
}
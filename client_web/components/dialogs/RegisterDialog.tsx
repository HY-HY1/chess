import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RegisterForm } from "../forms/RegisterForm"

export function RegisterDialog() {
  return (
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Register</DialogTitle>
            <DialogDescription>
              Register a new chess account
            </DialogDescription>
          </DialogHeader>
          <RegisterForm/>
        </DialogContent>
      </form>
  )
}

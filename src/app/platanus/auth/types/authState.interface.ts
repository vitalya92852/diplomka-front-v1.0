import { CurrentUserInterface } from "../shared/types/currentUser.interface"




export interface AuthStateInterface {
  isLoading:boolean
  isSubmitting: boolean
  currentUser: CurrentUserInterface | null
  isLoggedIn: boolean | null
}

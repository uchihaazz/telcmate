export type UserRole = "Admin" | "Moderator" | "Student"

export interface User {
  id: string
  name: string
  code: string
  isAdmin: boolean
  isModerator: boolean
  isDemo: boolean
  role: string
}

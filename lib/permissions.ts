export type UserRole = "Admin" | "Moderator" | "Student"

export interface User {
  id: string
  name: string
  code: string
  isAdmin?: boolean
  isModerator?: boolean
  isDemo?: boolean
  role?: UserRole
}

export class Permissions {
  static isAdmin(user: User): boolean {
    return user.isAdmin === true || user.role === "Admin"
  }

  static isModerator(user: User): boolean {
    return user.isModerator === true || user.role === "Moderator" || this.isAdmin(user)
  }

  static canAddUsers(user: User): boolean {
    return this.isModerator(user)
  }

  static canEditUsers(user: User): boolean {
    return this.isModerator(user)
  }

  static canRemoveUsers(user: User): boolean {
    return this.isAdmin(user)
  }

  static canAddExercises(user: User): boolean {
    return this.isModerator(user)
  }

  static canEditExercises(user: User): boolean {
    return this.isModerator(user)
  }

  static canRemoveExercises(user: User): boolean {
    return this.isAdmin(user)
  }

  static canAccessSettings(user: User): boolean {
    return this.isAdmin(user)
  }

  static canEditSettings(user: User): boolean {
    return this.isAdmin(user)
  }
}

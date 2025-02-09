export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      administrador: {
        Row: {
          id_admin: number
          nombre_admin: string
          usuario_admin: string
          contrasena_admin: string
        }
        Insert: {
          id_admin?: never
          nombre_admin: string
          usuario_admin: string
          contrasena_admin: string
        }
        Update: {
          id_admin?: never
          nombre_admin?: string
          usuario_admin?: string
          contrasena_admin?: string
        }
      }
      usuario: {
        Row: {
          id_usuario: number
          nombre_usuario: string
          usuario: string
          contrasena: string
          correo: string
        }
        Insert: {
          id_usuario?: never
          nombre_usuario: string
          usuario: string
          contrasena: string
          correo: string
        }
        Update: {
          id_usuario?: never
          nombre_usuario?: string
          usuario?: string
          contrasena?: string
          correo?: string
        }
      }
      contacto: {
        Row: {
          id_contacto: number
          nombre: string
          correo: string
          dudas: string | null
          telefono: string | null
          fecha_contacto: string
          horario_contacto: string
          estatus: boolean
        }
        Insert: {
          id_contacto?: never
          nombre: string
          correo: string
          dudas?: string | null
          telefono?: string | null
          fecha_contacto: string
          horario_contacto: string
          estatus?: boolean
        }
        Update: {
          id_contacto?: never
          nombre?: string
          correo?: string
          dudas?: string | null
          telefono?: string | null
          fecha_contacto?: string
          horario_contacto?: string
          estatus?: boolean
        }
      }
    }
  }
} 
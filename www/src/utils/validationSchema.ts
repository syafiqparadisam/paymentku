// src/utils/validationSchemas.ts
import * as yup from "yup";

// Base schema untuk field yang umum di form update
export const passwordUpdateSchema = yup.object({
  password: yup.string().min(6, "Password must be at least 6 characters long."),
});

// Schema untuk update Username
export const updateUsernameSchema = yup.object({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .trim(),
});

// Schema untuk update Name
export const updateNameSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters long.")
    .max(100, "Name cannot exceed 100 characters.")
    .trim(),
});

// Schema untuk update Bio
export const updateBioSchema = yup.object({
  bio: yup.string().max(255, "Bio cannot exceed 255 characters.").optional(), // Bio bisa kosong
});

// Schema untuk update Phone Number
export const updatePhoneSchema = yup.object({
  phoneNumber: yup
    .string()
    .matches(
      /^0\d{9,14}$/,
      "Nomor telepon tidak valid. Harus diawali dengan 0 dan memiliki 10–15 digit."
    )
    .optional(),
});

// Schema untuk Delete Account (hanya butuh password)
export const deleteAccountSchema = yup.object({
  password: yup.string().min(6, "Password is required to delete account."),
});

// Untuk mempermudah, kita akan menggunakan schema terpisah dan memilihnya berdasarkan `label`

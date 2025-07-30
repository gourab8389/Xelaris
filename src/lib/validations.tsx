import { z } from "zod";
import { PROJECT_TYPES, PROJECT_ROLES, CHART_TYPES } from "./constants";

// Auth validations
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Project validations
export const createProjectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().optional(),
  type: z.enum([PROJECT_TYPES.SINGLE, PROJECT_TYPES.ORGANIZATION]),
});

export const updateProjectSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export const inviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum([PROJECT_ROLES.ADMIN, PROJECT_ROLES.MEMBER]),
});

// Chart validations
export const createChartSchema = z.object({
  xAxis: z.string().min(1, "X-axis is required"),
  yAxis: z.string().min(1, "Y-axis is required"),
  chartType: z.enum([
    CHART_TYPES.BAR,
    CHART_TYPES.LINE,
    CHART_TYPES.PIE,
    CHART_TYPES.SCATTER,
    CHART_TYPES.COLUMN_3D,
    CHART_TYPES.BAR_3D,
    CHART_TYPES.LINE_3D,
  ]),
  title: z.string().optional(),
  styling: z.object({
    backgroundColor: z.string().optional(),
    borderColor: z.string().optional(),
    borderWidth: z.number().optional(),
  }).optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, "File size must be less than 10MB")
    .refine(
      (file) => [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ].includes(file.type),
      "Only Excel files (.xlsx, .xls) are allowed"
    ),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;
export type InviteUserFormData = z.infer<typeof inviteUserSchema>;
export type CreateChartFormData = z.infer<typeof createChartSchema>;
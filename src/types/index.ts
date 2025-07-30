// Auth Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Project Types
export enum ProjectType {
  SINGLE = "SINGLE",
  ORGANIZATION = "ORGANIZATION",
}

export enum ProjectRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  type: ProjectType;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator?: User;
  members?: ProjectMember[];
  memberCount?: number;
  uploadCount?: number;
  role?: ProjectRole;
  joinedAt?: string;
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: ProjectRole;
  joinedAt: string;
  user: User;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  type: ProjectType;
}

export interface InviteUserData {
  email: string;
  role: ProjectRole;
}

// Upload Types
export enum UploadStatus {
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface Upload {
  id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  userId: string;
  projectId: string;
  status: UploadStatus;
  uploadedAt: string;
  processedAt?: string;
  user?: User;
  project?: Project;
  data?: ExcelData[];
  charts?: Chart[];
  _count?: {
    charts: number;
  };
}

export interface ExcelData {
  id: string;
  uploadId: string;
  headers: string[];
  rows: any[];
  metadata: {
    totalRows: number;
    totalColumns: number;
    fileName: string;
  };
}

// Chart Types
export enum ChartType {
  BAR = "BAR",
  LINE = "LINE",
  PIE = "PIE",
  SCATTER = "SCATTER",
  COLUMN_3D = "COLUMN_3D",
  BAR_3D = "BAR_3D",
  LINE_3D = "LINE_3D",
}

export interface Chart {
  id: string;
  uploadId: string;
  name: string;
  type: ChartType;
  config: ChartConfig;
  data: any;
  createdAt: string;
  upload?: Upload;
}

export interface ChartConfig {
  xAxis: string;
  yAxis: string;
  chartType: ChartType;
  title?: string;
  styling?: any;
}

export interface CreateChartData {
  xAxis: string;
  yAxis: string;
  chartType: ChartType;
  title?: string;
  styling?: any;
}

// Dashboard Types
export interface DashboardStats {
  projectsCount: number;
  uploadsCount: number;
  chartsCount: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentUploads: Upload[];
  recentProjects: Project[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Invitation Types
export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  EXPIRED = "EXPIRED",
}

export interface Invitation {
  id: string;
  email: string;
  projectId: string;
  token: string;
  role: ProjectRole;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
}
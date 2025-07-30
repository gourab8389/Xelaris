export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const PROJECT_TYPES = {
  SINGLE: "SINGLE",
  ORGANIZATION: "ORGANIZATION",
} as const;

export const PROJECT_ROLES = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
} as const;

export const UPLOAD_STATUS = {
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export const CHART_TYPES = {
  BAR: "BAR",
  LINE: "LINE",
  PIE: "PIE",
  SCATTER: "SCATTER",
  COLUMN_3D: "COLUMN_3D",
  BAR_3D: "BAR_3D",
  LINE_3D: "LINE_3D",
} as const;

export const CHART_TYPE_LABELS = {
  [CHART_TYPES.BAR]: "Bar Chart",
  [CHART_TYPES.LINE]: "Line Chart",
  [CHART_TYPES.PIE]: "Pie Chart",
  [CHART_TYPES.SCATTER]: "Scatter Plot",
  [CHART_TYPES.COLUMN_3D]: "3D Column Chart",
  [CHART_TYPES.BAR_3D]: "3D Bar Chart",
  [CHART_TYPES.LINE_3D]: "3D Line Chart",
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xlsx",
  ".xls",
];

export const QUERY_KEYS = {
  // Auth
  PROFILE: ["profile"],
  DASHBOARD: ["dashboard"],
  
  // Projects
  PROJECTS: ["projects"],
  PROJECT: ["project"],
  PROJECT_MEMBERS: ["project-members"],
  
  // Uploads
  UPLOADS: ["uploads"],
  UPLOAD: ["upload"],
  
  // Charts
  CHARTS: ["charts"],
  CHART: ["chart"],
} as const;
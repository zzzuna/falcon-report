// Firestore Data Models & Types

export type ReportStatus = 'draft' | 'published' | 'archived';
export type PriorityLevel = 'Low' | 'Medium' | 'High';
export type SectionKey =
    | 'executive_summary'
    | 'key_concerns'
    | 'upgrade_projects'
    | 'readiness'
    | 'ehs'
    | 'common_areas'
    | 'finance'
    | 'legal'
    | 'general';

export interface User {
    id: string; // Firebase Auth UID
    email: string;
    role: 'admin' | 'editor';
    createdAt: Date | any; // Firestore Timestamp
    updatedAt: Date | any;
}

export interface KPI {
    label: string;
    value: number | string;
    unit?: string; // e.g. 'AED', '%', 'units'
    statusColor?: 'emerald' | 'amber' | 'rose' | 'slate';
    sortOrder: number;
}

export interface Report {
    id: string; // Document ID
    title: string;
    weekLabel: string;
    reportDate: string; // ISO Date String or Firestore Timestamp
    preparedBy: string;
    status: ReportStatus;
    isPublished: boolean;
    kpis: KPI[]; // Embedded within the report document for easy reading
    createdAt: Date | any;
    updatedAt: Date | any;
}

export interface ReportItem {
    id: string; // Document ID
    reportId: string; // Reference to Report Document
    sectionKey: SectionKey;
    category?: string; // Used for "Key Concerns" grouping
    title: string;
    description: string; // Detailed notes
    status: string; // e.g., "In Progress", "Completed", "Action Required"
    owner?: string; // Responsible party
    targetDate?: string; // ISO Date String
    cost?: number; // Used for Upgrades
    priority?: PriorityLevel; // Used for Concerns
    sortOrder: number; // For manual reordering
    createdAt: Date | any;
    updatedAt: Date | any;
}

export interface ReportFile {
    id: string; // Document ID
    reportId: string; // Reference to Report Document
    sectionKey: SectionKey | 'global';
    fileName: string;
    fileUrl: string; // Firebase Storage Download URL
    fileType: 'pdf' | 'img' | 'doc' | 'sheet' | 'other';
    sortOrder: number;
    uploadedAt: Date | any;
}

// ---------------------------------------------------------
// FIRESTORE COLLECTIONS SETUP INSTRUCTIONS
// 1. users: Path `users/{uid}`
// 2. reports: Path `reports/{reportId}`
// 3. report_items: Path `report_items/{itemId}`
// 4. report_files: Path `report_files/{fileId}`
// ---------------------------------------------------------

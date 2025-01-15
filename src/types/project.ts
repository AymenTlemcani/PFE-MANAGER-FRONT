export interface Project {
  // Required fields
  title: string;
  summary: string;
  technologies: string;
  option: "GL" | "IA" | "RSD" | "SIC";
  type: "Classical" | "Innovative";
  submitted_by: number;
  status: "Proposed" | "Validated" | "Assigned" | "InProgress" | "Completed";
  submission_date: string;
  last_updated_date: string;

  // Optional fields
  project_id?: number;
  material_needs?: string | null;

  // Project proposal fields moved to project_proposal
  project_proposal?: {
    co_supervisor_name: string;
    co_supervisor_surname: string;
    proposal_status: string;
    is_final_version: boolean;
    proposal_order: number;
    proposer_type: "Teacher" | "Student" | "Company";
    submitted_by: number;
    review_comments?: string;
  };
}

export interface ProjectProposal {
  proposal_id: number;
  project_id: number;
  submitted_by: number;
  proposer_type: "Student" | "Teacher" | "Company";
  proposal_order: number;
  proposal_status: "Pending" | "Edited" | "Approved" | "Rejected";
  review_comments?: string;
  co_supervisor_name?: string;
  co_supervisor_surname?: string;
  is_final_version: boolean;
  partner_id?: number;
  additional_details?: Record<string, any>;
  internship_details?: {
    duration: number;
    location: string;
  };
}

/**
 * Admin Prompt Templates
 * 
 * These templates provide standardized prompts for common administrative tasks.
 * They can be used with the AI task generator to quickly create well-structured tasks.
 */

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: 'management' | 'operations' | 'hr' | 'finance' | 'it' | 'general' | 'product';
}

const adminPromptTemplates: PromptTemplate[] = [
  {
    id: 'product-requirements-document',
    name: 'Product Requirements Document (PRD)',
    description: 'Create a comprehensive PRD for a new product or feature',
    template: 'Create a detailed Product Requirements Document (PRD) for [PRODUCT_NAME/FEATURE_NAME]. Include the following sections: 1) Executive Summary, 2) Problem Statement, 3) User Personas, 4) User Stories/Requirements, 5) Success Metrics, 6) Technical Requirements, 7) Design Requirements, 8) Timeline and Milestones, 9) Risks and Mitigations. The PRD should clearly define the scope, target audience, key features, and acceptance criteria for the [PRODUCT_NAME/FEATURE_NAME].',
    category: 'product'
  },
  {
    id: 'team-meeting',
    name: 'Team Meeting',
    description: 'Schedule and prepare for a team meeting',
    template: 'Schedule a team meeting for [DEPARTMENT] to discuss [TOPIC]. Include agenda preparation, meeting room booking, and follow-up action items.',
    category: 'management'
  },
  {
    id: 'onboarding',
    name: 'New Employee Onboarding',
    description: 'Onboard a new team member',
    template: 'Create an onboarding plan for a new [POSITION] starting on [DATE]. Include equipment setup, system access, training schedule, and introduction meetings.',
    category: 'hr'
  },
  {
    id: 'quarterly-report',
    name: 'Quarterly Report',
    description: 'Prepare a quarterly performance report',
    template: 'Prepare the Q[QUARTER] [YEAR] performance report for the [DEPARTMENT] department. Gather key metrics, analyze trends, create visualizations, and prepare an executive summary.',
    category: 'management'
  },
  {
    id: 'budget-review',
    name: 'Budget Review',
    description: 'Review and adjust departmental budget',
    template: 'Conduct a budget review for [DEPARTMENT] for the [TIMEFRAME] period. Analyze expenses, identify variances, and propose adjustments for the remainder of the fiscal year.',
    category: 'finance'
  },
  {
    id: 'vendor-management',
    name: 'Vendor Management',
    description: 'Evaluate and manage vendor relationship',
    template: 'Review the contract and performance of [VENDOR] providing [SERVICE]. Evaluate service quality, pricing, and contract terms. Schedule a review meeting and prepare negotiation points if needed.',
    category: 'operations'
  },
  {
    id: 'system-upgrade',
    name: 'System Upgrade',
    description: 'Plan and implement a system upgrade',
    template: 'Plan the upgrade of [SYSTEM] from version [CURRENT_VERSION] to [NEW_VERSION]. Create a timeline, identify potential risks, communicate with users, and develop a rollback plan.',
    category: 'it'
  },
  {
    id: 'policy-update',
    name: 'Policy Update',
    description: 'Update an organizational policy',
    template: 'Update the [POLICY_NAME] policy to reflect changes in [REGULATIONS/REQUIREMENTS]. Review current policy, draft updates, circulate for feedback, and plan implementation and communication.',
    category: 'hr'
  },
  {
    id: 'event-planning',
    name: 'Event Planning',
    description: 'Plan a company or department event',
    template: 'Organize a [EVENT_TYPE] for [AUDIENCE] on [DATE]. Secure venue, arrange catering, create agenda, send invitations, and coordinate logistics.',
    category: 'general'
  },
  {
    id: 'training-program',
    name: 'Training Program',
    description: 'Develop a training program',
    template: 'Develop a training program on [TOPIC] for [AUDIENCE]. Identify learning objectives, create materials, schedule sessions, and develop an assessment method.',
    category: 'hr'
  },
  {
    id: 'compliance-audit',
    name: 'Compliance Audit',
    description: 'Conduct an internal compliance audit',
    template: 'Conduct an internal audit of [AREA] to ensure compliance with [REGULATIONS]. Review documentation, interview stakeholders, identify gaps, and create a remediation plan.',
    category: 'operations'
  },
  {
    id: 'project-kickoff',
    name: 'Project Kickoff',
    description: 'Initiate a new project',
    template: 'Prepare for the kickoff of the [PROJECT_NAME] project. Define scope, assemble team, create initial timeline, identify stakeholders, and schedule kickoff meeting.',
    category: 'management'
  },
  {
    id: 'performance-review',
    name: 'Performance Reviews',
    description: 'Conduct employee performance reviews',
    template: 'Schedule and prepare for [TIMEFRAME] performance reviews for the [DEPARTMENT] team. Gather feedback, prepare evaluation forms, schedule meetings, and document outcomes.',
    category: 'hr'
  }
];

export default adminPromptTemplates; 
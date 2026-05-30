import { Project } from "./types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-001",
    name: "E-Commerce Platform Redesign",
    clientName: "Luxe Retail Co.",
    description:
      "Complete overhaul of the existing e-commerce platform with modern UI, improved checkout flow, AI-powered product recommendations, and mobile-first responsive design.",
    budget: 85000,
    deadline: "2026-07-15",
    stage: "Development",
    notes: [
      {
        id: "note-001",
        content: "Client approved the wireframes. Moving to component library setup.",
        createdAt: "2026-05-20T10:30:00Z",
      },
      {
        id: "note-002",
        content: "Payment gateway integration selected: Stripe + PayPal.",
        createdAt: "2026-05-25T14:00:00Z",
      },
    ],
    createdAt: "2026-04-01T09:00:00Z",
    updatedAt: "2026-05-25T14:00:00Z",
  },
  {
    id: "proj-002",
    name: "Healthcare Patient Portal",
    clientName: "MediCare Solutions",
    description:
      "HIPAA-compliant patient portal with appointment scheduling, secure messaging, lab results viewing, and telemedicine integration.",
    budget: 120000,
    deadline: "2026-08-30",
    stage: "Design",
    notes: [
      {
        id: "note-003",
        content: "Compliance review passed. UI design phase started.",
        createdAt: "2026-05-18T11:00:00Z",
      },
    ],
    createdAt: "2026-04-15T10:00:00Z",
    updatedAt: "2026-05-18T11:00:00Z",
  },
  {
    id: "proj-003",
    name: "Fleet Management Dashboard",
    clientName: "TransGlobal Logistics",
    description:
      "Real-time fleet tracking dashboard with GPS integration, fuel analytics, driver performance metrics, and route optimization.",
    budget: 65000,
    deadline: "2026-06-10",
    stage: "Testing",
    notes: [
      {
        id: "note-004",
        content: "All unit tests passing. Integration testing with GPS API in progress.",
        createdAt: "2026-05-28T09:00:00Z",
      },
    ],
    createdAt: "2026-03-10T08:00:00Z",
    updatedAt: "2026-05-28T09:00:00Z",
  },
  {
    id: "proj-004",
    name: "SaaS Analytics Tool",
    clientName: "DataViz Inc.",
    description:
      "Multi-tenant analytics platform with customizable dashboards, real-time data streaming, PDF report generation, and white-label capabilities.",
    budget: 150000,
    deadline: "2026-09-20",
    stage: "Requirement",
    notes: [
      {
        id: "note-005",
        content: "Initial stakeholder meeting completed. Requirements document in draft.",
        createdAt: "2026-05-27T16:00:00Z",
      },
    ],
    createdAt: "2026-05-25T10:00:00Z",
    updatedAt: "2026-05-27T16:00:00Z",
  },
  {
    id: "proj-005",
    name: "Restaurant Ordering App",
    clientName: "FoodChain Group",
    description:
      "Cross-platform mobile ordering application with menu management, real-time order tracking, loyalty rewards program, and kitchen display system.",
    budget: 45000,
    deadline: "2026-06-05",
    stage: "Deployment",
    notes: [
      {
        id: "note-006",
        content: "Final QA passed. Setting up CI/CD pipeline for production.",
        createdAt: "2026-05-29T12:00:00Z",
      },
    ],
    createdAt: "2026-02-20T09:00:00Z",
    updatedAt: "2026-05-29T12:00:00Z",
  },
  {
    id: "proj-006",
    name: "CRM Integration Suite",
    clientName: "Nexus Corp.",
    description:
      "Custom CRM system with Salesforce integration, automated email campaigns, lead scoring, and advanced contact management.",
    budget: 72000,
    deadline: "2026-06-30",
    stage: "Support",
    notes: [
      {
        id: "note-007",
        content: "Deployed to production. Client training sessions scheduled for next week.",
        createdAt: "2026-05-15T10:00:00Z",
      },
      {
        id: "note-008",
        content: "Minor bug fix: email template rendering on Outlook.",
        createdAt: "2026-05-22T15:30:00Z",
      },
    ],
    createdAt: "2026-01-10T09:00:00Z",
    updatedAt: "2026-05-22T15:30:00Z",
  },
];

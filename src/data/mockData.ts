/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Task, User, Comment, Activity, AppPreferences, UserProfile } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Refresh the company website and improve usability with modern layout components.",
    color: "#3b82f6", // Blue
    taskCount: 5,
    completedTaskCount: 2,
    progress: 40,
    targetDate: "2026-06-30"
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Design and build the first mobile application prototype, integrating custom view gestures.",
    color: "#ef4444", // Red
    taskCount: 4,
    completedTaskCount: 1,
    progress: 25,
    targetDate: "2026-07-15"
  },
  {
    id: 3,
    name: "Marketing Campaign",
    description: "Launch Q3 visual assets and prepare newsletters targeting system designers.",
    color: "#22c55e", // Green
    taskCount: 3,
    completedTaskCount: 1,
    progress: 33,
    targetDate: "2026-06-25"
  }
];

export const INITIAL_TEAM: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Project Manager",
    avatar: "AJ"
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Senior Developer",
    avatar: "BS"
  },
  {
    id: 3,
    name: "Carol Lee",
    email: "carol@example.com",
    role: "Product Designer",
    avatar: "CL"
  },
  {
    id: 4,
    name: "Daniel Green",
    email: "daniel@example.com",
    role: "QA Engineer",
    avatar: "DG"
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: "Design login page",
    description: "Create a responsive, highly accessible login page based on the approved user wireframes.",
    status: "done",
    priority: "high",
    dueDate: "2026-06-05",
    assignee: "Carol Lee",
    assigneeId: 3,
    projectId: 1,
    commentsCount: 2,
    labels: ["UI", "Design"]
  },
  {
    id: 2,
    title: "Create dashboard layout",
    description: "Implement the interactive dashboard view container containing progress badges and custom stats cards.",
    status: "in-progress",
    priority: "medium",
    dueDate: "2026-06-08",
    assignee: "Bob Smith",
    assigneeId: 2,
    projectId: 1,
    commentsCount: 1,
    labels: ["Frontend"]
  },
  {
    id: 3,
    title: "Review mobile navigation drawer",
    description: "Conduct layout testing and review usability metrics of the mobile slide-out drawer.",
    status: "review",
    priority: "low",
    dueDate: "2026-06-10",
    assignee: "Alice Johnson",
    assigneeId: 1,
    projectId: 2,
    commentsCount: 2,
    labels: ["Mobile", "User Flow"]
  },
  {
    id: 4,
    title: "Prepare developer onboarding guide",
    description: "Draft comprehensive workspace instructions explaining package installers, routing structures, and types.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-06-12",
    assignee: "Alice Johnson",
    assigneeId: 1,
    projectId: 1,
    commentsCount: 0,
    labels: ["Documentation"]
  },
  {
    id: 5,
    title: "Integrate status badge component",
    description: "Render high-contrast colored status pill matrices mapping directly to high, medium, and low parameters.",
    status: "done",
    priority: "low",
    dueDate: "2026-06-01",
    assignee: "Bob Smith",
    assigneeId: 2,
    projectId: 1,
    commentsCount: 0,
    labels: ["Component"]
  },
  {
    id: 6,
    title: "Configure Applet testing setup",
    description: "Establish unit assertions validating route updates and component animations across containers.",
    status: "todo",
    priority: "high",
    dueDate: "2026-06-15",
    assignee: "Daniel Green",
    assigneeId: 4,
    projectId: 2,
    commentsCount: 0,
    labels: ["CI-CD"]
  },
  {
    id: 7,
    title: "Develop high-fidelity prototypes",
    description: "Deliver interactive prototypes detailing transition animations between dashboard layers.",
    status: "done",
    priority: "high",
    dueDate: "2026-06-04",
    assignee: "Carol Lee",
    assigneeId: 3,
    projectId: 2,
    commentsCount: 0,
    labels: ["Design"]
  },
  {
    id: 8,
    title: "Conduct mobile core audits",
    description: "Audit packet loads and compression ratios for mobile layouts to increase cold-start metrics.",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-06-07",
    assignee: "Bob Smith",
    assigneeId: 2,
    projectId: 2,
    commentsCount: 0,
    labels: ["Optimization"]
  },
  {
    id: 9,
    title: "Optimize SVG asset layouts",
    description: "Minify vector scales to prevent rendering overflows and ensure scalable clarity.",
    status: "todo",
    priority: "low",
    dueDate: "2026-06-18",
    assignee: "Carol Lee",
    assigneeId: 3,
    projectId: 3,
    commentsCount: 1,
    labels: ["Asset"]
  },
  {
    id: 10,
    title: "Deploy beta newsletter layouts",
    description: "Distribute draft mockups of visual email template layouts for final review before launch.",
    status: "done",
    priority: "medium",
    dueDate: "2026-06-03",
    assignee: "Alice Johnson",
    assigneeId: 1,
    projectId: 3,
    commentsCount: 0,
    labels: ["Launch"]
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 1,
    taskId: 1,
    userId: 2,
    userName: "Bob Smith",
    avatar: "BS",
    message: "The responsive login mockup is fully updated. Tested and built across viewport widths.",
    createdAt: "2026-06-02T09:30:00Z"
  },
  {
    id: 2,
    taskId: 1,
    userId: 3,
    userName: "Carol Lee",
    avatar: "CL",
    message: "Looks fantastic! I've double checked contrast ratios on the dark field borders. Fully verified.",
    createdAt: "2026-06-02T10:15:00Z"
  },
  {
    id: 3,
    taskId: 2,
    userId: 1,
    userName: "Alice Johnson",
    avatar: "AJ",
    message: "Please integrate the dynamic statistic widgets before writing detailed page layouts.",
    createdAt: "2026-06-02T11:00:00Z"
  },
  {
    id: 4,
    taskId: 3,
    userId: 1,
    userName: "Alice Johnson",
    avatar: "AJ",
    message: "Let me know when the mobile swipe handler draft has been pushed. I want to test tactile sensitivity.",
    createdAt: "2026-06-02T08:00:00Z"
  },
  {
    id: 5,
    taskId: 3,
    userId: 3,
    userName: "Carol Lee",
    avatar: "CL",
    message: "Working on it today Daniel. Expect direct links shortly.",
    createdAt: "2026-06-02T09:45:00Z"
  },
  {
    id: 6,
    taskId: 9,
    userId: 2,
    userName: "Bob Smith",
    avatar: "BS",
    message: "Can we bundle these SVGs into a single sprite? It reduces HTTP handshakes.",
    createdAt: "2026-06-02T13:40:00Z"
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 1,
    text: "Carol Lee completed 'Design login page' within Website Redesign",
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    text: "Bob Smith commented on 'Create dashboard layout' page progress",
    timestamp: "3 hours ago"
  },
  {
    id: 3,
    text: "Alice Johnson updated 'Review mobile navigation drawer' task status to Review",
    timestamp: "5 hours ago"
  },
  {
    id: 4,
    text: "Daniel Green added a new task 'Configure Applet testing setup'",
    timestamp: "Yesterday"
  },
  {
    id: 5,
    text: "Bob Smith moved 'Conduct mobile core audits' to In Progress container",
    timestamp: "Yesterday"
  }
];

export const DEFAULT_PREFERENCES: AppPreferences = {
  theme: 'light',
  density: 'comfortable',
  notifyAssignments: true,
  notifyReminders: true,
  notifyComments: true,
  notifyUpdates: false,
  defaultView: 'board',
  defaultSort: 'dueDate',
  showCompleted: true
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: "Alice Johnson",
  email: "alice@example.com",
  title: "Project Lead",
  avatar: "AJ"
};

// LocalStorage helpers
export const loadData = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(`taskflow_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const saveData = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`taskflow_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
  }
};

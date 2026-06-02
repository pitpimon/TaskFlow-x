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
    taskCount: 9,
    completedTaskCount: 3,
    progress: 33,
    targetDate: "2026-06-30"
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Design and build the first mobile application prototype, integrating custom view gestures.",
    color: "#ef4444", // Red
    taskCount: 8,
    completedTaskCount: 2,
    progress: 25,
    targetDate: "2026-07-15"
  },
  {
    id: 3,
    name: "Marketing Campaign",
    description: "Launch Q3 visual assets and prepare newsletters targeting system designers.",
    color: "#22c55e", // Green
    taskCount: 6,
    completedTaskCount: 3,
    progress: 50,
    targetDate: "2026-06-25"
  },
  {
    id: 4,
    name: "Fintech API Integration",
    description: "Map secure banking APIs, construct high-throughput request tunnels, and handle ledger synchronization.",
    color: "#f59e0b", // Amber
    taskCount: 6,
    completedTaskCount: 2,
    progress: 33,
    targetDate: "2026-07-28"
  },
  {
    id: 5,
    name: "Brand & Identity Kit",
    description: "Publish the master brand guideline assets, customizable templates, and core logotypes.",
    color: "#8b5cf6", // Purple
    taskCount: 6,
    completedTaskCount: 3,
    progress: 50,
    targetDate: "2026-06-18"
  },
  {
    id: 6,
    name: "Information Security ISO Audits",
    description: "Draft disaster response checklists, enforce tight CORS properties, and complete system audits.",
    color: "#06b6d4", // Cyan
    taskCount: 6,
    completedTaskCount: 2,
    progress: 33,
    targetDate: "2026-08-10"
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
  },
  {
    id: 5,
    name: "Emma Watson",
    email: "emma@example.com",
    role: "Frontend Engineer",
    avatar: "EW"
  },
  {
    id: 6,
    name: "Frank Miller",
    email: "frank@example.com",
    role: "Security Architect",
    avatar: "FM"
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
  },
  {
    id: 11,
    title: "Map banking endpoint request schemas",
    description: "Establish strong parameter checking on incoming transaction hooks.",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-06-14",
    assignee: "Bob Smith",
    assigneeId: 2,
    projectId: 4,
    commentsCount: 2,
    labels: ["Backend", "Fintech"]
  },
  {
    id: 12,
    title: "Enforce multi-tenant ledger synchronization",
    description: "Develop strict database locks avoiding write conflicts on shared general ledger indices.",
    status: "todo",
    priority: "high",
    dueDate: "2026-06-22",
    assignee: "Bob Smith",
    assigneeId: 2,
    projectId: 4,
    commentsCount: 0,
    labels: ["Database"]
  },
  {
    id: 13,
    title: "Configure Slack alerts on failed request retries",
    description: "Hook error catch blocks directly into general operational notifications channels.",
    status: "done",
    priority: "low",
    dueDate: "2026-05-28",
    assignee: "Emma Watson",
    assigneeId: 5,
    projectId: 4,
    commentsCount: 0,
    labels: ["Ops"]
  },
  {
    id: 14,
    title: "Draft system recovery checklist for ISO readiness",
    description: "Compile backup frequencies, load balancing fallback procedures, and target metrics.",
    status: "review",
    priority: "high",
    dueDate: "2026-06-20",
    assignee: "Alice Johnson",
    assigneeId: 1,
    projectId: 6,
    commentsCount: 1,
    labels: ["Security", "Compliance"]
  },
  {
    id: 15,
    title: "Enforce HTTPS redirect and Secure cookie descriptors",
    description: "Ensure all cookie variables hold Secure and HttpOnly modifiers to safeguard tokens.",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-06-08",
    assignee: "Frank Miller",
    assigneeId: 6,
    projectId: 6,
    commentsCount: 0,
    labels: ["Security", "Auditing"]
  },
  {
    id: 16,
    title: "Build custom interactive dashboard charts",
    description: "Utilize accessible d3 lines for showing week-over-week performance aggregates.",
    status: "in-progress",
    priority: "medium",
    dueDate: "2026-06-09",
    assignee: "Emma Watson",
    assigneeId: 5,
    projectId: 1,
    commentsCount: 1,
    labels: ["Frontend", "Charts"]
  },
  {
    id: 17,
    title: "Test responsive grid layout structures",
    description: "Verify bento containers rearrange cleanly across various viewport sizes.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-06-16",
    assignee: "Emma Watson",
    assigneeId: 5,
    projectId: 1,
    commentsCount: 0,
    labels: ["UI", "Responsive"]
  },
  {
    id: 18,
    title: "Audit local memory space in animations",
    description: "Benchmark page transitions using React Profiler to prevent CPU throttling.",
    status: "review",
    priority: "medium",
    dueDate: "2026-06-06",
    assignee: "Bob Smith",
    assigneeId: 2,
    projectId: 2,
    commentsCount: 0,
    labels: ["Performance"]
  },
  {
    id: 19,
    title: "Publish color system and custom typography templates",
    description: "Deliver copy-paste tailwind styles for external design resources.",
    status: "done",
    priority: "high",
    dueDate: "2026-06-01",
    assignee: "Carol Lee",
    assigneeId: 3,
    projectId: 5,
    commentsCount: 0,
    labels: ["Asset", "Branding"]
  },
  {
    id: 20,
    title: "Provision operational SSL certificates",
    description: "Initialize Certbot script pipelines and automate certificate renewal cron targets.",
    status: "done",
    priority: "medium",
    dueDate: "2026-05-25",
    assignee: "Frank Miller",
    assigneeId: 6,
    projectId: 6,
    commentsCount: 0,
    labels: ["CI-CD"]
  },
  {
    id: 21,
    title: "Setup brand vectors and initial master canvas file",
    description: "Create standard icons, splash images, and placeholder visual grids.",
    status: "done",
    priority: "high",
    dueDate: "2026-05-24",
    assignee: "Carol Lee",
    assigneeId: 3,
    projectId: 5,
    commentsCount: 0,
    labels: ["Design"]
  },
  {
    id: 22,
    title: "Audit media assets scale ratios",
    description: "Ensure marketing newsletters load within standard visual ranges.",
    status: "todo",
    priority: "low",
    dueDate: "2026-06-24",
    assignee: "Carol Lee",
    assigneeId: 3,
    projectId: 5,
    commentsCount: 0,
    labels: ["Branding"]
  },
  {
    id: 23,
    title: "Incorporate dark mode styles with Tailwind",
    description: "Design semantic utility boundaries for seamless bento color shifts.",
    status: "done",
    priority: "high",
    dueDate: "2026-06-02",
    assignee: "Emma Watson",
    assigneeId: 5,
    projectId: 1,
    commentsCount: 0,
    labels: ["UI", "Tailwind"]
  },
  {
    id: 24,
    title: "Optimize mobile menu overlay animations",
    description: "Improve FPS during navigation transformations on tap.",
    status: "in-progress",
    priority: "medium",
    dueDate: "2026-06-11",
    assignee: "Emma Watson",
    assigneeId: 5,
    projectId: 1,
    commentsCount: 0,
    labels: ["Frontend", "UX"]
  },
  {
    id: 25,
    title: "Validate contact form form-level schemas",
    description: "Double-check phone syntax check parameters.",
    status: "todo",
    priority: "low",
    dueDate: "2026-06-18",
    assignee: "Daniel Green",
    assigneeId: 4,
    projectId: 1,
    commentsCount: 0,
    labels: ["QA", "Logic"]
  },
  {
    id: 26,
    title: "Setup push notifications service integration",
    description: "Establish connections with Expo push certificates and client notification listeners.",
    status: "done",
    priority: "high",
    dueDate: "2026-05-29",
    assignee: "Bob Smith",
    assigneeId: 2,
    projectId: 2,
    commentsCount: 0,
    labels: ["Mobile", "Backend"]
  },
  {
    id: 27,
    title: "Verify offline storage index patterns",
    description: "Confirm standard SQLite or AsyncStorage caches write securely when offline transitions trigger.",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-06-10",
    assignee: "Bob Smith",
    assigneeId: 2,
    projectId: 2,
    commentsCount: 0,
    labels: ["Database", "Mobile"]
  },
  {
    id: 28,
    title: "Conduct manual click-to-release QA logs",
    description: "Ensure click limits and bounds are fully validated.",
    status: "todo",
    priority: "low",
    dueDate: "2026-06-25",
    assignee: "Daniel Green",
    assigneeId: 4,
    projectId: 2,
    commentsCount: 0,
    labels: ["QA"]
  },
  {
    id: 29,
    title: "Write Q3 visual marketing copy",
    description: "Draft scannable copy emphasizing the design modularity and bento grid layout assets.",
    status: "done",
    priority: "medium",
    dueDate: "2026-05-30",
    assignee: "Alice Johnson",
    assigneeId: 1,
    projectId: 3,
    commentsCount: 0,
    labels: ["Copy", "Marketing"]
  },
  {
    id: 30,
    title: "Configure analytics tracker metrics",
    description: "Insert lightweight hooks tracking conversion channels on bento visual click interactions.",
    status: "in-progress",
    priority: "medium",
    dueDate: "2026-06-11",
    assignee: "Emma Watson",
    assigneeId: 5,
    projectId: 3,
    commentsCount: 0,
    labels: ["Analytics", "Marketing"]
  },
  {
    id: 31,
    title: "Coordinate design feedback zoom meet",
    description: "Resolve asset file constraints with Carol and Alice.",
    status: "todo",
    priority: "low",
    dueDate: "2026-06-19",
    assignee: "Carol Lee",
    assigneeId: 3,
    projectId: 3,
    commentsCount: 0,
    labels: ["Asset"]
  },
  {
    id: 32,
    title: "Prepare press release document package",
    description: "Draft the introductory release logs covering visual themes and bento layouts.",
    status: "done",
    priority: "high",
    dueDate: "2026-06-01",
    assignee: "Alice Johnson",
    assigneeId: 1,
    projectId: 3,
    commentsCount: 1,
    labels: ["Launch", "Press"]
  },
  {
    id: 33,
    title: "Configure HMAC request signatures on webhooks",
    description: "Validate webhook body hashes with SHA256 checking routines to prevent spoofing.",
    status: "done",
    priority: "high",
    dueDate: "2026-05-26",
    assignee: "Frank Miller",
    assigneeId: 6,
    projectId: 4,
    commentsCount: 0,
    labels: ["Security", "Fintech"]
  },
  {
    id: 34,
    title: "Optimize ledger pagination indexing",
    description: "Tune compound queries seeking specific account identifiers under heavy records pagination.",
    status: "in-progress",
    priority: "medium",
    dueDate: "2026-06-12",
    assignee: "Bob Smith",
    assigneeId: 2,
    projectId: 4,
    commentsCount: 0,
    labels: ["Database", "Fintech"]
  },
  {
    id: 35,
    title: "Draft api integrations test cases",
    description: "Verify response code ranges for invalid currencies.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-06-21",
    assignee: "Daniel Green",
    assigneeId: 4,
    projectId: 4,
    commentsCount: 0,
    labels: ["QA"]
  },
  {
    id: 36,
    title: "Publish print and vector stickers assets",
    description: "Upload resolution-independent assets of workspace sticker logs.",
    status: "done",
    priority: "low",
    dueDate: "2026-05-29",
    assignee: "Carol Lee",
    assigneeId: 3,
    projectId: 5,
    commentsCount: 0,
    labels: ["Design", "Branding"]
  },
  {
    id: 37,
    title: "Verify color scheme accessibility ranges",
    description: "Ensure typography holds sufficient contrast ranges with background bento cards.",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-06-07",
    assignee: "Carol Lee",
    assigneeId: 3,
    projectId: 5,
    commentsCount: 0,
    labels: ["Branding", "UI"]
  },
  {
    id: 38,
    title: "Design custom identity sticker sheet",
    description: "Create customized stickers emphasizing developers working on sandbox systems.",
    status: "todo",
    priority: "low",
    dueDate: "2026-06-25",
    assignee: "Carol Lee",
    assigneeId: 3,
    projectId: 5,
    commentsCount: 0,
    labels: ["Design"]
  },
  {
    id: 39,
    title: "Perform initial security network scan",
    description: "Run vulnerability assessments on network ports to search for open vectors.",
    status: "done",
    priority: "high",
    dueDate: "2026-05-22",
    assignee: "Frank Miller",
    assigneeId: 6,
    projectId: 6,
    commentsCount: 0,
    labels: ["Security", "Auditing"]
  },
  {
    id: 40,
    title: "Audit IAM access control scopes",
    description: "Verify active access tokens enforce least-privilege logic across the workspace database.",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-06-13",
    assignee: "Frank Miller",
    assigneeId: 6,
    projectId: 6,
    commentsCount: 0,
    labels: ["Security"]
  },
  {
    id: 41,
    title: "Establish disaster recovery mock drills",
    description: "Test recovery restoration timelines with simulated offline database parameters.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-06-28",
    assignee: "Alice Johnson",
    assigneeId: 1,
    projectId: 6,
    commentsCount: 0,
    labels: ["Compliance", "Ops"]
  },
  {
    id: 42,
    title: "Review CSS utility-first performance audits",
    description: "Benchmark first contentful paint when loading intricate bento grid widgets with varying animations count.",
    status: "review",
    priority: "high",
    dueDate: "2026-06-11",
    assignee: "Emma Watson",
    assigneeId: 5,
    projectId: 1,
    commentsCount: 0,
    labels: ["Performance", "CSS"]
  },
  {
    id: 43,
    title: "Draft release notes for App Store review",
    description: "Compile critical list of features, fixes, and responsive layout improvements in Markdown.",
    status: "review",
    priority: "medium",
    dueDate: "2026-06-15",
    assignee: "Alice Johnson",
    assigneeId: 1,
    projectId: 2,
    commentsCount: 0,
    labels: ["Store", "Publishing"]
  },
  {
    id: 44,
    title: "Review marketing copy conversion funnels",
    description: "Evaluate user click retention rates across standard, comfort, and compact density layout displays.",
    status: "review",
    priority: "medium",
    dueDate: "2026-06-12",
    assignee: "Alice Johnson",
    assigneeId: 1,
    projectId: 3,
    commentsCount: 0,
    labels: ["Marketing", "Copy"]
  },
  {
    id: 45,
    title: "Review multi-tenant compliance logs",
    description: "Inspect system audit logs tracking transactional payload changes and encryption cycles.",
    status: "review",
    priority: "high",
    dueDate: "2026-06-14",
    assignee: "Daniel Green",
    assigneeId: 4,
    projectId: 4,
    commentsCount: 0,
    labels: ["Compliance"]
  },
  {
    id: 46,
    title: "Review master color contrast accessibility",
    description: "Perform manual color checks seeking WCAG AAA compliance on all text blocks over active states.",
    status: "review",
    priority: "high",
    dueDate: "2026-06-10",
    assignee: "Carol Lee",
    assigneeId: 3,
    projectId: 5,
    commentsCount: 0,
    labels: ["Accessibility", "UI"]
  },
  {
    id: 47,
    title: "Verify database failover clustering drills",
    description: "Induce simulated primary cluster failures and confirm multi-region backup systems initialize without manual intervention.",
    status: "done",
    priority: "high",
    dueDate: "2026-06-05",
    assignee: "Frank Miller",
    assigneeId: 6,
    projectId: 6,
    commentsCount: 0,
    labels: ["Database", "Ops"]
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


export interface Requirement {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Task {
  id: string;
  name: string;
  duration: string;
  dependencies: string[];
}

export interface Risk {
  category: string;
  impact: string;
  mitigation: string;
}

export interface Comment {
  id: string;
  targetId: string; // ID of Requirement, Task, or 'global'
  author: string;
  text: string;
  timestamp: string;
  authorColor: string;
}

export interface UserPresence {
  id: string;
  name: string;
  color: string;
  isMe?: boolean;
}

export interface AnalysisResult {
  projectName: string;
  summary: string;
  requirements: Requirement[];
  tasks: Task[];
  timeline: string;
  workflowMermaid: string;
  risks: Risk[];
  insights: string[];
  criticFeedback: string;
}

export type AppView = 'DASHBOARD' | 'ANALYSIS' | 'HISTORY';

export interface HistoryItem {
  id: string;
  name: string;
  date: string;
  result: AnalysisResult;
}

export interface Item {
  id: string;
  text: string;
  completed: boolean;
  state?: "unresolved" | "prepared" | "completed";
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

export interface ListSettings {
  threeStageMode: boolean;
  defaultSort: "manual" | "alphabetical" | "completed";
}

export interface List {
  id: string;
  name: string;
  items: Item[];
  categoryId: string;
  order?: number;
  settings?: ListSettings;
}

export interface Category {
  id: string;
  name: string;
  order?: number;
}

export interface Commit {
  hash: string;
  author: string;
  date: string;
  message: string;
  files?: {
    status: string;
    path: string;
  }[];
}

export interface ExecutionSession {
  id: string;
  name: string;
  listIds: string[];
  createdAt: string;
  completedAt?: string;
  categoryId?: string;
}

export interface ListCombination {
  id: string;
  name: string;
  listIds: string[];
  createdAt: string;
  updatedAt?: string;
}

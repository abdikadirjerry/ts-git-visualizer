export interface Commit {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  parentId: string | null;
  branch: string;
}

export interface Branch {
  name: string;
  targetCommitId: string;
  color: string;
}

export interface GitGraphNode {
  commit: Commit;
  x: number;
  y: number;
}
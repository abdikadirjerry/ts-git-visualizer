import React, { useState } from 'react';
import { Commit, Branch, GitGraphNode } from './types/git';

const INITIAL_COMMIT: Commit = {
  id: 'c1a89f0',
  message: 'Initial commit',
  author: 'Abdikadir',
  timestamp: new Date().toLocaleTimeString(),
  parentId: null,
  branch: 'main',
};

const BRANCH_COLORS = ['#38bdf8', '#f43f5e', '#a855f7', '#22c55e', '#eab308'];

export const App: React.FC = () => {
  const [commits, setCommits] = useState<Commit[]>([INITIAL_COMMIT]);
  const [branches, setBranches] = useState<Branch[]>([
    { name: 'main', targetCommitId: 'c1a89f0', color: '#38bdf8' },
  ]);
  const [activeBranch, setActiveBranch] = useState<string>('main');
  const [commitMsg, setCommitMsg] = useState<string>('');
  const [newBranchName, setNewBranchName] = useState<string>('');

  // Get active branch's HEAD commit
  const currentBranchObj = branches.find((b) => b.name === activeBranch);
  const headCommitId = currentBranchObj ? currentBranchObj.targetCommitId : commits[commits.length - 1].id;

  // Handler: Add a new Commit
  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMsg.trim()) return;

    const newId = Math.random().toString(16).substring(2, 9);
    const newCommit: Commit = {
      id: newId,
      message: commitMsg,
      author: 'Abdikadir',
      timestamp: new Date().toLocaleTimeString(),
      parentId: headCommitId,
      branch: activeBranch,
    };

    setCommits((prev) => [...prev, newCommit]);
    setBranches((prev) =>
      prev.map((b) => (b.name === activeBranch ? { ...b, targetCommitId: newId } : b))
    );
    setCommitMsg('');
  };

  // Handler: Create new Branch
  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim() || branches.some((b) => b.name === newBranchName)) return;

    const color = BRANCH_COLORS[branches.length % BRANCH_COLORS.length];
    const newBranch: Branch = {
      name: newBranchName.trim(),
      targetCommitId: headCommitId,
      color,
    };

    setBranches((prev) => [...prev, newBranch]);
    setActiveBranch(newBranchName.trim());
    setNewBranchName('');
  };

  // Map Commits to X/Y Grid Coordinates for Graph Rendering
  const branchYMap: Record<string, number> = {};
  branches.forEach((b, idx) => {
    branchYMap[b.name] = 80 + idx * 70;
  });

  const nodes: GitGraphNode[] = commits.map((commit, idx) => ({
    commit,
    x: 80 + idx * 110,
    y: branchYMap[commit.branch] || 80,
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold shadow-lg shadow-sky-950/50">
            GIT
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 tracking-wider uppercase">
              TS-GIT // Graph Visualizer
            </h1>
            <p className="text-[10px] text-slate-400">REACT + TYPESCRIPT DIRECTED GRAPH ENGINE</p>
          </div>
        </div>
        <div className="text-xs text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
          ACTIVE HEAD: <span className="text-sky-400 font-bold">{activeBranch}</span> ({headCommitId})
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Commit Form */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h2 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Execute Commit on [{activeBranch}]
            </h2>
            <form onSubmit={handleCommit} className="space-y-3">
              <input
                type="text"
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                placeholder="Commit message (e.g., feat: add auth router)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition-colors"
              >
                git commit -m
              </button>
            </form>
          </div>

          {/* Branch Form */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h2 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Create New Branch
            </h2>
            <form onSubmit={handleCreateBranch} className="space-y-3">
              <input
                type="text"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                placeholder="Branch name (e.g., feature/login)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition-colors"
              >
                git checkout -b
              </button>
            </form>
          </div>

          {/* Branch Selector */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Active Branch HEAD
            </h2>
            <div className="space-y-2">
              {branches.map((b) => (
                <button
                  key={b.name}
                  onClick={() => setActiveBranch(b.name)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex justify-between items-center border transition-all ${
                    activeBranch === b.name
                      ? 'bg-slate-800 border-sky-500/50 text-sky-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: b.color }}
                    ></span>
                    {b.name}
                  </span>
                  <span className="text-[10px] text-slate-500">HEAD -&gt; {b.targetCommitId}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Graph Viewport */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col space-y-4 overflow-x-auto min-h-[450px]">
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Repository Commit Graph DAG
          </h2>

          <div className="flex-1 w-full min-w-[600px] relative border border-slate-950/80 bg-slate-950/80 rounded-xl p-4 overflow-auto">
            <svg className="w-full h-[350px]">
              {/* Connector Lines between Parents and Children */}
              {nodes.map((node) => {
                if (!node.commit.parentId) return null;
                const parentNode = nodes.find((n) => n.commit.id === node.commit.parentId);
                if (!parentNode) return null;

                const branchObj = branches.find((b) => b.name === node.commit.branch);
                const strokeColor = branchObj ? branchObj.color : '#64748b';

                return (
                  <line
                    key={`${parentNode.commit.id}-${node.commit.id}`}
                    x1={parentNode.x}
                    y1={parentNode.y}
                    x2={node.x}
                    y2={node.y}
                    stroke={strokeColor}
                    strokeWidth="3"
                    strokeDasharray={parentNode.y !== node.y ? '4' : '0'}
                  />
                );
              })}

              {/* Commit Nodes */}
              {nodes.map((node) => {
                const branchObj = branches.find((b) => b.name === node.commit.branch);
                const isHead = branches.some((b) => b.targetCommitId === node.commit.id);
                const nodeColor = branchObj ? branchObj.color : '#38bdf8';

                return (
                  <g key={node.commit.id} className="cursor-pointer group">
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isHead ? '12' : '9'}
                      fill="#020617"
                      stroke={nodeColor}
                      strokeWidth="3"
                      className="transition-all duration-300 group-hover:r-14"
                    />
                    <text
                      x={node.x}
                      y={node.y + 24}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="10"
                      className="font-mono"
                    >
                      {node.commit.id}
                    </text>
                    <text
                      x={node.x}
                      y={node.y - 18}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {node.commit.message.substring(0, 14)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
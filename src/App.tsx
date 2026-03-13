import { useState, useEffect, useCallback, useMemo } from "react";
import Canvas from "./components/Canvas";
import EditPanel from "./components/EditPanel";
import Preview from "./components/Preview";
import { validateFlow } from "./utils/validateFlow";
import { FlowNode, CanvasSize } from "./types";

const NODE_WIDTH = 260;
const NODE_HEIGHT = 140;

type Mode = "editor" | "preview";

export default function App() {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ w: 1200, h: 800 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("editor");

  // Fetch flow data on mount
  useEffect(() => {
    fetch("/flow_data.json")
      .then((res) => res.json())
      .then((data) => {
        setNodes(data.nodes);
        setCanvasSize(data.meta.canvas_size);
      });
  }, []);

  // Update any field(s) on a node
  const updateNode = useCallback((id: string, changes: Partial<FlowNode>) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, ...changes } : node)),
    );
  }, []);

  // Run BFS graph validation reactively whenever nodes change
  const validation = useMemo(() => validateFlow(nodes), [nodes]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="h-screen overflow-hidden bg-canvas text-gray-800">
      {/* Main content fills full viewport */}
      <div className="h-full flex overflow-hidden">
        {mode === "editor" ? (
          <>
            <Canvas
              nodes={nodes}
              canvasSize={canvasSize}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              nodeWidth={NODE_WIDTH}
              nodeHeight={NODE_HEIGHT}
              validationResult={validation}
            />
            {selectedNode && (
              <EditPanel
                node={selectedNode}
                onUpdate={updateNode}
                onClose={() => setSelectedNodeId(null)}
              />
            )}
          </>
        ) : (
          <Preview nodes={nodes} />
        )}
      </div>

      {/* Floating validation badge — only visible in editor mode */}
      {mode === "editor" && (
        <div
          className={`fixed bottom-6 left-6 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium shadow-lg ${
            validation.issueCount === 0
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-orange-50 text-orange-700 border border-orange-200"
          }`}
        >
          {validation.issueCount === 0 ? (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="3,8 7,12 13,4" />
              </svg>
              Ready to go live
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1L1 14h14L8 1zm-.75 5h1.5v4h-1.5V6zm0 5h1.5v1.5h-1.5V11z" />
              </svg>
              {validation.issueCount} {validation.issueCount > 1 ? "things need" : "thing needs"} your attention
            </>
          )}
        </div>
      )}

      {/* Floating Play / Stop button */}
      <button
        onClick={() => {
          setMode(mode === "editor" ? "preview" : "editor");
          setSelectedNodeId(null);
        }}
        className={`fixed bottom-6 right-6 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium shadow-lg transition-all ${
          mode === "preview"
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gray-900 text-white hover:bg-gray-700"
        }`}
      >
        {mode === "preview" ? (
          <>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <rect x="3" y="3" width="10" height="10" rx="1" />
            </svg>
            Stop
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <polygon points="4,2 14,8 4,14" />
            </svg>
            Play
          </>
        )}
      </button>
    </div>
  );
}

# SupportFlow Visual Builder

A visual decision-tree editor for building and testing customer support chatbot flows. Built from scratch using React — no flowchart libraries, no UI component frameworks.

---

## Overview

Support teams typically configure help-bot conversation flows through spreadsheets, which are hard to visualize and error-prone to maintain. SupportFlow Visual Builder replaces that with an interactive flowchart canvas where managers can see the full conversation logic at a glance, edit it in real time, and test the bot experience instantly — all in one tool.

---

## Features

### Visual Flow Canvas
Conversation nodes are rendered as cards, absolutely positioned on a canvas using coordinates from the flow data. Parent-to-child relationships are drawn as smooth SVG bezier curves with arrowheads and inline edge labels, built entirely with SVG path math — no third-party graph libraries.

### Node Editor
Clicking any node opens a side panel to edit the question text and option labels. Changes reflect on the canvas immediately via controlled state — no save button, no round-trip.

### Preview Mode
A Play button switches from the editor flowchart to a chat-style interface that simulates the real bot experience. The conversation traverses the decision tree node by node as the user selects answers, and shows a Restart button when a terminal node is reached.

### Flow Validation *(Wildcard Feature)*
As teams edit flows, mistakes creep in — an option that leads to a node that doesn't exist, or a node that no path from the start ever reaches. These errors are invisible until a real customer hits a broken path and the bot fails.

The validator runs a BFS graph traversal from the start node on every edit. Any node outside the reachable set is flagged **"Customers can't reach this"** with an orange dashed border. Any node with an option pointing to a non-existent destination is flagged **"An answer goes nowhere"** with a red border. A floating badge shows **"Ready to go live"** when the flow is clean, or **"N things need your attention"** when issues exist.

**Why this adds business value:** It catches configuration errors before they reach production. A broken support bot costs customer trust and generates extra tickets. Validation makes the editor self-auditing — managers get instant feedback on every change without needing a developer to review the JSON.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 (Vite) |
| Language | TypeScript |
| Styling | Tailwind CSS (CDN) |
| Graph rendering | Custom SVG — no react-flow, jsPlumb, or mermaid |
| UI components | Custom only — no MUI, Bootstrap, or Chakra |
| State | React `useState` / `useCallback` / `useMemo` (in-memory) |
| Data | `flow_data.json` (local) |

---

## Project Structure

```
src/
├── App.tsx                  # Root: data loading, mode toggle, state, validation badge
├── types.ts                 # Shared TypeScript interfaces (FlowNode, ValidationResult)
├── utils/
│   └── validateFlow.ts      # BFS graph traversal — detects unreachable and broken nodes
└── components/
    ├── Canvas.tsx            # Scrollable canvas container + coordinate context
    ├── NodeCard.tsx          # Absolutely-positioned node card with issue indicators
    ├── Connectors.tsx        # SVG overlay: bezier curves + edge labels
    ├── EditPanel.tsx         # Side panel: controlled inputs for node editing
    └── Preview.tsx           # Chat-style bot runner
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Key DOM Concepts Demonstrated

| Concept | Location |
|---|---|
| Absolute positioning with dynamic coordinates | `NodeCard.tsx` |
| SVG path drawing and cubic bezier math | `Connectors.tsx` |
| `pointer-events: none` SVG passthrough | `Connectors.tsx` |
| Controlled form inputs with immediate re-render | `EditPanel.tsx` |
| `useEffect` for focus and keyboard event management | `EditPanel.tsx` |
| `scrollIntoView` scroll management | `Preview.tsx` |
| BFS graph traversal on a directed graph | `utils/validateFlow.ts` |
| `useMemo` for reactive derived state | `App.tsx` |
| State machine: editor ↔ preview mode toggle | `App.tsx` |

---

## Data Format

Flow data is loaded from `public/flow_data.json`. Each node has:

```json
{
  "id": "1",
  "type": "start | question | end",
  "text": "The question or message text",
  "position": { "x": 500, "y": 50 },
  "options": [
    { "label": "Option text", "nextId": "2" }
  ]
}
```

Nodes with an empty `options` array are leaf nodes (end of conversation).

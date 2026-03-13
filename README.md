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

### Drag-to-Reposition (Wildcard Feature)
Nodes can be freely dragged around the canvas. The SVG connector lines recalculate and redraw live as nodes move.

**Why this feature adds business value:** Flow diagrams grow complex quickly. When a manager adds a new branch or restructures a conversation, they need to untangle overlapping nodes without touching JSON coordinates. Drag-to-reposition makes the tool self-sufficient — the canvas becomes the source of truth for layout, not a config file. It also demonstrates the full `mousedown → mousemove → mouseup` DOM event lifecycle, `getBoundingClientRect()` coordinate transforms, and document-level listener management with guaranteed cleanup.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 (Vite) |
| Styling | Tailwind CSS (CDN) |
| Graph rendering | Custom SVG — no react-flow, jsPlumb, or mermaid |
| UI components | Custom only — no MUI, Bootstrap, or Chakra |
| State | React `useState` / `useCallback` (in-memory) |
| Data | `flow_data.json` (local) |

---

## Project Structure

```
src/
├── App.jsx                  # Root: data loading, mode toggle, state
├── hooks/
│   └── useDrag.js           # Mouse event lifecycle for node dragging
└── components/
    ├── Canvas.jsx            # Scrollable canvas container + coordinate context
    ├── NodeCard.jsx          # Absolutely-positioned node card
    ├── Connectors.jsx        # SVG overlay: bezier curves + edge labels
    ├── EditPanel.jsx         # Side panel: controlled inputs for node editing
    └── Preview.jsx           # Chat-style bot runner
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
| Absolute positioning with dynamic coordinates | `NodeCard.jsx` |
| SVG path drawing and cubic bezier math | `Connectors.jsx` |
| `mouse` event lifecycle on `document` | `useDrag.js` |
| `getBoundingClientRect()` coordinate transforms | `useDrag.js` |
| Document-level listener add/remove with exact references | `useDrag.js` |
| Controlled form inputs with immediate re-render | `EditPanel.jsx` |
| `useEffect` for focus and keyboard event management | `EditPanel.jsx` |
| `scrollIntoView` scroll management | `Preview.jsx` |
| State machine: editor ↔ preview mode toggle | `App.jsx` |

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

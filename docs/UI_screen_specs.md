# Prob - Detailed UI Screen Specifications

## Table of Contents
1. [Global Layout Structure](#global-layout-structure)
2. [Screen 1: Welcome / Problem Input](#screen-1-welcome--problem-input)
3. [Screen 2: Problem Validation](#screen-2-problem-validation)
4. [Screen 3: Persona Discovery Canvas](#screen-3-persona-discovery-canvas)
5. [Screen 4: Persona Deep Dive](#screen-4-persona-deep-dive)
6. [Screen 5: Solution Generation](#screen-5-solution-generation)
7. [Screen 6: User Story Editor](#screen-6-user-story-editor)
8. [Screen 7: Technical Architecture](#screen-7-technical-architecture)
9. [Screen 8: Export & Repository Setup](#screen-8-export--repository-setup)
10. [Responsive Behaviors](#responsive-behaviors)

---

## Global Layout Structure

The application maintains a consistent layout across all screens:

| Component | Dimensions | Notes |
|-----------|------------|-------|
| **Left Sidebar** | 256px width (16rem), full height | Fixed position |
| **Top Progress Bar** | Full width minus sidebar, 80px height | Shows workflow progress |
| **Main Canvas Area** | calc(100vw - 256px) × calc(100vh - 80px) | Primary content area |
| **Background** | Full viewport | Dark theme with `bg-gray-900` (#111827) |

---

## Screen 1: Welcome / Problem Input

### Layout Components

#### 1.1 Left Sidebar (256px wide)

**Header Section** (64px height)
- Logo: "Prob" in 20px bold white text
- Bottom border: 1px solid gray-700

**Project Tree** (flex-1)
- "New Project" button: Full width, 40px height, hover state bg-gray-700
- Workspace folders with chevron icons (16px)
- Nested project items with file icons (14px)
- Active project highlighted with bg-gray-700

**Footer** (48px height)
- Version text: "Version 1.0.0" in 12px gray-400
- Top border: 1px solid gray-700

#### 1.2 Main Content Area

**Centered Container** (max-width: 672px / 42rem)
- Vertical centering with 20% top margin
- Horizontal centering with auto margins

**Content Elements**:

| Element | Specifications |
|---------|---------------|
| **Heading** | "What problem are you trying to solve?"<br/>Font size: 36px (2.25rem)<br/>Font weight: Bold<br/>Color: White<br/>Margin bottom: 32px |
| **Textarea** | Width: 100%<br/>Height: 160px (10rem)<br/>Background: bg-gray-800 (#1F2937)<br/>Border: 2px solid transparent, focus:border-blue-500<br/>Padding: 16px<br/>Font size: 16px<br/>Placeholder: "Describe your problem..." in gray-500<br/>Border radius: 8px |
| **Submit Button** | Width: Auto (min 120px)<br/>Height: 48px<br/>Background: bg-blue-600<br/>Text: "Analyze Problem" in white, 16px medium<br/>Margin top: 16px<br/>Float: Right<br/>Hover: bg-blue-700<br/>Border radius: 6px |
| **Keyboard Hint** | Position: Below textarea, left aligned<br/>Text: "Press Cmd+Enter to submit" in 14px gray-500<br/>Margin top: 8px |

---

## Screen 2: Problem Validation

### Transition Animation
- Textarea fades out (300ms)
- Content slides up and fades in (500ms)

### Layout Components

#### 2.1 Progress Bar Update
- First circle ("Problem Identification") fills with blue-600
- Connecting line animates from left to right

#### 2.2 Main Content Area

**Validation Result Card** (max-width: 800px)
- Background: bg-gray-800 with 1px border-gray-700
- Padding: 24px
- Border radius: 12px
- Shadow: Large

**Card Contents**:

| Section | Details |
|---------|---------|
| **Status Icon** | Green checkmark (24px) if valid<br/>Yellow warning (24px) if needs refinement<br/>Floated left with 16px right margin |
| **Original Input** | Label: "Your Input:" in 14px gray-400<br/>Text: User's original input in 16px gray-200<br/>Background: bg-gray-900<br/>Padding: 12px<br/>Border radius: 6px<br/>Margin bottom: 16px |
| **Refined Problem** | Label: "Validated Core Problem:" in 14px gray-400<br/>Text: AI-refined problem in 18px white, medium weight<br/>Background: bg-gray-900 with 2px border-green-800<br/>Padding: 16px<br/>Border radius: 6px |
| **Action Buttons** | "Continue" button: Primary style, right aligned<br/>"Edit Problem" button: Secondary style, left of Continue<br/>12px gap between buttons |

---

## Screen 3: Persona Discovery Canvas

### Canvas Transition
- Validation card scales down and moves to top-left as a node
- Canvas elements fade in sequentially

### Layout Components

#### 3.1 React Flow Canvas Structure
- **Viewport**: Full available space with 40px padding
- **Grid**: Dot pattern, 12px gap, 1px dots in gray-800

#### 3.2 Node Positions and Sizes

**Core Problem Node** (Left side):
| Property | Value |
|----------|-------|
| Position | x: 50, y: center |
| Size | 320px × 120px |
| Style | Red gradient (red-600 to red-700) |
| Content | Validated problem text in white |
| Handles | Source only (right side) |

**Persona Nodes** (Center):
| Property | Value |
|----------|-------|
| Position | Vertical stack with 140px gaps |
| X position | 450px from left |
| Size | 280px × 160px (collapsed) |
| Animation | Stagger in with 150ms delay each |

**Individual Persona Node Structure**:
```
┌─────────────────────────────┐
│ [Lock Icon]                 │ <- Top right, 20x20px
│ Name (18px bold)            │ <- 8px from top
│ ├─ 🏢 Industry (14px)       │ <- 16px spacing
│ ├─ 👤 Role (14px)           │ 
│ └─ 📊 Pain Level: 4/5       │ <- Progress bar style
└─────────────────────────────┘
```

#### 3.3 Control Panel (Top Left)
- **Refresh Button**:
  - Size: 120px × 40px
  - Icon: Refresh (16px) + "Regenerate" text
  - Background: bg-gray-800/90 with backdrop blur
  - Shows loading spinner when regenerating

#### 3.4 Canvas Controls (Bottom Right)
- **Zoom Controls**: Standard React Flow controls
- **Mini Map**: 200px × 150px, bottom right
- **Background**: Dark with 50% opacity

---

## Screen 4: Persona Deep Dive

### Transition Animation
- Non-selected personas fade to 30% opacity and scale to 80%
- Selected persona scales up and moves left
- Pain points slide in from right

### Layout Components

#### 4.1 Canvas Reorganization

**Selected Persona Node** (Expanded):
| Property | Value |
|----------|-------|
| Position | x: 100, y: center |
| Size | 350px × 240px |
| Added elements | Description text (14px, gray-200)<br/>Detailed demographics<br/>Behavioral traits<br/>Source handle on right |

**Pain Point Nodes**:
| Property | Value |
|----------|-------|
| Position | x: 550, y: distributed around center |
| Size | 300px × 120px |
| Style | Orange gradient (orange-500 to orange-600) |

**Pain Point Node Structure**:
```
┌─────────────────────────────┐
│ [Critical] │ [Lock Icon]    │ <- Severity badge + lock
│ "Pain point description..."  │ <- 16px, wrapped text
│ Impact: Operations          │ <- 14px gray-400
└─────────────────────────────┘
```

**Edge Connections**:
- Bezier curves from persona to pain points
- 2px thickness, gray-600 color
- Animated dash pattern on hover

---

## Screen 5: Solution Generation

### Layout Evolution
- Canvas zooms out slightly to accommodate more nodes
- New node layer appears on the right

### Component Positions

#### 5.1 Solution Nodes
| Property | Value |
|----------|-------|
| Position | x: 950, y: distributed in grid |
| Size | 320px × 140px |
| Style | Blue gradient (blue-500 to blue-600) |

**Solution Node Structure**:
```
┌─────────────────────────────┐
│ □ Solution Title            │ <- Checkbox + 18px bold
│ ├─ [Lock Icon]              │ <- Top right
│ Description text here...     │ <- 14px, 2 lines max
│ Type: Feature | Complex: Med │ <- Tags at bottom
└─────────────────────────────┘
```

#### 5.2 Solution-Pain Point Connections
- Multiple edges from each solution
- Different colors by strength:
  - Strong (>0.8): green-500
  - Medium (0.5-0.8): yellow-500
  - Weak (<0.5): gray-500
- Edge labels show relevance score

#### 5.3 Selection Interface
**Selection Counter** (Top center):
- Text: "2 of 5 solutions selected"
- Background: bg-blue-900/80
- Padding: 8px 16px
- Border radius: 20px

**Next Button** (Bottom center):
- Only appears when 1+ solutions selected
- Size: 160px × 48px
- Text: "Continue to User Stories →"

---

## Screen 6: User Story Editor

### Layout Transformation
- Canvas fades to 20% opacity (background context)
- Card-based interface overlays

### Component Layout

#### 6.1 User Story Cards Grid
| Property | Value |
|----------|-------|
| Grid | 2 columns, 3 rows |
| Gap | 24px |
| Card Size | ~400px × 300px |
| Container | Centered with 60px padding |

**Individual Card Structure**:
```
┌─────────────────────────────────┐
│ Story #1         [Edit Icon]     │ <- Header bar
├─────────────────────────────────┤
│ As a: Sales Manager             │ <- Input field
│ I want: unified activity view   │ <- Textarea
│ So that: I never miss followups │ <- Textarea
├─────────────────────────────────┤
│ Acceptance Criteria:            │
│ • Criterion 1                   │ <- Editable list
│ • Criterion 2                   │
│ + Add criterion                 │
├─────────────────────────────────┤
│ Priority: [High ▼] Points: [5]  │ <- Dropdowns
└─────────────────────────────────┘
```

---

## Screen 7: Technical Architecture

### Multi-Tab Interface

#### 7.1 Tab Navigation
- **Position**: Top of main area
- **Tabs**: System Architecture | Data Flow | Database Schema | UI Screens | Design System
- **Active Tab**: Blue underline, 3px thick

#### 7.2 System Architecture Tab
**Tech Stack Visualization**:
- Layered boxes (Frontend → Backend → Database)
- Each layer: Full width, 120px height
- Technology badges with logos
- Justification on hover

#### 7.3 Data Flow Tab
**Flow Diagram Canvas**:
- Similar to main canvas but simplified
- Rectangle nodes for systems
- Arrow connectors with data labels
- Swimlanes for different actors

#### 7.4 Database Schema Tab
**ERD Visualization**:
- Table nodes with columns listed
- Primary/Foreign key indicators
- Relationship lines (1:1, 1:N, N:N)
- Zoom/pan controls

---

## Screen 8: Export & Repository Setup

### Modal Overlay Layout

#### 8.1 Export Modal
| Property | Value |
|----------|-------|
| Size | 600px × 500px |
| Position | Centered with dark overlay |

**Export Options** (Radio selection):
```
┌─────────────────────────────────┐
│ ○ Markdown Documentation        │ <- 60px height each
│   Complete project specs        │
├─────────────────────────────────┤
│ ○ GitHub Repository            │
│   Initialize with structure     │
├─────────────────────────────────┤
│ ○ Share Link                   │
│   Read-only team access        │
└─────────────────────────────────┘
```

**Configuration** (Context-sensitive):
- For GitHub: Repository name, visibility
- For Markdown: Include diagrams checkbox
- For Share: Expiration settings

---

## Responsive Behaviors

### Minimum Viewport
- Width: 1280px
- Height: 720px

### Breakpoint Adjustments

| Breakpoint | Adjustment |
|------------|------------|
| < 1440px | Reduce node sizes by 10% |
| < 1680px | Hide minimap by default |
| < 1920px | Compress spacing between nodes |

### Canvas Interactions

| Interaction | Behavior |
|-------------|----------|
| **Pan** | Click and drag on empty space |
| **Zoom** | Scroll or pinch gesture (0.5x - 2x range) |
| **Select** | Click node to focus |
| **Multi-select** | Shift+click or drag selection box |
| **Context Menu** | Right-click on nodes for actions |

---

## Color Palette Reference

| Element | Color Code | Usage |
|---------|------------|-------|
| Background | #111827 (gray-900) | Main app background |
| Card Background | #1F2937 (gray-800) | Content cards |
| Border | #374151 (gray-700) | Dividers and borders |
| Primary | #2563EB (blue-600) | Primary actions |
| Success | #10B981 (green-500) | Valid states |
| Warning | #F59E0B (yellow-500) | Medium priority |
| Error | #EF4444 (red-500) | High priority |
| Text Primary | #FFFFFF (white) | Main text |
| Text Secondary | #9CA3AF (gray-400) | Supporting text |

---

## Animation Timings

| Animation | Duration | Easing |
|-----------|----------|--------|
| Fade | 300ms | ease-out |
| Slide | 500ms | ease-in-out |
| Scale | 400ms | ease-out |
| Node Stagger | 150ms delay | ease-out |
| Edge Draw | 600ms | ease-in-out |

This specification provides exact measurements and positions for implementing the Prob interface, ensuring a consistent and professional user experience throughout the entire workflow.
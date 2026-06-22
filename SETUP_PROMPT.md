# Kanban Board Setup - Prompt for Clawdbot

Copy the setup prompt and give it to your Clawdbot/OpenClaw agent.

---

## Setup Prompt

```text
Please install and configure this project management system specifically developed for OpenClaw, including a Kanban Board, File Explorer, and Context Manager from GitHub. We will use it together for our future software projects:

SETUP:
1. cd ~/.openclaw/workspace
2. git clone https://github.com/AlexPEClub/openclaw_react_board.git kanban
3. cd kanban && npm install
4. Check whether projects already exist and, if necessary, run ./update-projects.js
5. Start the server:
   OPENCLAW_WORKSPACE=$(cd .. && pwd) npm start

   (This automatically sets the Context Files path to your workspace directory)

CONFIGURATION:
1. Read the README.md in the kanban folder for the complete documentation.
2. Read SETUP_PROMPT.md and add the MEMORY.md snippet contained there to your MEMORY.md.
3. Optional: Add the HEARTBEAT.md snippet from SETUP_PROMPT.md to your HEARTBEAT.md.

EXPLANATION:
- Show me how to create a new project (with the correct projectPath).
- Explain how Feature Specs are linked.
- Show me the most important API commands.

Confirm each step and show me the Board URL at the end.
```

---

## After Installation

Your agent should confirm the following:

* Server is running at http://localhost:3000
* MEMORY.md has been updated
* Existing projects have a projectPath set
* Context Files are loaded from the workspace

---

## MEMORY.md Snippet

The agent should insert the following block into its MEMORY.md (curated long-term information):

```text
## Kanban Board

**Start**:
cd ~/.openclaw/workspace/kanban && OPENCLAW_WORKSPACE=$(cd .. && pwd) npm start

**URL**:
http://localhost:3000

### Important Paths:
- Board Data: ~/.openclaw/workspace/kanban/tasks.json
- Feature Files: {project}/features/PROJ-{number}-{feature}.md

### When Creating a Project ALWAYS:
- Set projectPath as an absolute path!

### Creating Feature Files:
- Feature files belong in the project's features/ folder (NOT specs/)
- Create the file in features/ first, then link it using featureFile in the task
- Naming convention: PROJ-{number}-{feature-name}.md

### Workflow:
1. New Project → Create project folder (including features/), then add it to the board with the correct projectPath
2. Feature Files → Store them in features/ and link them through featureFile in the task
3. Status Updates → API:
   PUT /api/tasks/{id}
   {"status":"in-progress"}
4. Context Files → Loaded from OPENCLAW_WORKSPACE

### Quick Commands:
curl http://localhost:3000/api/projects

curl -X PUT http://localhost:3000/api/tasks/TASK-ID \
-H "Content-Type: application/json" \
-d '{"status":"done"}'

### Troubleshooting:
- File Browser empty? → Check projectPath (must be absolute)
- Context Files missing? → Verify OPENCLAW_WORKSPACE path
- Server down? → Restart it (see Start command above)
```

---

## HEARTBEAT.md Snippet (Optional)

```text
## Kanban Board Check

- [ ] Is the Kanban server running? If not, start it (see MEMORY.md)
- [ ] Any In-Progress tasks? → Update status in agent-status.json
- [ ] New Feature Specs? → Add them as tasks
```

---

## Troubleshooting Prompts

### File Browser Shows Nothing

```text
The File Browser in the Kanban Board is not showing any files.

Please check the projectPath in tasks.json – it must be an absolute path.

Use update-projects.js if necessary to correct the paths.
```

### Context Files Are Missing

```text
The Context Storage page is not showing any files.

Please check the OPENCLAW_WORKSPACE path. It should point to your workspace directory.

If necessary, restart the server with:

OPENCLAW_WORKSPACE=/your/workspace/path npm start
```

### Server Does Not Start

```text
The Kanban Board is not starting. Please check:

1. Is port 3000 available? (lsof -i :3000)
2. Are all dependencies installed? (npm install)
3. Are there any errors in the console?
```

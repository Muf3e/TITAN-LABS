import json
import logging
from pathlib import Path
from typing import Dict, List, Optional

from titan_orchestrator.config import AGENTS_DIR, STATE_DIR
from titan_orchestrator.models import AgentMetadata, AgentState

logger = logging.getLogger("titan.fleet")

DEFAULT_AGENTS = [
    {
        "name": "titan_control_tower",
        "display_title": "🏰 Control Tower & Alignment Manager",
        "role": "Master Orchestrator & Project Director",
        "prompt_file": "control-tower.agent.md",
    },
    {
        "name": "titan_app_developer",
        "display_title": "📱 Android App Developer",
        "role": "Native Compose & Kotlin Architecture Engineer",
        "prompt_file": "app-developer.agent.md",
    },
    {
        "name": "titan_android_studio_bridge",
        "display_title": "🌉 Android Studio Bridge",
        "role": "ADB Bridge, Deployer & Runtime Controller",
        "prompt_file": "android-studio-bridge.agent.md",
    },
    {
        "name": "titan_web_developer",
        "display_title": "🌐 Web Platform Developer",
        "role": "React / Next.js / TypeScript Web Architect",
        "prompt_file": "web-developer.agent.md",
    },
    {
        "name": "titan_data_scraper",
        "display_title": "🕷️ Data Scraper & Harvester",
        "role": "Hardware Spec & Price Tracking Ingestion Specialist",
        "prompt_file": "data-scraper.agent.md",
    },
    {
        "name": "titan_testing_agent",
        "display_title": "🧪 Testing & QA Specialist",
        "role": "Automated Unit, E2E & Accessibility Verifier",
        "prompt_file": "testing-agent.agent.md",
    },
    {
        "name": "titan_architecture_evolution_agent",
        "display_title": "🏗️ Architecture Evolution Specialist",
        "role": "Infrastructure Modernization & Technical Debt Guardian",
        "prompt_file": "architecture-evolution-agent.agent.md",
    },
    {
        "name": "titan_evaluator_auditor_agent",
        "display_title": "🧐 Evaluator & Compliance Auditor",
        "role": "Specification Compliance & Scoring Engine Auditor",
        "prompt_file": "evaluator-auditor-agent.agent.md",
    },
    {
        "name": "titan_prompt_optimizer_agent",
        "display_title": "⚡ Prompt & Capability Optimizer",
        "role": "Meta-Learning & Instruction Self-Improvement Engine",
        "prompt_file": "prompt-optimizer-agent.agent.md",
    },
]


class AgentFleetManager:
    def __init__(self):
        self.agents: Dict[str, AgentMetadata] = {}
        self.state_file = STATE_DIR / "fleet_state.json"
        self._initialize_fleet()

    def _initialize_fleet(self):
        saved_state = {}
        if self.state_file.exists():
            try:
                with open(self.state_file, "r", encoding="utf-8") as f:
                    saved_state = json.load(f)
            except Exception as e:
                logger.warning(f"Failed to read fleet state file: {e}")

        for item in DEFAULT_AGENTS:
            name = item["name"]
            meta = AgentMetadata(
                name=name,
                display_title=item["display_title"],
                role=item["role"],
                prompt_file=item["prompt_file"],
            )
            if name in saved_state:
                saved = saved_state[name]
                meta.prompt_version = saved.get("prompt_version", 1)
                meta.total_tasks_completed = saved.get("total_tasks_completed", 0)
            self.agents[name] = meta

    def get_agent(self, name: str) -> Optional[AgentMetadata]:
        return self.agents.get(name)

    def get_all_agents(self) -> List[AgentMetadata]:
        return list(self.agents.values())

    def update_agent_state(
        self, name: str, state: AgentState, current_task: Optional[str] = None
    ):
        if name in self.agents:
            agent = self.agents[name]
            agent.state = state
            agent.current_task = current_task
            if current_task:
                agent.recent_logs.append(f"[{state.value}] {current_task}")
                if len(agent.recent_logs) > 20:
                    agent.recent_logs.pop(0)
            self.save_state()

    def mark_task_done(self, name: str, success: bool = True):
        if name in self.agents:
            agent = self.agents[name]
            agent.state = AgentState.IDLE
            agent.current_task = None
            if success:
                agent.total_tasks_completed += 1
            self.save_state()

    def get_prompt_content(self, name: str) -> str:
        agent = self.agents.get(name)
        if not agent:
            return ""
        prompt_path = AGENTS_DIR / agent.prompt_file
        if prompt_path.exists():
            return prompt_path.read_text(encoding="utf-8")
        return ""

    def update_prompt_content(self, name: str, new_content: str) -> bool:
        agent = self.agents.get(name)
        if not agent:
            return False
        prompt_path = AGENTS_DIR / agent.prompt_file
        try:
            prompt_path.write_text(new_content, encoding="utf-8")
            agent.prompt_version += 1
            agent.recent_logs.append(
                f"Prompt updated to version {agent.prompt_version}"
            )
            self.save_state()
            return True
        except Exception as e:
            logger.error(f"Failed to update prompt for {name}: {e}")
            return False

    def save_state(self):
        try:
            data = {name: meta.to_dict() for name, meta in self.agents.items()}
            with open(self.state_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save fleet state: {e}")

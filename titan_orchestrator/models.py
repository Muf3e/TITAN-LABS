import dataclasses
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional


class AgentState(str, Enum):
    IDLE = "IDLE"
    ANALYZING = "ANALYZING"
    EXECUTING = "EXECUTING"
    HEALING = "HEALING"
    VERIFYING = "VERIFYING"
    ERROR = "ERROR"


@dataclass
class AgentMetadata:
    name: str
    display_title: str
    role: str
    prompt_file: str
    state: AgentState = AgentState.IDLE
    current_task: Optional[str] = None
    last_active: str = field(default_factory=lambda: datetime.now().isoformat())
    prompt_version: int = 1
    total_tasks_completed: int = 0
    recent_logs: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return dataclasses.asdict(self)


@dataclass
class TestVerdict:
    name: str
    category: str
    status: str  # PASS, FAIL, SKIPPED
    duration_ms: int = 0
    message: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return dataclasses.asdict(self)


@dataclass
class ScreenVerdict:
    screen_id: str
    screen_title: str
    screenshot_path: str
    status: str  # VERIFIED, MISMATCH, NOT_ACCESSIBLE
    fidelity_score: int  # 0 to 100
    notes: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return dataclasses.asdict(self)


@dataclass
class CycleReport:
    cycle_id: str
    timestamp: str
    duration_seconds: float
    build_success: bool
    test_results: List[TestVerdict] = field(default_factory=list)
    screen_results: List[ScreenVerdict] = field(default_factory=list)
    architecture_score: int = 95
    spec_compliance_score: int = 98
    findings: List[str] = field(default_factory=list)
    prompt_updates_proposed: List[Dict[str, str]] = field(default_factory=list)
    antigravity_actions_needed: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return dataclasses.asdict(self)

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const btnRunCycle = document.getElementById('btn-run-cycle');
  const emulatorBadge = document.getElementById('emulator-badge');
  const emulatorText = document.getElementById('emulator-text');
  const agentsContainer = document.getElementById('agents-container');
  const agentCountMetric = document.getElementById('metric-agent-count');
  const logOutput = document.getElementById('log-output');
  const reportsList = document.getElementById('reports-list');
  const reportDetail = document.getElementById('report-detail');

  // Modal Elements
  const promptModal = document.getElementById('prompt-modal');
  const modalAgentTitle = document.getElementById('modal-agent-title');
  const modalPromptText = document.getElementById('modal-prompt-text');
  const modalClose = document.getElementById('modal-close');
  const modalCancel = document.getElementById('modal-cancel');
  const modalSave = document.getElementById('modal-save');
  let currentEditingAgent = null;

  // --- TAB NAVIGATION ---
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(tabId);
      if (activeContent) activeContent.classList.add('active');
    });
  });

  // --- API CALLS ---
  async function fetchFleet() {
    try {
      const res = await fetch('/api/fleet');
      const data = await res.json();
      renderAgents(data.agents || []);
      if (agentCountMetric) agentCountMetric.textContent = data.count || 9;
    } catch (err) {
      console.error('Error fetching fleet:', err);
    }
  }

  function renderAgents(agents) {
    if (!agentsContainer) return;
    agentsContainer.innerHTML = '';

    agents.forEach(agent => {
      const isWorking = agent.state !== 'IDLE';
      const statusClass = isWorking ? 'status-working' : 'status-idle';
      const statusLabel = agent.state;

      const card = document.createElement('div');
      card.className = 'agent-card';
      card.innerHTML = `
        <div>
          <div class="agent-card-header">
            <div>
              <div class="agent-name">${agent.display_title}</div>
              <div class="agent-role">${agent.role}</div>
            </div>
            <span class="agent-status-badge ${statusClass}">${statusLabel}</span>
          </div>
          <div class="agent-details">
            ${agent.current_task ? `<strong>Current Task:</strong> ${agent.current_task}` : 'Waiting for incoming directives from Control Tower.'}
          </div>
        </div>
        <div class="agent-actions">
          <span class="agent-meta-info">Prompt v${agent.prompt_version} • Done: ${agent.total_tasks_completed}</span>
          <button class="btn-secondary btn-edit-prompt" data-agent="${agent.name}">Edit Prompt</button>
        </div>
      `;
      agentsContainer.appendChild(card);
    });

    document.querySelectorAll('.btn-edit-prompt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const agentName = e.target.getAttribute('data-agent');
        openPromptEditor(agentName);
      });
    });
  }

  async function checkEmulatorStatus() {
    try {
      const res = await fetch('/api/emulator/status');
      const data = await res.json();
      if (data.online) {
        emulatorText.textContent = `Online (${data.message})`;
        emulatorBadge.style.borderColor = 'rgba(0, 230, 118, 0.4)';
      } else {
        emulatorText.textContent = 'Emulator Offline';
        emulatorBadge.style.borderColor = 'rgba(255, 94, 58, 0.4)';
      }
    } catch (err) {
      emulatorText.textContent = 'Emulator Offline';
    }
  }

  async function fetchLogs() {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      if (logOutput && data.logs) {
        logOutput.textContent = data.logs.join('\n');
        logOutput.scrollTop = logOutput.scrollHeight;
      }
    } catch (err) {}
  }

  async function fetchReports() {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      renderReportsList(data.reports || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  }

  function renderReportsList(reports) {
    if (!reportsList) return;
    if (reports.length === 0) {
      reportsList.innerHTML = '<div class="empty-state">No cycle reports recorded yet.</div>';
      return;
    }

    reportsList.innerHTML = '';
    reports.forEach((rep, idx) => {
      const item = document.createElement('div');
      item.className = `report-item ${idx === 0 ? 'active' : ''}`;
      item.innerHTML = `
        <div class="report-item-title">Cycle ${rep.id}</div>
        <div class="report-item-sub">${rep.timestamp} • ${rep.build_success ? '✅ PASSED' : '❌ FAILED'}</div>
      `;
      item.addEventListener('click', () => {
        document.querySelectorAll('.report-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        loadReportDetail(rep.id);
      });
      reportsList.appendChild(item);
    });

    if (reports.length > 0) {
      loadReportDetail(reports[0].id);
    }
  }

  async function loadReportDetail(reportId) {
    if (!reportDetail) return;
    try {
      const res = await fetch(`/api/report/${reportId}`);
      const rep = await res.json();
      reportDetail.innerHTML = `
        <div style="font-family: var(--font-family); margin-bottom: 16px;">
          <h3 style="font-size: 18px; margin-bottom: 6px;">Cycle ${rep.cycle_id} Audit Report</h3>
          <div style="color: var(--text-muted); font-size: 13px;">${rep.timestamp} • Duration: ${rep.duration_seconds.toFixed(1)}s</div>
        </div>
        <pre>${JSON.stringify(rep, null, 2)}</pre>
      `;
    } catch (err) {
      reportDetail.innerHTML = '<div class="empty-state">Failed to load report.</div>';
    }
  }

  // --- TRIGGER AUTOPILOT CYCLE ---
  if (btnRunCycle) {
    btnRunCycle.addEventListener('click', async () => {
      btnRunCycle.disabled = true;
      btnRunCycle.textContent = '⏳ Executing Cycle...';
      try {
        const res = await fetch('/api/cycle/start', { method: 'POST' });
        const data = await res.json();
        alert(data.message || 'Cycle launched.');
      } catch (err) {
        alert('Failed to start cycle: ' + err);
      } finally {
        setTimeout(() => {
          btnRunCycle.disabled = false;
          btnRunCycle.innerHTML = '<span class="icon">⚡</span> Run Autopilot Cycle';
        }, 5000);
      }
    });
  }

  // --- PROMPT MODAL EDITOR ---
  async function openPromptEditor(agentName) {
    currentEditingAgent = agentName;
    modalAgentTitle.textContent = `Edit System Prompt: ${agentName}`;
    modalPromptText.value = 'Loading prompt...';
    promptModal.classList.add('active');

    try {
      const res = await fetch(`/api/prompt?name=${agentName}`);
      const data = await res.json();
      modalPromptText.value = data.content || '';
    } catch (err) {
      modalPromptText.value = 'Error loading prompt.';
    }
  }

  function closePromptEditor() {
    promptModal.classList.remove('active');
    currentEditingAgent = null;
  }

  if (modalClose) modalClose.addEventListener('click', closePromptEditor);
  if (modalCancel) modalCancel.addEventListener('click', closePromptEditor);

  if (modalSave) {
    modalSave.addEventListener('click', async () => {
      if (!currentEditingAgent) return;
      const newContent = modalPromptText.value;
      modalSave.disabled = true;
      modalSave.textContent = 'Saving...';

      try {
        const res = await fetch('/api/prompt/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: currentEditingAgent, content: newContent }),
        });
        const data = await res.json();
        alert(data.message || 'Prompt updated.');
        closePromptEditor();
        fetchFleet();
      } catch (err) {
        alert('Failed to save prompt: ' + err);
      } finally {
        modalSave.disabled = false;
        modalSave.textContent = 'Save & Tune Prompt';
      }
    });
  }

  // Initialize and Polling Loops
  fetchFleet();
  checkEmulatorStatus();
  fetchReports();
  fetchLogs();

  setInterval(fetchFleet, 5000);
  setInterval(checkEmulatorStatus, 10000);
  setInterval(fetchLogs, 3000);
  setInterval(fetchReports, 15000);
});

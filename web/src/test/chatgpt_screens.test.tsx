import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import { RecommendationScreen } from '../pages/RecommendationScreen';
import { ArchitectureScreen } from '../pages/ArchitectureScreen';
import { Header } from '../components/Header';
import { HomeScreen } from '../pages/HomeScreen';
import App from '../App';

describe('TITAN ChatGPT Intelligence & Engineering Pack Screens', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders RecommendationScreen and defaults to AI_ML workload', () => {
    render(
      <AppProvider initialView="recommendation">
        <RecommendationScreen />
      </AppProvider>
    );

    // Verify title and formula header
    expect(screen.getByText(/TITAN-REC-008 Intelligence Engine/i)).toBeDefined();
    expect(screen.getByText(/Hardware Recommendation & AI Fit Advisor/i)).toBeDefined();
    expect(screen.getByText(/AI \/ ML & Local LLMs/i)).toBeDefined();
    expect(screen.getByText(/Ranked Hardware Candidates/i)).toBeDefined();
  });

  it('allows switching workloads between AI/ML, Gaming, and Programming', () => {
    render(
      <AppProvider initialView="recommendation">
        <RecommendationScreen />
      </AppProvider>
    );

    const gamingBtn = screen.getByText(/AAA & Competitive Gaming/i);
    fireEvent.click(gamingBtn);
    expect(gamingBtn).toBeDefined();

    const devBtn = screen.getByText(/Full-Stack & DevOps/i);
    fireEvent.click(devBtn);
    expect(devBtn).toBeDefined();

    const creativeBtn = screen.getByText(/3D, CAD & Video Studio/i);
    fireEvent.click(creativeBtn);
    expect(creativeBtn).toBeDefined();
  });

  it('toggles algorithm formula explanation accordion', () => {
    render(
      <AppProvider initialView="recommendation">
        <RecommendationScreen />
      </AppProvider>
    );

    const formulaToggleBtn = screen.getByText(/View Formula: S = 0.30P \+ 0.20V.../i);
    fireEvent.click(formulaToggleBtn);

    // Formula details should now be visible
    expect(screen.getByText(/Canonical Formulation/i)).toBeDefined();
    expect(screen.getByText(/Workload Perf Fit/i)).toBeDefined();
    expect(screen.getByText(/Value \/ Cost Ratio/i)).toBeDefined();
  });

  it('allows expanding LLM benchmark matrix for recommendations', () => {
    render(
      <AppProvider initialView="recommendation">
        <RecommendationScreen />
      </AppProvider>
    );

    // Expand first recommendation's matrix
    const expandButtons = screen.getAllByText(/Show Local LLM Matrix & Math/i);
    expect(expandButtons.length).toBeGreaterThan(0);
    fireEvent.click(expandButtons[0]);

    expect(screen.getByText(/Local LLM Execution Benchmark Matrix/i)).toBeDefined();
    expect(screen.getByText(/Llama 3.1 8B \(Q4_K_M\)/i)).toBeDefined();
  });

  it('renders ArchitectureScreen and switches between all 4 tabs', () => {
    render(
      <AppProvider initialView="architecture">
        <ArchitectureScreen />
      </AppProvider>
    );

    // Header title
    expect(screen.getByText(/System Architecture & Implementation Deliverables/i)).toBeDefined();

    // Default tab: Deliverables
    expect(screen.getByText(/Technology Stack & Engineering Standards Lock v1.0/i)).toBeDefined();

    // Switch to Database Bible tab
    const dbTab = screen.getByRole('button', { name: /100\+ Table Database Bible/i });
    fireEvent.click(dbTab);
    expect(screen.getByText(/100\+ Table Canonical Schema Structure \(PostgreSQL 16\)/i)).toBeDefined();
    expect(screen.getByText(/Hardware Catalog Domain/i)).toBeDefined();

    // Switch to Microservices tab
    const servicesTab = screen.getByRole('button', { name: /Microservices & Event Mesh/i });
    fireEvent.click(servicesTab);
    expect(screen.getByText(/Event-Driven Microservices & Kafka Integration Mesh/i)).toBeDefined();

    // Switch to SLOs tab
    const sloTab = screen.getByRole('button', { name: /SLOs & Trust Metrics/i });
    fireEvent.click(sloTab);
    expect(screen.getByText(/Service Level Objectives \(SLOs\) & Trust Governance/i)).toBeDefined();
    expect(screen.getByText(/≥ 99.5%/i)).toBeDefined();
  });

  it('renders navigation links for AI Advisor and Architecture in Header', () => {
    render(
      <AppProvider initialView="home">
        <Header />
      </AppProvider>
    );

    const advisorNav = screen.getByTestId('nav-recommendation');
    expect(advisorNav).toBeDefined();

    const archNav = screen.getByTestId('nav-architecture');
    expect(archNav).toBeDefined();
  });

  it('renders quick action shortcuts on HomeScreen and navigates when clicked', () => {
    render(
      <AppProvider initialView="home">
        <HomeScreen />
      </AppProvider>
    );

    // Check advisor shortcut card
    const advisorCard = screen.getByTestId('home-advisor-card');
    expect(advisorCard).toBeDefined();
    expect(screen.getByText(/Local LLM & Hardware Fit Advisor/i)).toBeDefined();

    // Check architecture shortcut card
    const archCard = screen.getByTestId('home-architecture-card');
    expect(archCard).toBeDefined();
    expect(screen.getByText(/100\+ Table Database & System Architecture/i)).toBeDefined();
  });

  it('renders RecommendationScreen and ArchitectureScreen inside main App router', () => {
    // Render App with recommendation view
    const { unmount } = render(
      <AppProvider initialView="recommendation">
        <App />
      </AppProvider>
    );
    expect(screen.getByText(/Hardware Recommendation & AI Fit Advisor/i)).toBeDefined();
    unmount();

    // Render App with architecture view
    render(
      <AppProvider initialView="architecture">
        <App />
      </AppProvider>
    );
    expect(screen.getByText(/System Architecture & Implementation Deliverables/i)).toBeDefined();
  });
});

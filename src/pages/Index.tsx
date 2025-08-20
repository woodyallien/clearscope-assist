import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { TestingWorkspace } from '@/components/testing/TestingWorkspace';
import type { WCAGVersion, WCAGLevel, ScopeType, ReportStatus } from '@/types';

type AppView = 'dashboard' | 'testing';

interface AppState {
  currentView: AppView;
  selectedReportId?: string;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>({
    currentView: 'dashboard'
  });

  const handleReportSelect = (reportId: string) => {
    setAppState({
      currentView: 'testing',
      selectedReportId: reportId
    });
  };

  const handleBackToDashboard = () => {
    setAppState({
      currentView: 'dashboard',
      selectedReportId: undefined
    });
  };

  // Mock report data for testing workspace
  const mockReport = {
    id: appState.selectedReportId || '1',
    title: 'E-commerce Platform Audit',
    client: 'TechCorp Inc.',
    project: 'Main Shopping Site',
    standards: ['2.2'] as WCAGVersion[],
    level: 'AA' as WCAGLevel,
    scopeType: 'web' as ScopeType,
    domain: 'shop.techcorp.com',
    status: 'In Review' as ReportStatus
  };

  return (
    <div className="min-h-screen bg-background">
      {appState.currentView === 'dashboard' ? (
        <>
          <Header />
          <main>
            <Dashboard onReportSelect={handleReportSelect} />
          </main>
        </>
      ) : (
        <main>
          <TestingWorkspace 
            report={mockReport}
            onBack={handleBackToDashboard}
          />
        </main>
      )}
    </div>
  );
};

export default Index;

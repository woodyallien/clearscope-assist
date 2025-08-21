import { useState, useEffect } from 'react';
import { Plus, Filter, Download, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReportCard } from './ReportCard';
import { CreateReportWizard } from '../reports/CreateReportWizard';
import type { Report } from '@/types';

interface DashboardProps {
  onReportSelect: (reportId: string) => void;
}

export const Dashboard = ({ onReportSelect, onReportComplete }: DashboardProps & { onReportComplete: (id: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // TODO: Replace with API call to fetch reports
    async function fetchReports() {
      try {
        const response = await fetch('http://localhost:3001/reports');
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error(error);
        setReports([]);
      }
    }
    fetchReports();
  }, []);

  // Add default values for progressPercent and issue counts to avoid type errors
  const enhancedReports = reports.map(report => ({
    ...report,
    progressPercent: (report as any).progressPercent ?? 0,
    criticalIssues: (report as any).criticalIssues ?? 0,
    majorIssues: (report as any).majorIssues ?? 0,
    minorIssues: (report as any).minorIssues ?? 0,
  }));

  const filteredReports = enhancedReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (showCreateWizard) {
    return (
      <CreateReportWizard
        onComplete={(newReportId) => {
          setShowCreateWizard(false);
          // Notify parent component of new report creation
          onReportComplete(newReportId);
        }}
        onCancel={() => setShowCreateWizard(false)}
      />
    );
  }

  return (
    <div className="p-6 space-y-6" role="main" aria-label="Accessibility Reports Dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" tabIndex={0}>
            Accessibility Reports
          </h1>
          <p className="text-muted-foreground mt-1" tabIndex={0}>
            Manage and track your WCAG compliance audits
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            aria-label="View analytics dashboard"
          >
            <BarChart3 className="h-4 w-4 mr-2" aria-hidden="true" />
            Analytics
          </Button>
          <Button
            onClick={() => setShowCreateWizard(true)}
            size="sm"
            className="gap-2"
            aria-label="Create new accessibility report"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Report
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search reports by title or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            aria-label="Search reports"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="In Review">In Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Released">Released</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
            More Filters
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Export
          </Button>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all' ? 
              'No reports match your search criteria.' : 
              'No reports found. Create your first accessibility audit report to get started.'
            }
          </div>
          {!searchTerm && statusFilter === 'all' && (
            <Button onClick={() => setShowCreateWizard(true)}>
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Create Your First Report
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onSelect={onReportSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

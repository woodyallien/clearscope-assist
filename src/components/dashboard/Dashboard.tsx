import { useState } from 'react';
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

// Mock data for demonstration
const mockReports = [
  {
    id: '1',
    title: 'E-commerce Platform Audit',
    client: 'TechCorp Inc.',
    project: 'Main Shopping Site',
    standards: ['2.2'],
    level: 'AA',
    scopeType: 'web',
    domain: 'shop.techcorp.com',
    status: 'In Review',
    version: 1,
    tags: ['ecommerce', 'responsive'],
    progressPercent: 75,
    criticalIssues: 3,
    majorIssues: 8,
    minorIssues: 12,
  },
  {
    id: '2',
    title: 'Banking App Mobile Audit',
    client: 'SecureBank',
    project: 'Mobile Banking',
    standards: ['2.2'],
    level: 'AA',
    scopeType: 'mobile',
    domain: 'mobile.securebank.com',
    status: 'Draft',
    version: 1,
    tags: ['mobile', 'financial'],
    progressPercent: 30,
    criticalIssues: 1,
    majorIssues: 5,
    minorIssues: 7,
  },
  {
    id: '3',
    title: 'Government Portal Assessment',
    client: 'City of Springfield',
    project: 'Public Services Portal',
    standards: ['2.1'],
    level: 'AA',
    scopeType: 'web',
    domain: 'services.springfield.gov',
    status: 'Approved',
    version: 2,
    tags: ['government', 'public'],
    progressPercent: 100,
    criticalIssues: 0,
    majorIssues: 2,
    minorIssues: 8,
  },
] as Array<Partial<Report> & {
  progressPercent: number;
  criticalIssues: number;
  majorIssues: number;
  minorIssues: number;
}>;

interface DashboardProps {
  onReportSelect: (reportId: string) => void;
}

export const Dashboard = ({ onReportSelect }: DashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.client?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (showCreateWizard) {
    return (
      <CreateReportWizard
        onComplete={(reportId) => {
          setShowCreateWizard(false);
          onReportSelect(reportId);
        }}
        onCancel={() => setShowCreateWizard(false)}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Accessibility Reports
          </h1>
          <p className="text-muted-foreground mt-1">
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
import { Calendar, User, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Report } from '@/types';

interface ReportCardProps {
  report: Partial<Report> & {
    progressPercent: number;
    criticalIssues: number;
    majorIssues: number;
    minorIssues: number;
  };
  onSelect: (reportId: string) => void;
}

export const ReportCard = ({ report, onSelect }: ReportCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-muted text-muted-foreground';
      case 'In Review':
        return 'bg-warning/10 text-warning-foreground border-warning/20';
      case 'Approved':
        return 'bg-success/10 text-success-foreground border-success/20';
      case 'Released':
        return 'bg-primary/10 text-primary-foreground border-primary/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-ring">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg leading-tight">
            {report.title}
          </CardTitle>
          <Badge className={getStatusColor(report.status || 'Draft')}>
            {report.status || 'Draft'}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" aria-hidden="true" />
            <span>{report.client}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            <span>Updated {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{report.progressPercent}% complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${report.progressPercent}%` }}
              role="progressbar"
              aria-valuenow={report.progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Report progress: ${report.progressPercent}% complete`}
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-destructive">
              <XCircle className="h-3 w-3" aria-hidden="true" />
              <span>{report.criticalIssues} Critical</span>
            </div>
            <div className="flex items-center gap-1 text-warning">
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              <span>{report.majorIssues} Major</span>
            </div>
            <div className="flex items-center gap-1 text-success">
              <CheckCircle className="h-3 w-3" aria-hidden="true" />
              <span>{report.minorIssues} Minor</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 text-xs">
          <Badge variant="outline">WCAG {report.standards?.[0] || '2.2'}</Badge>
          <Badge variant="outline">Level {report.level || 'AA'}</Badge>
          <Badge variant="outline">{report.scopeType || 'Web'}</Badge>
        </div>

        <Button 
          onClick={() => onSelect(report.id || '')}
          className="w-full"
          size="sm"
        >
          Open Report
        </Button>
      </CardContent>
    </Card>
  );
};
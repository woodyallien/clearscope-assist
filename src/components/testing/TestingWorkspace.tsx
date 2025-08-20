import { useState } from 'react';
import { ChevronLeft, ExternalLink, Settings, Info, Eye, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WCAGChecklist } from './WCAGChecklist';
import { ContentViewer } from './ContentViewer';
import type { Report, Page, WCAGVersion, WCAGLevel } from '@/types';

interface TestingWorkspaceProps {
  report: Partial<Report>;
  onBack: () => void;
}

// Mock pages data
const mockPages = [
  { id: '1', url: 'https://shop.techcorp.com', path: '/', status: 'In Testing' as const, coverageLabel: 'Key' as const },
  { id: '2', url: 'https://shop.techcorp.com/products', path: '/products', status: 'Planned' as const, coverageLabel: 'Template' as const },
  { id: '3', url: 'https://shop.techcorp.com/checkout', path: '/checkout', status: 'Completed' as const, coverageLabel: 'Key' as const },
];

export const TestingWorkspace = ({ report, onBack }: TestingWorkspaceProps) => {
  const [currentPage, setCurrentPage] = useState(mockPages[0]);
  const [wcagVersion, setWcagVersion] = useState<WCAGVersion>(report.standards?.[0] as WCAGVersion || '2.2');
  const [wcagLevel, setWcagLevel] = useState<WCAGLevel>(report.level || 'AA');
  const [showCrosswalk, setShowCrosswalk] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              aria-label="Back to dashboard"
            >
              <ChevronLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Back
            </Button>
            
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {report.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {report.client} • WCAG {wcagVersion} Level {wcagLevel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                    Preview
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Preview report in new window</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
              Settings
            </Button>
          </div>
        </div>

        {/* Current Report and Page Selectors */}
        <div className="flex items-center gap-4 mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Current Report:</span>
            <Badge variant="outline">{report.title}</Badge>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              Change
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Current Page:</span>
            <Select 
              value={currentPage.id} 
              onValueChange={(value) => {
                const page = mockPages.find(p => p.id === value);
                if (page) setCurrentPage(page);
              }}
            >
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockPages.map((page) => (
                  <SelectItem key={page.id} value={page.id}>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={page.status === 'Completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {page.status}
                      </Badge>
                      <span className="truncate">{page.url}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Standards Toggle */}
        <div className="flex items-center justify-between mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="wcag-version" className="text-sm font-medium">
                WCAG Version:
              </label>
              <Select value={wcagVersion} onValueChange={(value) => setWcagVersion(value as WCAGVersion)}>
                <SelectTrigger id="wcag-version" className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2.1">2.1</SelectItem>
                  <SelectItem value="2.2">2.2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label htmlFor="wcag-level" className="text-sm font-medium">
                Level:
              </label>
              <Select value={wcagLevel} onValueChange={(value) => setWcagLevel(value as WCAGLevel)}>
                <SelectTrigger id="wcag-level" className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="AA">AA</SelectItem>
                  <SelectItem value="AAA">AAA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant={showCrosswalk ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setShowCrosswalk(!showCrosswalk)}
            >
              <Info className="h-4 w-4 mr-2" aria-hidden="true" />
              {showCrosswalk ? 'Hide' : 'Show'} Crosswalk
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    Shows mapping to Section 508 and ADA Title II for reference.
                    Pass/fail counts are based on WCAG selection.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex">
        {/* Left Panel - WCAG Checklist */}
        <div className="w-96 border-r bg-card flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-foreground">
              WCAG {wcagVersion} Level {wcagLevel} Checklist
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Check each criterion against the current page
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <WCAGChecklist
              wcagVersion={wcagVersion}
              wcagLevel={wcagLevel}
              showCrosswalk={showCrosswalk}
              pageId={currentPage.id}
              reportId={report.id || ''}
            />
          </div>
        </div>

        {/* Right Panel - Content Viewer */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Content Viewer</h3>
                <Badge variant="outline" className="text-xs">
                  {currentPage.coverageLabel}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Keyboard className="h-4 w-4 mr-2" aria-hidden="true" />
                  Keyboard Mode
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                  Open in Tab
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <ContentViewer
              url={currentPage.url}
              scopeType={report.scopeType || 'web'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
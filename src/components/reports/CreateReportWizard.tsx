import { useState } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { WCAGLevel, WCAGVersion, ScopeType } from '@/types';
import { crawlHomepage } from '@/lib/crawler';

interface CreateReportWizardProps {
  onComplete: (reportId: string) => void;
  onCancel: () => void;
}

interface ReportFormData {
  title: string;
  client: string;
  project: string;
  domain: string;
  wcagVersion: WCAGVersion;
  wcagLevel: WCAGLevel;
  scopeType: ScopeType;
  showCrosswalk: boolean;
  description: string;
}

const STEPS = [
  { id: 1, name: 'Basic Information', description: 'Report details and scope' },
  { id: 2, name: 'Standards & Level', description: 'WCAG version and conformance level' },
  { id: 3, name: 'Review & Create', description: 'Confirm settings and create report' },
];

export const CreateReportWizard = ({ onComplete, onCancel }: CreateReportWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    client: '',
    project: '',
    domain: '',
    wcagVersion: '2.2',
    wcagLevel: 'AA',
    scopeType: 'web',
    showCrosswalk: false,
    description: '',
  });

  const [suggestedPages, setSuggestedPages] = useState<string[]>([]);
  const [isCrawling, setIsCrawling] = useState(false);

  const updateFormData = (updates: Partial<ReportFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));

    if (updates.domain) {
      setIsCrawling(true);
      // When domain changes, fetch suggested pages from backend API
      fetch(`/api/crawl?domain=${encodeURIComponent(updates.domain)}`)
        .then(res => res.json())
        .then(data => {
          if (data.suggestedPages) {
            setSuggestedPages(data.suggestedPages);
          }
          setIsCrawling(false);
        })
        .catch(() => {
          setSuggestedPages([]);
          setIsCrawling(false);
        });
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

    const handleSubmit = async () => {
      // Validate required fields before submitting
      if (!formData.title || !formData.client || !formData.domain) {
        alert('Please fill in all required fields.');
        return;
      }
      if (!formData.wcagVersion || !formData.wcagLevel || !formData.scopeType) {
        alert('Please select WCAG version, level, and scope type.');
        return;
      }
      // Create the report via API
      const newReport = {
        id: `report-${Date.now()}`,
        title: formData.title,
        client: formData.client,
        project: formData.project,
        domain: formData.domain,
        standards: [formData.wcagVersion],
        level: formData.wcagLevel,
        scopeType: formData.scopeType,
        status: 'Draft',
        version: 1,
        tags: [],
      };
      try {
        const response = await fetch('http://localhost:3001/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newReport),
        });
        if (!response.ok) {
          throw new Error('Failed to create report');
        }
        const createdReport = await response.json();
        onComplete(createdReport.id);
      } catch (error) {
        alert('Error creating report: ' + error.message);
      }
    };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.client && formData.domain;
      case 2:
        return formData.wcagVersion && formData.wcagLevel && formData.scopeType;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Create New Accessibility Report
        </h1>
        <p className="text-muted-foreground">
          Set up a new WCAG compliance audit report
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <nav aria-label="Report creation progress">
          <ol className="flex items-center justify-between">
            {STEPS.map((step, stepIdx) => (
              <li key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`
                      flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium
                      ${currentStep >= step.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground text-muted-foreground'
                      }
                    `}
                    aria-current={currentStep === step.id ? 'step' : undefined}
                  >
                    {step.id}
                  </div>
                  <div className="ml-3 text-sm">
                    <div className={`font-medium ${
                      currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.name}
                    </div>
                    <div className="text-muted-foreground">{step.description}</div>
                  </div>
                </div>
                {stepIdx < STEPS.length - 1 && (
                  <div className="flex-1 mx-8">
                    <div className={`h-0.5 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    }`} />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Report Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    placeholder="e.g., E-commerce Platform Audit"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => updateFormData({ client: e.target.value })}
                    placeholder="e.g., TechCorp Inc."
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Project Name</Label>
                  <Input
                    id="project"
                    value={formData.project}
                    onChange={(e) => updateFormData({ project: e.target.value })}
                    placeholder="e.g., Main Shopping Site"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain/URL *</Label>
                  <Input
                    id="domain"
                    value={formData.domain}
                    onChange={(e) => updateFormData({ domain: e.target.value })}
                    placeholder="e.g., shop.techcorp.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  placeholder="Brief description of the audit scope and objectives"
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">WCAG Standards</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">WCAG Version</Label>
                    <RadioGroup
                      value={formData.wcagVersion}
                      onValueChange={(value) => updateFormData({ wcagVersion: value as WCAGVersion })}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2.1" id="wcag-2.1" />
                        <Label htmlFor="wcag-2.1">WCAG 2.1</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2.2" id="wcag-2.2" />
                        <Label htmlFor="wcag-2.2">WCAG 2.2 (Recommended)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Conformance Level</Label>
                    <RadioGroup
                      value={formData.wcagLevel}
                      onValueChange={(value) => updateFormData({ wcagLevel: value as WCAGLevel })}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="A" id="level-a" />
                        <Label htmlFor="level-a">Level A (Minimum)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="AA" id="level-aa" />
                        <Label htmlFor="level-aa">Level AA (Standard)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="AAA" id="level-aaa" />
                        <Label htmlFor="level-aaa">Level AAA (Enhanced)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Scope Type</Label>
                    <RadioGroup
                      value={formData.scopeType}
                      onValueChange={(value) => updateFormData({ scopeType: value as ScopeType })}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="web" id="scope-web" />
                        <Label htmlFor="scope-web">Web Content</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mobile" id="scope-mobile" />
                        <Label htmlFor="scope-mobile">Mobile Application</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pdf" id="scope-pdf" />
                        <Label htmlFor="scope-pdf">PDF Document</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
                  <Checkbox
                    id="crosswalk"
                    checked={formData.showCrosswalk}
                    onCheckedChange={(checked) => updateFormData({ showCrosswalk: !!checked })}
                  />
                  <Label htmlFor="crosswalk" className="flex items-center gap-2">
                    Show Section 508 and ADA crosswalk references
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Displays mapping to Section 508 and ADA Title II requirements for reference.
                            Pass/fail counts are still based on WCAG criteria.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Review Report Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">Report Title</Label>
                    <p className="text-muted-foreground">{formData.title}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Client</Label>
                    <p className="text-muted-foreground">{formData.client}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Domain</Label>
                    <p className="text-muted-foreground">{formData.domain}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">Standards</Label>
                    <p className="text-muted-foreground">
                      WCAG {formData.wcagVersion} Level {formData.wcagLevel}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium">Scope</Label>
                    <p className="text-muted-foreground capitalize">{formData.scopeType}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Crosswalk</Label>
                    <p className="text-muted-foreground">
                      {formData.showCrosswalk ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
              </div>

              {formData.description && (
                <div>
                  <Label className="font-medium">Description</Label>
                  <p className="text-muted-foreground mt-1">{formData.description}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onCancel : handlePrevious}
        >
          <ChevronLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          {currentStep === 1 ? 'Cancel' : 'Previous'}
        </Button>
        
        <Button
          onClick={currentStep === STEPS.length ? handleSubmit : handleNext}
          disabled={!isStepValid(currentStep)}
        >
          {currentStep === STEPS.length ? 'Create Report' : 'Next'}
          {currentStep < STEPS.length && (
            <ChevronRight className="h-4 w-4 ml-2" aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
};

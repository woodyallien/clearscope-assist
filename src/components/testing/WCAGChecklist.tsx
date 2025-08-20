import { useState } from 'react';
import { ChevronDown, ChevronRight, Info, Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { WCAG_CRITERIA, WCAG_PRINCIPLES } from '@/data/wcag-criteria';
import type { WCAGVersion, WCAGLevel, FindingStatus } from '@/types';

interface WCAGChecklistProps {
  wcagVersion: WCAGVersion;
  wcagLevel: WCAGLevel;
  showCrosswalk: boolean;
  pageId: string;
  reportId: string;
}

interface CriterionState {
  status: FindingStatus;
  hasEvidence: boolean;
  hasNotes: boolean;
}

export const WCAGChecklist = ({ 
  wcagVersion, 
  wcagLevel, 
  showCrosswalk, 
  pageId, 
  reportId 
}: WCAGChecklistProps) => {
  const [expandedPrinciples, setExpandedPrinciples] = useState<Set<string>>(
    new Set(['1']) // Expand first principle by default
  );
  const [criterionStates, setCriterionStates] = useState<Record<string, CriterionState>>({});

  // Filter criteria based on selected version and level
  const filteredCriteria = WCAG_CRITERIA.filter(criterion => {
    // For simplicity, showing all criteria - in real app would filter by version
    const levelOrder = { 'A': 1, 'AA': 2, 'AAA': 3 };
    return levelOrder[criterion.level] <= levelOrder[wcagLevel];
  });

  const groupedCriteria = WCAG_PRINCIPLES.map(principle => ({
    ...principle,
    criteria: filteredCriteria.filter(c => c.principle === principle.name)
  }));

  const togglePrinciple = (principleId: string) => {
    const newExpanded = new Set(expandedPrinciples);
    if (newExpanded.has(principleId)) {
      newExpanded.delete(principleId);
    } else {
      newExpanded.add(principleId);
    }
    setExpandedPrinciples(newExpanded);
  };

  const updateCriterionStatus = (wcagId: string, status: FindingStatus) => {
    setCriterionStates(prev => ({
      ...prev,
      [wcagId]: {
        ...prev[wcagId],
        status
      }
    }));
  };

  const getStatusColor = (status: FindingStatus) => {
    switch (status) {
      case 'Pass':
        return 'text-success';
      case 'Fail':
        return 'text-destructive';
      case 'Needs Review':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getLevelBadgeColor = (level: WCAGLevel) => {
    switch (level) {
      case 'A':
        return 'bg-success/10 text-success-foreground border-success/20';
      case 'AA':
        return 'bg-warning/10 text-warning-foreground border-warning/20';
      case 'AAA':
        return 'bg-destructive/10 text-destructive-foreground border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-2 p-4">
      {groupedCriteria.map((principle) => (
        <Collapsible
          key={principle.id}
          open={expandedPrinciples.has(principle.id)}
          onOpenChange={() => togglePrinciple(principle.id)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-muted/50"
            >
              <div className="flex items-center gap-2 flex-1">
                {expandedPrinciples.has(principle.id) ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">
                    {principle.id}. {principle.name}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {principle.criteria.length} criteria
                  </div>
                </div>
              </div>
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="pl-6 space-y-2">
            {principle.criteria.map((criterion) => {
              const state = criterionStates[criterion.wcagId] || { status: 'Needs Review' as FindingStatus };
              
              return (
                <div
                  key={criterion.wcagId}
                  className="border rounded-lg p-3 space-y-3 bg-card"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {criterion.wcagId}
                        </span>
                        <Badge className={getLevelBadgeColor(criterion.level)}>
                          {criterion.level}
                        </Badge>
                        {showCrosswalk && (
                          <Badge variant="outline" className="text-xs">
                            508
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-foreground mb-1">
                        {criterion.title}
                      </h4>
                    </div>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Info className="h-3 w-3" />
                            <span className="sr-only">
                              More information about {criterion.title}
                            </span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-md">
                          <div className="space-y-2">
                            <p className="font-medium">{criterion.title}</p>
                            <p className="text-sm">{criterion.howToTest}</p>
                            <div className="text-xs text-muted-foreground">
                              WCAG {criterion.wcagId} • Level {criterion.level}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <RadioGroup
                    value={state.status}
                    onValueChange={(value) => updateCriterionStatus(criterion.wcagId, value as FindingStatus)}
                    className="flex flex-row gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Pass" id={`${criterion.wcagId}-pass`} />
                      <Label 
                        htmlFor={`${criterion.wcagId}-pass`}
                        className="text-sm text-success cursor-pointer"
                      >
                        Pass
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Fail" id={`${criterion.wcagId}-fail`} />
                      <Label 
                        htmlFor={`${criterion.wcagId}-fail`}
                        className="text-sm text-destructive cursor-pointer"
                      >
                        Fail
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Needs Review" id={`${criterion.wcagId}-review`} />
                      <Label 
                        htmlFor={`${criterion.wcagId}-review`}
                        className="text-sm text-warning cursor-pointer"
                      >
                        Review
                      </Label>
                    </div>
                  </RadioGroup>

                  {state.status === 'Fail' && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button size="sm" variant="outline" className="h-7">
                        <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
                        Evidence
                      </Button>
                      <Button size="sm" variant="outline" className="h-7">
                        <AlertTriangle className="h-3 w-3 mr-1" aria-hidden="true" />
                        Note
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};
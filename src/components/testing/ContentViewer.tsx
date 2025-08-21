import { useState } from 'react';
import { RefreshCw, Monitor, Tablet, Smartphone, Maximize2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ScopeType } from '@/types';

interface ContentViewerProps {
  url: string;
  scopeType: ScopeType;
}

const DEVICE_PRESETS = [
  { name: 'Desktop', width: 1200, icon: Monitor },
  { name: 'Tablet', width: 768, icon: Tablet },
  { name: 'Mobile', width: 375, icon: Smartphone },
];

export const ContentViewer = ({ url, scopeType }: ContentViewerProps) => {
  const [currentDevice, setCurrentDevice] = useState(DEVICE_PRESETS[0]);
  const [showFocusOutlines, setShowFocusOutlines] = useState(false);
  const [inputUrl, setInputUrl] = useState(url);
  const [viewerUrl, setViewerUrl] = useState(url);

  const handleRefresh = () => {
    // Force iframe refresh
    setViewerUrl(inputUrl + '?t=' + Date.now());
  };

  const handleGoClick = () => {
    setViewerUrl(inputUrl);
  };

  if (scopeType === 'pdf') {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">PDF Viewer</h4>
              <Badge variant="outline" className="text-xs">
                Preliminary checks only
              </Badge>
            </div>
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
              PDF Tools
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Automated checks are preliminary and do not prove full PDF/UA conformance.
            Manual testing is required for complete accessibility assessment.
          </p>
        </div>
        
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardContent className="p-4 h-full flex items-center justify-center text-muted-foreground">
              PDF viewer would be embedded here
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (scopeType === 'mobile') {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Mobile App Testing</h4>
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
              Tools
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Use your device to test the mobile app and record evidence here.
          </p>
        </div>
        
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center space-y-4">
              <Smartphone className="h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="font-medium mb-2">Mobile App Testing Mode</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Follow the manual testing steps and upload screen recordings or screenshots as evidence.
                </p>
                <Button>Upload Evidence</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Web content viewer
  return (
    <div className="h-full flex flex-col">
      {/* Viewer Controls */}
      <div className="p-4 border-b bg-muted/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border">
              {DEVICE_PRESETS.map((device) => {
                const Icon = device.icon;
                return (
                  <Button
                    key={device.name}
                    variant={currentDevice.name === device.name ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentDevice(device)}
                    className="rounded-none first:rounded-l-md last:rounded-r-md"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">{device.name} view</span>
                  </Button>
                );
              })}
            </div>
            
            <Badge variant="outline" className="text-xs">
              {currentDevice.width}px
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={showFocusOutlines ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFocusOutlines(!showFocusOutlines)}
            >
              Focus Outlines
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm">
              <Maximize2 className="h-4 w-4 mr-2" aria-hidden="true" />
              Fullscreen
            </Button>
          </div>
        </div>

        {/* URL Bar */}
        <div className="flex items-center gap-2">
          <input
            type="url"
            className="flex-1 bg-background border rounded-md px-3 py-2 text-sm font-mono"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            aria-label="URL input"
          />
          <Button variant="outline" size="sm" onClick={handleGoClick}>
            Go
          </Button>
        </div>
      </div>

      {/* Content Frame */}
      <div className="flex-1 p-4 bg-muted/10">
        <div 
          className="mx-auto bg-background border rounded-lg shadow-lg overflow-hidden"
          style={{ 
            width: Math.min(currentDevice.width, window.innerWidth - 100),
            height: '100%'
          }}
        >
          <iframe
            src={viewerUrl}
            className="w-full h-full"
            title="Content being tested for accessibility"
            style={{
              filter: showFocusOutlines ? 'contrast(1.1)' : 'none'
            }}
          />
        </div>
      </div>

      {/* Accessibility Tools Panel */}
      <div className="border-t bg-card/50 p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">Accessibility Tools</h4>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Headings Outline
            </Button>
            <Button size="sm" variant="outline">
              Landmarks
            </Button>
            <Button size="sm" variant="outline">
              Tab Order
            </Button>
            <Button size="sm" variant="outline">
              Color Contrast
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

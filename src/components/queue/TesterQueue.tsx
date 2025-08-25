import { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
// import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QueueItem {
  id: string;
  report_id: string;
  page_id?: string;
  criteria_id?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Available' | 'Assigned' | 'In Progress' | 'Completed';
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  // Relations
  report?: {
    title: string;
    client_id: string;
    clients?: {
      name: string;
    };
  };
  page?: {
    url: string;
    path: string;
  };
  criteria?: {
    wcag_id: string;
    title: string;
  };
}

interface TesterQueueProps {
  onStartWork?: (queueItem: QueueItem) => void;
}

export const TesterQueue = ({ onStartWork }: TesterQueueProps) => {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchQueueItems();
  }, []);

  const fetchQueueItems = async () => {
    try {
      // TODO: Replace with Supabase when migrations are complete
      setQueueItems([]);
      return;
      /*
      const { data, error } = await supabase
        .from('queue_assignments')
        .select(`
          *,
          reports (
            title,
            client_id,
            clients (name)
          ),
          pages (url, path),
          criteria (wcag_id, title)
        `)
        .order('priority', { ascending: false })
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      setQueueItems(data || []);
    } catch (error) {
      console.error('Error fetching queue items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch queue items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartWork = async (item: QueueItem) => {
    try {
      const { error } = await supabase
        .from('queue_assignments')
        .update({
          status: 'In Progress',
          started_at: new Date().toISOString(),
        })
        .eq('id', item.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Work started on assignment",
      });
      
      fetchQueueItems();
      onStartWork?.(item);
    } catch (error) {
      console.error('Error starting work:', error);
      toast({
        title: "Error",
        description: "Failed to start work",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-severity-critical text-white';
      case 'High': return 'bg-severity-major text-white';
      case 'Medium': return 'bg-severity-minor text-white';
      case 'Low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'In Progress': return <Clock className="h-4 w-4 text-warning" />;
      case 'Assigned': return <User className="h-4 w-4 text-primary" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getDueDateColor = (dueDate?: string) => {
    if (!dueDate) return '';
    
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-destructive'; // Overdue
    if (diffDays <= 2) return 'text-warning'; // Due soon
    if (diffDays <= 7) return 'text-amber-600'; // Due this week
    return 'text-success'; // On track
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tester Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Tester Queue ({queueItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {queueItems.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No items in queue. Check back later for new assignments.
          </p>
        ) : (
          <div className="space-y-4">
            {queueItems.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <h4 className="font-semibold">
                          {item.report?.title || 'Unknown Report'}
                        </h4>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        {item.report?.clients?.name && (
                          <p>Client: {item.report.clients.name}</p>
                        )}
                        {item.page && (
                          <p>Page: {item.page.path}</p>
                        )}
                        {item.criteria && (
                          <p>Criterion: {item.criteria.wcag_id} - {item.criteria.title}</p>
                        )}
                        {item.due_date && (
                          <p className={getDueDateColor(item.due_date)}>
                            Due: {new Date(item.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {item.status === 'Available' && (
                        <Button 
                          size="sm"
                          onClick={() => handleStartWork(item)}
                        >
                          Start Work
                        </Button>
                      )}
                      {item.status === 'In Progress' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onStartWork?.(item)}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
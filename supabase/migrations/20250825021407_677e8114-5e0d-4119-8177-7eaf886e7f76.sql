-- Add due_date to reports table and create queue system
CREATE TYPE public.app_role AS ENUM ('Admin', 'Lead', 'Tester', 'Reviewer', 'Viewer');
CREATE TYPE public.report_status AS ENUM ('Draft', 'In Review', 'Approved', 'Released');
CREATE TYPE public.page_status AS ENUM ('Planned', 'In Testing', 'Completed');
CREATE TYPE public.finding_status AS ENUM ('Pass', 'Fail', 'Needs Review', 'Not Applicable');
CREATE TYPE public.finding_severity AS ENUM ('Critical', 'Major', 'Minor', 'Advisory');
CREATE TYPE public.wcag_level AS ENUM ('A', 'AA', 'AAA');
CREATE TYPE public.wcag_version AS ENUM ('2.1', '2.2');
CREATE TYPE public.scope_type AS ENUM ('web', 'pdf', 'mobile');
CREATE TYPE public.coverage_label AS ENUM ('Key', 'Template', 'Sample');
CREATE TYPE public.evidence_type AS ENUM ('Screenshot', 'Video', 'Audio', 'HAR', 'CodeSnippet', 'File');
CREATE TYPE public.queue_status AS ENUM ('Available', 'Assigned', 'In Progress', 'Completed');
CREATE TYPE public.priority_level AS ENUM ('Low', 'Medium', 'High', 'Urgent');

-- Profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'Tester',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  updated_by UUID REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Admins and Leads can manage clients" ON public.clients FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('Admin', 'Lead'))
);

-- Reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  project TEXT NOT NULL,
  standards wcag_version[] NOT NULL DEFAULT '{2.2}',
  level wcag_level NOT NULL DEFAULT 'AA',
  scope_type scope_type NOT NULL DEFAULT 'web',
  domain TEXT NOT NULL,
  status report_status NOT NULL DEFAULT 'Draft',
  version INTEGER NOT NULL DEFAULT 1,
  due_date TIMESTAMP WITH TIME ZONE,
  priority priority_level NOT NULL DEFAULT 'Medium',
  sign_off JSONB,
  tags TEXT[] DEFAULT '{}',
  suggested_pages TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  updated_by UUID REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Admins and Leads can manage reports" ON public.reports FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('Admin', 'Lead'))
);

-- Pages table
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  path TEXT NOT NULL,
  template_name TEXT,
  status page_status NOT NULL DEFAULT 'Planned',
  last_tested_at TIMESTAMP WITH TIME ZONE,
  coverage_label coverage_label NOT NULL DEFAULT 'Sample',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  updated_by UUID REFERENCES auth.users(id) NOT NULL,
  UNIQUE(report_id, url)
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view pages" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage pages" ON public.pages FOR ALL USING (auth.uid() IS NOT NULL);

-- WCAG Criteria table
CREATE TABLE public.criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wcag_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  level wcag_level NOT NULL,
  principle TEXT NOT NULL,
  how_to_test TEXT NOT NULL,
  remediation_links TEXT[] DEFAULT '{}',
  applicable_media scope_type[] DEFAULT '{web}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.criteria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view criteria" ON public.criteria FOR SELECT USING (true);
CREATE POLICY "Admins can manage criteria" ON public.criteria FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'Admin')
);

-- Queue assignments table
CREATE TABLE public.queue_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
  page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
  criteria_id UUID REFERENCES public.criteria(id),
  assigned_to UUID REFERENCES auth.users(id),
  status queue_status NOT NULL DEFAULT 'Available',
  priority priority_level NOT NULL DEFAULT 'Medium',
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  updated_by UUID REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE public.queue_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view assignments" ON public.queue_assignments FOR SELECT USING (true);
CREATE POLICY "Admins can manage all assignments" ON public.queue_assignments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('Admin', 'Lead'))
);
CREATE POLICY "Testers can update their own assignments" ON public.queue_assignments FOR UPDATE USING (assigned_to = auth.uid());

-- Findings table
CREATE TABLE public.findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
  page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
  wcag_id TEXT NOT NULL,
  status finding_status NOT NULL DEFAULT 'Needs Review',
  severity finding_severity,
  description TEXT DEFAULT '',
  location_selector TEXT,
  assistive_tech_used TEXT[] DEFAULT '{}',
  evidence_ids TEXT[] DEFAULT '{}',
  assigned_to UUID REFERENCES auth.users(id),
  due_date TIMESTAMP WITH TIME ZONE,
  labels TEXT[] DEFAULT '{}',
  reference_links TEXT[] DEFAULT '{}',
  retention_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  updated_by UUID REFERENCES auth.users(id) NOT NULL,
  UNIQUE(report_id, page_id, wcag_id)
);

ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view findings" ON public.findings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage findings" ON public.findings FOR ALL USING (auth.uid() IS NOT NULL);

-- Evidence table
CREATE TABLE public.evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type evidence_type NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT NOT NULL,
  alt_text TEXT,
  transcript TEXT,
  redaction_flags BOOLEAN DEFAULT false,
  hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  updated_by UUID REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view evidence" ON public.evidence FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage evidence" ON public.evidence FOR ALL USING (auth.uid() IS NOT NULL);

-- Comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  finding_id UUID REFERENCES public.findings(id) ON DELETE CASCADE NOT NULL,
  body TEXT NOT NULL,
  mentions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  updated_by UUID REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage comments" ON public.comments FOR ALL USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_criteria_updated_at BEFORE UPDATE ON public.criteria FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_queue_assignments_updated_at BEFORE UPDATE ON public.queue_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_findings_updated_at BEFORE UPDATE ON public.findings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_evidence_updated_at BEFORE UPDATE ON public.evidence FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
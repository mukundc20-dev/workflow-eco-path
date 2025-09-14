import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkflowNode } from '@/pages/Index';

const API_BASE_URL = 'http://localhost:5000/api';

// API functions
const fetchWorkflowData = async (): Promise<WorkflowNode[]> => {
  const response = await fetch(`${API_BASE_URL}/workflow`);
  if (!response.ok) {
    throw new Error('Failed to fetch workflow data');
  }
  const data = await response.json();
  return data.data;
};

const fetchWorkflowNode = async (nodeId: string): Promise<WorkflowNode> => {
  const response = await fetch(`${API_BASE_URL}/workflow/${nodeId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch node ${nodeId}`);
  }
  const data = await response.json();
  return data.data;
};

const fetchAnalyticsSummary = async () => {
  const response = await fetch(`${API_BASE_URL}/analytics/summary`);
  if (!response.ok) {
    throw new Error('Failed to fetch analytics summary');
  }
  const data = await response.json();
  return data.data;
};

const processData = async (data: any) => {
  const response = await fetch(`${API_BASE_URL}/process-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to process data');
  }
  return response.json();
};

// Custom hooks
export const useWorkflowData = () => {
  return useQuery({
    queryKey: ['workflow'],
    queryFn: fetchWorkflowData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useWorkflowNode = (nodeId: string) => {
  return useQuery({
    queryKey: ['workflow', nodeId],
    queryFn: () => fetchWorkflowNode(nodeId),
    enabled: !!nodeId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAnalyticsSummary = () => {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: fetchAnalyticsSummary,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useProcessData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: processData,
    onSuccess: () => {
      // Invalidate and refetch workflow data after processing
      queryClient.invalidateQueries({ queryKey: ['workflow'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

// Workflow execution functions
const startWorkflow = async () => {
  const response = await fetch(`${API_BASE_URL}/workflow/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to start workflow');
  }
  return response.json();
};

const executeWorkflowStep = async (stepId: string) => {
  const response = await fetch(`${API_BASE_URL}/workflow/step/${stepId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to execute step ${stepId}`);
  }
  return response.json();
};

const getWorkflowStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/workflow/status`);
  if (!response.ok) {
    throw new Error('Failed to get workflow status');
  }
  return response.json();
};

// Workflow hooks
export const useStartWorkflow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: startWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-status'] });
    },
  });
};

export const useExecuteWorkflowStep = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: executeWorkflowStep,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-status'] });
    },
  });
};

export const useWorkflowStatus = () => {
  return useQuery({
    queryKey: ['workflow-status'],
    queryFn: getWorkflowStatus,
    refetchInterval: 1000, // Poll every second when workflow is running
    enabled: true,
  });
};

// Health check function
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};

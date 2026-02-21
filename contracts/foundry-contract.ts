export type CapabilityCategory =
  | 'STRATEGY'
  | 'ENGINEERING'
  | 'DESIGN'
  | 'AI'

export interface ExecutionRequestV1 {
  protocolVersion: '1.0'
  requestId: string
  tenantId: string
  project: {
    id: string
    name: string
    description: string
    industry?: string
    geography?: string
    budgetTier?: string
    timeline?: string
  }
  capabilities: {
    id: string
    category: CapabilityCategory
  }[]
  inputs: {
    ideaSummary: string
    attachments?: {
      id: string
      fileName: string
      mimeType: string
      storagePath: string
    }[]
  }
  context: {
    source: 'LaunchCTO'
    environment: 'dev' | 'prod'
  }
}

export interface ExecutionResponseV1 {
  protocolVersion: '1.0'
  jobId: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  acceptedAt: string
}

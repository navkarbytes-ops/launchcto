export type FoundryExecutePayload = {
  tenantId: string
  projectId: string
  capabilities: string[]
  metadata: Record<string, any>
}

export type FoundryExecuteResponse = {
  job_id?: string
  jobId?: string
  status?: string
  [k: string]: any
}

export type FoundryJobStatus = {
  job_id?: string
  status?: string
  logs?: string[]
  artifact_url?: string
  [k: string]: any
}

---
name: Cursor Agent Orchestrator
version: 1.0.0
author: newth.ai
category: development
tags:
  - cursor
  - agent
  - orchestration
  - automation
  - workflow
compatibility:
  - cursor
  - claude
---

# Cursor Agent Orchestrator

Chain multiple Cursor agent operations and batch process files. Enable complex multi-step agent workflows with dependency management, error recovery, and result logging.

## Triggers

Use this skill when the user requests:
- Chaining multiple agent operations
- Batch processing files through agent mode
- Orchestrating complex multi-step workflows
- Automating sequential code transformations
- Managing dependencies between agent tasks

Keywords: "agent", "orchestrate", "chain", "batch", "workflow", "multi-step", "sequential", "cursor agent"

## Features

- **Operation Chaining**: Link multiple agent operations in sequence
- **Batch File Processing**: Process multiple files through agent mode
- **Dependency Management**: Define task dependencies and execution order
- **Error Recovery**: Automatic retry logic with configurable strategies
- **Result Logging**: Track operation status and results
- **Parallel Execution**: Run independent operations concurrently

## Core Concepts

### Agent Operation

An agent operation is a single task executed in agent mode:

```typescript
interface AgentOperation {
  id: string
  description: string
  files: string[]
  prompt: string
  dependsOn?: string[]
  retries?: number
  timeout?: number
}
```

### Workflow Pipeline

A workflow pipeline chains multiple operations:

```typescript
interface WorkflowPipeline {
  name: string
  operations: AgentOperation[]
  onError?: 'stop' | 'continue' | 'retry'
  maxRetries?: number
}
```

## Usage Examples

### Basic Operation Chaining

Chain two agent operations where the second depends on the first:

```typescript
const workflow = {
  name: 'refactor-and-test',
  operations: [
    {
      id: 'refactor',
      description: 'Refactor legacy code to use modern patterns',
      files: ['src/legacy/*.ts'],
      prompt: 'Refactor this code to use async/await and TypeScript best practices',
    },
    {
      id: 'add-tests',
      description: 'Add unit tests for refactored code',
      files: ['src/legacy/*.ts'],
      prompt: 'Add comprehensive unit tests using Jest',
      dependsOn: ['refactor'],
    },
  ],
}

// Execute workflow
await orchestrator.run(workflow)
```

### Batch File Processing

Process multiple files with the same transformation:

```typescript
const batchOperation = {
  id: 'add-logging',
  description: 'Add error logging to all API routes',
  files: [
    'src/routes/users.ts',
    'src/routes/posts.ts',
    'src/routes/comments.ts',
    'src/routes/auth.ts',
  ],
  prompt: 'Add comprehensive error logging using our Logger utility',
  retries: 2,
}

await orchestrator.runOperation(batchOperation)
```

### Parallel Independent Operations

Run multiple independent operations concurrently:

```typescript
const parallelWorkflow = {
  name: 'parallel-improvements',
  operations: [
    {
      id: 'optimize-queries',
      description: 'Optimize database queries',
      files: ['src/database/*.ts'],
      prompt: 'Optimize these database queries for performance',
    },
    {
      id: 'add-validation',
      description: 'Add input validation',
      files: ['src/api/*.ts'],
      prompt: 'Add Zod validation schemas for all API endpoints',
    },
    {
      id: 'update-docs',
      description: 'Update documentation',
      files: ['docs/*.md'],
      prompt: 'Update documentation to reflect latest API changes',
    },
  ],
  // No dependencies - runs in parallel
}

await orchestrator.run(parallelWorkflow)
```

### Complex Dependency Chain

Build a complex workflow with multiple dependency levels:

```typescript
const complexWorkflow = {
  name: 'migration-workflow',
  operations: [
    {
      id: 'create-migration',
      description: 'Create database migration',
      files: ['src/migrations/001-initial.ts'],
      prompt: 'Create a migration to add user preferences table',
    },
    {
      id: 'update-models',
      description: 'Update data models',
      files: ['src/models/User.ts'],
      prompt: 'Add UserPreferences relation to User model',
      dependsOn: ['create-migration'],
    },
    {
      id: 'create-api',
      description: 'Create API endpoints',
      files: ['src/routes/preferences.ts'],
      prompt: 'Create CRUD endpoints for user preferences',
      dependsOn: ['update-models'],
    },
    {
      id: 'add-tests',
      description: 'Add integration tests',
      files: ['tests/preferences.test.ts'],
      prompt: 'Add integration tests for preferences API',
      dependsOn: ['create-api'],
    },
    {
      id: 'update-client',
      description: 'Update frontend client',
      files: ['client/src/api/preferences.ts'],
      prompt: 'Add client methods for preferences API',
      dependsOn: ['create-api'],
    },
  ],
}

await orchestrator.run(complexWorkflow)
```

## Error Handling and Retry Logic

### Automatic Retries

Configure retry behavior for operations:

```typescript
const operationWithRetry = {
  id: 'flaky-operation',
  description: 'Operation that might fail',
  files: ['src/complex-refactor.ts'],
  prompt: 'Refactor this complex code',
  retries: 3, // Retry up to 3 times
  timeout: 300000, // 5 minute timeout
}
```

### Error Recovery Strategies

Define workflow-level error handling:

```typescript
const resilientWorkflow = {
  name: 'resilient-workflow',
  operations: [...operations],
  onError: 'continue', // Continue to next operation on error
  maxRetries: 2,
}

// Alternative: Stop on first error
const strictWorkflow = {
  name: 'strict-workflow',
  operations: [...operations],
  onError: 'stop', // Stop entire workflow on error
}

// Custom error handling
const customWorkflow = {
  name: 'custom-workflow',
  operations: [...operations],
  onError: 'retry', // Retry failed operation
  maxRetries: 3,
}
```

## Monitoring and Logging

### Operation Status Tracking

Monitor operation progress:

```typescript
const monitor = orchestrator.createMonitor(workflow)

monitor.on('operation-start', (op) => {
  console.log(`Starting: ${op.description}`)
})

monitor.on('operation-complete', (op, result) => {
  console.log(`Completed: ${op.description}`)
  console.log(`Files modified: ${result.filesModified.length}`)
})

monitor.on('operation-error', (op, error) => {
  console.error(`Failed: ${op.description}`, error)
})

await orchestrator.run(workflow, { monitor })
```

### Result Logging

Log workflow results to file:

```typescript
const workflow = {
  name: 'logged-workflow',
  operations: [...operations],
}

const result = await orchestrator.run(workflow)

// Write results to log file
await writeFile(
  'workflow-results.json',
  JSON.stringify(result, null, 2)
)

// Result structure:
{
  "workflowName": "logged-workflow",
  "status": "completed",
  "startTime": "2026-01-27T12:00:00Z",
  "endTime": "2026-01-27T12:15:00Z",
  "operations": [
    {
      "id": "operation-1",
      "status": "success",
      "filesModified": ["file1.ts", "file2.ts"],
      "duration": 45000
    }
  ]
}
```

## Advanced Patterns

### Conditional Execution

Execute operations based on conditions:

```typescript
const conditionalWorkflow = {
  name: 'conditional-workflow',
  operations: [
    {
      id: 'analyze',
      description: 'Analyze codebase',
      files: ['src/**/*.ts'],
      prompt: 'Analyze code quality and identify issues',
    },
    {
      id: 'refactor-if-needed',
      description: 'Refactor based on analysis',
      files: ['src/**/*.ts'],
      prompt: 'Refactor code to fix identified issues',
      dependsOn: ['analyze'],
      condition: (results) => results.analyze.issuesFound > 0,
    },
  ],
}
```

### File Filtering

Process files based on patterns or conditions:

```typescript
const filteredOperation = {
  id: 'update-large-files',
  description: 'Update large files only',
  files: await glob('src/**/*.ts').then(files =>
    files.filter(file => {
      const stats = statSync(file)
      return stats.size > 10000 // Files > 10KB
    })
  ),
  prompt: 'Add performance optimizations',
}
```

### Incremental Processing

Process files in chunks to avoid overwhelming the agent:

```typescript
const files = await glob('src/**/*.ts')
const chunkSize = 5

for (let i = 0; i < files.length; i += chunkSize) {
  const chunk = files.slice(i, i + chunkSize)
  
  await orchestrator.runOperation({
    id: `batch-${i / chunkSize}`,
    description: `Process files ${i} to ${i + chunkSize}`,
    files: chunk,
    prompt: 'Add JSDoc comments',
  })
}
```

## Implementation Example

Here's a complete implementation of the orchestrator:

```typescript
import { exec } from 'child_process'
import { promisify } from 'util'
import EventEmitter from 'events'

const execAsync = promisify(exec)

class CursorAgentOrchestrator extends EventEmitter {
  constructor() {
    super()
  }

  async runOperation(operation: AgentOperation) {
    this.emit('operation-start', operation)
    
    const startTime = Date.now()
    let attempts = 0
    const maxAttempts = (operation.retries || 0) + 1
    
    while (attempts < maxAttempts) {
      try {
        attempts++
        
        // Build command for agent mode
        const filesArg = operation.files.join(' ')
        const command = `cursor --agent "${operation.prompt}" ${filesArg}`
        
        // Execute with timeout
        const { stdout, stderr } = await execAsync(command, {
          timeout: operation.timeout || 600000, // 10 min default
        })
        
        const result = {
          id: operation.id,
          status: 'success',
          filesModified: operation.files,
          duration: Date.now() - startTime,
          stdout,
          stderr,
        }
        
        this.emit('operation-complete', operation, result)
        return result
        
      } catch (error) {
        if (attempts >= maxAttempts) {
          this.emit('operation-error', operation, error)
          throw error
        }
        
        this.emit('operation-retry', operation, attempts)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts))
      }
    }
  }

  async run(workflow: WorkflowPipeline, options = {}) {
    this.emit('workflow-start', workflow)
    
    const startTime = Date.now()
    const results = new Map()
    const completed = new Set<string>()
    
    // Build dependency graph
    const pending = new Set(workflow.operations.map(op => op.id))
    
    while (pending.size > 0) {
      // Find operations ready to run (dependencies met)
      const ready = workflow.operations.filter(op =>
        pending.has(op.id) &&
        (!op.dependsOn || op.dependsOn.every(dep => completed.has(dep)))
      )
      
      if (ready.length === 0) {
        throw new Error('Circular dependency detected or no operations ready')
      }
      
      // Run ready operations (in parallel if multiple)
      const promises = ready.map(async op => {
        try {
          const result = await this.runOperation(op)
          results.set(op.id, result)
          completed.add(op.id)
          pending.delete(op.id)
        } catch (error) {
          if (workflow.onError === 'stop') {
            throw error
          } else if (workflow.onError === 'continue') {
            results.set(op.id, { status: 'error', error })
            completed.add(op.id)
            pending.delete(op.id)
          }
        }
      })
      
      await Promise.all(promises)
    }
    
    const workflowResult = {
      workflowName: workflow.name,
      status: 'completed',
      startTime: new Date(startTime).toISOString(),
      endTime: new Date().toISOString(),
      duration: Date.now() - startTime,
      operations: Array.from(results.values()),
    }
    
    this.emit('workflow-complete', workflowResult)
    return workflowResult
  }
  
  createMonitor(workflow: WorkflowPipeline) {
    // Monitor is the orchestrator itself (EventEmitter)
    return this
  }
}

// Usage
const orchestrator = new CursorAgentOrchestrator()

const workflow = {
  name: 'code-improvement',
  operations: [
    {
      id: 'refactor',
      description: 'Refactor code',
      files: ['src/**/*.ts'],
      prompt: 'Refactor to use modern TypeScript patterns',
    },
    {
      id: 'test',
      description: 'Add tests',
      files: ['src/**/*.ts'],
      prompt: 'Add comprehensive unit tests',
      dependsOn: ['refactor'],
    },
  ],
  onError: 'stop',
}

orchestrator.on('operation-start', (op) => {
  console.log(`▶ Starting: ${op.description}`)
})

orchestrator.on('operation-complete', (op, result) => {
  console.log(`✓ Completed: ${op.description} (${result.duration}ms)`)
})

const result = await orchestrator.run(workflow)
console.log('Workflow completed:', result)
```

## Best Practices

### 1. Keep Operations Atomic

Each operation should be a single, focused task:

```typescript
// ✅ Good - atomic operations
{
  id: 'add-types',
  prompt: 'Add TypeScript types to function parameters'
}
{
  id: 'add-docs',
  prompt: 'Add JSDoc comments',
  dependsOn: ['add-types']
}

// ❌ Bad - too broad
{
  id: 'improve-code',
  prompt: 'Add types, docs, and refactor everything'
}
```

### 2. Define Clear Dependencies

Make dependencies explicit:

```typescript
const workflow = {
  operations: [
    { id: 'step1', ... },
    { id: 'step2', dependsOn: ['step1'] },
    { id: 'step3', dependsOn: ['step2'] },
  ]
}
```

### 3. Use Appropriate Timeouts

Set realistic timeouts based on operation complexity:

```typescript
{
  id: 'quick-format',
  timeout: 60000, // 1 minute
  prompt: 'Format code'
}

{
  id: 'major-refactor',
  timeout: 600000, // 10 minutes
  prompt: 'Refactor entire module'
}
```

### 4. Handle Errors Gracefully

Choose appropriate error handling strategy:

```typescript
// For critical workflows
const criticalWorkflow = {
  onError: 'stop', // Stop on any error
  maxRetries: 3,
}

// For batch processing
const batchWorkflow = {
  onError: 'continue', // Process all files despite errors
  maxRetries: 1,
}
```

### 5. Monitor Progress

Always monitor long-running workflows:

```typescript
orchestrator.on('operation-complete', (op, result) => {
  console.log(`✓ ${op.description}: ${result.filesModified.length} files`)
})

orchestrator.on('operation-error', (op, error) => {
  console.error(`✗ ${op.description}: ${error.message}`)
})
```

## Common Workflows

### Code Migration

Migrate codebase to new patterns or frameworks:

```typescript
const migrationWorkflow = {
  name: 'migrate-to-new-framework',
  operations: [
    {
      id: 'update-imports',
      files: ['src/**/*.ts'],
      prompt: 'Update imports to use new framework paths',
    },
    {
      id: 'refactor-components',
      files: ['src/components/**/*.tsx'],
      prompt: 'Refactor components to new framework patterns',
      dependsOn: ['update-imports'],
    },
    {
      id: 'update-tests',
      files: ['tests/**/*.test.ts'],
      prompt: 'Update tests for new framework',
      dependsOn: ['refactor-components'],
    },
  ],
}
```

### Documentation Generation

Generate comprehensive documentation:

```typescript
const docsWorkflow = {
  name: 'generate-docs',
  operations: [
    {
      id: 'api-docs',
      files: ['src/api/**/*.ts'],
      prompt: 'Add JSDoc comments for all exported functions',
    },
    {
      id: 'readme',
      files: ['README.md'],
      prompt: 'Update README with API documentation',
      dependsOn: ['api-docs'],
    },
    {
      id: 'examples',
      files: ['docs/examples/*.md'],
      prompt: 'Create usage examples',
      dependsOn: ['api-docs'],
    },
  ],
}
```

### Quality Improvement

Improve code quality across the codebase:

```typescript
const qualityWorkflow = {
  name: 'improve-quality',
  operations: [
    {
      id: 'add-types',
      files: ['src/**/*.ts'],
      prompt: 'Add explicit types to all function parameters and return values',
    },
    {
      id: 'error-handling',
      files: ['src/**/*.ts'],
      prompt: 'Add proper error handling with try/catch and error types',
    },
    {
      id: 'logging',
      files: ['src/**/*.ts'],
      prompt: 'Add appropriate logging for debugging',
    },
  ],
}
```

## Dependencies

The orchestrator requires:

- Cursor IDE with agent mode
- Node.js for TypeScript orchestrator
- File system access for batch operations

```bash
# No additional dependencies needed
# Built on Cursor's native agent capabilities
```

## Troubleshooting

### Operations Timing Out

Increase timeout or split into smaller operations:

```typescript
// Split large operation
const largeFiles = await glob('src/**/*.ts')
const chunks = chunk(largeFiles, 10) // 10 files per batch

const operations = chunks.map((files, i) => ({
  id: `batch-${i}`,
  files,
  prompt: 'Refactor code',
  timeout: 300000, // 5 min per batch
}))
```

### Circular Dependencies

Ensure dependency graph is acyclic:

```typescript
// ❌ Circular dependency
{
  id: 'a',
  dependsOn: ['b']
}
{
  id: 'b',
  dependsOn: ['a']
}

// ✅ Linear dependency
{
  id: 'a',
}
{
  id: 'b',
  dependsOn: ['a']
}
```

### Agent Mode Not Responding

Check Cursor settings and agent availability:

```typescript
// Add health check before workflow
async function checkAgentHealth() {
  try {
    await execAsync('cursor --version')
    return true
  } catch (error) {
    console.error('Cursor agent not available')
    return false
  }
}

if (await checkAgentHealth()) {
  await orchestrator.run(workflow)
}
```

## Limitations

- Requires Cursor IDE with agent mode enabled
- Operations run sequentially based on dependencies
- No built-in rollback mechanism (use version control)
- Timeout limits depend on operation complexity

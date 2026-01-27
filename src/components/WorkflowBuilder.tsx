import type { Workflow } from '../data/workflows'
import { useWorkflowState } from '../hooks/useWorkflowState'
import { WorkflowCanvas } from './WorkflowCanvas'
import { WorkflowSidebar } from './WorkflowSidebar'
import {
  WorkflowToolbar,
  SaveWorkflowModal,
  ExecutionPanel,
  WorkflowInputModal
} from './workflow'

export interface WorkflowBuilderProps {
  initialWorkflow?: Workflow
  onSave?: (workflow: Workflow) => void
}

export function WorkflowBuilder({ initialWorkflow, onSave }: WorkflowBuilderProps) {
  const {
    // State
    workflow,
    selectedNodeId,
    connectingFrom,
    validationErrors,
    isSaved,
    executionState,
    showExecutionPanel,
    showSaveModal,
    showInputModal,
    pendingInputs,

    // Refs
    canvasRef,
    fileInputRef,

    // Node operations
    addNode,
    removeNode,
    updateNodePosition,

    // Connection operations
    startConnection,
    completeConnection,
    removeConnection,
    cancelConnection,

    // Selection
    setSelectedNodeId,

    // Save operations
    handleSave,
    handleSaveWithName,

    // Canvas operations
    clearCanvas,

    // Execution operations
    handleRunWorkflow,
    runWorkflowWithInputs,

    // Import/Export
    handleExport,
    handleImport,

    // Modal controls
    setShowSaveModal,
    setShowExecutionPanel,
    setShowInputModal
  } = useWorkflowState({ initialWorkflow, onSave })

  return (
    <div className="flex h-full overflow-hidden">
      <WorkflowSidebar
        onAddSkill={addNode}
        workflow={workflow}
      />

      <div className="flex-1 flex flex-col">
        <WorkflowToolbar
          workflow={workflow}
          validationErrors={validationErrors}
          isSaved={isSaved}
          executionState={executionState}
          fileInputRef={fileInputRef}
          onImport={handleImport}
          onExport={handleExport}
          onClear={clearCanvas}
          onRun={handleRunWorkflow}
          onSave={handleSave}
        />

        <div className="flex-1 flex">
          <WorkflowCanvas
            ref={canvasRef}
            nodes={workflow.nodes}
            connections={workflow.connections}
            selectedNodeId={selectedNodeId}
            connectingFrom={connectingFrom}
            onSelectNode={setSelectedNodeId}
            onUpdateNodePosition={updateNodePosition}
            onStartConnection={startConnection}
            onCompleteConnection={completeConnection}
            onRemoveNode={removeNode}
            onRemoveConnection={removeConnection}
            onCancelConnection={cancelConnection}
            nodeExecutionStates={executionState?.nodeStates}
          />

          {showExecutionPanel && (
            <ExecutionPanel
              executionState={executionState}
              onClose={() => setShowExecutionPanel(false)}
            />
          )}
        </div>
      </div>

      {showSaveModal && (
        <SaveWorkflowModal
          workflow={workflow}
          onSave={handleSaveWithName}
          onClose={() => setShowSaveModal(false)}
        />
      )}

      {showInputModal && (
        <WorkflowInputModal
          requiredInputs={pendingInputs}
          onRun={runWorkflowWithInputs}
          onClose={() => setShowInputModal(false)}
        />
      )}
    </div>
  )
}

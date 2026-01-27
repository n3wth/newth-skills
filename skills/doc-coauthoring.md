---
name: Doc Co-authoring
version: 1.0.0
author: newth.ai
category: business
tags:
  - documentation
  - writing
  - collaboration
compatibility:
  - gemini
  - claude
---

# Doc Co-authoring

Structured workflow for co-authoring documentation, proposals, technical specs, and decision docs. Collaborate effectively with AI to produce high-quality written content.

## Triggers

Use this skill when the user requests:
- Writing documentation collaboratively
- Creating proposals or specs
- Drafting decision documents
- Iterating on written content
- Structuring technical documents

Keywords: "document", "write", "draft", "proposal", "spec", "RFC", "ADR", "documentation", "co-author"

## Features

- **Structured Document Workflows**: Step-by-step processes for different document types
- **Proposal Writing Frameworks**: Templates for persuasive proposals
- **Technical Spec Templates**: Comprehensive specification structures
- **Decision Document Formats**: ADR and RFC patterns
- **Iterative Review Processes**: Feedback loops for refinement

## Document Types

### Technical Specification

```markdown
# [Feature Name] Technical Specification

## Overview
Brief description of what this specification covers.

## Background
Context and motivation for this feature.

## Goals
- Primary goal 1
- Primary goal 2

## Non-Goals
- Explicitly out of scope item 1
- Explicitly out of scope item 2

## Proposed Solution

### Architecture
High-level architecture description.

### API Design
```
endpoint: /api/v1/resource
method: POST
request: { ... }
response: { ... }
```

### Data Model
Schema and data structure changes.

### Security Considerations
Authentication, authorization, and data protection.

## Alternatives Considered
Other approaches evaluated and why they were rejected.

## Implementation Plan
1. Phase 1: ...
2. Phase 2: ...
3. Phase 3: ...

## Open Questions
- Question 1?
- Question 2?

## References
- Link to related documents
```

### Architecture Decision Record (ADR)

```markdown
# ADR-001: [Decision Title]

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What is the issue that we're seeing that is motivating this decision?

## Decision
What is the change that we're proposing and/or doing?

## Consequences

### Positive
- Benefit 1
- Benefit 2

### Negative
- Tradeoff 1
- Tradeoff 2

### Neutral
- Observation 1

## References
- Related ADRs
- External documentation
```

### Project Proposal

```markdown
# [Project Name] Proposal

## Executive Summary
One paragraph overview of the proposal.

## Problem Statement
What problem are we solving? Include data and evidence.

## Proposed Solution
How will we solve this problem?

## Success Metrics
How will we measure success?
- Metric 1: Target value
- Metric 2: Target value

## Timeline
| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Discovery | 2 weeks | Requirements doc |
| Design | 3 weeks | Technical spec |
| Implementation | 6 weeks | Working feature |
| Testing | 2 weeks | QA sign-off |

## Resource Requirements
- Engineering: X engineers for Y weeks
- Design: X designers for Y weeks
- Budget: $X for tools/services

## Risks and Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Risk 1 | Medium | High | Mitigation strategy |

## Stakeholders
- Sponsor: Name
- Lead: Name
- Contributors: Names

## Appendix
Supporting materials and detailed analysis.
```

## Co-authoring Workflow

### Phase 1: Discovery
1. **Gather requirements**: What needs to be documented?
2. **Identify audience**: Who will read this document?
3. **Define scope**: What's in and out of scope?
4. **Choose template**: Select appropriate document structure

### Phase 2: Outline
1. **Create skeleton**: Major sections and headings
2. **Add key points**: Bullet points under each section
3. **Review structure**: Ensure logical flow
4. **Get early feedback**: Validate approach before writing

### Phase 3: Draft
1. **Write section by section**: Focus on one area at a time
2. **Include placeholders**: Mark areas needing more info
3. **Add examples**: Concrete illustrations of concepts
4. **Note open questions**: Track items needing resolution

### Phase 4: Review
1. **Self-review**: Check for clarity and completeness
2. **Peer review**: Get feedback from stakeholders
3. **Technical review**: Verify accuracy of technical content
4. **Editorial review**: Polish language and formatting

### Phase 5: Finalize
1. **Address feedback**: Incorporate review comments
2. **Resolve open questions**: Fill in remaining gaps
3. **Final proofread**: Check for typos and formatting
4. **Publish**: Share with intended audience

## Usage Examples

### Starting a new document

```
User: I need to write a technical spec for our new authentication system.

# Debug Validation Flow

## Test Steps:

1. **Open the app** - Check console for initial state
   - Look for: `[App] Current workflow state:` with `currentStep: 'problem_input'`
   - Look for: `[ProgressSteps] Rendering with currentStep: 1`

2. **Enter problem text** - Type a problem in the CoreProblemNode textarea
   - Example: "Small business owners struggle to manage their inventory efficiently"

3. **Click "Analyze Problem"** - Watch console for validation flow
   - Look for: `[CoreProblemNode] Starting validation for:`
   - Look for: `[problemApi] Validating problem with direct fetch`
   - Look for: `[CoreProblemNode] Validation result:`

4. **Check validation success** - After validation completes
   - Look for: `[CoreProblemNode] Problem is valid, proceeding to next step`
   - Look for: `[workflowStore] Problem validated, coreProblem set:`
   - Look for: `[workflowStore] Starting persona generation after validation...`

5. **Check step progression** - After validation
   - Look for: `[CoreProblemNode] Calling proceedToNextStep after validation`
   - Look for: `[workflowStore] proceedToNextStep called, canProceed: true`
   - Look for: `[workflowStore] Advancing from problem_input to persona_discovery`

6. **Check UI updates** - Visual changes after validation
   - CoreProblemNode should flash gold briefly
   - CoreProblemNode should have gold border after flash
   - ProgressBar Step 1 should turn gold (completed)
   - ProgressBar Step 2 should be white/highlighted (current)
   - Canvas should zoom out to show personas column

7. **Check persona generation** - API call to generate personas
   - Look for: `[problemApi] Generating personas with edge function`
   - Look for: `[problemApi] Personas response status:`
   - Look for: `[workflowStore] Personas generated:`

## Expected Console Output Sequence:

```
[CoreProblemNode] Starting validation for: [problem text]
[problemApi] Validating problem with direct fetch
[problemApi] Response status: 200
[CoreProblemNode] Validation result: {isValid: true, ...}
[CoreProblemNode] Problem is valid, triggering all actions
[CoreProblemNode] Set coreProblem: {...}
[CoreProblemNode] Proceeding to next step
[workflowStore] proceedToNextStep called, canProceed: true
[workflowStore] Advancing from problem_input to persona_discovery
[App] stepToNumber: persona_discovery -> 2
[ProgressSteps] Rendering with currentStep: 2
[WorkflowCanvas] Step change detected: persona_discovery
[WorkflowCanvas] Moving past problem input, updating canvas...
[WorkflowCanvas] Entering persona discovery, adjusting canvas view...
[CoreProblemNode] Triggering persona generation
[workflowStore] generatePersonas called
[workflowStore] generatePersonas state check: {hasCoreProblem: true, hasProjectId: true, ...}
[workflowStore] generatePersonas proceeding with generation...
[workflowStore] Calling problemApi.generatePersonas with: {...}
[problemApi] Generating personas with edge function
[problemApi] Personas response status: 200
[workflowStore] problemApi.generatePersonas response: [...]
[workflowStore] Personas generated: 3
```

## Common Issues to Check:

1. **Validation fails** - Check edge function logs
2. **Step doesn't advance** - Check `canProceedToNextStep()` logic
3. **Gold styling missing** - Check CSS classes and state
4. **Personas not generated** - Check API call and error handling
5. **Canvas doesn't adjust** - Check step transition effects 
# Presocio Pseudocode Documentation (Extended)

This document provides implementation-oriented pseudocode for Presocio.
It captures **application flow**, **data movement**, **state transitions**, **error handling**,
**fallback behavior**, and **integration boundaries**.

> Audience: contributors, architects, and QA engineers who need a shared logical model.

---

## Table of Contents

1. [System-Wide Control Flow](#1-system-wide-control-flow)
2. [Domain Model (Conceptual Types)](#2-domain-model-conceptual-types)
3. [UI Bootstrapping + Hydration](#3-ui-bootstrapping--hydration)
4. [Workflow Stage Engine](#4-workflow-stage-engine)
5. [Input Stage](#5-input-stage)
6. [Planning Stage](#6-planning-stage)
7. [Generation Stage](#7-generation-stage)
8. [Approval Stage](#8-approval-stage)
9. [Scheduling Stage](#9-scheduling-stage)
10. [Posting Stage](#10-posting-stage)
11. [API Route Pseudocode](#11-api-route-pseudocode)
12. [AI Service Layer + Fallback Strategy](#12-ai-service-layer--fallback-strategy)
13. [Social Publishing Service Layer](#13-social-publishing-service-layer)
14. [Platform Constraint Enforcement](#14-platform-constraint-enforcement)
15. [Engagement Scoring + Heuristics](#15-engagement-scoring--heuristics)
16. [Scheduling Optimization Logic](#16-scheduling-optimization-logic)
17. [Zustand Store Lifecycle](#17-zustand-store-lifecycle)
18. [Error Taxonomy + Recovery Rules](#18-error-taxonomy--recovery-rules)
19. [Observability + Metrics](#19-observability--metrics)
20. [Testing Pseudocode Matrix](#20-testing-pseudocode-matrix)
21. [Security + Data Handling](#21-security--data-handling)
22. [End-to-End Sequence Example](#22-end-to-end-sequence-example)
23. [Future Extensions](#23-future-extensions)

---

## 1) System-Wide Control Flow

```text
FUNCTION runPresocioApp()
  appContext = initializeAppContext()
  bootResult = bootstrapClient(appContext)

  IF bootResult.status == "FAILED"
    renderFatalErrorScreen(bootResult.reason)
    RETURN
  ENDIF

  workflowState = restorePersistedWorkflowOrDefault()

  LOOP WHILE appContext.sessionActive == TRUE
    renderGlobalShell(
      topNav,
      dashboardPanels,
      workflowStepper(workflowState.currentStage),
      stageComponentFor(workflowState.currentStage)
    )

    stageResult = executeCurrentStage(workflowState)

    IF stageResult.transition == "NEXT"
      workflowState.currentStage = nextStage(workflowState.currentStage)
    ELSE IF stageResult.transition == "PREVIOUS"
      workflowState.currentStage = previousStage(workflowState.currentStage)
    ELSE IF stageResult.transition == "RESET"
      workflowState = defaultWorkflowState()
    ELSE
      NO_OP
    ENDIF

    persistWorkflowState(workflowState)
    syncDashboardCounters(workflowState)
  ENDLOOP

  teardownSessionResources(appContext)
END FUNCTION
```

---

## 2) Domain Model (Conceptual Types)

```text
TYPE Platform = "instagram" | "facebook" | "linkedin" | "youtube" | "x"
TYPE WorkflowStage = "input" | "planning" | "generation" | "approval" | "scheduling" | "posting"
TYPE PostStatus = "draft" | "needs_review" | "approved" | "scheduled" | "published" | "failed"

TYPE CampaignBrief {
  id: string
  campaignName: string
  objective: string
  targetAudience: string
  brandVoice: string
  keyMessage: string
  callToAction: string
  selectedPlatforms: Platform[]
  startDate: datetime?
  endDate: datetime?
  constraints: ConstraintSet
}

TYPE ConstraintSet {
  forbiddenWords: string[]
  mandatoryHashtags: string[]
  complianceNotes: string[]
  regionalRestrictions: string[]
}

TYPE PlanItem {
  id: string
  platform: Platform
  publishDate: datetime
  contentTheme: string
  objectiveTag: string
  priority: integer
}

TYPE GeneratedPost {
  id: string
  planItemId: string
  platform: Platform
  caption: string
  hashtags: string[]
  mediaPrompt: string
  status: PostStatus
  engagementScore: number
  warningFlags: string[]
}

TYPE ScheduledPost {
  postId: string
  platform: Platform
  scheduledAt: datetime
  timezone: string
  confidence: number
}

TYPE PublishResult {
  postId: string
  platform: Platform
  status: "queued" | "published" | "failed"
  externalId: string?
  errorCode: string?
  errorMessage: string?
}
```

---

## 3) UI Bootstrapping + Hydration

```text
FUNCTION bootstrapClient(appContext)
  VERIFY runtimeEnvironmentSupportsLocalStorage()
  VERIFY essentialFeatureFlagsLoaded()
  VERIFY requiredClientConfigLoaded()

  IF anyVerificationFails
    RETURN { status: "FAILED", reason: "CLIENT_BOOT_FAILURE" }
  ENDIF

  mountReactRoot()
  initializeThemeFromPreferences()
  initializeToastSystem()
  initializeMotionReducedPreference()

  RETURN { status: "OK" }
END FUNCTION
```

```text
FUNCTION restorePersistedWorkflowOrDefault()
  rawState = localStorage.get("presocio-workflow")

  IF rawState == null
    RETURN defaultWorkflowState()
  ENDIF

  parsed = safelyParseJSON(rawState)

  IF parsed is invalid
    RETURN defaultWorkflowState()
  ENDIF

  IF parsed.version != CURRENT_WORKFLOW_SCHEMA_VERSION
    migrated = migrateWorkflowState(parsed)
    IF migrated.failed
      RETURN defaultWorkflowState()
    ELSE
      RETURN migrated.state
    ENDIF
  ENDIF

  RETURN parsed
END FUNCTION
```

---

## 4) Workflow Stage Engine

```text
FUNCTION executeCurrentStage(workflowState)
  SWITCH workflowState.currentStage
    CASE "input":
      RETURN runInputStage(workflowState)

    CASE "planning":
      RETURN runPlanningStage(workflowState)

    CASE "generation":
      RETURN runGenerationStage(workflowState)

    CASE "approval":
      RETURN runApprovalStage(workflowState)

    CASE "scheduling":
      RETURN runSchedulingStage(workflowState)

    CASE "posting":
      RETURN runPostingStage(workflowState)

    DEFAULT:
      RETURN { transition: "RESET", reason: "UNKNOWN_STAGE" }
  ENDSWITCH
END FUNCTION
```

```text
FUNCTION nextStage(stage)
  ORDER = ["input", "planning", "generation", "approval", "scheduling", "posting"]
  index = findIndex(ORDER, stage)

  IF index == -1 OR index == ORDER.length - 1
    RETURN "posting"
  ENDIF

  RETURN ORDER[index + 1]
END FUNCTION
```

```text
FUNCTION previousStage(stage)
  ORDER = ["input", "planning", "generation", "approval", "scheduling", "posting"]
  index = findIndex(ORDER, stage)

  IF index <= 0
    RETURN "input"
  ENDIF

  RETURN ORDER[index - 1]
END FUNCTION
```

---

## 5) Input Stage

```text
FUNCTION runInputStage(workflowState)
  formState = createCampaignBriefForm(workflowState.campaignBrief)

  ON userUpdatesField(fieldName, value):
    formState[fieldName] = value
    clearFieldError(fieldName)

  ON userSubmitsForm:
    validation = validateCampaignBrief(formState)

    IF validation.hasErrors
      showValidationErrors(validation.errors)
      RETURN { transition: "STAY" }
    ENDIF

    normalizedBrief = normalizeCampaignBrief(formState)
    workflowState.campaignBrief = normalizedBrief

    RETURN { transition: "NEXT" }
END FUNCTION
```

```text
FUNCTION validateCampaignBrief(brief)
  errors = []

  REQUIRE brief.campaignName NOT EMPTY
  REQUIRE brief.objective NOT EMPTY
  REQUIRE brief.targetAudience NOT EMPTY
  REQUIRE brief.brandVoice NOT EMPTY
  REQUIRE brief.selectedPlatforms.length >= 1

  IF brief.startDate AND brief.endDate
    REQUIRE brief.startDate <= brief.endDate
  ENDIF

  IF brief.callToAction TOO_LONG
    errors.push("CTA exceeds guideline length")
  ENDIF

  RETURN { hasErrors: errors.length > 0, errors }
END FUNCTION
```

---

## 6) Planning Stage

```text
FUNCTION runPlanningStage(workflowState)
  showStageLoading("Creating strategic content plan...")

  planningPayload = {
    campaignBrief: workflowState.campaignBrief,
    planningHorizon: inferPlanningWindow(workflowState.campaignBrief),
    platformMix: workflowState.campaignBrief.selectedPlatforms
  }

  response = callPlanningProvider(planningPayload)

  IF response.success == TRUE
    plan = normalizePlanItems(response.planItems)
    workflowState.planItems = plan
    hideStageLoading()
    RETURN { transition: "NEXT" }
  ENDIF

  fallbackPlan = createFallbackPlan(workflowState.campaignBrief)
  workflowState.planItems = fallbackPlan
  showWarning("AI planning unavailable. Fallback plan applied.")
  hideStageLoading()

  RETURN { transition: "NEXT", notes: ["FALLBACK_PLAN_USED"] }
END FUNCTION
```

```text
FUNCTION normalizePlanItems(rawPlanItems)
  normalized = []

  FOR EACH item IN rawPlanItems
    normalizedItem = {
      id: item.id OR generateId("plan"),
      platform: normalizePlatform(item.platform),
      publishDate: normalizeDate(item.publishDate),
      contentTheme: trim(item.contentTheme),
      objectiveTag: item.objectiveTag OR "awareness",
      priority: clamp(item.priority, 1, 5)
    }

    normalized.push(normalizedItem)
  ENDFOR

  RETURN sortBy(normalized, ["publishDate", "priority DESC"])
END FUNCTION
```

---

## 7) Generation Stage

```text
FUNCTION runGenerationStage(workflowState)
  generated = []
  failures = []

  FOR EACH planItem IN workflowState.planItems
    draftResponse = generateDraftForPlanItem(
      workflowState.campaignBrief,
      planItem
    )

    IF draftResponse.success
      constrainedDraft = enforcePlatformConstraints(
        draftResponse.post,
        planItem.platform
      )

      scoredDraft = attachEngagementScore(constrainedDraft)
      generated.push(scoredDraft)
    ELSE
      fallbackDraft = createFallbackDraft(workflowState.campaignBrief, planItem)
      generated.push(fallbackDraft)
      failures.push({ planItemId: planItem.id, reason: draftResponse.error })
    ENDIF
  ENDFOR

  workflowState.generatedPosts = generated

  IF failures.length > 0
    showWarning("Some drafts used fallback generation.")
    trackEvent("generation.partial_failure", { failuresCount: failures.length })
  ENDIF

  RETURN { transition: "NEXT" }
END FUNCTION
```

```text
FUNCTION generateDraftForPlanItem(campaignBrief, planItem)
  prompt = buildGenerationPrompt(campaignBrief, planItem)
  aiResult = AI.generateContentWithFallback(prompt)

  IF aiResult.success == FALSE
    RETURN { success: FALSE, error: aiResult.error }
  ENDIF

  post = {
    id: generateId("post"),
    planItemId: planItem.id,
    platform: planItem.platform,
    caption: aiResult.caption,
    hashtags: aiResult.hashtags,
    mediaPrompt: aiResult.mediaPrompt,
    status: "needs_review",
    engagementScore: 0,
    warningFlags: []
  }

  RETURN { success: TRUE, post }
END FUNCTION
```

---

## 8) Approval Stage

```text
FUNCTION runApprovalStage(workflowState)
  approved = []
  rejected = []

  FOR EACH post IN workflowState.generatedPosts
    renderedCard = renderApprovalCard(post)
    action = waitForReviewerAction(renderedCard)

    SWITCH action.type
      CASE "APPROVE":
        post.status = "approved"
        approved.push(post)

      CASE "EDIT_AND_APPROVE":
        edited = applyReviewerEdits(post, action.edits)
        edited = enforcePlatformConstraints(edited, edited.platform)
        edited.engagementScore = calculateEngagementScore(edited)
        edited.status = "approved"
        approved.push(edited)

      CASE "REJECT":
        post.status = "failed"
        rejected.push(post)

      CASE "REQUEST_REGENERATION":
        regenerated = regenerateSinglePost(workflowState.campaignBrief, post)
        IF regenerated.success
          regenerated.post.status = "approved"
          approved.push(regenerated.post)
        ELSE
          post.warningFlags.push("regen_failed")
          rejected.push(post)
        ENDIF
    ENDSWITCH
  ENDFOR

  workflowState.approvedPosts = approved
  workflowState.rejectedPosts = rejected

  IF approved.length == 0
    showError("No approved posts. Please revise drafts.")
    RETURN { transition: "STAY" }
  ENDIF

  RETURN { transition: "NEXT" }
END FUNCTION
```

---

## 9) Scheduling Stage

```text
FUNCTION runSchedulingStage(workflowState)
  scheduled = []

  FOR EACH post IN workflowState.approvedPosts
    recommendation = getScheduleRecommendation(post, workflowState.campaignBrief)

    IF recommendation.success
      selectedSlot = presentSlotsAndCaptureChoice(
        post,
        recommendation.slots,
        recommendation.defaultSlot
      )
    ELSE
      selectedSlot = generateFallbackSlot(post.platform)
      showWarning("Schedule fallback applied for " + post.id)
    ENDIF

    scheduled.push({
      postId: post.id,
      platform: post.platform,
      scheduledAt: selectedSlot.datetime,
      timezone: selectedSlot.timezone,
      confidence: selectedSlot.confidence
    })
  ENDFOR

  workflowState.scheduledPosts = scheduled

  RETURN { transition: "NEXT" }
END FUNCTION
```

```text
FUNCTION getScheduleRecommendation(post, campaignBrief)
  payload = {
    platform: post.platform,
    audienceProfile: campaignBrief.targetAudience,
    objective: campaignBrief.objective,
    timezoneHint: inferPrimaryTimezone(campaignBrief),
    contentType: classifyContentType(post)
  }

  response = API.post("/api/schedule", payload)

  IF response.ok
    RETURN {
      success: TRUE,
      slots: response.data.slots,
      defaultSlot: response.data.defaultSlot
    }
  ENDIF

  RETURN { success: FALSE, error: response.error }
END FUNCTION
```

---

## 10) Posting Stage

```text
FUNCTION runPostingStage(workflowState)
  results = []

  FOR EACH scheduled IN workflowState.scheduledPosts
    post = findPostById(workflowState.approvedPosts, scheduled.postId)

    payload = {
      action: "publish",
      platform: scheduled.platform,
      content: post.caption,
      hashtags: post.hashtags,
      mediaPrompt: post.mediaPrompt,
      scheduledAt: scheduled.scheduledAt,
      timezone: scheduled.timezone
    }

    publishResponse = API.post("/api/social", payload)

    IF publishResponse.ok
      result = {
        postId: scheduled.postId,
        platform: scheduled.platform,
        status: publishResponse.data.isImmediate ? "published" : "queued",
        externalId: publishResponse.data.externalId
      }
    ELSE
      result = {
        postId: scheduled.postId,
        platform: scheduled.platform,
        status: "failed",
        errorCode: publishResponse.error.code,
        errorMessage: publishResponse.error.message
      }
    ENDIF

    results.push(result)
  ENDFOR

  workflowState.publishResults = results
  renderPublishSummary(results)

  IF countFailures(results) > 0
    enableRetryForFailedPosts(results)
  ENDIF

  RETURN { transition: "STAY" }
END FUNCTION
```

```text
FUNCTION enableRetryForFailedPosts(results)
  failed = filter(results, r => r.status == "failed")

  ON userClicksRetry:
    FOR EACH failedResult IN failed
      retryOutcome = retryPublishWithBackoff(failedResult.postId)
      updateResultInUI(failedResult.postId, retryOutcome)
    ENDFOR
END FUNCTION
```

---

## 11) API Route Pseudocode

### 11.1 `/api/generate` Route

```text
FUNCTION POST /api/generate(request)
  TRY
    body = parseJSON(request)
    validateGeneratePayload(body)

    serviceResponse = AI.generateContentWithFallback(body)

    RETURN JSON(200, {
      success: TRUE,
      generatedDraft: serviceResponse
    })
  CATCH ValidationError AS e
    RETURN JSON(400, { success: FALSE, error: e.message })
  CATCH AnyError AS e
    logServerError("generate.route", e)
    RETURN JSON(500, { success: FALSE, error: "Internal server error" })
  ENDTRY
END FUNCTION
```

### 11.2 `/api/schedule` Route

```text
FUNCTION POST /api/schedule(request)
  TRY
    body = parseJSON(request)
    validateSchedulePayload(body)

    recommendation = SchedulingEngine.recommend(body)

    RETURN JSON(200, {
      success: TRUE,
      slots: recommendation.slots,
      defaultSlot: recommendation.defaultSlot
    })
  CATCH ValidationError AS e
    RETURN JSON(400, { success: FALSE, error: e.message })
  CATCH AnyError AS e
    logServerError("schedule.route", e)
    RETURN JSON(500, { success: FALSE, error: "Internal server error" })
  ENDTRY
END FUNCTION
```

### 11.3 `/api/engage` Route

```text
FUNCTION POST /api/engage(request)
  TRY
    body = parseJSON(request)
    validateEngagementPayload(body)

    score = EngagementEngine.score(body)

    RETURN JSON(200, {
      success: TRUE,
      engagementScore: score.value,
      breakdown: score.breakdown,
      suggestions: score.suggestions
    })
  CATCH ValidationError AS e
    RETURN JSON(400, { success: FALSE, error: e.message })
  CATCH AnyError AS e
    logServerError("engage.route", e)
    RETURN JSON(500, { success: FALSE, error: "Internal server error" })
  ENDTRY
END FUNCTION
```

### 11.4 `/api/social` Route

```text
FUNCTION POST /api/social(request)
  TRY
    body = parseJSON(request)
    validateSocialPayload(body)

    action = body.action

    SWITCH action
      CASE "publish":
        result = SocialService.publish(body)
        RETURN JSON(200, { success: TRUE, data: result })

      CASE "accounts":
        result = SocialService.listConnectedAccounts(body)
        RETURN JSON(200, { success: TRUE, data: result })

      CASE "connect":
        result = SocialService.createConnectLink(body)
        RETURN JSON(200, { success: TRUE, data: result })

      DEFAULT:
        RETURN JSON(400, { success: FALSE, error: "Unsupported action" })
    ENDSWITCH
  CATCH ValidationError AS e
    RETURN JSON(400, { success: FALSE, error: e.message })
  CATCH AnyError AS e
    logServerError("social.route", e)
    RETURN JSON(500, { success: FALSE, error: "Internal server error" })
  ENDTRY
END FUNCTION
```

---

## 12) AI Service Layer + Fallback Strategy

```text
FUNCTION AI.generateContentWithFallback(promptData)
  apiKey = Env.get("GEMINI_API_KEY")

  IF apiKey is empty
    RETURN mockGenerate(promptData, reason="MISSING_API_KEY")
  ENDIF

  attempt = 0
  maxAttempts = 2

  WHILE attempt < maxAttempts
    attempt = attempt + 1

    TRY
      raw = GeminiClient.generate(promptData, apiKey)
      normalized = normalizeAiOutput(raw)
      IF normalized.valid
        RETURN { success: TRUE, ...normalized }
      ELSE
        IF attempt == maxAttempts
          RETURN mockGenerate(promptData, reason="INVALID_AI_SHAPE")
        ENDIF
      ENDIF
    CATCH RateLimitError
      IF attempt == maxAttempts
        RETURN mockGenerate(promptData, reason="RATE_LIMIT")
      ENDIF
      sleep(exponentialBackoff(attempt))
    CATCH TimeoutError
      IF attempt == maxAttempts
        RETURN mockGenerate(promptData, reason="TIMEOUT")
      ENDIF
    CATCH AnyError
      RETURN mockGenerate(promptData, reason="GENERIC_AI_ERROR")
    ENDTRY
  ENDWHILE
END FUNCTION
```

```text
FUNCTION mockGenerate(promptData, reason)
  deterministicSeed = hash(promptData.campaignName + promptData.platform)

  caption = composeMockCaption(promptData, deterministicSeed)
  hashtags = composeMockHashtags(promptData, deterministicSeed)
  mediaPrompt = composeMockMediaPrompt(promptData)

  RETURN {
    success: TRUE,
    source: "mock",
    reason: reason,
    caption: caption,
    hashtags: hashtags,
    mediaPrompt: mediaPrompt
  }
END FUNCTION
```

---

## 13) Social Publishing Service Layer

```text
FUNCTION SocialService.publish(payload)
  apiKey = Env.get("ZERNIO_API_KEY")

  IF apiKey missing
    RETURN simulatePublish(payload, reason="MISSING_ZERNIO_KEY")
  ENDIF

  mappedPayload = mapInternalPostToProviderPayload(payload)

  TRY
    providerResponse = ZernioClient.publish(mappedPayload, apiKey)

    RETURN {
      externalId: providerResponse.id,
      status: providerResponse.status,
      scheduledFor: providerResponse.scheduledFor
    }
  CATCH ProviderAuthError
    THROW createAppError("SOCIAL_AUTH_FAILED", "Provider authentication failed")
  CATCH ProviderValidationError
    THROW createAppError("SOCIAL_VALIDATION_FAILED", "Invalid publish payload")
  CATCH ProviderRateLimitError
    THROW createAppError("SOCIAL_RATE_LIMIT", "Publishing rate limit exceeded")
  CATCH AnyError
    THROW createAppError("SOCIAL_UNKNOWN", "Unexpected social provider error")
  ENDTRY
END FUNCTION
```

```text
FUNCTION simulatePublish(payload, reason)
  syntheticId = "sim_" + randomUUID()

  RETURN {
    externalId: syntheticId,
    status: payload.scheduledAt ? "queued" : "published",
    scheduledFor: payload.scheduledAt,
    simulated: TRUE,
    reason: reason
  }
END FUNCTION
```

---

## 14) Platform Constraint Enforcement

```text
CONSTANT PLATFORM_LIMITS = {
  instagram: { captionLimit: 2200, maxHashtags: 30 },
  facebook:  { captionLimit: 63206, maxHashtags: 30 },
  linkedin:  { captionLimit: 3000, maxHashtags: 5 },
  youtube:   { captionLimit: 5000, hashtagChars: 500 },
  x:         { captionLimit: 280, maxHashtags: 30 }
}
```

```text
FUNCTION enforcePlatformConstraints(post, platform)
  rules = PLATFORM_LIMITS[platform]

  constrainedCaption = truncateSmart(post.caption, rules.captionLimit)
  constrainedHashtags = capHashtagCount(post.hashtags, rules.maxHashtags)

  IF platform == "youtube"
    constrainedHashtags = capTotalHashtagCharacters(constrainedHashtags, 500)
  ENDIF

  IF platform == "x"
    combinedLength = length(constrainedCaption + " " + join(constrainedHashtags, " "))
    IF combinedLength > 280
      constrainedHashtags = reduceHashtagsUntilFit(constrainedCaption, constrainedHashtags, 280)
    ENDIF
  ENDIF

  warnings = []

  IF constrainedCaption != post.caption
    warnings.push("caption_truncated")
  ENDIF

  IF constrainedHashtags.length != post.hashtags.length
    warnings.push("hashtags_reduced")
  ENDIF

  RETURN {
    ...post,
    caption: constrainedCaption,
    hashtags: constrainedHashtags,
    warningFlags: mergeUnique(post.warningFlags, warnings)
  }
END FUNCTION
```

---

## 15) Engagement Scoring + Heuristics

```text
FUNCTION calculateEngagementScore(post)
  score = 0

  hookQuality = evaluateHookStrength(post.caption)
  ctaQuality = evaluateCallToAction(post.caption)
  readability = evaluateReadability(post.caption)
  hashtagRelevance = evaluateHashtagRelevance(post.hashtags, post.caption)
  platformFit = evaluatePlatformFit(post)

  score = score + weight("hook") * hookQuality
  score = score + weight("cta") * ctaQuality
  score = score + weight("readability") * readability
  score = score + weight("hashtags") * hashtagRelevance
  score = score + weight("platformFit") * platformFit

  score = normalizeToRange(score, 0, 100)

  RETURN round(score)
END FUNCTION
```

```text
FUNCTION attachEngagementScore(post)
  post.engagementScore = calculateEngagementScore(post)

  IF post.engagementScore < 45
    post.warningFlags.push("low_engagement_predicted")
  ENDIF

  RETURN post
END FUNCTION
```

---

## 16) Scheduling Optimization Logic

```text
FUNCTION SchedulingEngine.recommend(input)
  candidateSlots = buildCandidateSlots(input.platform, input.timezoneHint)

  scoredSlots = []

  FOR EACH slot IN candidateSlots
    historicalWeight = getHistoricalPerformanceWeight(input.platform, slot.dayOfWeek, slot.hour)
    audienceWeight = estimateAudienceAvailability(input.audienceProfile, slot)
    objectiveWeight = objectiveAlignment(input.objective, slot)
    recencyPenalty = applyRecencyPenalty(slot)

    totalScore = weightedSum([
      historicalWeight,
      audienceWeight,
      objectiveWeight,
      recencyPenalty
    ])

    scoredSlots.push({
      datetime: slot.datetime,
      timezone: slot.timezone,
      score: totalScore,
      confidence: deriveConfidence(totalScore)
    })
  ENDFOR

  sorted = sortDesc(scoredSlots, by="score")

  RETURN {
    slots: topN(sorted, 5),
    defaultSlot: first(sorted)
  }
END FUNCTION
```

---

## 17) Zustand Store Lifecycle

```text
STORE useWorkflowStore
  STATE:
    currentStage: WorkflowStage
    campaignBrief: CampaignBrief
    planItems: PlanItem[]
    generatedPosts: GeneratedPost[]
    approvedPosts: GeneratedPost[]
    rejectedPosts: GeneratedPost[]
    scheduledPosts: ScheduledPost[]
    publishResults: PublishResult[]
    uiFlags: {
      isLoading: boolean
      activeModal: string?
      toastQueue: Toast[]
    }

  ACTION setCurrentStage(stage):
    state.currentStage = stage

  ACTION setCampaignBrief(brief):
    state.campaignBrief = brief

  ACTION setPlanItems(items):
    state.planItems = items

  ACTION setGeneratedPosts(posts):
    state.generatedPosts = posts

  ACTION setApprovedPosts(posts):
    state.approvedPosts = posts

  ACTION setScheduledPosts(posts):
    state.scheduledPosts = posts

  ACTION setPublishResults(results):
    state.publishResults = results

  ACTION setLoading(isLoading):
    state.uiFlags.isLoading = isLoading

  ACTION enqueueToast(toast):
    state.uiFlags.toastQueue.push(toast)

  ACTION resetWorkflow():
    state.currentStage = "input"
    state.campaignBrief = defaultCampaignBrief()
    state.planItems = []
    state.generatedPosts = []
    state.approvedPosts = []
    state.rejectedPosts = []
    state.scheduledPosts = []
    state.publishResults = []

  PERSIST:
    key = "presocio-workflow"
    version = CURRENT_WORKFLOW_SCHEMA_VERSION
    partialize = {
      currentStage,
      campaignBrief,
      planItems,
      generatedPosts,
      approvedPosts,
      scheduledPosts
    }
END STORE
```

---

## 18) Error Taxonomy + Recovery Rules

```text
ERROR_CATEGORIES = {
  "VALIDATION_ERROR":  { severity: "user", recoverable: TRUE },
  "NETWORK_ERROR":     { severity: "transient", recoverable: TRUE },
  "RATE_LIMIT":        { severity: "transient", recoverable: TRUE },
  "AUTH_ERROR":        { severity: "configuration", recoverable: CONDITIONAL },
  "PROVIDER_ERROR":    { severity: "external", recoverable: CONDITIONAL },
  "INTERNAL_ERROR":    { severity: "system", recoverable: FALSE }
}
```

```text
FUNCTION handleError(error, context)
  category = categorize(error)

  SWITCH category
    CASE "VALIDATION_ERROR":
      showInlineError(context.field, error.message)
      RETURN

    CASE "NETWORK_ERROR":
      showToast("Network issue detected. Retrying...")
      maybeRetry(context.action)
      RETURN

    CASE "RATE_LIMIT":
      showToast("Rate limited. Please wait a moment.")
      scheduleRetry(context.action, in=30s)
      RETURN

    CASE "AUTH_ERROR":
      showToast("Authentication required. Verify API credentials.")
      linkToSettings()
      RETURN

    CASE "PROVIDER_ERROR":
      showToast("External provider issue. Using fallback where possible.")
      activateFallbackMode(context)
      RETURN

    CASE "INTERNAL_ERROR":
      showFatalBanner("Unexpected error occurred.")
      captureErrorForDiagnostics(error, context)
      RETURN
  ENDSWITCH
END FUNCTION
```

---

## 19) Observability + Metrics

```text
FUNCTION trackEvent(name, data)
  event = {
    name: name,
    timestamp: nowUTC(),
    sessionId: getSessionId(),
    workflowStage: getCurrentStage(),
    data: scrubPII(data)
  }

  enqueueTelemetry(event)
END FUNCTION
```

```text
FUNCTION recordStageTiming(stage, startedAt, endedAt)
  durationMs = endedAt - startedAt
  trackEvent("stage.duration", {
    stage: stage,
    durationMs: durationMs
  })
END FUNCTION
```

```text
FUNCTION captureErrorForDiagnostics(error, context)
  report = {
    code: error.code,
    message: sanitize(error.message),
    stage: getCurrentStage(),
    context: redactSensitiveFields(context),
    stack: trimStack(error.stack)
  }

  sendToLoggingBackend(report)
END FUNCTION
```

---

## 20) Testing Pseudocode Matrix

### 20.1 Unit Tests

```text
TEST "validateCampaignBrief rejects empty required fields"
  brief = defaultCampaignBrief()
  brief.campaignName = ""

  result = validateCampaignBrief(brief)

  EXPECT result.hasErrors == TRUE
  EXPECT includes(result.errors, "campaignName")
END TEST
```

```text
TEST "enforcePlatformConstraints truncates X content over 280 chars"
  post = buildPost(platform="x", longCaption=TRUE, manyHashtags=TRUE)

  constrained = enforcePlatformConstraints(post, "x")

  EXPECT length(constrained.caption + " " + join(constrained.hashtags, " ")) <= 280
  EXPECT includes(constrained.warningFlags, "caption_truncated") OR includes(constrained.warningFlags, "hashtags_reduced")
END TEST
```

### 20.2 Integration Tests

```text
TEST "generation stage falls back when AI unavailable"
  mock AI.generateContentWithFallback TO return { success: TRUE, source: "mock" }

  result = runGenerationStage(stateWithOnePlanItem())

  EXPECT result.transition == "NEXT"
  EXPECT state.generatedPosts.length == 1
END TEST
```

```text
TEST "posting stage records failed results when provider rejects publish"
  mock API.post("/api/social") TO return error(code="SOCIAL_VALIDATION_FAILED")

  result = runPostingStage(stateWithOneScheduledPost())

  EXPECT state.publishResults[0].status == "failed"
  EXPECT result.transition == "STAY"
END TEST
```

### 20.3 E2E Tests

```text
TEST "happy path from input to posting"
  openApp()
  fillCampaignBrief(validData)
  submitInput()

  approveGeneratedPlan()
  approveGeneratedPosts()
  chooseScheduleSlots()
  triggerPublish()

  EXPECT visible("Publishing summary")
  EXPECT atLeastOneResultStatusIn(["queued", "published"])
END TEST
```

---

## 21) Security + Data Handling

```text
FUNCTION scrubPII(data)
  redacted = clone(data)

  redacted.email = hashOrRemove(redacted.email)
  redacted.phone = remove(redacted.phone)
  redacted.accessToken = remove(redacted.accessToken)
  redacted.apiKey = remove(redacted.apiKey)

  RETURN redacted
END FUNCTION
```

```text
FUNCTION validateInboundRequest(request)
  REQUIRE request.method IN ["POST"]
  REQUIRE request.headers["content-type"] == "application/json"
  REQUIRE request.body.size < MAX_PAYLOAD_BYTES

  parsed = safeJsonParse(request.body)
  REQUIRE parsed.valid == TRUE

  RETURN parsed.value
END FUNCTION
```

```text
FUNCTION protectSecretsAtRuntime()
  NEVER log raw environment variables
  NEVER expose provider tokens in client bundles
  NEVER include secrets in toast errors
  ALWAYS sanitize outbound diagnostics
END FUNCTION
```

---

## 22) End-to-End Sequence Example

```text
SEQUENCE "Campaign launch with partial fallback"
  USER submits campaign brief for Instagram + LinkedIn
  SYSTEM validates and stores brief

  SYSTEM calls planning provider
  PROVIDER returns plan items for 7 days
  SYSTEM stores plan

  SYSTEM generates drafts
  AI returns 6 successful drafts, 1 timeout
  SYSTEM creates 1 fallback draft

  USER edits 2 drafts and approves all 7

  SYSTEM requests schedule recommendations
  SCHEDULE API fails for LinkedIn item
  SYSTEM applies fallback slot for that item

  SYSTEM sends all 7 posts to social route
  PROVIDER queues 6 posts, rejects 1 due to validation

  SYSTEM surfaces summary:
    - queued: 6
    - failed: 1
  USER retries failed post after fixing caption
END SEQUENCE
```

---

## 23) Future Extensions

```text
IDEA: Multi-workspace support
  - Add workspaceId to all domain objects
  - Partition persisted state by workspace key
  - Add workspace-level RBAC checks

IDEA: Approval workflows with roles
  - Add requiredApprovals count
  - Add reviewer identity + timestamps
  - Gate scheduling transition until quorum met

IDEA: Asset pipeline integration
  - Support media asset upload references
  - Attach asset readiness checks before publish

IDEA: Experimentation mode
  - Generate multiple caption variants per plan item
  - Schedule A/B variants to non-overlapping audience windows
```

---

### Practical Notes

- This pseudocode is intentionally technology-agnostic but mapped to Presocio’s current architecture.
- Actual implementation details (API DTOs, exact store slices, and component names) may evolve.
- If logic diverges from source code, prioritize source code and update this document.

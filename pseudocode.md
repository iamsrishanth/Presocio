# Presocio Pseudocode Documentation

This document provides high-level pseudocode for the major workflows in Presocio.
It is intended as implementation-oriented documentation for contributors.

## 1) End-to-End Workflow Orchestration

```text
FUNCTION runPresocioWorkflow()
  LOAD persistedWorkflowState FROM localStorage

  IF persistedWorkflowState EXISTS
    SET currentStage = persistedWorkflowState.currentStage
    SET campaignData = persistedWorkflowState.campaignData
  ELSE
    SET currentStage = INPUT
    SET campaignData = emptyCampaignData()
  ENDIF

  WHILE applicationIsOpen
    RENDER dashboard, workflowStepper, and currentStageComponent

    SWITCH currentStage
      CASE INPUT:
        campaignData = executeInputStage(campaignData)
        IF campaignDataIsValid(campaignData)
          currentStage = PLANNING
        ENDIF

      CASE PLANNING:
        contentPlan = executePlanningStage(campaignData)
        IF userApprovesPlan(contentPlan)
          currentStage = GENERATION
        ELSE IF userRequestsEdits()
          contentPlan = editPlan(contentPlan)
        ENDIF

      CASE GENERATION:
        generatedPosts = executeGenerationStage(campaignData, contentPlan)
        IF generatedPosts NOT EMPTY
          currentStage = APPROVAL
        ENDIF

      CASE APPROVAL:
        approvedPosts = executeApprovalStage(generatedPosts)
        IF hasApprovedPosts(approvedPosts)
          currentStage = SCHEDULING
        ENDIF

      CASE SCHEDULING:
        scheduledPosts = executeSchedulingStage(approvedPosts)
        IF scheduleIsConfirmed(scheduledPosts)
          currentStage = POSTING
        ENDIF

      CASE POSTING:
        publishResults = executePostingStage(scheduledPosts)
        DISPLAY publishResults
        IF userStartsNewCampaign()
          RESET workflow state
          currentStage = INPUT
        ENDIF
    ENDSWITCH

    PERSIST { currentStage, campaignData, contentPlan, generatedPosts } TO localStorage
  ENDWHILE
END FUNCTION
```

---

## 2) Input Stage (Campaign Brief Collection)

```text
FUNCTION executeInputStage(previousCampaignData)
  DISPLAY form fields:
    - campaign goal
    - target audience
    - tone / brand voice
    - platforms
    - optional constraints

  WAIT for user input changes

  ON submit:
    VALIDATE required fields
    IF validation fails
      SHOW inline validation errors
      RETURN previousCampaignData
    ENDIF

    NORMALIZE form values
    RETURN mergedCampaignData(previousCampaignData, normalizedValues)
END FUNCTION
```

---

## 3) Planning Stage (Content Plan Generation)

```text
FUNCTION executePlanningStage(campaignData)
  SHOW loading state "Generating content plan..."

  REQUEST /api/generatePlan (or equivalent planning routine)
    WITH payload campaignData

  IF apiCallSucceeded
    plan = parsePlanFromResponse(response)
    DISPLAY calendar-style plan grouped by date/platform/theme
    RETURN plan
  ELSE
    fallbackPlan = createMockPlan(campaignData)
    SHOW warning "Using fallback planning data"
    DISPLAY fallbackPlan
    RETURN fallbackPlan
  ENDIF
END FUNCTION
```

---

## 4) Generation Stage (AI Content Drafting)

```text
FUNCTION executeGenerationStage(campaignData, contentPlan)
  INIT generatedPosts = []

  FOR EACH planItem IN contentPlan.items
    requestPayload = {
      campaignContext: campaignData,
      planItem: planItem,
      platformRules: getPlatformRules(planItem.platform)
    }

    RESPONSE = POST /api/generate WITH requestPayload

    IF RESPONSE.success
      draft = RESPONSE.generatedDraft
      draft = enforcePlatformConstraints(draft, planItem.platform)
      ADD draft TO generatedPosts
    ELSE
      mockDraft = createMockDraft(planItem)
      ADD mockDraft TO generatedPosts
      LOG warning "Generation failed for planItem, mock used"
    ENDIF
  ENDFOR

  RETURN generatedPosts
END FUNCTION
```

---

## 5) Approval Stage (Review + Inline Editing)

```text
FUNCTION executeApprovalStage(generatedPosts)
  INIT approvedPosts = []

  FOR EACH post IN generatedPosts
    DISPLAY post with editable fields:
      - caption
      - hashtags
      - media prompt / metadata

    userDecision = WAIT_FOR_USER_ACTION(Approve, RequestChanges, Reject)

    IF userDecision == Approve
      post.status = APPROVED
      ADD post TO approvedPosts

    ELSE IF userDecision == RequestChanges
      editedPost = applyInlineEdits(post)
      revisedScore = recomputeEngagementScore(editedPost)
      DISPLAY revisedScore
      IF userConfirmsEditedVersion()
        editedPost.status = APPROVED
        ADD editedPost TO approvedPosts
      ENDIF

    ELSE IF userDecision == Reject
      post.status = REJECTED
      CONTINUE
    ENDIF
  ENDFOR

  RETURN approvedPosts
END FUNCTION
```

---

## 6) Scheduling Stage (Optimal Time Selection)

```text
FUNCTION executeSchedulingStage(approvedPosts)
  INIT scheduledPosts = []

  FOR EACH post IN approvedPosts
    requestPayload = {
      platform: post.platform,
      audience: post.targetAudience,
      timezone: userSelectedTimezone,
      contentType: post.contentType
    }

    RESPONSE = POST /api/schedule WITH requestPayload

    IF RESPONSE.success
      suggestedSlots = RESPONSE.slots
      selectedSlot = userSelectsSlot(suggestedSlots)
    ELSE
      selectedSlot = generateFallbackSlot(post.platform)
      SHOW warning "Using fallback schedule slot"
    ENDIF

    post.scheduledAt = selectedSlot
    post.status = SCHEDULED
    ADD post TO scheduledPosts
  ENDFOR

  RETURN scheduledPosts
END FUNCTION
```

---

## 7) Posting Stage (Cross-Platform Publishing)

```text
FUNCTION executePostingStage(scheduledPosts)
  INIT publishResults = []

  FOR EACH post IN scheduledPosts
    requestPayload = {
      action: "publish",
      platform: post.platform,
      content: post.caption,
      hashtags: post.hashtags,
      scheduledAt: post.scheduledAt,
      media: post.media
    }

    RESPONSE = POST /api/social WITH requestPayload

    IF RESPONSE.success
      result = {
        postId: post.id,
        platform: post.platform,
        status: "PUBLISHED_OR_QUEUED",
        externalId: RESPONSE.externalPostId
      }
    ELSE
      result = {
        postId: post.id,
        platform: post.platform,
        status: "FAILED",
        error: RESPONSE.error
      }
      LOG error with post.id + RESPONSE.error
    ENDIF

    ADD result TO publishResults
  ENDFOR

  RETURN publishResults
END FUNCTION
```

---

## 8) AI Service Layer Decision Logic

```text
FUNCTION generateContentWithFallback(promptData)
  apiKey = READ_ENV("GEMINI_API_KEY")

  IF apiKey EXISTS
    TRY
      aiResponse = callGemini(promptData, apiKey)
      RETURN transformAiResponse(aiResponse)
    CATCH rateLimitOrServiceError
      LOG warning "Gemini failed, fallback to mock"
      RETURN generateMockContent(promptData)
    ENDTRY
  ELSE
    RETURN generateMockContent(promptData)
  ENDIF
END FUNCTION
```

---

## 9) Platform Constraint Enforcement

```text
FUNCTION enforcePlatformConstraints(draft, platform)
  rules = PLATFORM_LIMITS[platform]

  caption = trimToMaxLength(draft.caption, rules.captionLimit)
  hashtags = limitHashtags(draft.hashtags, rules.maxHashtags)

  IF platform == "X"
    caption = ensure280CharacterCompliance(caption, hashtags)
  ENDIF

  IF platform == "LinkedIn"
    hashtags = prioritizeTopTags(hashtags, max=5)
  ENDIF

  RETURN {
    ...draft,
    caption: caption,
    hashtags: hashtags
  }
END FUNCTION
```

---

## 10) Zustand Store Lifecycle (Simplified)

```text
STORE workflowStore
  STATE:
    currentStage
    campaignData
    contentPlan
    generatedPosts
    approvedPosts
    scheduledPosts

  ACTION setCurrentStage(stage):
    state.currentStage = stage

  ACTION updateCampaignData(partialData):
    state.campaignData = merge(state.campaignData, partialData)

  ACTION resetWorkflow():
    state.currentStage = INPUT
    state.campaignData = emptyCampaignData()
    state.contentPlan = []
    state.generatedPosts = []
    state.approvedPosts = []
    state.scheduledPosts = []

  PERSIST store TO localStorage key "presocio-workflow"
END STORE
```

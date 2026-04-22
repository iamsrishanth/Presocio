# Test Cases Documentation

## Test Case 1: User Login with Valid Credentials
- **Test Case ID:** TC-001
- **Module:** Authentication
- **Preconditions:** User account is registered and active.
- **Test Data:**
  - Email: `qa.user1@example.com`
  - Password: `ValidPass@123`
- **Steps:**
  1. Open the login page.
  2. Enter valid email and password.
  3. Click **Login**.
- **Expected Result:** User is redirected to dashboard and session is created.

## Test Case 2: Content Generation with Campaign Brief
- **Test Case ID:** TC-002
- **Module:** AI Content Generation
- **Preconditions:** User is logged in and API key is configured.
- **Test Data:**
  - Campaign Name: `Summer Launch 2026`
  - Platform: `Instagram`
  - Tone: `Professional`
  - Keywords: `new product, launch, summer`
- **Steps:**
  1. Navigate to **Generation** stage.
  2. Enter campaign brief details.
  3. Click **Generate Content**.
- **Expected Result:** At least one valid caption is generated within platform character limits.

## Test Case 3: Schedule Post for Future Date
- **Test Case ID:** TC-003
- **Module:** Scheduling
- **Preconditions:** Generated content is approved.
- **Test Data:**
  - Platform: `LinkedIn`
  - Scheduled Date: `2026-04-30`
  - Scheduled Time: `10:30 AM UTC`
- **Steps:**
  1. Open **Scheduling** stage.
  2. Select approved post and platform.
  3. Set future date and time.
  4. Click **Schedule Post**.
- **Expected Result:** Post appears in scheduled queue with correct timestamp and status `Scheduled`.

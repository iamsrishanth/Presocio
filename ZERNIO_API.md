# Quickstart

> Get started with the Zernio API - authenticate, connect accounts, and schedule your first post in minutes.

Source: Zernio API Documentation (https://docs.zernio.com)
API Base URL: https://zernio.com/api/v1

---

# Quickstart

Get started with the Zernio API - authenticate, connect accounts, and schedule your first post in minutes.

import { Tab, Tabs } from 'fumadocs-ui/components/tabs';

Zernio is a social media scheduling platform that lets you manage and publish content across all major platforms from a single API. Whether you're building a social media tool, automating your content workflow, or managing multiple brands, Zernio's API gives you complete control.

**Base URL:** `https://zernio.com/api/v1`

---

## Install the SDK

<Tabs items={['Node.js', 'Python', 'Go', 'Ruby', 'Java', 'PHP', '.NET', 'Rust']}>
<Tab value="Node.js">
```bash
npm install @zernio/node
```
</Tab>
<Tab value="Python">
```bash
pip install zernio-sdk
```
</Tab>
<Tab value="Go">
```bash
go get github.com/zernio-dev/zernio-go
```
</Tab>
<Tab value="Ruby">
```bash
gem install zernio-sdk
```
</Tab>
<Tab value="Java">
```xml
<dependency>
  <groupId>com.zernio</groupId>
  <artifactId>zernio-sdk</artifactId>
  <version>1.0.1</version>
</dependency>
```
</Tab>
<Tab value="PHP">
```bash
composer require zernio-dev/zernio-php
```
</Tab>
<Tab value=".NET">
```bash
dotnet add package Zernio
```
</Tab>
<Tab value="Rust">
```bash
cargo add zernio
```
</Tab>
</Tabs>

## Authentication

All API requests require an API key. The SDKs read from the `ZERNIO_API_KEY` environment variable by default.

### Getting Your API Key

1. Log in to your Zernio account at [zernio.com](https://zernio.com)
2. Go to **Settings → API Keys**
3. Click **Create API Key**
4. Copy the key immediately - you won't be able to see it again

### Set Up the Client

<Tabs items={['Node.js', 'Python', 'curl']}>
<Tab value="Node.js">
```typescript
import Zernio from '@zernio/node';

const zernio = new Zernio(); // uses ZERNIO_API_KEY env var
```
</Tab>
<Tab value="Python">
```python
from zernio import Zernio

client = Zernio() # uses ZERNIO_API_KEY env var
```
</Tab>
<Tab value="curl">
```bash
# Set your API key as an environment variable
export ZERNIO_API_KEY="sk_..."

# All requests use the Authorization header
curl https://zernio.com/api/v1/posts \
  -H "Authorization: Bearer $ZERNIO_API_KEY"
```
</Tab>
</Tabs>

**Key format:** `sk_` prefix + 64 hex characters (67 total). Keys are stored as SHA-256 hashes - they're only shown once at creation.

**Security tips:** Use environment variables, create separate keys per app, and rotate periodically. You can also [manage keys via the API](/api-keys/list-api-keys).

---

## Key Concepts

- **Profiles** - Containers that group social accounts together (think "brands" or "projects")
- **Accounts** - Your connected social media accounts, belonging to profiles
- **Posts** - Content to publish, schedulable to multiple accounts across platforms simultaneously
- **Queue** - Optional recurring time slots for auto-scheduling posts

---

## Step 1: Create a Profile

Profiles group your social accounts together. For example, you might have a "Personal Brand" profile with your Twitter and LinkedIn, and a "Company" profile with your business accounts.

<Tabs items={['Node.js', 'Python', 'curl']}>
<Tab value="Node.js">
```typescript
const { profile } = await zernio.profiles.createProfile({
  name: 'My First Profile',
  description: 'Testing the Zernio API'
});

console.log('Profile created:', profile._id);
```
</Tab>
<Tab value="Python">
```python
result = client.profiles.create(
    name="My First Profile",
    description="Testing the Zernio API"
)

print(f"Profile created: {result.profile['_id']}")
```
</Tab>
<Tab value="curl">
```bash
curl -X POST https://zernio.com/api/v1/profiles \
  -H "Authorization: Bearer $ZERNIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Profile",
    "description": "Testing the Zernio API"
  }'
```
</Tab>
</Tabs>

Save the `_id` value - you'll need it for the next steps.

## Step 2: Connect a Social Account

Now connect a social media account to your profile. This uses OAuth, so it will redirect to the platform for authorization.

<Tabs items={['Node.js', 'Python', 'curl']}>
<Tab value="Node.js">
```typescript
const { authUrl } = await zernio.connect.getConnectUrl({
  platform: 'twitter',
  profileId: 'prof_abc123'
});

// Redirect user to this URL to authorize
console.log('Open this URL:', authUrl);
```
</Tab>
<Tab value="Python">
```python
result = client.connect.get_connect_url(
    platform="twitter",
    profile_id="prof_abc123"
)

print(f"Open this URL: {result.auth_url}")
```
</Tab>
<Tab value="curl">
```bash
curl "https://zernio.com/api/v1/connect/twitter?profileId=prof_abc123" \
  -H "Authorization: Bearer $ZERNIO_API_KEY"
```
</Tab>
</Tabs>

Open the URL in a browser to authorize Zernio to access your Twitter account. After authorization, you'll be redirected back and the account will be connected.

### Available Platforms

Replace `twitter` with any of these:

| Platform | API Value | Guide |
|----------|-----------|-------|
| Twitter/X | `twitter` | [Twitter Guide](/platforms/twitter) |
| Instagram | `instagram` | [Instagram Guide](/platforms/instagram) |
| Facebook Pages | `facebook` | [Facebook Guide](/platforms/facebook) |
| LinkedIn | `linkedin` | [LinkedIn Guide](/platforms/linkedin) |
| TikTok | `tiktok` | [TikTok Guide](/platforms/tiktok) |
| YouTube | `youtube` | [YouTube Guide](/platforms/youtube) |
| Pinterest | `pinterest` | [Pinterest Guide](/platforms/pinterest) |
| Reddit | `reddit` | [Reddit Guide](/platforms/reddit) |
| Bluesky | `bluesky` | [Bluesky Guide](/platforms/bluesky) |
| Threads | `threads` | [Threads Guide](/platforms/threads) |
| Google Business | `googlebusiness` | [Google Business Guide](/platforms/google-business) |
| Telegram | `telegram` | [Telegram Guide](/platforms/telegram) |
| Snapchat | `snapchat` | [Snapchat Guide](/platforms/snapchat) |

## Step 3: Get Your Connected Accounts

After connecting, list your accounts to get the account ID:

<Tabs items={['Node.js', 'Python', 'curl']}>
<Tab value="Node.js">
```typescript
const { accounts } = await zernio.accounts.listAccounts();

for (const account of accounts) {
  console.log(`${account.platform}: ${account._id}`);
}
```
</Tab>
<Tab value="Python">
```python
result = client.accounts.list()

for account in result.accounts:
    print(f"{account['platform']}: {account['_id']}")
```
</Tab>
<Tab value="curl">
```bash
curl "https://zernio.com/api/v1/accounts" \
  -H "Authorization: Bearer $ZERNIO_API_KEY"
```
</Tab>
</Tabs>

Save the account `_id` - you need it to create posts.

## Step 4: Schedule Your First Post

Now you can schedule a post! Here's how to schedule a tweet for tomorrow at noon:

<Tabs items={['Node.js', 'Python', 'curl']}>
<Tab value="Node.js">
```typescript
const { post } = await zernio.posts.createPost({
  content: 'Hello world! This is my first post from the Zernio API',
  scheduledFor: '2024-01-16T12:00:00',
  timezone: 'America/New_York',
  platforms: [
    { platform: 'twitter', accountId: 'acc_xyz789' }
  ]
});

console.log('Post scheduled:', post._id);
```
</Tab>
<Tab value="Python">
```python
result = client.posts.create(
    content="Hello world! This is my first post from the Zernio API",
    scheduled_for="2024-01-16T12:00:00",
    timezone="America/New_York",
    platforms=[
        {"platform": "twitter", "accountId": "acc_xyz789"}
    ]
)

print(f"Post scheduled: {result.post['_id']}")
```
</Tab>
<Tab value="curl">
```bash
curl -X POST https://zernio.com/api/v1/posts \
  -H "Authorization: Bearer $ZERNIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello world! This is my first post from the Zernio API",
    "scheduledFor": "2024-01-16T12:00:00",
    "timezone": "America/New_York",
    "platforms": [
      {"platform": "twitter", "accountId": "acc_xyz789"}
    ]
  }'
```
</Tab>
</Tabs>

Your post is now scheduled and will publish automatically at the specified time.

## Posting to Multiple Platforms

You can post to multiple platforms at once. Just add more entries to the `platforms` array:

<Tabs items={['Node.js', 'Python', 'curl']}>
<Tab value="Node.js">
```typescript
const { post } = await zernio.posts.createPost({
  content: 'Cross-posting to all my accounts!',
  scheduledFor: '2024-01-16T12:00:00',
  timezone: 'America/New_York',
  platforms: [
    { platform: 'twitter', accountId: 'acc_twitter123' },
    { platform: 'linkedin', accountId: 'acc_linkedin456' },
    { platform: 'bluesky', accountId: 'acc_bluesky789' }
  ]
});
```
</Tab>
<Tab value="Python">
```python
result = client.posts.create(
    content="Cross-posting to all my accounts!",
    scheduled_for="2024-01-16T12:00:00",
    timezone="America/New_York",
    platforms=[
        {"platform": "twitter", "accountId": "acc_twitter123"},
        {"platform": "linkedin", "accountId": "acc_linkedin456"},
        {"platform": "bluesky", "accountId": "acc_bluesky789"}
    ]
)
```
</Tab>
<Tab value="curl">
```bash
curl -X POST https://zernio.com/api/v1/posts \
  -H "Authorization: Bearer $ZERNIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Cross-posting to all my accounts!",
    "scheduledFor": "2024-01-16T12:00:00",
    "timezone": "America/New_York",
    "platforms": [
      {"platform": "twitter", "accountId": "acc_twitter123"},
      {"platform": "linkedin", "accountId": "acc_linkedin456"},
      {"platform": "bluesky", "accountId": "acc_bluesky789"}
    ]
  }'
```
</Tab>
</Tabs>

## Publishing Immediately

To publish right now instead of scheduling, use `publishNow: true`:

<Tabs items={['Node.js', 'Python', 'curl']}>
<Tab value="Node.js">
```typescript
const { post } = await zernio.posts.createPost({
  content: 'This posts immediately!',
  publishNow: true,
  platforms: [
    { platform: 'twitter', accountId: 'acc_xyz789' }
  ]
});
```
</Tab>
<Tab value="Python">
```python
result = client.posts.create(
    content="This posts immediately!",
    publish_now=True,
    platforms=[
        {"platform": "twitter", "accountId": "acc_xyz789"}
    ]
)
```
</Tab>
<Tab value="curl">
```bash
curl -X POST https://zernio.com/api/v1/posts \
  -H "Authorization: Bearer $ZERNIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This posts immediately!",
    "publishNow": true,
    "platforms": [
      {"platform": "twitter", "accountId": "acc_xyz789"}
    ]
  }'
```
</Tab>
</Tabs>

## Creating a Draft

To save a post without publishing or scheduling, omit both `scheduledFor` and `publishNow`:

<Tabs items={['Node.js', 'Python', 'curl']}>
<Tab value="Node.js">
```typescript
const { post } = await zernio.posts.createPost({
  content: 'I will finish this later...',
  platforms: [
    { platform: 'twitter', accountId: 'acc_xyz789' }
  ]
});
```
</Tab>
<Tab value="Python">
```python
result = client.posts.create(
    content="I will finish this later...",
    platforms=[
        {"platform": "twitter", "accountId": "acc_xyz789"}
    ]
)
```
</Tab>
<Tab value="curl">
```bash
curl -X POST https://zernio.com/api/v1/posts \
  -H "Authorization: Bearer $ZERNIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I will finish this later...",
    "platforms": [
      {"platform": "twitter", "accountId": "acc_xyz789"}
    ]
  }'
```
</Tab>
</Tabs>

## What's Next?

- **[Platform Guides](/platforms)** - Learn platform-specific features and requirements
- **[Upload media](/guides/media-uploads)** - Add images and videos to your posts
- **[Set up a queue](/queue/list-queue-slots)** - Create recurring posting schedules
- **[View analytics](/analytics/get-analytics)** - Track how your posts perform
- **[Invite team members](/invites/create-invite-token)** - Collaborate with your team
- **[CLI](/resources/cli)** - Manage posts from the terminal

# Instagram API

> Schedule and automate Instagram posts with Zernio API - Feed, Stories, Reels, Carousels, collaborators, and user tags

Source: Zernio API Documentation (https://docs.zernio.com)
API Base URL: https://zernio.com/api/v1

---

# Instagram API

Schedule and automate Instagram posts with Zernio API - Feed, Stories, Reels, Carousels, collaborators, and user tags

import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Callout } from 'fumadocs-ui/components/callout';

## Quick Reference

| Property | Value |
|----------|-------|
| Character limit | 2,200 (caption) |
| Images per post | 1 (feed), 10 (carousel) |
| Videos per post | 1 |
| Image formats | JPEG, PNG |
| Image max size | 8 MB (auto-compressed) |
| Video formats | MP4, MOV |
| Video max size | 300 MB (feed/reels), 100 MB (stories) |
| Video max duration | 90 sec (reels), 60 min (feed), 60 sec (story) |
| Post types | Feed, Carousel, Story, Reel |
| Scheduling | Yes |
| Inbox (DMs) | Yes (add-on) |
| Inbox (Comments) | Yes (add-on, reply-only) |
| Analytics | Yes |

## Before You Start

<Callout type="warn">
Instagram **requires** a Business or Creator account. Personal accounts cannot post via API.

Google Drive, Dropbox, OneDrive, and iCloud links **do not work** as media URLs. These services return HTML pages, not media files. Instagram's servers cannot fetch media from them. Use direct CDN URLs or upload via Zernio's [media endpoint](/media/upload-media).

Additional requirements:
- Media is required for all posts (no text-only)
- 100 posts per 24-hour rolling window (all content types combined)
- First 125 characters of caption are visible before the "more" fold
</Callout>

## Quick Start

Post an image to Instagram in under 60 seconds:

<Tabs items={['Node.js', 'Python', 'curl']}>
<Tab value="Node.js">
```typescript
const { post } = await zernio.posts.createPost({
  content: 'Check out this photo!',
  mediaItems: [
    { type: 'image', url: 'https://cdn.example.com/photo.jpg' }
  ],
  platforms: [
    { platform: 'instagram', accountId: 'YOUR_ACCOUNT_ID' }
  ],
  publishNow: true
});
console.log('Posted to Instagram!', post._id);
```
</Tab>
<Tab value="Python">
```python
result = client.posts.create(
    content="Check out this photo!",
    media_items=[
        {"type": "image", "url": "https://cdn.example.com/photo.jpg"}
    ],
    platforms=[
        {"platform": "instagram", "accountId": "YOUR_ACCOUNT_ID"}
    ],
    publish_now=True
)
post = result.post
print(f"Posted to Instagram! {post['_id']}")
```
</Tab>
<Tab value="curl">
```bash
curl -X POST https://zernio.com/api/v1/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Check out this photo!",
    "mediaItems": [
      {"type": "image", "url": "https://cdn.example.com/photo.jpg"}
    ],
    "platforms": [
      {"platform": "instagram", "accountId": "YOUR_ACCOUNT_ID"}
    ],
    "publishNow": true
  }'
```
</Tab>
</Tabs>

## Content Types

### Feed Post

A single image or video in the main feed. Best aspect ratio is 4:5 (portrait), but 1:1 (square) and 1.91:1 (landscape) are also supported. No `contentType` field is needed -- feed is the default.

<Tabs items={['Node.js', 'Python', 'curl']}>
<Tab value="Node.js">
```typescript
const { post } = await zernio.posts.createPost({
  content: 'Beautiful sunset today #photography',
  mediaItems: [
    { type: 'image', url: 'https://cdn.example.com/sunset.jpg' }
  ],
  platforms: [
    { platform: 'instagram', accountId: 'YOUR_ACCOUNT_ID' }
  ],
  publishNow: true
});
console.log('Feed post created!', post._id);
```
</Tab>
<Tab value="Python">
```python
result = client.posts.create(
    content="Beautiful sunset today #photography",
    media_items=[
        {"type": "image", "url": "https://cdn.example.com/sunset.jpg"}
    ],
    platforms=[
        {"platform": "instagram", "accountId": "YOUR_ACCOUNT_ID"}
    ],
    publish_now=True
)
post = result.post
print(f"Feed post created! {post['_id']}")
```
</Tab>
<Tab value="curl">
```bash
curl -X POST https://zernio.com/api/v1/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Beautiful sunset today #photography",
    "mediaItems": [
      {"type": "image", "url": "https://cdn.example.com/sunset.jpg"}
    ],
    "platforms": [
      {"platform": "instagram", "accountId": "YOUR_ACCOUNT_ID"}
    ],
    "publishNow": true
  }'
```
</Tab>
</Tabs>

### Carousel

Up to 10 mixed image/video items. All items should share the same aspect ratio -- the first item determines the ratio for the entire carousel.

<Tabs items={['Node.js', 'Python', 'curl']}>
<Tab value="Node.js">
```typescript
const { post } = await zernio.posts.createPost({
  content: 'Trip highlights from last weekend',
  mediaItems: [
    { type: 'image', url: 'https://cdn.example.com/photo1.jpg' },
    { type: 'image', url: 'https://cdn.example.com/photo2.jpg' },
    { type: 'video', url: 'https://cdn.example.com/clip.mp4' },
    { type: 'image', url: 'https://cdn.example.com/photo3.jpg' }
  ],
  platforms: [
    { platform: 'instagram', accountId: 'YOUR_ACCOUNT_ID' }
  ],
  publishNow: true
});
console.log('Carousel posted!', post._id);
```
</Tab>
<Tab value="Python">
```python
result = client.posts.create(
    content="Trip highlights from last weekend",
    media_items=[
        {"type": "image", "url": "https://cdn.example.com/photo1.jpg"},
        {"type": "image", "url": "https://cdn.example.com/photo2.jpg"},
        {"type": "video", "url": "https://cdn.example.com/clip.mp4"},
        {"type": "image", "url": "https://cdn.example.com/photo3.jpg"}
    ],
    platforms=[
        {"platform": "instagram", "accountId": "YOUR_ACCOUNT_ID"}
    ],
    publish_now=True
)
post = result.post
print(f"Carousel posted! {post['_id']}")
```
</Tab>
<Tab value="curl">
```bash
curl -X POST https://zernio.com/api/v1/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Trip highlights from last weekend",
    "mediaItems": [
      {"type": "image", "url": "https://cdn.example.com/photo1.jpg"},
      {"type": "image", "url": "https://cdn.example.com/photo2.jpg"},
      {"type": "video", "url": "https://cdn.example.com/clip.mp4"},
      {"type": "image", "url": "https://cdn.example.com/photo3.jpg"}
    ],
    "platforms": [
      {"platform": "instagram", "accountId": "YOUR_ACCOUNT_ID"}
    ],
    "publishNow": true
  }'
```
</Tab>
</Tabs>

### Story

Set `contentType: "story"` to publish to Stories. Stories disappear after 24 hours, text captions are not displayed, and link stickers are not available via the API (this is a limitation of Instagram's Graph API, not Zernio).

<Tabs items={['Node.js', 'Python', 'curl']}>
<Tab value="Node.js">
```typescript
const { post } = await zernio.posts.createPost({
  mediaItems: [
    { type: 'image', url: 'https://cdn.example.com/story.jpg' }
  ],
  platforms: [{
    platform: 'instagram',
    accountId: 'YOUR_ACCOUNT_ID',
    platformSpecificData: {
      contentType: 'story'
    }
  }],
  publishNow: true
});
console.log('Story posted!', post._id);
```
</Tab>
<Tab value="Python">
```python
result = client.posts.create(
    media_items=[
        {"type": "image", "url": "https://cdn.example.com/story.jpg"}
    ],
    platforms=[{
        "platform": "instagram",
        "accountId": "YOUR_ACCOUNT_ID",
        "platformSpecificData": {
            "contentType": "story"
        }
    }],
    publish_now=True
)
post = result.post
print(f"Story posted! {post['_id']}")
```
</Tab>
<Tab value="curl">
```bash
curl -X POST https://zernio.com/api/v1/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "mediaItems": [
      {"type": "image", "url": "https://cdn.example.com/story.jpg"}
    ],
    "platforms": [{
      "platform": "instagram",
      "accountId": "YOUR_ACCOUNT_ID",
      "platformSpecificData": {
        "contentType": "story"
      }
    }],
    "publishNow": true
  }'
```
</Tab>
</Tabs>

### Reel

Set `contentType: "reels"` to publish a Reel, or let Zernio auto-detect it from vertical 9:16 video under 90 seconds. Reels must be vertical (9:16) and no longer than 90 seconds.

<Tabs items={['Node.js', 'Python', 'curl']}>
<Tab value="Node.js">
```typescript
const { post } = await zernio.posts.createPost({
  content: 'New tutorial is up!',
  mediaItems: [
    { type: 'video', url: 'https://cdn.example.com/reel.mp4' }
  ],
  platforms: [{
    platform: 'instagram',
    accountId: 'YOUR_ACCOUNT_ID',
    platformSpecificData: {
      contentType: 'reels',
      shareToFeed: true
    }
  }],
  publishNow: true
});
console.log('Reel posted!', post._id);
```
</Tab>
<Tab value="Python">
```python
result = client.posts.create(
    content="New tutorial is up!",
    media_items=[
        {"type": "video", "url": "https://cdn.example.com/reel.mp4"}
    ],
    platforms=[{
        "platform": "instagram",
        "accountId": "YOUR_ACCOUNT_ID",
        "platformSpecificData": {
            "contentType": "reels",
            "shareToFeed": True
        }
    }],
    publish_now=True
)
post = result.post
print(f"Reel posted! {post['_id']}")
```
</Tab>
<Tab value="curl">
```bash
curl -X POST https://zernio.com/api/v1/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "New tutorial is up!",
    "mediaItems": [
      {"type": "video", "url": "https://cdn.example.com/reel.mp4"}
    ],
    "platforms": [{
      "platform": "instagram",
      "accountId": "YOUR_ACCOUNT_ID",
      "platformSpecificData": {
        "contentType": "reels",
        "shareToFeed": true
      }
    }],
    "publishNow": true
  }'
```
</Tab>
</Tabs>

## Media Requirements

### Images

| Property | Feed Post | Story | Carousel |
|----------|-----------|-------|----------|
| **Max images** | 1 | 1 | 10 |
| **Formats** | JPEG, PNG | JPEG, PNG | JPEG, PNG |
| **Max file size** | 8 MB | 8 MB | 8 MB each |
| **Recommended** | 1080 x 1350 px | 1080 x 1920 px | 1080 x 1080 px |

#### Aspect Ratios

| Orientation | Ratio | Dimensions | Notes |
|-------------|-------|------------|-------|
| Portrait | 4:5 | 1080 x 1350 px | Best engagement for feed posts |
| Square | 1:1 | 1080 x 1080 px | Standard feed and carousel |
| Landscape | 1.91:1 | 1080 x 566 px | Widest allowed for feed |
| Vertical | 9:16 | 1080 x 1920 px | Stories and Reels only |

Feed posts accept aspect ratios between 0.8 (4:5) and 1.91 (1.91:1). Images outside that range must be posted as Stories or Reels.

### Videos

| Property | Feed | Reel | Story |
|----------|------|------|-------|
| **Formats** | MP4, MOV | MP4, MOV | MP4, MOV |
| **Max file size** | 300 MB | 300 MB | 100 MB |
| **Max duration** | 60 min | 90 sec | 60 sec |
| **Min duration** | 3 sec | 3 sec | 3 sec |
| **Aspect ratio** | 4:5 to 1.91:1 | 9:16 | 9:16 |
| **Resolution** | 1080 px wide | 1080 x 1920 px | 1080 x 1920 px |
| **Codec** | H.264 | H.264 | H.264 |
| **Frame rate** | 30 fps | 30 fps | 30 fps |

Oversized media is auto-compressed. Images above 8 MB, videos above 300 MB (feed/reels) or 100 MB (stories) are compressed automatically. Original files are preserved.

## Platform-Specific Fields

All fields go inside `platformSpecificData` on the Instagram platform entry.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `contentType` | `"story"` \| `"reels"` | (feed) | Omit for regular feed post. Set to `"story"` for Stories or `"reels"` for Reels. |
| `shareToFeed` | boolean | `true` | Reel-specific. Set to `false` to show the Reel in the Reels tab only, not the main feed. |
| `collaborators` | Array\<string\> | -- | Up to 3 usernames. Must be public Business/Creator accounts. Does not work with Stories. |
| `userTags` | Array\<\{username, x, y, mediaIndex?\}\> | -- | Tag users in images (not videos). Coordinates are 0.0 to 1.0. `mediaIndex` targets a specific carousel slide (0-based, defaults to 0). |
| `trialParams` | \{graduationStrategy\} | -- | Trial Reels, shown only to non-followers. `graduationStrategy` is `"MANUAL"` or `"SS_PERFORMANCE"` (auto-graduate if it performs well). |
| `thumbOffset` | number (ms) | `0` | Millisecond offset from video start to use as thumbnail. Ignored if `instagramThumbnail` is set. |
| `instagramThumbnail` | string (URL) | -- | Custom thumbnail for Reels. JPEG or PNG, recommended 1080 x 1920 px. Takes priority over `thumbOffset`. |
| `audioName` | string | -- | Custom audio name for Reels (replaces "Original Audio"). Can only be set at creation. |
| `firstComment` | string | -- | Auto-posted as the first comment. Works with feed posts and carousels, not Stories. Useful for links since captions do not have clickable links. |

## Media URL Requirements

<Callout type="error">
**These do not work as media URLs:**
- **Google Drive** -- returns an HTML download page, not the file
- **Dropbox** -- returns an HTML preview page
- **OneDrive / SharePoint** -- returns HTML
- **iCloud** -- returns HTML

Test your URL in an incognito browser window. If you see a webpage instead of the raw image or video, it will not work.
</Callout>

Media URLs must be:
- Publicly accessible (no authentication required)
- Returning actual media bytes with the correct `Content-Type` header
- Not behind redirects that resolve to HTML pages
- Hosted on a fast, reliable CDN

**Supabase URLs:** Zernio auto-proxies Supabase storage URLs, so they work without additional configuration.

## Analytics

> **Requires [Analytics add-on](/pricing)**

Available metrics via the [Analytics API](/analytics/get-analytics):

| Metric | Available |
|--------|-----------|
| Impressions | ✅ |
| Reach | ✅ |
| Likes | ✅ |
| Comments | ✅ |
| Shares | ✅ |
| Saves | ✅ |
| Views | ✅ |

<Tabs items={['Node.js', 'Python', 'curl']}>
<Tab value="Node.js">
```typescript
const analytics = await zernio.analytics.getAnalytics({
  platform: 'instagram',
  fromDate: '2024-01-01',
  toDate: '2024-01-31'
});
console.log(analytics.posts);
```
</Tab>
<Tab value="Python">
```python
analytics = client.analytics.get(
    platform="instagram",
    from_date="2024-01-01",
    to_date="2024-01-31"
)
print(analytics["posts"])
```
</Tab>
<Tab value="curl">
```bash
curl "https://zernio.com/api/v1/analytics?platform=instagram&fromDate=2024-01-01&toDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_API_KEY"
```
</Tab>
</Tabs>

## What You Can't Do

These features are not available through Instagram's API:

- Add music to Reels
- Use story stickers (polls, questions, links, countdowns)
- Add location tags
- Go Live
- Create Guides
- Boost or promote posts
- Apply filters
- Tag products
- Post to personal accounts (Business or Creator only)
- Create top-level comments (reply-only through the API)

## Common Errors

Instagram has a **10.2% failure rate** across Zernio's platform (35,634 failures out of 348,438 attempts). Here are the most frequent errors and how to fix them:

| Error | Meaning | Fix |
|-------|---------|-----|
| "Cannot process video from this URL. Instagram cannot fetch videos from Google Drive, Dropbox, or OneDrive." | A cloud storage sharing link was used instead of a direct media URL | Use a direct CDN URL. Test in an incognito window -- if you see a webpage, it will not work. |
| "You have reached the maximum of 100 posts per day." | Instagram's hard 24-hour rolling limit | Reduce posting volume. This limit includes all content types (feed, stories, reels, carousels). |
| "Instagram blocked your request." | Automation detection triggered | Reduce posting frequency, vary content. Wait before retrying. |
| "Duplicate content detected." | Identical content was already published recently | Modify the caption or media before retrying. |
| "Media fetch failed, retrying... (failed after 3 attempts)" | Zernio could not download media from the provided URL | Verify the URL is publicly accessible and returns actual media bytes, not an HTML page. |
| "Instagram access token expired." | The OAuth token for this account has expired | Reconnect the account. Subscribe to the `account.disconnected` webhook to catch this proactively. |

## Inbox

> **Requires [Inbox add-on](/pricing)** — Build: +$10/mo · Accelerate: +$50/unit · Unlimited: +$1,000/mo

Instagram supports DMs and comments with some limitations.

### Direct Messages

| Feature | Supported |
|---------|-----------|
| List conversations | ✅ |
| Fetch messages | ✅ |
| Send text messages | ✅ |
| Send attachments | ✅ (images, videos, audio via URL) |
| Quick replies | ✅ (up to 13, Meta quick_replies) |
| Buttons | ✅ (up to 3, generic template) |
| Carousels | ✅ (generic template, up to 10 elements) |
| Message tags | ✅ (`HUMAN_AGENT` only) |
| Archive/unarchive | ✅ |

**Attachment limits:** 8 MB images, 25 MB video/audio. Attachments are automatically uploaded to temp storage and sent as URLs.

**Message tags:** Use `messageTag: "HUMAN_AGENT"` with `messagingType: "MESSAGE_TAG"` to send messages outside the 24-hour messaging window.

#### Instagram Profile Data

Instagram conversations include an optional `instagramProfile` object on participants and webhook senders, useful for routing and automation:

| Field | Type | Description |
|-------|------|-------------|
| `isFollower` | boolean | Whether the participant follows your business account |
| `isFollowing` | boolean | Whether your business account follows the participant |
| `followerCount` | integer | The participant's follower count |
| `isVerified` | boolean | Whether the participant is a verified Instagram user |
| `fetchedAt` | datetime | When this data was last fetched (conversations only) |

Available in:
- `GET /v1/inbox/conversations` and `GET /v1/inbox/conversations/{id}` - on each participant
- `message.received` webhook - on `message.sender`

### Ice Breakers

Manage ice breaker prompts shown when users start a new Instagram DM conversation. Max 4 ice breakers, question max 80 characters.

See [Account Settings](/account-settings/get-instagram-ice-breakers) for the `GET/PUT/DELETE /v1/accounts/{accountId}/instagram-ice-breakers` endpoints.

### Comments

| Feature | Supported |
|---------|-----------|
| List comments on posts | ✅ |
| Post new top-level comment | ❌ (reply-only) |
| Reply to comments | ✅ |
| Delete comments | ✅ |
| Like comments | ❌ (deprecated since 2018) |
| Hide/unhide comments | ✅ |

### Webhooks

Subscribe to `message.received` to get notified when new DMs arrive. Messages are stored locally via webhooks.

### Limitations

- **Reply-only comments** - Cannot post new top-level comments, only replies to existing comments
- **No comment likes** - Liking comments was deprecated in 2018

See [Messages](/messages/list-inbox-conversations) and [Comments](/comments/list-inbox-comments) API Reference for endpoint details.

## Related Endpoints

- [Connect Instagram Account](/connect/connect-instagram) - OAuth flow via Facebook Business
- [Create Post](/posts/create-post) - Post creation and scheduling
- [Upload Media](/media/upload-media) - Image and video uploads
- [Analytics](/analytics/get-analytics) - Post performance metrics
- [Messages](/messages/list-inbox-conversations) and [Comments](/comments/list-inbox-comments) - Inbox API
- [Account Settings](/account-settings/get-instagram-ice-breakers) - Ice breakers configuration



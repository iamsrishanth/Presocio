# JSON2VIDEO API Reference Documentation



---

## Content from: https://json2video.com/docs/v2/api-reference

# 2. API Reference[#](#2-api-reference "Permalink")

This section provides a detailed reference for the JSON2Video API. It covers aspects like obtaining your API key, authentication procedures, available endpoints, and a comprehensive breakdown of the Movie JSON Schema. Understanding this reference is crucial for effectively utilizing the JSON2Video API to programmatically create and manipulate videos.

[← Previous: Basic Concepts](/docs/v2/getting-started/basic-concepts)[Next: Getting your API key →](/docs/v2/api-reference/getting-your-api-key)

---

## Content from: https://json2video.com/docs/v2/api-reference/getting-your-api-key

# Getting your API key[#](#getting-your-api-key "Permalink")

To use the JSON2Video API, you'll need an API key. This key is used to authenticate your requests and authorize access to the API.

There are two types of API keys:

* **Primary API key:** This key is automatically generated when you [sign up for a JSON2Video account](https://json2video.com/get-api-key/). It has full administrative access to your account, allowing you to perform all available operations.
* **Secondary API keys:** These keys can be created from the [API Keys page](https://json2video.com/dashboard/api-keys/) in the dashboard (available for paid plans only). They offer more granular control over permissions.

## Creating Secondary API Keys[#](#creating-secondary-api-keys "Permalink")

Paid plan users can create secondary API keys with different permission roles:

* **Render:** Allows the API key to be used for creating videos using the `/movies` endpoint.
* **Editor:** Includes Render permissions and also grants the ability to create and edit templates.
* **Manager:** Encompasses Editor permissions and further allows the creation and modification of connections.

## Security Recommendations[#](#security-recommendations "Permalink")

Your API key is sensitive information and should be treated with care. Follow these recommendations to ensure the security of your account:

* **Keep your API key secret:** Never share your API key with anyone.
* **Don't share your API key:** Avoid storing your API key in public repositories or other insecure locations.
* **Regenerate your API key if it's compromised:** If you suspect that your API key has been compromised, immediately regenerate it from the dashboard. This will invalidate the old key and prevent unauthorized access.
* **API keys should not be used in client-side code:** Exposing your API key in client-side code (e.g., JavaScript in a web browser) makes it vulnerable to unauthorized use. Always perform API calls from a secure server-side environment.

[← Previous: API Reference](/docs/v2/api-reference)[Next: Authentication →](/docs/v2/api-reference/authentication)

---

## Content from: https://json2video.com/docs/v2/api-reference/authentication

# Authentication[#](#authentication "Permalink")

All calls to the JSON2Video API require authentication. You must pass your API key in the `x-api-key` header of your request.

## How to Authenticate[#](#how-to-authenticate "Permalink")

To authenticate your API calls, include the `x-api-key` header in each request. The value of this header should be your unique API key.

**Example using `curl`:**

```
curl --location --request POST 'https://api.json2video.com/v2/movies' \
--header 'x-api-key: [[YOUR_APIKEY]]' \
--header 'Content-Type: application/json' \
--data-raw '[[YOUR_JSON]]'
```

In this example, replace `[[YOUR_APIKEY]]` with your actual API key. The API key acts as your credential for accessing and using the JSON2Video API.

**Example using JavaScript (Axios):**

```
const axios = require('axios');

axios.post('https://api.json2video.com/v2/movies', {
    // Your JSON data here
}, {
    headers: {
        'x-api-key': '[[YOUR_APIKEY]]',
        'Content-Type': 'application/json'
    }
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error('Error:', error);
});
```

**Example using PHP:**

```
<?php

$apiKey = '[[YOUR_APIKEY]]';
$data = json_encode([
    // Your JSON data here
]);

$ch = curl_init('https://api.json2video.com/v2/movies');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'x-api-key: ' . $apiKey,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>
```

## Where to Find Your API Key[#](#where-to-find-your-api-key "Permalink")

You can obtain your API key by signing up for a JSON2Video user account.

[Get your free API Key](https://json2video.com/get-api-key/)

## Using the JSON2Video SDKs[#](#using-the-json2video-sdks "Permalink")

The JSON2Video API is available for JavaScript and PHP. You can find the SDKs in the [JSON2Video GitHub repository](https://github.com/json2video).

## Important Considerations[#](#important-considerations "Permalink")

* **Security:** Keep your API key confidential. Do not share it publicly or embed it directly in client-side code.
* **Error Handling:** If your API key is invalid or missing, the API will return an authentication error. Check the [Troubleshooting](https://json2video.com/docs/troubleshooting/) section for details.
* **Consistent Usage:** Ensure that you include the `x-api-key` header in every request to the API. Failure to do so will result in authentication errors.

[← Previous: Getting your API key](/docs/v2/api-reference/getting-your-api-key)[Next: API Endpoints →](/docs/v2/api-reference/api-endpoints)

---

## Content from: https://json2video.com/docs/v2/api-reference/api-endpoints

# API Endpoints[#](#api-endpoints "Permalink")

The current version of the API is **2**.

The base URL for all API requests is:

`https://api.json2video.com/v2`

This section details the available endpoints for the JSON2Video API.

## Available Endpoints[#](#available-endpoints "Permalink")

The following endpoints are currently available:

### /movies[#](#movies "Permalink")

This endpoint allows you to:

* **Create a new movie:** `POST https://api.json2video.com/v2/movies`
* **Check the status of a movie:** `GET https://api.json2video.com/v2/movies/?project={projectId}`

See the sections on [Movies](/docs/v2/api-reference/api-endpoints/movies) in the Movie JSON Schema for more information.

[← Previous: Authentication](/docs/v2/api-reference/authentication)[Next: Movies →](/docs/v2/api-reference/api-endpoints/movies)

---

## Content from: https://json2video.com/docs/v2/api-reference/api-endpoints/movies

# Movies[#](#movies "Permalink")

The Movies endpoint allows you to create new video rendering jobs and check the status of existing ones. This is the primary endpoint for interacting with the JSON2Video API.

**Base URL:** `https://api.json2video.com/v2/movies`

## POST `/movies` - Create a new movie[#](#post-movies---create-a-new-movie "Permalink")

This endpoint initiates a new video rendering job based on the provided JSON payload.

**Request:**

* **Method:** `POST`
* **Headers:**
  + `x-api-key`: Your API key for authentication.
  + `Content-Type`: `application/json`
* **Body:** A JSON object conforming to the [Movie JSON Schema](/docs/v2/api-reference/movie-json-schema). This JSON defines the structure and content of the video to be rendered.

**Example Request (cURL):**

```
curl --location --request POST 'https://api.json2video.com/v2/movies' \
--header 'x-api-key: YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
    "scenes": [
        {
            "elements": [
                {
                    "type": "video",
                    "src": "https://example.com/path/to/my/video.mp4"
                }
            ]
        }
    ]
}'
```

**Response:**

A successful request returns a JSON object with details about the initiated job.

* **Status Code:** `200`
* **Body:**

```
{
    "success": true,
    "project": "YOUR_PROJECT_ID",
    "timestamp": "2022-08-01T10:49:52.924Z"
}
```

* `success`: Indicates if the job was successfully initiated (`true` or `false`).
* `project`: A unique identifier (`YOUR_PROJECT_ID`) assigned to the rendering job. This ID is used to check the status of the job.
* `timestamp`: The date and time the job was initiated.

## GET `/movies` - Check the status of a movie[#](#get-movies---check-the-status-of-a-movie "Permalink")

This endpoint retrieves the status of a specific video rendering job using the `project` ID.

**Request:**

* **Method:** `GET`
* **Headers:**
  + `x-api-key`: Your API key for authentication.
* **Query Parameters:**
  + `project`: The project ID of the movie rendering job you want to check.

**Example Request (cURL):**

```
curl --location --request GET 'https://api.json2video.com/v2/movies?project=YOUR_PROJECT_ID' \
--header 'x-api-key: YOUR_API_KEY'
```

**Response:**

A successful request returns a JSON object with details about the movie status.

* **Status Code:** `200`
* **Body (Success):**

```
{
  "success": true,
  "movie": {
    "success": true,
    "status": "done",
    "message": "",
    "project": "[[YOUR_PROJECT_ID]]",
    "url": "https://assets.json2video.com/clients/xxxxxxxx/renders/2023-03-06-36066.mp4",
    "ass": "https://assets.json2video.com/clients/xxxxxxxx/renders/2023-03-06-36066.ass",
    "created_at": "2023-03-06T07:41:41.946Z",
    "ended_at": "2023-03-06T07:44:57.108Z",
    "duration": 108.2,
    "size": 6876189,
    "width": 1080,
    "height": 1920,
    "rendering_time": 195
  },
  "remaining_quota": {
    "time": 1807
  }
}
```

* `success`: Indicates if the request was successful.
* `movie`: An object containing details about the movie:
  + `success`: Indicates if the movie rendering was successful.
  + `status`: The current status of the movie rendering job (e.g., "done", "pending", "error").
  + `message`: An error message, if any.
  + `url`: The URL where the rendered video can be downloaded. This field is only present if the `status` is "done".
  + `ass`: The URL where the generated subtitles can be downloaded. This field is only present if the `status` is "done".
  + `created_at`: The date and time the job was initiated.
  + `ended_at`: The date and time the job completed.
  + `duration`: The duration of the rendered video in seconds.
  + `size`: The size of the rendered video file in bytes.
  + `width`: The width of the rendered video in pixels.
  + `height`: The height of the rendered video in pixels.
* `remaining_quota`: An object containing information about your account's remaining quota:
  + `time`: The number of credits remaining in your account.

A non successful request returns a JSON object with details about the movie status.

* **Status Code:** `200`
* **Body (Error):**

```
{
  "success": true,
  "movie": {
    "success": false,
    "status": "error",
    "message": "Error: Scene #1 Element #2: The element type 'video' requires a 'src' property.",
    "project": "JkGxEoPRF9EgRb32",
    "url": null,
    "ass": false,
    "created_at": "2023-03-05T09:42:27.244Z",
    "ended_at": null,
    "rendering_time": null
  },
  "remaining_quota": {
    "time": 1807
  }
}
```

This indicates an error occurred (e.g., the project ID was invalid).

* `success`: Indicates if the request was successful.
* `movie`: An object containing details about the movie:
  + `success`: Indicates if the movie rendering was successful. In case of error, this will be `false`.
  + `status`: The current status of the movie rendering job ("error").
  + `message`: An error message, if any.
  + `project`: The project ID of the movie rendering job.
* `remaining_quota`: An object containing information about your account's remaining quota:
  + `time`: The number of credits remaining in your account.

**Possible `status` values:**

* `pending`: The job is queued and waiting to be processed.
* `running`: The video is currently being rendered.
* `done`: The video has been successfully rendered and is available for download.
* `error`: An error occurred during the rendering process. Check the `message` field for details.

The `message` field provides more detailed information about the current status of the movie rendering job.

[← Previous: API Endpoints](/docs/v2/api-reference/api-endpoints)[Next: JSON Syntax →](/docs/v2/api-reference/json-syntax)

---

## Content from: https://json2video.com/docs/v2/api-reference/json-syntax

# JSON Syntax[#](#json-syntax "Permalink")

The Movie JSON Schema defines the structure of the JSON object that you send to the JSON2Video API to create a video. This schema outlines the properties that control the video's composition, including scenes, elements, and overall settings. Understanding this schema is crucial for effectively using the API to generate customized videos programmatically.

The following sections detail the properties and structure within the Movie JSON Schema, providing a comprehensive guide for creating and customizing your videos. Subsequent pages will delve into the Movie, Scenes and the different Element objects.

[← Previous: Movies](/docs/v2/api-reference/api-endpoints/movies)[Next: Movie →](/docs/v2/api-reference/json-syntax/movie)

---

## Content from: https://json2video.com/docs/v2/api-reference/json-syntax/movie

# Movie object[#](#movie-object "Permalink")

**Type:** object

The `movie` object defines the overall structure and settings for the video to be rendered. It encompasses properties such as resolution, dimensions (width and height), quality, client-specific data, scenes, elements and export settings. Use this object to configure the visual and functional aspects of the final video output.

## Required Properties[#](#required-properties "Permalink")

* `scenes`

## Properties[#](#properties "Permalink")

### cache[#](#cache "Permalink")

If `true`, the system will attempt to use a previously rendered (cached) version of the movie, if available. This can significantly speed up processing time for subsequent requests with identical configurations. If `false`, a new render will always be performed. The default value is `true`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `true` |

### client-data[#](#client-data "Permalink")

A set of custom key-value pairs that you can define to attach arbitrary data to the movie. This data will be included in the response of GET requests for the movie and also included in any webhook payloads triggered by the movie's processing. This allows you to pass information relevant to your application or workflow along with the video processing status. The values can be strings, numbers, booleans, or any valid JSON type.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |
| **Default Value** | `{}` |

### comment[#](#comment "Permalink")

A field for adding descriptive notes or internal memos related to the movie. This comment is for your reference and does not affect the rendering process. It can be used to track project details, client information, or any other relevant information.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### elements[#](#elements "Permalink")

An array of `element` objects containing the elements to be rendered in the movie. Elements can include videos, images, text, HTML snippets, components, templates, audio, AI generated voiceovers, audiograms, and subtitles. The order of the elements within this array determines their layering in the video, with elements appearing later in the array rendered on top of earlier elements.

|  |  |
| --- | --- |
| **Type** | array |
| **Required** | No |

#### Array Items[#](#array-items "Permalink")

|  |  |
| --- | --- |

### exports[#](#exports "Permalink")

An array of export configurations for the movie. Each configuration defines how the movie will be exported, allowing you to specify different formats, resolutions, or other export-specific settings. See the documentation for available export options and their configurations.

|  |  |
| --- | --- |
| **Type** | array |
| **Required** | No |

#### Array Items[#](#array-items-1 "Permalink")

|  |  |
| --- | --- |

### height[#](#height "Permalink")

Defines the height of the movie in pixels. This property is applicable and required when the `resolution` is set to `custom`. The value must be an integer between 50 and 3840. A default value of 360 is applied if a custom resolution is selected and no height is specified.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Default Value** | `360` |
| **Minimum Value** | 50 |
| **Maximum Value** | 3840 |

### id[#](#id "Permalink")

A unique identifier for the movie. The system can automatically generate a random string if one is not provided.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"@randomString"` |

### quality[#](#quality "Permalink")

Defines the quality level of the final rendered movie, impacting both visual fidelity and rendering speed. Lower quality settings will result in faster rendering times but may produce a less visually appealing output. The available options are `low`, `medium`, and `high`, with `high` being the default for optimal visual quality.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"high"` |
| **Enum Values** | `low`, `medium`, `high` |

### resolution[#](#resolution "Permalink")

Defines the resolution (size) of the video. Choose a preset value to quickly set common video dimensions, or select `custom` to specify the exact `width` and `height` in pixels. Available presets include standard definition (`sd`), high definition (`hd`), full high definition (`full-hd`), a square aspect ratio (`squared`), and resolutions optimized for Instagram Stories (`instagram-story`), Instagram Feed posts (`instagram-feed`), Twitter landscape (`twitter-landscape`), and Twitter portrait (`twitter-portrait`). When using `custom`, the `width` and `height` properties become required.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"custom"` |
| **Enum Values** | `sd`, `hd`, `full-hd`, `squared`, `instagram-story`, `instagram-feed`, `twitter-landscape`, `twitter-portrait`, `custom` |

### scenes[#](#scenes "Permalink")

An array of `scene` objects that define the sequence of content displayed in the movie. Each scene represents a distinct segment of the video and can contain various elements such as videos, images, text, and more. The order of the scenes in the array determines the playback order in the final video. This property is required but can be an empty array.

|  |  |
| --- | --- |
| **Type** | array |
| **Required** | Yes |

#### Array Items[#](#array-items-2 "Permalink")

|  |  |
| --- | --- |

### variables[#](#variables "Permalink")

Defines a set of variables that can be used to dynamically populate templates or other elements within the movie. The value of each variable can be a string, number, boolean, or any other valid JSON type. Variable names are restricted to letters, numbers, and underscores. This allows you to personalize your video content by injecting dynamic values during the rendering process.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |
| **Default Value** | `{}` |

### width[#](#width "Permalink")

Defines the width of the movie in pixels. This property is only applicable and required when the `resolution` is set to `custom`. The value must be an integer between 50 and 3840. A default value of 640 is applied if a custom resolution is selected and no width is specified.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Default Value** | `640` |
| **Minimum Value** | 50 |
| **Maximum Value** | 3840 |

[← Previous: JSON Syntax](/docs/v2/api-reference/json-syntax)[Next: Scene →](/docs/v2/api-reference/json-syntax/scene)

---

## Content from: https://json2video.com/docs/v2/api-reference/json-syntax/scene

# Scene object[#](#scene-object "Permalink")

**Type:** object

Defines a scene within the movie, representing a distinct segment of video content. Each scene can contain multiple elements like videos, images, and text. The order of scenes in the `scenes` array of the `movie` object determines their playback sequence in the final video. Scenes cannot overlap in time.

## Properties[#](#properties "Permalink")

### background-color[#](#background-color "Permalink")

Defines the background color of the scene. Use a hexadecimal color code (e.g., `#FF0000` for red) to specify the desired color, or set it to `transparent` for a see-through background. The default background color is black (`#000000`).

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"#000000"` |

### cache[#](#cache "Permalink")

If `true`, the system will attempt to reuse a previously rendered (cached) version of this scene, if an identical version is available. This can significantly speed up processing. If `false`, a new render of the scene will always be performed. The default value is `true`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `true` |

### comment[#](#comment "Permalink")

A field for adding descriptive notes or internal memos related to the scene. This comment is for your reference and does not affect the rendering process. It can be used to keep notes about the scene like describing the content or the purpose of the scene.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### condition[#](#condition "Permalink")

An expression that determines whether the scene will be included in the final video. The scene is rendered only if the condition evaluates to true. If the condition evaluates to false or it is an empty string, the scene will be skipped and not included in the movie. The expression can be any valid string that evaluates to a boolean value.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### duration[#](#duration "Permalink")

Defines the duration of the scene in seconds. Use a positive value to specify the scene's length. A value of -1 indicates that the scene should automatically adjust its duration to accommodate all elements it contains.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `-1` |
| **Format** | float |

### elements[#](#elements "Permalink")

An array of `element` objects containing the elements to be rendered in the scene. Elements can include videos, images, text, HTML snippets, components, templates, audio, AI generated voiceovers, audiograms, and subtitles. The order of the elements within this array determines their layering in the scene, with elements appearing later in the array rendered on top of earlier elements.

|  |  |
| --- | --- |
| **Type** | array |
| **Required** | No |

#### Array Items[#](#array-items "Permalink")

|  |  |
| --- | --- |

### id[#](#id "Permalink")

A unique identifier for the scene within the movie. This string allows you to reference and manage individual scenes. The system can automatically generate a random string if one is not provided.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"@randomString"` |

### variables[#](#variables "Permalink")

Defines scene-specific variables that can be used to dynamically populate templates or other elements within the scene. The value of each variable can be a string, number, boolean, or any other valid JSON type. Variable names are restricted to letters, numbers, and underscores, allowing you to personalize your video content at the scene level by injecting dynamic values during the rendering process.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |
| **Default Value** | `{}` |

[← Previous: Movie](/docs/v2/api-reference/json-syntax/movie)[Next: Element →](/docs/v2/api-reference/json-syntax/element)

---

## Content from: https://json2video.com/docs/v2/api-reference/json-syntax/element

# Element[#](#element "Permalink")

The `element` object represents the fundamental building block of a movie or scene in JSON2Video. Elements are the content components that make up your video, such as images, videos, text, audio, and more. The properties and behavior of an `element` are determined by its specific type.

## Element Types[#](#element-types "Permalink")

JSON2Video supports a variety of element types, each with its own unique properties and capabilities:

* **`image`**: Displays a static image. See [Image element](https://json2video.com/docs/v2/api-reference/json-syntax/element/image).
* **`video`**: Includes a video clip. See [Video element](https://json2video.com/docs/v2/api-reference/json-syntax/element/video).
* **`text`**: Overlays text on the video. See [Text element](https://json2video.com/docs/v2/api-reference/json-syntax/element/text).
* **`component`**: Inserts a pre-designed, animated component. See [Component element](https://json2video.com/docs/v2/api-reference/json-syntax/element/component).
* **`audio`**: Includes an audio track. See [Audio element](https://json2video.com/docs/v2/api-reference/json-syntax/element/audio).
* **`voice`**: Generates a voiceover from text. See [Voice element](https://json2video.com/docs/v2/api-reference/json-syntax/element/voice).
* **`audiogram`**: Visualizes an audio waveform. See [Audiogram element](https://json2video.com/docs/v2/api-reference/json-syntax/element/audiogram).
* **`subtitles`**: Adds subtitles to the video. See [Subtitles element](https://json2video.com/docs/v2/api-reference/json-syntax/element/subtitles).

## General Properties[#](#general-properties "Permalink")

All element types share a set of common properties that control their behavior and appearance:

* **`id`**: A unique identifier for the element.
* **`condition`**: An expression that determines whether the element will be rendered.
* **`variables`**: Local variables specific to this element.
* **`comment`**: A field for descriptive notes or internal memos.
* **`duration`**: The length of time the element is visible or audible.
* **`start`**: The starting point of the element within its container's timeline.
* **`extra-time`**: Adds additional time after the element's duration ends.
* **`z-index`**: Determines the stacking order of elements (layering).
* **`cache`**: Controls whether the element is rendered from the cache.
* **`fade-in`**: The duration, in seconds, of the fade-in effect.
* **`fade-out`**: The duration, in seconds, of the fade-out effect.

## How to use elements[#](#how-to-use-elements "Permalink")

Elements are added to scenes or to the movie's elements array. The only difference is that elements added directly to the movie will be displayed on top of all scenes, while elements added to a scene will only be displayed in that scene.

### Example[#](#example "Permalink")

```
{
  "resolution": "full-hd",
  "scenes": [
    {
      "elements": [
        {
          "type": "image",
          "src": "https://example.com/path/to/my/image.png"
        },
        {
          "type": "text",
          "text": "My Awesome Text!",
          "style": "001"
        }
      ]
    }
  ]
}
```

[← Previous: Scene](/docs/v2/api-reference/json-syntax/scene)[Next: Image →](/docs/v2/api-reference/json-syntax/element/image)

---

## Content from: https://json2video.com/docs/v2/api-reference/json-syntax/element/image

# Image element[#](#image-element "Permalink")

**Type:** object

Defines an image element to be included in the video. The image source can be specified using a URL, supporting common image formats like JPG, PNG, and GIF, or generated using AI from a text prompt. This element supports properties for visual positioning and sizing.

## Working with the Image element[#](#working-with-the-image-element "Permalink")

### Using image files[#](#using-image-files "Permalink")

To include an image in your video, you need to provide a direct URL to a file in a common format such as JPEG or PNG. This URL should be assigned to the `src` property and must be publicly accessible to ensure the image loads correctly during video rendering.

If the image is hosted on a restricted server or requires authentication, it may not be retrievable by JSON2Video. Ensure that the URL is valid and does not require login credentials.

**Example**

This example creates an horizontal video showing an image (flower-bee.jpg) during 10 seconds.

```
{
  "resolution": "full-hd",
  "scenes": [
    {
      "elements": [
        {
          "type": "image",
          "src": "https://cdn.json2video.com/assets/images/flower-bee.jpg",
          "duration": 10
        }
      ]
    }
  ]
}
```

#### Google Drive and Dropbox[#](#google-drive-and-dropbox "Permalink")

JSON2Video also supports images stored in Google Drive and Dropbox, but they must be set to public access. If the file is private or requires special permissions, the system will be unable to fetch it for video creation.

### Generating AI images dynamically[#](#generating-ai-images-dynamically "Permalink")

In addition to using pre-existing image files, JSON2Video allows you to generate AI images dynamically using text prompts. This is useful when you don't have access to stock images or need visuals that match specific content, such as a voiceover or theme.

Currently, JSON2Video supports AI image generation using models from different providers. The available models include:

* **Flux Pro** (`flux-pro`) – Designed for generating high-quality, realistic images.
* **Flux Schnell** (`flux-schnell`) – Provides good quality and fast image generation.
* **Freepik Classic** (`freepik-classic`) – Provides visually appealing digital artwork and illustrations.

Since AI-generated images require additional processing, they may consume extra credits. For more details, refer to [Credits Consumption](/docs/v2/pricing/credits-consumption).

**Example**

This example creates a vertical video with an AI generated image that fills the full video canvas.

```
{
  "resolution": "custom",
  "width": 1080,
  "height": 1920,
  "scenes": [
    {
      "elements": [
        {
          "type": "image",
          "model": "freepik-classic",
          "prompt": "A stunning sunset over a calm ocean, with vibrant orange, pink, and purple hues reflecting on the water.",
          "aspect-ratio": "vertical",
          "resize": "fill",
          "duration": 10
        }
      ]
    }
  ]
}
```

By leveraging AI image generation, you can dynamically create unique and context-relevant visuals without relying on external image sources.

## Properties[#](#properties "Permalink")

### aspect-ratio[#](#aspect-ratio "Permalink")

Defines the aspect ratio of the content generated by the AI model. This property allows you to specify the desired shape of the content, with options for `horizontal` (wide), `vertical` (tall), and `squared` (equal width and height). The default value is `horizontal`.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"horizontal"` |
| **Enum Values** | `horizontal`, `vertical`, `squared` |

### cache[#](#cache "Permalink")

If `true`, the system will attempt to retrieve and use a previously rendered (cached) version of this element, if an identical version is available. This can significantly reduce processing time. If `false`, a new render of the element will always be performed, regardless of whether a cached version exists. The default value is `true`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `true` |
| **Format** | boolean |

### chroma-key[#](#chroma-key "Permalink")

Allows you to define a color or a range of colors within the element that will be rendered as transparent. This effect is commonly known as chroma keying or 'green screen'. The `color` property specifies the base color to be made transparent, while the optional `tolerance` property adjusts the sensitivity of the transparency, allowing you to define a range of similar colors to also be included in the transparency effect.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **color**: (string, required) - Set the color for which alpha will be set to 0 (full transparency)

  + Example: `"#00b140"`
* **tolerance**: (integer, optional) - Makes the selection more or less sensitive to changes in color. A value of 1 will select only the provided color. A value of 100 will select all colors, so the full canvas

  + Default: `25`
  + Minimum: `1`
  + Maximum: `100`

### comment[#](#comment "Permalink")

A field for adding descriptive notes or internal memos related to the element. This comment is for your reference and does not affect the rendering process. It can be used to keep notes about the element like describing the content or the purpose of the element.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### condition[#](#condition "Permalink")

A string containing an expression that determines whether the element will be rendered. The element is rendered only if the condition evaluates to true. If the condition is false or an empty string, the element will be skipped and not included in the scene or movie.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### connection[#](#connection "Permalink")

The ID of a pre-configured connection to use for generating the asset. Connections are defined from the Dashboard. Specifying a connection ID allows you to use your own account's API key in the AI model provider (for example, your own account on Replicate or Freepik). If no connection ID is provided, the default JSON2Video's API keys will be used, which may deduct credits for the API calls.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### correction[#](#correction "Permalink")

Defines image and video correction settings, allowing you to adjust the visual characteristics of the element. This includes properties for adjusting contrast, brightness, saturation, and gamma, enabling fine-tuning of the element's appearance. Values in the edge of the range may result in the element being irrecognizable.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **brightness**: (number, optional) - Adjust the brightness

  + Default: `0`
  + Minimum: `-1`
  + Maximum: `1`
* **contrast**: (number, optional) - Adjust the contrast

  + Default: `1`
  + Minimum: `-1000`
  + Maximum: `1000`
* **gamma**: (number, optional) - Adjust the gamma

  + Default: `1`
  + Minimum: `0.1`
  + Maximum: `10`
* **saturation**: (number, optional) - Adjust the saturation

  + Default: `1`
  + Minimum: `0`
  + Maximum: `3`

### crop[#](#crop "Permalink")

Defines the cropping area of the element. It allows you to specify a rectangular region of the element to display, effectively cropping the external parts of the provided area. The `x` and `y` properties define the top-left corner of the cropping rectangle, while the `width` and `height` properties determine the dimensions of the cropped area.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **height**: (integer, required) - Sets the height of the cropping area
* **width**: (integer, required) - Sets the width of the cropping area
* **x**: (integer, optional) - Sets the left point of cropping

  + Default: `0`
* **y**: (integer, optional) - Sets the top point of cropping

  + Default: `0`

### duration[#](#duration "Permalink")

Defines the duration of the element in seconds. Use a positive value to specify the element's length. A value of -1 instructs the system to automatically set the duration based on the intrinsic length of the asset or file used by the element. A value of -2 sets the element's duration to match that of its parent scene (if it's inside a scene) or the movie (if it's in the movie elements array).

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `-1` |
| **Format** | float |

### extra-time[#](#extra-time "Permalink")

The amount of time, in seconds, to extend the element's duration beyond its natural length. This allows the element to linger on screen after its content has finished playing or displaying. For example, setting `extra-time` to 0.5 will keep the element visible for an additional half-second.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | float |

### fade-in[#](#fade-in "Permalink")

The duration, in seconds, of the fade-in effect applied to the element's appearance. A value of `0` means no fade-in effect. Larger values result in a longer fade-in duration. The value must be a non-negative number.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Format** | float |
| **Minimum Value** | 0 |

### fade-out[#](#fade-out "Permalink")

The duration, in seconds, of the fade-out effect applied to the element's disappearance. A value of `0` means no fade-out effect. Larger values result in a longer fade-out duration. The value must be a non-negative number.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Format** | float |
| **Minimum Value** | 0 |

### flip-horizontal[#](#flip-horizontal "Permalink")

If `true`, the element will be flipped horizontally, creating a mirror image effect. The default value is `false`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `false` |

### flip-vertical[#](#flip-vertical "Permalink")

If `true`, the element will be flipped vertically, creating an upside-down image. The default value is `false`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `false` |

### height[#](#height "Permalink")

Sets the height of the element in pixels, scaling the element up or down as needed to fit the specified height. A value of -1 maintains the element's original aspect ratio when resizing based on the width property. If 'resize' is set, the 'height' property is ignored. The minimum accepted value is -1.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Default Value** | `-1` |
| **Minimum Value** | -1 |

### id[#](#id "Permalink")

A unique identifier for the element within the movie. This string allows you to reference and manage individual elements. If not provided, the system will automatically generate a random string.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"@randomString"` |

### mask[#](#mask "Permalink")

URL to a PNG or video file that defines a mask, controlling the transparency of the element. The mask uses a grayscale color scheme: black areas render the element fully transparent, white areas render it fully opaque, and shades of gray create varying levels of partial transparency. This allows you to create complex shapes and effects by selectively hiding portions of the element.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### model[#](#model "Permalink")

The generative AI model to use. Refer to the documentation above to see a list of available models. The selected model will be used to generate the asset with AI.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### model-settings[#](#model-settings "Permalink")

A set of optional settings specific to the chosen generative AI model. These settings allow you to fine-tune the asset generation process and are passed directly to the underlying AI model. The available settings will vary depending on the model selected and are detailed in the model's documentation.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

### pan[#](#pan "Permalink")

Specifies the direction to pan the element within its container. Valid values are `left`, `top`, `right`, `bottom`, and their combinations like `top-left`. If the `zoom` property is also specified, the pan will occur while zooming. If `zoom` is not specified, the element will pan without zooming.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Enum Values** | `left`, `top`, `right`, `bottom`, `top-left`, `top-right`, `bottom-left`, `bottom-right` |

### pan-crop[#](#pan-crop "Permalink")

When panning an element, this boolean property determines whether the element is stretched and cropped to fill the movie canvas. If set to `true` (default), the element will be stretched and cropped during panning. If set to `false`, the element will not be stretched and potentially leave empty space within the movie canvas. Example: if `pan-crop` is set to `false` and the movie canvas and element have the same size, panning the element to the left may leave a black bar on the right side of the movie canvas as the element moves to the left. If `pan-crop` is set to `true` (default), the element will be stretched and cropped during panning, so the element will effectively fill the movie canvas.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `true` |

### pan-distance[#](#pan-distance "Permalink")

Defines the distance the element pans within its container when the `pan` property is specified. This value, expressed as a floating-point number, determines the amount of movement during the panning effect. Higher values result in faster and more pronounced panning. The allowed range is from 0.01 to 0.5, with a default value of 0.1.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0.1` |
| **Format** | float |
| **Minimum Value** | 0.01 |
| **Maximum Value** | 0.5 |

### position[#](#position "Permalink")

Specifies the position of the element within the movie canvas. Choose from predefined positions like 'top-left', 'top-right', 'bottom-right', 'bottom-left', and 'center-center' to quickly place the element. Selecting 'custom' enables precise positioning using the `x` and `y` properties to define the element's horizontal and vertical coordinates.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"custom"` |
| **Enum Values** | `top-left`, `top-right`, `bottom-right`, `bottom-left`, `center-center`, `custom` |

### prompt[#](#prompt "Permalink")

The text prompt that guides the generative AI model in creating the desired asset. This prompt should clearly and concisely describe the type of content you want the model to generate. The quality and specificity of the prompt directly influence the output of the AI model.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### resize[#](#resize "Permalink")

Defines how the element should be resized to fit within the movie canvas. The values `cover` and `fill` stretch the element to completely cover the movie canvas, potentially cropping parts of the element. The values `fit` and `contain` ensure the entire element is visible, potentially leaving empty space within the canvas. When `resize` is set, the `width` and `height` properties are ignored, as the element's size is determined by the chosen resize mode. The value `cover`is a synonym for `fill` and `contain`is a synonym for `fit`.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Enum Values** | `cover`, `fill`, `fit`, `contain` |

### rotate[#](#rotate "Permalink")

Defines the rotation properties of the element. It allows you to specify the angle of rotation and the time it takes to complete the rotation, enabling animated rotation effects.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **angle**: (number, required) - Sets the angle of rotation

  + Default: `0`
  + Minimum: `-360`
  + Maximum: `360`
* **speed**: (number, optional) - Sets the time it takes to rotate the provided angle. A zero value means no movement

  + Default: `0`
  + Minimum: `0`

### src[#](#src "Permalink")

The URL to the image asset file. This should be a publicly accessible URL pointing to the image file, which can be in JPG, PNG, GIF, or any other common image format.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Format** | uri |

### start[#](#start "Permalink")

The element's start time, in seconds, determines when it begins playing within its container's timeline. This time is relative to the beginning of the scene it's in or, if the element is part of the movie's elements array, relative to the beginning of the movie itself. The default value is 0, meaning the element starts at the beginning of its container's timeline.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | float |

### type[#](#type "Permalink")

This field specifies the element's type and must be set to `image` for image elements.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Enum Values** | `image` |

### variables[#](#variables "Permalink")

Defines local variables specific to this element. These variables can be used to dynamically alter the element's properties or content during the rendering process. Variable names must consist of only letters, numbers, and underscores.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |
| **Default Value** | `{}` |

### width[#](#width "Permalink")

Sets the width of the element in pixels. The element will be scaled up or down to fit the specified width. A value of -1 instructs the system to maintain the element's original aspect ratio when resizing based on the height property. If 'resize' is set, the 'width' property is ignored. The minimum accepted value is -1.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Default Value** | `-1` |
| **Minimum Value** | -1 |

### x[#](#x "Permalink")

The horizontal position of the element within the movie canvas, measured in pixels. This property is only applicable when the `position` property is set to `custom`. A value of `0` places the element at the left edge of the movie canvas. Higher integer values move the element to the right.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |

### y[#](#y "Permalink")

Sets the vertical position of the element within the movie canvas, measured in pixels. This property is only applicable when the `position` property is set to `custom`. A value of `0` places the element at the top edge of the movie canvas. Higher integer values move the element downwards.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |

### z-index[#](#z-index "Permalink")

Element's z-index, determining its stacking order within the video. Higher values bring the element to the front, obscuring elements with lower values. Lower values send the element to the back, potentially behind other elements. The value must be an integer between -99 and 99; the default is 0. The natural way of layering elements is by the order of the elements in the `elements` array. If by any reason this does not work in your case, you can use the `z-index` property to manually control the stacking order.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |
| **Minimum Value** | -99 |
| **Maximum Value** | 99 |

### zoom[#](#zoom "Permalink")

Zooms the element by a specified percentage. Use positive values (1-10) to zoom in and negative values (-1 to -10) to zoom out. A value of 0 results in no zoom. Combine with the `pan` property to control the focal point during zooming.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Minimum Value** | -10 |
| **Maximum Value** | 10 |

## Examples[#](#examples "Permalink")

### Example 1: Simple Image Element[#](#example-1-simple-image-element "Permalink")

This example demonstrates a movie with three images displayed in a slideshow.
Each image is displayed for 3 seconds with a zoom effect and a pan effect.

```
{
  "resolution": "full-hd",
  "scenes": [
    {
      "comment": "First scene",
      "duration": 3,
      "elements": [
        {
          "type": "image",
          "src": "https://cdn.json2video.com/assets/images/london-01.jpg",
          "zoom": 3,
          "pan": "right"
        }
      ]
    },
    {
      "comment": "Second scene",
      "duration": 3,
      "elements": [
        {
          "type": "image",
          "src": "https://cdn.json2video.com/assets/images/london-02.jpg",
          "zoom": -3,
          "pan": "left"
        }
      ]
    },
    {
      "comment": "Third scene",
      "duration": 3,
      "elements": [
        {
          "type": "image",
          "src": "https://cdn.json2video.com/assets/images/london-03.jpg",
          "zoom": 3,
          "pan": "top"
        }
      ]
    }
  ]
}
```

### Example 2: Image with Scaling and Rotation[#](#example-2-image-with-scaling-and-rotation "Permalink")

This example shows how to scale an image and rotate it.

```
{
  "scenes": [
    {
      "elements": [
        {
          "type": "image",
          "src": "https://assets.json2video.com/assets/images/sunglasses-emoji-small.png",
          "x": 835,
          "y": 575,
          "width": 250,
          "height": 250,
          "rotate": {
            "angle": 360,
            "speed": 1
          }
        }
      ]
    }
  ]
}
```

[← Previous: Element](/docs/v2/api-reference/json-syntax/element)[Next: Video →](/docs/v2/api-reference/json-syntax/element/video)

---

## Content from: https://json2video.com/docs/v2/api-reference/json-syntax/element/video

# Video element[#](#video-element "Permalink")

**Type:** object

Defines a video element that allows you to incorporate video content into your scenes or movie. Specify the video source using a URL pointing to a video file (MP4, MKV, MOV, etc.). Control playback behavior by defining the number of times the video loops and the starting point within the video using the seek property.

## Required Properties[#](#required-properties "Permalink")

* `type`

## Properties[#](#properties "Permalink")

### cache[#](#cache "Permalink")

If `true`, the system will attempt to retrieve and use a previously rendered (cached) version of this element, if an identical version is available. This can significantly reduce processing time. If `false`, a new render of the element will always be performed, regardless of whether a cached version exists. The default value is `true`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `true` |
| **Format** | boolean |

### chroma-key[#](#chroma-key "Permalink")

Allows you to define a color or a range of colors within the element that will be rendered as transparent. This effect is commonly known as chroma keying or 'green screen'. The `color` property specifies the base color to be made transparent, while the optional `tolerance` property adjusts the sensitivity of the transparency, allowing you to define a range of similar colors to also be included in the transparency effect.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **color**: (string, required) - Set the color for which alpha will be set to 0 (full transparency)

  + Example: `"#00b140"`
* **tolerance**: (integer, optional) - Makes the selection more or less sensitive to changes in color. A value of 1 will select only the provided color. A value of 100 will select all colors, so the full canvas

  + Default: `25`
  + Minimum: `1`
  + Maximum: `100`

### comment[#](#comment "Permalink")

A field for adding descriptive notes or internal memos related to the element. This comment is for your reference and does not affect the rendering process. It can be used to keep notes about the element like describing the content or the purpose of the element.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### condition[#](#condition "Permalink")

A string containing an expression that determines whether the element will be rendered. The element is rendered only if the condition evaluates to true. If the condition is false or an empty string, the element will be skipped and not included in the scene or movie.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### correction[#](#correction "Permalink")

Defines image and video correction settings, allowing you to adjust the visual characteristics of the element. This includes properties for adjusting contrast, brightness, saturation, and gamma, enabling fine-tuning of the element's appearance. Values in the edge of the range may result in the element being irrecognizable.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **brightness**: (number, optional) - Adjust the brightness

  + Default: `0`
  + Minimum: `-1`
  + Maximum: `1`
* **contrast**: (number, optional) - Adjust the contrast

  + Default: `1`
  + Minimum: `-1000`
  + Maximum: `1000`
* **gamma**: (number, optional) - Adjust the gamma

  + Default: `1`
  + Minimum: `0.1`
  + Maximum: `10`
* **saturation**: (number, optional) - Adjust the saturation

  + Default: `1`
  + Minimum: `0`
  + Maximum: `3`

### crop[#](#crop "Permalink")

Defines the cropping area of the element. It allows you to specify a rectangular region of the element to display, effectively cropping the external parts of the provided area. The `x` and `y` properties define the top-left corner of the cropping rectangle, while the `width` and `height` properties determine the dimensions of the cropped area.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **height**: (integer, required) - Sets the height of the cropping area
* **width**: (integer, required) - Sets the width of the cropping area
* **x**: (integer, optional) - Sets the left point of cropping

  + Default: `0`
* **y**: (integer, optional) - Sets the top point of cropping

  + Default: `0`

### duration[#](#duration "Permalink")

Defines the duration of the element in seconds. Use a positive value to specify the element's length. A value of -1 instructs the system to automatically set the duration based on the intrinsic length of the asset or file used by the element. A value of -2 sets the element's duration to match that of its parent scene (if it's inside a scene) or the movie (if it's in the movie elements array).

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `-1` |
| **Format** | float |

### extra-time[#](#extra-time "Permalink")

The amount of time, in seconds, to extend the element's duration beyond its natural length. This allows the element to linger on screen after its content has finished playing or displaying. For example, setting `extra-time` to 0.5 will keep the element visible for an additional half-second.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | float |

### fade-in[#](#fade-in "Permalink")

The duration, in seconds, of the fade-in effect applied to the element's appearance. A value of `0` means no fade-in effect. Larger values result in a longer fade-in duration. The value must be a non-negative number.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Format** | float |
| **Minimum Value** | 0 |

### fade-out[#](#fade-out "Permalink")

The duration, in seconds, of the fade-out effect applied to the element's disappearance. A value of `0` means no fade-out effect. Larger values result in a longer fade-out duration. The value must be a non-negative number.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Format** | float |
| **Minimum Value** | 0 |

### flip-horizontal[#](#flip-horizontal "Permalink")

If `true`, the element will be flipped horizontally, creating a mirror image effect. The default value is `false`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `false` |

### flip-vertical[#](#flip-vertical "Permalink")

If `true`, the element will be flipped vertically, creating an upside-down image. The default value is `false`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `false` |

### height[#](#height "Permalink")

Sets the height of the element in pixels, scaling the element up or down as needed to fit the specified height. A value of -1 maintains the element's original aspect ratio when resizing based on the width property. If 'resize' is set, the 'height' property is ignored. The minimum accepted value is -1.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Default Value** | `-1` |
| **Minimum Value** | -1 |

### id[#](#id "Permalink")

A unique identifier for the element within the movie. This string allows you to reference and manage individual elements. If not provided, the system will automatically generate a random string.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"@randomString"` |

### loop[#](#loop "Permalink")

Specifies the number of times the video will play. Setting this value to -1 results in the video looping indefinitely. The default value of 1 ensures that the video plays only once.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Minimum Value** | -1 |

### mask[#](#mask "Permalink")

URL to a PNG or video file that defines a mask, controlling the transparency of the element. The mask uses a grayscale color scheme: black areas render the element fully transparent, white areas render it fully opaque, and shades of gray create varying levels of partial transparency. This allows you to create complex shapes and effects by selectively hiding portions of the element.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### muted[#](#muted "Permalink")

If `true`, the audio track of the element (e.g., a video or audio file) will be muted, effectively silencing it. If `false` or omitted, the audio will play according to its original volume or the `volume` setting.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `false` |

### pan[#](#pan "Permalink")

Specifies the direction to pan the element within its container. Valid values are `left`, `top`, `right`, `bottom`, and their combinations like `top-left`. If the `zoom` property is also specified, the pan will occur while zooming. If `zoom` is not specified, the element will pan without zooming.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Enum Values** | `left`, `top`, `right`, `bottom`, `top-left`, `top-right`, `bottom-left`, `bottom-right` |

### pan-crop[#](#pan-crop "Permalink")

When panning an element, this boolean property determines whether the element is stretched and cropped to fill the movie canvas. If set to `true` (default), the element will be stretched and cropped during panning. If set to `false`, the element will not be stretched and potentially leave empty space within the movie canvas. Example: if `pan-crop` is set to `false` and the movie canvas and element have the same size, panning the element to the left may leave a black bar on the right side of the movie canvas as the element moves to the left. If `pan-crop` is set to `true` (default), the element will be stretched and cropped during panning, so the element will effectively fill the movie canvas.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `true` |

### pan-distance[#](#pan-distance "Permalink")

Defines the distance the element pans within its container when the `pan` property is specified. This value, expressed as a floating-point number, determines the amount of movement during the panning effect. Higher values result in faster and more pronounced panning. The allowed range is from 0.01 to 0.5, with a default value of 0.1.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0.1` |
| **Format** | float |
| **Minimum Value** | 0.01 |
| **Maximum Value** | 0.5 |

### position[#](#position "Permalink")

Specifies the position of the element within the movie canvas. Choose from predefined positions like 'top-left', 'top-right', 'bottom-right', 'bottom-left', and 'center-center' to quickly place the element. Selecting 'custom' enables precise positioning using the `x` and `y` properties to define the element's horizontal and vertical coordinates.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"custom"` |
| **Enum Values** | `top-left`, `top-right`, `bottom-right`, `bottom-left`, `center-center`, `custom` |

### resize[#](#resize "Permalink")

Defines how the element should be resized to fit within the movie canvas. The values `cover` and `fill` stretch the element to completely cover the movie canvas, potentially cropping parts of the element. The values `fit` and `contain` ensure the entire element is visible, potentially leaving empty space within the canvas. When `resize` is set, the `width` and `height` properties are ignored, as the element's size is determined by the chosen resize mode. The value `cover`is a synonym for `fill` and `contain`is a synonym for `fit`.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Enum Values** | `cover`, `fill`, `fit`, `contain` |

### rotate[#](#rotate "Permalink")

Defines the rotation properties of the element. It allows you to specify the angle of rotation and the time it takes to complete the rotation, enabling animated rotation effects.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **angle**: (number, required) - Sets the angle of rotation

  + Default: `0`
  + Minimum: `-360`
  + Maximum: `360`
* **speed**: (number, optional) - Sets the time it takes to rotate the provided angle. A zero value means no movement

  + Default: `0`
  + Minimum: `0`

### seek[#](#seek "Permalink")

Specifies the time, in seconds, at which the video file should start playing. Positive values seek forward from the beginning, while negative values seek backward from the end of the video. By default, the video starts at the beginning (0 seconds).

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | float |

### src[#](#src "Permalink")

The URL to the video asset file. This should be a publicly accessible URL pointing to the image file, which can be in MP4, MKV, MOV, or any other common video format.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Format** | uri |

### start[#](#start "Permalink")

The element's start time, in seconds, determines when it begins playing within its container's timeline. This time is relative to the beginning of the scene it's in or, if the element is part of the movie's elements array, relative to the beginning of the movie itself. The default value is 0, meaning the element starts at the beginning of its container's timeline.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | float |

### type[#](#type "Permalink")

This field specifies the element's type and must be set to `video` for video elements.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | Yes |
| **Enum Values** | `video` |

### variables[#](#variables "Permalink")

Defines local variables specific to this element. These variables can be used to dynamically alter the element's properties or content during the rendering process. Variable names must consist of only letters, numbers, and underscores.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |
| **Default Value** | `{}` |

### volume[#](#volume "Permalink")

Controls the volume gain of the audio track (e.g., a video or audio file). This is a multiplier applied to the original audio level. A value of `1` represents the original volume (no gain), values greater than `1` increase the volume, and values less than `1` decrease the volume. The acceptable range is from 0 to 10. For background music with voiceovers, a usual value is `0.2`. Increasing the volume of the audio track can reduce the quality of the audio.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `1` |
| **Minimum Value** | 0 |
| **Maximum Value** | 10 |

### width[#](#width "Permalink")

Sets the width of the element in pixels. The element will be scaled up or down to fit the specified width. A value of -1 instructs the system to maintain the element's original aspect ratio when resizing based on the height property. If 'resize' is set, the 'width' property is ignored. The minimum accepted value is -1.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Default Value** | `-1` |
| **Minimum Value** | -1 |

### x[#](#x "Permalink")

The horizontal position of the element within the movie canvas, measured in pixels. This property is only applicable when the `position` property is set to `custom`. A value of `0` places the element at the left edge of the movie canvas. Higher integer values move the element to the right.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |

### y[#](#y "Permalink")

Sets the vertical position of the element within the movie canvas, measured in pixels. This property is only applicable when the `position` property is set to `custom`. A value of `0` places the element at the top edge of the movie canvas. Higher integer values move the element downwards.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |

### z-index[#](#z-index "Permalink")

Element's z-index, determining its stacking order within the video. Higher values bring the element to the front, obscuring elements with lower values. Lower values send the element to the back, potentially behind other elements. The value must be an integer between -99 and 99; the default is 0. The natural way of layering elements is by the order of the elements in the `elements` array. If by any reason this does not work in your case, you can use the `z-index` property to manually control the stacking order.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |
| **Minimum Value** | -99 |
| **Maximum Value** | 99 |

### zoom[#](#zoom "Permalink")

Zooms the element by a specified percentage. Use positive values (1-10) to zoom in and negative values (-1 to -10) to zoom out. A value of 0 results in no zoom. Combine with the `pan` property to control the focal point during zooming.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Minimum Value** | -10 |
| **Maximum Value** | 10 |

[← Previous: Image](/docs/v2/api-reference/json-syntax/element/image)[Next: Text →](/docs/v2/api-reference/json-syntax/element/text)

---

## Content from: https://json2video.com/docs/v2/api-reference/json-syntax/element/text

# Text element[#](#text-element "Permalink")

**Type:** object

Defines a text element that allows you to overlay a text on top of your video. Depending on the style selected, the text can include different text animations like word-by-word, character-by-character, or jumping letters.

### Related links[#](#related-links "Permalink")

* [Text Styles](https://json2video.com/docs/resources/text/): Check out the available text styles and their corresponding visual characteristics.

## Customizing the Text element[#](#customizing-the-text-element "Permalink")

The **Text element** can be customized to include a variety of text styles, fonts, and colors.
You must use the `settings` object to customize the text element.

Example:

```
{
  "type": "text",
  "text": "Hello, world!",
  "settings": {
    "font-family": "Roboto",
    "font-size": "48px",
    "font-weight": "700",
    "font-color": "#000000",
    "background-color": "#FFFFFF",
    "text-align": "center"
  }
}
```

Most of the CSS properties are supported in the `settings` object.

## Available font families[#](#available-font-families "Permalink")

### Google Fonts[#](#google-fonts "Permalink")

You can use any [Google Font](https://fonts.google.com/) in the `font-family` property just by providing the font name.

Examples:

* `Roboto`
* `Lato`
* `Montserrat`
* `Open Sans`
* `Poppins`
* `Raleway`

In some cases, Google Fonts don't use the same font name as the one used in the `font-family` property.
This is the case for some of the Noto fonts that support different languages.

Common Noto font families for different languages:

* `Noto Sans` – supports multiple languages
* `Noto Serif` – supports multiple languages
* `Noto Sans JP` – supports Japanese
* `Noto Sans SC` – supports Chinese Simplified
* `Noto Sans TC` – supports Chinese Traditional
* `Noto Sans KR` – supports Korean
* `Noto Sans Thai` – supports Thai
* `Noto Sans Hebrew` – supports Hebrew
* `Noto Sans Arabic` – supports Arabic

Example:

```
{
  "type": "text",
  "text": "헬로 월드",
  "settings": {
    "font-family": "Noto Sans KR",
  }
}
```

### Custom fonts[#](#custom-fonts "Permalink")

You can use any custom font in the `font-family` property by providing a URL to the font file.
TrueType fonts (.ttf) and OpenType fonts (.otf) are supported.

Example:

```
{
  "type": "text",
  "text": "Hello, world!",
  "settings": {
   "font-family": "https://example.com/fonts/custom-font.ttf"
  }
}
```

> **NOTE**
> Be aware that the custom fonts in the `subtitles` element use the `font-url` property instead of the `font-family` property.

## Positioning the Text element[#](#positioning-the-text-element "Permalink")

The **Text element** is structured to provide flexibility in positioning text within your video. It consists of two main concepts:

1. **Text Element Canvas Area**:

   * This is the outer area that can occupy the full size of the video canvas. It serves as the boundary within which the text box is placed. The canvas can be adjusted to fit the full video size or a custom size.
2. **Textbox Inside the Canvas**:

   * Within the text element canvas, there is a textbox that can be aligned both vertically and horizontally. This alignment feature ensures that regardless of the text length, the textbox can be positioned accurately within the canvas.

The final position of the textbox relative to the video canvas is determined by the combination of:

* The size and position of the text element canvas.
* The alignment settings of the textbox within the canvas.

This approach is particularly useful for dynamically positioning the textbox. Even if the textbox expands or contracts due to varying text lengths, it will maintain its alignment within the canvas. This ensures a consistent and visually appealing presentation of text in your video, regardless of content changes.

To position the textbox inside the canvas, you must use the `vertical-position` and `horizontal-position` properties.
The `vertical-position` property can be one of the following values:

* `top`
* `center`
* `bottom`

The `horizontal-position` property can be one of the following values:

* `left`
* `center`
* `right`

Example:

```
{
  "type": "text",
  "text": "Hello, world!",
  "settings": { 
   "vertical-position": "top", 
   "horizontal-position": "right" 
  }
}
```

This example will position the textbox to the top-right corner of the Text element canvas.
As the Text element canvas defaults to the full size of the video canvas, the textbox will be positioned to the top-right corner of the video.

## Properties[#](#properties "Permalink")

The following properties are required:

* `text`
* `type`

### cache[#](#cache "Permalink")

If `true`, the system will attempt to retrieve and use a previously rendered (cached) version of this element, if an identical version is available. This can significantly reduce processing time. If `false`, a new render of the element will always be performed, regardless of whether a cached version exists. The default value is `true`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `true` |
| **Format** | boolean |

### chroma-key[#](#chroma-key "Permalink")

Allows you to define a color or a range of colors within the element that will be rendered as transparent. This effect is commonly known as chroma keying or 'green screen'. The `color` property specifies the base color to be made transparent, while the optional `tolerance` property adjusts the sensitivity of the transparency, allowing you to define a range of similar colors to also be included in the transparency effect.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **color**: (string, required) - Set the color for which alpha will be set to 0 (full transparency)

  + Example: `"#00b140"`
* **tolerance**: (integer, optional) - Makes the selection more or less sensitive to changes in color. A value of 1 will select only the provided color. A value of 100 will select all colors, so the full canvas

  + Default: `25`
  + Minimum: `1`
  + Maximum: `100`

### comment[#](#comment "Permalink")

A field for adding descriptive notes or internal memos related to the element. This comment is for your reference and does not affect the rendering process. It can be used to keep notes about the element like describing the content or the purpose of the element.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### condition[#](#condition "Permalink")

A string containing an expression that determines whether the element will be rendered. The element is rendered only if the condition evaluates to true. If the condition is false or an empty string, the element will be skipped and not included in the scene or movie.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### correction[#](#correction "Permalink")

Defines image and video correction settings, allowing you to adjust the visual characteristics of the element. This includes properties for adjusting contrast, brightness, saturation, and gamma, enabling fine-tuning of the element's appearance. Values in the edge of the range may result in the element being irrecognizable.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **brightness**: (number, optional) - Adjust the brightness

  + Default: `0`
  + Minimum: `-1`
  + Maximum: `1`
* **contrast**: (number, optional) - Adjust the contrast

  + Default: `1`
  + Minimum: `-1000`
  + Maximum: `1000`
* **gamma**: (number, optional) - Adjust the gamma

  + Default: `1`
  + Minimum: `0.1`
  + Maximum: `10`
* **saturation**: (number, optional) - Adjust the saturation

  + Default: `1`
  + Minimum: `0`
  + Maximum: `3`

### crop[#](#crop "Permalink")

Defines the cropping area of the element. It allows you to specify a rectangular region of the element to display, effectively cropping the external parts of the provided area. The `x` and `y` properties define the top-left corner of the cropping rectangle, while the `width` and `height` properties determine the dimensions of the cropped area.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **height**: (integer, required) - Sets the height of the cropping area
* **width**: (integer, required) - Sets the width of the cropping area
* **x**: (integer, optional) - Sets the left point of cropping

  + Default: `0`
* **y**: (integer, optional) - Sets the top point of cropping

  + Default: `0`

### duration[#](#duration "Permalink")

Defines the duration of the text element in seconds. Use a positive value to specify the length of time the text is displayed. A value of -1 automatically calculates the duration based on the text animation duration. A value of -2 sets the element's duration to match the duration of its container (being either the parent scene or the movie).

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `-2` |
| **Format** | float |
| **Minimum Value** | -2 |

### extra-time[#](#extra-time "Permalink")

The amount of time, in seconds, to extend the element's duration beyond its natural length. This allows the element to linger on screen after its content has finished playing or displaying. For example, setting `extra-time` to 0.5 will keep the element visible for an additional half-second.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | float |

### fade-in[#](#fade-in "Permalink")

The duration, in seconds, of the fade-in effect applied to the element's appearance. A value of `0` means no fade-in effect. Larger values result in a longer fade-in duration. The value must be a non-negative number.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Format** | float |
| **Minimum Value** | 0 |

### fade-out[#](#fade-out "Permalink")

The duration, in seconds, of the fade-out effect applied to the element's disappearance. A value of `0` means no fade-out effect. Larger values result in a longer fade-out duration. The value must be a non-negative number.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Format** | float |
| **Minimum Value** | 0 |

### flip-horizontal[#](#flip-horizontal "Permalink")

If `true`, the element will be flipped horizontally, creating a mirror image effect. The default value is `false`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `false` |

### flip-vertical[#](#flip-vertical "Permalink")

If `true`, the element will be flipped vertically, creating an upside-down image. The default value is `false`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `false` |

### height[#](#height "Permalink")

Sets the height of the element in pixels, scaling the element up or down as needed to fit the specified height. A value of -1 maintains the element's original aspect ratio when resizing based on the width property. If 'resize' is set, the 'height' property is ignored. The minimum accepted value is -1.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Default Value** | `-1` |
| **Minimum Value** | -1 |

### id[#](#id "Permalink")

A unique identifier for the element within the movie. This string allows you to reference and manage individual elements. If not provided, the system will automatically generate a random string.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"@randomString"` |

### mask[#](#mask "Permalink")

URL to a PNG or video file that defines a mask, controlling the transparency of the element. The mask uses a grayscale color scheme: black areas render the element fully transparent, white areas render it fully opaque, and shades of gray create varying levels of partial transparency. This allows you to create complex shapes and effects by selectively hiding portions of the element.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### pan[#](#pan "Permalink")

Specifies the direction to pan the element within its container. Valid values are `left`, `top`, `right`, `bottom`, and their combinations like `top-left`. If the `zoom` property is also specified, the pan will occur while zooming. If `zoom` is not specified, the element will pan without zooming.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Enum Values** | `left`, `top`, `right`, `bottom`, `top-left`, `top-right`, `bottom-left`, `bottom-right` |

### pan-crop[#](#pan-crop "Permalink")

When panning an element, this boolean property determines whether the element is stretched and cropped to fill the movie canvas. If set to `true` (default), the element will be stretched and cropped during panning. If set to `false`, the element will not be stretched and potentially leave empty space within the movie canvas. Example: if `pan-crop` is set to `false` and the movie canvas and element have the same size, panning the element to the left may leave a black bar on the right side of the movie canvas as the element moves to the left. If `pan-crop` is set to `true` (default), the element will be stretched and cropped during panning, so the element will effectively fill the movie canvas.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `true` |

### pan-distance[#](#pan-distance "Permalink")

Defines the distance the element pans within its container when the `pan` property is specified. This value, expressed as a floating-point number, determines the amount of movement during the panning effect. Higher values result in faster and more pronounced panning. The allowed range is from 0.01 to 0.5, with a default value of 0.1.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0.1` |
| **Format** | float |
| **Minimum Value** | 0.01 |
| **Maximum Value** | 0.5 |

### position[#](#position "Permalink")

Specifies the position of the element within the movie canvas. Choose from predefined positions like 'top-left', 'top-right', 'bottom-right', 'bottom-left', and 'center-center' to quickly place the element. Selecting 'custom' enables precise positioning using the `x` and `y` properties to define the element's horizontal and vertical coordinates.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"custom"` |
| **Enum Values** | `top-left`, `top-right`, `bottom-right`, `bottom-left`, `center-center`, `custom` |

### resize[#](#resize "Permalink")

Defines how the element should be resized to fit within the movie canvas. The values `cover` and `fill` stretch the element to completely cover the movie canvas, potentially cropping parts of the element. The values `fit` and `contain` ensure the entire element is visible, potentially leaving empty space within the canvas. When `resize` is set, the `width` and `height` properties are ignored, as the element's size is determined by the chosen resize mode. The value `cover`is a synonym for `fill` and `contain`is a synonym for `fit`.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Enum Values** | `cover`, `fill`, `fit`, `contain` |

### rotate[#](#rotate "Permalink")

Defines the rotation properties of the element. It allows you to specify the angle of rotation and the time it takes to complete the rotation, enabling animated rotation effects.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **angle**: (number, required) - Sets the angle of rotation

  + Default: `0`
  + Minimum: `-360`
  + Maximum: `360`
* **speed**: (number, optional) - Sets the time it takes to rotate the provided angle. A zero value means no movement

  + Default: `0`
  + Minimum: `0`

### settings[#](#settings "Permalink")

Text formatting settings, allowing you to customize the appearance of the text element. These settings are applied as CSS properties to style the text, such as `font-size` and `color`. The available settings are determined by the selected style. Refer to the documentation for the specific styles to see which CSS properties can be adjusted.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |
| **Default Value** | `{}` |

### start[#](#start "Permalink")

The element's start time, in seconds, determines when it begins playing within its container's timeline. This time is relative to the beginning of the scene it's in or, if the element is part of the movie's elements array, relative to the beginning of the movie itself. The default value is 0, meaning the element starts at the beginning of its container's timeline.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | float |

### style[#](#style "Permalink")

The style of the text element, selected from a predefined set of available styles. Each style offers a unique animation. Refer to the linked documentation for a comprehensive overview of available text styles and their corresponding visual characteristics. The default value is "001".

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"001"` |

### text[#](#text "Permalink")

The text content to be displayed within the text element. This property accepts a string value that represents the text to be rendered in the video. Note that HTML formatting is not supported; the string will be rendered as plain text.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | Yes |

### type[#](#type "Permalink")

This field specifies the element's type and must be set to `text` for text elements.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | Yes |
| **Enum Values** | `text` |

### variables[#](#variables "Permalink")

Defines local variables specific to this element. These variables can be used to dynamically alter the element's properties or content during the rendering process. Variable names must consist of only letters, numbers, and underscores.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |
| **Default Value** | `{}` |

### width[#](#width "Permalink")

Sets the width of the element in pixels. The element will be scaled up or down to fit the specified width. A value of -1 instructs the system to maintain the element's original aspect ratio when resizing based on the height property. If 'resize' is set, the 'width' property is ignored. The minimum accepted value is -1.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Default Value** | `-1` |
| **Minimum Value** | -1 |

### x[#](#x "Permalink")

The horizontal position of the element within the movie canvas, measured in pixels. This property is only applicable when the `position` property is set to `custom`. A value of `0` places the element at the left edge of the movie canvas. Higher integer values move the element to the right.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |

### y[#](#y "Permalink")

Sets the vertical position of the element within the movie canvas, measured in pixels. This property is only applicable when the `position` property is set to `custom`. A value of `0` places the element at the top edge of the movie canvas. Higher integer values move the element downwards.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |

### z-index[#](#z-index "Permalink")

Element's z-index, determining its stacking order within the video. Higher values bring the element to the front, obscuring elements with lower values. Lower values send the element to the back, potentially behind other elements. The value must be an integer between -99 and 99; the default is 0. The natural way of layering elements is by the order of the elements in the `elements` array. If by any reason this does not work in your case, you can use the `z-index` property to manually control the stacking order.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |
| **Minimum Value** | -99 |
| **Maximum Value** | 99 |

### zoom[#](#zoom "Permalink")

Zooms the element by a specified percentage. Use positive values (1-10) to zoom in and negative values (-1 to -10) to zoom out. A value of 0 results in no zoom. Combine with the `pan` property to control the focal point during zooming.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Minimum Value** | -10 |
| **Maximum Value** | 10 |

[← Previous: Video](/docs/v2/api-reference/json-syntax/element/video)[Next: Component →](/docs/v2/api-reference/json-syntax/element/component)

---

## Content from: https://json2video.com/docs/v2/api-reference/json-syntax/element/component

# Component[#](#component "Permalink")

**Type:** object

Creates an element with animation to be rendered in the movie or scene. The `component` property specifies the ID of the component to use from the available library of available components, and the `settings` property allows you to customize the component's appearance and behavior. The component library includes a variety of pre-defined components, such as shape animations, animated text boxes, lower-thirds, and more.

### Related links[#](#related-links "Permalink")

* [Component Library](https://json2video.com/docs/resources/basic/)

## Properties[#](#properties "Permalink")

The following properties are required:

* `component`
* `type`

### cache[#](#cache "Permalink")

If `true`, the system will attempt to retrieve and use a previously rendered (cached) version of this element, if an identical version is available. This can significantly reduce processing time. If `false`, a new render of the element will always be performed, regardless of whether a cached version exists. The default value is `true`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `true` |
| **Format** | boolean |

### chroma-key[#](#chroma-key "Permalink")

Allows you to define a color or a range of colors within the element that will be rendered as transparent. This effect is commonly known as chroma keying or 'green screen'. The `color` property specifies the base color to be made transparent, while the optional `tolerance` property adjusts the sensitivity of the transparency, allowing you to define a range of similar colors to also be included in the transparency effect.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **color**: (string, required) - Set the color for which alpha will be set to 0 (full transparency)

  + Example: `"#00b140"`
* **tolerance**: (integer, optional) - Makes the selection more or less sensitive to changes in color. A value of 1 will select only the provided color. A value of 100 will select all colors, so the full canvas

  + Default: `25`
  + Minimum: `1`
  + Maximum: `100`

### comment[#](#comment "Permalink")

A field for adding descriptive notes or internal memos related to the element. This comment is for your reference and does not affect the rendering process. It can be used to keep notes about the element like describing the content or the purpose of the element.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### component[#](#component-1 "Permalink")

The ID of the pre-defined component to use. This ID references a component from the component library. Use the component picker control in the editor to find available components, or refer to the library documentation for a comprehensive list of available component IDs.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | Yes |

### condition[#](#condition "Permalink")

A string containing an expression that determines whether the element will be rendered. The element is rendered only if the condition evaluates to true. If the condition is false or an empty string, the element will be skipped and not included in the scene or movie.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### correction[#](#correction "Permalink")

Defines image and video correction settings, allowing you to adjust the visual characteristics of the element. This includes properties for adjusting contrast, brightness, saturation, and gamma, enabling fine-tuning of the element's appearance. Values in the edge of the range may result in the element being irrecognizable.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **brightness**: (number, optional) - Adjust the brightness

  + Default: `0`
  + Minimum: `-1`
  + Maximum: `1`
* **contrast**: (number, optional) - Adjust the contrast

  + Default: `1`
  + Minimum: `-1000`
  + Maximum: `1000`
* **gamma**: (number, optional) - Adjust the gamma

  + Default: `1`
  + Minimum: `0.1`
  + Maximum: `10`
* **saturation**: (number, optional) - Adjust the saturation

  + Default: `1`
  + Minimum: `0`
  + Maximum: `3`

### crop[#](#crop "Permalink")

Defines the cropping area of the element. It allows you to specify a rectangular region of the element to display, effectively cropping the external parts of the provided area. The `x` and `y` properties define the top-left corner of the cropping rectangle, while the `width` and `height` properties determine the dimensions of the cropped area.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **height**: (integer, required) - Sets the height of the cropping area
* **width**: (integer, required) - Sets the width of the cropping area
* **x**: (integer, optional) - Sets the left point of cropping

  + Default: `0`
* **y**: (integer, optional) - Sets the top point of cropping

  + Default: `0`

### duration[#](#duration "Permalink")

Defines the duration of the element in seconds. Use a positive value to specify the exact duration. A value of -1 tells the system to automatically calculate the duration based on the intrinsic length of the element's asset (e.g., video or audio file). A value of -2 sets the element's duration to match that of its parent scene (if the element is within a scene) or the entire movie (if the element is in the movie's top-level elements array).

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `-2` |
| **Format** | float |
| **Minimum Value** | -2 |

### extra-time[#](#extra-time "Permalink")

The amount of time, in seconds, to extend the element's duration beyond its natural length. This allows the element to linger on screen after its content has finished playing or displaying. For example, setting `extra-time` to 0.5 will keep the element visible for an additional half-second.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | float |

### fade-in[#](#fade-in "Permalink")

The duration, in seconds, of the fade-in effect applied to the element's appearance. A value of `0` means no fade-in effect. Larger values result in a longer fade-in duration. The value must be a non-negative number.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Format** | float |
| **Minimum Value** | 0 |

### fade-out[#](#fade-out "Permalink")

The duration, in seconds, of the fade-out effect applied to the element's disappearance. A value of `0` means no fade-out effect. Larger values result in a longer fade-out duration. The value must be a non-negative number.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Format** | float |
| **Minimum Value** | 0 |

### flip-horizontal[#](#flip-horizontal "Permalink")

If `true`, the element will be flipped horizontally, creating a mirror image effect. The default value is `false`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `false` |

### flip-vertical[#](#flip-vertical "Permalink")

If `true`, the element will be flipped vertically, creating an upside-down image. The default value is `false`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `false` |

### height[#](#height "Permalink")

Sets the height of the element in pixels, scaling the element up or down as needed to fit the specified height. A value of -1 maintains the element's original aspect ratio when resizing based on the width property. If 'resize' is set, the 'height' property is ignored. The minimum accepted value is -1.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Default Value** | `-1` |
| **Minimum Value** | -1 |

### id[#](#id "Permalink")

A unique identifier for the element within the movie. This string allows you to reference and manage individual elements. If not provided, the system will automatically generate a random string.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"@randomString"` |

### mask[#](#mask "Permalink")

URL to a PNG or video file that defines a mask, controlling the transparency of the element. The mask uses a grayscale color scheme: black areas render the element fully transparent, white areas render it fully opaque, and shades of gray create varying levels of partial transparency. This allows you to create complex shapes and effects by selectively hiding portions of the element.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### pan[#](#pan "Permalink")

Specifies the direction to pan the element within its container. Valid values are `left`, `top`, `right`, `bottom`, and their combinations like `top-left`. If the `zoom` property is also specified, the pan will occur while zooming. If `zoom` is not specified, the element will pan without zooming.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Enum Values** | `left`, `top`, `right`, `bottom`, `top-left`, `top-right`, `bottom-left`, `bottom-right` |

### pan-crop[#](#pan-crop "Permalink")

When panning an element, this boolean property determines whether the element is stretched and cropped to fill the movie canvas. If set to `true` (default), the element will be stretched and cropped during panning. If set to `false`, the element will not be stretched and potentially leave empty space within the movie canvas. Example: if `pan-crop` is set to `false` and the movie canvas and element have the same size, panning the element to the left may leave a black bar on the right side of the movie canvas as the element moves to the left. If `pan-crop` is set to `true` (default), the element will be stretched and cropped during panning, so the element will effectively fill the movie canvas.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `true` |

### pan-distance[#](#pan-distance "Permalink")

Defines the distance the element pans within its container when the `pan` property is specified. This value, expressed as a floating-point number, determines the amount of movement during the panning effect. Higher values result in faster and more pronounced panning. The allowed range is from 0.01 to 0.5, with a default value of 0.1.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0.1` |
| **Format** | float |
| **Minimum Value** | 0.01 |
| **Maximum Value** | 0.5 |

### position[#](#position "Permalink")

Specifies the position of the element within the movie canvas. Choose from predefined positions like 'top-left', 'top-right', 'bottom-right', 'bottom-left', and 'center-center' to quickly place the element. Selecting 'custom' enables precise positioning using the `x` and `y` properties to define the element's horizontal and vertical coordinates.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"custom"` |
| **Enum Values** | `top-left`, `top-right`, `bottom-right`, `bottom-left`, `center-center`, `custom` |

### resize[#](#resize "Permalink")

Defines how the element should be resized to fit within the movie canvas. The values `cover` and `fill` stretch the element to completely cover the movie canvas, potentially cropping parts of the element. The values `fit` and `contain` ensure the entire element is visible, potentially leaving empty space within the canvas. When `resize` is set, the `width` and `height` properties are ignored, as the element's size is determined by the chosen resize mode. The value `cover`is a synonym for `fill` and `contain`is a synonym for `fit`.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Enum Values** | `cover`, `fill`, `fit`, `contain` |

### rotate[#](#rotate "Permalink")

Defines the rotation properties of the element. It allows you to specify the angle of rotation and the time it takes to complete the rotation, enabling animated rotation effects.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **angle**: (number, required) - Sets the angle of rotation

  + Default: `0`
  + Minimum: `-360`
  + Maximum: `360`
* **speed**: (number, optional) - Sets the time it takes to rotate the provided angle. A zero value means no movement

  + Default: `0`
  + Minimum: `0`

### settings[#](#settings "Permalink")

Settings to customize the component's appearance and behavior. The available settings depend on the selected component; refer to the component library documentation for details. This allows you to tailor pre-built components to fit your specific video needs.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

### start[#](#start "Permalink")

The element's start time, in seconds, determines when it begins playing within its container's timeline. This time is relative to the beginning of the scene it's in or, if the element is part of the movie's elements array, relative to the beginning of the movie itself. The default value is 0, meaning the element starts at the beginning of its container's timeline.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | float |

### type[#](#type "Permalink")

This field specifies the element's type and must be set to `component` for component elements.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | Yes |
| **Enum Values** | `component` |

### variables[#](#variables "Permalink")

Defines local variables specific to this element. These variables can be used to dynamically alter the element's properties or content during the rendering process. Variable names must consist of only letters, numbers, and underscores.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |
| **Default Value** | `{}` |

### width[#](#width "Permalink")

Sets the width of the element in pixels. The element will be scaled up or down to fit the specified width. A value of -1 instructs the system to maintain the element's original aspect ratio when resizing based on the height property. If 'resize' is set, the 'width' property is ignored. The minimum accepted value is -1.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Default Value** | `-1` |
| **Minimum Value** | -1 |

### x[#](#x "Permalink")

The horizontal position of the element within the movie canvas, measured in pixels. This property is only applicable when the `position` property is set to `custom`. A value of `0` places the element at the left edge of the movie canvas. Higher integer values move the element to the right.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |

### y[#](#y "Permalink")

Sets the vertical position of the element within the movie canvas, measured in pixels. This property is only applicable when the `position` property is set to `custom`. A value of `0` places the element at the top edge of the movie canvas. Higher integer values move the element downwards.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |

### z-index[#](#z-index "Permalink")

Element's z-index, determining its stacking order within the video. Higher values bring the element to the front, obscuring elements with lower values. Lower values send the element to the back, potentially behind other elements. The value must be an integer between -99 and 99; the default is 0. The natural way of layering elements is by the order of the elements in the `elements` array. If by any reason this does not work in your case, you can use the `z-index` property to manually control the stacking order.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |
| **Minimum Value** | -99 |
| **Maximum Value** | 99 |

### zoom[#](#zoom "Permalink")

Zooms the element by a specified percentage. Use positive values (1-10) to zoom in and negative values (-1 to -10) to zoom out. A value of 0 results in no zoom. Combine with the `pan` property to control the focal point during zooming.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Minimum Value** | -10 |
| **Maximum Value** | 10 |

[← Previous: Text](/docs/v2/api-reference/json-syntax/element/text)[Next: Audio →](/docs/v2/api-reference/json-syntax/element/audio)

---

## Content from: https://json2video.com/docs/v2/api-reference/json-syntax/element/audio

# Audio[#](#audio "Permalink")

**Type:** object

Defines an audio element to be included in the video. The audio source can be specified using a URL, supporting common audio formats like MP3 and WAV. Control playback behavior by defining the number of times the audio loops and the starting point within the audio using the seek property. You can also control audio properties such as muted and volume.

## Properties[#](#properties "Permalink")

### cache[#](#cache "Permalink")

If `true`, the system will attempt to retrieve and use a previously rendered (cached) version of this element, if an identical version is available. This can significantly reduce processing time. If `false`, a new render of the element will always be performed, regardless of whether a cached version exists. The default value is `true`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `true` |
| **Format** | boolean |

### comment[#](#comment "Permalink")

A field for adding descriptive notes or internal memos related to the element. This comment is for your reference and does not affect the rendering process. It can be used to keep notes about the element like describing the content or the purpose of the element.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### condition[#](#condition "Permalink")

A string containing an expression that determines whether the element will be rendered. The element is rendered only if the condition evaluates to true. If the condition is false or an empty string, the element will be skipped and not included in the scene or movie.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### duration[#](#duration "Permalink")

Defines the duration of the element in seconds. Use a positive value to specify the element's length. A value of -1 instructs the system to automatically set the duration based on the intrinsic length of the asset or file used by the element. A value of -2 sets the element's duration to match that of its parent scene (if it's inside a scene) or the movie (if it's in the movie elements array).

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `-1` |
| **Format** | float |

### extra-time[#](#extra-time "Permalink")

The amount of time, in seconds, to extend the element's duration beyond its natural length. This allows the element to linger on screen after its content has finished playing or displaying. For example, setting `extra-time` to 0.5 will keep the element visible for an additional half-second.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | float |

### fade-in[#](#fade-in "Permalink")

The duration, in seconds, of the fade-in effect applied to the element's appearance. A value of `0` means no fade-in effect. Larger values result in a longer fade-in duration. The value must be a non-negative number.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Format** | float |
| **Minimum Value** | 0 |

### fade-out[#](#fade-out "Permalink")

The duration, in seconds, of the fade-out effect applied to the element's disappearance. A value of `0` means no fade-out effect. Larger values result in a longer fade-out duration. The value must be a non-negative number.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Format** | float |
| **Minimum Value** | 0 |

### id[#](#id "Permalink")

A unique identifier for the element within the movie. This string allows you to reference and manage individual elements. If not provided, the system will automatically generate a random string.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"@randomString"` |

### loop[#](#loop "Permalink")

Specifies the number of times the audio will play. The default value of 1 means the audio plays once and then stops. A value of -1 indicates the audio should loop indefinitely. If loop is set, the `duration` property must be adjusted to match the looped audio length. For infinite loops, set `duration` to -2 to extend the duration of the audio element to match the element container (being either the parent scene or the movie).

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Minimum Value** | -1 |

### muted[#](#muted "Permalink")

If `true`, the audio track of the element (e.g., a video or audio file) will be muted, effectively silencing it. If `false` or omitted, the audio will play according to its original volume or the `volume` setting.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `false` |

### seek[#](#seek "Permalink")

Specifies the time, in seconds, at which the audio file should fast forward to. Positive values seek forward from the beginning, while negative values seek backward from the end. By default, the playback starts at the beginning (0 seconds).

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | float |

### src[#](#src "Permalink")

The URL to the audio asset file. This should be a publicly accessible URL pointing to the audio file, which can be in MP3, WAV, or any other common audio format.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Format** | uri |

### start[#](#start "Permalink")

The element's start time, in seconds, determines when it begins playing within its container's timeline. This time is relative to the beginning of the scene it's in or, if the element is part of the movie's elements array, relative to the beginning of the movie itself. The default value is 0, meaning the element starts at the beginning of its container's timeline.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | float |

### type[#](#type "Permalink")

This field specifies the element's type and must be set to `audio` for audio elements.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Enum Values** | `audio` |

### variables[#](#variables "Permalink")

Defines local variables specific to this element. These variables can be used to dynamically alter the element's properties or content during the rendering process. Variable names must consist of only letters, numbers, and underscores.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |
| **Default Value** | `{}` |

### volume[#](#volume "Permalink")

Controls the volume gain of the audio track (e.g., a video or audio file). This is a multiplier applied to the original audio level. A value of `1` represents the original volume (no gain), values greater than `1` increase the volume, and values less than `1` decrease the volume. The acceptable range is from 0 to 10. For background music with voiceovers, a usual value is `0.2`. Increasing the volume of the audio track can reduce the quality of the audio.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `1` |
| **Minimum Value** | 0 |
| **Maximum Value** | 10 |

### z-index[#](#z-index "Permalink")

Element's z-index, determining its stacking order within the video. Higher values bring the element to the front, obscuring elements with lower values. Lower values send the element to the back, potentially behind other elements. The value must be an integer between -99 and 99; the default is 0. The natural way of layering elements is by the order of the elements in the `elements` array. If by any reason this does not work in your case, you can use the `z-index` property to manually control the stacking order.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |
| **Minimum Value** | -99 |
| **Maximum Value** | 99 |

[← Previous: Component](/docs/v2/api-reference/json-syntax/element/component)[Next: Audiogram →](/docs/v2/api-reference/json-syntax/element/audiogram)

---

## Content from: https://json2video.com/docs/v2/api-reference/json-syntax/element/audiogram

# Audiogram[#](#audiogram "Permalink")

**Type:** object

Visualizes the audio waveform of the scene or movie as an audiogram. The audiogram's appearance can be customized with properties such as color, opacity, relative amplitude, width, and height. A width or height of -1 will inherit the movie's dimensions. The audiogram's duration can be set explicitly or configured to match the duration of its parent scene or the movie itself.

## Required Properties[#](#required-properties "Permalink")

* `type`

## Properties[#](#properties "Permalink")

### amplitude[#](#amplitude "Permalink")

Defines the scaling factor for the audiogram's wave amplitude, influencing the visual prominence of the waves. This value ranges from 0 to 10, where higher values result in taller and more pronounced waves, while lower values create subtler visualizations. A default value of 5 provides a balanced visual representation.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `5` |
| **Format** | float |
| **Minimum Value** | 0 |
| **Maximum Value** | 10 |

### cache[#](#cache "Permalink")

If `true`, the system will attempt to retrieve and use a previously rendered (cached) version of this element, if an identical version is available. This can significantly reduce processing time. If `false`, a new render of the element will always be performed, regardless of whether a cached version exists. The default value is `true`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `true` |
| **Format** | boolean |

### chroma-key[#](#chroma-key "Permalink")

Allows you to define a color or a range of colors within the element that will be rendered as transparent. This effect is commonly known as chroma keying or 'green screen'. The `color` property specifies the base color to be made transparent, while the optional `tolerance` property adjusts the sensitivity of the transparency, allowing you to define a range of similar colors to also be included in the transparency effect.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **color**: (string, required) - Set the color for which alpha will be set to 0 (full transparency)

  + Example: `"#00b140"`
* **tolerance**: (integer, optional) - Makes the selection more or less sensitive to changes in color. A value of 1 will select only the provided color. A value of 100 will select all colors, so the full canvas

  + Default: `25`
  + Minimum: `1`
  + Maximum: `100`

### color[#](#color "Permalink")

The hexadecimal color code (e.g., `#FF0000` for red) that defines the color of the waves displayed in the audiogram visualization. This allows you to customize the audiogram's appearance to match your video's aesthetics.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### comment[#](#comment "Permalink")

A field for adding descriptive notes or internal memos related to the element. This comment is for your reference and does not affect the rendering process. It can be used to keep notes about the element like describing the content or the purpose of the element.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### condition[#](#condition "Permalink")

A string containing an expression that determines whether the element will be rendered. The element is rendered only if the condition evaluates to true. If the condition is false or an empty string, the element will be skipped and not included in the scene or movie.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### correction[#](#correction "Permalink")

Defines image and video correction settings, allowing you to adjust the visual characteristics of the element. This includes properties for adjusting contrast, brightness, saturation, and gamma, enabling fine-tuning of the element's appearance. Values in the edge of the range may result in the element being irrecognizable.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **brightness**: (number, optional) - Adjust the brightness

  + Default: `0`
  + Minimum: `-1`
  + Maximum: `1`
* **contrast**: (number, optional) - Adjust the contrast

  + Default: `1`
  + Minimum: `-1000`
  + Maximum: `1000`
* **gamma**: (number, optional) - Adjust the gamma

  + Default: `1`
  + Minimum: `0.1`
  + Maximum: `10`
* **saturation**: (number, optional) - Adjust the saturation

  + Default: `1`
  + Minimum: `0`
  + Maximum: `3`

### crop[#](#crop "Permalink")

Defines the cropping area of the element. It allows you to specify a rectangular region of the element to display, effectively cropping the external parts of the provided area. The `x` and `y` properties define the top-left corner of the cropping rectangle, while the `width` and `height` properties determine the dimensions of the cropped area.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **height**: (integer, required) - Sets the height of the cropping area
* **width**: (integer, required) - Sets the width of the cropping area
* **x**: (integer, optional) - Sets the left point of cropping

  + Default: `0`
* **y**: (integer, optional) - Sets the top point of cropping

  + Default: `0`

### duration[#](#duration "Permalink")

Defines the duration of the audiogram element in seconds. Use a positive value to specify the exact duration. A value of -1 instructs the system to automatically calculate the duration based on the intrinsic length of the audio being visualized. A value of -2 sets the audiogram's duration to match that of its parent scene (if the audiogram is within a scene) or the entire movie (if the audiogram is in the movie's top-level elements array).

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `-2` |
| **Format** | float |
| **Minimum Value** | -2 |

### extra-time[#](#extra-time "Permalink")

The amount of time, in seconds, to extend the element's duration beyond its natural length. This allows the element to linger on screen after its content has finished playing or displaying. For example, setting `extra-time` to 0.5 will keep the element visible for an additional half-second.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | float |

### fade-in[#](#fade-in "Permalink")

The duration, in seconds, of the fade-in effect applied to the element's appearance. A value of `0` means no fade-in effect. Larger values result in a longer fade-in duration. The value must be a non-negative number.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Format** | float |
| **Minimum Value** | 0 |

### fade-out[#](#fade-out "Permalink")

The duration, in seconds, of the fade-out effect applied to the element's disappearance. A value of `0` means no fade-out effect. Larger values result in a longer fade-out duration. The value must be a non-negative number.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Format** | float |
| **Minimum Value** | 0 |

### flip-horizontal[#](#flip-horizontal "Permalink")

If `true`, the element will be flipped horizontally, creating a mirror image effect. The default value is `false`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `false` |

### flip-vertical[#](#flip-vertical "Permalink")

If `true`, the element will be flipped vertically, creating an upside-down image. The default value is `false`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `false` |

### height[#](#height "Permalink")

Sets the height of the element in pixels, scaling the element up or down as needed to fit the specified height. A value of -1 maintains the element's original aspect ratio when resizing based on the width property. If 'resize' is set, the 'height' property is ignored. The minimum accepted value is -1.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Default Value** | `-1` |
| **Minimum Value** | -1 |

### id[#](#id "Permalink")

A unique identifier for the element within the movie. This string allows you to reference and manage individual elements. If not provided, the system will automatically generate a random string.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"@randomString"` |

### mask[#](#mask "Permalink")

URL to a PNG or video file that defines a mask, controlling the transparency of the element. The mask uses a grayscale color scheme: black areas render the element fully transparent, white areas render it fully opaque, and shades of gray create varying levels of partial transparency. This allows you to create complex shapes and effects by selectively hiding portions of the element.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### opacity[#](#opacity "Permalink")

The opacity of the audiogram, ranging from 0.0 (fully transparent) to 1.0 (fully opaque). A value of 0.5 represents 50% transparency.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0.5` |
| **Format** | float |
| **Minimum Value** | 0 |
| **Maximum Value** | 1 |

### pan[#](#pan "Permalink")

Specifies the direction to pan the element within its container. Valid values are `left`, `top`, `right`, `bottom`, and their combinations like `top-left`. If the `zoom` property is also specified, the pan will occur while zooming. If `zoom` is not specified, the element will pan without zooming.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Enum Values** | `left`, `top`, `right`, `bottom`, `top-left`, `top-right`, `bottom-left`, `bottom-right` |

### pan-crop[#](#pan-crop "Permalink")

When panning an element, this boolean property determines whether the element is stretched and cropped to fill the movie canvas. If set to `true` (default), the element will be stretched and cropped during panning. If set to `false`, the element will not be stretched and potentially leave empty space within the movie canvas. Example: if `pan-crop` is set to `false` and the movie canvas and element have the same size, panning the element to the left may leave a black bar on the right side of the movie canvas as the element moves to the left. If `pan-crop` is set to `true` (default), the element will be stretched and cropped during panning, so the element will effectively fill the movie canvas.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `true` |

### pan-distance[#](#pan-distance "Permalink")

Defines the distance the element pans within its container when the `pan` property is specified. This value, expressed as a floating-point number, determines the amount of movement during the panning effect. Higher values result in faster and more pronounced panning. The allowed range is from 0.01 to 0.5, with a default value of 0.1.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0.1` |
| **Format** | float |
| **Minimum Value** | 0.01 |
| **Maximum Value** | 0.5 |

### position[#](#position "Permalink")

Specifies the position of the element within the movie canvas. Choose from predefined positions like 'top-left', 'top-right', 'bottom-right', 'bottom-left', and 'center-center' to quickly place the element. Selecting 'custom' enables precise positioning using the `x` and `y` properties to define the element's horizontal and vertical coordinates.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"custom"` |
| **Enum Values** | `top-left`, `top-right`, `bottom-right`, `bottom-left`, `center-center`, `custom` |

### resize[#](#resize "Permalink")

Defines how the element should be resized to fit within the movie canvas. The values `cover` and `fill` stretch the element to completely cover the movie canvas, potentially cropping parts of the element. The values `fit` and `contain` ensure the entire element is visible, potentially leaving empty space within the canvas. When `resize` is set, the `width` and `height` properties are ignored, as the element's size is determined by the chosen resize mode. The value `cover`is a synonym for `fill` and `contain`is a synonym for `fit`.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Enum Values** | `cover`, `fill`, `fit`, `contain` |

### rotate[#](#rotate "Permalink")

Defines the rotation properties of the element. It allows you to specify the angle of rotation and the time it takes to complete the rotation, enabling animated rotation effects.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |

This object contains the following properties:

* **angle**: (number, required) - Sets the angle of rotation

  + Default: `0`
  + Minimum: `-360`
  + Maximum: `360`
* **speed**: (number, optional) - Sets the time it takes to rotate the provided angle. A zero value means no movement

  + Default: `0`
  + Minimum: `0`

### start[#](#start "Permalink")

The element's start time, in seconds, determines when it begins playing within its container's timeline. This time is relative to the beginning of the scene it's in or, if the element is part of the movie's elements array, relative to the beginning of the movie itself. The default value is 0, meaning the element starts at the beginning of its container's timeline.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | float |

### type[#](#type "Permalink")

This field specifies the element's type and must be set to `audiogram` to indicate that this element is an audiogram visualization.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | Yes |
| **Enum Values** | `audiogram` |

### variables[#](#variables "Permalink")

Defines local variables specific to this element. These variables can be used to dynamically alter the element's properties or content during the rendering process. Variable names must consist of only letters, numbers, and underscores.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |
| **Default Value** | `{}` |

### width[#](#width "Permalink")

Sets the width of the element in pixels. The element will be scaled up or down to fit the specified width. A value of -1 instructs the system to maintain the element's original aspect ratio when resizing based on the height property. If 'resize' is set, the 'width' property is ignored. The minimum accepted value is -1.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Default Value** | `-1` |
| **Minimum Value** | -1 |

### x[#](#x "Permalink")

The horizontal position of the element within the movie canvas, measured in pixels. This property is only applicable when the `position` property is set to `custom`. A value of `0` places the element at the left edge of the movie canvas. Higher integer values move the element to the right.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |

### y[#](#y "Permalink")

Sets the vertical position of the element within the movie canvas, measured in pixels. This property is only applicable when the `position` property is set to `custom`. A value of `0` places the element at the top edge of the movie canvas. Higher integer values move the element downwards.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |

### z-index[#](#z-index "Permalink")

Element's z-index, determining its stacking order within the video. Higher values bring the element to the front, obscuring elements with lower values. Lower values send the element to the back, potentially behind other elements. The value must be an integer between -99 and 99; the default is 0. The natural way of layering elements is by the order of the elements in the `elements` array. If by any reason this does not work in your case, you can use the `z-index` property to manually control the stacking order.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |
| **Minimum Value** | -99 |
| **Maximum Value** | 99 |

### zoom[#](#zoom "Permalink")

Zooms the element by a specified percentage. Use positive values (1-10) to zoom in and negative values (-1 to -10) to zoom out. A value of 0 results in no zoom. Combine with the `pan` property to control the focal point during zooming.

|  |  |
| --- | --- |
| **Type** | integer |
| **Required** | No |
| **Minimum Value** | -10 |
| **Maximum Value** | 10 |

[← Previous: Audio](/docs/v2/api-reference/json-syntax/element/audio)[Next: Voice →](/docs/v2/api-reference/json-syntax/element/voice)

---

## Content from: https://json2video.com/docs/v2/api-reference/json-syntax/element/voice

# Voice element[#](#voice-element "Permalink")

**Type:** object

Creates a voiceover element by converting the provided text into synthesized speech. The text to be spoken is specified using the `text` property. The `voice` property determines the voice to use, and the `model` property allows specifying which speech synthesis model to employ. Optionally, a `connection` ID can be provided to utilize your own API key for voice generation, otherwise the JSON2Video API keys will be used.

## Working with the Voice element[#](#working-with-the-voice-element "Permalink")

The Voice element uses AI models to generate a voiceover for your video.

You can choose from the following models:

* **Microsoft Azure** (`azure`): The Azure model is a powerful and flexible option that supports a wide range of voices and languages. It offers high-quality speech synthesis with customizable parameters like support for SSML (Speech Synthesis Markup Language) for advanced text-to-speech control.
* **ElevenLabs** (`elevenlabs`): The ElevenLabs model is a popular choice for its high quality of its voices and the variety of voices available.
* **ElevenLabs Flash V2.5** (`elevenlabs-flash-v2-5`): The ElevenLabs Flash V2.5 model is a fast and efficient option that provides high-quality speech synthesis with extended language support.

**Note**
The `azure` model is the default model and will be used if no model is specified.

**Example**

This example creates a voiceover for a video using the Azure model.

```
{
  "resolution": "full-hd",
  "scenes": [
    {
      "elements": [
        {
          "type": "voice",
          "text": "Hello, world!",
          "voice": "en-US-EmmaMultilingualNeural",
          "model": "azure"
        }
      ]
    }
  ]
}
```

### Voice generation costs[#](#voice-generation-costs "Permalink")

Generating a voiceover with AI is expensive and depending on the model you choose, it can consume a significant amount of credits.

| Model | Credits per minute |
| --- | --- |
| Azure | 0 credits per minute |
| ElevenLabs | 60 credits per minute |
| ElevenLabs Flash V2.5 | 60 credits per minute |

Azure model cost is included in all JSON2Video plans and do not consume any credits.

Voiceovers generated with AI models are **cached** in JSON2Video servers to avoid calling the AI models for the same voiceover multiple times. This means that if you call the JSON2Video API with the same parameters for the same voiceover again, the same cached voiceover will be used in the video, avoiding unnecessary costs. But if for any reason you need to regenerate a voiceover, you can do it by setting the `cache` property to `false`.

#### Using your own API key[#](#using-your-own-api-key "Permalink")

If you already have an ElevenLabs or Azure API account, you can use your API key to generate your voiceovers.
This is specially useful for ElevenLabs custom voices.

To use your own API key:

1. You need to create a connection in the [Connections](https://json2video.com/dashboard/connections) page.
2. You need to provide the connection ID to the `connection` property in the Voice element.

**Example**

This example creates a voiceover for a video using the ElevenLabs model and your own API key.

```
{
  "resolution": "full-hd",
  "scenes": [
    {
      "elements": [
        {
          "type": "voice",
          "text": "Hello, world!",
          "model": "elevenlabs",
          "voice": "Daniel",
          "connection": "my-connection-id"
        }
      ]
    }
  ]
}
```

### Choosing the right voice[#](#choosing-the-right-voice "Permalink")

Finding the right voice for your project can be a challenge.

#### Azure voices[#](#azure-voices "Permalink")

Azure voices have this format: `en-US-EmmaMultilingualNeural`.

The first part is the language code (2 digits), the second part is the country code (2 digits) and the third part is the name of the voice.

For the Azure model, you can check the full list of voices by language here:
<https://json2video.com/ai-voices/azure/languages/>

#### ElevenLabs voices[#](#elevenlabs-voices "Permalink")

ElevenLabs voices have natural names like `Daniel`, `Serena`, `Antoni`, `Bella`, `Nova`, `Shimmer` and more.
You can also use the ElevenLabs's `voiceID` to specify the voice you want to use.

You can find a list of voices in the [ElevenLabs Voices Library](https://elevenlabs.io/app/voice-library) page (you need to be logged in).

## Properties[#](#properties "Permalink")

The following properties are required:

* `text`
* `type`

### cache[#](#cache "Permalink")

If `true`, the system will attempt to retrieve and use a previously rendered (cached) version of this element, if an identical version is available. This can significantly reduce processing time. If `false`, a new render of the element will always be performed, regardless of whether a cached version exists. The default value is `true`.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `true` |
| **Format** | boolean |

### comment[#](#comment "Permalink")

A field for adding descriptive notes or internal memos related to the element. This comment is for your reference and does not affect the rendering process. It can be used to keep notes about the element like describing the content or the purpose of the element.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### condition[#](#condition "Permalink")

A string containing an expression that determines whether the element will be rendered. The element is rendered only if the condition evaluates to true. If the condition is false or an empty string, the element will be skipped and not included in the scene or movie.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### connection[#](#connection "Permalink")

The ID of your pre-configured connection to use for voice generation. Connections are defined within the application's dashboard. By specifying a connection ID, you can leverage the API key associated with that connection, enabling you to use your own account with the AI model provider for voice generation. If a connection ID is not provided, the default JSON2Video API keys will be used, potentially deducting credits for the API calls.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### duration[#](#duration "Permalink")

Defines the duration of the element in seconds. Use a positive value to specify the element's length. A value of -1 instructs the system to automatically set the duration based on the intrinsic length of the asset or file used by the element. A value of -2 sets the element's duration to match that of its parent scene (if it's inside a scene) or the movie (if it's in the movie elements array).

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `-1` |
| **Format** | float |

### extra-time[#](#extra-time "Permalink")

The amount of time, in seconds, to extend the element's duration beyond its natural length. This allows the element to linger on screen after its content has finished playing or displaying. For example, setting `extra-time` to 0.5 will keep the element visible for an additional half-second.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | float |

### fade-in[#](#fade-in "Permalink")

The duration, in seconds, of the fade-in effect applied to the element's appearance. A value of `0` means no fade-in effect. Larger values result in a longer fade-in duration. The value must be a non-negative number.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Format** | float |
| **Minimum Value** | 0 |

### fade-out[#](#fade-out "Permalink")

The duration, in seconds, of the fade-out effect applied to the element's disappearance. A value of `0` means no fade-out effect. Larger values result in a longer fade-out duration. The value must be a non-negative number.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Format** | float |
| **Minimum Value** | 0 |

### id[#](#id "Permalink")

A unique identifier for the element within the movie. This string allows you to reference and manage individual elements. If not provided, the system will automatically generate a random string.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"@randomString"` |

### model[#](#model "Permalink")

The generative AI model to use for synthesizing the voice. Be aware that some models may consume credits for each request.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Enum Values** | `azure`, `elevenlabs`, `elevenlabs-flash-v2-5` |

### muted[#](#muted "Permalink")

If `true`, the audio track of the element (e.g., a video or audio file) will be muted, effectively silencing it. If `false` or omitted, the audio will play according to its original volume or the `volume` setting.

|  |  |
| --- | --- |
| **Type** | boolean |
| **Required** | No |
| **Default Value** | `false` |

### start[#](#start "Permalink")

The element's start time, in seconds, determines when it begins playing within its container's timeline. This time is relative to the beginning of the scene it's in or, if the element is part of the movie's elements array, relative to the beginning of the movie itself. The default value is 0, meaning the element starts at the beginning of its container's timeline.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | float |

### text[#](#text "Permalink")

The text content to be synthesized into speech.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | Yes |

### type[#](#type "Permalink")

This field specifies the element's type and must be set to `voice` for voiceover elements.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | Yes |
| **Enum Values** | `voice` |

### variables[#](#variables "Permalink")

Defines local variables specific to this element. These variables can be used to dynamically alter the element's properties or content during the rendering process. Variable names must consist of only letters, numbers, and underscores.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |
| **Default Value** | `{}` |

### voice[#](#voice "Permalink")

The name of the voice to be used for text-to-speech synthesis. This value determines which AI voice will be used to generate the audio. Refer to the available voices documentation to explore the supported options.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### volume[#](#volume "Permalink")

Controls the volume gain of the audio track (e.g., a video or audio file). This is a multiplier applied to the original audio level. A value of `1` represents the original volume (no gain), values greater than `1` increase the volume, and values less than `1` decrease the volume. The acceptable range is from 0 to 10. For background music with voiceovers, a usual value is `0.2`. Increasing the volume of the audio track can reduce the quality of the audio.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `1` |
| **Minimum Value** | 0 |
| **Maximum Value** | 10 |

### z-index[#](#z-index "Permalink")

Element's z-index, determining its stacking order within the video. Higher values bring the element to the front, obscuring elements with lower values. Lower values send the element to the back, potentially behind other elements. The value must be an integer between -99 and 99; the default is 0. The natural way of layering elements is by the order of the elements in the `elements` array. If by any reason this does not work in your case, you can use the `z-index` property to manually control the stacking order.

|  |  |
| --- | --- |
| **Type** | number |
| **Required** | No |
| **Default Value** | `0` |
| **Format** | integer |
| **Minimum Value** | -99 |
| **Maximum Value** | 99 |

[← Previous: Audiogram](/docs/v2/api-reference/json-syntax/element/audiogram)[Next: Subtitles →](/docs/v2/api-reference/json-syntax/element/subtitles)

---

## Content from: https://json2video.com/docs/v2/api-reference/json-syntax/element/subtitles

# Subtitles element[#](#subtitles-element "Permalink")

**Type:** object

Defines a subtitles element, allowing you to add subtitles to the video. Subtitles can be automatically generated by transcribing the audio or provided via a URL to a subtitle file (SRT, VTT or ASS). You can customize the appearance of the subtitles using the `settings` property, including style, font, colors, position and more.

## Working with the Subtitles element[#](#working-with-the-subtitles-element "Permalink")

### Special considerations[#](#special-considerations "Permalink")

The subtitles element works a bit differently than other elements:

* It can only be used in the Movie `elements` array, meaning that you cannot enable or disable it on a per-scene basis.
* You can't have multiple subtitles elements in a single movie
* It's always processed at the end of the rendering process once the movie is complete
* The automatic transcription "listens" to the audio track of the movie and transcribes it into text. If the voice is not clear, the transcription may not be accurate.

### Providing your own captions[#](#providing-your-own-captions "Permalink")

If you provide the captions in the `captions` property, the voiceover will not be transcribed and the captions will be displayed instead.
The supported formats for the `captions` property are: SRT, VTT and ASS.

The word highlighting option is not available when providing your own captions unless your provide the captions in ASS format and the captions include the timing for each word.

### Manual review of the transcription[#](#manual-review-of-the-transcription "Permalink")

In some cases, you may want to manually review the transcription before finally publishing the movie.

To manually review the transcription:

1. Render the movie with the automatic transcription enabled.
2. Download the transcription file in ASS format. You will find a URL to file in the `GET /v2/movies` response object (`ass` property) along with the URL to the rendered movie.
3. Open the ASS file with a text editor and review the transcription.
4. Upload the edited ASS file to public server and get a URL to the file.
5. Render the movie again, this time providing the URL to the edited ASS file in the `captions` property.

## Properties[#](#properties "Permalink")

The following properties are required:

* `type`

### captions[#](#captions "Permalink")

Specifies the captions to be used as subtitles. This can be either a URL pointing to a subtitle file, or the actual subtitle content directly embedded as a string. Supported subtitle formats for URLs or inline subtitles are: SRT, VTT, and ASS. If this property is omitted, the subtitles will be automatically generated from the audio track of the video.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### comment[#](#comment "Permalink")

A field for adding descriptive notes or internal memos related to the subtitles element. This comment is for your reference and does not affect the rendering process.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |

### language[#](#language "Permalink")

The language of the audio to be transcribed. Specify a supported language code (e.g., `en` for English, `es` for Spanish) to improve transcription accuracy. Use `auto` to enable automatic language detection by the API.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"auto"` |
| **Enum Values** | `auto`, `en`, `bg`, `ca`, `cs`, `da`, `nl`, `en-AU`, `en-GB`, `en-NZ`, `en-IN`, `en-US`, `et`, `fr`, `fi`, `nl-BE`, `de`, `de-CH`, `el`, `hi`, `hi-Latn`, `hu`, `id`, `it`, `ja`, `ko`, `lv`, `lt`, `ms`, `no`, `pl`, `pt`, `pt-BR`, `ro`, `ru`, `sk`, `es`, `es-419`, `sv`, `th`, `tr`, `uk`, `vi`, `zh`, `zh-TW` |

### model[#](#model "Permalink")

Specifies the transcription model to use when automatically generating subtitles from the audio. If a model is not specified, a default model will be used. Different models may offer varying levels of accuracy or support different languages.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | No |
| **Default Value** | `"default"` |
| **Enum Values** | `default`, `whisper` |

### settings[#](#settings "Permalink")

Settings to customize the appearance of the subtitles, including style, font, colors, positioning, and other visual attributes. These settings allow you to tailor the subtitles to match your video's aesthetics and improve readability. Available settings depend on the chosen `style`.

|  |  |
| --- | --- |
| **Type** | object |
| **Required** | No |
| **Default Value** | `{}` |

This object contains the following properties:

* **all-caps**: (boolean, optional) - Makes the subtitles uppercase.

  + Default: `false`
* **box-color**: (string, optional) - Color of the box behind the subtitles. Depending on the style, it can be the background color of the spoken word or the full line.

  + Default: `"#000000"`
* **font-family**: (string, optional) - Font family of the subtitles. You can choose any Google Font name, one of the font families below or a custom font if <code>font-url</code> is provided (see below).

  + Default: `"Arial"`
  + Additional fonts: `Arial`, `Arial Bold`, `Oswald Bold`, `NotoSans Bold`, `Simplified Chinese`, `Traditional Chinese`, `Japanese`, `Korean`, `Korean Bold`
* **font-size**: (integer, optional) - Font size of the subtitles. Usual sizes are between 90 and 150. Defaults to 5% of the movie width.
* **font-url**: (string, optional) - URL to the font file to use for the subtitles. The font file must be in TTF format. The <code>font-family</code> property must match the font family name in the font file.
* **font-weight**: (string, optional) - Font weight in the format of "100", "200", "300" to "900". The font weight is only available for Google Fonts, and must be a valid font family / weight pair. If the weight for the font family is not available, the "400" weight is used.
* **keywords**: (array, optional) - Keywords provides additional vocabulary to the transcription process. Use it to improve the accuracy of the transcription of non-standard words or phrases. This options is only available for the `default` model.
* **line-color**: (string, optional) - Color of the rest of words in the sentence.

  + Default: `"#FFFFFF"`
* **max-words-per-line**: (integer, optional) - Maximum number of words per line. Setting this to `1` will show one word at a time.

  + Default: `4`
* **outline-color**: (string, optional) - Outline color of the subtitles.

  + Default: `"#000000"`
* **outline-width**: (integer, optional) - Width of the outline.

  + Default: `0`
* **position**: (string, optional) - Position of the subtitles relative to the movie canvas.

  + Default: `"bottom-center"`
  + Allowed values: `top-left`, `top-center`, `top-right`, `center-left`, `center-center`, `center-right`, `bottom-left`, `bottom-center`, `bottom-right`, `mid-bottom-center`, `mid-top-center`, `custom`
* **replace**: (object, optional) - Replaces words with the specified replacement. Useful to correct the transcription of non-standard words or phrases. The object is a key-value pair where the key is the word to replace and the value is the replacement.
* **shadow-color**: (string, optional) - Shadow color of the subtitles.

  + Default: `"#000000"`
* **shadow-offset**: (integer, optional) - Offset of the shadow.

  + Default: `0`
* **style**: (string, optional) - Style of the subtitles. Classic styles show simple text overlays, while boxed styles show a box behind the subtitles. Check the examples for more details.

  + Default: `"classic"`
  + Allowed values: `classic`, `classic-progressive`, `classic-one-word`, `boxed-line`, `boxed-word`
* **word-color**: (string, optional) - Color of word that is being spoken at the moment.

  + Default: `"#FFFF00"`
* **x**: (integer, optional) - X coordinate of the subtitles relative to the movie canvas. This property is only used when the `position` property is set to `custom`.

  + Default: `0`
* **y**: (integer, optional) - Y coordinate of the subtitles relative to the movie canvas. This property is only used when the `position` property is set to `custom`.

  + Default: `0`

### type[#](#type "Permalink")

This field specifies the element's type and must be set to `subtitles` for subtitles elements.

|  |  |
| --- | --- |
| **Type** | string |
| **Required** | Yes |
| **Enum Values** | `subtitles` |

## Examples[#](#examples "Permalink")

### Example 1: Adding subtitles[#](#example-1-adding-subtitles "Permalink")

This example demonstrates a movie with a AI voiceover with automatic subtitles
using a Google Font (Roboto 900).

```
{
    "width": "1080",
	"height": "1920",
    "scenes": [
        {
            "elements": [
                {
                    "voice": "en-US-AmandaMultilingualNeural",
                    "extra-time": 2,
                    "model": "azure",
                    "text": "The five boxing wizards jump quickly across the hazy lawn.",
                    "type": "voice"
                },
                {
					"type": "subtitles",
					"language": "auto",
					"model": "default",
                    "settings": {
                        "max-words-per-line": 3,
                        "font-size": "80",
                        "all-caps": false,
                        "outline-color": "#FFFFFF",
                        "outline-width": 8,
                        "word-color": "#D22A1F",
                        "x": 540,
                        "y": 1470,
                        "font-family": "Roboto",
						            "font-weight": "900",
                        "style": "classic",
                        "position": "custom",
                        "line-color": "#D22A1F"
                    }
                }
            ]
        }
    ]
}
```

[← Previous: Voice](/docs/v2/api-reference/json-syntax/element/voice)[Next: Mastering →](/docs/v2/api-reference/mastering)

---

## Content from: https://json2video.com/docs/v2/api-reference/mastering

# Mastering[#](#mastering "Permalink")

This section delves into advanced techniques and concepts for maximizing the power and efficiency of the JSON2Video API. Mastering these techniques will allow you to create more sophisticated and customized videos.

[← Previous: Subtitles](/docs/v2/api-reference/json-syntax/element/subtitles)[Next: Duration and timing →](/docs/v2/api-reference/mastering/duration-and-timing)

---

## Content from: https://json2video.com/docs/v2/api-reference/mastering/duration-and-timing

# Duration and timing[#](#duration-and-timing "Permalink")

Duration and timing are key aspects of creating dynamic videos with the JSON2Video API. Understanding how these properties interact is essential for controlling the flow and pacing of your video content.

## Understanding movie, scene and element duration[#](#understanding-movie-scene-and-element-duration "Permalink")

### Movie duration[#](#movie-duration "Permalink")

The movie duration cannot be set directly. Instead, it's dynamically calculated by the API based on the length of the scenes and elements it contains. The movie's final duration will be long enough to accommodate all scenes and any elements placed directly within the Movie elements array.

### Scene duration[#](#scene-duration "Permalink")

The scene duration, on the other hand, can be either explicitly set or automatically calculated. When the `duration` property of a scene is set to a specific value (in seconds), the scene will last for that exact duration. If `duration` is set to `-1`, the API will calculate the scene's duration based on the elements it contains.

### Element duration[#](#element-duration "Permalink")

Elements can be placed either inside scenes or directly within the Movie elements array. The location of an element determines its container: if the element is inside a scene, the scene is its container. If the element is in the Movie elements array, the Movie itself is its container. This distinction is important for understanding how the `start` and `duration` properties are interpreted.

Each element has three key properties that control its timing:

* **`duration`**: Sets the length of time the element is visible or audible.
  + Use a positive value in `duration` to specify the element's length.
  + A value of `-1` instructs the system to automatically set the duration based on the intrinsic length of the asset file.
  + A value of `-2` sets the element's duration to match that of its parent scene (if it's inside a scene) or the movie (if it's in the movie elements array).
* **`start`**: Sets the starting point of the element, relative to the beginning of its container (either the scene or the movie).
  + Use a positive value in `start` to set the element's starting point relative to the beginning of its container.
  + A value of `-1` instructs the system to move the element at the end of the container's timeline.
* **`extra-time`**: Adds additional time after the element's duration ends, extending its visibility or audibility.

### Examples[#](#examples "Permalink")

#### Example 1: Scene with a 10-second video element[#](#example-1-scene-with-a-10-second-video-element "Permalink")

```
{
    "scenes": [
        {
            "elements": [
                {
                    "type": "video",
                    "src": "https://example.com/video.mp4",
                    "duration": 10
                }
            ]
        }
    ]
}
```

In this case, the scene will be 10 seconds long because the video element's duration is 10 seconds and the scene's duration defaults to automatically adjusting to fit its elements. The movie will also be 10 seconds long since it only contains this one scene.

#### Example 2: Scene with a 10-second video element, scene duration set to 5 seconds[#](#example-2-scene-with-a-10-second-video-element-scene-duration-set-to-5-seconds "Permalink")

```
{
    "scenes": [
        {
            "duration": 5,
            "elements": [
                {
                    "type": "video",
                    "src": "https://example.com/video.mp4",
                    "duration": 10
                }
            ]
        }
    ]
}
```

Here, the scene's `duration` is explicitly set to 5 seconds, which will override the video element's duration. The scene will be trimmed to 5 seconds, and the video will only play for the first 5 seconds. The movie will also be 5 seconds long.

#### Example 3: Scene with a 10-second video element and a 20-second audio element[#](#example-3-scene-with-a-10-second-video-element-and-a-20-second-audio-element "Permalink")

```
{
    "scenes": [
        {
            "elements": [
                {
                    "type": "video",
                    "src": "https://example.com/video.mp4",
                    "duration": 10
                },
                {
                    "type": "audio",
                    "src": "https://example.com/audio.mp3",
                    "duration": 20
                }
            ]
        }
    ]
}
```

In this example, the scene's duration will be automatically calculated to be 20 seconds long, accommodating both the 10-second video and the 20-second audio. The movie will also be 20 seconds long.

#### Example 4: Scene with a 10-second video element and a 20-second audio element with the audio duration set to -2[#](#example-4-scene-with-a-10-second-video-element-and-a-20-second-audio-element-with-the-audio-duration-set-to--2 "Permalink")

```
{
    "scenes": [
        {
            "elements": [
                {
                    "type": "video",
                    "src": "https://example.com/video.mp4",
                    "duration": 10
                },
                {
                    "type": "audio",
                    "src": "https://example.com/audio.mp3",
                    "duration": -2
                }
            ]
        }
    ]
}
```

In this scenario, the audio duration is set to `-2`, causing it to match the duration of its container (the scene). The API will first calculate the duration of the scene to accommodate the 10 second video element. Therefore, both the scene and audio will be 10 seconds long, and the audio will be trimmed to match the scene duration. The movie will also be 10 seconds long.

## Looping videos or audios[#](#looping-videos-or-audios "Permalink")

The `loop` property controls how many times a video or an audio element will repeat.

* When `loop` is set to a positive integer (e.g., `loop: 2`), the video will play that number of times.
* When `loop` is set to `-1`, the video will loop indefinitely (play forever).

If the element is looping, you **must** extend the `duration` of the element to accommodate the loop.

In case the element is looping forever, the `duration` property must be set to `-2` to extend the playback to the end of the container (either the parent scene or the movie). Not setting duration to -2 may result in the video or audio only playing once.

### Examples[#](#examples-1 "Permalink")

#### Example 1: Video element that loops forever in a scene with a duration of 30 seconds[#](#example-1-video-element-that-loops-forever-in-a-scene-with-a-duration-of-30-seconds "Permalink")

```
{
    "scenes": [
        {
            "duration": 30,
            "elements": [
                {
                    "type": "video",
                    "src": "https://example.com/video.mp4",
                    "loop": -1,
                    "duration": -2
                }
            ]
        }
    ]
}
```

The video element is looping forever and its duration is set to match the container, but the scene has an explicit duration of 30 seconds. Therefore the video element will loop forever for the first 30 seconds. The movie will be 30 seconds long, matching the scene duration.

#### Example 2: Video element that loops forever while an audio element plays[#](#example-2-video-element-that-loops-forever-while-an-audio-element-plays "Permalink")

```
{
    "scenes": [
        {
            "elements": [
                {
                    "type": "video",
                    "src": "https://example.com/video.mp4",
                    "loop": -1,
                    "duration": -2
                },
                {
                    "type": "audio",
                    "src": "https://example.com/audio.mp3"
                }
            ]
        }
    ]
}
```

The video element is looping forever and its duration is set to match the container.
The scene duration will be calculated to accommodate the length of the audio element (whatever it is). Therefore the video element will loop forever for the duration of the audio. The movie will be as long as the scene, that indeed will be as long as the audio.

[← Previous: Mastering](/docs/v2/api-reference/mastering)[Next: Layering →](/docs/v2/api-reference/mastering/layering)

---

## Content from: https://json2video.com/docs/v2/api-reference/mastering/layering

# Layering[#](#layering "Permalink")

## Layering elements in a scene or movie[#](#layering-elements-in-a-scene-or-movie "Permalink")

In JSON2Video, the order of elements within the `elements` array of a `scene` or `movie` dictates their layering. Elements listed later in the array are rendered on top of those listed earlier. This behavior mirrors the stacking context in HTML and CSS.

### Elements array order[#](#elements-array-order "Permalink")

The elements array order is the primary method for controlling layering. Elements listed later in the array are rendered on top of those listed earlier.

**Key Points:**

* The first element in the array is the bottom-most layer.
* Each subsequent element is placed above the previous one.
* The last element in the array is the top-most layer and will obscure any overlapping elements beneath it.

**Example**

Consider the following JSON snippet:

```
{
  "scenes": [
    {
      "duration": 10,
      "elements": [
        {
          "type": "image",
          "src": "background.jpg",
          "x": 0,
          "y": 0,
          "width": 1920,
          "height": 1080
        },
        {
          "type": "text",
          "text": "Hello World"
        }
      ]
    }
  ]
}
```

In this example, the image specified by `background.jpg` will be the background layer. The text "Hello World" will be rendered on top of the image.

**Overlapping Elements:**

If elements have overlapping coordinate spaces, the element with the higher stacking order will visually cover the element(s) below it.

### Controlling Layering with z-index[#](#controlling-layering-with-z-index "Permalink")

While the order in the `elements` array is the primary method for controlling layering, you can use the `z-index` property for more explicit control. The `z-index` property allows you to define the stacking order within a range of -99 to 99. Elements with higher `z-index` values are rendered on top of elements with lower values.

**Example:**

```
{
  "scenes": [
    {
      "duration": 10,
      "elements": [
        {
          "type": "text",
          "text": "Hello World",
          "z-index": 1
        },
        {
          "type": "image",
          "src": "background.jpg",
          "z-index": -1
        }
      ]
    }
  ]
}
```

In this example, the text continues to be rendered on top of the image, even though it's listed earlier in the `elements` array because the `z-index` of the text is set to 1 and the `z-index` of the image is set to -1.

## Transparent scenes with video backgrounds[#](#transparent-scenes-with-video-backgrounds "Permalink")

By default, the elements in the Movie `elements` array are layered over the scenes. This is helpful for adding a logo, a watermark, or any other element on top of all scenes.

**But what if you want the scenes to have a transparent background and show a video background?**

You can achieve this by setting the `background-color` property of the `scene` objects to `transparent` and adding a video element to the `elements` array with a `z-index` lower than 0. Scenes always have a `z-index` of 0, so the video will be rendered behind the scenes.

**Example**

```
{
  "scenes": [
    {
      "comment": "Scene 1",
      "background-color": "transparent",
      "duration": 5,
      "elements": [
        {
          "type": "text",
          "text": "This is scene 1"
        }
      ]
    },
    {
      "comment": "Scene 2",
      "background-color": "transparent",
      "duration": 5,
      "elements": [
        {
          "type": "text",
          "text": "This is scene 2"
        }
      ]
    }
  ],
  "elements": [
    {
      "type": "video",
      "src": "https://cdn.json2video.com/assets/videos/beach-04.mp4",
      "z-index": -1
    }
  ]
}
```

In this example, the scenes have a transparent background and the video is shown through the transparent background of the scenes.
The video is set to have a `z-index` of -1, which means it will be rendered behind the scenes.

[← Previous: Duration and timing](/docs/v2/api-reference/mastering/duration-and-timing)[Next: Positioning →](/docs/v2/api-reference/mastering/positioning)

---

## Content from: https://json2video.com/docs/v2/api-reference/mastering/positioning

# Positioning[#](#positioning "Permalink")

JSON2Video provides flexible options for positioning elements within your video scenes. You can use predefined positions for quick placement or define custom coordinates for precise control.

## Positioning elements[#](#positioning-elements "Permalink")

Elements can be positioned using the `position` property or with the `x` and `y` properties if `position` is set to `custom`.

### Predefined Positions[#](#predefined-positions "Permalink")

The `position` property allows you to quickly place an element in common locations. The `position` property intentionally leaves **a 5% gap** between the element and the edge of the movie canvas.

It accepts the following values:

* `top-left`: Places the element in the top-left corner.
* `top-right`: Places the element in the top-right corner.
* `bottom-right`: Places the element in the bottom-right corner.
* `bottom-left`: Places the element in the bottom-left corner.
* `center-center`: Places the element in the center of the scene, both horizontally and vertically.
* `custom`: Places the element at the coordinates specified in the `x` and `y` properties.

**Example:**

```
{
  "type": "image",
  "src": "https://example.com/image.png",
  "position": "top-right"
}
```

### Custom Coordinates[#](#custom-coordinates "Permalink")

For more precise placement, set the `position` property to `custom`. This enables the use of the `x` and `y` properties.

* `x`: The horizontal position of the element in pixels, relative to the left edge of the movie canvas. A value of `0` places the element at the left edge.
* `y`: The vertical position of the element in pixels, relative to the top edge of the movie canvas. A value of `0` places the element at the top edge.

**Example:**

```
{
  "type": "text",
  "text": "Custom Position",
  "position": "custom",
  "x": 100,
  "y": 50
}
```

## Positioning the Text and Component elements[#](#positioning-the-text-and-component-elements "Permalink")

The **Text and Component elements** behave exactly the same described above but have some additional properties to control the textbox alignment.

It consists of two main concepts:

1. **Element Canvas Area**:

   * This is the outer area that can occupy the full size of the video canvas. It serves as the boundary within which the text box is placed. The canvas can be adjusted to fit the full video size or a custom size with the `position`, `x`, `y`, `width` and `height` properties as described above.
2. **Textbox Inside the Canvas**:

   * Within the text element canvas, there is a textbox that can be aligned both vertically and horizontally. This alignment feature ensures that regardless of the text length, the textbox can be positioned accurately within the canvas. You can control the alignment of the textbox with the `vertical-position` and `horizontal-position` properties inside the `settings` object.

*Note: Not all `component` elements have a textbox and this does not apply to them.*

Therefore, the final position of the textbox relative to the video canvas is determined by the combination of:

* The size and position of the element canvas.
* The alignment settings of the textbox within the canvas.

This approach is particularly useful for dynamically positioning the textbox. Even if the textbox expands or contracts due to varying text lengths, it will maintain its alignment within the canvas. This ensures a consistent and visually appealing presentation of text in your video, regardless of content changes.

**Example: Positioning a Text element relative to the video canvas**

```
{
  "resolution": "full-hd",
  "scenes": [
    {
      "duration": 10,
      "elements": [
        {
          "type": "text",
          "text": "Hello World",
          "settings": {
            "vertical-position": "bottom",
            "horizontal-position": "left"
          }
        }
      ]
    }
  ]
}
```

In this example, the text element is positioned at the bottom-left corner of the video canvas:

* The `position` value is `custom` by default, the `x` and `y` values are `0` by default and the `width` and `height` values are `-1` by default. This means that by default, the text element canvas occupies the full size of the video canvas.
* The textbox is then aligned to the bottom and left edges of the canvas using the `vertical-position` and `horizontal-position` properties inside the `settings` object.

**Example: Positioning a Text element precisely within the video canvas**

```
{
  "resolution": "full-hd",
  "scenes": [
    {
      "duration": 10,
      "elements": [
        {
          "type": "text",
          "text": "Hello World",
          "position": "custom",
          "x": 200,
          "y": 100,
          "settings": {
            "vertical-position": "top",
            "horizontal-position": "left"
          }
        }
      ]
    }
  ]
}
```

In this example, the text element is positioned at the 200, 100 coordinates:

* The `position` value is `custom` to allow `x` and `y` values to be used.
* The element canvas is *moved* to the 200, 100 coordinates with the `x` and `y` values.
* The textbox is then aligned to the top and left edges of the element canvas using the `vertical-position` and `horizontal-position`.

[← Previous: Layering](/docs/v2/api-reference/mastering/layering)[Next: Caching system →](/docs/v2/api-reference/mastering/caching-system)

---

## Content from: https://json2video.com/docs/v2/api-reference/mastering/caching-system

# Caching system[#](#caching-system "Permalink")

JSON2Video is designed to optimize video rendering as much as possible and reduce waiting time. To achieve this, it utilizes a caching system to avoid redundant operations such as:

* Repeatedly downloading the same files.
* Re-rendering templates or scenes that haven't changed.

The system intelligently detects changes and rebuilds scenes or movies accordingly. However, you can manually control caching behavior using the `cache` property.

## Controlling Cache Behavior[#](#controlling-cache-behavior "Permalink")

The `cache` property can be applied to:

* **Movies:** Force a complete re-render of the entire movie.
* **Scenes:** Force a re-render of a specific scene.
* **Elements:** Force a re-render or re-download of a specific element.

To better understand how the caching system works, let's see a few cases:

* Forcing a re-render of the scene does not force the re-render or re-download of the elements in that scene, it only rebuilds the scene using the cached elements.
* Forcing a re-render of an element inside a scene automatically triggers a re-render of the scene, but the other elements in the scene may still be cached.

## Using the cache property[#](#using-the-cache-property "Permalink")

Set the `cache` property to `false` to force a fresh render, bypassing the cache. Setting it to `true` (or omitting the property) enables the system to use a cached version if available.

**Example: Forcing a Re-render of an Element**

```
{
    "type": "[[ELEMENT_TYPE]]",
    "cache": false
}
```

[← Previous: Positioning](/docs/v2/api-reference/mastering/positioning)[Next: Variables →](/docs/v2/api-reference/mastering/variables)

---

## Content from: https://json2video.com/docs/v2/api-reference/mastering/variables

# Variables[#](#variables "Permalink")

Variables are a powerful feature in JSON2Video that allows you to dynamically inject data into your movie scripts. They act as placeholders for values that can be changed without modifying the core structure of your JSON. This makes your templates more reusable and adaptable to different scenarios.

## Key Benefits of Using Variables[#](#key-benefits-of-using-variables "Permalink")

* **Reusability:** Create a single template and use it for multiple videos with varying content.
* **Maintainability:** Update values in one place (the `variables` object) instead of scattered throughout the JSON.
* **Dynamic Content:** Integrate with external data sources (e.g., APIs, databases) to populate your videos with real-time information.

## How Variables Work[#](#how-variables-work "Permalink")

Variables are defined in the `variables` object at the root level of your `movie` or `scene` JSON. This object contains key-value pairs, where the key is the variable name and the value is the data you want to inject.

**Steps:**

1. **Define Variables:** Create a `variables` object at the root level of your `movie` or `scene` JSON.
2. **Use Variables:** Reference variables within your JSON using double curly braces: `{{variable_name}}`. These placeholders will be replaced with their corresponding values during the rendering process.

**Example:**

```
{
  "resolution": "full-hd",
  "variables": {
    "title": "Summer Sale!",
    "discount_percentage": 20,
    "background_color": "#f0f0f0"
  },
  "scenes": [
    {
      "background-color": "{{background_color}}",
      "elements": [
        {
          "type": "text",
          "text": "{{title}}",
          "style": "001"
        },
        {
          "type": "text",
          "text": "Save {{discount_percentage}}%!",
          "style": "002",
          "start": 3
        }
      ]
    }
  ]
}
```

In this example:

* `title`, `discount_percentage`, and `background_color` are defined as variables.
* `{{title}}` is used to display the sale title.
* `{{discount_percentage}}` is used to display the discount amount.
* `{{background_color}}` is used to define the background color of the scene.

**Data Types:**

Variables can hold the following data types:

* `string`: Textual data (e.g., "Hello world", "Image URL").
* `number`: Numerical data (e.g., 10, 3.14).
* `boolean`: True/False values (e.g., true, false).
* `array`: A collection of values (e.g., `["value1", "value2"]`). *Note: Arrays used with the `iterate` property can enable variable number of scenes.*
* `object`: A nested JSON structure (e.g., `{"key": "value"}`).

**Scope:**

* **Movie-Level Variables:** Defined at the root of the `movie` object. These are accessible throughout the entire movie.
* **Scene-Level Variables:** Defined within a `scene` object. These are only accessible within that specific scene. Scene-level variables override movie-level variables with the same name.

**Variable Naming Conventions:**

* Variable names must start with a letter (a-z, A-Z).
* They can contain letters, numbers (0-9), and underscores (\_).
* Spaces and special characters are not allowed.

**Example of Overriding Movie-Level Variables with Scene-Level Variables:**

```
{
    "variables": {
        "font_color": "#FFFFFF"
    },
    "scenes":[
        {
            "variables": {
                "font_color": "#000000"
            },
            "elements":[
                {
                    "type": "text",
                    "text": "Scene 1",
                    "settings": {
                        "color": "{{font_color}}" // Will be #000000
                    }
                }
            ]
        },
         {
            "elements":[
                {
                    "type": "text",
                    "text": "Scene 2",
                    "settings": {
                        "color": "{{font_color}}" // Will be #FFFFFF
                    }
                }
            ]
        }
    ]
}
```

In scene 1, the `font_color` is defined at scene level and has precedence over the `font_color` defined at movie level.
In scene 2, there is no definition of `font_color` at scene level, so the `font_color` defined at movie level is used.

**Important Considerations:**

* **Security:** Avoid storing sensitive information (API keys, passwords) directly in variables.
* **Data Validation:** Implement validation on your data sources to ensure variable values are compatible with the expected data types.
* **Performance:** Excessive use of variables and complex expressions may impact rendering performance. Test thoroughly.

[← Previous: Caching system](/docs/v2/api-reference/mastering/caching-system)[Next: Expressions →](/docs/v2/api-reference/mastering/expressions)

---

## Content from: https://json2video.com/docs/v2/api-reference/mastering/expressions

# Expressions[#](#expressions "Permalink")

Expressions allow you to perform calculations and conditional logic directly within your JSON2Video templates. They are enclosed in double curly braces `{{` and `}}` and evaluated during the video rendering process, enabling dynamic customization of your videos.

## Syntax[#](#syntax "Permalink")

Expressions must be enclosed in double curly braces: `{{ expression }}`.

## Use Cases[#](#use-cases "Permalink")

Expressions can be used in various places within a movie template to dynamically set values, including:

* Element durations
* Text content
* Conditional rendering of elements or scenes
* CSS properties within components

## Supported Operators and Functions[#](#supported-operators-and-functions "Permalink")

JSON2Video supports the following operators and functions within expressions:

* **Arithmetic Operators:** `+` (addition), `-` (subtraction), `*` (multiplication), `/` (division)
* **Comparison Operators:** `==` (equal to), `!=` (not equal to), `>` (greater than), `<` (less than), `>=` (greater than or equal to), `<=` (less than or equal to)
* **Logical Operators:** `and` (logical AND), `or` (logical OR)
* **Ternary Operator:** `condition ? value_if_true : value_if_false`
* **Math Functions:** `min(a, b)` (returns the minimum of a and b), `max(a, b)` (returns the maximum of a and b)

## Examples[#](#examples "Permalink")

Here are some practical examples of how to use expressions:

### Dynamic Element Duration[#](#dynamic-element-duration "Permalink")

```
{
  "variables": {
    "base_duration": 5
  },
  "scenes": [
    {
      "elements": [
        {
          "type": "text",
          "text": "Dynamic Duration",
          "duration": "{{ base_duration + 2 }}" // Duration will be 7 seconds
        }
      ]
    }
  ]
}
```

In this example, the duration of the text element is dynamically calculated by adding 2 seconds to the value of the `base_duration` variable.

### Conditional Text Content[#](#conditional-text-content "Permalink")

```
{
  "variables": {
    "show_alternate_text": true,
    "primary_text": "Hello",
    "secondary_text": "Goodbye"
  },
  "scenes": [
    {
      "elements": [
        {
          "type": "text",
          "text": "{{ show_alternate_text ? secondary_text : primary_text }}"
          //If show_alternate_text is true, the text will be "Goodbye". Otherwise, it will be "Hello".
        }
      ]
    }
  ]
}
```

This example uses the ternary operator to dynamically set the text content based on the boolean value of the `show_alternate_text` variable.

### Setting a Component's width[#](#setting-a-components-width "Permalink")

```
{
  "comment": "Variables example",
  "resolution": "full-hd",
  "variables": {
      "base_width": 100,
      "scaling_factor": 0.5
  },
  "scenes": [
    {
      "elements": [
        {
          "type": "component",
          "component": "basic/000",
          "width": "{{ base_width * scaling_factor }}"
        }
      ]
    }
  ]
}
```

In this example, the width of the component is dynamically calculated by multiplying the value of the `base_width` variable by the value of the `scaling_factor` variable.

[← Previous: Variables](/docs/v2/api-reference/mastering/variables)[Next: Conditional elements →](/docs/v2/api-reference/mastering/conditional-elements)

---

## Content from: https://json2video.com/docs/v2/api-reference/mastering/conditional-elements

# Conditional elements[#](#conditional-elements "Permalink")

You can create templates that include or exclude elements based on the value of an expression. This is useful to create dynamic templates that can adapt to different situations.

For example, you can create a template that includes a different number of scenes based on the value of a variable. Or you can create a scene that includes a different set of elements based on the value of another variable.

## The condition property[#](#the-condition-property "Permalink")

To create a conditional element or scene, you need to use the `condition` property. The `condition` property is an expression that will be evaluated to a boolean value. If the condition is `true`, the element or scene will be included in the template. If the condition is `false` or the variable is an empty string, the element or scene will be excluded from the template.

The condition is evaluated in the context of the variable values that are available at the time the template is rendered. This means that the condition can use the same variables that are used in the rest of the template. For example, you can create a condition that includes an element only if a variable is greater than 10, or that includes an element only if another variable is not empty.

## Examples[#](#examples "Permalink")

### Conditional element[#](#conditional-element "Permalink")

The following example shows a template that includes a scene with two text elements, depending on the value of the `message_to_show` variable it will show one or the other.

```
{
	"comment": "Conditional elements example",
	"resolution": "full-hd",
    "variables": {
        "message_to_show": 1,
        "message1": "This is message 1",
        "message2": "This is message 2",
        "bgColor": "#4392F1"
    },
	"scenes": [
		{
			"background-color": "{{bgColor}}",
			"elements": [
				{
					"condition": "{{message_to_show == 1}}",
					"type": "text",
					"style": "005",
					"text": "{{message1}}",
					"duration": 10
				},
                {
					"condition": "{{message_to_show == 2}}",
                    "type": "text",
                    "style": "005",
                    "text": "{{message2}}",
                    "duration": 10
                }
			]
		}
	]
}
```

In the example above, the first text element will be shown because the `message_to_show` variable is equal to 1. The second text element will be bypassed because `{{message_to_show == 2}}` evaluates to `false`.

[← Previous: Expressions](/docs/v2/api-reference/mastering/expressions)[Next: Dynamic number of scenes →](/docs/v2/api-reference/mastering/dynamic-number-of-scenes)

---

## Content from: https://json2video.com/docs/v2/api-reference/mastering/dynamic-number-of-scenes

# Dynamic number of scenes[#](#dynamic-number-of-scenes "Permalink")

Sometimes it's necessary to create a video where the number of scenes is not fixed but determined dynamically based on data. For example, you might want to create a slideshow where the number of images and their associated durations are defined in a data source. JSON2Video supports this through the `iterate` property within a scene definition.

## Using the iterate property[#](#using-the-iterate-property "Permalink")

The `iterate` property allows you to repeat a scene definition for each item in an array specified in the `variables` section of the movie.

**Example:**

```
{
  "comment": "Variable number of scenes example",
  "resolution": "full-hd",
  "variables": {
    "slides": [
      {
        "image_url": "https://example.com/image1.jpg",
        "duration": 5,
        "title": "Slide 1"
      },
      {
        "image_url": "https://example.com/image2.jpg",
        "duration": 3,
        "title": "Slide 2"
      },
      {
        "image_url": "https://example.com/image3.jpg",
        "duration": 7,
        "title": "Slide 3"
      }
    ]
  },
  "scenes": [
    {
      "iterate": "slides",
      "duration": "{{duration}}",
      "elements": [
        {
          "type": "image",
          "src": "{{image_url}}"
        },
        {
          "type": "text",
          "text": "{{title}}",
          "style": "005"
        }
      ]
    }
  ]
}
```

[← Previous: Conditional elements](/docs/v2/api-reference/mastering/conditional-elements)[Next: AI integrations →](/docs/v2/api-reference/ai-integrations)

---

## Content from: https://json2video.com/docs/v2/api-reference/ai-integrations

# AI integrations[#](#ai-integrations "Permalink")

JSON2Video API allows you to integrate with AI models for asset generation like images, videos, audios, etc.

Currently, JSON2Video API only supports AI generation for **images** and **voiceovers**, but we are working on adding videos and music generation in the short term.

The asset generation with AI is done using the regular [Elements API](/docs/v2/api-reference/json-syntax). The only difference is that you need to provide the AI model you want to use and the parameters for the AI model.

You have two options to use the AI models:

* Using your own third-party API Keys (Bring your own API Keys, or BYOA)
* Using JSON2Video managed service

## JSON2Video managed service[#](#json2video-managed-service "Permalink")

When using JSON2Video managed service, any cost of using the AI models is charged by JSON2Video to your account. You don't need to open accounts, subscribing or providing credit card information to the third-party API providers. JSON2Video will handle all the setup and billing for you.

JSON2Video managed service is the easiest way to use the AI models, and we try to keep the price as low as possible, even lower than the public pricing of the third-party API providers.

Learn more about how pricing works for the managed service in [Credit consumption](/docs/v2/pricing/credit-consumption).

## Bring your own API keys[#](#bring-your-own-api-keys "Permalink")

When using BYOA, any cost of using the AI models is charged by the third-party API provider directly to you. You are responsible for setting up your account, managing the API keys and the costs associated with the AI models and keep enough credit in your account to generate the assets you need.

> Important note: Only paid Elevenlabs accounts can be used for voiceover generation.

To use your own API keys, you must create a Connection in your [JSON2Video dashboard](/dashboard/connections).

![Create a Connection](/docs/v2/content/api-reference/mastering/images/dashboard-connections.png)

For example, if you want to use your own API keys for ElevenLabs you would do this:

* Create a Connection with a relevant ID for you (like `my-elevenlabs-apikey`)
* Select `apikey` as the type of connection
* Enter your API Key
* Save

You can repeat this process for any other API Key you want to use.

![Create a new API key connection](/docs/v2/content/api-reference/mastering/images/dashboard-new-apikey.png)

### How to use your own API keys in your JSON2Video API requests[#](#how-to-use-your-own-api-keys-in-your-json2video-api-requests "Permalink")

To use your own API keys in your JSON2Video API requests, you need to set the connection property to the ID of the Connection you created.

For example, if you want to use your own API keys for ElevenLabs you would do this:

```
{
    "resolution": "full-hd",
    "scenes": [
        {
            "elements": [
                {
                    "type": "voice",
                    "model": "elevenlabs",
                    "connection": "my-elevenlabs-apikey", // The ID of the Connection you created
                    "text": "That's one small step for a man, one giant leap for mankind.",
                    "voice": "Brian"
                }
            ]
        }
    ]
}
```

[← Previous: Dynamic number of scenes](/docs/v2/api-reference/mastering/dynamic-number-of-scenes)[Next: ElevenLabs →](/docs/v2/api-reference/ai-integrations/elevenlabs)

---

## Content from: https://json2video.com/docs/v2/api-reference/ai-integrations/elevenlabs

# ElevenLabs[#](#elevenlabs "Permalink")

JSON2Video API integrates with [ElevenLabs](https://elevenlabs.io/) to provide high-quality AI-powered voiceovers. This integration enables you to generate realistic and expressive speech from text directly within your video creation workflow.

## Key Features[#](#key-features "Permalink")

* **High-Quality Voice Generation:** Leverage ElevenLabs' advanced AI models for natural-sounding voiceovers.
* **Voice Variety:** Choose from a wide range of pre-existing voices or use custom ElevenLabs voices.
* **Simplified Integration:** Seamlessly integrate voiceover generation into your video creation process with the [Voice element](https://json2video.com/docs/v2/api-reference/json-syntax/element/voice).

## How to Use ElevenLabs in JSON2Video[#](#how-to-use-elevenlabs-in-json2video "Permalink")

1. **Select the your preferred model:** In your `voice` element, specify `elevenlabs` or `elevenlabs-flash-v2-5` as the `model` value.
2. **Choose a Voice:** Provide the name of a voice you want to use in the `voice` property. For example, `"Adam"` or `"Rachel"`. See [ElevenLabs Voices Library](https://json2video.com/ai-voices/elevenlabs/) for available voices.
3. **Provide Text:** Set the text you want the voice to speak in the `text` property.
4. **Configure a Connection (Optional):** If you have your own ElevenLabs API key, create a [Connection](https://json2video.com/dashboard/connections) and set the connection ID to use your account.

## Credit Consumption[#](#credit-consumption "Permalink")

Using the ElevenLabs models will consume credits from your JSON2Video account. Refer to the [Credit Consumption](https://json2video.com/docs/v2/pricing/credit-consumption) section for more details.

## Bring your own ElevenLabs API key[#](#bring-your-own-elevenlabs-api-key "Permalink")

If you have your own ElevenLabs API key, you can use it to generate voiceovers.
Check this page for more information on [how to create a Connection to your ElevenLabs account](https://json2video.com/docs/v2/api-reference/ai-integrations#bring-your-own-api-keys).

## Examples[#](#examples "Permalink")

**Basic Example:**

```
{
  "scenes": [
    {
      "elements": [
        {
          "type": "voice",
          "model": "elevenlabs",
          "voice": "Adam",
          "text": "Hello, I am an ElevenLabs generated voiceover."
        }
      ]
    }
  ]
}
```

**Using Your Own ElevenLabs API Key:**

```
{
  "scenes": [
    {
      "elements": [
        {
          "type": "voice",
          "model": "elevenlabs",
          "connection": "my-elevenlabs-connection",
          "voice": "p16ZaTyG1Ks9FQ9LpSun",
          "text": "Hello, world!"
        }
      ]
    }
  ]
}
```

**Example using the ElevenLabs Flash v2.5 model:**

ElevenLabs Flash v2.5 model is a faster way to generate voiceovers that also supports a wide range of voices and languages.
The credit consumption is the same of the ElevenLabs model. To generate a voiceover using Flash v2.5, use `elevenlabs-flash-v2-5` as the value for the property `model`:

```
{
  "scenes": [
    {
      "elements": [
        {
          "type": "voice",
          "model": "elevenlabs-flash-v2-5",
          "voice": "Adam",
          "text": "Hello, I am an ElevenLabs Flash v2.5 generated voiceover."
        }
      ]
    }
  ]
}
```

## Customizing ElevenLabs settings[#](#customizing-elevenlabs-settings "Permalink")

JSON2Video's Voice element supports the `model-settings` property to pass custom configuration to ElevenLabs API.
You can read the available settings in ElevenLabs's API reference here:
<https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request>

**Example using the `model-settings` property:**

```
{
  "scenes": [
    {
      "elements": [
        {
          "type": "voice",
          "model": "elevenlabs",
          "voice": "p16ZaTyG1Ks9FQ9LpSun",
          "text": "Hello, world!",
          "model-settings": {
            "language_code": "en"
          }
        }
      ]
    }
  ]
}
```

### Changing the ElevenLabs speech speed[#](#changing-the-elevenlabs-speech-speed "Permalink")

One of the `voice_settings` is `speed` that controls the speed of the voiceover. The value is a number between `0.7` and `1.2`.

**Example changing the ElevenLabs speech speed:**

```
{
  "scenes": [
    {
      "elements": [
        {
          "type": "voice",
          "model": "elevenlabs",
          "voice": "p16ZaTyG1Ks9FQ9LpSun",
          "text": "Hello, world!",
          "model-settings": {
            "voice_settings": {
              "speed": 1.2
            }
          }
        }
      ]
    }
  ]
}
```

[← Previous: AI integrations](/docs/v2/api-reference/ai-integrations)[Next: Templates →](/docs/v2/api-reference/templates)

---

## Content from: https://json2video.com/docs/v2/api-reference/templates

# Templates[#](#templates "Permalink")

Templates in JSON2Video allow you to save and reuse JSON scripts, streamlining your video creation process. They are especially powerful when combined with [variables](/docs/v2/api-reference/mastering/variables), enabling you to customize your videos dynamically without altering the core script.

## Key Benefits of Using Templates[#](#key-benefits-of-using-templates "Permalink")

* **Reusability:** Store and reuse your video scripts across multiple projects.
* **Centralized Management:** Update a template once, and all new videos created from that template will reflect the changes.
* **Simplified Customization:** Use variables to inject dynamic content into your videos without modifying the underlying JSON structure.
* **No-Code Integration Friendly:** Simplifies integration with no-code platforms like Zapier and Make, where you can reference a template ID instead of passing the entire JSON payload.

**Use Cases:**

Templates are ideal for scenarios where you create videos with consistent structure and design, such as:

* Automated social media content
* Video ads for different products or services
* Personalized marketing videos
* Data-driven visualizations

## When should you use movie templates[#](#when-should-you-use-movie-templates "Permalink")

Movie templates are suitable for the following use cases:

* When the videos you are creating are consistent and don't change too much. For example, they have the same structure and you are only changing elements like text, images, audio or voice elements.
* Even if you don't know in advance the number of scenes or the number of elements in each scene, you can use a template with [a variable number of scenes](/docs/v2/api-reference/mastering/dynamic-number-of-scenes).
* When you are integrating with no code tools like Zapier or Make. In this case, you only need to provide a reference to the template and you don't need to provide the JSON script in the request.

Movie templates are **not a good choice** for the following use cases:

* When the movie structure significantly changes for each render. In this case you should create the movie building the JSON script programmatically.

## Creating Templates[#](#creating-templates "Permalink")

You can create templates from the Dashboard following these steps:

1. Go to the [Templates section](https://json2video.com/dashboard/templates) in the Dashboard
2. Click on the **Add new template** button at the bottom of the page
3. Click on the recently created template to open the editor
4. Rename the template by clicking on the template name in the top bar
5. Edit the template using the visual editor or the JSON editor (in the **Template** menu on the top bar)
6. The visual editor auto saves your changes every 5 seconds

## Calling Templates from the API[#](#calling-templates-from-the-api "Permalink")

Instead of sending a complete JSON payload, you simply reference the template ID in your API request:

```
{
  "comment": "Using a template ID",
  "template": "[[YOUR_TEMPLATE_ID]]",
  "variables": {
    "title": "Dynamic Title",
    "bgColor": "#00FF00"
  }
}
```

When you call a template, any `scenes` or `elements` arrays are ignored.

## Template examples[#](#template-examples "Permalink")

### Basic template example[#](#basic-template-example "Permalink")

```
{
	"comment": "Hello world example",
	"resolution": "full-hd",
	"variables": {
		"message": "Hello world!"
	},
	"scenes": [
		{
			"background-color": "#4392F1",
			"elements": [
				{
					"type": "text",
					"style": "005",
					"text": "{{message}}",
					"duration": 10
				}
			]
		}
	]
}
```

The template above will be rendered as a single scene with a blue background and the text defined by the `message` variable displayed in the center of the screen.

### More examples[#](#more-examples "Permalink")

You can find some template examples in the [Template examples](/docs/v2/template-examples) in this documentation.

[← Previous: ElevenLabs](/docs/v2/api-reference/ai-integrations/elevenlabs)[Next: Customizing existing templates →](/docs/v2/api-reference/templates/customizing-existing-templates)

---

## Content from: https://json2video.com/docs/v2/api-reference/templates/customizing-existing-templates

# Customizing Existing Templates[#](#customizing-existing-templates "Permalink")

Often, you might want to adapt a pre-existing JSON2Video template to better suit your specific needs. This is a common scenario when following tutorials or using templates shared by others. You might find that while the core structure is helpful, some aspects like colors, element positions, or animations need adjustments.

Let's say you followed an YouTube tutorial that provided you with an API call like this:

```
{
  "templateId": "1234567890",
  "variables": {
    "title": "My Customized Title"
  }
}
```

Imagine that the template with the ID "1234567890" displays a center-aligned title with a blue background. But you want a red background and a left-aligned title. How do you achieve this without altering the original template?

The JSON2Video API doesn't directly support overriding elements or scenes when calling a template by ID. You can't selectively modify parts of the template within the API call itself.

## Duplicate and Customize the Template[#](#duplicate-and-customize-the-template "Permalink")

The recommended approach is to:

1. **Duplicate the template:** Create a copy of the existing template.
2. **Customize the copy:** Modify the duplicated template to your liking.
3. **Use the new ID:** Reference the ID of the duplicated template in your API call.

Here's a step-by-step guide:

1. **Open the Template Editor:** Navigate to the [Visual Editor](https://json2video.com/tools/visual-editor/).
2. **Open by ID:** In the **Template** menu at the top, select **Open template by ID**.
3. **Enter the Template ID:** Paste the source template ID (e.g., "1234567890") into the dialog box. The template will load into the editor.
4. **Read-Only Awareness:** If you don't own the original template, it will open in **Read-only** mode. You can still save a copy.
5. **Save a Duplicate:** From the **Template** menu, choose **Save template as**. This creates a duplicate with a new, unique ID.
6. **Customize the Duplicate:** Modify the duplicated template to your specifications. For example, change the background color and title alignment. The [Visual Editor](https://json2video.com/tools/visual-editor/) provides an intuitive way to make these changes. Alternatively, you can use the JSON editor available in the **Template** menu.
7. **Retrieve the New Template ID:** Access the **Template** menu and select **Show template ID** to get the ID of the *newly duplicated* template.
8. **Use the New ID in Your API Call:** Replace the original `templateId` with the new one in your API request:

```
{
  "templateId": "[[NEW_TEMPLATE_ID]]",
  "variables": {
    "title": "My Customized Title"
  }
}
```

[← Previous: Templates](/docs/v2/api-reference/templates)[Next: Exports →](/docs/v2/api-reference/exports)

---

## Content from: https://json2video.com/docs/v2/api-reference/exports

# Exports[#](#exports "Permalink")

JSON2Video API offers a variety of export options to choose from, allowing you to automate the post-rendering processes. This allows you to streamline your video creation workflow.

The `exports` property within the `movie` object configures the export process, enabling options such as:

* Uploading videos to FTP or SFTP servers.
* Triggering webhooks for real-time notifications.
* Sending email notifications upon completion.

These options are detailed further in the subsequent sections.

## The exports property[#](#the-exports-property "Permalink")

The `exports` property of the `movie` object is an array used to configure the export process, with the following options:

```
{
    "resolution": "full-hd",
    "scenes": [],
    "exports": [{
        "destinations": [{
            "id": "my-destination-id",
        }]
    }]
}
```

Currently, the `exports` array only supports one item, but the `destinations` array can be used to specify multiple destinations.

## The destinations property[#](#the-destinations-property "Permalink")

The `destinations` property of the `exports` object is an array used to configure the different destinations of the export process. You can specify multiple destinations for example to publish to more than one SFTP server.

Each destination item is an object with different properties depending on the type of destination. Destination items are executed in the order they are specified in the `destinations` array, therefore the first destination item in the `destinations` array will be executed first, the second item will be executed after the first one finishes, etc.

The following types of destinations are currently supported:

* FTP and SFTP destinations
* Webhook destinations
* Email destinations

### Exports timeout[#](#exports-timeout "Permalink")

The process of exporting to all the destinations is limited to 5 minutes. If any of the uploads takes too much time, the process may timeout and can be aborted.

## Defining destinations[#](#defining-destinations "Permalink")

For secutity reasons, it's not a good idea to include connection details and credentials in every call to the API, as they can be accidentally exposed. A solution to this is to define [Connections in the dashboard](https://json2video.com/dashboard/connections) to store all or part of the destination details and refer to them by an identifier (`id`).

![Connections](/docs/v2/content/api-reference/exports/images/dashboard-connections-edit.png)

The `id` is used to refer to the connection in the Connections section of the dashboard. In the example above, the `id` is `test-ftp` and the JSON would look like this:

```
{
    "resolution": "full-hd",
    "quality": "high",
    "scenes": [],
    "exports": [{
        "destinations": [{
            "id": "test-ftp"
        }]
    }]
}
```

Sensible fields (like passwords or API keys) are encrypted on the API side to keep them safe.

If needed, any of the properties (with the exception of type) can be overwritten real-time in the destination object, for example:

```
{
    "resolution": "full-hd",
    "quality": "high",
    "scenes": [],
    "exports": [{
        "destinations": [{
            "id": "test-ftp",
            "file": "myfile.mp4"
        }]
    }]
}
```

## Macros[#](#macros "Permalink")

Field values can include macros that are evaluated at runtime and can be used to generate dynamic values.

This is specially useful when you want to set the name of the file that will be uploaded to a server, or create an email message that includes the URL to download the file.

The following macros are available:

| Macro | Description | Example |
| --- | --- | --- |
| `__yyyy__` | The year number | 2023 |
| `__mm__` | The month number | 12 |
| `__dd__` | The day number | 25 |
| `__hh__` | The hour number | 12 |
| `__nn__` | The minute number | 30 |
| `__ss__` | The second number | 00 |
| `__random__` | A random number | 31648 |
| `__filename__` | The original file name created by the API | 2023-03-25-38267.mp4 |
| `__filename_without_extension__` | The original file name without extension | 2023-03-25-38267 |
| `__filename_extension__` | The original file name extension | mp4 |

### Example[#](#example "Permalink")

Here is an example of using macros:

```
{
    "resolution": "full-hd",
    "quality": "high",
    "scenes": [...],
    "exports": [{
        "destinations": [{
            "id": "my-ftp",
            "remote-path": "./videos/__yyyy__/__mm__/",
            "file": "__random__.mp4"
        }]
    }]
}
```

In this example, when the movie is rendered, the video file will be uploaded to the FTP server defined in the connection with the id `my-ftp` and the file will be named `31648.mp4` and uploaded to the path `./videos/2025/03/`.

*Note: assuming the current date is 2025-03-13 and the random number generated is 31648.*

[← Previous: Customizing existing templates](/docs/v2/api-reference/templates/customizing-existing-templates)[Next: Webhooks →](/docs/v2/api-reference/exports/webhooks)

---

## Content from: https://json2video.com/docs/v2/api-reference/exports/webhooks

# Webhooks[#](#webhooks "Permalink")

Webhooks allow you to receive real-time notifications about the status of your video rendering jobs. Instead of repeatedly polling the API to check if a movie is complete, you can configure a webhook endpoint that JSON2Video will call when the rendering process finishes. This enables you to trigger other actions in your systems, such as updating a database, sending an email, or publishing the video to a platform.

Webhooks are very useful when using the API from no-code platforms like [Make.com](https://www.make.com/en/), [N8N](https://n8n.io/) or [Zapier](https://zapier.com/).

## Configuring a Webhook[#](#configuring-a-webhook "Permalink")

Webhooks are configured using the `exports` array within the `movie` object, specifically within a `destinations` array. The webhook destination object requires two key properties:

* `type`: Set to `webhook`.
* `endpoint`: The publicly accessible URL of your webhook endpoint.

An optional property allows you to specify the content type:

* `content-type`: `json` (default) or `urlencoded`.

Here's an example JSON snippet illustrating webhook configuration:

```
{
    "resolution": "full-hd",
    "quality": "high",
    "scenes": [],
    "exports": [
        {
            "destinations": [
                {
                    "type": "webhook",
                    "endpoint": "https://yourdomain.com/webhook"
                }
            ]
        }
    ]
}
```

## Webhook Request Details[#](#webhook-request-details "Permalink")

When the rendering process is complete (or if the export to other destinations finishes), JSON2Video will send a `POST` request to your configured `endpoint`. The request body will contain information about the completed movie, either in `JSON` or `urlencoded` format, depending on the `content-type` you set up.

**JSON Payload Example:**

```
{
    "width": "1920",
    "height": "1080",
    "duration": "10.5",
    "size": "4567890",
    "url": "https://assets.json2video.com/clients/yourclientid/renders/yourmovie.mp4",
    "project": "[[your_project_id]]",
    "id": "[[your_movie_id]]",
    "client-data": {
        "my-custom-field": "my-custom-value"
    }
}
```

**Payload Properties:**

* `width`: The width of the rendered video in pixels.
* `height`: The height of the rendered video in pixels.
* `duration`: The duration of the rendered video in seconds.
* `size`: The size of the rendered video file in bytes.
* `url`: A publicly accessible URL where the rendered video can be downloaded.
* `project`: The project ID associated with the rendering job.
* `id`: The value of the `id` property from the original `movie` object, if provided. This allows you to correlate the webhook notification with the specific movie you submitted.
* `client-data`: An object containing any custom data you provided in the `client-data` property of the original `movie` object.

## Dashboard connections[#](#dashboard-connections "Permalink")

For security reasons, it's highly recommended that the endpoint URLs are configured as Connections in the [dashboard](https://json2video.com/dashboard) rather than placing directly the URL in the JSON payload.

![Creating a webhook connection](/docs/v2/content/api-reference/exports/images/dashboard-connections-webhook.png)

This allows sensitive data (such as API keys or credentials for services you're integrating with) to be securely stored and managed. Instead of the endpoint URL, reference the connection using the connection `id` property.

See [Exports documentation](/docs/v2/api-reference/exports) for more details.

### Example using connection ID[#](#example-using-connection-id "Permalink")

```
{
    "resolution": "full-hd",
    "quality": "high",
    "scenes": [],
    "exports": [
        {
            "destinations": [
                {
                    "id": "your-webhook-connection-id"
                }
            ]
        }
    ]
}
```

In this example, the webhook configuration is defined in a connection with the id `your-webhook-connection-id` in the dashboard.

## Multiple Destinations[#](#multiple-destinations "Permalink")

Webhooks can be used in conjunction with other export destinations. For instance, you can configure JSON2Video to upload the rendered video to an FTP server and *then* trigger your webhook to notify your system of the successful upload. Destinations are executed sequentially. This provides a powerful way to automate complex workflows.

### Example[#](#example "Permalink")

```
{
    "resolution": "full-hd",
    "quality": "high",
    "scenes": [],
    "exports": [
        {
            "destinations": [
                {
                    "id": "your-ftp-connection-id"
                },
                {
                    "type": "webhook",
                    "endpoint": "https://yourdomain.com/webhook"
                }
            ]
        }
    ]
}
```

In this example, the video is rendered and uploaded to an FTP server first, and then the webhook is triggered to notify your system of the successful upload.

## Creating the webhook endpoint[#](#creating-the-webhook-endpoint "Permalink")

You are responsible for creating the webhook endpoint that will receive the `POST` request from JSON2Video. Your endpoint *must* be publicly accessible on the internet and have a valid SSL certificate (HTTPS).

You can implement the endpoint using any programming language or framework you choose.

Sample implementations using PHP and Node.js are provided below:

### PHP example[#](#php-example "Permalink")

```
<?php

// Retrieve JSON payload from the POST request
$jsonPayload = file_get_contents("php://input");

// Decode JSON data
$data = json_decode($jsonPayload, true);

// Access video metadata and download URL
$videoUrl = $data["url"];
$projectId = $data["project"];

//  Your custom processing logic here

http_response_code(200); // Indicate success
echo "Webhook received successfully!";

?>
```

### Node.js example[#](#nodejs-example "Permalink")

This example uses the Express framework to create a simple webhook endpoint.

```
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const videoUrl = req.body.url;
  const projectId = req.body.project;

  // Your custom processing logic here

  res.status(200).send('Webhook received successfully!');
});

app.listen(port, () => {
  console.log(`Webhook endpoint listening on port ${port}`);
});
```

### Notes[#](#notes "Permalink")

* Ensure the PHP or Node.js server is publicly accessible and has a valid SSL certificate for secure communication.
* Replace the placeholder logic in the examples with your specific video processing requirements.
* Test your webhook endpoint thoroughly to ensure proper integration with JSON2Video.

[← Previous: Exports](/docs/v2/api-reference/exports)[Next: Uploading to FTP/SFTP →](/docs/v2/api-reference/exports/uploading-to-ftpsftp)

---

## Content from: https://json2video.com/docs/v2/api-reference/exports/uploading-to-ftpsftp

# Uploading to FTP/SFTP[#](#uploading-to-ftpsftp "Permalink")

JSON2Video API allows you to automatically upload your rendered videos to FTP or SFTP servers. This eliminates the need to manually download and upload the videos, streamlining your workflow.

## Configuration[#](#configuration "Permalink")

To configure FTP/SFTP upload, you need to define a destination of type `ftp` or `sftp` within the `exports` property of your movie object. For security reasons, it's recommended to store connection details in the [dashboard](https://json2video.com/dashboard/) and reference them by their `id`.

## Properties[#](#properties "Permalink")

The following properties are required for FTP and SFTP destinations:

* `type`: `ftp` or `sftp`
* `host`: The FTP/SFTP server hostname or IP address.
* `port`: The port number for the FTP/SFTP connection (e.g., 21 for FTP, 22 for SFTP).
* `username`: The username for authentication.
* `password`: The password for authentication.

The following properties are optional:

* `remote-path`: The remote directory where the video will be uploaded. Defaults to the root directory (`./`).
* `file`: The desired filename for the uploaded video. If not specified, a unique filename will be generated based on the date and a random number.

## Macros[#](#macros "Permalink")

You can use macros in the `remote-path` and `file` properties to generate dynamic paths and filenames. The available macros are:

* `__yyyy__`: Year (e.g., 2023)
* `__mm__`: Month (e.g., 12)
* `__dd__`: Day (e.g., 25)
* `__hh__`: Hour (e.g., 12)
* `__nn__`: Minute (e.g., 30)
* `__ss__`: Second (e.g., 00)
* `__random__`: A random number (e.g., 31648)
* `__filename__`: The original filename created by the API (e.g., 2023-03-25-38267.mp4)
* `__filename_without_extension__`: The original filename without extension (e.g., 2023-03-25-38267)
* `__filename_extension__`: The original filename extension (e.g., mp4)

## Example using Connection ID (Recommended)[#](#example-using-connection-id-recommended "Permalink")

This is the recommended approach. Configure your FTP/SFTP connection in the [dashboard](https://json2video.com/dashboard/) and reference it using its `id`:

```
{
    "resolution": "full-hd",
    "quality": "high",
    "scenes": [],
    "exports": [{
        "destinations": [{
            "id": "my-ftp-connection",
            "file": "my_video_ __yyyy__-__mm__-__dd__.mp4"
        }]
    }]
}
```

## Example including credentials (Not Recommended)[#](#example-including-credentials-not-recommended "Permalink")

**Warning:** Storing credentials directly in your API calls is **not recommended** for security reasons. Use Connections in the dashboard instead.

```
{
    "resolution": "full-hd",
    "quality": "high",
    "scenes": [],
    "exports": [{
        "destinations": [{
            "type": "ftp",
            "host": "ftp.example.com",
            "port": 21,
            "username": "ftp_user",
            "password": "ftp_password",
            "remote-path": "/videos/__yyyy__/__mm__/",
            "file": "__random__.mp4"
        }]
    }]
}
```

[← Previous: Webhooks](/docs/v2/api-reference/exports/webhooks)[Next: Email notification →](/docs/v2/api-reference/exports/email-notification)

---

## Content from: https://json2video.com/docs/v2/api-reference/exports/email-notification

# Email notification[#](#email-notification "Permalink")

JSON2Video API allows you to configure email notifications to be sent upon completion of video rendering. This is particularly useful for automated workflows, informing users when their videos are ready or triggering downstream processes.

## Configuration[#](#configuration "Permalink")

Email notifications are configured using the `exports` property within the movie object. You can define an email destination within the `destinations` array.

```
{
    "resolution": "full-hd",
    "quality": "high",
    "scenes": [],
    "exports": [{
        "destinations": [{
            "type": "email",
            "to": "your-email@example.com",
            "subject": "Your video is ready!",
            "message": "Your video is now available at __video_url__"
        }]
    }]
}
```

## Properties[#](#properties "Permalink")

The email destination object has the following properties:

* **`type`**: (Required) Set to `"email"`.
* **`to`**: (Required) The recipient's email address.
* **`subject`**: (Required) The subject line of the email.
* **`message`**: (Required) The body of the email message. Supports macros for dynamic content.

## Macros[#](#macros "Permalink")

You can use macros within the `subject` and `message` properties to include dynamic information about the rendered video.

* `__yyyy__`: the year number (example: 2023)
* `__mm__`: the month number (example: 12)
* `__dd__`: the day number (example: 25)
* `__hh__`: the hour number (example: 12)
* `__nn__`: the minute number (example: 30)
* `__ss__`: the second number (example: 00)
* `__random__`: a random number (example: 31648)
* `__filename__`: the original file name created by the API (example: 2023-03-25-38267.mp4)
* `__filename_without_extension__`: the original file name without extension (example: 2023-03-25-38267)
* `__filename_extension__`: the original file name without extension (example: mp4)
* `__video_url__`: The URL of the rendered video.

## Example using Macros[#](#example-using-macros "Permalink")

```
{
    "resolution": "full-hd",
    "quality": "high",
    "scenes": [],
    "exports": [{
        "destinations": [{
            "type": "email",
            "to": "your-email@example.com",
            "subject": "New video: __filename__",
            "message": "The video '__filename__' is ready. Download it from: __video_url__"
        }]
    }]
}
```

[← Previous: Uploading to FTP/SFTP](/docs/v2/api-reference/exports/uploading-to-ftpsftp)[Next: Optimizing rendering →](/docs/v2/api-reference/optimizing-rendering)

---

## Content from: https://json2video.com/docs/v2/api-reference/optimizing-rendering

# Optimizing rendering[#](#optimizing-rendering "Permalink")

Optimizing your JSON2Video movies ensures faster rendering times and efficient resource usage. Here's a breakdown of key optimization techniques:

## Scene structure[#](#scene-structure "Permalink")

The JSON2Video rendering engine is designed to render scenes in parallel. This means that the more scenes you can break your movie into, the faster it will render and the more efficient the rendering process will be.

For example, a 30 second movie with a single scene will take longer to render than a movie with 3 scenes of 10 seconds each.

As a rule of thumb, split your movie into scenes every time there is a significant visual change: Think of scenes as slides in a Powerpoint presentation.

### Bad example[#](#bad-example "Permalink")

This is an example of a wrong approach to structuring a movie:

```
{
    "resolution": "full-hd",
    "scenes": [
        {
            "elements": [
                {
                    "type": "image",
                    "src": "https://cdn.json2video.com/assets/images/london-01.jpg",
                    "duration": 10
                },
                {
                    "type": "image",
                    "src": "https://cdn.json2video.com/assets/images/london-02.jpg",
                    "start": 10,
                    "duration": 10
                },
                {
                    "type": "image",
                    "src": "https://cdn.json2video.com/assets/images/london-03.jpg",
                    "start": 20,
                    "duration": 10
                }
            ]
        }
    ]
}
```

The example above creates a slideshow of 3 images, one after the other. This is not efficient and will take longer to render and it can cause the rendering process to timeout.

### Good example[#](#good-example "Permalink")

This is an example of a good approach to structuring the same movie:

```
{
    "resolution": "full-hd",
    "scenes": [
        {
            "elements": [
                {
                    "type": "image",
                    "src": "https://cdn.json2video.com/assets/images/london-01.jpg",
                    "duration": 10
                }
            ]
        },
        {
            "elements": [
                {
                    "type": "image",
                    "src": "https://cdn.json2video.com/assets/images/london-02.jpg",
                    "duration": 10
                }
            ]
        },
        {
            "elements": [
                {
                    "type": "image",
                    "src": "https://cdn.json2video.com/assets/images/london-03.jpg",
                    "duration": 10
                }
            ]
    ]
}
```

In this example, the movie is split into 3 scenes, each with a single image. This is more efficient because each scene can be rendered in parallel and the rendering will be faster.

## Asset optimization[#](#asset-optimization "Permalink")

Ensure your source assets (videos, images, audio) are appropriately sized and formatted. Avoid unnecessarily high resolutions or large file sizes that can slow down rendering. Here are some specific strategies for optimizing different asset types:

**Images**:

* Use formats like JPEG or PNG for images, depending on the content. JPEG is generally better for photographs, while PNG is suitable for images with transparency.
* Compress images to reduce file size without significantly affecting quality. Tools like TinyPNG or ImageOptim can help.
* Resize images to the dimensions needed for your video to avoid loading unnecessary data.

**Videos**:

* Choose the right codec (e.g., H.264 for general use) and resolution for your videos. Higher resolutions (like 4K) can be overkill for many situations.
* You can use `prores` codec for videos with alpha channel (transparency), but keep them short and reasonable low bitrate.
* Use video compression tools to reduce file size while maintaining acceptable quality. HandBrake is a popular choice for this.
* Trim any unnecessary footage to keep the video length as short as possible.

**Audio**:

* Use compressed audio formats like MP3 or AAC to reduce file size.
* Ensure audio files are not longer than necessary.
* Normalize audio levels to ensure consistent volume across different audio files.

By following these guidelines, you can ensure that your assets are optimized for faster rendering and better performance in your JSON2Video projects.

## Caching[#](#caching "Permalink")

Utilize the `cache` property to reuse previously rendered assets (elements, scenes, or entire movies) whenever possible. Setting `cache: true` (the default) allows the system to serve content from the cache if an identical version is available, drastically reducing rendering time. Force a re-render with `cache: false`.

Read more about caching in the [Mastering > Caching system](/docs/v2/api-reference/mastering/caching-system) section.

## Transitions[#](#transitions "Permalink")

Transitions are a great, but they can also slow down the rendering process as they require additional processing and may time out.

Here are some tips for optimizing transitions:

* Avoid using transitions at all if you can. Instead of transitions, evaluate if you can use wipes instead.
* If you need to use transitions, use the `fade` transition. It is the most efficient and fastest transition.

[← Previous: Email notification](/docs/v2/api-reference/exports/email-notification)[Next: No-code integrations →](/docs/v2/no-code-integrations)
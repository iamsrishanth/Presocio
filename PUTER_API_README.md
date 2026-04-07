# Puter.js Free, Unlimited Image Generation API

**Author:** Nariman Jelveh
**Updated:** December 16, 2025
**Source:** [Puter Developer Tutorials](https://developer.puter.com/tutorials/free-unlimited-image-generation-api/)

This tutorial will show you how to use [Puter.js](https://developer.puter.com) to generate images with AI in your apps for free, without needing API keys or servers. Puter.js provides access to powerful image generation models including GPT Image, DALL-E 2, DALL-E 3, Gemini 2.5 Flash Image Preview (Nano Banana), Flux.1 Schnell, Flux.1 Kontext, Flux 1.1 Pro, Stable Diffusion 3, and Stable Diffusion XL directly from your frontend code.

Puter is the pioneer of the "User-Pays" model, which allows developers to incorporate AI capabilities into their applications while each user covers their own usage costs. This model enables developers to offer advanced image generation capabilities to users at no cost to themselves, without any API keys or server-side setup.

## Getting Started

You can use Puter.js without any API keys or sign-ups. To start using Puter.js, include the following script tag in your HTML file, either in the `<head>` or `<body>` section:

```html
<script src="https://js.puter.com/v2/"></script>
```

Nothing else is required to start using Puter.js for free image generation capabilities.

## Example 1: Generate a simple image

To generate an image using GPT Image, use the `puter.ai.txt2img()` function:

```javascript
puter.ai.txt2img("A peaceful mountain landscape at sunset")
    .then(imageElement => {
        document.body.appendChild(imageElement);
    });
```

Full code example:

```html
<html>
<body>
    <h1>AI Image Generation</h1>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        puter.ai.txt2img("A peaceful mountain landscape at sunset")
            .then(imageElement => {
                document.body.appendChild(imageElement);
            });
    </script>
</body>
</html>
```

The above example uses the default model to generate an image. You can specify different models and quality settings as shown in the next example.

## Example 2: Use different models and quality settings

You can specify different image generation models and quality levels:

```html
<html>
<body>
    <h2>Different Models Comparison</h2>
    <div id="images"></div>
    
    <script src="https://js.puter.com/v2/"></script>
    <script>
        const prompt = "A futuristic city with flying cars";
        const container = document.getElementById('images');
        container.innerHTML = '';

        // GPT Image with low quality
        puter.ai.txt2img(prompt, { model: "gpt-image-1", quality: "low" })
            .then(img => {
                const div = document.createElement('div');
                div.innerHTML = '<h3>GPT Image (Quality set to low)</h3>';
                div.appendChild(img);
                container.appendChild(div);
            });

        // DALL-E 3 with high quality
        puter.ai.txt2img(prompt, { model: "dall-e-3", quality: "hd" })
            .then(img => {
                const div = document.createElement('div');
                div.innerHTML = '<h3>DALL-E 3 (Quality set to hd)</h3>';
                div.appendChild(img);
                container.appendChild(div);
            });

        // Gemini 2.5 Flash Image Preview (Nano Banana)
        puter.ai.txt2img(prompt, { model: "gemini-2.5-flash-image-preview" })
                .then(img => {
                    const div = document.createElement('div');
                    div.innerHTML = '<h3>Gemini 2.5 Flash Image Preview (Nano Banana)</h3>';
                    div.appendChild(img);
                    container.appendChild(div);
                });

        // Stable Diffusion 3
        puter.ai.txt2img(prompt, { model: "stabilityai/stable-diffusion-3-medium" })
                .then(img => {
                    const div = document.createElement('div');
                    div.innerHTML = '<h3>Stable Diffusion 3</h3>';
                    div.appendChild(img);
                    container.appendChild(div);
                });

        // Flux.1 Schnell
        puter.ai.txt2img(prompt, { model: "black-forest-labs/FLUX.1-schnell" })
                .then(img => {
                    const div = document.createElement('div');
                    div.innerHTML = '<h3>Flux.1 Schnell</h3>';
                    div.appendChild(img);
                    container.appendChild(div);
                });
    </script>
</body>
</html>
```

## List of supported image generation models

The following image generation models are supported by Puter.js, which can be used with the `puter.ai.txt2img()` function:

```
gemini-2.5-flash-image-preview
gpt-image-1.5
gpt-image-1
gpt-image-1-mini
dall-e-3
dall-e-2
ByteDance-Seed/Seedream-3.0
ByteDance-Seed/Seedream-4.0
HiDream-ai/HiDream-I1-Dev
HiDream-ai/HiDream-I1-Fast
HiDream-ai/HiDream-I1-Full
Lykon/DreamShaper
Qwen/Qwen-Image
RunDiffusion/Juggernaut-pro-flux
Rundiffusion/Juggernaut-Lightning-Flux
black-forest-labs/FLUX.1-Canny-pro
black-forest-labs/FLUX.1-dev
black-forest-labs/FLUX.1-dev-lora
black-forest-labs/FLUX.1-kontext-dev
black-forest-labs/FLUX.1-kontext-max
black-forest-labs/FLUX.1-kontext-pro
black-forest-labs/FLUX.1-krea-dev
black-forest-labs/FLUX.1-pro
black-forest-labs/FLUX.1-schnell
black-forest-labs/FLUX.1-schnell-Free
black-forest-labs/FLUX.1.1-pro
google/flash-image-2.5
google/imagen-4.0-fast
google/imagen-4.0-preview
google/imagen-4.0-ultra
ideogram/ideogram-3.0
stabilityai/stable-diffusion-3-medium
stabilityai/stable-diffusion-xl-base-1.0
```

You can also specify quality settings for the following models:

- For `gpt-image-1`: `high`, `medium`, or `low` (default: `low`)
- For `gpt-image-1-mini`: `high`, `medium`, or `low` (default: `low`)
- For `dall-e-3`: `hd` or standard (default: standard)
- For `gemini-2.5-flash-image-preview`: no quality setting is supported

That's it! You now have free access to powerful image generation models using Puter.js. This allows you to create applications with AI-powered image generation capabilities without needing API keys, backend infrastructure, or managing costs. True serverless image generation!
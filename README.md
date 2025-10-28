<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Corporate Compass AI

An intelligent application that leverages AI to identify and list companies based on their domain, location, and development stage.

View your app in AI Studio: https://ai.studio/apps/drive/1zxazycABfZ-c_6EhuyPyFaOgLDQbENkK

## Deployment

This application is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

**Live Site:** https://asmithcodes.github.io/Corporate-Compass/

### Deployment Configuration

The deployment is handled by a GitHub Actions workflow that:
1. Builds the Vite application
2. Uploads the build artifacts
3. Deploys to GitHub Pages

**Note:** To use the application, you'll need to configure the `GEMINI_API_KEY` as described in the environment variables section below.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file from the example and set your Gemini API key:
   ```bash
   cp .env.local.example .env.local
   # Then edit .env.local and replace 'your_api_key_here' with your actual API key
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

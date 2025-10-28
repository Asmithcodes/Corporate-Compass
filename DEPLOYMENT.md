# Deployment Guide

This document provides instructions for deploying the Corporate Compass AI application to GitHub Pages.

## Automatic Deployment

The repository is configured for **automatic deployment** to GitHub Pages when changes are pushed to the `main` branch.

### How It Works

1. **GitHub Actions Workflow**: The `.github/workflows/deploy.yml` file contains a workflow that:
   - Triggers on push to the `main` branch
   - Installs dependencies
   - Builds the application using Vite
   - Deploys the built files to GitHub Pages

2. **Build Process**: 
   - Vite builds the application with the base path `/Corporate-Compass/`
   - The `.nojekyll` file ensures GitHub Pages serves all files correctly
   - The build output is placed in the `dist` directory

3. **Deployment**: 
   - The workflow uploads the `dist` directory to GitHub Pages
   - The site becomes available at: https://asmithcodes.github.io/Corporate-Compass/

## Prerequisites

Before deployment can work, ensure the following are configured in the GitHub repository settings:

### 1. GitHub Pages Settings

Navigate to: **Settings > Pages**

- **Source**: Select "GitHub Actions" as the source
- This allows the workflow to deploy automatically

### 2. Repository Permissions

The workflow requires these permissions (already configured in the workflow file):
- `contents: read` - To checkout the repository
- `pages: write` - To deploy to GitHub Pages
- `id-token: write` - For OIDC authentication

## Manual Deployment

If you need to trigger a deployment manually:

1. Go to the **Actions** tab in the GitHub repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select the `main` branch
5. Click "Run workflow"

## Local Testing

To test the build locally before deployment:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Preview the production build
npm run preview
```

The preview server will start at `http://localhost:4173/Corporate-Compass/`

## Configuration Files

### Vite Configuration (`vite.config.ts`)
- `base: '/Corporate-Compass/'` - Sets the base path for GitHub Pages
- Environment variables are configured for the Gemini API key

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)
- Node.js version: 20.x
- Uses `npm ci` for consistent installations
- Deploys the `dist` directory to GitHub Pages

## Troubleshooting

### Deployment Fails

1. Check the **Actions** tab for error logs
2. Ensure GitHub Pages is enabled in repository settings
3. Verify that the workflow has the necessary permissions

### Site Not Loading

1. Check that the base path in `vite.config.ts` matches your repository name
2. Verify the `.nojekyll` file exists in the `public` directory
3. Check browser console for any loading errors

### API Key Issues

The application requires a Gemini API key to function. Users need to:
1. Obtain a Gemini API key
2. Configure it in their local environment or browser

Note: The API key should never be committed to the repository.

## Deployment Status

✅ Repository is fully configured for GitHub Pages deployment  
✅ Workflow is set up and ready to deploy  
✅ Build process has been tested and works correctly  
✅ No security vulnerabilities detected  

## Next Steps

1. Merge this PR to the `main` branch
2. The deployment workflow will automatically run
3. The site will be live at https://asmithcodes.github.io/Corporate-Compass/
4. Ensure GitHub Pages is enabled in repository settings if it's not already

## Support

If you encounter any issues with deployment, please check:
- GitHub Actions logs in the **Actions** tab
- Repository settings under **Settings > Pages**
- The workflow file at `.github/workflows/deploy.yml`

# Fix Dependency Conflict

## Issue
React version conflict: Project uses React 19.1.0, but `react-test-renderer@18.3.1` expects React 18.3.1.

## Solution

Install with `--legacy-peer-deps` flag:

```bash
npm install --legacy-peer-deps
```

This tells npm to use the legacy (npm v6) peer dependency resolution algorithm, which is more permissive and will allow the installation to proceed despite the version mismatch.

## Alternative: Use --force

If `--legacy-peer-deps` doesn't work:

```bash
npm install --force
```

## After Installation

Once installed, you can start the app:

```bash
npm start
```

## Note

The `react-test-renderer` version mismatch is only for testing and won't affect the app's runtime. The `--legacy-peer-deps` flag is safe to use here.


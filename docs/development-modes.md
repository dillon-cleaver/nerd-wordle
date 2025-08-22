# Development Modes

Simple develop## Mode Details

| Mode        | Daily Limit | Debug Logs | Dev Badge | Use Case               |
| ----------- | ----------- | ---------- | --------- | ---------------------- |
| Standard    | Enforced    | ✅         | ✅        | General development    |
| `:bypass`   | Bypassed    | ✅         | ✅        | Testing multiple games |

*Note: Dev badge shows you're in development mode. Check the drawer panel to see bypass status.*ode management for different testing scenarios.

## Quick Start Scripts

### Web Development

```bash
# Standard development (daily limit enforced, debug logs)
npm run dev:web

# Testing mode (bypass daily limit, show dev badge)
npm run dev:web:bypass
```

### Mobile Development

```bash
# iOS development
npm run dev:ios                  # Standard mode
npm run dev:ios:bypass          # Testing mode

# Android development
npm run dev:android              # Standard mode
npm run dev:android:bypass      # Testing mode
```

### Utility Scripts

```bash
# Clear Metro cache (for troubleshooting)
npm run clean
```

## Mode Details

| Mode      | Daily Limit | Debug Logs | Dev Badge | Use Case               |
| --------- | ----------- | ---------- | --------- | ---------------------- |
| Standard  | Enforced    | ✅         | ❌        | General development    |
| `:bypass` | Bypassed    | ✅         | ✅        | Testing multiple games |

## Manual Environment Control

```bash
# Set environment manually (used internally by dev scripts)
npm run env:development    # Standard development settings
npm run env:testing        # Testing settings with bypass
```

## Production Builds

EAS production builds automatically disable all dev features:

- No debug logs
- No dev badge
- No daily bypass
- Clean production behavior

## Development UI

When enabled:

- **DevModeBadge**: Shows "DEV" badge in header (right side)
- **DrawerDevInfo**: Environment info in sidebar

All configuration is build-time only.

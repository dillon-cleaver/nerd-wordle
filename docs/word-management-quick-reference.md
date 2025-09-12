# Word Management Quick Reference

## 🚀 Recommended Workflow (Simple)

```bash
# 1. Add word interactively
pnpm run words:add

# 2. Commit changes
git add . && git commit -m "Add [WORD] to dictionary"

# 3. Deploy everywhere (CDN + Firestore)
pnpm run words:deploy:all

# 4. Verify deployment
pnpm run words:verify [WORD]
```

## 📋 Script Quick Reference

### Essential Commands

- `pnpm run words:add` - Add new word interactively
- `pnpm run words:deploy:all` - Deploy to both CDN and Firestore ⭐
- `pnpm run words:verify [WORD]` - Verify word exists everywhere

### Individual Deployment

- `pnpm run words:deploy` - CDN only (user-facing app)
- `pnpm run words:firestore` - Firestore only (server operations)

### Validation & Analysis

- `pnpm run words:validate` - Validate word data
- `pnpm run words:check-bundle` - Verify CDN optimization
- `pnpm run analyze:bundle` - Bundle analysis

## 🚨 Key Points

1. **CDN ≠ Firestore**: They're separate systems that need separate deployment
2. **Use `words:deploy:all`**: Prevents the "word not showing up" issue
3. **Always verify**: Use `words:verify [WORD]` after deployment
4. **Commit after adding**: Word addition creates multiple file changes

## 🔧 Troubleshooting

**Word not in live app?**

```bash
pnpm run words:verify [WORD]  # Check what's missing
pnpm run words:deploy:all     # Fix any gaps
```

**Bundle too large?**

```bash
pnpm run words:check-bundle   # Should show "None" for word data
```

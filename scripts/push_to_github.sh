#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <repo-name> [owner] [--private]"
  exit 1
fi

REPO="$1"
OWNER="${2:-}"
PRIVATE=false
if [ "${OWNER}" = "--private" ]; then
  PRIVATE=true
  OWNER=""
fi
if [ "${3:-}" = "--private" ]; then
  PRIVATE=true
fi

if ! command -v git >/dev/null 2>&1; then
  echo "git not found. Please install git first." >&2
  exit 1
fi

# Initialize repo if needed
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git init
fi

git add -A
if git commit -m "Initial commit" >/dev/null 2>&1; then
  :
else
  # commit may fail if nothing changed; ignore
  true
fi

# Ensure branch name
git branch -M main || true

if command -v gh >/dev/null 2>&1; then
  VIS="--public"
  if [ "$PRIVATE" = true ]; then VIS="--private"; fi
  if [ -n "$OWNER" ]; then
    gh repo create "$OWNER/$REPO" $VIS --source=. --remote=origin --push --confirm
  else
    gh repo create "$REPO" $VIS --source=. --remote=origin --push --confirm
  fi
  echo "Created and pushed using gh CLI."
  exit 0
fi

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "gh CLI not found. Set GITHUB_TOKEN and provide owner as second arg." >&2
  exit 1
fi

if [ -z "$OWNER" ]; then
  echo "Owner is required when gh CLI is not available. Provide the GitHub username/org as second argument." >&2
  exit 1
fi

VIS_JSON=false
if [ "$PRIVATE" = true ]; then VIS_JSON=true; fi

echo "Creating repository via GitHub API..."
curl -s -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos -d "{\"name\": \"$REPO\", \"private\": $VIS_JSON}" > /tmp/_gh_create_repo.json

if grep -q "\"full_name\"" /tmp/_gh_create_repo.json; then
  echo "Repository created. Adding remote and pushing..."
  git remote remove origin >/dev/null 2>&1 || true
  git remote add origin "https://github.com/$OWNER/$REPO.git"
  git push -u origin main
  echo "Pushed to https://github.com/$OWNER/$REPO"
  rm -f /tmp/_gh_create_repo.json
  exit 0
else
  echo "Failed to create repo. Response:" >&2
  cat /tmp/_gh_create_repo.json >&2
  rm -f /tmp/_gh_create_repo.json
  exit 1
fi

# Push the site to GitHub

Requirements:
- Either the `gh` CLI installed and authenticated, or a `GITHUB_TOKEN` env var and the repository owner provided.

Quick steps:

1. Make the script executable:

```bash
chmod +x scripts/push_to_github.sh
```

2. Create and push using `gh` (preferred):

```bash
# create under your account
./scripts/push_to_github.sh my-repo-name
# create under an org or different owner
./scripts/push_to_github.sh my-repo-name my-github-org
```

3. Or create via API using a personal access token:

```bash
export GITHUB_TOKEN=ghp_...   # keep this secret
./scripts/push_to_github.sh my-repo-name my-github-username
```

Use `--private` to create a private repository.

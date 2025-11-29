# SSH Key Setup for GitHub

## Your SSH Public Key

Add this key to your GitHub account:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIN/so20jyuq5sZJZ6wXr4/9nr88z3Nobqhvupun1mFF9 your_email@example.com
```

## Steps to Add to GitHub

1. Go to: https://github.com/settings/keys
2. Click "New SSH key"
3. Title: "My Mac" (or any name you prefer)
4. Key: Paste the key above
5. Click "Add SSH key"

## Test Connection

After adding the key, test it:

```bash
ssh -T git@github.com
```

You should see: "Hi dawoodjaved5! You've successfully authenticated..."

## Alternative: Use HTTPS Instead

If you prefer HTTPS authentication:

```bash
git remote set-url origin https://github.com/dawoodjaved5/soventure_project.git
```

Then you can push using your GitHub username and Personal Access Token.

## After Setup

Once SSH is configured, you can push:

```bash
git push -u origin main
```


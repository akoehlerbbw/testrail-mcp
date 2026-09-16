# Repository Protection

Configure a GitHub ruleset for the default branch `main`. Repository rulesets are GitHub settings and cannot be enforced by files in the repository.

## Required rules

- Require a pull request before merging.
- Require at least one approval.
- Dismiss stale approvals when new commits are pushed.
- Require review from Code Owners.
- Require the `test` status check to pass.
- Require branches to be up to date before merging.
- Require conversation resolution before merging.
- Block force pushes and branch deletion.
- Restrict bypass access to repository administrators.

## Security settings

- Enable private vulnerability reporting.
- Enable secret scanning and push protection.
- Enable Dependabot alerts and security updates.
- Keep workflow permissions at read-only by default.
- Allow GitHub Actions to create pull requests only if Dependabot or another approved automation requires it.

Review repository collaborators regularly and grant write access only to maintainers who need it.
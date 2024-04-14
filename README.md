# CRM COFFEE MEARN

## Name
CRM COFFEE MEARN

## Description

Full-Stack application: a CRM system for small and medium-sized businesses. Development with MEARN (MongoDB, Express.js, Angular, React, Node.js) stack.

## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

## Installation of the project
```
git checkout develop
git pull
cd backend
npm i --legacy-peer-deps
cd ../angular_client
npm i --legacy-peer-deps
cd ../react_client
npm i --legacy-peer-deps
```

## Run the project
### Develop Mode:
Backend:
```
cd backend
node index.js
```

Frontend with Angular:
```
cd angular_client
ng serve
```

Frontend with React:
```
cd react_client
npm run start
```

## Python
```
python run.py
```

## Docker
Up:
```
docker compose up -d --build
```

Down:
```
docker compose down --volumes --rmi all
```

## Generate Admin

- You have to use the email to change the user, this will be Admin or Normal user.

On develop mode:
```
cd backend
node toggleAdmin.js
```

On Docker:
```
docker exec -it backend-crm-coffee /bin/bas
node toggleAdmin.js
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/fusion-media/crm-coffee-mearn/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# DevOpsPulse — Jenkins CI/CD Assignment

A small demo application with a Flask backend and an Express frontend.

## Project structure

- `flask-app/`: Flask JSON API, health endpoint, and Jenkinsfile
- `express-app/`: Express web UI, health endpoint, and Jenkinsfile

## Run Flask locally

Open PowerShell in `flask-app`:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

Check `http://localhost:5000/health` and `http://localhost:5000/api/status`.

## Run Express locally

Open another PowerShell in `express-app`:

```powershell
npm install
$env:FLASK_API_URL="http://127.0.0.1:5000"
npm start
```

Open `http://localhost:3000`.

Start Flask before testing the frontend's backend status.

## Jenkins and deployment notes

- Jenkins is installed locally on Windows for learning.
- The Jenkinsfiles currently include placeholder GitHub repository URLs.
- The EC2 deployment stages are deliberately placeholders. Configure a secure deployment method and credentials before enabling actual deployment.
- For a Windows Jenkins agent, the current Jenkinsfiles use `bat` commands.
- Configure the NodeJS tool named `Node24` in Manage Jenkins → Tools.
- Do not commit passwords, private keys, or other secrets to GitHub.

## Assignment completion checklist

- [ ] Create two GitHub repositories and replace the placeholder repository URLs in the Jenkinsfiles.
- [ ] Test both applications locally.
- [ ] Launch/configure an AWS EC2 deployment target.
- [ ] Configure secure Jenkins-to-EC2 deployment.
- [ ] Finish both Jenkins pipelines and GitHub webhooks.
- [ ] Capture screenshots of EC2, application pages, pipeline logs, and successful automatic deployment.
- [ ] Complete final documentation and ZIP submission.

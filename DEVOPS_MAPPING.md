# DevOps syllabus mapping

This table maps the five syllabus units to this repository's implementation and practical demonstration. "Implemented" means the corresponding project file or workflow exists; it does not imply an external cloud, Jenkins, Kubernetes, Puppet, or Salt deployment was executed.

| Unit/topic | Location | Command or demonstration | Expected result | Status |
|---|---|---|---|---|
| I — DevOps lifecycle, culture, collaboration, barriers | README: DevOps lifecycle and collaboration | Discuss lifecycle and shared ownership | Explain feedback, automation, team roles, and handoffs | Documented |
| I — Agile/Scrum, backlog, stories, acceptance criteria | README: Example Agile project plan | Walk through backlog and two sample sprints | Small increments and review/retro cadence are clear | Documented |
| I — Kanban | README: Sample Kanban board | Move an example task across columns | Workflow states and work visibility demonstrated | Documented |
| I — Cloud properties and operations | README: Cloud as a platform | Explain provisioning, elasticity, pooling, metering | Relate cloud to automation, monitoring, cost | Documented |
| I — Cloud Linux VM | README: Optional cloud VM; `ansible/` | Ansible deploy to a prepared Ubuntu/Debian VM | Web app on VM port 8080; charges/account are provider-dependent | Optional |
| II — Git setup and core commands | README: Git and Gitflow | `git status`, `git diff`, `git add`, `git commit`, `git log` | Inspect, stage, and save local changes | Demonstrated by commands |
| II — GitHub remote and collaboration | README: Git and Gitflow | `git remote add origin ...`; `git push -u origin main` | Publish branch to configured GitHub repository | Documented |
| II — Gitflow branches | README: Gitflow-inspired workflow | Create develop, feature, release, hotfix; merge/tag | Branch workflow can be followed; not enforced automatically | Documented |
| III — npm and lockfile | `package.json`, `package-lock.json` | `npm ci` | Reproducible install; no third-party dependencies | Implemented |
| III — Automated tests | `tests/app.test.js`, `public/app.js` | `npm test` | Add/validate/toggle/delete/filter/count logic tests pass | Implemented |
| III — Static build | `scripts/build.js`, npm scripts | `npm run build` | Static files copied to generated `dist/` | Implemented |
| III — Jenkins primary CI/CD | `Jenkinsfile` | Run Multibranch pipeline on a Docker-labelled agent | Test then build, optional publish/manual approved main deployment | Implemented; external Jenkins setup required |
| III — GitLab alternative CI | `.gitlab-ci.yml` | Run pipeline on configured runner | Test/package then commit-tag container push | Implemented; compatible runner required |
| III — Docker Hub publishing | `Jenkinsfile`, README | Enable `PUBLISH_IMAGE`; use `dockerhub` credential | Versioned image pushed without source-stored credentials | Optional |
| IV — Docker image/runtime | `Dockerfile`, `docker/nginx.conf`, `.dockerignore` | `docker build ...`; `docker run -p 8080:8080 ...` | Nginx serves site as an unprivileged process | Implemented; Docker required |
| IV/V — Docker Compose | `docker-compose.yml` | `docker compose up --build -d`; `docker compose down` | Repeatable local container run | Implemented |
| IV — Docker CLI isolation | README: Docker section | `docker run --rm -it node:20-alpine node --version` | Disposable isolated tool execution | Demonstrated by command |
| IV — Kubernetes | `k8s/deployment.yaml`, `k8s/service.yaml` | Minikube image build, `kubectl apply`, rollout/undo | Two Pods, probes, Service endpoint; local cluster required | Implemented; optional tool |
| IV — Docker Swarm | README: Docker Swarm | `docker swarm init`; stack deploy/scale/remove | Single-node service and replica demonstration | Documented alternative |
| IV — Azure Container Instances | `.gitlab-ci.yml`, README: ACI | Manual GitLab job or Azure CLI create/delete | ACI runs registry image; subscription and billing apply | Optional |
| V — Ansible | `ansible/inventory.ini.example`, `ansible/playbook.yml` | `ansible-playbook ... -e app_image=...` | Docker installed/running; app container present on target | Implemented; external Linux target/collection required |
| V — Puppet | `puppet/student_task_manager.pp` | `sudo puppet apply puppet/student_task_manager.pp` | Nginx package installed and service enabled/running | Implemented example; lab not preconfigured |
| V — SaltStack | `saltstack/top.sls`, `saltstack/student_task_manager.sls` | `salt '*' state.apply student_task_manager` | Nginx package/service managed | Implemented example; lab not preconfigured |
| V — Secrets and least privilege | CI configs and README practices | Configure protected CI credentials; inspect source | No credentials are committed; credentials are external | Implemented guidance |
| V — Logs and troubleshooting | README troubleshooting | `docker logs`, `kubectl describe`, CI job log | Useful diagnostic output for a failing demo | Documented |
| V — Immutable releases and rollback | Docker/Kubernetes sections | Use versioned image; `kubectl rollout undo` | Re-deploy previous image/revision | Demonstrated by commands |
| V — Cost/resource management | K8s resources and cloud sections | Inspect resource limits; delete cloud resources | Limits and cleanup steps visible | Implemented/documented |

## Status definitions

- **Implemented:** a matching source/configuration/test file or executable workflow is present.
- **Demonstrated by commands / Documented:** the repository explains a practical activity but does not enforce it.
- **Optional:** requires external infrastructure, credentials, or tools and is not needed for local use.

Do not present an optional tool's example as a deployment already run. Validate it in a lab before claiming an external result.

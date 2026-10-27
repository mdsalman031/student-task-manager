pipeline {
  agent { label 'docker' }

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  parameters {
    booleanParam(name: 'PUBLISH_IMAGE', defaultValue: false, description: 'Push the tested image to Docker Hub')
    booleanParam(name: 'DEPLOY_TEST', defaultValue: false, description: 'Manually deploy the main branch to the configured test host')
  }

  environment {
    IMAGE_NAME = 'student-task-manager'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'git status --short'
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }

    stage('Build package') {
      steps {
        sh 'npm run build'
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }

    stage('Build Docker image') {
      steps {
        sh 'docker build --tag "$IMAGE_NAME:$IMAGE_TAG" --tag "$IMAGE_NAME:latest" .'
      }
    }

    stage('Publish to Docker Hub') {
      when {
        expression { params.PUBLISH_IMAGE || params.DEPLOY_TEST }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_TOKEN')]) {
          sh '''
            set +x
            trap 'docker logout >/dev/null 2>&1 || true' EXIT
            printf '%s' "$DOCKERHUB_TOKEN" | docker login --username "$DOCKERHUB_USER" --password-stdin
            docker tag "$IMAGE_NAME:$IMAGE_TAG" "$DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG"
            docker push "$DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG"
          '''
        }
      }
    }

    stage('Deploy test environment') {
      when {
        allOf {
          branch 'main'
          expression { params.DEPLOY_TEST }
        }
      }
      steps {
        input message: 'Deploy this tested main-branch build to the test host?', ok: 'Deploy'
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_TOKEN')]) {
          sshagent(credentials: ['test-host-ssh']) {
            sh '''
              set +x
              DEPLOY_HOST="$TEST_HOST" IMAGE="$DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG" ./scripts/deploy.sh
            '''
          }
        }
      }
    }
  }

  post {
    always {
      sh 'docker image rm "$IMAGE_NAME:$IMAGE_TAG" "$IMAGE_NAME:latest" 2>/dev/null || true'
      deleteDir()
    }
  }
}

pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        git(url: 'https://github.com/kadirikumar-uptycs/CX-Tools', branch: 'main')
      }
    }

    stage('Log') {
      steps {
        sh 'ls -al'
      }
    }

    stage('Build') {
      steps {
        sh 'docker build . -t mohankumar1729/cx-tools'
      }
    }

    stage('Login to Dockerhub') {
      environment {
        DOCKER_USERNAME = 'mohankumar1729'
        DOCKER_PASSWORD = 'XCf!YFnHM7v@5b4fX'
      }
      steps {
        sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
      }
    }

    stage('List Images') {
      steps {
        sh 'docker images | grep \'cx-tools\''
      }
    }

    stage('Push Image') {
      steps {
        sh 'docker push mohankumar1729/cx-tools:latest'
      }
    }

  }
}
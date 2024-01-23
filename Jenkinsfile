pipeline {
  agent any
  stages {
    stage('Check out code') {
      steps {
        git(url: 'https://github.com/kadirikumar-uptycs/CX-Tools', branch: 'main')
      }
    }

    stage('Log') {
      steps {
        sh 'ls -al'
      }
    }

  }
}
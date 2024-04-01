pipeline {
  agent any
  stages {
    stage('Checkout Code') {
      steps {
        git(url: 'https://github.com/kadirikumar-uptycs/CX-Tools', branch: 'main')
      }
    }

    stage('Log') {
      steps {
        sh 'ls -al'
      }
    }

    stage('Frontend App') {
      parallel {
        stage('Frontend App') {
          steps {
            echo 'Front End App Build started...'
          }
        }

        stage('Production Build') {
          steps {
            dir(path: 'frontend-app') {
              sh 'npm run build'
              sh 'sudo docker build -t mohankumar1729/cx-tools:frontend-app .'
            }

          }
        }

      }
    }

    stage('Backend App') {
      parallel {
        stage('Build Backend App') {
          steps {
            echo 'Backend App is building...'
          }
        }

        stage('Build Production server') {
          steps {
            dir(path: 'backend-app') {
              sh 'sudo docker build -t mohankumar1729/cx-tools:backend-app .'
            }

          }
        }

      }
    }

    stage('Login to DockerHub') {
      environment {
        DOCKER_USERNAME = 'mohankumar1729'
        DOCKER_PASSWORD = 'XCf!YFnHM7v@5b4fX'
      }
      steps {
        sh 'sudo docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
      }
    }

    stage('List Images') {
      steps {
        sh 'sudo docker images | grep \'cx-tools\''
      }
    }

    stage('Push Images') {
      parallel {
        stage('Push Images') {
          steps {
            echo 'Pushing Images to DockerHub...'
          }
        }

        stage('Push Frontend App') {
          steps {
            sh 'sudo docker push mohankumar1729/cx-tools:frontend-app'
          }
        }

        stage('Push Backend App') {
          steps {
            sh 'sudo docker push mohankumar1729/cx-tools:backend-app'
          }
        }

      }
    }

    stage('Success') {
      steps {
        echo 'Completed!!!'
      }
    }

  }
}
pipeline {
    agent {
        any {
            image 'node:lts-buster-slim' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('install') { 
            steps {
                sh 'npm install'
                sh 'cd client'
                sh 'npm i'
            }
        }
        stage('Build') { 
            steps {
                sh 'npm run build'
            }
        }
    }
}

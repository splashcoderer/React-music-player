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
                dir('client') {
                    sh 'npm i'
                }
            }
        }
        stage('Build') { 
            steps {
                dir('client') {
                    sh 'npm run build'
                    sh 'rm -rf node_modules'
                }
            }
        }
        stage('Upload') {
            steps {
                ftpPublisher alwaysPublishFromMaster: false, 
                    continueOnError: false, 
                    failOnError: false,
                    masterNodeName: '',
                    paramPublish: null,
                    publishers: [[configName: 'pplayer', 
                                    transfers: [[
                                        asciiMode: false, 
                                        cleanRemote: false,
                                        excludes: '',
                                        flatten: false,
                                        makeEmptyDirs: false,
                                        noDefaultExcludes: false,
                                        patternSeparator: '[, ]+',
                                        remoteDirectory: '',
                                        remoteDirectorySDF: false,
                                        removePrefix: '',
                                        sourceFiles: '**/*'
                                    ]], 
                                    usePromotionTimestamp: false, 
                                    useWorkspaceInPromotion: false, 
                                    verbose: false
                                ]]
            }
        }
    }
}

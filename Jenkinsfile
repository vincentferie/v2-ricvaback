pipeline {
    agent any
    stages {
      stage('Setup'){
        steps{
            sh '''
              sudo yarn install
              sudo yarn add npx
            '''
        }
      }
      stage('Clean Up'){
        steps{
              sh 'sudo rm -rf dist'
        }
      }
      stage('Build packages') {
          steps {
              sh '''
                  sudo yarn run build gateway
                  NODE_ENV=production sudo npx nest build ms-sup
                  NODE_ENV=production sudo npx nest build ms-auth
                  NODE_ENV=production sudo npx nest build ms-ops
                  NODE_ENV=production sudo npx nest build ms-admin
                  NODE_ENV=production sudo npx nest build ms-stats
                  NODE_ENV=production sudo npx nest build ms-fin
                '''
              // sh 'NODE_ENV=production npx nest build ms-acc'
              // sh 'NODE_ENV=production npx nest build ms-dash'
              // sh 'NODE_ENV=production npx nest build ms-track'
          }
      }
      stage('Deploy'){
        steps{
          sh '''
              sudo rm -rf /home/ricva_back/www/v2/*
              sudo cp -rf * /home/ricva_back/www/v2
              sudo chown -R ricva_back:ricva_back /home/ricva_back/www/v2/
              '''
        }
      }
      stage('Start RabbitMQ') {
          steps {
              sh '''
                if [ ! "$(docker ps -q -f name=rabbitmq)" ]; then
                    if [ "$(docker ps -aq -f status=exited -f name=rabbitmq)" ]; then
                        # restart container
                        docker restart rabbitmq
                    fi
                    # run your container
                    # docker run -d --name <name> my-docker-image
                    docker-compose -f /home/ricva_back/www/v2/start/rabbitmq/prod.yml up -d
                fi
              '''
          }
      }
      stage('Start clusters') {
          steps {
              sh 'sudo chmod +x service.sh'
              sh 'sudo yarn run pm2:gateway'
              sh 'sudo yarn run pm2:auth'
              sh 'sudo yarn run pm2:sup'
              sh 'sudo yarn run pm2:admin'
              sh 'sudo yarn run pm2:ops'
            //   sudo yarn run pm2:acc
            //   sudo yarn run pm2:auth 
            //   sudo yarn run pm2:board
              sh 'sudo yarn run pm2:fin'
            //   sudo yarn run pm2:gateway
              sh 'sudo yarn run pm2:stats'
            //   sudo yarn run pm2:track
              sh 'sudo /root/.nvm/versions/node/v12.18.4/bin/pm2 save'
          }
      }
    }
    post {
      always {
         sh "sudo pm2 save || true"
      }
      failure {
          echo 'NestJs deploying failed'
      }
      success {
          echo 'NestJs deploying was a success'
      }
      unstable {
          echo 'NestJs deploying has gone unstable'
      }
    }
}

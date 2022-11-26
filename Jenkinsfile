#!/usr/bin/env groovy
@Library('pliant')
import io.pliant.jenkins.*
def dep = new deployment()

def node_version = 'NodeJS 14'

def dockerhub_user = "pliantinternship2022"
def app_name = "rota-front"

try {
	node {
		env.NODEJS_HOME = "${tool node_version}"
		env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"

		stage("Clone repository") {
			dep.clone(app_name, false, "master")
			dep.setDockerRepository(dockerhub_user)
		}
		if (dep.isCancelled()) return

		stage ("Prepare") {
			sh "npm install"
		}

		stage ("Compile") {
			sh "npm run build:prod"
		}

		stage("Build image") {
			dep.build()
		}

		stage("Push image") {
			def imageName = "${dockerhub_user}/${app_name}-${dep.getBranch()}:${dep.getTag()}"

			docker.withRegistry("", "${dockerhub_user}") {
				dep.pushImage(imageName)

				if ( dep.getBranch() != "feature" ) {
					imageName = "${dockerhub_user}/${app_name}-${dep.getBranch()}:v${dep.getVersion()}"
					dep.pushImage(imageName)
				}
			}
			dep.setImageMessage(imageName.split('/')[1])
		}
	}
} catch (error) {
	dep.handle(error)
} finally {
	dep.notifyBuild(currentBuild.result)
}

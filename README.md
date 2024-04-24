# ai-agent-scaffold

Use this code to get started with a base scaffold of a langchain agent with a test UI in Flask.


## Build and deploy

You can build and deploy the agent to AppEngine using the included cloudbuild.yaml file. Run the following command with `gcloud` installed and setup: 
```
gcloud builds submit
```


## Customize

Customize the agent by changing the Python code in the [app/lib](app/lib) folder.
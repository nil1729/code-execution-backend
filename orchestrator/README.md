# Orchestrator

1. This component will be the heart for our whole system.
2. This component receive the code submission request.
3. Create a submission entry into the database and publish the event on queue (rabbitmq).
4. After submission this server wither expose an api for results.
5. Enhancement: User Authentication, Code Scanning

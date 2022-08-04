# Alerts Frontend - A sample frontend for the FlightAware Data API for alerts

## QuickStart

Unlike the FIDS Frontend website, the alerts frontend is intended only for the AeroAPI backend service, Aero Apps. Head
over to [AeroAPI](https://github.com/flightaware/aeroapps) and follow the quickstart guide there for the alerts backend
section. The documented commands will pull this Alerts Frontend as a ready to use Docker container that will present
flight data from the Aero Apps alerts backend.

## alerts-frontend

FlightAware Alerts is a small webapp powered by a backend like the alerts-backend service in FlightAware Aero Apps.
You can use it to enter in parameters to create an alert for your FlightAware account. In this webapp, the parameters
that one can input are ident, origin, destination, the aircraft type, the start date of the alert, and the end date
of the alert.

This service is intended to be run in the context of a service like the Aero Apps alerts section. The nginx proxy
configuration assumes there will be a locally available service at the "alerts-backend" hostname. If running the
alerts-frontend as a stand-alone service the nginx proxy_pass configuration will need to be changed to point to the
location of your backend service.

Once running, the service is accessible at http://localhost:8080 in your web browser (if not running Docker locally, use
the Docker host's address).

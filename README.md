# fxmonitor-remotesettings-updater
Script to add new breaches from HIBP to the fxmonitor-breaches collection in Remote Settings

## Usage
The script *dry-runs* by default and simply dumps the new breaches to be added to stdout.
To push new breaches to Kinto, set the following environment variables:
```
PUSH_TO_KINTO=1 # Can be any non-empty value
KINTO_USERNAME=<kinto account username>
KINTO_PASSWORD=<kinto account password>
```
To run:
```
npm run
```
Note: VPN access is required to access Kinto server.

The script exits with `0` for success and `1` if there were any errors.

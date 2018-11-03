# parcel-delivery-service
A courier service that helps users deliver parcels to different destinations. It provides courier quotes based on weight categories.

[![Coverage Status](https://coveralls.io/repos/github/emmsdan/parcel-delivery-service/badge.svg?branch=master)](https://coveralls.io/github/emmsdan/parcel-delivery-service?branch=master)

## This project is part of the Andela Fellowship Bootcamp Challenge.

I created a set of API endpoints as defined below and used data structures
to store data in memory. No database was used.

### API Endpoints

  | EndPoint | Functionality |
  | ------- | ----------- |
  | GET __ /parcels__ | Fetch all parcel delivery orders |
  | GET **/parcels/<parcelId>** | Fetch a specific parcel delivery order |
  | GET **/parcels** | Fetch all parcel delivery orders |
  | GET **/users/<userId>/parcels** | Fetch all parcel delivery orders by a specific user |
  | PUT */parcels/<parcelId>/cancel** | Cancel the specific parcel delivery order |
  | POST **/parcels**  | Create a parcel delivery order |

## Dependencies and Tools

- `Server side Framework: Node/Express`
- `Linting Library: ESLint`
- `Style Guide: Airbnb`
- `Testing Framework: Mocha or Jasmine`

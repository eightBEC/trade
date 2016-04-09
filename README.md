# Short position API

### Usage

The API allows to retrieve current short positions 
  - by ISIN:
  ```
  /positions/short/isin/:isin
  ``` 
  - by Emitter:
  ```
  /positions/short/emitter/:emitter
  ```
  - by holder:
  ```
  /positions/short/holder/:holder
  ```
  
### Example
Get the current short positions for AIXTRON SE (ISIN: DE000A0WMPJ6)
```
curl http://germanshorties.herokuapp.com/positions/short/isin/DE000A0WMPJ6

[
  {
    "_id":"5708e73925f1a1030059cd65",
    "positionHolder":"JPMorgan Asset Management (UK) Ltd",
    "emitter":"AIXTRON SE",
    "ISIN":"DE000A0WMPJ6",
    "position":"2.35",
    "positionDate":"2016-04-07",
    "crawlDate":"2016-04-09T11:27:50.918Z"
  }
]
```

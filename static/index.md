# URL Shortener

### Free Code Camp URL Shortener Microservice

> User Stories:

> 1. I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.

> 2. When I visit that shortened URL, it will redirect me to my original link.

#### Example Creation Usage

```
https://url-shortener-mparigi.herokuapp.com/new/https://www.google.com
```

#### Example Creation Output

```
{"original_url":"https://www.google.com","short_url":"https://url-shortener-mparigi.herokuapp.com/redir/0"}
```

#### Usage

```
https://url-shortener-mparigi.herokuapp.com/redir/0
```


#### Will Redirect to

```
https://www.google.com
```

[![Contentstack](https://www.contentstack.com/docs/static/images/contentstack.png)](https://www.contentstack.com/)

## Contentstack Management JavaScript SDK

Contentstack is a headless CMS with an API-first approach. It is a CMS that developers can use to build powerful cross-platform applications in their favorite languages. Build your application frontend, and Contentstack will take care of the rest. [Read More](https://www.contentstack.com/).

This SDK use Content Management API(CMA). The Content Management API (CMA) is used to manage the content of your Contentstack account. This includes creating, updating, deleting, and fetching content of your account. To use the Content Management API, you will need to authenticate yourself with a [Management Token](https://www.contentstack.com/docs/developers/create-tokens/about-management-tokens) or an [Authtoken](https://www.contentstack.com/docs/developers/apis/content-management-api/#how-to-get-authtoken). Read more about it in [Authentication](https://www.contentstack.com/docs/developers/apis/content-management-api/#authentication).

Note: The Content Management APIs also include many GET requests. However, it is highly recommended that you always use the [Content Delivery API](https://www.contentstack.com/docs/developers/apis/content-delivery-api/) to deliver content to your web or mobile properties.

### Prerequisite

You need Node.js version 10 or later installed to use the Contentstack JavaScript CMA SDK.

### Installation
#### Node
Install it via npm:
```bash
npm i contentstack-management
```
To import the SDK, use the following command:
```
import contentstack from ‘contentstack-mangement’
```
To initialize the SDK, you will need to pass ```axios``` instance
```
import axios from 'axios'
contentstackClient = contentstack.client(axios, {})
```

### Authentication
To use this SDK you need to authenticate using the user Authtoken, creadentials, or Management Token (stack-level token).
### Authtoken
An **Authtoken** is a read-write token used to make authorized CMA requests, and it is a **user-specific** token.
```
import axios from 'axios'
contentstackClient = contentstack.client(axios, { authtoken: 'AUTHTOKEN' })
```
### Login
To Login to Contentstack using credentials:
```
contentstackClient.login({ email: 'EMAIL', password: 'PASSWORD'})
..then((response) => {
	console.log(response.notice)
	console.log(response.user)
})
```

### Management Token
**Management Tokens** are **stack-level** tokens, with no users attached to them.
```
contentstackClient.stack('API_KEY', 'MANAGEMENT_TOKEN')
.fetch()
.then((stack) => {
	console.log(stack)
})
```
### Contentstack Management JavaScript SDK: 5-minute Quickstart
#### Initializing your SDK:
```
import contentstack from ‘contentstack-mangement’
import axios from 'axios'

var contentstackClient = contentstack.client(axios, { authtoken: 'AUTHTOKEN' })
```
#### Fetch Stack details
The following code snippet is use to get Stack details from Contentstack using this SDK:
```
contentstackClient.stack('API_KEY')
.fetch()
.then((stack) => {
	console.log(stack)
})
```

#### Create Entry
The following code snippet is use to create Entry of specific Content Type into Stack using this SDK:
```
var  entry  = {
	title: 'Sample Entry',
	url: '/sampleEntry'
}

contentstackClient.stack('API_KEY').contentType('CONTENT_TYPE_UID').entry().create({ entry })
.then((entry) => {
	console.log(entry)
})
```

#### Create Asset
The following code snippet is use to create Asset into Stack using this SDK:
```
var  asset  = {
	upload: 'path/to/file',
	tit;e: 'Asset Title'
}

contentstackClient.stack('API_KEY').asset().create({ asset })
.then((asset) => {
	console.log(asset)
})
```

### Helpful Links

-   [Contentstack Website](https://www.contentstack.com/)
-   [Official Documentation](https://contentstack.com/docs)
-   [Content Management API Docs](https://www.contentstack.com/docs/developers/apis/content-management-api)
- 
### The MIT License (MIT)
Copyright © 2012-2020  [Contentstack](https://www.contentstack.com/). All Rights Reserved

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

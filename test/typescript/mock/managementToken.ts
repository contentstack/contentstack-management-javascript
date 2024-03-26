const managementToken1 = {
      "token":{
        "name":"Test Token",
        "description":"This is a sample management token.",
        "scope":[
            {
                "module":"content_type",
                "acl":{
                    "read":true,
                    "write":true
                }
            },
            {
                "module":"branch",
                "branches":[
                    "main"
                ],
                "acl":{
                    "read":true
                }
            },
            {
                "module":"branch_alias",
                "branch_aliases":[
                    "tst"
                ],
                "acl":{
                    "read":true
                }
            }
        ],
        "expires_on":"2024-12-10",
        "is_email_notification_enabled":true
    }
}
const managementToken2 = {
        "token":{
        "name":"Test Token",
        "description":"This is a sample management token.",
        "scope":[
            {
                "module":"content_type",
                "acl":{
                    "read":true,
                    "write":true
                }
            },
            {
                "module":"branch",
                "branches":[
                    "main"
                ],
                "acl":{
                    "read":true
                }
            },
            {
                "module":"branch_alias",
                "branch_aliases":[
                    "tst"
                ],
                "acl":{
                    "read":true
                }
            }
        ],
        "expires_on":"2024-12-10",
        "is_email_notification_enabled":true
    }
}
  
  export { managementToken1, managementToken2 }
  
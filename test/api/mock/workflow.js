const firstWorkflow =  {"workflow_stages":[{"color":"#2196f3","SYS_ACL":{"roles":{"uids":[]},"users":{"uids":["$all"]},"others":{}},"next_available_stages":["$all"],"allStages":true,"allUsers":true,"specificStages":false,"specificUsers":false,"entry_lock":"$none","name":"First stage"},{"color":"#e53935","SYS_ACL":{"roles":{"uids":[]},"users":{"uids":["$all"]},"others":{}},"allStages":true,"allUsers":true,"specificStages":false,"specificUsers":false,"next_available_stages":["$all"],"entry_lock":"$none","name":"Second stage"}],"admin_users":{"users":[]},"name":"First Workflow","content_types":["multi_page_from_json"]}
const secondWorkflow = {"workflow_stages":[{"color":"#2196f3","SYS_ACL":{"roles":{"uids":[]},"users":{"uids":["$all"]},"others":{}},"next_available_stages":["$all"],"allStages":true,"allUsers":true,"specificStages":false,"specificUsers":false,"entry_lock":"$none","name":"first stage"},{"isNew":true,"color":"#e53935","SYS_ACL":{"roles":{"uids":[]},"users":{"uids":["$all"]},"others":{}},"allStages":true,"allUsers":true,"specificStages":false,"specificUsers":false,"next_available_stages":["$all"],"entry_lock":"$none","name":"stage 2"}],"admin_users":{"users":[]},"name":"Second workflow","enabled":true,"content_types":["multi_page"]}
const finalWorkflow = {"workflow_stages":[{"color":"#2196f3","SYS_ACL":{"roles":{"uids":[]},"users":{"uids":["$all"]},"others":{}},"next_available_stages":["$all"],"allStages":true,"allUsers":true,"specificStages":false,"specificUsers":false,"entry_lock":"$none","name":"Review"},{"color":"#74ba76","SYS_ACL":{"roles":{"uids":[]},"users":{"uids":["$all"]},"others":{}},"allStages":true,"allUsers":true,"specificStages":false,"specificUsers":false,"next_available_stages":["$all"],"entry_lock":"$none","name":"Complet"}],"admin_users":{"users":[]},"name":"Workflow","enabled":true,"content_types":["single_page"]}

const firstPublishRules = {"isNew":true,"actions":["publish"],"content_types":["multi_page_from_json"],"locales":["en-at"],"environment":"blt7c36cefb11c27e8a","workflow_stage":"","approvers":{"users":["blt4dcb45b4456bb358"],"roles":["blt46104cf1a5025bee"]}}
const secondPublishRules = {"isNew":true,"actions":["publish"],"content_types":["multi_page"],"locales":["en-at"],"environment":"blt7c36cefb11c27e8a","workflow_stage":"","approvers":{"users":["blt4dcb45b4456bb358"],"roles":["blt46104cf1a5025bee"]}}

export {firstWorkflow, secondWorkflow, finalWorkflow, firstPublishRules, secondPublishRules}
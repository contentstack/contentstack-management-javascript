const firstWorkflow = {
  workflow_stages: [
    {
      color: '#2196f3',
      SYS_ACL: { roles: { uids: [] }, users: { uids: ['$all'] }, others: {} },
      next_available_stages: ['$all'],
      allStages: true,
      allUsers: true,
      specificStages: false,
      specificUsers: false,
      entry_lock: '$none',
      name: 'First stage'
    },
    {
      color: '#e53935',
      SYS_ACL: { roles: { uids: [] }, users: { uids: ['$all'] }, others: {} },
      allStages: true,
      allUsers: true,
      specificStages: false,
      specificUsers: false,
      next_available_stages: ['$all'],
      entry_lock: '$none',
      name: 'Second stage'
    }
  ],
  branches: [
    'main'
  ],
  admin_users: { users: [] },
  name: 'First Workflow',
  content_types: ['multi_page_from_json']
}
const secondWorkflow = {
  workflow_stages: [
    {
      color: '#2196f3',
      SYS_ACL: { roles: { uids: [] }, users: { uids: ['$all'] }, others: {} },
      next_available_stages: ['$all'],
      allStages: true,
      allUsers: true,
      specificStages: false,
      specificUsers: false,
      entry_lock: '$none',
      name: 'first stage'
    },
    {
      isNew: true,
      color: '#e53935',
      SYS_ACL: { roles: { uids: [] }, users: { uids: ['$all'] }, others: {} },
      allStages: true,
      allUsers: true,
      specificStages: false,
      specificUsers: false,
      next_available_stages: ['$all'],
      entry_lock: '$none',
      name: 'stage 2'
    }
  ],
  branches: [
    'main'
  ],
  admin_users: { users: [] },
  name: 'Second workflow',
  enabled: true,
  content_types: ['multi_page']
}
const finalWorkflow = {
  workflow_stages: [
    {
      color: '#2196f3',
      SYS_ACL: { roles: { uids: [] }, users: { uids: ['$all'] }, others: {} },
      next_available_stages: ['$all'],
      allStages: true,
      allUsers: true,
      specificStages: false,
      specificUsers: false,
      entry_lock: '$none',
      name: 'Review'
    },
    {
      color: '#74ba76',
      SYS_ACL: { roles: { uids: [] }, users: { uids: ['$all'] }, others: {} },
      allStages: true,
      allUsers: true,
      specificStages: false,
      specificUsers: false,
      next_available_stages: ['$all'],
      entry_lock: '$none',
      name: 'Complet'
    }
  ],
  branches: [
    'main'
  ],
  admin_users: { users: [] },
  name: 'Workflow',
  enabled: true,
  content_types: ['single_page']
}

const firstPublishRules = {
  isNew: true,
  actions: ['publish'],
  content_types: ['multi_page_from_json'],
  locales: ['en-at'],
  environment: 'environment_name',
  workflow_stage: '',
  approvers: { users: ['user_id'], roles: ['role_uid'] }
}
const secondPublishRules = {
  isNew: true,
  actions: ['publish'],
  content_types: ['multi_page'],
  locales: ['en-at'],
  environment: 'environment_name',
  workflow_stage: '',
  approvers: { users: ['user_id'], roles: ['role_uid'] }
}

export {
  firstWorkflow,
  secondWorkflow,
  finalWorkflow,
  firstPublishRules,
  secondPublishRules
}

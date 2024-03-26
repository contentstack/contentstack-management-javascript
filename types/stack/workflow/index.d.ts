import { ContentstackCollection } from "../../contentstackCollection";
import { AnyProperty, SystemFields } from "../../utility/fields";
import { Creatable, SystemFunction } from "../../utility/operations";
import { PublishRule, PublishRules } from "./publishRules";

export interface Workflow extends SystemFields, SystemFunction<Workflow> {
}
    
export interface Workflows extends Creatable<Workflow, {workflow: WorkflowData}> {
    fetchAll(param?: AnyProperty): Promise<ContentstackCollection<PublishRule>>
    publishRule(): PublishRules
    publishRule(rule_uid: string): PublishRule
}

export interface WorkflowData extends AnyProperty {
    workflow_stages: Array<WorkflowStage>
    name: string
    admin_users?: AnyProperty
    enabled: boolean
    content_types: Array<string>
}

export interface WorkflowStage {
    name: string
    allStages: boolean
    allUsers: boolean
    specificStages: boolean
    specificUsers: boolean
    entry_lock: string
    color?: string
    SYS_ACL?: SystemACL
    next_available_stages?: Array<string>
    
}

export interface SystemACL extends AnyProperty {
    roles?: AnyProperty
    users: AnyProperty
    others: AnyProperty
}
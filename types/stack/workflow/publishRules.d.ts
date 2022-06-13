import { AnyProperty, SystemFields } from "../../utility/fields";
import { Creatable, SystemFunction } from "../../utility/operations";

export interface PublishRule extends SystemFields, SystemFunction<PublishRuls> {
}
    
export interface PublishRules extends Creatable<PublishRule, {publishing_rule: PublishRuleData}> {
    fetchAll(param?: AnyProperty): Promise<ContentstackCollection<PublishRule>>
}

export interface PublishRulesData extends AnyProperty {
    workflow: string
    actions?: Array<any>
    content_types?: Array<string>
    locales?: Array<string>
    environment?: string
    approvers?: AnyProperty
    workflow_stage?: string
    disable_approver_publishing?: boolean
    branches?: Array<string>
}

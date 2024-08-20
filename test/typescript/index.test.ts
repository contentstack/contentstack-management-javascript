import * as Contentstack from '../..';
import {  getUser, login, logout } from "./contentstack.user";
import { organization, organizations } from './organization';
import * as dotenv from 'dotenv'
import { shareStack, stacks, stackTest, unshareStack } from './stack';
import { contentType, createContentType, queryContentType } from './contentType';
import { createEntry, getEntries, importEntry, publishUnpublishEntry, getEntryLocales } from './entry';
import { createAsset, deleteAsset, downloadAsset, getAssets, publishUnpublishAsset, queryOnAsset, replaceAsset } from './asset';
import { createGlobalField, globalField, queryGlobalField } from './globalField';
import { createBranch, deleteBranch, queryBranch } from './branch';
import { createBranchAlias, deleteBranchAlias, queryBranchAlias } from './branchAlias';
import { createLocale, deleteLocale, getLocale } from './locale';
import { createEnvironment, deleteEnvironment, getEnvironment, updateEnvironment } from './environment';
import { createDeliveryToken, deleteDeliveryToken, deliveryToken, queryDeliveryToken } from './deliveryToken';
import { createManagementToken, deleteManagementToken, managementToken, queryManagementToken } from './managementToken';
import { createVariantGroup, deleteVariantGroup, variantGroup, queryVariantGroup } from './variantGroup';
import { createVariant, variant, queryVariant } from './variants';
import { createRole, findAllRole, getRole, getRoleUid, queryRole } from './role';
import { createApp, deleteApp, fetchApp, installation, updateApp, updateAuth } from './app';
import { deployment, hosting } from './hosting';
import { orgAppRequest } from './app-request';
import { authorization } from './authorization';
import { testTaxonomy } from './taxonomy';
import { testTerm } from './terms';
import { testTeams } from './teams';
import { testTeamUsers } from './teamUsers';
import { testTeamStackRoleMapping } from './teamsStackRoleMappings';
import { createVariants, deleteVariants, variants, queryVariants } from './ungroupedVariants';

dotenv.config()
jest.setTimeout(10000);

const client =  Contentstack.client({
    authtoken: process.env.AUTHTOKEN,
    host: process.env.HOST,
})

describe('Typescript API test', () => {
    login(client);
    getUser(client)

    const org =  client.organization(process.env.ORGANIZATION as string)
    
    organizations(client)
    organization(org)

    stacks(client)
    stackTest(client.stack({api_key: process.env.APIKEY as string}))

    createApp(org.app())
    fetchApp(org)
    updateApp(org)
    updateAuth(org)
    installation(org)
    hosting(org.app(process.env.APP_UID as string).hosting())
    deployment(org.app(process.env.APP_UID as string).hosting())
    authorization(org.app(process.env.APP_UID as string).authorization())
    orgAppRequest(org.appRequest())
    deleteApp(org)
    testTeams(org)
    testTeamUsers(org)
    testTeamStackRoleMapping(org)
    
    const stack = client.stack({api_key: process.env.APIKEY as string})

    createBranch(stack)
    queryBranch(stack)
    deleteBranch(stack)

    createBranchAlias(stack)
    queryBranchAlias(stack)
    deleteBranchAlias(stack)

    createLocale(stack)
    getLocale(stack)
    deleteLocale(stack)

    createEnvironment(stack)
    getEnvironment(stack)
    updateEnvironment(stack)

    createDeliveryToken(stack.deliveryToken())
    queryDeliveryToken(stack.deliveryToken())
    deliveryToken(stack)
    deleteDeliveryToken(stack)

    createManagementToken(stack.managementToken())
    queryManagementToken(stack.managementToken())
    managementToken(stack)
    deleteManagementToken(stack)

    createVariants(stack)
    deleteVariants(stack)
    variants(stack.variant)
    queryVariants(stack.variant)
    createVariantGroup(stack.VariantGroup())
    queryVariantGroup(stack.VariantGroup())
    variantGroup(stack)
    deleteVariantGroup(stack)

    createVariant(stack.VariantGroup().Variants())
    queryVariant(stack.VariantGroup().Variants())
    variant(stack.VariantGroup().variants())
    
    findAllRole(stack.role())
    createRole(stack.role())
    getRole(stack)
    queryRole(stack.role())

    shareStack(stack, getRoleUid())
    unshareStack(stack)

    createContentType(stack.contentType())
    queryContentType(stack.contentType())
    contentType(stack)

    createGlobalField(stack.globalField())
    globalField(stack)
    queryGlobalField(stack.globalField())
    
    createEntry(stack)
    getEntries(stack)
    getEntryLocales(stack)
    publishUnpublishEntry(stack)
    importEntry(stack)

    createAsset(stack)
    downloadAsset(stack)
    replaceAsset(stack)
    getAssets(stack)
    publishUnpublishAsset(stack)
    deleteAsset(stack)
    queryOnAsset(stack)

    testTaxonomy(stack)
    testTerm(stack)

    deleteEnvironment(stack)

    logout(client)
})
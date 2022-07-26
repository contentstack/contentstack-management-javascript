import * as Contentstack from '../..';
import {  getUser, login, logout } from "./contentstack.user";
import { organization, organizations } from './organization';
import * as dotenv from 'dotenv'
import { shareStack, stacks, stackTest, unshareStack } from './stack';
import { contentType, createContentType, queryContentType } from './contentType';
import { createEntry, getEntries, importEntry, publishUnpublishEntry } from './entry';
import { createAsset, deleteAsset, downloadAsset, getAssets, publishUnpublishAsset, queryOnAsset, replaceAsset } from './asset';
import { createGlobalField, globalField, queryGlobalField } from './globalField';
import { createBranch, deleteBranch, queryBranch } from './branch';
import { createBranchAlias, deleteBranchAlias, queryBranchAlias } from './branchAlias';
import { createLocale, deleteLocale, getLocale } from './locale';
import { createEnvironment, deleteEnvironment, getEnvironment, updateEnvironment } from './environment';
import { createDeliveryToken, deleteDeliveryToken, deliveryToken, queryDeliveryToken } from './deliveryToken';
import { createRole, findAllRole, getRole, getRoleUid, queryRole } from './role';
dotenv.config()
jest.setTimeout(10000);

const client =  Contentstack.client({
    authtoken: process.env.AUTHTOKEN,
    host: process.env.host,
})

describe('Typescript API test', () => {
    login(client);
    getUser(client)

    organizations(client)
    organization(client.organization(process.env.ORGANIZATION as string))

    stacks(client)
    stackTest(client.stack({api_key: process.env.APIKEY}))

    const stack = client.stack({api_key: process.env.APIKEY})

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
    publishUnpublishEntry(stack)
    importEntry(stack)

    createAsset(stack)
    downloadAsset(stack)
    replaceAsset(stack)
    getAssets(stack)
    publishUnpublishAsset(stack)
    deleteAsset(stack)
    queryOnAsset(stack)

    deleteEnvironment(stack)

    logout(client)
})
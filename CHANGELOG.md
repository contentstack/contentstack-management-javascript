# Changelog


## [v1.20.2](https://github.com/contentstack/contentstack-management-javascript/tree/v1.20.2) (2025-04-21)
 - Fix
    - Handle api_version chaining and ensure backward compatibility

## [v1.20.1](https://github.com/contentstack/contentstack-management-javascript/tree/v1.20.1) (2025-04-07)
 - Fix
    - Ensure 'api' is replaced with 'app' in uiHostName regardless of position

## [v1.20.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.20.0) (2025-04-01)
 - Feature
    - Added OAuth support
    - Added the Unit Test cases and added sanity test case for OAuth
    - Handle retry the requests that were pending due to token expiration
    - Updated Axios Version
  - Enhancement
    - Added stack headers in global fields response
    - Added buffer upload in assets

## [v1.19.5](https://github.com/contentstack/contentstack-management-javascript/tree/v1.19.5) (2025-03-17)
 - Fix
    - Added AuditLog in the stack class
    - Fixed the Unit Test cases and added sanity test case for audit log

## [v1.19.4](https://github.com/contentstack/contentstack-management-javascript/tree/v1.19.4) (2025-03-10)
 - Fix
    - added fix for variants import
    - excludec stackHeaders from entry data assignment

## [v1.19.3](https://github.com/contentstack/contentstack-management-javascript/tree/v1.19.3) (2025-02-24)
 - Fix
    - Added proper assertions for test cases

## [v1.19.2](https://github.com/contentstack/contentstack-management-javascript/tree/v1.19.2) (2025-02-11)
 - Enhancement
    - Added support for nested global fields.
    - Added api_version support for variants

## [v1.19.1](https://github.com/contentstack/contentstack-management-javascript/tree/v1.19.1) (2025-01-27)
 - Feature
   - Added support for get entry references
   - Added delay sanity testcases
   - Axios, webpack, form-data, qs version bump

## [v1.19.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.19.0) (2025-01-13)
 - Feature
   - Release 2.0 feature
## [v1.18.4](https://github.com/contentstack/contentstack-management-javascript/tree/v1.18.4) (2024-11-22)
 - Enhancement
    - Added support for response headers.
## [v1.18.3](https://github.com/contentstack/contentstack-management-javascript/tree/v1.18.3) (2024-11-8)
 - Fix
    - Fixed incorrect input type for bulk delete operation
## [v1.18.2](https://github.com/contentstack/contentstack-management-javascript/tree/v1.18.2) (2024-10-3)
 - Fix
    - Variants testcases Added
    - Node v22 support
## [v1.18.1](https://github.com/contentstack/contentstack-management-javascript/tree/v1.18.1) (2024-09-27)
 - Fix
    - Variants testcases Added
## [v1.18.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.18.0) (2024-09-12)
 - Feature
   - Variants Support Added
## [v1.17.2](https://github.com/contentstack/contentstack-management-javascript/tree/v1.17.2) (2024-08-28)
 - Fix
   - QS version bump
## [v1.17.1](https://github.com/contentstack/contentstack-management-javascript/tree/v1.17.1) (2024-08-23)
 - Fix
   - Axios version bump
## [v1.17.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.17.0) (2024-07-02)
 - Enhancement
   - Fixed package publish issue in github workflow
   - Added Taxonomy permission roles test cases
   - SNYK issues - Upgraded axios and slack/bolt packages version
## [v1.16.2](https://github.com/contentstack/contentstack-management-javascript/tree/v1.16.2) (2024-06-24)
 - Enhancement
   - Added update content type without fetch method
## [v1.16.1](https://github.com/contentstack/contentstack-management-javascript/tree/v1.16.1) (2024-05-08)
 - Fix
   - Fix for `fs` not found issue in web build
## [v1.16.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.16.0) (2024-04-09)
 - Feature
   - Get languages of an entry
## [v1.15.4](https://github.com/contentstack/contentstack-management-javascript/tree/v1.15.4) (2024-03-28)
 - Fixes and Enhancement
   - delete stack implemetation and test cases
   - sanity test and dependency upgrades
## [v1.15.3](https://github.com/contentstack/contentstack-management-javascript/tree/v1.15.3) (2024-02-16)
 - Fix
   - Fix for updating entry
## [v1.15.2](https://github.com/contentstack/contentstack-management-javascript/tree/v1.15.2) (2024-02-09)
 - Fix
   - Adds params support in taxonomy export method
   - Adds sanity test cases
## [v1.15.1](https://github.com/contentstack/contentstack-management-javascript/tree/v1.15.1) (2024-01-29)
 - Feature
   - Taxonomy Import/Export test cases are added
## [v1.15.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.15.0) (2024-01-23)
 - Feature
   - Taxonomy Import/Export feature added
## [v1.14.1](https://github.com/contentstack/contentstack-management-javascript/tree/v1.14.1) (2024-11-23)
 - Fixes
   - Fix for validating the data while updating entries with assets
## [v1.14.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.14.0) (2023-12-19)
 - Feature
   - Management token feature added
## [v1.13.1](https://github.com/contentstack/contentstack-management-javascript/tree/v1.13.1) (2023-12-13)
 - Fixes
   - Fix for issue while updating entries with assets
## [v1.13.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.13.0) (2023-11-21)
 - Feature
   - Teams API support
   - Early Access Header support
## [v1.12.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.12.0) (2023-10-17)
 - Feature
   - Types support for Taxonomy feature
   - Types support for Terms feature
- Fixes
   - Correction in refreshToken error message
## [v1.11.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.11.0) (2023-09-03)
 - Fixes and Enhancements
   - Allows contenttype in asset upload
   - Taxonomy feature addition
   - Terms feature addition
## [v1.10.2](https://github.com/contentstack/contentstack-management-javascript/tree/v1.10.2) (2023-08-23)
 - Fixes and Enhancements
   - RefreshToken error handling
   - Handling workflow response of object format
   - Support for overwrite flag in Contenttype and Global fields import functionality
## [v1.10.1](https://github.com/contentstack/contentstack-management-javascript/tree/v1.10.1) (2023-08-01)
 - Fixes:
   - Token leak
   - Users type
   - ContentstackCollection type
   - Environment param type
 - Enhancements
   - Adds Auditlogs functions
   - Contenttype references function
## [v1.10.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.10.0) (2023-07-21)
 - Fixes
   - Fixes Breaking Changes
## [v1.9.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.9.0) (2023-07-19)
 - Features:
   - NRP support added
   - Audit logs APIs support
   - Contenttype References API support
 - Fixes:
   - Type correction for ContentstackCollection
   - Type correction for BulkOperation
   - Type correction for Environment parameter
## [v1.8.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.8.0) (2023-05-11)
 - Feature
   - Branches Compare and Merge feature added.
## [v1.7.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.7.0) (2023-04-04)
 - Feature
   - Marketplace API support added.
## [v1.6.1](https://github.com/contentstack/contentstack-management-javascript/tree/v1.6.1) (2022-12-09)
 - Bug Fix
  - SSO get stack details Latest

## [v1.6.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.6.0) (2022-10-19)
 - Feature
  - OAuth token refresh function added

## [v1.5.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.5.0) (2022-08-10)
 - Feature
  - App creation, fetch and update
  - App configuration
  - App Installation and getting installation details

## [v1.4.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.4.0) (2022-07-26)
- Bug Fix
 - Delete: Set entry workflow and asset download
 - Asset Download
 - Set Entry workflow stages
 - OAuth token authorisation

## [v1.2.4](https://github.com/contentstack/contentstack-management-javascript/tree/v1.2.4) (2021-07-19)
 - Bug Fix
   - Form data upload timeout on retrying rate limit error issue resolved

## [v1.2.3](https://github.com/contentstack/contentstack-management-javascript/tree/v1.2.3) (2021-06-21)
 - Bug Fix
   - Request Timeout retry support added
## [v1.2.2](https://github.com/contentstack/contentstack-management-javascript/tree/v1.2.2) (2021-05-26)
 - Bug Fix
   - Organization Specific get all Stack: Get Stack for specific organization from org_uid
   - Resolved: Entry Publish and Update not work after find function
   - Resolved: Workflow update issue on fetchAll function
 - Document Update
   - `update` Entry example code update

## [v1.2.1](https://github.com/contentstack/contentstack-management-javascript/tree/v1.2.1) (2021-03-19)
 - Bug Fix
   - User get details: Include organization functions for `is_owner` of the organization

## [v1.2.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.2.0) (2021-03-12)
 - Bug Fix
   - Release Items issue for API key resolved
 - Enhancement 
   - Request concurrency added in SDK
 - New Feature
   - Workflow module support added
## [v1.1.2](https://github.com/contentstack/contentstack-management-javascript/tree/v1.1.2) (2021-01-07)
 - Bug Fix
   - Retry count on multiple request failure
## [v1.1.1](https://github.com/contentstack/contentstack-management-javascript/tree/v1.1.1) (2020-10-23)
 - Bug Fix
   - Stack initialization issue
## [v1.1.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.1.0) (2020-10-23)
 - Bug Fix
   - Owner of organization can access stack function
   
## [v1.0.0](https://github.com/contentstack/contentstack-management-javascript/tree/v1.0.0) (2020-09-23)
 - Initial release for Contentstack CMA base JS management SDK

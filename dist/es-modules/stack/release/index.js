import _regeneratorRuntime from "@babel/runtime/regenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import cloneDeep from 'lodash/cloneDeep';
import { create, fetch, update, deleteEntity, query } from '../../entity';
import error from '../../core/contentstackError';
import { ReleaseItem, ReleaseItemCollection } from './items';
/**
 * @description You can pin a set of entries and assets (along with the deploy action, i.e., publish/unpublish) to a ‘release’, and then deploy this release to an environment.
 * This will publish/unpublish all the the items of the release to the specified environment. Read more about <a href='https://www.contentstack.com/docs/developers/create-releases'>Releases</a>.
 * @namespace Release
 */

export function Release(http) {
  var _this = this;

  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/releases";

  if (data.release) {
    Object.assign(this, cloneDeep(data.release));

    if (data.release.items) {
      this.items = new ReleaseItemCollection(http, data.release, this.uid);
    }

    this.urlPath = "/releases/".concat(this.uid);
    /**
     * @description The Update Release call lets you update the name and description of an existing Release.
     * @memberof Release
     * @func update
     * @returns {Promise<Release.Release>} Promise for Release instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const relase = {
     *     name: "Release Name",
     *     description: "2018-12-12",
     *     locked: false,
     *     archived: false
     * }
     *
     * var release = client.stack({ api_key: 'api_key'}).release('release_uid')
     * Object.assign(release, cloneDeep(release))
     *
     * release.update()
     * .then((release) => {
     *  release.title = 'My New release'
     *  release.description = 'Release description'
     *  return release.update()
     * })
     * .then((release) => console.log(release))
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     *
     * client.stack({ api_key: 'api_key'}).release('release_uid').fetch()
     * .then((release) => {
     *  release.title = 'My New release'
     *  release.description = 'Release description'
     *  return release.update()
     * })
     * .then((release) => console.log(release))
     *
     */

    this.update = update(http, 'release');
    /**
     * @description The fetch Release call fetches Release details.
     * @memberof Release
     * @func fetch
     * @returns {Promise<Release.Release>} Promise for Release instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).release('release_uid').fetch()
     * .then((release) => console.log(release))
     *
     */

    this.fetch = fetch(http, 'release');
    /**
     * @description The Delete Release call is used to delete an existing Release permanently from your Stack.
     * @memberof Release
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).release('release_uid').delete()
     * .then((notice) => console.log(notice))
     */

    this["delete"] = deleteEntity(http);
    /**
     * @description A ReleaseItem is a set of entries and assets that needs to be deployed (published or unpublished) all at once to a particular environment.
     * @memberof Release
     * @func item
     * @returns {ReleaseItem} Instance of ReleaseItem.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).release('release_uid').item().fetchAll()
     * .then((items) => console.log(items))
     */

    this.item = function () {
      return new ReleaseItem(http, {
        releaseUid: _this.uid
      });
    };
    /**
     * @description The Deploy a Release request deploys a specific Release to specific environment(s) and locale(s).
     * @memberof Release
     * @func deploy
     * @returns {Object} Response Object.
     * @param {Array} environments - environment(s) on which the Release should be deployed.
     * @param {Array} locales -  locale(s) on which the Release should be deployed.
     * @param {String} action -  action on which the Release should be deployed.
     * @param {String} scheduledAt - scheudle time for the Release to deploy.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).release('release_uid').deploy({
     *      environments: [
     *                      "production",
     *                      "uat"
     *                      ],
     *      locales: [
     *                  "en-us",
     *                  "ja-jp"
     *               ],
     *      scheduledAt: '2018-12-12T13:13:13:122Z',
     *      action: 'publish',
     *
     * })
     * .then((notice) => console.log(notice))
     */


    this.deploy = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(_ref) {
        var environments, locales, scheduledAt, action, release, headers, response;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                environments = _ref.environments, locales = _ref.locales, scheduledAt = _ref.scheduledAt, action = _ref.action;
                release = {};

                if (environments) {
                  release.environments = environments;
                }

                if (locales) {
                  release.locales = locales;
                }

                if (scheduledAt) {
                  release.scheduled_at = scheduledAt;
                }

                if (action) {
                  release.action = action;
                }

                headers = {
                  headers: _objectSpread({}, cloneDeep(_this.stackHeaders))
                } || {};
                _context.prev = 7;
                _context.next = 10;
                return http.post("".concat(_this.urlPath, "/deploy"), {
                  release: release
                }, headers);

              case 10:
                response = _context.sent;

                if (!response.data) {
                  _context.next = 15;
                  break;
                }

                return _context.abrupt("return", response.data);

              case 15:
                throw error(response);

              case 16:
                _context.next = 21;
                break;

              case 18:
                _context.prev = 18;
                _context.t0 = _context["catch"](7);
                throw error(_context.t0);

              case 21:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[7, 18]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }();
    /**
     * @description The Clone a Release request allows you to clone (make a copy of) a specific Release in a stack.
     * @memberof Release
     * @func fetch
     * @returns {Promise<Release.Release>} Promise for Release instance
     * @param {String} name - name of the cloned Release.
     * @param {String} description - description of the cloned Release.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).release('release_uid').clone({ name: 'New Name', description: 'New Description'})
     * .then((release) => console.log(release))
     *
     */


    this.clone = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(_ref3) {
        var name, description, release, headers, response;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                name = _ref3.name, description = _ref3.description;
                release = {};

                if (name) {
                  release.name = name;
                }

                if (description) {
                  release.description = description;
                }

                headers = {
                  headers: _objectSpread({}, cloneDeep(_this.stackHeaders))
                } || {};
                _context2.prev = 5;
                _context2.next = 8;
                return http.post("".concat(_this.urlPath, "/clone"), {
                  release: release
                }, headers);

              case 8:
                response = _context2.sent;

                if (!response.data) {
                  _context2.next = 13;
                  break;
                }

                return _context2.abrupt("return", new Release(http, response.data));

              case 13:
                throw error(response);

              case 14:
                _context2.next = 19;
                break;

              case 16:
                _context2.prev = 16;
                _context2.t0 = _context2["catch"](5);
                throw error(_context2.t0);

              case 19:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[5, 16]]);
      }));

      return function (_x2) {
        return _ref4.apply(this, arguments);
      };
    }();
  } else {
    /**
     * @description The Create a Release request allows you to create a new Release in your stack. To add entries/assets to a Release, you need to provide the UIDs of the entries/assets in ‘items’ in the request body.
     * @memberof Release
     * @func create
     * @param {Object} param.release Release details.
     * @returns {Promise<Release.Release>} Promise for Release instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const release = {
     *        name: "Release Name",
     *        description: "2018-12-12",
     *        locked: false,
     *        archived: false
     * }
     * client.stack({ api_key: 'api_key'}).release().create({ release })
     * .then((release) => console.log(release))
     */
    this.create = create({
      http: http
    });
    /**
     * @description The Query on release will allow to fetch details of all or specific Releases.
     * @memberof Release
     * @func query
     * @param {Boolean} param.include_countThe ‘include_count’ parameter includes the count of total number of releases in your stack, along with the details of each release.
     * @param {Boolean} param.include_items_count The ‘include_items_count’ parameter returns the total number of items in a specific release.
     * @param {Int} param.limit The ‘limit’ parameter will return a specific number of releases in the output.
     * @param {Int} param.skip The ‘skip’ parameter will skip a specific number of releases in the response.
     * @returns {Array<Release>} Array of Release.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).release().query().find()
     * .then((release) => console.log(release))
     */

    this.query = query({
      http: http,
      wrapperCollection: ReleaseCollection
    });
  }

  return this;
}
export function ReleaseCollection(http, data) {
  var obj = cloneDeep(data.releases);
  var releaseCollection = obj.map(function (userdata) {
    return new Release(http, {
      release: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return releaseCollection;
}